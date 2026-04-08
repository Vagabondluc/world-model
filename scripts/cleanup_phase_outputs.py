from __future__ import annotations

import argparse
import json

from cleanup_runtime import cleanup_phase_outputs, normalize_cleanup_scope, normalize_report_retention, resolve_scratch_root


def main() -> int:
    parser = argparse.ArgumentParser(description="Cleanup harness-owned phase outputs")
    parser.add_argument("--cleanup-scope", default="safe", choices=sorted({"safe", "balanced", "aggressive"}))
    parser.add_argument("--scratch-root", help="Override the harness scratch root")
    retention = parser.add_mutually_exclusive_group()
    retention.add_argument("--keep-reports", action="store_true", help="Keep durable repo-root phase reports")
    retention.add_argument("--delete-success-reports", action="store_true", help="Delete durable reports after a successful cleanup")
    retention.add_argument("--keep-failure-reports-only", action="store_true", help="Keep durable reports only when the previous run failed")
    parser.add_argument(
        "--failed-run",
        action="store_true",
        help="Treat the cleanup target as a failed run so failure-preserved artifacts remain",
    )
    args = parser.parse_args()

    report_retention = "keep"
    if args.delete_success_reports:
        report_retention = "delete-success"
    elif args.keep_failure_reports_only:
        report_retention = "keep-failure-only"

    report = cleanup_phase_outputs(
        scratch_root=resolve_scratch_root(args.scratch_root),
        scope=normalize_cleanup_scope(args.cleanup_scope),
        report_retention=normalize_report_retention(report_retention),
        run_succeeded=not args.failed_run,
        current_run_root=None,
    )
    print(json.dumps(report, indent=2))
    return 0 if not report["failed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
