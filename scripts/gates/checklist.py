"""Checklist persistence — reads/writes world-model/phase-checklist.json.

The checklist lets a weak agent resume from the correct phase without
re-running earlier passed phases. It also stores the last set of
next-actions so the agent can re-read them without re-running.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from typing import List

from .base import GateReport

CHECKLIST_PATH = os.path.join("world-model", "phase-checklist.json")


def _check_to_dict(c) -> dict:
    d = {"name": c.name, "passed": c.passed, "message": c.message}
    if c.remediation:
        d["remediation"] = {
            "action": c.remediation.action,
            "target": c.remediation.target,
            "template": c.remediation.template,
            "required_fields": c.remediation.required_fields,
            "rerun_cmd": c.remediation.rerun_cmd,
            "notes": c.remediation.notes,
        }
    return d


def save(reports: List[GateReport]) -> None:
    """Persist gate reports to CHECKLIST_PATH."""
    data: dict = {
        "last_run": datetime.now(timezone.utc).isoformat(),
        "phases": {},
    }
    for r in reports:
        failures = [c for c in r.checks if not c.passed]
        data["phases"][str(r.phase)] = {
            "phase": r.phase,
            "name": r.name,
            "status": "pass" if r.passed else "fail",
            "total_checks": len(r.checks),
            "passed_checks": sum(1 for c in r.checks if c.passed),
            "failed_checks": len(failures),
            "failures": [_check_to_dict(c) for c in failures],
            "next_actions": [
                {"action": c.remediation.action,
                 "target": c.remediation.target,
                 "rerun_cmd": c.remediation.rerun_cmd,
                 "notes": c.remediation.notes}
                for c in failures if c.remediation
            ],
        }
    os.makedirs(os.path.dirname(os.path.abspath(CHECKLIST_PATH)), exist_ok=True)
    with open(CHECKLIST_PATH, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2)


def print_summary(reports: List[GateReport]) -> None:
    """Print a concise per-phase checklist table."""
    bar = "─" * 62
    print(f"\n{bar}")
    print("  PHASE CHECKLIST")
    print(bar)
    for r in reports:
        icon = "✓" if r.passed else "✗"
        n_fail = sum(1 for c in r.checks if not c.passed)
        suffix = "" if r.passed else f"  ({n_fail}/{len(r.checks)} checks failed)"
        print(f"  [{icon}] Phase {r.phase}: {r.name}{suffix}")
    print(f"{bar}\n  Checklist saved → {CHECKLIST_PATH}\n{bar}\n")
