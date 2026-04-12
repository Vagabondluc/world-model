# Multi-Scale LOD Model

## Principle
All scales should answer different questions from one truth source.

- Authoritative levels store simulation state.
- Derived levels render/play from sampled authoritative state.

## Recommended Stack

| LOD | Name | Authority | Typical Size |
|---|---|---|---|
| L0 | Planet | Yes | Earth/global |
| L1 | Continent | Yes | Plate scale |
| L2 | Region | Yes | Hundreds of km |
| L3 | World Hex | Yes | ~40 km |
| L4 | Regional Hex | Yes | ~10 km |
| L5 | Local Hex | Yes | ~3 miles (~5 km) |
| L6 | Sub-Hex/Patch | No (Derived) | 100-500 m |
| L7 | Voxel Surface/Column | No (Derived) | 1-5 m |
| L8 | 5-ft Grid | No (Derived) | Combat projection |

## Authority Rule
Changes below L5 do not propagate upward automatically.

This prevents simulation instability and keeps persistence manageable.

## Edit Lifecycle (v1 Frozen)
All edits below L5 must carry lifecycle state:
- `ephemeral`: runtime only, discarded on unload.
- `persistent_local`: saved as local overlay/delta, not authority.
- `candidate_authority`: proposed for promotion to L5 authority.
- `accepted_authority`: merged into L5 inputs and rebaked.

Promotion policy:
1. Derived edit is recorded in local delta log.
2. Validation checks budget and rule constraints.
3. Approved changes produce an authority patch.
4. Affected baked textures and local voxel views are regenerated deterministically.

No implicit upward propagation is allowed.

## Scale Adaptation
Rules stay stable; representation changes:
- Resolution
- Noise frequency/amplitude
- Density of surface objects
- Vertical exaggeration

Macro terrain identity should remain stable across zoom levels.

## Rendering Layers
Sprites/2.5D are presentation outputs, not simulation authority.

Suggested sprite layers:
- `GROUND`
- `VEGETATION`
- `STRUCTURE`
- `FEATURE`
- `OVERLAY`

## 5-ft Grid Derivation
Combat grid should be generated from local sampled terrain:
1. Sample local height/slope/water/biome
2. Classify movement/terrain tags
3. Snap to 5-ft logical cells

Do not run heavy geology/erosion logic at this scale.
