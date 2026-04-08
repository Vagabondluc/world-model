"""Phase 3 gate: Final App Scaffold.

Checks that the executable app scaffold exists under world-model/apps/unified-app,
that the canonical bridge is documented, and that the app-level checks pass.
"""
from __future__ import annotations

import subprocess
import shutil
from pathlib import Path

from .base import GateReport, Remediation

PHASE = 3
NAME = "Final App Scaffold"
WM = "world-model"
APP = Path(WM) / "apps" / "unified-app"
_RERUN3 = f"python {WM}/scripts/run_harness.py --phase 3"
_ARCH = f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md"
_LAYOUT = f"{WM}/docs/architecture/REPOSITORY_LAYOUT.md"
_CHECKS = f"{WM}/docs/harness_checks.md"
_README = f"{APP}/README.md"


def _run_app_cmd(command: list[str]) -> tuple[bool, str]:
    resolved = command[:]
    if resolved and resolved[0] == "npm":
        npm = shutil.which("npm") or shutil.which("npm.cmd") or "npm.cmd"
        resolved[0] = npm
    proc = subprocess.run(
        resolved,
        cwd=APP,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    output = "\n".join(part for part in ((proc.stdout or "").strip(), (proc.stderr or "").strip()) if part).strip()
    return proc.returncode == 0, output or "ok"


def _assert_command(report: GateReport, name: str, command: list[str], rerun_cmd: str) -> None:
    ok, msg = _run_app_cmd(command)
    if ok:
        report.ok(name, msg)
        return
    report.fail(
        name,
        msg,
        remediation=Remediation(
            action="run",
            target=" ".join(command),
            rerun_cmd=rerun_cmd,
            notes="Fix the app scaffold error reported by the command output, then rerun the harness.",
        ),
    )


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # 3.1 App workspace scaffold exists.
    r.assert_dir(
        f"{WM}/apps/unified-app",
        "3.1 app root exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/apps/unified-app",
            rerun_cmd=_RERUN3,
            notes="Create the executable app scaffold under world-model/apps/unified-app.",
        ),
    )
    for path in (
        f"{APP}/package.json",
        f"{APP}/index.html",
        f"{APP}/tsconfig.json",
        f"{APP}/tsconfig.node.json",
        f"{APP}/vite.config.ts",
        f"{APP}/README.md",
        f"{APP}/src/App.tsx",
        f"{APP}/src/main.tsx",
        f"{APP}/src/routes/AppRoutes.tsx",
        f"{APP}/src/shell/AppShell.tsx",
        f"{APP}/src/shell/Navigation.tsx",
        f"{APP}/src/shell/ContextBar.tsx",
        f"{APP}/src/shell/Inspector.tsx",
        f"{APP}/src/shell/BottomDrawer.tsx",
        f"{APP}/src/modes/guided/GuidedMode.tsx",
        f"{APP}/src/modes/studio/StudioMode.tsx",
        f"{APP}/src/modes/architect/ArchitectMode.tsx",
        f"{APP}/src/state/app-store.tsx",
        f"{APP}/src/services/canonical-bundle.ts",
        f"{APP}/src/services/canonical-fixtures.ts",
        f"{APP}/scripts/check-donor-imports.mjs",
        f"{APP}/tests/setup.ts",
        f"{APP}/tests/app-shell.test.tsx",
        f"{APP}/tests/canonical-bundle.test.ts",
        f"{APP}/tests/import-guard.test.ts",
    ):
        r.assert_file(path, f"3.1 scaffold file exists: {path}")

    # 3.2 Canonical state bridge is documented.
    r.assert_file_contains(
        _ARCH,
        r"canonical.*(bundle|state|bridge)|state.*(bridge|canonical)",
        "3.2 canonical state bridge referenced in architecture doc",
        remediation=Remediation(
            action="edit",
            target=_ARCH,
            required_fields=["canonical state bridge"],
            rerun_cmd=_RERUN3,
            notes="Document the load/save bridge that hydrates canonical bundles and keeps overlays local.",
        ),
    )
    r.assert_file_contains(
        _ARCH,
        r"apps/unified-app|world-model/apps/unified-app",
        "3.2 app path declared in architecture doc",
        remediation=Remediation(
            action="edit",
            target=_ARCH,
            required_fields=["apps/unified-app"],
            rerun_cmd=_RERUN3,
        ),
    )

    # 3.3-3.5 Modes and shell panels are declared in architecture docs.
    for mode in ("Guided", "Studio", "Architect"):
        r.assert_file_contains(
            _ARCH,
            mode,
            f"3.x mode `{mode}` declared in architecture doc",
        )

    for panel in ("left navigation", "top context bar", "center workspace", "right inspector"):
        r.assert_file_contains(
            _ARCH,
            panel,
            f"3.x shell panel `{panel}` declared",
        )

    # 3.6 Supporting docs reflect the executable scaffold.
    r.assert_file_contains(
        _LAYOUT,
        r"manifest\.yaml",
        "3.x repository layout uses manifest.yaml",
    )
    r.assert_file_contains(
        _CHECKS,
        r"run_harness\.py --phase 3",
        "3.x harness checks doc includes phase 3 command",
    )
    r.assert_file(
        _README,
        "3.x app README exists",
    )

    # 3.7 App-level executable checks.
    _assert_command(r, "3.7 app lint check passes", ["npm", "run", "lint"], _RERUN3)
    _assert_command(r, "3.7 app typecheck passes", ["npm", "run", "typecheck"], _RERUN3)
    _assert_command(r, "3.7 app tests pass", ["npm", "run", "test"], _RERUN3)
    _assert_command(r, "3.7 app build passes", ["npm", "run", "build"], _RERUN3)

    return r
