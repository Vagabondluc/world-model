# TypeScript Voxel Core

## Goal
Provide a minimal deterministic base for:
- chunked storage
- infinite world coordinates
- explicit world-space and voxel-space conversions
- fast get/set and neighbor logic

## Canonical Spaces (v1)
- World space: meters (`worldX/worldY/worldZ`)
- Voxel index space: integers (`vx/vy/vz`)
- Chunk-local space: integers in `[0, CHUNK_SIZE-1]`

Conversion:
- `vx = floor(worldX / metersPerVoxel)`
- `worldX = vx * metersPerVoxel`

## Core Types

```ts
export type VoxelId = number; // 0 = empty
export const CHUNK_SIZE = 16;

export type VoxelScale = {
  metersPerVoxel: number;
};
```

## Chunk

Use a flat typed array for cache-friendly storage.

```ts
export class Chunk {
  voxels: Uint16Array;

  constructor() {
    this.voxels = new Uint16Array(CHUNK_SIZE ** 3);
  }

  index(x: number, y: number, z: number): number {
    return x + CHUNK_SIZE * (y + CHUNK_SIZE * z);
  }

  get(x: number, y: number, z: number): VoxelId {
    return this.voxels[this.index(x, y, z)];
  }

  set(x: number, y: number, z: number, v: VoxelId) {
    this.voxels[this.index(x, y, z)] = v;
  }
}
```

Memory at `16^3` and `Uint16`:
- 4096 cells * 2 bytes = 8 KB per chunk

## World Container (Voxel Index Space)

```ts
export type ChunkKey = string;

function key(cx: number, cy: number, cz: number): ChunkKey {
  return `${cx},${cy},${cz}`;
}

function floorDiv(n: number, size: number) {
  return Math.floor(n / size);
}

function mod(n: number, size: number) {
  return ((n % size) + size) % size;
}

export class VoxelWorld {
  chunks = new Map<ChunkKey, Chunk>();
  scale: VoxelScale;

  constructor(scale: VoxelScale) {
    this.scale = scale;
  }

  getChunk(cx: number, cy: number, cz: number): Chunk {
    const k = key(cx, cy, cz);
    let c = this.chunks.get(k);
    if (!c) {
      c = new Chunk();
      this.chunks.set(k, c);
    }
    return c;
  }

  getVoxelByIndex(vx: number, vy: number, vz: number): VoxelId {
    const cx = floorDiv(vx, CHUNK_SIZE);
    const cy = floorDiv(vy, CHUNK_SIZE);
    const cz = floorDiv(vz, CHUNK_SIZE);
    const lx = mod(vx, CHUNK_SIZE);
    const ly = mod(vy, CHUNK_SIZE);
    const lz = mod(vz, CHUNK_SIZE);
    return this.getChunk(cx, cy, cz).get(lx, ly, lz);
  }

  setVoxelByIndex(vx: number, vy: number, vz: number, v: VoxelId) {
    const cx = floorDiv(vx, CHUNK_SIZE);
    const cy = floorDiv(vy, CHUNK_SIZE);
    const cz = floorDiv(vz, CHUNK_SIZE);
    const lx = mod(vx, CHUNK_SIZE);
    const ly = mod(vy, CHUNK_SIZE);
    const lz = mod(vz, CHUNK_SIZE);
    this.getChunk(cx, cy, cz).set(lx, ly, lz, v);
  }

  getVoxelAtWorld(worldX: number, worldY: number, worldZ: number): VoxelId {
    const vx = Math.floor(worldX / this.scale.metersPerVoxel);
    const vy = Math.floor(worldY / this.scale.metersPerVoxel);
    const vz = Math.floor(worldZ / this.scale.metersPerVoxel);
    return this.getVoxelByIndex(vx, vy, vz);
  }

  setVoxelAtWorld(worldX: number, worldY: number, worldZ: number, v: VoxelId) {
    const vx = Math.floor(worldX / this.scale.metersPerVoxel);
    const vy = Math.floor(worldY / this.scale.metersPerVoxel);
    const vz = Math.floor(worldZ / this.scale.metersPerVoxel);
    this.setVoxelByIndex(vx, vy, vz, v);
  }
}
```

## Example Usage

```ts
const world = new VoxelWorld({ metersPerVoxel: 1 });

// world-space write/read (meters)
world.setVoxelAtWorld(0, 0, 0, 1);
console.log(world.getVoxelAtWorld(0, 0, 0)); // 1

// index-space write/read (voxel indices)
world.setVoxelByIndex(4, 2, -3, 2);
console.log(world.getVoxelByIndex(4, 2, -3)); // 2
```

## 6-Connected Neighbor Directions

```ts
export const DIRS_6 = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
] as const;
```

Use for:
- face visibility
- flood fill
- pathfinding
- spread simulation

## Notes
- Keep terrain generation rules in world-space (see `docs/03-hex-to-voxel-pipeline.md`).
- Use index-space APIs for storage internals and meshing iteration.
