import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameSessionConfig, GameEvent, WorldObject, Selection, WorldEvent, Age, PlayerId, QolSettings, Annotation, PlayerRuntimeState, CombatSession, CombatModifier } from '../types';
import { customStorage } from './storageAdapter';
import { deriveWorld } from '../logic/deriveWorld';
import { derivePlayerState } from '../logic/derivePlayerState';
import { DEFAULT_SETTINGS } from '../logic/constants';
import { initializePlayerCache } from '../logic/playerState';
import { chronicler } from '../logic/chronicler/engine';

import { JournalEntry, ChronicleCandidate } from '../logic/chronicler/types';
import { AutoChronicler } from '../logic/chronicler/auto/generator';

// Trigger compaction after 500 events
const SNAPSHOT_THRESHOLD = 500;

export type OnboardingStep = 'MAP_TAP' | 'INSPECT' | 'ACTION' | 'END_TURN' | 'DONE';

interface GameStoreState {
  // Meta
  config?: GameSessionConfig;
  settings: QolSettings;
  isHydrated: boolean;

  // Game Data
  events: GameEvent[];
  revokedEventIds: Set<string>;
  chronicle: Record<string, Annotation>; // Deprecated but kept for backward compat
  journal: Record<string, JournalEntry>;
  candidates: Record<string, ChronicleCandidate>;

  // Derived/Cached Data
  worldCache: Map<string, WorldObject>;
  playerCache: Record<PlayerId, PlayerRuntimeState>;

  // Simulation State
  age: Age;
  round: number;
  turn: number;
  activePlayerId: PlayerId;
  players: PlayerId[];
  draftRollbackUsedByAge: Partial<Record<Age, boolean>>;

  // UI State
  activeSelection: Selection;
  previewEvent: WorldEvent | null;
  onboardingStep: OnboardingStep;
  isHandoverActive: boolean;
  combatSession: CombatSession | null;
}

interface GameStoreActions {
  dispatch: (event: GameEvent) => void;
  compactLog: () => void;
  setSelection: (sel: Selection) => void;
  setPreview: (event: WorldEvent | null) => void;
  initializeSession: (config: GameSessionConfig) => void;
  updateConfig: (config: GameSessionConfig) => void;
  loadSession: () => Promise<boolean>;
  reset: () => void;
  annotateChronicler: (eventId: string, annotation: Annotation) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  advanceOnboarding: (current: OnboardingStep) => void;
  completeHandover: () => void;
  setHydrated: () => void;

  // Combat Actions
  startCombat: (attackerId: string, defenderId: string) => void;
  setCombatStage: (stage: CombatSession['stage']) => void;
  updateCombatSession: (updates: Partial<CombatSession>) => void;
  closeCombat: () => void;

  // Chronicler Actions
  addCandidate: (candidate: ChronicleCandidate) => void;
  dismissCandidate: (id: string) => void;
  commitJournalEntry: (entry: JournalEntry) => void;
}

const INITIAL_STATE: Omit<GameStoreState, keyof GameStoreActions> = {
  config: undefined,
  settings: DEFAULT_SETTINGS,
  isHydrated: false,
  events: [],
  revokedEventIds: new Set(),
  chronicle: {},
  journal: {},
  candidates: {},
  worldCache: new Map(),
  playerCache: {},
  age: 1,
  round: 1,
  turn: 1,
  activePlayerId: 'P1',
  players: ['P1', 'P2'],
  draftRollbackUsedByAge: {},
  activeSelection: { kind: 'NONE' },
  previewEvent: null,
  onboardingStep: 'MAP_TAP',
  isHandoverActive: false,
  combatSession: null,
};

export const useGameStore = create<GameStoreState & GameStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      dispatch: (event) => {
        set((state) => {
          const nextEvents = [...state.events, event];
          const nextRevoked = new Set<string>(state.revokedEventIds);
          let nextDraftRollback = { ...state.draftRollbackUsedByAge };

          let nextAge = state.age;
          let nextRound = state.round;
          let nextTurn = state.turn;
          let nextActivePlayer = state.activePlayerId;
          let nextHandover = state.isHandoverActive;

          if (event.type === 'EVENT_REVOKE') event.payload.targetEventIds.forEach(id => nextRevoked.add(id));
          if (event.type === 'DRAFT_ROLLBACK_USED') nextDraftRollback[event.payload.age] = true;

          if (event.type === 'TURN_END') {
            const currentIndex = state.players.indexOf(state.activePlayerId);
            const nextIndex = (currentIndex + 1) % state.players.length;
            if (nextIndex === 0) {
              nextRound = state.round + 1;
              nextTurn = 1;
            } else {
              nextTurn = state.turn + 1;
            }
            nextActivePlayer = state.players[nextIndex];
            nextHandover = true;
          }

          if (event.type === 'AGE_ADVANCE') {
            if (event.payload.to <= 3) {
              nextAge = event.payload.to as Age;
              nextRound = 1;
              nextTurn = 1;
              nextHandover = true;
            }
          }

          if (event.type === 'TURN_BEGIN') {
            nextActivePlayer = event.payload.playerId;
            nextHandover = true;
          }

          const newWorld = deriveWorld(nextEvents, nextRevoked, state.settings, state.worldCache);
          const newPlayerCache = derivePlayerState(nextEvents, nextRevoked, state.players);

          // Phase 7: Chronicler Integration
          // Process the new event through the Chronicler engine
          const chroniclerState = { events: nextEvents, worldCache: newWorld };
          const newCandidates = chronicler.processEvent(event, chroniclerState);

          const nextCandidates = { ...state.candidates };
          const nextJournal = { ...state.journal };

          // Auto-Chronicler Integration (Phase 2)
          const isAutoEnabled = true; // TODO: Pull from settings

          newCandidates.forEach(c => {
            let handled = false;
            // Attempt Auto-Resolution
            if (isAutoEnabled && c.autoEligible) {
              const autoEntry = AutoChronicler.tryAutoChronicle(c, event);
              if (autoEntry) {
                nextJournal[autoEntry.id] = autoEntry;
                handled = true;
              }
            }

            // Fallback to Manual Candidate
            if (!handled) {
              nextCandidates[c.id] = c;
            }
          });

          return {
            events: nextEvents, revokedEventIds: nextRevoked, draftRollbackUsedByAge: nextDraftRollback,
            worldCache: newWorld, playerCache: newPlayerCache,
            age: nextAge, round: nextRound, turn: nextTurn,
            activePlayerId: nextActivePlayer, previewEvent: null, isHandoverActive: nextHandover,
            candidates: nextCandidates, journal: nextJournal
          };
        });

        if (get().events.length > SNAPSHOT_THRESHOLD) {
          get().compactLog();
        }
      },

      compactLog: () => {
        const state = get();
        const snapshotId = crypto.randomUUID();
        const snapshotEvent: GameEvent = {
          id: snapshotId,
          type: 'WORLD_SNAPSHOT',
          ts: Date.now(),
          playerId: 'SYSTEM',
          age: state.age,
          round: state.round,
          turn: state.turn,
          payload: {
            cacheSnapshot: Array.from(state.worldCache.entries()),
            lastEventId: state.events[state.events.length - 1]?.id
          }
        };
        set({ events: [snapshotEvent], revokedEventIds: new Set() });
      },

      setSelection: (selection) => {
        const currentStep = get().onboardingStep;
        if (currentStep === 'MAP_TAP' && selection.kind === 'HEX') {
          get().setOnboardingStep('INSPECT');
        }
        set({ activeSelection: selection, previewEvent: null });
      },

      setPreview: (event) => {
        const currentStep = get().onboardingStep;
        if (currentStep === 'ACTION' && event) {
          get().setOnboardingStep('END_TURN');
        }
        set({ previewEvent: event });
      },

      setOnboardingStep: (step) => set({ onboardingStep: step }),
      advanceOnboarding: (current) => {
        const steps: OnboardingStep[] = ['MAP_TAP', 'INSPECT', 'ACTION', 'END_TURN', 'DONE'];
        const idx = steps.indexOf(current);
        if (idx !== -1 && idx < steps.length - 1) {
          set({ onboardingStep: steps[idx + 1] });
        }
      },

      completeHandover: () => {
        const state = get();
        // Dispatch TURN_BEGIN to reset per-turn state (e.g. hasRolledThisTurn)
        state.dispatch({
          id: crypto.randomUUID(),
          ts: Date.now(),
          type: 'TURN_BEGIN',
          playerId: state.activePlayerId,
          age: state.age,
          round: state.round,
          turn: state.turn,
          payload: { playerId: state.activePlayerId }
        });
        set({ isHandoverActive: false });
      },

      initializeSession: (config) => {
        const initialPlayerCache = initializePlayerCache(config.players.map(p => p.id));

        set({
          ...INITIAL_STATE, config, settings: { ...DEFAULT_SETTINGS, ...config.rules },
          players: config.players.map(p => p.id), activePlayerId: config.players[0].id, age: config.initialAge,
          playerCache: initialPlayerCache,
          isHydrated: true
        });
      },

      updateConfig: (config) => {
        set({ config, players: config.players.map(p => p.id) });
      },

      loadSession: async () => true,
      reset: () => set({ ...INITIAL_STATE, isHydrated: true }),
      annotateChronicler: (eventId, annotation) => set(state => ({
        chronicle: { ...state.chronicle, [eventId]: annotation }
      })),

      setHydrated: () => set({ isHydrated: true }),

      // Combat Actions
      startCombat: (attackerId, defenderId) => {
        const world = get().worldCache;
        const defender = world.get(defenderId);

        // Auto-detect modifiers
        const attMods: CombatModifier[] = [];
        const defMods: CombatModifier[] = [];

        // Simple Heuristics based on Kind
        if (defender?.kind === 'SETTLEMENT' || defender?.kind === 'CITY') {
          defMods.push({ id: 'def-city', label: 'Fortified City', value: 1, type: 'AUTO' });
        }
        if (defender?.kind === 'NATION') {
          defMods.push({ id: 'def-nat', label: 'Home Territory', value: 1, type: 'AUTO' });
        }

        set({
          combatSession: {
            stage: 'SETUP',
            attackerId,
            defenderId,
            attackerModifiers: attMods,
            defenderModifiers: defMods,
          }
        });
      },
      setCombatStage: (stage) => set(s => s.combatSession ? ({ combatSession: { ...s.combatSession, stage } }) : {}),
      updateCombatSession: (updates) => set(s => s.combatSession ? ({ combatSession: { ...s.combatSession, ...updates } }) : {}),
      closeCombat: () => set({ combatSession: null }),

      // Chronicler Actions
      addCandidate: (candidate) => set((state) => ({
        candidates: { ...state.candidates, [candidate.id]: candidate }
      })),

      dismissCandidate: (id) => set((state) => {
        const { [id]: _, ...remaining } = state.candidates;
        return { candidates: remaining };
      }),

      commitJournalEntry: (entry) => set((state) => {
        // Remove the candidate if it exists
        const candidates = { ...state.candidates };
        const candidateId = Object.keys(candidates).find(cid => candidates[cid].sourceEventIds.some(eid => entry.triggeredByEventIds.includes(eid)));
        if (candidateId) delete candidates[candidateId];

        return {
          journal: { ...state.journal, [entry.id]: entry },
          candidates
        };
      })
    }),
    {
      name: 'dawn_of_worlds_save_v1',
      storage: customStorage,
      onRehydrateStorage: () => (state) => {
        // Ensure hydration completes even if rehydrate callback is null/undefined
        if (state) state.setHydrated();
        else useGameStore.setState({ isHydrated: true });
      },
      partialize: (state) => ({
        config: state.config, settings: state.settings, events: state.events,
        revokedEventIds: state.revokedEventIds, worldCache: state.worldCache, playerCache: state.playerCache,
        age: state.age, round: state.round, turn: state.turn,
        activePlayerId: state.activePlayerId, players: state.players,
        draftRollbackUsedByAge: state.draftRollbackUsedByAge, chronicle: state.chronicle,
        journal: state.journal, candidates: state.candidates, // Persist new fields
        onboardingStep: state.onboardingStep
      })
    }
  )
);