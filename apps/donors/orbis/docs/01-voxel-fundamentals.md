# Voxel Fundamentals

## What is a Voxel?
A voxel ("volume pixel") is a 3D sample at `(x, y, z)`.  
Pixels store image color in 2D; voxels store matter/state in 3D.

## Two Common Models

### 1. Block/Grid Voxels
- Fixed cubic cells on a regular grid.
- Common cell fields:
  - material id
  - density/solid flag
  - temperature/moisture
  - light/radiation
  - ownership/faction tags

Strengths:
- Simple math and neighborhood queries
- Deterministic behavior
- Easy serialization and chunk streaming

Costs:
- Memory-heavy at scale
- Blocky visuals without meshing
- Requires chunking/LOD for large worlds

### 2. Volumetric/Density Voxels
- Store a scalar density field (not just block IDs).
- Surfaces extracted with algorithms like Marching Cubes.

Strengths:
- Organic terrain and smooth forms
- Better for caves/erosion-style geometry

Costs:
- More expensive meshing/math
- Harder edit pipeline
- Rebuild costs for modified regions

## Mental Model
- Pixel world: paint an image.
- Voxel world: sculpt matter.

## Typical Uses
- Destructible terrain
- Procedural world generation
- Simulation layers (fluids/gases/visibility)
- Medical/scientific volumetric data

## Game Design Choice
- Block world: readability and low cost
- Smooth world: realism and shape fidelity
- Hybrid: block gameplay + smooth render abstractions
