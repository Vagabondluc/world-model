# COMPAT WRAPPER: 91-roguejs-orbis-responsibility-matrix

SpecTier: Contract

## Spec Header
- `Version`: `v1-compat-wrapper`
- `DependsOn`: [`docs/specs/40-actions-gameplay/100-roguejs-orbis-responsibility-matrix.md`]
- `Owns`: `[]`
- `Writes`: `[]`

## Status
Legacy-compatible wrapper. Canonical authority lives in `100`.

## Superseded By
- `docs/specs/40-actions-gameplay/100-roguejs-orbis-responsibility-matrix.md`

## Purpose
Preserve historical references to `91` while enforcing the exact same authority boundaries defined in `100`.

## Forwarding Rule (Normative)
- Any requirement interpreted from `91` MUST be resolved by reading `100`.
- On conflict between `91` and `100`, `100` always wins.
- New boundary rules MUST be added only to `100`, not `91`.

## Legacy Symbol Mapping
- `Rogue.js ↔ Orbis Responsibility Matrix` -> `100-roguejs-orbis-responsibility-matrix.md`
- `Write boundary policy` -> `100` section `Normative Boundary Rules`
- `Boundary breach event behavior` -> `100` sections `Owned Contracts` + `Write Boundary Enforcement`

## Compatibility Guarantees
- Legacy links to `91` remain valid.
- Determinism and authority semantics are unchanged because this file delegates to `100`.
- Replay/multiplayer behavior for callers referencing `91` is identical to `100`.

## Implementation Guardrails
- Do not duplicate matrix tables here.
- Do not introduce new types here.
- Do not implement runtime behavior from this file directly; import/use `100` definitions.

## Compliance Vector (v1)
Input:
- Integration code references `91` for responsibility rules.

Expected:
- Rule resolution forwards to `100`.
- Authority checks and breach reason codes match canonical outcomes from `100`.
