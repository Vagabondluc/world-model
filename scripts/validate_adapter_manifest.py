"""Simple adapter manifest validator for Phase 0.

Usage:
  python validate_adapter_manifest.py path/to/manifest.yaml

Notes:
  - Requires PyYAML: `pip install pyyaml` (see requirements file).
  - Exits with code 0 on success, non-zero on failure.
"""
import sys
import os
import json

try:
    import yaml
except Exception:
    yaml = None

REQUIRED_TOP_LEVEL = ["id", "name", "source", "snapshot", "mappings"]


def validate_manifest(manifest: dict):
    missing = [k for k in REQUIRED_TOP_LEVEL if k not in manifest]
    if missing:
        return False, f"missing required fields: {missing}"

    src = manifest.get("source")
    if not isinstance(src, dict) or ("repo" not in src and "url" not in src):
        return False, "source must be an object containing at least 'repo' or 'url'"

    if not manifest.get("mappings"):
        return False, "mappings must be a non-empty list"

    return True, "ok"


def load_yaml(path: str):
    if yaml is None:
        raise RuntimeError("PyYAML not available. Install with 'pip install pyyaml'.")
    with open(path, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: validate_adapter_manifest.py PATH_TO_MANIFEST_OR_DIR", file=sys.stderr)
        sys.exit(2)

    target = sys.argv[1]
    if os.path.isdir(target):
        # find first .yml/.yaml manifest file
        candidates = [f for f in os.listdir(target) if f.endswith((".yml", ".yaml"))]
        if not candidates:
            print(f"No manifest YAML found in directory: {target}", file=sys.stderr)
            sys.exit(3)
        manifest_path = os.path.join(target, candidates[0])
    else:
        manifest_path = target

    try:
        data = load_yaml(manifest_path)
    except Exception as e:
        print(f"Failed to load YAML: {e}", file=sys.stderr)
        sys.exit(4)

    ok, msg = validate_manifest(data)
    if not ok:
        print(f"INVALID: {msg}", file=sys.stderr)
        sys.exit(5)

    print("VALID: manifest passed basic checks")
    sys.exit(0)
