# 106 Scale Genre Matrix (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`scale-genre matrix`, `altitude gameplay mapping`]
- `Writes`: [`scale selection guidance`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/106-scale-genre-matrix.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Map simulation altitude to playable genre so features are built only where they create meaningful play.

## Legend
- `primary`: core gameplay value at this scale
- `secondary`: useful but not central
- `none`: not meaningful at this scale

## Matrix
| Genre / Fantasy | 5 ft | 1 mi | 3 mi | 12 mi | 60 mi | 300 mi | 900 mi | 1500 mi |
|---|---|---|---|---|---|---|---|---|
| Tactical RPG | primary | secondary | none | none | none | none | none | none |
| Dungeon / infiltration | primary | secondary | none | none | none | none | none | none |
| Local exploration | secondary | primary | secondary | none | none | none | none | none |
| Hexcrawl survival | secondary | primary | primary | none | none | none | none | none |
| Monster hunting territory | secondary | primary | primary | secondary | none | none | none | none |
| Operational maneuver warfare | none | secondary | primary | primary | secondary | none | none | none |
| Domain management | none | secondary | primary | primary | primary | secondary | none | none |
| Logistics / supply | none | none | primary | primary | primary | secondary | none | none |
| Political intrigue | none | none | secondary | primary | primary | primary | secondary | none |
| Kingdom diplomacy | none | none | none | secondary | primary | primary | secondary | none |
| Trade networks | none | none | none | secondary | primary | primary | primary | none |
| Cultural identity | none | none | none | secondary | primary | primary | primary | secondary |
| Rise & fall of empires | none | none | none | none | secondary | primary | primary | secondary |
| Civilization builder | none | none | none | none | secondary | primary | primary | none |
| Climate / macro ecology | none | none | none | none | none | secondary | primary | primary |
| Migration centuries | none | none | none | none | secondary | primary | primary | secondary |
| Planetary infrastructure | none | none | none | none | none | secondary | primary | primary |
| Myth / religion evolution | none | none | none | secondary | primary | primary | primary | primary |
| Leylines / magic currents | none | none | none | none | secondary | primary | primary | primary |
| Divine intervention | none | none | none | none | none | secondary | primary | primary |
| God vs titan warfare | none | none | none | none | none | none | secondary | primary |
| Astral / cosmic events | none | none | none | none | none | none | secondary | primary |
| Documentary / historian | secondary | secondary | secondary | primary | primary | primary | primary | primary |

## Design Use
- A new layer must declare target scales.
- If two layers serve the same scale+genre role, merge or remove one.
- UI/AI/data budgets should prioritize scales `3 mi`, `12 mi`, `60 mi`, `300 mi` first.


## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.


## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
