# System Overview

## Scope
Curated from `Google Gemini 2.pdf` as a technical specification for a spherical tectonic voxel engine in Three.js/WebGL.

## Core Concept
A spherical voxel crust with dynamic tectonic plates drives:
- terrain deformation (mountains, rifts, faults)
- thermal systems (magma belts)
- ecology/resource distribution (risk/reward gradients)

## Philosophy
- Geology drives ecology.
- The planet is volumetric, not a heightmap skin.
- Plate interaction is first-order simulation authority.

## High-Level Subsystems
1. Coordinate and crust-shell voxel model
2. Organic plate generation
3. Boundary stress/kinematics
4. Deformation + volcanic belt logic
5. Resource/ecology placement
6. Instanced rendering + update optimization

## Recommended Runtime Layers
- `Simulation`: plate drift, stress, deformation, heat propagation
- `Generation`: resources/ecology probabilities from simulation fields
- `Rendering`: instanced geometry and shader state
- `Streaming`: chunk/face-level active region updates
