# Rendering and Simulation Loop

## Rendering Strategy (Three.js)
Use `InstancedMesh` for large voxel counts.

Recommended:
- one shared `BoxGeometry`
- per-instance transform via `setMatrixAt`
- per-instance state color via `setColorAt`

Magma visualization:
- emissive shader path with animated pulse (`uTime`)
- bloom/post-processing required for readable heat-glow cues

## Spatial Update Optimization
- Partition sphere by cube-sphere faces or chunks.
- Recompute only dirty regions linked to active plate updates.
- Avoid full-scene mesh rebuild each tick.

## Simulation Step (Canonical Order)
1. Input step:
   - user-driven or automated plate drift updates
2. Physics step:
   - update plate vectors
   - recompute boundary stress
   - apply deformation (uplift/rift/fault)
3. Thermal/volcanic step:
   - propagate heat
   - trigger eruptions over threshold
4. Ecology/resource step:
   - update probability fields and spawned states
5. Render sync:
   - flush dirty instance transforms/colors/material flags

## Runtime Contracts
- Simulation fields are authority.
- Mesh state is a derived view.
- Determinism requires fixed-step integration and seeded noise.
