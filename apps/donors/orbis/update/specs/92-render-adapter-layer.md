# COMPAT WRAPPER: 92-render-adapter-layer

SpecTier: Contract

## Spec Header
- `Version`: `v1-compat-wrapper`
- `DependsOn`: [`docs/specs/40-actions-gameplay/101-render-adapter-layer.md`]
- `Owns`: `[]`
- `Writes`: `[]`

## Status
Legacy-compatible wrapper. Canonical renderer boundary lives in `101`.

## Superseded By
- `docs/specs/40-actions-gameplay/101-render-adapter-layer.md`

## Purpose
Preserve historical references to `92` while enforcing the same render adapter boundary, degradation policy, and completion semantics defined in `101`.

## Forwarding Rule (Normative)
- Any requirement interpreted from `92` MUST be resolved by reading `101`.
- On conflict between `92` and `101`, `101` always wins.
- New render adapter rules MUST be added only to `101`, not `92`.

## Legacy Symbol Mapping
- `Render Adapter Layer` -> `101-render-adapter-layer.md`
- `Degradation ladder` -> `101` section `Degradation Ladder`
- `Completion semantics` -> `101` section `Completion Signal Contract`
- `Curated Three.js stack` -> `101` sections `Curated Ecosystem Profile` and `Library Selection Rules`

## Compatibility Guarantees
- Legacy links to `92` remain valid.
- Completion status and reason-code behavior remain aligned with `101`.
- Deterministic non-authority renderer semantics are preserved for legacy integrations.

## Implementation Guardrails
- Do not duplicate adapter type definitions here.
- Do not add runtime profile logic here.
- Adapter implementations should consume `101` as the canonical source.

## Compliance Vector (v1)
Input:
- Integration code references `92` for render adapter behavior.

Expected:
- Behavior resolution forwards to `101`.
- Completion/degradation semantics match canonical outcomes from `101`.
