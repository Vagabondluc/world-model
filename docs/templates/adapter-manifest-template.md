# Adapter Manifest Template

This is the canonical template for adapter manifests consumed by the Phase 0 harness checks.
Include one manifest per donor snapshot. Manifests MUST be YAML and include the following required top-level fields.

Required fields

- `id`: short identifier (string)
- `name`: human-friendly name (string)
- `version`: manifest version (semver-like string)
- `source`: object with source provenance
  - `repo`: origin repository URL (string)
  - `commit`: commit SHA/tag (string)
  - `path`: path inside repo used (optional)
- `snapshot`: path to local snapshot directory (string)
- `mappings`: list of mapping files or directories (array)
- `fixtures`: list of fixture directories (array)
- `tests`: list of test paths (array)
- `concepts`: list of concept families (array)

Optional fields

- `owner`: team or person responsible (string)
- `notes`: freeform notes (string)

Example manifest

```yaml
id: donor-xyz
name: "Donor XYZ"
version: "1.0.0"
source:
  repo: "https://github.com/org/donor-xyz"
  commit: "abc123def"
  path: "src/"
snapshot: "snapshots/donor-xyz/2026-04-02/"
mappings:
  - "mappings/donor-xyz/mapping.yaml"
fixtures:
  - "fixtures/donor-xyz/"
tests:
  - "tests/donor-xyz/"
concepts:
  - "character"
  - "location"
  - "item"
owner: "adapter-team@org"
notes: "Snapshot taken by adapter pipeline on 2026-04-02"
```

Validation rules

- `id`, `name`, `source`, `snapshot`, and `mappings` are required.
- `source` should include `repo` and either `commit` or `tag` for reproducibility.
- `snapshot` should be a relative path under `snapshots/` or a documented storage location.

Place manifests alongside snapshots, e.g.: `snapshots/donor-xyz/manifest.yaml`.