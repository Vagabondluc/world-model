# 147 Tactical Combat Resolution (Deterministic)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/125-fantasy-race-unit-bestiary.md`, `docs/brainstorm/135-typescript-simulation-architecture.md`, `docs/specs/30-runtime-determinism/35-deterministic-rng.md`]
- `Owns`: [`combat resolution formulas`, `unit stat blocks`, `auto-resolve logic`]
- `Writes`: [`battle outcomes`, `unit damage events`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/147-tactical-combat-resolution.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a deterministic, fixed-point math combat system that scales from 1v1 duels to 10,000-unit mass battles using Lanchester's Laws and robust damage formulas.

## 1. Unit Stat Kernel (Fixed-Point)
All stats are `PpmInt` (0..1,000,000).
- `AttackPPM`: Offensive power.
- `DefensePPM`: Damage mitigation.
- `HealthPPM`: Durability (Base 100,000 = 100%).
- `MoralePPM`: Willingness to fight.
- `Size`: Unit count (for squads).

## 2. Combat Resolution Modes

### 2.1 Discrete Duel (Micro-Scale < 24mi/hex)
Used when player is zoomed in or for "Hero" duels.
- **Formula**: `Damage = (Attack^2 / (Attack + Defense)) * UnitCount`
- **To-Hit**: Deterministic. `HitChance = Attack / (Attack + Defense)`.
- **RNG**: Uses seeded `35-deterministic-rng` to determine crit/glance, but average damage matches the formula.

### 2.2 Lanchester Mass Combat (Macro-Scale > 24mi/hex)
Used for auto-resolving battles between large armies.
- **Square Law (Ranged/Modern)**: `d(Red)/dt = -Blue_Lethality * Blue_Count`. (Damage scales with N^2).
- **Linear Law (Melee/Ancient)**: `d(Red)/dt = -Blue_Lethality`. (Damage scales with N).
- **Implementation**: The simulation integrates these differential equations over 10-tick intervals to determine casualties.

## 3. Combat Phases (Sequence)
To ensure deterministic resolution, every tick of combat follows a strict "Waterfall" of phases:

1. **Aerial Engagement**: Flying units (Spec 146) target other Flying units first. High-altitude units gain a `+25% AttackPPM` bonus.
2. **Ranged Salvos**: Ground-to-Ground, Air-to-Ground, and Ground-to-Air ranged attacks are resolved. 
3. **Charge / Impact**: High-speed units (Cavalry, Flyers diving) apply shock damage.
4. **Melee Grind**: Standard infantry combat using the Discrete or Lanchester formulas.
5. **Pursuit / Rout**: Routing units are attacked by remaining mobile units with zero defense return.

## 4. Morale & Rout
- **Shock Damage**: Units take "Morale Damage" equal to `PhysicalDamage * TerrorFactor`.
- **Rout Threshold**: If `Morale < 200,000 PPM`, the unit routs.
- **Chain Reaction**: A routing unit emits a "Terror Wave" reducing nearby ally morale by 50,000 PPM.

## 5. Flying Unit Rules
- **Untouchable**: Non-ranged Melee units cannot target Flying units unless the Flyer is in the "Melee Grind" phase (representing a landing or low-altitude strafe).
- **Line of Sight**: Flyers ignore terrain-based Fog of War (Spec 137) within their local hex.
- **Retaliation**: Ground-to-Air attacks suffer a `-15% To-Hit` penalty due to target speed and altitude.

## 6. Performance Optimization
- **Batching**: Combat is resolved according to the phases above.
- **Lookup Tables**: Expensive `Attack^2` calculations use precomputed LUTs for standard stat ranges.

## 7. Integration with Bestiary
Combat participants are strictly determined by the units present in the hex at the time of the "Bloom" (Spec 144) or army movement. 

- **Race Modifiers (If Present)**:
  - `Orcs`: +20% Attack, -10% Defense (Berserker).
  - `Dwarves`: +30% Defense, -10% Speed (Shieldwall).
  - `Elves`: +50% Accuracy (To-Hit bonus).
  - `Dragons`: **Highly Rare.** Due to metabolic cost (Spec 143), they are statistically absent from most battles. If present, they engage in **Aerial Engagement** with 100% TerrorFactor.
  - `Humans`: +10% Morale (Social Cohesion).

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
