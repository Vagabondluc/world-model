'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { Monster } from '@/lib/encounter-types';

// ============== Types ==============

interface MonsterState {
  monsters: Monster[];
}

type MonsterAction =
  | { type: 'ADD_MONSTER'; monster: Monster }
  | { type: 'REMOVE_MONSTER'; id: string }
  | { type: 'UPDATE_MONSTER'; id: string; updates: Partial<Monster> }
  | { type: 'SET_MONSTERS'; monsters: Monster[] }
  | { type: 'UPDATE_COUNT'; id: string; delta: number };

const initialState: MonsterState = {
  monsters: [],
};

// ============== Reducer ==============

function monsterReducer(state: MonsterState, action: MonsterAction): MonsterState {
  switch (action.type) {
    case 'ADD_MONSTER':
      return { ...state, monsters: [...state.monsters, action.monster] };
    case 'REMOVE_MONSTER':
      return { ...state, monsters: state.monsters.filter(m => m.id !== action.id) };
    case 'UPDATE_MONSTER':
      return {
        ...state,
        monsters: state.monsters.map(m =>
          m.id === action.id ? { ...m, ...action.updates } : m
        ),
      };
    case 'SET_MONSTERS':
      return { ...state, monsters: action.monsters };
    case 'UPDATE_COUNT':
      return {
        ...state,
        monsters: state.monsters.map(m =>
          m.id === action.id ? { ...m, count: Math.max(1, m.count + action.delta) } : m
        ),
      };
    default:
      return state;
  }
}

// ============== Context ==============

interface MonsterContextValue {
  monsters: Monster[];
  addMonster: (monster: Monster) => void;
  removeMonster: (id: string) => void;
  updateMonster: (id: string, updates: Partial<Monster>) => void;
  setMonsters: (monsters: Monster[]) => void;
  updateMonsterCount: (id: string, delta: number) => void;
  totalMonsterCount: number;
  totalXP: number;
  hasLegendary: boolean;
}

const MonsterContext = createContext<MonsterContextValue | null>(null);

// ============== Provider ==============

export function MonsterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(monsterReducer, initialState);

  const addMonster = useCallback((monster: Monster) => {
    dispatch({ type: 'ADD_MONSTER', monster });
  }, []);

  const removeMonster = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_MONSTER', id });
  }, []);

  const updateMonster = useCallback((id: string, updates: Partial<Monster>) => {
    dispatch({ type: 'UPDATE_MONSTER', id, updates });
  }, []);

  const setMonsters = useCallback((monsters: Monster[]) => {
    dispatch({ type: 'SET_MONSTERS', monsters });
  }, []);

  const updateMonsterCount = useCallback((id: string, delta: number) => {
    dispatch({ type: 'UPDATE_COUNT', id, delta });
  }, []);

  // Computed values
  const totalMonsterCount = state.monsters.reduce((sum, m) => sum + m.count, 0);
  const totalXP = state.monsters.reduce((sum, m) => sum + m.xp * m.count, 0);
  const hasLegendary = state.monsters.some(m => m.isLegendary === true);

  const value: MonsterContextValue = {
    monsters: state.monsters,
    addMonster,
    removeMonster,
    updateMonster,
    setMonsters,
    updateMonsterCount,
    totalMonsterCount,
    totalXP,
    hasLegendary,
  };

  return (
    <MonsterContext.Provider value={value}>
      {children}
    </MonsterContext.Provider>
  );
}

// ============== Hook ==============

export function useMonsters() {
  const context = useContext(MonsterContext);
  if (!context) {
    throw new Error('useMonsters must be used within a MonsterProvider');
  }
  return context;
}

export default MonsterContext;
