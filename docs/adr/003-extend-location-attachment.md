# ADR 003 — Extend LocationAttachment and Attachments

- Date: 2026-04-08
- Status: Proposed

## Context

`LocationAttachment` in the existing core model lacks several fields required by donors and promoted-concept logic: biome classification, discovery status, and precise coordinates. Additional attachments such as `EraAttachment`, `WorldTurnAttachment`, and `SigilAttachment` are needed to capture domain semantics.

## Decision

Extend `LocationAttachment` to include:

- `biome_type` — a `BiomeType` enum covering canonical terrain types.
- `discovery_status` — a `DiscoveryStatus` enum (e.g., Unknown, Surveyed, Settled, Ruined).
- `hex_coordinate` — an explicit hex coordinate struct (axial or cube coordinates) for canonical positioning.

Add new attachment structs:

- `EraAttachment` — captures era metadata and start/end markers.
- `WorldTurnAttachment` — captures turn-based sequencing and turn metadata.
- `SigilAttachment` — captures image/sigil references and provenance.

## Consequences

- Requires changes in `crates/world-model-core/src/records.rs` and related serialization.
- Regenerate JSON schemas and update adapters.

## Next steps

1. Add enums and structs to `world-model-core` with serde derives and schema hints.
2. Run build and update tests.
3. Regenerate contracts and update adapters.
