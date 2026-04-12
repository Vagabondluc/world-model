# ADR 002 — Expand Donor Enums

- Date: 2026-04-08
- Status: Proposed

## Context

The repository and documentation now reference six donors (Mythforge, Orbis, Adventure Generator, Mappa Imperium, Dawn of Worlds, Faction-Image), but the Rust model enums are currently limited to three donors. This mismatch causes runtime mismatches and schema omissions.

## Decision

Expand the canonical donor-related enums (`SpecDonor`, `SourceSystem`, and any `DonorSystem` variants) to include the additional donors. Keep enum variant names stable and document the mapping between donor names and their code identifiers.

## Consequences

- Requires changes in `crates/world-model-specs`, `crates/world-model-core`, and `crates/world-model-adapters`.
- Adapter snapshots and comparison rows must be reconciled.
- CI may temporarily fail until downstream code and contracts are updated.

## Next steps

1. Update enum definitions in the Rust crates.
2. Run cargo build/tests and fix compilation errors.
3. Regenerate JSON schemas and Zod artifacts.
