"""Phase-gate harness runner.

Usage:
  python world-model/scripts/run_harness.py                     # all phases 0-8
  python world-model/scripts/run_harness.py --phase 2           # phases 0 → 2 (strict)
  python world-model/scripts/run_harness.py --only 2            # phase 2 only (no ordering)
  python world-model/scripts/run_harness.py --bootstrap         # scaffold stubs, then all phases
  python world-model/scripts/run_harness.py --bootstrap --phase 2  # scaffold then phases 0-2
  python world-model/scripts/run_harness.py --phase 8 --cleanup --cleanup-scope safe
  python world-model/scripts/run_harness.py --cleanup-only

Exit codes:
  0    all requested phases passed
  1    argument error
  N+10 phase N failed  (phase 0 → exit 10, phase 2 → exit 12, …)
"""
from __future__ import annotations
import argparse
import os
import sys
from pathlib import Path

_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from cleanup_runtime import (  # noqa: E402
    build_run_root,
    cleanup_phase_outputs,
    normalize_cleanup_scope,
    register_artifact,
    resolve_scratch_root,
    runtime_env,
    should_preserve_report,
    world_model_root,
)
from gates import (  # noqa: E402
    phase_0_gate, phase_1_gate, phase_2_gate,
    phase_3_gate, phase_4_gate, phase_5_gate, phase_6_gate, phase_7_gate, phase_8_gate,
)
from gates.base import GateReport  # noqa: E402
from gates.scaffold import run_bootstrap  # noqa: E402
from gates import checklist as _checklist  # noqa: E402

ALL_GATES = [
    phase_0_gate, phase_1_gate, phase_2_gate,
    phase_3_gate, phase_4_gate, phase_5_gate, phase_6_gate, phase_7_gate,
    phase_8_gate,
]

WIDTH = 72
_BAR = "=" * WIDTH
_DOUBLE = "═" * WIDTH
_CHECKLIST_PATH = world_model_root() / "phase-checklist.json"


def _print_report(report: GateReport) -> None:
    status = "PASS" if report.passed else "FAIL"
    print(f"\n{_BAR}")
    print(f"  Phase {report.phase}: {report.name}  [{status}]")
    print(_BAR)
    for check in report.checks:
        mark = "  OK " if check.passed else " FAIL"
        print(f"  [{mark}] {check.name}")
        if check.message and check.message not in ("ok", "found", "clean"):
            print(f"          {check.message}")
    print()


def _print_next_actions(report: GateReport) -> None:
    """Print a guided remediation block for every failing check that has one."""
    actions = report.next_actions()
    if not actions:
        return
    rerun = f"python world-model/scripts/run_harness.py --phase {report.phase}"
    print(_DOUBLE)
    print(f"  NEXT ACTIONS  (Phase {report.phase} — {report.name})")
    print(_DOUBLE)
    for i, rem in enumerate(actions, 1):
        print(f"\n  ❯ [{i}] {rem.action.upper()}  {rem.target}")
        if rem.template:
            print(f"       Template        : {rem.template}")
        if rem.required_fields:
            print(f"       Required fields : {', '.join(rem.required_fields)}")
        if rem.notes:
            print(f"       Notes           : {rem.notes}")
    print(f"\n  Rerun: {rerun}")
    print(_DOUBLE + "\n")


def run_gates(gates: list, stop_on_fail: bool = True) -> tuple:
    """Run gate modules in order.  Returns (exit_code, completed_reports)."""
    reports = []
    for gate in gates:
        report = gate.run()
        reports.append(report)
        _print_report(report)
        if not report.passed:
            _print_next_actions(report)
            if stop_on_fail:
                print(f"  BOUNDARY VIOLATION: Phase {report.phase} ({report.name}) did not pass.")
                print(f"  Phase {report.phase + 1} and beyond is BLOCKED until this passes.\n")
                return gate.PHASE + 10, reports
    return 0, reports


def _report_retention_mode(args: argparse.Namespace) -> str:
    if args.delete_success_reports:
        return "delete-success"
    if args.keep_failure_reports_only:
        return "keep-failure-only"
    return "keep"


def _print_cleanup_summary(summary: dict) -> None:
    if not summary.get("requested"):
        return
    print(_DOUBLE)
    print("  CLEANUP SUMMARY")
    print(_DOUBLE)
    print(f"  Scope            : {summary['cleanup_scope']}")
    print(f"  Report retention : {summary['report_retention']}")
    print(f"  Scratch root     : {summary['scratch_root']}")
    print(f"  Deleted          : {len(summary.get('deleted', []))}")
    print(f"  Preserved        : {len(summary.get('preserved', []))}")
    print(f"  Failures         : {len(summary.get('failed', []))}")
    if summary.get("failed"):
        first = summary["failed"][0]
        print(f"  First failure    : {first['path']} -> {first['error']}")
    print(_DOUBLE + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="run_harness",
        description="World-model phase-gate harness",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--bootstrap", action="store_true",
        help="Create missing stubs before running gates",
    )
    parser.add_argument("--cleanup", action="store_true", help="Auto-clean harness-owned ephemeral outputs after the run")
    parser.add_argument(
        "--cleanup-scope",
        default="safe",
        choices=["safe", "balanced", "aggressive"],
        help="Cleanup policy for harness-owned outputs (default: safe)",
    )
    parser.add_argument("--cleanup-only", action="store_true", help="Remove harness-owned ephemeral outputs without running any phases")
    parser.add_argument("--scratch-root", help="Override the harness scratch root")
    retention = parser.add_mutually_exclusive_group()
    retention.add_argument("--keep-reports", action="store_true", help="Keep durable phase reports after the run")
    retention.add_argument("--delete-success-reports", action="store_true", help="Delete durable phase reports after a successful run")
    retention.add_argument("--keep-failure-reports-only", action="store_true", help="Keep durable phase reports only when the run fails")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--phase", type=int, metavar="N",
                       help="Run phases 0 through N (strict ordering)")
    group.add_argument("--only", type=int, metavar="N",
                       help="Run only phase N (no ordering enforcement)")
    args = parser.parse_args()

    if args.cleanup_only and (args.phase is not None or args.only is not None or args.bootstrap):
        print("error: --cleanup-only cannot be combined with --phase, --only, or --bootstrap", file=sys.stderr)
        return 1

    cleanup_summary = {"requested": False}
    cleanup_scope = normalize_cleanup_scope(args.cleanup_scope)
    report_retention = _report_retention_mode(args)
    scratch_root = resolve_scratch_root(args.scratch_root)

    if args.cleanup_only:
        cleanup_summary = cleanup_phase_outputs(
            scratch_root=scratch_root,
            scope=cleanup_scope,
            report_retention=report_retention,
            run_succeeded=True,
            current_run_root=None,
        )
        _print_cleanup_summary(cleanup_summary)
        return 0 if not cleanup_summary["failed"] else 1

    run_root: Path | None = None
    old_env: dict[str, str | None] = {}
    if args.cleanup or args.scratch_root:
        run_root = build_run_root(scratch_root)
        run_root.mkdir(parents=True, exist_ok=True)
        for key, value in runtime_env(scratch_root, run_root).items():
            old_env[key] = os.environ.get(key)
            os.environ[key] = value
        register_artifact(
            run_root,
            phase="harness",
            kind="quarantine",
            created_by="run_harness",
            preserve_on_success=False,
            preserve_on_failure=True,
        )

    code = 1
    reports: list[GateReport] = []
    try:
        if args.only is not None:
            if not (0 <= args.only <= 8):
                print(f"error: phase must be 0-8, got {args.only}", file=sys.stderr)
                return 1
            if args.bootstrap:
                run_bootstrap(args.only)
            gates = [ALL_GATES[args.only]]
            print(f"Running Phase {args.only} gate only (ordering not enforced)\n")
            code, reports = run_gates(gates, stop_on_fail=False)
        elif args.phase is not None:
            if not (0 <= args.phase <= 8):
                print(f"error: phase must be 0-8, got {args.phase}", file=sys.stderr)
                return 1
            if args.bootstrap:
                run_bootstrap(args.phase)
            gates = ALL_GATES[: args.phase + 1]
            print(f"Running gates for phases 0 → {args.phase} (strict ordering)\n")
            code, reports = run_gates(gates)
        else:
            if args.bootstrap:
                run_bootstrap(8)
            gates = ALL_GATES
            print("Running all phase gates (strict ordering: 0 → 8)\n")
            code, reports = run_gates(gates)
    finally:
        if args.cleanup:
            cleanup_summary = cleanup_phase_outputs(
                scratch_root=scratch_root,
                scope=cleanup_scope,
                report_retention=report_retention,
                run_succeeded=(code == 0),
                current_run_root=run_root,
            )
            _print_cleanup_summary(cleanup_summary)
        for key, value in old_env.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value

    _checklist.save(reports, cleanup_summary=cleanup_summary)
    if args.cleanup and not should_preserve_report(report_retention, code == 0) and _CHECKLIST_PATH.exists():
        _CHECKLIST_PATH.unlink()
        cleanup_summary.setdefault("deleted", []).append(_CHECKLIST_PATH.as_posix())
    _checklist.print_summary(reports)
    return code


if __name__ == "__main__":
    sys.exit(main())
