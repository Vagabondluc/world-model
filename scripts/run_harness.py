"""Phase-gate harness runner.

Usage:
  python world-model/scripts/run_harness.py                     # all phases 0-6
  python world-model/scripts/run_harness.py --phase 2           # phases 0 → 2 (strict)
  python world-model/scripts/run_harness.py --only 2            # phase 2 only (no ordering)
  python world-model/scripts/run_harness.py --bootstrap         # scaffold stubs, then all phases
  python world-model/scripts/run_harness.py --bootstrap --phase 2  # scaffold then phases 0-2

Exit codes:
  0    all requested phases passed
  1    argument error
  N+10 phase N failed  (phase 0 → exit 10, phase 2 → exit 12, …)
"""
from __future__ import annotations
import argparse
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from gates import (  # noqa: E402
    phase_0_gate, phase_1_gate, phase_2_gate,
    phase_3_gate, phase_4_gate, phase_5_gate, phase_6_gate,
)
from gates.base import GateReport  # noqa: E402
from gates.scaffold import run_bootstrap  # noqa: E402
from gates import checklist as _checklist  # noqa: E402

ALL_GATES = [
    phase_0_gate, phase_1_gate, phase_2_gate,
    phase_3_gate, phase_4_gate, phase_5_gate, phase_6_gate,
]

WIDTH = 72
_BAR = "=" * WIDTH
_DOUBLE = "═" * WIDTH


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
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--phase", type=int, metavar="N",
                       help="Run phases 0 through N (strict ordering)")
    group.add_argument("--only", type=int, metavar="N",
                       help="Run only phase N (no ordering enforcement)")
    args = parser.parse_args()

    if args.only is not None:
        if not (0 <= args.only <= 6):
            print(f"error: phase must be 0-6, got {args.only}", file=sys.stderr)
            return 1
        if args.bootstrap:
            run_bootstrap(args.only)
        gates = [ALL_GATES[args.only]]
        print(f"Running Phase {args.only} gate only (ordering not enforced)\n")
        code, reports = run_gates(gates, stop_on_fail=False)
    elif args.phase is not None:
        if not (0 <= args.phase <= 6):
            print(f"error: phase must be 0-6, got {args.phase}", file=sys.stderr)
            return 1
        if args.bootstrap:
            run_bootstrap(args.phase)
        gates = ALL_GATES[: args.phase + 1]
        print(f"Running gates for phases 0 → {args.phase} (strict ordering)\n")
        code, reports = run_gates(gates)
    else:
        if args.bootstrap:
            run_bootstrap(6)
        gates = ALL_GATES
        print("Running all phase gates (strict ordering: 0 → 6)\n")
        code, reports = run_gates(gates)

    _checklist.save(reports)
    _checklist.print_summary(reports)
    return code


if __name__ == "__main__":
    sys.exit(main())
