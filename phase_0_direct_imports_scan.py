#!/usr/bin/env python3
"""Scan Phase 0 scope for donor runtime import patterns and write results.

Default mode scans the deliverable surface only:
  - world-model/
  - approved adapter snapshots under world-model/adapters/*/source-snapshot/
  - vendored code under world-model/vendor/

Optional donor-audit mode scans the frozen donor roots as a separate report:
  - mythforge/
  - mechanical-sycophant/
  - to be merged/

Writes:
  - world-model/phase-0-direct-imports.json (deliverable mode)
  - world-model/phase-0-direct-imports-audit.json (donor-audit mode)

Appends a short summary to world-model/phase-0-harness.log if present.
"""
from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Iterable, List

SCOPE_FILE = "world-model/phase-0-scan-scope.json"
DELIVERABLE_OUT = "world-model/phase-0-direct-imports.json"
AUDIT_OUT = "world-model/phase-0-direct-imports-audit.json"
LOG_PATH = "world-model/phase-0-harness.log"

DEFAULT_SCOPE = {
    "deliverable_root": "world-model",
    "approved_snapshot_roots": [
        "world-model/adapters/orbis/source-snapshot",
        "world-model/adapters/adventure-generator/source-snapshot",
        "world-model/adapters/mythforge/source-snapshot",
        "world-model/vendor",
    ],
    "frozen_donor_roots": [
        "mythforge",
        "mechanical-sycophant",
        "to be merged",
    ],
}

PATTERNS = [
    re.compile(r"import\s+.*\s+from\s+['\"][^'\"]*(?:mechanical-sycophant|Orbis|adventure-generator|to be merged|antigravity)[^'\"]*['\"]", re.I),
    re.compile(r"require\(['\"][^'\"]*(?:mechanical-sycophant|Orbis|adventure-generator|to be merged|antigravity)[^'\"]*['\"]\)", re.I),
    re.compile(r"use\s+[A-Za-z0-9_:]+::"),
]

SKIP_DIRNAMES = {".git", "node_modules", ".venv", "dist", "build", ".next", "target", "__pycache__", "phase-0-backups"}
EXCLUDE_REL = {
    "world-model/phase-0-direct-imports.json",
    "world-model/phase-0-direct-imports-audit.json",
    "world-model/phase-0-direct-imports-workspace.json",
    "world-model/phase-0-harness.log",
    "world-model/phase-0-inventory.temp.json",
    "world-model/phase-0-inventory.json",
    "world-model/phase-0-harness-report.json",
    "world-model/phase-0-dryrun-analysis.json",
    "world-model/phase-0-mechanical-plan.json",
    "world-model/phase-0-finish-report.json",
    "world-model/phase-0-finish.log",
    "world-model/phase-0-batch-apply-report.json",
    "world-model/phase-0-top20-apply-report.json",
    "world-model/phase-0-top20-remediation-report.json",
    "world-model/phase-0-harness-triage-summary.md",
    "world-model/phase-0-scan-scope.json",
    "world-model/phase-0-direct-imports-triage.json",
    "world-model/phase_0_direct_imports_scan.py",
}


def repo_root() -> Path:
    cwd = Path(os.getcwd()).resolve()
    if (cwd / "world-model").is_dir():
        return cwd
    if cwd.name == "world-model":
        return cwd.parent
    return cwd


def load_scope(root: Path) -> dict:
    path = root / SCOPE_FILE
    if path.is_file():
        try:
            with path.open("r", encoding="utf-8") as fh:
                data = json.load(fh)
                if isinstance(data, dict):
                    merged = dict(DEFAULT_SCOPE)
                    merged.update(data)
                    return merged
        except Exception:
            pass
    return dict(DEFAULT_SCOPE)


def normalize_rel(path: Path, root: Path) -> str:
    try:
        return path.relative_to(root).as_posix()
    except Exception:
        return path.as_posix()


def iter_scan_roots(root: Path, scope: dict, mode: str) -> List[Path]:
    if mode == "deliverable":
        deliverable = scope.get("deliverable_root") or "world-model"
        return [root / str(deliverable)]
    if mode == "donor-audit":
        return [root / str(p) for p in scope.get("frozen_donor_roots", [])]
    if mode == "workspace":
        return [root]
    raise ValueError(f"unknown scan mode: {mode}")


def should_skip_dir(dirpath: Path) -> bool:
    return any(part in SKIP_DIRNAMES for part in dirpath.parts)


def scan_paths(scan_roots: Iterable[Path], root: Path) -> List[dict]:
    matches: List[dict] = []
    for scan_root in scan_roots:
        if not scan_root.exists():
            continue
        for dirpath, dirnames, filenames in os.walk(scan_root):
            dirpath_p = Path(dirpath)
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRNAMES]
            if should_skip_dir(dirpath_p):
                continue
            for fname in filenames:
                if ".bak." in fname or fname.endswith(".bak"):
                    continue
                path = dirpath_p / fname
                rel = normalize_rel(path, root)
                if rel in EXCLUDE_REL:
                    continue
                try:
                    with path.open("r", encoding="utf-8", errors="ignore") as fh:
                        for i, line in enumerate(fh, 1):
                            for rx in PATTERNS:
                                if rx.search(line):
                                    matches.append({"path": rel, "line": i, "text": line.rstrip("\n")})
                                    raise StopIteration
                except StopIteration:
                    continue
                except OSError:
                    continue
    return matches


def main() -> int:
    parser = argparse.ArgumentParser(description="Phase-0 direct-import scan")
    parser.add_argument(
        "--mode",
        choices=("deliverable", "donor-audit", "workspace"),
        default="deliverable",
        help="Scan deliverable scope (default), frozen donor roots, or the full workspace.",
    )
    args = parser.parse_args()

    root = repo_root()
    scope = load_scope(root)
    scan_roots = iter_scan_roots(root, scope, args.mode)
    matches = scan_paths(scan_roots, root)

    if args.mode == "donor-audit":
        out_path = root / AUDIT_OUT
    elif args.mode == "workspace":
        out_path = root / "world-model/phase-0-direct-imports-workspace.json"
    else:
        out_path = root / DELIVERABLE_OUT

    result = {
        "mode": args.mode,
        "scan_roots": [str(p) for p in scan_roots],
        "deliverable_root": scope.get("deliverable_root", "world-model"),
        "frozen_donor_roots": scope.get("frozen_donor_roots", []),
        "count": len(matches),
        "file": str(out_path).replace("\\", "/"),
        "matches": matches,
    }

    try:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with out_path.open("w", encoding="utf-8") as out:
            json.dump(matches, out, indent=2)
    except OSError:
        print(f"ERROR: could not write {out_path}", flush=True)
        return 1

    try:
        with (root / LOG_PATH).open("a", encoding="utf-8") as logf:
            logf.write(
                f"\nDirect-import scan ({args.mode}): {len(matches)} matches written to {result['file']}\n"
            )
            if matches:
                logf.write("Top matches (up to 10):\n")
                for m in matches[:10]:
                    snippet = m["text"][:200].replace("\n", "\\n")
                    logf.write(f" - {m['path']}:{m['line']} -> {snippet}\n")
    except OSError:
        pass

    print(json.dumps(result))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
