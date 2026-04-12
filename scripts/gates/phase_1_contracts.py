"""Shared Phase 1 contract helpers.

This module centralizes the semantic checks used by the Phase 1 gate and the
standalone contract-verification script. The checks intentionally work against
the same export commands and committed contract directories so the gate is
measuring the deliverable surface rather than prose-only claims.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
import subprocess
from typing import Iterable

ROOT = Path(__file__).resolve().parents[2]
SCHEMA_DIR = ROOT / "contracts" / "json-schema"
PROMOTED_DIR = ROOT / "contracts" / "promoted-schema"
SCHEMA_BIN_CMD = [
    "cargo",
    "run",
    "-p",
    "world-model-schema",
    "--bin",
    "export-schemas",
    "--quiet",
]
PROMOTED_BIN_CMD = [
    "cargo",
    "run",
    "-p",
    "world-model-specs",
    "--bin",
    "export-promoted-schemas",
    "--quiet",
]
CORE_TEST_CMD = ["cargo", "test", "-p", "world-model-core"]
SPECS_TEST_CMD = ["cargo", "test", "-p", "world-model-specs"]

CORE_PUBLIC_TYPES = [
    "WorldId",
    "EntityId",
    "AssetId",
    "WorkflowId",
    "SchemaId",
    "EventId",
    "ProjectionId",
    "MigrationId",
    "ProfileId",
    "HumanMetadata",
    "OwnerKind",
    "OwnerRef",
    "SourceSystem",
    "SchemaClass",
    "DashboardMode",
    "FidelityLevel",
    "TickMode",
    "WorkflowStatus",
    "RelationKind",
    "AppendOnlyEventLedger",
    "ExternalSchemaRef",
    "MigrationLineage",
    "SchemaBindingRecord",
    "LocationAttachment",
    "SimulationDomainId",
    "SimulationDomainConfig",
    "SimulationSnapshotRef",
    "SimulationProvenance",
    "SimulationAttachment",
    "WorkflowStepState",
    "WorkflowCheckpoint",
    "WorkflowAttachment",
    "EventPayloadRef",
    "EventCausation",
    "EventEnvelope",
    "EventRange",
    "ProjectionRecord",
    "MigrationRecord",
    "RelationProvenance",
    "RelationRecord",
    "WorldRecord",
    "EntityRecord",
    "AssetRecord",
    "WorkflowRecord",
    "CommandStatus",
    "CommandIssue",
    "WorldCommand",
    "WorldCommandRequest",
    "WorldCommandResponse",
    "CanonicalBundle",
]

CORE_COMMAND_SURFACE = [
    "apply_world_command",
]


@dataclass(frozen=True)
class CommandCheck:
    name: str
    command: tuple[str, ...]
    passed: bool
    message: str


def workspace_root() -> Path:
    return ROOT


def _run(command: Iterable[str], cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        list(command),
        cwd=str(cwd or ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )


def _combined_output(proc: subprocess.CompletedProcess[str]) -> str:
    parts = [(proc.stdout or "").strip(), (proc.stderr or "").strip()]
    return "\n".join(part for part in parts if part).strip()


def _check_command(name: str, command: Iterable[str], cwd: Path | None = None) -> CommandCheck:
    proc = _run(command, cwd=cwd)
    output = _combined_output(proc)
    if not output:
        output = f"exit code {proc.returncode}"
    return CommandCheck(
        name=name,
        command=tuple(command),
        passed=proc.returncode == 0,
        message=output,
    )


def _collect_tree(root: Path) -> dict[str, str]:
    files: dict[str, str] = {}
    if not root.exists():
        return files
    for path in sorted(root.rglob("*")):
        if path.is_file():
            files[path.relative_to(root).as_posix()] = path.read_text(encoding="utf-8")
    return files


def _diff_maps(expected: dict[str, str], actual: dict[str, str]) -> list[str]:
    diffs: list[str] = []
    expected_keys = set(expected)
    actual_keys = set(actual)

    missing = sorted(expected_keys - actual_keys)
    extra = sorted(actual_keys - expected_keys)
    changed = sorted(
        key for key in expected_keys & actual_keys if expected[key] != actual[key]
    )

    if missing:
        diffs.append("missing files: " + ", ".join(missing))
    if extra:
        diffs.append("extra files: " + ", ".join(extra))
    for key in changed:
        diffs.append(f"content differs: {key}")
    return diffs


def _version_file_text() -> str:
    version_path = ROOT / "crates" / "world-model-schema" / "src" / "lib.rs"
    pattern = re.compile(r'pub const WORLD_MODEL_SCHEMA_VERSION: &str = "([^"]+)";')
    content = version_path.read_text(encoding="utf-8")
    match = pattern.search(content)
    if not match:
        raise RuntimeError("unable to determine WORLD_MODEL_SCHEMA_VERSION")
    return match.group(1)


def check_phase_1_semantics() -> list[CommandCheck]:
    checks: list[CommandCheck] = []
    checks.append(_check_command("cargo test -p world-model-core", CORE_TEST_CMD))
    checks.append(_check_command("cargo test -p world-model-specs", SPECS_TEST_CMD))

    before_schema = _collect_tree(SCHEMA_DIR)
    before_promoted = _collect_tree(PROMOTED_DIR)

    schema_export = _check_command(
        "cargo run -p world-model-schema --bin export-schemas --quiet",
        SCHEMA_BIN_CMD,
    )
    checks.append(schema_export)
    after_schema = _collect_tree(SCHEMA_DIR)
    promoted_after_schema_export = _collect_tree(PROMOTED_DIR)

    promoted_export = _check_command(
        "cargo run -p world-model-specs --bin export-promoted-schemas --quiet",
        PROMOTED_BIN_CMD,
    )
    checks.append(promoted_export)
    after_promoted = _collect_tree(PROMOTED_DIR)

    if schema_export.passed and promoted_export.passed:
        schema_diffs = _diff_maps(before_schema, after_schema)
        schema_promoted_diffs = _diff_maps(before_promoted, promoted_after_schema_export)
        promoted_diffs = _diff_maps(before_promoted, after_promoted)
        cross_promoted_diffs = _diff_maps(promoted_after_schema_export, after_promoted)

        expected_version = _version_file_text()
        version_file = SCHEMA_DIR / "VERSION.txt"
        version_ok = version_file.is_file() and version_file.read_text(encoding="utf-8").strip() == expected_version

        checks.append(
            CommandCheck(
                name="schema export deterministic",
                command=tuple(SCHEMA_BIN_CMD),
                passed=not schema_diffs,
                message=schema_diffs[0]
                if schema_diffs
                else "committed json-schema output matches regenerated output",
            )
        )
        checks.append(
            CommandCheck(
                name="schema exporter promoted output is stable",
                command=tuple(SCHEMA_BIN_CMD),
                passed=not schema_promoted_diffs,
                message=schema_promoted_diffs[0]
                if schema_promoted_diffs
                else "schema exporter promoted output matches committed promoted-schema output",
            )
        )
        checks.append(
            CommandCheck(
                name="promoted export deterministic",
                command=tuple(PROMOTED_BIN_CMD),
                passed=not promoted_diffs,
                message=promoted_diffs[0]
                if promoted_diffs
                else "committed promoted-schema output matches regenerated output",
            )
        )
        checks.append(
            CommandCheck(
                name="promoted exporters agree",
                command=tuple(PROMOTED_BIN_CMD),
                passed=not cross_promoted_diffs,
                message=cross_promoted_diffs[0]
                if cross_promoted_diffs
                else "both exporters produce identical promoted-schema outputs",
            )
        )
        checks.append(
            CommandCheck(
                name="schema version file is stable",
                command=tuple(SCHEMA_BIN_CMD),
                passed=version_ok,
                message=(
                    "version file matches expected schema version"
                    if version_ok
                    else f"expected VERSION.txt to contain {expected_version}"
                ),
            )
        )
    else:
        checks.append(
            CommandCheck(
                name="schema export deterministic",
                command=tuple(SCHEMA_BIN_CMD),
                passed=False,
                message="schema export command failed before comparison",
            )
        )
        checks.append(
            CommandCheck(
                name="schema exporter promoted output is stable",
                command=tuple(SCHEMA_BIN_CMD),
                passed=False,
                message="schema export command failed before promoted-schema comparison",
            )
        )
        checks.append(
            CommandCheck(
                name="promoted export deterministic",
                command=tuple(PROMOTED_BIN_CMD),
                passed=False,
                message="promoted export command failed before comparison",
            )
        )
        checks.append(
            CommandCheck(
                name="promoted exporters agree",
                command=tuple(PROMOTED_BIN_CMD),
                passed=False,
                message="export commands failed before exporter agreement comparison",
            )
        )
        checks.append(
            CommandCheck(
                name="schema version file is stable",
                command=tuple(SCHEMA_BIN_CMD),
                passed=False,
                message="schema export command failed before VERSION.txt validation",
            )
        )

    return checks


def baseline_report_text() -> str:
    schema_files = sorted(p.name for p in SCHEMA_DIR.glob("*.schema.json"))
    if (SCHEMA_DIR / "VERSION.txt").is_file():
        schema_files.append("VERSION.txt")
    schema_files = sorted(schema_files)
    promoted_files = sorted(p.name for p in PROMOTED_DIR.iterdir() if p.is_file())
    lines = [
        "# Phase 1 Baseline Report",
        "",
        "Source of truth:",
        "- `world-model-core` tests for IDs, records, and command envelopes",
        "- generated schemas under `contracts/json-schema/`",
        "- promoted schemas and promotion artifacts under `contracts/promoted-schema/`",
        "",
        "## Baseline scope",
        "",
        "This report freezes the current semantic contract surface for Phase 1.",
        "",
        "## Contract file inventory",
        "",
        "### `contracts/json-schema/`",
    ]
    lines.extend(f"- `{name}`" for name in schema_files)
    lines.extend(
        [
            "",
            "### `contracts/promoted-schema/`",
        ]
    )
    lines.extend(f"- `{name}`" for name in promoted_files)
    lines.extend(
        [
            "",
            "## Canonical core public types",
            "",
        ]
    )
    lines.extend(f"- `{name}`" for name in CORE_PUBLIC_TYPES)
    lines.extend(
        [
            "",
            "## Canonical command surface",
            "",
        ]
    )
    lines.extend(f"- `{name}`" for name in CORE_COMMAND_SURFACE)
    lines.extend(
        [
            "",
            "## Baseline verification commands",
            "",
            "- `cargo test -p world-model-core`",
            "- `cargo test -p world-model-specs`",
            "- `cargo run -p world-model-schema --bin export-schemas --quiet`",
            "- `cargo run -p world-model-specs --bin export-promoted-schemas --quiet`",
            "",
            "## Notes",
            "",
            "- Opaque IDs remain string-backed and serialization-transparent.",
            "- Canonical records are frozen against donor-local UI/state leakage.",
            "- Promotion outputs are required to remain deterministic.",
        ]
    )
    return "\n".join(lines) + "\n"


def write_baseline_report(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(baseline_report_text(), encoding="utf-8")
