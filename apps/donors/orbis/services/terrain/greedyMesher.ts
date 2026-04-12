
import * as THREE from 'three';
import { Voxel, VoxelMaterial } from '../../types';

/**
 * Greedy Mesher
 * Converts a sparse list of voxels into optimized geometries by merging 
 * adjacent coplanar faces of the same material.
 */

interface MeshData {
  positions: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
}

export const generateGreedyMesh = (voxels: Voxel[]): Map<VoxelMaterial, THREE.BufferGeometry> => {
  const geometries = new Map<VoxelMaterial, THREE.BufferGeometry>();
  if (voxels.length === 0) return geometries;

  // 1. Group voxels by material
  const materialGroups = new Map<VoxelMaterial, Voxel[]>();
  voxels.forEach(v => {
    if (!materialGroups.has(v.material)) materialGroups.set(v.material, []);
    materialGroups.get(v.material)!.push(v);
  });

  // 2. Process each material independently
  materialGroups.forEach((group, material) => {
    const data: MeshData = { positions: [], normals: [], uvs: [], indices: [] };
    
    // Build a local 3D grid for this material for easy indexing
    // Note: Tactical chunks are small (e.g., 24x24x64), so a Map or a safe Array is fine.
    const grid = new Map<string, Voxel>();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
    
    group.forEach(v => {
      grid.set(`${v.x},${v.y},${v.z}`, v);
      minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
      minZ = Math.min(minZ, v.z); maxZ = Math.max(maxZ, v.z);
    });

    // 3. For each of the 6 directions
    // 0: +x, 1: -x, 2: +y, 3: -y, 4: +z, 5: -z
    for (let d = 0; d < 6; d++) {
      const isBackFace = d % 2 === 1;
      const axis = Math.floor(d / 2); // 0:x, 1:y, 2:z
      const u = (axis + 1) % 3;
      const v = (axis + 2) % 3;
      
      const x = [0, 0, 0];
      const q = [0, 0, 0];
      q[axis] = 1;

      const mask = new Map<string, boolean>();

      // Iterate through the volume to find faces
      for (x[axis] = [minX, minY, minZ][axis]; x[axis] <= [maxX, maxY, maxZ][axis]; x[axis]++) {
        mask.clear();
        for (x[v] = [minX, minY, minZ][v]; x[v] <= [maxX, maxY, maxZ][v]; x[v]++) {
          for (x[u] = [minX, minY, minZ][u]; x[u] <= [maxX, maxY, maxZ][u]; x[u]++) {
            const voxel = grid.get(`${x[0]},${x[1]},${x[2]}`);
            if (voxel) {
              // Check if there is a neighbor in the target direction
              const neighbor = grid.get(`${x[0] + (isBackFace ? -q[0] : q[0])},${x[1] + (isBackFace ? -q[1] : q[1])},${x[2] + (isBackFace ? -q[2] : q[2])}`);
              if (!neighbor) {
                mask.set(`${x[u]},${x[v]}`, true);
              }
            }
          }
        }

        // Generate quads from the mask
        for (let j = [minX, minY, minZ][v]; j <= [maxX, maxY, maxZ][v]; j++) {
          for (let i = [minX, minY, minZ][u]; i <= [maxX, maxY, maxZ][u]; ) {
            if (mask.has(`${i},${j}`)) {
              // Compute width
              let w, h;
              for (w = 1; mask.has(`${i + w},${j}`); w++) {}
              
              // Compute height
              let done = false;
              for (h = 1; j + h <= [maxX, maxY, maxZ][v]; h++) {
                for (let k = 0; k < w; k++) {
                  if (!mask.has(`${i + k},${j + h}`)) {
                    done = true;
                    break;
                  }
                }
                if (done) break;
              }

              // Add quad
              x[u] = i; x[v] = j;
              const du = [0,0,0]; du[u] = w;
              const dv = [0,0,0]; dv[v] = h;

              const v0 = [x[0], x[1], x[2]];
              const v1 = [x[0] + du[0], x[1] + du[1], x[2] + du[2]];
              const v2 = [x[0] + du[0] + dv[0], x[1] + du[1] + dv[1], x[2] + du[2] + dv[2]];
              const v3 = [x[0] + dv[0], x[1] + dv[1], x[2] + dv[2]];

              // Offset for outward face
              if (!isBackFace) {
                v0[axis] += 1; v1[axis] += 1; v2[axis] += 1; v3[axis] += 1;
              }

              const baseIdx = data.positions.length / 3;
              data.positions.push(...v0, ...v1, ...v2, ...v3);
              
              const normal = [0,0,0]; 
              normal[axis] = isBackFace ? -1 : 1;
              data.normals.push(...normal, ...normal, ...normal, ...normal);
              
              data.uvs.push(0,0, w,0, w,h, 0,h);
              
              if (isBackFace) {
                data.indices.push(baseIdx, baseIdx + 2, baseIdx + 1, baseIdx, baseIdx + 3, baseIdx + 2);
              } else {
                data.indices.push(baseIdx, baseIdx + 1, baseIdx + 2, baseIdx, baseIdx + 2, baseIdx + 3);
              }

              // Clear processed area in mask
              for (let hy = 0; hy < h; hy++) {
                for (let wx = 0; wx < w; wx++) {
                  mask.delete(`${i + wx},${j + hy}`);
                }
              }
              i += w;
            } else {
              i++;
            }
          }
        }
      }
    }

    // 4. Create BufferGeometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(data.normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(data.uvs, 2));
    geometry.setIndex(data.indices);
    geometries.set(material, geometry);
  });

  return geometries;
};
