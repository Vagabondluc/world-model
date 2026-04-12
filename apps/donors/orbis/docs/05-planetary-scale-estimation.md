# Planetary Scale Estimation

## Why This Matters
Dense planetary voxelization grows too quickly.  
Use estimates before choosing storage strategy.

## Symbols
- `R`: planet radius
- `s`: voxel edge length
- `T`: shell thickness (if modeling only crust)

## Full Solid Planet (usually impractical)
Approximate voxel count:

`N ~= (4/3 * pi * R^3) / s^3`

For Earth-scale radii, even moderate `s` yields extreme counts.

## Crust/Shell Model (more realistic)
Approximate shell volume:

`V_shell ~= 4 * pi * R^2 * T`

Voxel count:

`N ~= V_shell / s^3`

This is much smaller than full-volume storage but still very large at fine resolution.

## Surface-Only Heightfield
Sample count:

`N ~= 4 * pi * R^2 / s^2`

This is why most planetary engines use:
- global 2D/hex authority
- local voxel realization on demand

## Multi-Resolution Guidance
- Dense pyramids are expensive even with mip levels.
- Sparse structures (octrees/clipmaps/chunk streaming) scale with active detail.
- Persist inputs/seeds/deltas, not full voxel state globally.

## Practical Rule
Do not voxelize the entire planet all the time.  
Voxelize interactable regions while keeping global truth in compact authority fields.
