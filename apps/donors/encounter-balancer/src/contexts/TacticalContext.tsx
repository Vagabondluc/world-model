'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { TacticalElement, Reward } from '@/lib/encounter-types';

// ============== Types ==============

interface TacticalState {
  tacticalElements: TacticalElement[];
  rewards: Reward[];
}

type TacticalAction =
  | { type: 'ADD_TACTICAL'; element: TacticalElement }
  | { type: 'REMOVE_TACTICAL'; id: string }
  | { type: 'SET_TACTICAL_ELEMENTS'; elements: TacticalElement[] }
  | { type: 'ADD_REWARD'; reward: Reward }
  | { type: 'REMOVE_REWARD'; id: string }
  | { type: 'SET_REWARDS'; rewards: Reward[] };

const initialState: TacticalState = {
  tacticalElements: [],
  rewards: [],
};

// ============== Reducer ==============

function tacticalReducer(state: TacticalState, action: TacticalAction): TacticalState {
  switch (action.type) {
    case 'ADD_TACTICAL':
      return { ...state, tacticalElements: [...state.tacticalElements, action.element] };
    case 'REMOVE_TACTICAL':
      return { ...state, tacticalElements: state.tacticalElements.filter(t => t.id !== action.id) };
    case 'SET_TACTICAL_ELEMENTS':
      return { ...state, tacticalElements: action.elements };
    case 'ADD_REWARD':
      return { ...state, rewards: [...state.rewards, action.reward] };
    case 'REMOVE_REWARD':
      return { ...state, rewards: state.rewards.filter(r => r.id !== action.id) };
    case 'SET_REWARDS':
      return { ...state, rewards: action.rewards };
    default:
      return state;
  }
}

// ============== Context ==============

interface TacticalContextValue {
  tacticalElements: TacticalElement[];
  rewards: Reward[];
  addTactical: (element: TacticalElement) => void;
  removeTactical: (id: string) => void;
  setTacticalElements: (elements: TacticalElement[]) => void;
  addReward: (reward: Reward) => void;
  removeReward: (id: string) => void;
  setRewards: (rewards: Reward[]) => void;
  totalRewardValue: number;
}

const TacticalContext = createContext<TacticalContextValue | null>(null);

// ============== Provider ==============

export function TacticalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tacticalReducer, initialState);

  const addTactical = useCallback((element: TacticalElement) => {
    dispatch({ type: 'ADD_TACTICAL', element });
  }, []);

  const removeTactical = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TACTICAL', id });
  }, []);

  const setTacticalElements = useCallback((elements: TacticalElement[]) => {
    dispatch({ type: 'SET_TACTICAL_ELEMENTS', elements });
  }, []);

  const addReward = useCallback((reward: Reward) => {
    dispatch({ type: 'ADD_REWARD', reward });
  }, []);

  const removeReward = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_REWARD', id });
  }, []);

  const setRewards = useCallback((rewards: Reward[]) => {
    dispatch({ type: 'SET_REWARDS', rewards });
  }, []);

  // Computed values
  const totalRewardValue = state.rewards.reduce((sum, r) => sum + (r.value || 0), 0);

  const value: TacticalContextValue = {
    tacticalElements: state.tacticalElements,
    rewards: state.rewards,
    addTactical,
    removeTactical,
    setTacticalElements,
    addReward,
    removeReward,
    setRewards,
    totalRewardValue,
  };

  return (
    <TacticalContext.Provider value={value}>
      {children}
    </TacticalContext.Provider>
  );
}

// ============== Hook ==============

export function useTactical() {
  const context = useContext(TacticalContext);
  if (!context) {
    throw new Error('useTactical must be used within a TacticalProvider');
  }
  return context;
}

export default TacticalContext;
