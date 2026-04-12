
import { create } from 'zustand';
import { RegionDeclaration, HexData } from '../types';
import { generateInherentRegions } from '../services/semanticResolver';

interface RegionState {
  regions: RegionDeclaration[];
  
  // Actions
  initializeRegions: (hexes: HexData[]) => void;
  addRegion: (region: RegionDeclaration) => void;
  removeRegion: (id: string) => void;
  clearRegions: () => void;
}

export const useRegionStore = create<RegionState>((set) => ({
  regions: [],

  initializeRegions: (hexes) => {
    const inherent = generateInherentRegions(hexes);
    set({ regions: inherent });
  },

  addRegion: (region) => set((state) => ({ regions: [...state.regions, region] })),
  
  removeRegion: (id) => set((state) => ({ regions: state.regions.filter(r => r.id !== id) })),
  
  clearRegions: () => set({ regions: [] }),
}));
