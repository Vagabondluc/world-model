
import { Voxel, VoxelMaterial } from '../../types';

export interface PathNode {
  x: number;
  z: number;
  y: number;
  cost: number;
  g: number;
  h: number;
  parent: PathNode | null;
}

/**
 * A* Pathfinding for the Tactical Voxel Grid
 */
export const findPath = (
  start: { x: number, z: number },
  end: { x: number, z: number },
  voxels: Voxel[]
): PathNode[] => {
  const surfaceVoxels = voxels.filter(v => v.isSurface);
  const grid = new Map<string, Voxel>();
  surfaceVoxels.forEach(v => grid.set(`${v.x},${v.z}`, v));

  const openList: PathNode[] = [];
  const closedList = new Set<string>();

  const startVoxel = grid.get(`${start.x},${start.z}`);
  const endVoxel = grid.get(`${end.x},${end.z}`);

  if (!startVoxel || !endVoxel) return [];

  openList.push({
    x: start.x,
    z: start.z,
    y: startVoxel.y,
    cost: startVoxel.semantic?.movementCost ?? 1,
    g: 0,
    h: Math.abs(start.x - end.x) + Math.abs(start.z - end.z),
    parent: null
  });

  while (openList.length > 0) {
    openList.sort((a, b) => (a.g + a.h) - (b.g + b.h));
    const current = openList.shift()!;
    const currentKey = `${current.x},${current.z}`;

    if (current.x === end.x && current.z === end.z) {
      const path: PathNode[] = [];
      let temp: PathNode | null = current;
      while (temp) {
        path.push(temp);
        temp = temp.parent;
      }
      return path.reverse();
    }

    closedList.add(currentKey);

    const neighbors = [
      { x: 0, z: 1 }, { x: 0, z: -1 }, { x: 1, z: 0 }, { x: -1, z: 0 },
      { x: 1, z: 1 }, { x: 1, z: -1 }, { x: -1, z: 1 }, { x: -1, z: -1 }
    ];

    for (const offset of neighbors) {
      const nx = current.x + offset.x;
      const nz = current.z + offset.z;
      const nKey = `${nx},${nz}`;

      if (closedList.has(nKey)) continue;

      const nVoxel = grid.get(nKey);
      if (!nVoxel) continue;
      // Height check: Can't climb walls > 1m (approx 1 block)
      if (Math.abs(nVoxel.y - current.y) > 1) continue;

      const moveCost = (offset.x !== 0 && offset.z !== 0) ? 1.414 : 1.0;
      const terrainCost = nVoxel.semantic?.movementCost ?? 1;
      const g = current.g + moveCost * terrainCost;
      const h = Math.abs(nx - end.x) + Math.abs(nz - end.z);

      const existing = openList.find(node => node.x === nx && node.z === nz);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.parent = current;
        }
      } else {
        openList.push({ x: nx, z: nz, y: nVoxel.y, cost: terrainCost, g, h, parent: current });
      }
    }
  }
  return [];
};

/**
 * BFS to find all reachable nodes within a certain cost limit (Movement Range)
 */
export const findRange = (
  start: { x: number, z: number },
  maxCost: number,
  voxels: Voxel[]
): { x: number, z: number, y: number }[] => {
  const surfaceVoxels = voxels.filter(v => v.isSurface);
  const grid = new Map<string, Voxel>();
  surfaceVoxels.forEach(v => grid.set(`${v.x},${v.z}`, v));

  const startVoxel = grid.get(`${start.x},${start.z}`);
  if (!startVoxel) return [];

  const reachable: { x: number, z: number, y: number, g: number }[] = [];
  const visited = new Map<string, number>();

  const queue: { x: number, z: number, y: number, g: number }[] = [{ 
    x: start.x, z: start.z, y: startVoxel.y, g: 0 
  }];
  visited.set(`${start.x},${start.z}`, 0);

  const neighbors = [
    { x: 0, z: 1 }, { x: 0, z: -1 }, { x: 1, z: 0 }, { x: -1, z: 0 },
    { x: 1, z: 1 }, { x: 1, z: -1 }, { x: -1, z: 1 }, { x: -1, z: -1 }
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    reachable.push(current);

    for (const offset of neighbors) {
      const nx = current.x + offset.x;
      const nz = current.z + offset.z;
      const nKey = `${nx},${nz}`;

      const nVoxel = grid.get(nKey);
      if (!nVoxel || Math.abs(nVoxel.y - current.y) > 1) continue;

      const moveCost = (offset.x !== 0 && offset.z !== 0) ? 1.414 : 1.0;
      const terrainCost = nVoxel.semantic?.movementCost ?? 1;
      const totalG = current.g + moveCost * terrainCost;

      if (totalG <= maxCost) {
        const prevG = visited.get(nKey);
        if (prevG === undefined || totalG < prevG) {
          visited.set(nKey, totalG);
          queue.push({ x: nx, z: nz, y: nVoxel.y, g: totalG });
        }
      }
    }
  }

  return reachable;
};
