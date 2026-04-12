
import { Voxel, VoxelMaterial } from '../../types';
import { TacticalMap, TacticalCell, CoverType, TerrainType } from '../../core/tactical/types';

// Constants
const CELL_SIZE = 1.5; // 1.5 meters ~= 5 feet
const COVER_HEIGHT_LOW = 0.5;
const COVER_HEIGHT_HIGH = 1.8;

export class TacticalProjector {
  
  /**
   * Projects a sparse voxel chunk into a 2D tactical grid.
   */
  public static project(voxels: Voxel[], chunkRadius: number): TacticalMap {
    if (voxels.length === 0) return this.createEmptyMap();

    // 1. Determine Bounds
    const min = -chunkRadius;
    const max = chunkRadius;
    const widthMeters = (max - min) + 1; // Approx width
    
    // Grid Dimensions
    const gridWidth = Math.ceil(widthMeters / CELL_SIZE);
    const gridHeight = Math.ceil(widthMeters / CELL_SIZE);
    
    // 2. Spatial Index for fast voxel lookup
    // Map: `x,z` -> Voxel[] (column)
    const columns = new Map<string, Voxel[]>();
    
    for (const v of voxels) {
        // Optimization: Key by integer coordinates
        const key = `${v.x},${v.z}`;
        if (!columns.has(key)) columns.set(key, []);
        columns.get(key)!.push(v);
    }

    // Sort columns by Y ascending for logic
    for (const col of columns.values()) {
        col.sort((a, b) => a.y - b.y);
    }

    const cells: TacticalCell[] = [];

    // 3. Iterate Grid Cells
    for (let gz = 0; gz < gridHeight; gz++) {
      for (let gx = 0; gx < gridWidth; gx++) {
        // Calculate world bounds for this cell
        // Grid is centered on 0,0 world
        const worldXStart = (gx * CELL_SIZE) - (widthMeters / 2);
        const worldZStart = (gz * CELL_SIZE) - (widthMeters / 2);
        const worldXEnd = worldXStart + CELL_SIZE;
        const worldZEnd = worldZStart + CELL_SIZE;

        // Sample voxels within this footprint
        let maxFloorY = -Infinity;
        let dominantMat = VoxelMaterial.AIR;
        let obstacles: Voxel[] = [];

        // Iterate voxels in the footprint (approximate)
        const vxStart = Math.floor(worldXStart);
        const vxEnd = Math.ceil(worldXEnd);
        const vzStart = Math.floor(worldZStart);
        const vzEnd = Math.ceil(worldZEnd);

        for (let vx = vxStart; vx < vxEnd; vx++) {
            for (let vz = vzStart; vz < vzEnd; vz++) {
                const col = columns.get(`${vx},${vz}`);
                if (!col) continue;

                // Find the highest "surface" voxel in this column
                // Logic: Highest solid voxel that has air above it
                for (let i = col.length - 1; i >= 0; i--) {
                    const v = col[i];
                    if (v.isSurface) {
                        if (v.y > maxFloorY) {
                            maxFloorY = v.y;
                            dominantMat = v.material;
                        }
                    }
                    // Collect obstacles above the current floor candidate
                    if (v.y > maxFloorY) {
                         obstacles.push(v);
                    }
                }
            }
        }

        if (maxFloorY === -Infinity) continue; // Empty cell

        // Analyze Cover
        let cover = CoverType.None;
        let obstacleCount = 0;
        
        for (const obs of obstacles) {
            const h = obs.y - maxFloorY;
            if (h > COVER_HEIGHT_LOW && h < 2.5) { // Relevant cover height
                obstacleCount++;
            }
        }
        
        // Heuristic: If enough voxels impede, it's cover
        if (obstacleCount > 2) cover = CoverType.Half;
        if (obstacleCount > 5) cover = CoverType.Full;

        // Analyze Terrain
        let terrain = TerrainType.Normal;
        if (dominantMat === VoxelMaterial.WATER || dominantMat === VoxelMaterial.MUD) terrain = TerrainType.Difficult;
        if (dominantMat === VoxelMaterial.MAGMA) terrain = TerrainType.Hazardous;
        if (dominantMat === VoxelMaterial.BEDROCK) terrain = TerrainType.Impassable;

        cells.push({
            x: gx, 
            z: gz,
            worldX: worldXStart + CELL_SIZE/2,
            worldY: maxFloorY,
            worldZ: worldZStart + CELL_SIZE/2,
            height: maxFloorY,
            cover,
            terrain,
            dominantMaterial: dominantMat
        });
      }
    }

    return {
        cells,
        width: gridWidth,
        height: gridHeight,
        cellSize: CELL_SIZE
    };
  }

  private static createEmptyMap(): TacticalMap {
      return { cells: [], width: 0, height: 0, cellSize: CELL_SIZE };
  }
}
