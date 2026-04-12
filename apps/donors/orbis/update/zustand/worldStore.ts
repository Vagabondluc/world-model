import { create } from 'zustand';
import { DomainParameterStateV1, AuthorityRegistryV1, SnapshotV1 } from '../zod/infrastructure';

interface WorldState {
  parameters: DomainParameterStateV1[];
  authority: AuthorityRegistryV1 | null;
  lastSnapshot: SnapshotV1 | null;

  // Actions
  setParameterState: (domainId: string, state: DomainParameterStateV1) => void;
  setAuthority: (registry: AuthorityRegistryV1) => void;
  loadSnapshot: (snapshot: SnapshotV1) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  parameters: [],
  authority: null,
  lastSnapshot: null,

  setParameterState: (domainId, state) => set((prev) => ({
    parameters: prev.parameters.map(p => p.domainId.toString() === domainId ? state : p)
  })),
  setAuthority: (authority) => set({ authority }),
  loadSnapshot: (lastSnapshot) => set({ lastSnapshot })
}));
