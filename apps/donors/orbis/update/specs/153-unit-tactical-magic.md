# 153 Unit & Tactical Magic (#TACTICAL)

SpecTier: Brainstorm Draft

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/147-tactical-combat-resolution.md`, `docs/brainstorm/150-magic-system-architecture.md`]
- `Owns`: [`tactical spell registry`, `status effect logic`]
- `Writes`: [`combat damage`, `unit state updates`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/153-unit-tactical-magic.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Model the "Final Fantasy Tactics" style of unit magic: MP management, Charge Time (CT), elemental affinities, and status effects.

## 1. Resource: MP & Charge Time
- **MP**: Regenerates slowly (e.g., 10% per turn). Used for "Arcane" and "Summoning."
- **Charge Time (CT)**: Powerful spells don't fire instantly.
  - `Cast_Start`: Unit begins chanting.
  - `CT_Resolution`: Effect fires after `X` ticks.
  - **Risk**: Unit is vulnerable/interruptible while chanting.

## 2. Targeting Logic
- **Direct**: Single Unit.
- **AoE (Area of Effect)**: Hex pattern (Line, Cone, Burst).
- **Smart Targeting**:
  - `Unit_Lock`: Follows the target if they move.
  - `Hex_Lock`: Strikes the ground (Target can move out of the way).

## 3. Status Effects (Buffs/Debuffs)
Status effects are "Components" added to the unit entity.
- **Positive**: `Regen`, `Haste`, `Protect`, `Shell`.
- **Negative**: `Poison`, `Slow`, `Silence`, `Petrify`.
- **Duration**: Decrements each combat tick.

## 4. Elemental Calculation
Integrated with Spec 147.
`Damage = Base_Power * (1.0 + Attacker_MA/100) * (1.0 - Defender_MD/100) * Elemental_Mod`
- **Weather**: Rain increases Lightning damage, decreases Fire.
- **Terrain**: Standing in water increases Lightning vulnerability.

## 5. Unique Class Mechanics
- **Blue Magic**: Learning spells by being hit by them.
- **Math Skill**: Targeting based on variables (e.g., `Level % 5`).
- **Blood Magic**: Costs HP instead of MP.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm draft.

Expected:
- deterministic output for identical inputs and evaluation order.
- explicit tie-break and clamp behavior is documented before promotion.
