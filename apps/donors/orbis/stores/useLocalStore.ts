
import { create } from 'zustand';
import { Voxel, HexData, TerrainConfig, RegionDeclaration } from '../types';
import { generateVoxelChunk, generateRegionVoxelChunk } from '../services/terrainSystem';
import { VoxelConfigSchema } from '../schemas/configSchemas';
import { findPath, findRange, PathNode } from '../services/tactical/pathfinding';
import { useWorldStore } from './useWorldStore'; 
import { TacticalProjector } from '../services/tactical/TacticalProjector';
import { TacticalMap } from '../core/tactical/types';

interface LocalState {
  voxels: Voxel[];
  isLoading: boolean;
  resolution: number;
  inspectMode: 'SINGLE' | 'REGION';
  
  // Tactical State
  tacticalMap: TacticalMap | null;
  pathStart: { x: number, z: number } | null;
  pathEnd: { x: number, z: number } | null;
  calculatedPath: PathNode[];
  movementRange: { x: number, z: number, y: number }[];
  hoveredVoxel: { x: number, y: number, z: number } | null;
  actionPoints: number;

  // Actions
  hydrateVoxelChunk: (hexId: string, config: TerrainConfig, regions: RegionDeclaration[]) => void;
  updateResolution: (res: number) => void;
  setInspectMode: (mode: 'SINGLE' | 'REGION') => void;
  resetLocal: () => void;
  
  setPathStart: (pos: { x: number, z: number } | null) => void;
  setPathEnd: (pos: { x: number, z: number } | null) => void;
  setHoveredVoxel: (pos: { x: number, y: number, z: number } | null) => void;
  setActionPoints: (ap: number) => void;
  calculatePath: () => void;
  calculateMovementRange: () => void;
  clearTactical: () => void;
}

export const useLocalStore = create<LocalState>((set, get) => ({
  voxels: [],
  isLoading: false,
  resolution: 24,
  inspectMode: 'SINGLE',
  
  tacticalMap: null,
  pathStart: null,
  pathEnd: null,
  calculatedPath: [],
  movementRange: [],
  hoveredVoxel: null,
  actionPoints: 30, // D&D Default: 30ft

  updateResolution: (res) => {
    const result = VoxelConfigSchema.safeParse({ resolution: res });
    if (result.success) {
      set({ resolution: result.data.resolution });
    }
  },

  setInspectMode: (mode) => set({ inspectMode: mode }),

  hydrateVoxelChunk: (hexId, config, regions) => {
    set({ isLoading: true, calculatedPath: [], movementRange: [], pathStart: null, pathEnd: null, tacticalMap: null });
    
    const { hexes } = useWorldStore.getState();
    const hex = hexes.find(h => h.id === hexId);

    if (!hex) {
        set({ voxels: [], isLoading: false });
        return;
    }

    const timer = setTimeout(() => {
      try {
        const { resolution, inspectMode } = get();
        
        let voxels: Voxel[] = [];
        let chunkRadius = Math.floor(resolution / 2);
        
        if (inspectMode === 'REGION') {
            const neighbors = hex.neighbors.map(nid => hexes.find(h => h.id === nid)).filter(h => h !== undefined) as HexData[];
            voxels = generateRegionVoxelChunk(hex, neighbors, resolution, config, regions);
            chunkRadius = Math.floor(resolution * 1.5); // Approx for region
        } else {
            voxels = generateVoxelChunk(hex, resolution, config, regions);
        }

        // Project Tactical Map
        const tacticalMap = TacticalProjector.project(voxels, chunkRadius);

        set({ voxels, tacticalMap, isLoading: false });
      } catch (error) {
        console.error('[Orbis] Voxel Hydration Failed:', error);
        set({ voxels: [], tacticalMap: null, isLoading: false });
      }
    }, 30);
  },

  resetLocal: () => set({ voxels: [], isLoading: false, calculatedPath: [], movementRange: [], pathStart: null, pathEnd: null, tacticalMap: null }),

  setPathStart: (pos) => {
    set({ pathStart: pos, pathEnd: null, calculatedPath: [] });
    if (pos) get().calculateMovementRange();
  },
  
  setPathEnd: (pos) => {
    set({ pathEnd: pos });
    if (pos && get().pathStart) {
      get().calculatePath();
    }
  },
  
  setHoveredVoxel: (pos) => set({ hoveredVoxel: pos }),
  
  setActionPoints: (ap) => {
    set({ actionPoints: ap });
    if (get().pathStart) get().calculateMovementRange();
  },

  calculatePath: () => {
    const { pathStart, pathEnd, voxels } = get();
    if (!pathStart || !pathEnd) return;
    const path = findPath(pathStart, pathEnd, voxels);
    set({ calculatedPath: path });
  },

  calculateMovementRange: () => {
    const { pathStart, voxels, actionPoints } = get();
    if (!pathStart) return;
    const range = findRange(pathStart, actionPoints / 5, voxels); 
    set({ movementRange: range });
  },

  clearTactical: () => set({ pathStart: null, pathEnd: null, calculatedPath: [], movementRange: [] })
}));
