# Adapter Manifest Template

Phase 2 source of truth: strict manifests live at `adapters/<donor>/manifest.yaml` and are validated by:

- `python world-model/scripts/validate_adapter_manifest.py adapters/<donor>/manifest.yaml`
- `python world-model/scripts/check_phase_2_snapshots.py`

Required top-level fields:

- `id`: `mythforge` | `orbis` | `adventure-generator`
- `name`: donor display name
- `version`: adapter manifest version
- `source`: donor provenance object
  - `repo`
  - `commit`
  - `path`
- `source_kind`: `doc` | `typescript` | `json` | `schema_template`
- `default_promotion_class`: `core` | `simulation` | `workflow` | `donor_local` | `reference_only`
- `snapshot`: deterministic snapshot metadata
  - `root` (must be under `adapters/<donor>/source-snapshot`)
  - `fingerprint` (sha256 of sorted file inventory)
  - `file_count`
- `included_paths`: non-empty list copied from donor source
- `excluded_paths`: non-empty list explicitly excluded from snapshot
- `concepts`: non-empty list of concept families from `adapters/concept-family-registry.yaml`
- `mappings`: non-empty list of mapping files (e.g. `adapters/<donor>/mappings/concept-map.yaml`)
- `provenance`: generation metadata
  - `generated_at` (UTC ISO-8601 with `Z`)
  - `generated_by`

Template:

```yaml
id: mythforge
name: "Mythforge"
version: "1.0.0"
source:
  repo: "local://mythforge"
  commit: "workspace-local"
  path: "docs/schema-templates"
source_kind: "schema_template"
default_promotion_class: "core"
snapshot:
  root: "adapters/mythforge/source-snapshot"
  fingerprint: "sha256..."
  file_count: 123
included_paths:
  - "UUID_CONTAINER_ARCHITECTURE.md"
  - "schemas"
excluded_paths:
  - "prompts"
  - "samples"
concepts:
  - "identity-history"
  - "schema-contract"
mappings:
  - "adapters/mythforge/mappings/concept-map.yaml"
provenance:
  generated_at: "2026-04-07T15:00:00Z"
  generated_by: "codex"
```

Validation rules:

- No `REPLACE_` placeholders are allowed.
- Mapping files listed in `mappings` must exist.
- `snapshot.file_count` and `snapshot.fingerprint` must match actual `source-snapshot/` contents.
- Every concept listed in `concepts` must be represented in the adapter concept map.
