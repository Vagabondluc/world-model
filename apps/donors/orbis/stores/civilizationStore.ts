import { create } from 'zustand';
import { EntityNeeds, TradeNode, TradeEdge, EconomicTickState } from '../core/schemas/civilization';

interface CivilizationState {
  needs: Record<string, EntityNeeds>; // entityId -> needs
  nodes: Map<string, TradeNode>;
  edges: Map<string, TradeEdge>;
  economy: EconomicTickState | null;

  // Actions
  setEntityNeeds: (entityId: string, needs: EntityNeeds) => void;
  updateEconomy: (state: EconomicTickState) => void;
}

export const useCivilizationStore = create<CivilizationState>((set) => ({
  needs: {},
  nodes: new Map(),
  edges: new Map(),
  economy: null,

  setEntityNeeds: (entityId, needs) => set((prev) => ({
    needs: { ...prev.needs, [entityId]: needs }
  })),
  updateEconomy: (economy) => set({ economy })
}));