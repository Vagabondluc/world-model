'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { useLocalStorage, EncounterDraft, useEncounterDrafts } from '@/hooks/use-local-storage';
import type { 
  Monster, 
  TacticalElement, 
  Reward, 
  Difficulty,
  PhysicalFeature,
  EnvironmentalMechanic,
  EnemyForce,
  DynamicChange,
  EncounterOutcome,
  TransitionHook
} from '@/lib/encounter-types';

// ============== Types ==============

export interface PartyComposition {
  level: number;
  playerCount: number;
  hasHealer: boolean;
  hasTank: boolean;
  hasArcaneCaster: boolean;
  hasDivineCaster: boolean;
}

export interface ResourceState {
  spellSlots: 'full' | 'partial' | 'depleted';
  hitPoints: 'full' | 'partial' | 'bloodied';
  abilities: 'available' | 'limited' | 'exhausted';
}

export interface ReinforcementWave {
  id: string;
  trigger: string;
  round: number;
  monsters: Monster[];
  description: string;
}

export interface LairAction {
  id: string;
  name: string;
  description: string;
  initiative: number;
  effect: string;
}

export interface EncounterState {
  // Encounter metadata
  name: string;
  location: string;
  difficulty: Difficulty;
  
  // Party info
  partyLevel: number;
  playerCount: number;
  partyComposition: PartyComposition;
  resourceState: ResourceState;
  
  // Monsters and elements
  monsters: Monster[];
  tacticalElements: TacticalElement[];
  rewards: Reward[];
  
  // Environmental scenario elements
  physicalFeatures: PhysicalFeature[];
  environmentalMechanics: EnvironmentalMechanic[];
  enemyForces: EnemyForce[];
  dynamicChanges: DynamicChange[];
  outcomes: EncounterOutcome[];
  transitionHooks: TransitionHook[];
  
  // Advanced features
  reinforcementWaves: ReinforcementWave[];
  lairActions: LairAction[];
  
  // Notes
  notes: string;
  
  // UI state
  activeTab: 'environmental' | 'balancer';
}

type EncounterAction =
  | { type: 'SET_FIELD'; field: keyof EncounterState; value: unknown }
  | { type: 'ADD_MONSTER'; monster: Monster }
  | { type: 'REMOVE_MONSTER'; id: string }
  | { type: 'UPDATE_MONSTER'; id: string; updates: Partial<Monster> }
  | { type: 'SET_MONSTERS'; monsters: Monster[] }
  | { type: 'ADD_TACTICAL'; element: TacticalElement }
  | { type: 'REMOVE_TACTICAL'; id: string }
  | { type: 'ADD_REWARD'; reward: Reward }
  | { type: 'REMOVE_REWARD'; id: string }
  | { type: 'ADD_PHYSICAL_FEATURE'; feature: PhysicalFeature }
  | { type: 'REMOVE_PHYSICAL_FEATURE'; id: string }
  | { type: 'ADD_ENVIRONMENTAL_MECHANIC'; mechanic: EnvironmentalMechanic }
  | { type: 'REMOVE_ENVIRONMENTAL_MECHANIC'; id: string }
  | { type: 'ADD_ENEMY_FORCE'; force: EnemyForce }
  | { type: 'REMOVE_ENEMY_FORCE'; id: string }
  | { type: 'ADD_DYNAMIC_CHANGE'; change: DynamicChange }
  | { type: 'REMOVE_DYNAMIC_CHANGE'; id: string }
  | { type: 'ADD_OUTCOME'; outcome: EncounterOutcome }
  | { type: 'REMOVE_OUTCOME'; id: string }
  | { type: 'ADD_TRANSITION_HOOK'; hook: TransitionHook }
  | { type: 'REMOVE_TRANSITION_HOOK'; id: string }
  | { type: 'ADD_REINFORCEMENT_WAVE'; wave: ReinforcementWave }
  | { type: 'REMOVE_REINFORCEMENT_WAVE'; id: string }
  | { type: 'ADD_LAIR_ACTION'; action: LairAction }
  | { type: 'REMOVE_LAIR_ACTION'; id: string }
  | { type: 'SET_PARTY_COMPOSITION'; composition: Partial<PartyComposition> }
  | { type: 'SET_RESOURCE_STATE'; state: Partial<ResourceState> }
  | { type: 'LOAD_ENCOUNTER'; state: EncounterState }
  | { type: 'RESET_ENCOUNTER' };

const initialState: EncounterState = {
  name: '',
  location: '',
  difficulty: 'medium',
  partyLevel: 5,
  playerCount: 4,
  partyComposition: {
    level: 5,
    playerCount: 4,
    hasHealer: true,
    hasTank: true,
    hasArcaneCaster: true,
    hasDivineCaster: true,
  },
  resourceState: {
    spellSlots: 'full',
    hitPoints: 'full',
    abilities: 'available',
  },
  monsters: [],
  tacticalElements: [],
  rewards: [],
  physicalFeatures: [],
  environmentalMechanics: [],
  enemyForces: [],
  dynamicChanges: [],
  outcomes: [],
  transitionHooks: [],
  reinforcementWaves: [],
  lairActions: [],
  notes: '',
  activeTab: 'environmental',
};

function encounterReducer(state: EncounterState, action: EncounterAction): EncounterState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_MONSTER':
      return { ...state, monsters: [...state.monsters, action.monster] };
    case 'REMOVE_MONSTER':
      return { ...state, monsters: state.monsters.filter(m => m.id !== action.id) };
    case 'UPDATE_MONSTER':
      return { 
        ...state, 
        monsters: state.monsters.map(m => 
          m.id === action.id ? { ...m, ...action.updates } : m
        ) 
      };
    case 'SET_MONSTERS':
      return { ...state, monsters: action.monsters };
    case 'ADD_TACTICAL':
      return { ...state, tacticalElements: [...state.tacticalElements, action.element] };
    case 'REMOVE_TACTICAL':
      return { ...state, tacticalElements: state.tacticalElements.filter(t => t.id !== action.id) };
    case 'ADD_REWARD':
      return { ...state, rewards: [...state.rewards, action.reward] };
    case 'REMOVE_REWARD':
      return { ...state, rewards: state.rewards.filter(r => r.id !== action.id) };
    case 'ADD_PHYSICAL_FEATURE':
      return { ...state, physicalFeatures: [...state.physicalFeatures, action.feature] };
    case 'REMOVE_PHYSICAL_FEATURE':
      return { ...state, physicalFeatures: state.physicalFeatures.filter(f => f.id !== action.id) };
    case 'ADD_ENVIRONMENTAL_MECHANIC':
      return { ...state, environmentalMechanics: [...state.environmentalMechanics, action.mechanic] };
    case 'REMOVE_ENVIRONMENTAL_MECHANIC':
      return { ...state, environmentalMechanics: state.environmentalMechanics.filter(m => m.id !== action.id) };
    case 'ADD_ENEMY_FORCE':
      return { ...state, enemyForces: [...state.enemyForces, action.force] };
    case 'REMOVE_ENEMY_FORCE':
      return { ...state, enemyForces: state.enemyForces.filter(f => f.id !== action.id) };
    case 'ADD_DYNAMIC_CHANGE':
      return { ...state, dynamicChanges: [...state.dynamicChanges, action.change] };
    case 'REMOVE_DYNAMIC_CHANGE':
      return { ...state, dynamicChanges: state.dynamicChanges.filter(c => c.id !== action.id) };
    case 'ADD_OUTCOME':
      return { ...state, outcomes: [...state.outcomes, action.outcome] };
    case 'REMOVE_OUTCOME':
      return { ...state, outcomes: state.outcomes.filter(o => o.id !== action.id) };
    case 'ADD_TRANSITION_HOOK':
      return { ...state, transitionHooks: [...state.transitionHooks, action.hook] };
    case 'REMOVE_TRANSITION_HOOK':
      return { ...state, transitionHooks: state.transitionHooks.filter(h => h.id !== action.id) };
    case 'ADD_REINFORCEMENT_WAVE':
      return { ...state, reinforcementWaves: [...state.reinforcementWaves, action.wave] };
    case 'REMOVE_REINFORCEMENT_WAVE':
      return { ...state, reinforcementWaves: state.reinforcementWaves.filter(w => w.id !== action.id) };
    case 'ADD_LAIR_ACTION':
      return { ...state, lairActions: [...state.lairActions, action.action] };
    case 'REMOVE_LAIR_ACTION':
      return { ...state, lairActions: state.lairActions.filter(a => a.id !== action.id) };
    case 'SET_PARTY_COMPOSITION':
      return { ...state, partyComposition: { ...state.partyComposition, ...action.composition } };
    case 'SET_RESOURCE_STATE':
      return { ...state, resourceState: { ...state.resourceState, ...action.state } };
    case 'LOAD_ENCOUNTER':
      return action.state;
    case 'RESET_ENCOUNTER':
      return initialState;
    default:
      return state;
  }
}

// ============== Context ==============

interface EncounterContextValue {
  state: EncounterState;
  dispatch: React.Dispatch<EncounterAction>;
  // Computed values
  totalMonsterCount: number;
  hasLegendaryMonster: boolean;
  // Actions
  setField: <K extends keyof EncounterState>(field: K, value: EncounterState[K]) => void;
  addMonster: (monster: Monster) => void;
  removeMonster: (id: string) => void;
  updateMonster: (id: string, updates: Partial<Monster>) => void;
  addTactical: (element: TacticalElement) => void;
  removeTactical: (id: string) => void;
  addReward: (reward: Reward) => void;
  removeReward: (id: string) => void;
  addPhysicalFeature: (feature: PhysicalFeature) => void;
  removePhysicalFeature: (id: string) => void;
  addEnvironmentalMechanic: (mechanic: EnvironmentalMechanic) => void;
  removeEnvironmentalMechanic: (id: string) => void;
  addEnemyForce: (force: EnemyForce) => void;
  removeEnemyForce: (id: string) => void;
  addDynamicChange: (change: DynamicChange) => void;
  removeDynamicChange: (id: string) => void;
  addOutcome: (outcome: EncounterOutcome) => void;
  removeOutcome: (id: string) => void;
  addTransitionHook: (hook: TransitionHook) => void;
  removeTransitionHook: (id: string) => void;
  addReinforcementWave: (wave: ReinforcementWave) => void;
  removeReinforcementWave: (id: string) => void;
  addLairAction: (action: LairAction) => void;
  removeLairAction: (id: string) => void;
  setPartyComposition: (composition: Partial<PartyComposition>) => void;
  setResourceState: (state: Partial<ResourceState>) => void;
  loadEncounter: (state: EncounterState) => void;
  resetEncounter: () => void;
  saveDraft: () => void;
  drafts: EncounterDraft[];
  isLoading: boolean;
}

const EncounterContext = createContext<EncounterContextValue | null>(null);

// ============== Provider ==============

const ENCOUNTER_STATE_KEY = 'dnd-encounter-state';

export function EncounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(encounterReducer, initialState);
  const { drafts, isLoading, addDraft, updateDraft, removeDraft } = useEncounterDrafts();

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      try {
        const saved = localStorage.getItem(ENCOUNTER_STATE_KEY);
        if (saved) {
          const parsedState = JSON.parse(saved);
          dispatch({ type: 'LOAD_ENCOUNTER', state: { ...initialState, ...parsedState } });
        }
      } catch (error) {
        console.error('Error loading encounter state:', error);
      }
    }
  }, [isLoading]);

  // Save state to localStorage on changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      try {
        localStorage.setItem(ENCOUNTER_STATE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving encounter state:', error);
      }
    }
  }, [state, isLoading]);

  // Computed values
  const totalMonsterCount = state.monsters.reduce((sum, m) => sum + m.count, 0);
  const hasLegendaryMonster = state.monsters.some(m => {
    if (m.isLegendary !== undefined) return m.isLegendary;
    const crNum = m.cr.includes('/') ? parseFloat(m.cr) : parseInt(m.cr);
    return crNum >= 5;
  });

  // Action creators
  const setField = useCallback(<K extends keyof EncounterState>(field: K, value: EncounterState[K]) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const addMonster = useCallback((monster: Monster) => {
    dispatch({ type: 'ADD_MONSTER', monster });
  }, []);

  const removeMonster = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_MONSTER', id });
  }, []);

  const updateMonster = useCallback((id: string, updates: Partial<Monster>) => {
    dispatch({ type: 'UPDATE_MONSTER', id, updates });
  }, []);

  const addTactical = useCallback((element: TacticalElement) => {
    dispatch({ type: 'ADD_TACTICAL', element });
  }, []);

  const removeTactical = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TACTICAL', id });
  }, []);

  const addReward = useCallback((reward: Reward) => {
    dispatch({ type: 'ADD_REWARD', reward });
  }, []);

  const removeReward = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_REWARD', id });
  }, []);

  const addPhysicalFeature = useCallback((feature: PhysicalFeature) => {
    dispatch({ type: 'ADD_PHYSICAL_FEATURE', feature });
  }, []);

  const removePhysicalFeature = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_PHYSICAL_FEATURE', id });
  }, []);

  const addEnvironmentalMechanic = useCallback((mechanic: EnvironmentalMechanic) => {
    dispatch({ type: 'ADD_ENVIRONMENTAL_MECHANIC', mechanic });
  }, []);

  const removeEnvironmentalMechanic = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ENVIRONMENTAL_MECHANIC', id });
  }, []);

  const addEnemyForce = useCallback((force: EnemyForce) => {
    dispatch({ type: 'ADD_ENEMY_FORCE', force });
  }, []);

  const removeEnemyForce = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ENEMY_FORCE', id });
  }, []);

  const addDynamicChange = useCallback((change: DynamicChange) => {
    dispatch({ type: 'ADD_DYNAMIC_CHANGE', change });
  }, []);

  const removeDynamicChange = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_DYNAMIC_CHANGE', id });
  }, []);

  const addOutcome = useCallback((outcome: EncounterOutcome) => {
    dispatch({ type: 'ADD_OUTCOME', outcome });
  }, []);

  const removeOutcome = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_OUTCOME', id });
  }, []);

  const addTransitionHook = useCallback((hook: TransitionHook) => {
    dispatch({ type: 'ADD_TRANSITION_HOOK', hook });
  }, []);

  const removeTransitionHook = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TRANSITION_HOOK', id });
  }, []);

  const addReinforcementWave = useCallback((wave: ReinforcementWave) => {
    dispatch({ type: 'ADD_REINFORCEMENT_WAVE', wave });
  }, []);

  const removeReinforcementWave = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_REINFORCEMENT_WAVE', id });
  }, []);

  const addLairAction = useCallback((action: LairAction) => {
    dispatch({ type: 'ADD_LAIR_ACTION', action });
  }, []);

  const removeLairAction = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_LAIR_ACTION', id });
  }, []);

  const setPartyComposition = useCallback((composition: Partial<PartyComposition>) => {
    dispatch({ type: 'SET_PARTY_COMPOSITION', composition });
  }, []);

  const setResourceState = useCallback((resourceState: Partial<ResourceState>) => {
    dispatch({ type: 'SET_RESOURCE_STATE', state: resourceState });
  }, []);

  const loadEncounter = useCallback((newState: EncounterState) => {
    dispatch({ type: 'LOAD_ENCOUNTER', state: newState });
  }, []);

  const resetEncounter = useCallback(() => {
    dispatch({ type: 'RESET_ENCOUNTER' });
  }, []);

  const saveDraft = useCallback(() => {
    const draftType = state.activeTab === 'balancer' ? 'balancer' : 'environmental';
    addDraft({
      name: state.name || `Encounter ${new Date().toLocaleDateString()}`,
      type: draftType,
      data: state as unknown as Record<string, unknown>,
    });
  }, [state, addDraft]);

  const value: EncounterContextValue = {
    state,
    dispatch,
    totalMonsterCount,
    hasLegendaryMonster,
    setField,
    addMonster,
    removeMonster,
    updateMonster,
    addTactical,
    removeTactical,
    addReward,
    removeReward,
    addPhysicalFeature,
    removePhysicalFeature,
    addEnvironmentalMechanic,
    removeEnvironmentalMechanic,
    addEnemyForce,
    removeEnemyForce,
    addDynamicChange,
    removeDynamicChange,
    addOutcome,
    removeOutcome,
    addTransitionHook,
    removeTransitionHook,
    addReinforcementWave,
    removeReinforcementWave,
    addLairAction,
    removeLairAction,
    setPartyComposition,
    setResourceState,
    loadEncounter,
    resetEncounter,
    saveDraft,
    drafts,
    isLoading,
  };

  return (
    <EncounterContext.Provider value={value}>
      {children}
    </EncounterContext.Provider>
  );
}

// ============== Hook ==============

export function useEncounter() {
  const context = useContext(EncounterContext);
  if (!context) {
    throw new Error('useEncounter must be used within an EncounterProvider');
  }
  return context;
}

export default EncounterContext;
