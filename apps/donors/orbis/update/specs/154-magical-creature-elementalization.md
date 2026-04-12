# 154 Magical Creature & Elementalization

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/149-magical-leyline-physics.md`, `docs/brainstorm/146-hardened-species-evolution-kernel.md`, `docs/brainstorm/143-ecological-causality-kernels.md`]
- `Owns`: [`elementalization logic`, `magical creature spawning multipliers`]
- `Writes`: [`creature transformation events`, `magical species variants`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/154-magical-creature-elementalization.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define how leyline proximity strengthens magical creatures and triggers the spontaneous transformation of mundane species into elementals.

## 1. Magical Strengthening (The "Aether Bath")
Creatures with the `Magic_Affinity` bit set in their Genome (Spec 146) gain linear scaling from local `aether.ambient_mana`.

`Combat_Power_Bonus = mulPPM(Base_Stats, aether.ambient_mana)`
- **Node Homing**: Magical creatures (e.g., Dragons, Phoenixes) use the Utility AI (Spec 138) to seek out High-Potential Nodes.
- **Mana-Dependent Health**: If a magical creature leaves high-mana zones for > 50 ticks, it suffers `mana_starvation` attrition.

## 2. Spontaneous Elementalization (The "Bloom")
Mundane creatures can be "Overcharged" by leyline proximity, forcing a horizontal speciation event.

### 2.1 The Transformation Trigger
Trigger `thr_spontaneous_elementalization` (Reason: `880104`) when:
1. `aether.ambient_mana > 800,000 PPM`
2. Hex alignment matches a leyline aspect (Spec 149).
3. Random mutation roll (Spec 146) succeeds with a `+50% bonus` from mana.

### 2.2 Elemental Variants (Tag-Based)
When transformation occurs, the creature gains the corresponding **Elemental Tag** (`0x000101xx`) from Spec 156.
- **Fire Elemental**: Gains `Fire` tag. Triggers `Steam_Cloud` when hit by `Water` spells.
- **Storm Elemental**: Gains `Lightning` tag. Conducts damage through `Water/Metal` hexes.
- **Earth Elemental**: Gains `Earth` tag. Provides `Cover` status component to nearby allies.

## 3. Summoning Mechanics (Hardened)
Leylines act as "Broadband Conduits" for entities with the `Conjuration` tag (Spec 156).
- **Summoning Cost Reduction**: `Cost_Reduc = mulPPM(Base_Cost, aether.flux)`.
- **Stabilization**: Rituals performed on a node have a 0% failure rate; rituals performed in "Dead Zones" have a 50% `arcane_discharge` risk.

## 4. Performance
- Transformation checks are only run during the "Bloom" cycle (Spec 144) or every 100 ticks for persistent micro-entities.
- Uses the same bitwise genome system (`146`) to swap trait masks and map them to **TagIds**.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.
