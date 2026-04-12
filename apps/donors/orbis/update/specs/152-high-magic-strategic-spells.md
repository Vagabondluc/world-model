# 152 High Magic & Strategic Spells (#ARCANE)

SpecTier: Brainstorm Draft

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/149-magical-leyline-physics.md`, `docs/brainstorm/139-macro-economic-input-output-model.md`]
- `Owns`: [`global enchantment registry`, `strategic casting logic`]
- `Writes`: [`global state modifiers`, `strategic unit summons`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/152-high-magic-strategic-spells.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define the "Master of Magic" style layer where magic is a 4X strategic resource used for global enchantments, city-level buffs, and overland warfare.

## 1. Casting Mechanism: Rituals
Unlike tactical spells, Strategic Magic takes time.
- **Casting Time**: Defined in `Ticks`.
- **Investment**: `Mana_Per_Tick` input.
- **Interruption**: If `Mana_Pool` runs dry or the `Casting_City` is besieged, the spell fails (Mana wasted).

## 2. Global Enchantments
Persistent effects that alter the simulation rules.
- **Examples**:
  - `Time_Dilation`: Slows down enemy movement speed globally.
  - `Nature's Bounty`: Increases `GPP_Actual` by 20% in all forests.
  - `Armageddon`: Raises `climate.mean_temp_k` by 5K per era (Doomsday clock).
- **Maintenance**: Each active global spell reserves a portion of the `Global_Mana_Income`.

## 3. City & Overland Spells
- **Summoning**: Spawns a magical unit stack (e.g., Fire Elementals) at a city.
- **Terraforming**: Permanently alters a hex's resource potential.
- **Teleportation**: Instantly moves an army between two friendly nodes (Logistics shortcut).

## 4. Counter-Magic
- **Dispel**: A direct "Attack" on an active enchantment.
  - **Formula**: `Dispel_Power > Spell_Stability` (derived from caster skill + mana invested).
- **Spell Ward**: Defensive buffer on a city/army that blocks the first hostile strategic spell.

## 5. Research & Mastery
- **Spellbooks**: Tech nodes in the "Arcane" branch unlock new spells.
- **Mastery**: Casting the same spell repeatedly increases its `EfficiencyModifier` (cheaper/faster).

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
