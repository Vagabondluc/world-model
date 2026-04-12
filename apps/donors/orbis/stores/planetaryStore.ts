import { create } from 'zustand';
import { MagnetosphereState, MagnetosphereDrivers } from '../core/schemas/planetary';
import { CarbonState } from '../core/schemas/carbon';

interface PlanetaryState {
  magnetosphere: MagnetosphereState | null;
  carbon: CarbonState | null;
  
  // Actions
  setMagnetosphere: (state: MagnetosphereState) => void;
  setCarbon: (state: CarbonState) => void;
}

export const usePlanetaryStore = create<PlanetaryState>((set) => ({
  magnetosphere: null,
  carbon: null,

  setMagnetosphere: (magnetosphere) => set({ magnetosphere }),
  setCarbon: (carbon) => set({ carbon })
}));