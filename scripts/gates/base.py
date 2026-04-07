"""Shared base types, assertion helpers, and remediation contracts for phase gates."""
from __future__ import annotations

import glob
import importlib.util
import os
import re
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Remediation:
    """Actionable recovery info attached to every failing check.

    A weak agent should be able to read this and know exactly what to do
    next without guessing — which file to create, which template to use,
    which fields are required, and what command to run after fixing.
    """
    action: str                              # "create" | "edit" | "copy" | "run"
    target: str                              # file path to create/edit, or command
    template: str = ""                       # path to reference template file
    required_fields: List[str] = field(default_factory=list)
    rerun_cmd: str = ""                      # command to run after fixing
    notes: str = ""                          # plain-English guidance


@dataclass
class Check:
    name: str
    passed: bool
    message: str = ""
    remediation: Optional[Remediation] = None


@dataclass
class GateReport:
    phase: int
    name: str
    checks: List[Check] = field(default_factory=list)

    @property
    def passed(self) -> bool:
        return bool(self.checks) and all(c.passed for c in self.checks)

    def next_actions(self) -> List[Remediation]:
        """Return remediations for all failed checks that carry one."""
        return [c.remediation for c in self.checks if not c.passed and c.remediation]

    # ── record helpers ────────────────────────────────────────────────────────

    def ok(self, name: str, msg: str = "ok",
           remediation: Optional[Remediation] = None) -> None:
        self.checks.append(Check(name, True, msg, remediation))

    def fail(self, name: str, msg: str,
             remediation: Optional[Remediation] = None) -> None:
        self.checks.append(Check(name, False, msg, remediation))

    # ── assertion helpers ─────────────────────────────────────────────────────

    def assert_file(self, path: str, label: Optional[str] = None,
                    remediation: Optional[Remediation] = None) -> bool:
        label = label or path
        if os.path.isfile(path):
            self.ok(label, "found")
            return True
        self.fail(label, f"missing file: {path}", remediation)
        return False

    def assert_dir(self, path: str, label: Optional[str] = None,
                   remediation: Optional[Remediation] = None) -> bool:
        label = label or path
        if os.path.isdir(path):
            self.ok(label, "found")
            return True
        self.fail(label, f"missing directory: {path}", remediation)
        return False

    def assert_glob_min(self, pattern: str, min_count: int,
                        label: Optional[str] = None,
                        remediation: Optional[Remediation] = None) -> bool:
        label = label or f"{pattern} (>={min_count})"
        matches = glob.glob(pattern, recursive=True)
        if len(matches) >= min_count:
            self.ok(label, f"{len(matches)} found")
            return True
        self.fail(label, f"found {len(matches)}, need >={min_count}", remediation)
        return False

    def assert_no_grep(self, regex: str, path_glob: str,
                       label: Optional[str] = None,
                       remediation: Optional[Remediation] = None) -> bool:
        label = label or f"no /{regex}/ in {path_glob}"
        files = glob.glob(path_glob, recursive=True)
        hits: List[str] = []
        for f in files:
            try:
                with open(f, encoding="utf-8", errors="ignore") as fh:
                    for i, line in enumerate(fh, 1):
                        if re.search(regex, line):
                            hits.append(f"{f}:{i}")
                            if len(hits) >= 5:
                                break
            except OSError:
                pass
            if len(hits) >= 5:
                break
        if not hits:
            self.ok(label, "clean")
            return True
        self.fail(label, f"violations: {hits}", remediation)
        return False

    def assert_file_contains(self, path: str, pattern: str,
                              label: Optional[str] = None,
                              remediation: Optional[Remediation] = None) -> bool:
        label = label or f"{path} contains /{pattern}/"
        if not os.path.isfile(path):
            self.fail(label, f"file not found: {path}", remediation)
            return False
        try:
            with open(path, encoding="utf-8", errors="ignore") as fh:
                content = fh.read()
            if re.search(pattern, content):
                self.ok(label, "found")
                return True
            self.fail(label, f"pattern not found in {path}", remediation)
            return False
        except OSError as e:
            self.fail(label, str(e), remediation)
            return False


def load_manifest_validator():
    """Dynamically import validate_adapter_manifest.py as a module."""
    here = os.path.dirname(__file__)
    spec_path = os.path.normpath(os.path.join(here, "..", "validate_adapter_manifest.py"))
    spec = importlib.util.spec_from_file_location("validate_adapter_manifest", spec_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod
