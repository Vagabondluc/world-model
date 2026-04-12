# 156 Magic Tag Taxonomy (#TAGS)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/specs/30-runtime-determinism/38-unified-tag-system.md`, `docs/brainstorm/150-magic-system-architecture.md`]
- `Owns`: [`magic tag registry`, `magic interaction matrix`, `spell-to-tag mapping rules`]
- `Writes`: [`tag instances on spells/units/zones`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/156-magic-tag-taxonomy.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a comprehensive, deterministic tag taxonomy for magic to enable emergent interactions, strategic depth, and systemic variety.

## 1. Magic Tag Registry (Draft)
Following the `38` unified tag system contract. Magic tags use `uint32` IDs in the **Core** range (`0x00000000 - 0x3FFFFFFF`).

### 1.1 Methodological Schools (The "How")
Defines the philosophical and mechanical approach to casting.

| Tag ID | Name | Description | Mechanical Impact |
|---|---|---|---|
| `0x00010001` | **Hermetic** | Structured, logic-based | High `Concentration`, `Prepared` required |
| `0x00010002` | **Shamanic** | Spirit negotiation, raw | `Environment` dependent, `Volatile` |
| `0x00010003` | **Divine** | Faith-derived, sanctioned | `Belief_PPM` fueled, `Alignment` bound |
| `0x00010004` | **Ritual** | Time-intensive, communal | `Ticks` based, high `Complexity_PPM` |
| `0x00010005` | **Psionic** | Internal, mental focus | `Willpower` cost, no physical components |
| `0x00010006` | **Blood** | Vitality-driven, sacrificial | `HP` cost, high `Entropy` |

### 1.2 Elemental Affinity (The "What")
The 8-element cycle with systemic cross-over.

| Tag ID | Name | Counter Element | Synergy Partner |
|---|---|---|---|
| `0x00010101` | **Fire** | Water | Air (Firestorm) |
| `0x00010102` | **Ice** | Fire | Water (Freeze) |
| `0x00010103` | **Wind** | Earth | Fire (Spread) |
| `0x00010104` | **Earth** | Wind | Nature (Growth) |
| `0x00010105` | **Lightning** | Water | Metal (Conduct) |
| `0x00010106` | **Water** | Lightning | Ice (Mist) |
| `0x00010107` | **Holy** | Dark | Spirit (Sanctify) |
| `0x00010108` | **Dark** | Holy | Shadow (Entropy) |

### 1.3 Effect Categories (The "Result")
Standardizes what a spell *does* for systemic response.

| Tag ID | Name | Description |
|---|---|---|
| `0x00010201` | **Evocation** | Energy creation, direct damage |
| `0x00010202` | **Abjuration** | Protection, wards, dispelling |
| `0x00010203` | **Conjuration** | Summoning, physical manifestation |
| `0x00010204` | **Transmutation** | Property alteration, shape-shifting |
| `0x00010205` | **Divination** | Information, foresight, scrying |
| `0x00010206` | **Necromancy** | Life/Death manipulation, entropy |

## 2. Interaction Matrix (Hardened)
Tags are not just labels; they drive the `TagInteractionMatrix` (Spec 38).

### 2.1 Environmental Emergence
| Tag A | Tag B (Env) | Resulting Effect | Reason Code |
|---|---|---|---|
| `Fire` | `Wet` | `Steam_Cloud` (Blindness) | `880201` |
| `Lightning` | `Water` | `AoE_Shock` (Paralysis) | `880202` |
| `Earth` | `Muddy` | `Quicksand` (Rooted) | `880203` |
| `Ice` | `Rocky` | `Slippery` (Move Penalty) | `880204` |

### 2.2 School Synergies
| Tag A | Tag B | Synergy Bonus |
|---|---|---|
| `Hermetic` | `Ritual` | +20% `Stability` (lower fail rate) |
| `Shamanic` | `Nature` | +15% `Efficiency` in Biome |
| `Blood` | `Dark` | +30% `Lethality` |
| `Divine` | `Holy` | +50% `Miracle_Chance` |

## 3. Spell Tagging Rules
Every spell object must declare at least **3 tags**:
1. 1x **Methodological** (`0x000100xx`)
2. 1x **Elemental** (`0x000101xx`)
3. 1x **Effect** (`0x000102xx`)

**Example: "Fireball"**
- Tags: `[Hermetic, Fire, Evocation]`
- Intensity: `1,000,000 PPM` (Standard)

**Example: "Rain Dance"**
- Tags: `[Shamanic, Water, Ritual]`
- Intensity: `500,000 PPM` (Weak)

## 4. Determinism & Integrity
- **Tag Collision**: Checked at boot time against `TagRegistryV1`.
- **Propagation**: Magic tags on a region (e.g., `Leyline_Saturation`) propagate to creatures via `biome_to_species` edge (Spec 38).
- **Tie-Breaking**: If two magical tags conflict, use the primary sort from Spec 38 (Highest intensity).

## 5. Compliance Vector (v1)
Input:
- Caster: `Elf_Wizard` (Tags: `[Hermetic, Intellect_Focus]`)
- Spell: `Lightning_Bolt` (Tags: `[Hermetic, Lightning, Evocation]`)
- Environment: `Rainy_Hex` (Tag: `[Wet]`)

Expected Output:
- `TagInteractionMatrix` triggers `Lightning + Wet`.
- Effect: Damage multiplied by `1.5x`, AoE radius expanded by 1 hex.
- Reason code `880202` (AoE Shock) emitted.
- Replay remains identical on all clients.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.
