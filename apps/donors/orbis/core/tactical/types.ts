
import { VoxelMaterial } from '../../types';

export enum CoverType {
  None = 0,
  Half = 1,
  Full = 2
}

export enum TerrainType {
  Normal = 0,
  Difficult = 1,
  Hazardous = 2,
  Impassable = 3
}

export interface TacticalCell {
  // Grid coordinates (5ft / 1.5m grid)
  x: number;
  z: number;
  
  // World space (center of cell)
  worldX: number;
  worldY: number;
  worldZ: number;

  // Gameplay data
  height: number;       // Floor Y level
  cover: CoverType;
  terrain: TerrainType;
  dominantMaterial: VoxelMaterial;
}

export interface TacticalMap {
  cells: TacticalCell[];
  width: number;
  height: number;
  cellSize: number; // e.g. 1.5 meters
}
