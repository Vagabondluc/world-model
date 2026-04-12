# Tectonics, Heat, and Ecology

## Boundary Detection
A voxel is boundary-active if any of its 6 cardinal neighbors belongs to a different plate ID.

## Stress Computation
At boundary voxels, compute interaction/stress scalar/vector from neighboring plate motion projected against boundary normal.

Classify deformation by stress sign/magnitude:
- Convergent: uplift/mountain formation
- Divergent: crust thinning/rift and magma exposure
- Transform: lateral shear/fault activity

## Volcanic Belt System
Heat sources:
- divergent boundaries
- high-stress convergent zones (subduction-like behavior)

Heat propagation:
- decays with distance from source (inverse-square style in source concept)
- drives emissive magma visualization thresholds

Eruption trigger:
- if stress exceeds critical limit:
  - spawn new basalt/obsidian voxels
  - reduce/reset local stress

## Resource Logic
Resource probability increases with tectonic pressure/stress fields.

Guidelines:
- metals/gold in deep high-pressure convergent columns
- crystalline resources on high-stress fault lines

## Ecology Logic
Ecology probability should be tied to heat + survivability, not random biome painting.

Risk/reward model:
- danger score from stress/heat proximity
- sustainability score from eruption frequency stability
- viable zones are high energy but not constantly catastrophic

This produces “adjacent-to-volcanic” life bands rather than life directly in destructive cores.
