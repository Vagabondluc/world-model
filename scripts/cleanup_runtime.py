from __future__ import annotations

import json
import os
import shutil
import subprocess
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Iterable


WORLD_MODEL_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SCRATCH_ROOT = WORLD_MODEL_ROOT / ".harness-scratch"

ENV_SCRATCH_ROOT = "WORLD_MODEL_SCRATCH_ROOT"
ENV_RUN_ROOT = "WORLD_MODEL_RUN_ROOT"
ENV_ARTIFACT_CATALOG = "WORLD_MODEL_ARTIFACT_CATALOG"

CLEANUP_SCOPES = {"safe", "balanced", "aggressive"}
REPORT_RETENTION_MODES = {"keep", "delete-success", "keep-failure-only"}
ARTIFACT_KINDS = {
    "durable_report",
    "durable_output",
    "scratch",
    "quarantine",
    "cache",
    "build_output",
}

DURABLE_REPORTS = [
    WORLD_MODEL_ROOT / "phase-2-snapshot-build-report.json",
    WORLD_MODEL_ROOT / "phase-2-snapshot-integrity-report.json",
    WORLD_MODEL_ROOT / "phase-4-migration-report.json",
    WORLD_MODEL_ROOT / "phase-6-release-report.json",
    WORLD_MODEL_ROOT / "phase-8-integration-report.json",
    WORLD_MODEL_ROOT / "phase-checklist.json",
]

SAFE_STATIC_CLEANUP = [
    WORLD_MODEL_ROOT / "phase-0-inventory.temp.json",
]

BALANCED_STATIC_CLEANUP = [
    WORLD_MODEL_ROOT / "apps" / "unified-app" / "dist",
    WORLD_MODEL_ROOT / "apps" / "unified-app" / "coverage",
    WORLD_MODEL_ROOT / "apps" / "unified-app" / "test-results",
    WORLD_MODEL_ROOT / "apps" / "unified-app" / "playwright-report",
]

AGGRESSIVE_STATIC_CLEANUP = [
    WORLD_MODEL_ROOT / "target",
]


@dataclass(frozen=True)
class ArtifactRecord:
    path: str
    phase: str | None
    kind: str
    created_by: str
    preserve_on_success: bool
    preserve_on_failure: bool


def world_model_root() -> Path:
    return WORLD_MODEL_ROOT


def default_scratch_root() -> Path:
    return DEFAULT_SCRATCH_ROOT


def normalize_cleanup_scope(value: str | None) -> str:
    scope = (value or "safe").strip().lower()
    if scope not in CLEANUP_SCOPES:
        raise ValueError(f"cleanup scope must be one of {sorted(CLEANUP_SCOPES)}, got `{value}`")
    return scope


def normalize_report_retention(value: str | None) -> str:
    mode = (value or "keep").strip().lower()
    if mode not in REPORT_RETENTION_MODES:
        raise ValueError(
            f"report retention must be one of {sorted(REPORT_RETENTION_MODES)}, got `{value}`"
        )
    return mode


def resolve_scratch_root(path: str | os.PathLike[str] | None) -> Path:
    if path:
        candidate = Path(path)
        if not candidate.is_absolute():
            candidate = Path.cwd() / candidate
        return candidate.resolve()
    return default_scratch_root().resolve()


def build_run_root(scratch_root: Path) -> Path:
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    return scratch_root / "runs" / f"run-{timestamp}-{os.getpid()}"


def artifact_catalog_path(run_root: Path) -> Path:
    return run_root / "artifacts.jsonl"


def runtime_env(scratch_root: Path, run_root: Path) -> dict[str, str]:
    return {
        ENV_SCRATCH_ROOT: scratch_root.as_posix(),
        ENV_RUN_ROOT: run_root.as_posix(),
        ENV_ARTIFACT_CATALOG: artifact_catalog_path(run_root).as_posix(),
    }


def env_scratch_root() -> Path | None:
    value = os.environ.get(ENV_SCRATCH_ROOT)
    return Path(value).resolve() if value else None


def env_run_root() -> Path | None:
    value = os.environ.get(ENV_RUN_ROOT)
    return Path(value).resolve() if value else None


def env_artifact_catalog() -> Path | None:
    value = os.environ.get(ENV_ARTIFACT_CATALOG)
    return Path(value).resolve() if value else None


def register_artifact(
    path: Path | str,
    *,
    phase: str | int | None,
    kind: str,
    created_by: str,
    preserve_on_success: bool,
    preserve_on_failure: bool,
    catalog_path: Path | None = None,
) -> None:
    if kind not in ARTIFACT_KINDS:
        raise ValueError(f"unknown artifact kind `{kind}`")
    target = Path(path).resolve()
    catalog = catalog_path or env_artifact_catalog()
    if catalog is None:
        return
    catalog.parent.mkdir(parents=True, exist_ok=True)
    record = ArtifactRecord(
        path=target.as_posix(),
        phase=None if phase is None else str(phase),
        kind=kind,
        created_by=created_by,
        preserve_on_success=preserve_on_success,
        preserve_on_failure=preserve_on_failure,
    )
    with catalog.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(asdict(record)) + "\n")


def load_artifacts(catalog_path: Path | None) -> list[ArtifactRecord]:
    if catalog_path is None or not catalog_path.is_file():
        return []
    records: list[ArtifactRecord] = []
    for line in catalog_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        payload = json.loads(line)
        records.append(ArtifactRecord(**payload))
    return records


def prepare_phase_scratch(label: str, *, scratch_root: Path | None = None) -> Path:
    if scratch_root is None:
        run_root = env_run_root()
        if run_root is None:
            raise ValueError("scratch_root is required when no harness run root is configured")
        base = run_root
    else:
        base = scratch_root
    phase_root = base / label
    phase_root.mkdir(parents=True, exist_ok=True)
    register_artifact(
        phase_root,
        phase=label,
        kind="quarantine",
        created_by=label,
        preserve_on_success=False,
        preserve_on_failure=True,
    )
    return phase_root


def write_command_log(
    name: str,
    output: str,
    *,
    phase_root: Path | None,
) -> Path | None:
    if phase_root is None:
        return None
    logs = phase_root / "logs"
    logs.mkdir(parents=True, exist_ok=True)
    safe_name = "".join(ch if ch.isalnum() or ch in {"-", "_"} else "-" for ch in name.lower()).strip("-")
    log_path = logs / f"{safe_name or 'command'}.log"
    log_path.write_text(output, encoding="utf-8")
    register_artifact(
        log_path,
        phase=phase_root.name,
        kind="scratch",
        created_by=phase_root.name,
        preserve_on_success=False,
        preserve_on_failure=True,
    )
    return log_path


def tracked_files(root: Path | None = None) -> set[str]:
    cwd = str(root or world_model_root())
    proc = subprocess.run(
        ["git", "ls-files"],
        cwd=cwd,
        capture_output=True,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        return set()
    tracked: set[str] = set()
    for rel in proc.stdout.splitlines():
        rel = rel.strip()
        if not rel:
            continue
        tracked.add((Path(cwd) / rel).resolve().as_posix())
    return tracked


def should_preserve_report(mode: str, run_succeeded: bool) -> bool:
    mode = normalize_report_retention(mode)
    if mode == "keep":
        return True
    if mode == "delete-success":
        return not run_succeeded
    if mode == "keep-failure-only":
        return not run_succeeded
    return True


def _iter_pycache_candidates(root: Path) -> Iterable[Path]:
    for pycache in root.rglob("__pycache__"):
        yield pycache
    for pyc in root.rglob("*.pyc"):
        yield pyc


def _static_cleanup_targets(scope: str) -> list[Path]:
    scope = normalize_cleanup_scope(scope)
    targets = list(SAFE_STATIC_CLEANUP)
    if scope in {"balanced", "aggressive"}:
        targets.extend(BALANCED_STATIC_CLEANUP)
    if scope == "aggressive":
        targets.extend(AGGRESSIVE_STATIC_CLEANUP)
    return targets


def _delete_path(path: Path) -> tuple[bool, str]:
    if not path.exists():
        return True, "missing"
    for attempt in range(3):
        try:
            if path.is_dir() and not path.is_symlink():
                shutil.rmtree(path)
            else:
                path.unlink()
            return True, "deleted"
        except FileNotFoundError:
            return True, "missing"
        except OSError as exc:
            if attempt == 2:
                return False, str(exc)
            time.sleep(0.15 * (attempt + 1))
    return False, "unknown deletion error"


def cleanup_phase_outputs(
    *,
    scratch_root: Path,
    scope: str = "safe",
    report_retention: str = "keep",
    run_succeeded: bool = True,
    current_run_root: Path | None = None,
) -> dict[str, Any]:
    scope = normalize_cleanup_scope(scope)
    report_retention = normalize_report_retention(report_retention)
    tracked = tracked_files(world_model_root())
    deleted: list[str] = []
    preserved: list[str] = []
    failed: list[dict[str, str]] = []
    stale: list[str] = []

    def handle_path(path: Path, *, preserve: bool) -> None:
        path = path.resolve()
        if preserve:
            preserved.append(path.as_posix())
            return
        ok, status = _delete_path(path)
        if ok:
            if status == "deleted":
                deleted.append(path.as_posix())
        else:
            failed.append({"path": path.as_posix(), "error": status})

    current_records = load_artifacts(artifact_catalog_path(current_run_root)) if current_run_root else []
    current_paths = {Path(record.path).resolve() for record in current_records}

    for record in current_records:
        path = Path(record.path).resolve()
        preserve = record.preserve_on_success if run_succeeded else record.preserve_on_failure
        if record.kind == "durable_report":
            preserve = should_preserve_report(report_retention, run_succeeded)
        handle_path(path, preserve=preserve)

    if current_run_root is not None:
        handle_path(current_run_root, preserve=not run_succeeded and any(
            record.preserve_on_failure for record in current_records
        ))

    runs_root = scratch_root / "runs"
    if runs_root.is_dir():
        for run_dir in runs_root.iterdir():
            if current_run_root is not None and run_dir.resolve() == current_run_root.resolve():
                continue
            stale.append(run_dir.resolve().as_posix())
            handle_path(run_dir, preserve=False)

    for candidate in _iter_pycache_candidates(world_model_root()):
        if candidate.resolve().as_posix() in tracked:
            continue
        handle_path(candidate, preserve=False)

    for target in _static_cleanup_targets(scope):
        if target.resolve().as_posix() in tracked and target not in DURABLE_REPORTS:
            continue
        handle_path(target, preserve=False)

    for report_path in DURABLE_REPORTS:
        handle_path(report_path, preserve=should_preserve_report(report_retention, run_succeeded))

    for container in [runs_root, scratch_root]:
        if container.exists() and container.is_dir():
            try:
                next(container.iterdir())
            except StopIteration:
                handle_path(container, preserve=False)
            except OSError as exc:
                failed.append({"path": container.as_posix(), "error": str(exc)})

    return {
        "requested": True,
        "cleanup_scope": scope,
        "report_retention": report_retention,
        "run_succeeded": run_succeeded,
        "scratch_root": scratch_root.as_posix(),
        "current_run_root": current_run_root.as_posix() if current_run_root else None,
        "deleted": sorted(set(deleted)),
        "preserved": sorted(set(preserved)),
        "failed": failed,
        "stale": sorted(set(stale)),
    }
