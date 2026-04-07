"""Standalone Phase 1 contract verification script.

Usage:
  python world-model/scripts/check_phase_1_contracts.py
  python world-model/scripts/check_phase_1_contracts.py --baseline-output world-model/docs/roadmap/phase-1/PHASE_1_BASELINE_REPORT.md
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

_HERE = Path(__file__).resolve().parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))

from gates.phase_1_contracts import (  # noqa: E402
    check_phase_1_semantics,
    write_baseline_report,
)


def main() -> int:
    parser = argparse.ArgumentParser(description="Phase 1 contract verification")
    parser.add_argument(
        "--baseline-output",
        help="Write the current Phase 1 baseline report to this path and exit",
    )
    args = parser.parse_args()

    if args.baseline_output:
        write_baseline_report(Path(args.baseline_output))
        print(f"wrote baseline report to {args.baseline_output}")
        return 0

    checks = check_phase_1_semantics()
    failed = [check for check in checks if not check.passed]
    for check in checks:
        status = "PASS" if check.passed else "FAIL"
        print(f"[{status}] {check.name}")
        print(f"        {check.message}")
    if failed:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
