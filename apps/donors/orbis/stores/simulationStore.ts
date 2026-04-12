import { create } from 'zustand';
import { AbsTime, DomainClockState, SimEvent } from '../core/schemas/core';

interface SimulationState {
  absTime: AbsTime;
  clocks: Record<string, DomainClockState>;
  events: SimEvent[];
  
  // Actions
  setAbsTime: (time: AbsTime) => void;
  updateClock: (domainId: string, state: DomainClockState) => void;
  addEvent: (event: SimEvent) => void;
  clearEvents: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  absTime: 0n,
  clocks: {},
  events: [],

  setAbsTime: (absTime) => set({ absTime }),
  updateClock: (domainId, state) => set((prev) => ({
    clocks: { ...prev.clocks, [domainId]: state }
  })),
  addEvent: (event) => set((prev) => ({
    events: [...prev.events, event]
  })),
  clearEvents: () => set({ events: [] })
}));