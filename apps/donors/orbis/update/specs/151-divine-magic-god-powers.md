# 151 Divine Magic & God Powers (#DIVINE)

SpecTier: Brainstorm Draft

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/129-legitimacy-and-authority-engine.md`, `docs/brainstorm/150-magic-system-architecture.md`]
- `Owns`: [`belief resource model`, `miracle mechanics`]
- `Writes`: [`faith state`, `terrain deformation events`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/151-divine-magic-god-powers.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Model "God Powers" (Populous/Black & White style) where player agency acts through a divine cursor fueled by population belief.

## 1. Resource: Belief (The Mana of Gods)
- **Source**: `Belief_PPM = Sum(Population_Block.Size * Faith_Intensity)`.
- **Decay**: Belief decays naturally if no miracles are performed (`-1,000 PPM` per tick).
- **Conversion**: `Belief` is converted into `Divine_Mana` at a rate determined by `governance.legitimacy`.

## 2. Miracles (God Powers)
Miracles bypass standard unit limitations but have massive costs.

### 2.1 Terrain Manipulation (The "Hand of God")
- **Raise/Lower Land**: Modifies `geomorphology.height_map`.
  - **Cost**: `Volume_Moved * Base_Cost`.
  - **Constraint**: Cannot modify occupied hexes without triggering `Combat` or `Displacement`.
- **Biome Shift**: Change `arid` to `fertile` (or vice-versa).
  - **Cost**: High `Belief` upkeep per tick.

### 2.2 Natural Disasters
- **Lightning Strike**: Precise, high-damage single target.
- **Flood/Tsunami**: Area denial, washes away low-tier units.
- **Volcano**: Permanent terrain alteration, massive destruction.

### 2.3 Avatars
- The player can manifest a "God Avatar" (Titan/Beast).
- **Cost**: Requires a massive one-time `Belief` ritual + continuous upkeep.
- **Effect**: The Avatar is a controllable Super-Unit in the `147` tactical layer.

## 3. Moral Alignment
- **Benevolent Actions** (Healing, Rain): Increase `culture.cohesion` but reduce `fear`.
- **Malevolent Actions** (Sacrifice, Fireball): Increase `fear` (Coercive Legitimacy) but reduce `happiness`.
- **Alignment Shift**: Shifts the `ideology.drift_vector` of the worshipping population.

## 4. Integration (Hardened)
- **Tag Ownership**: All miracles must carry the `Divine` methodological tag and a corresponding elemental/effect tag (Spec 156).
- **Faith Competition**: If an opposing God performs a miracle in your territory, your `Belief` drops unless countered.
- **Shrines**: Buildings that act as "Relays" for divine power, extending the range of influence.

## Compliance Vector (v1)
Input:
- Worshippers: `10,000 Humans` (Tag: `[Divine_Worshipper]`, Faith: `500,000 PPM`)
- Miracle: `Rain` (Tags: `[Divine, Water, Transmutation]`, Base Cost: `100,000 Belief`)
- Current `governance.legitimacy`: `800,000 PPM`

Expected Output:
- `Belief_Income = mulPPM(10,000 * 500,000, 800,000) = 4,000,000 Units/Tick`.
- After `Rain` cast: `Global_Mana -= 100,000`.
- Target Hex Biome: `Arid -> Fertile`.
- `culture.cohesion` increases by `10,000 PPM`.
- Narrative log entry: "The Sky-Father answered the prayers of the valley."

## Unit Policy
