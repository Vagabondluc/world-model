# ADR 001 — Canonical Trunk Model

- Date: 2026-04-08
- Status: Proposed

## Context

The codebase currently contains multiple donor-specific stores and types. Donor UIs depend on their local store shapes which diverge from a single, canonical world model. This complicates cross-donor comparisons, promoted-concept reasoning, and adapter development.

## Decision

Adopt a single canonical trunk model housed in `crates/world-model-core` and `crates/world-model-specs`. Donor UIs will remain unchanged by introducing thin per-donor shims that adapt the canonical store to each donor's expected API surface. A harness application (`apps/donor-harness`) will mount donor UIs as subtrees via Vite alias injection so the UI code is unchanged.

## Consequences

- Centralizes domain types and serialization concerns.
- Requires updating Rust enums/structs and regenerating JSON schemas used by adapters and Zod definitions.
- Introduces a shim layer per donor; adapters must be updated to read/write canonical records.
- Simplifies cross-donor tests and integration once implemented.

## Next steps

1. Author ADRs for specific model changes (this set).
2. Add/expand enums and attachment structs in Rust crates.
3. Regenerate JSON schemas and update adapter snapshots.
4. Implement harness + per-donor shims and add Vite mounting config.
