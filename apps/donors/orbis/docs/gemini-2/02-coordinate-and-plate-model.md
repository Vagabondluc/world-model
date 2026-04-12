# Coordinate and Plate Model

## Voxel Sphere Model
To avoid polar singularities of naive UV spheres, use one of:
- Fibonacci sphere distribution
- Cube-sphere normalized mapping

Generate only crust-shell voxels:
- include voxels where `innerRadius < d < outerRadius`
- avoid full-solid sphere memory cost

## Voxel State

```ts
type Voxel = {
  position: { x: number; y: number; z: number };
  type: string;
  state: Record<string, unknown>;
};
```

## Plate Generation
Use noise-weighted flood fill (Dijkstra-like) for organic boundaries.

Steps:
1. Seed `N` plate nuclei on the sphere.
2. Build static noise field as expansion resistance.
3. Expand plate ownership by priority cost:
   - `cost = 1 + noiseValue * weight`
4. Stop when shell ownership coverage is complete.

Result:
- jagged, natural boundary topology
- non-linear borders and coastline-like contours

## Plate Contract

```ts
type Plate = {
  id: number;
  center: { x: number; y: number; z: number };
  driftAxis: { x: number; y: number; z: number };
  velocity: number; // radians per tick
  color: string;
};
```
