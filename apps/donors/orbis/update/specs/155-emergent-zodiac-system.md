# 155 Emergent Zodiac System

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/141-cultural-drift-and-social-structures.md`, `docs/brainstorm/125-fantasy-race-unit-bestiary.md`, `docs/brainstorm/146-hardened-species-evolution-kernel.md`]
- `Owns`: [`zodiac generation algorithm`, `zodiac influence model`]
- `Writes`: [`cultural traits`, `auspicious timing modifiers`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/155-emergent-zodiac-system.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define an emergent astrological system where a society's zodiac animals, traits, and ruling elements are derived from the local fauna and ecology in their vicinity.

## 1. Zodiac Selection (Fauna-Based)
The zodiac is not scripted; it emerges when a civilization moves from **Phase 2 (Politics)** to **Phase 3 (Memory)** in the MVP roadmap.

### 1.1 The Selection Algorithm
1. **Vicinity Scan**: Identify the top 12 species with the highest `Population_Share` or `Historical_Relevance` within the civilization's territory.
2. **Local Equivalent Mapping** (Vietnamese Pattern):
   - Replace generic archetypes with local dominant species.
   - Example: No Tigers in biome? -> Use **Lion** or **Dire Wolf**.
   - Example: Near Water? -> Replace Ox with **Water Buffalo** or **Giant Crab**.
3. **Element Binding**: Each sign is assigned one of the 8 elements (Spec 150) based on the species' local habitat (e.g., Mountain species = Earth).

## 2. Character & Societal Traits (Hardened)
Each zodiac sign maps to a permanent **TagInstance** (Spec 38) assigned at birth.
- **Tag Namespace**: `ZodiacSign` (`0x000103xx`).
- **Intensity**: Fixed at `1,000,000 PPM`.

### 2.1 The Vietnamese Influence (Hardened)
- **Year of the Rat/Local Equiv**: Gains `Rat_Spirit` tag. Effect: `+100,000 Intelligence`, `+10% Resource_Efficiency`.
- **Year of the Buffalo/Local Equiv**: Gains `Buffalo_Spirit` tag. Effect: `+150,000 Strength`, `-50,000 Unrest`.
- **Year of the Cat/Local Equiv**: Gains `Cat_Spirit` tag. Effect: `+100,000 Diplomacy`, `+20% Narrative_Trust`.

## 3. Auspicious Timing (The "Fate" Modifier)
- **Matching Ticks**: If current `Tick % 12` matches a character's sign, they gain a `+25% Luck_Modifier` to all deterministic rolls (Spec 147).
- **In-Group Alignment**: Societies with high `culture.cohesion` (Spec 141) synchronized to their dominant zodiac signs gain a `+10% Asabiya` boost.

## 4. Deterministic Evolution
- **Iconography**: The zodiac icons are procedurally generated using the `unit_id` from the bestiary (`125`).
- **Persistence**: Once a zodiac system is established, it becomes a `Historical_Anchor`. Cultural drift can slowly "Update" signs, but the legacy traits remain in the `Save_Belief_State` (Spec 88).

## 5. Summary Matrix (Sample)
| Sign | Local Species | Element | Societal Role | Trait Bonus |
|---|---|---|---|---|
| 1 | Rat | Wood | Scholar | Intellect |
| 2 | Buffalo | Earth | Laborer | Stamina |
| 3 | Tiger | Fire | Warlord | Courage |
| 4 | Cat | Metal | Diplomat | Harmony |

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.
