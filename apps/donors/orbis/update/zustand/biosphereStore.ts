import { create } from 'zustand';
import { SpeciesTemplate, PopStateCell, TrophicLevel } from '../zod/biology';

interface BiosphereState {
  speciesTemplates: Map<string, SpeciesTemplate>;
  populationData: Record<string, PopStateCell>; // hexId -> state
  trophicCapacities: Record<TrophicLevel, number>;

  // Actions
  addSpecies: (template: SpeciesTemplate) => void;
  updatePopulation: (hexId: string, data: PopStateCell) => void;
  setTrophicCapacity: (level: TrophicLevel, capacity: number) => void;
}

export const useBiosphereStore = create<BiosphereState>((set) => ({
  speciesTemplates: new Map(),
  populationData: {},
  trophicCapacities: {
    [TrophicLevel.Producer]: 0,
    [TrophicLevel.PrimaryConsumer]: 0,
    [TrophicLevel.SecondaryConsumer]: 0,
    [TrophicLevel.Apex]: 0,
    [TrophicLevel.Decomposer]: 0
  },

  addSpecies: (template) => set((prev) => {
    const newTemplates = new Map(prev.speciesTemplates);
    newTemplates.set(template.speciesId, template);
    return { speciesTemplates: newTemplates };
  }),
  updatePopulation: (hexId, data) => set((prev) => ({
    populationData: { ...prev.populationData, [hexId]: data }
  })),
  setTrophicCapacity: (level, capacity) => set((prev) => ({
    trophicCapacities: { ...prev.trophicCapacities, [level]: capacity }
  }))
}));
