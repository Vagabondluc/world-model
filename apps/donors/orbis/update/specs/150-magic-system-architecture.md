# 150 Magic System Architecture (Core Engine)

SpecTier: Brainstorm Draft

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/149-magical-leyline-physics.md`, `docs/brainstorm/147-tactical-combat-resolution.md`]
- `Owns`: [`magic system registry`, `casting engine`, `cost calculation kernel`]
- `Writes`: [`spell casting events`, `mana pool updates`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/150-magic-system-architecture.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a unified, data-driven architecture that supports multiple magic paradigms (Vancian, Mana, Ritual, etc.) within a single deterministic simulation engine.

## 1. Magic Type Registry (Hardened)
To support variety, "Magic Type" is defined by its mandatory **Tag Set** (Spec 156).

| Magic Type | Core Tags | Resource Source | Cost Model | Bestiary Link |
|---|---|---|---|---|
| **Arcane** | `Hermetic`, `Evocation` | Internal Pool (MP) | `Cost * Skill_Reduc` | Humans, Elves |
| **Vancian** | `Hermetic`, `Prepared` | Spell Slots | `1 Slot` | Wizards, Liches |
| **Divine** | `Divine`, `Holy` | Faith / Belief | `Belief_PPM * Pop` | Clerics, Paladins |
| **Primal** | `Shamanic`, `Nature` | Environmental | `Local_Biome_GPP` | Druids, Orcs |
| **Ritual** | `Ritual`, `Communal` | Global Mana | `Time * Participants` | High Magic (4X) |
| **Blood** | `Blood`, `Dark` | Unit Health | `HP_Cost` | Vampires, Warlocks |
| **Psionic** | `Psionic`, `Mental` | Willpower | `Stress_PPM` | Mind-Flayers |

## 2. The Casting Engine (Kernel)
Every spell cast follows a standard lifecycle using **Tag-Driven Validation**:
`Input -> Tag_Validation -> Cost_Deduction -> Tag_Interaction -> Aftermath`

### 2.1 The Universal Cost Formula (Fixed-Point)
`EffectiveCost = BaseCost * mulPPM(DistanceMod, mulPPM(LeylineMod, EfficiencyMod))`
- **DistanceMod**: Range penalty (Linear for Missiles, Exponential for Rituals).
- **LeylineMod**: `0.5x` if near High-Potential Node (Spec 149).
- **EfficiencyMod**: Derived from Caster Level/Skill.

### 2.2 Tag-Based Cost Deductors
- **MP**: `Actor.Mana -= EffectiveCost`.
- **Slots**: `Actor.Slots[Tier] -= 1`. (Vancian memorization required).
- **Willpower**: `Actor.Stress += EffectiveCost`. (Psionic burnout risk).
- **Ritual**: `Global.ManaPool -= EffectiveCost` AND `Casting_Time += 1 Tick`.

## 3. Emergent Spell Effects (Tag Interactions)
Spells are containers for `WorldDelta` effects, but their final output is modified by the **Magic Interaction Matrix** (Spec 156).
- **Direct Interaction**: If `Fire` spell hits `Gas` cloud -> Trigger `Explosion` (Reason: `880205`).
- **Chain Reaction**: If `Lightning` hits `Metal` floor -> Conduct damage to all units on `Metal` tiles.

## 4. Elemental System (Hardened)
8-Element Cycle using **Tag-IDs** for deterministic resistance checks:
- **Fire** > Ice
- **Ice** > Wind
- **Wind** > Earth
- **Earth** > Lightning
- **Lightning** > Water
- **Water** > Fire
- **Holy** <> **Dark** (Mutual weakness)

**Affinity Equation**:
`Damage = Base * (1.0 + mulPPM(Attacker_Affinity, 500,000) - mulPPM(Defender_Resistance, 500,000))`

## 5. Integration
- **Combat**: Tactical spells use the `147` phases (Aerial -> Ranged -> Melee).
- **Strategy**: Global enchantments use the `129` Legitimacy engine (Divine) or `142` Logistics (Teleportation).
- **Tags**: All magic systems must use the `38` Unified Tag System for state persistence.

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
