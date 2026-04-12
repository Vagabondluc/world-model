
import * as THREE from 'three';
import { Voxel, VoxelMaterial } from '../../types';

export interface VoxelHit {
  voxel: Voxel;
  normal: THREE.Vector3;
  adjacent: { x: number, y: number, z: number };
}

/**
 * Fast Voxel Raycaster
 * Finds the first intersection between a ray and a sparse voxel set.
 */
export function raycastVoxels(
  ray: THREE.Ray,
  voxels: Voxel[],
  maxDistance: number = 100
): VoxelHit | null {
  const voxelMap = new Map<string, Voxel>();
  voxels.forEach(v => voxelMap.set(`${v.x},${v.y},${v.z}`, v));

  // Fast voxel traversal algorithm (Amanatides-Woo)
  const start = ray.origin.clone();
  const dir = ray.direction.clone();

  let x = Math.floor(start.x);
  let y = Math.floor(start.y);
  let z = Math.floor(start.z);

  const stepX = dir.x > 0 ? 1 : -1;
  const stepY = dir.y > 0 ? 1 : -1;
  const stepZ = dir.z > 0 ? 1 : -1;

  // Fix: Changed const to let for tMax variables as they are updated in the traversal loop
  let tMaxX = dir.x !== 0 ? (Math.floor(start.x + (dir.x > 0 ? 1 : 0)) - start.x) / dir.x : Infinity;
  let tMaxY = dir.y !== 0 ? (Math.floor(start.y + (dir.y > 0 ? 1 : 0)) - start.y) / dir.y : Infinity;
  let tMaxZ = dir.z !== 0 ? (Math.floor(start.z + (dir.z > 0 ? 1 : 0)) - start.z) / dir.z : Infinity;

  const tDeltaX = dir.x !== 0 ? stepX / dir.x : Infinity;
  const tDeltaY = dir.y !== 0 ? stepY / dir.y : Infinity;
  const tDeltaZ = dir.z !== 0 ? stepZ / dir.z : Infinity;

  let t = 0;
  const normal = new THREE.Vector3();

  while (t < maxDistance) {
    const key = `${x},${y},${z}`;
    const hitVoxel = voxelMap.get(key);
    
    if (hitVoxel && hitVoxel.material !== VoxelMaterial.AIR) {
      return {
        voxel: hitVoxel,
        normal,
        adjacent: { x: x + normal.x, y: y + normal.y, z: z + normal.z }
      };
    }

    if (tMaxX < tMaxY) {
      if (tMaxX < tMaxZ) {
        t = tMaxX;
        tMaxX += tDeltaX;
        x += stepX;
        normal.set(-stepX, 0, 0);
      } else {
        t = tMaxZ;
        tMaxZ += tDeltaZ;
        z += stepZ;
        normal.set(0, 0, -stepZ);
      }
    } else {
      if (tMaxY < tMaxZ) {
        t = tMaxY;
        tMaxY += tDeltaY;
        y += stepY;
        normal.set(0, -stepY, 0);
      } else {
        t = tMaxZ;
        tMaxZ += tDeltaZ;
        z += stepZ;
        normal.set(0, 0, -stepZ);
      }
    }
  }

  return null;
}

/**
 * Fast Voxel Point Test
 * Returns true if a point is inside a solid voxel.
 */
export function isPointSolid(point: THREE.Vector3, voxels: Voxel[]): boolean {
  const vx = Math.round(point.x);
  const vy = Math.round(point.y);
  const vz = Math.round(point.z);
  return voxels.some(v => v.x === vx && v.y === vy && v.z === vz && v.material !== VoxelMaterial.AIR);
}
