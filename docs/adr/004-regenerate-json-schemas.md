# ADR 004 — JSON Schema Regeneration Process

- Date: 2026-04-08
- Status: Proposed

## Context

Changes to canonical Rust types must be reflected in `contracts/json-schema` and `contracts/promoted-schema`. A reproducible regeneration process is required so adapters and frontend Zod types remain in sync with Rust types.

## Decision

Use the workspace's schema generation tooling (the `world-model-schema` crate or equivalent) to regenerate schema artifacts after canonical model changes. Document the exact command to run and embed it in CI.

## Suggested commands

Run a full build and regenerate schemas:

```powershell
cargo build --workspace --release
# from workspace root, run the schema generator if available
cargo run -p world-model-schema --release
```

If the project uses a different generator script, run that script and verify updated files in `contracts/json-schema` and `contracts/promoted-schema`.

## Consequences

- CI must include a schema-regeneration step or a check that the generated artifacts are up-to-date.
- Downstream Zod/TypeScript artifacts must be regenerated from the updated schemas.

## Next steps

1. Locate and verify the schema generator crate or script.
2. Add regeneration to CI and developer docs.
