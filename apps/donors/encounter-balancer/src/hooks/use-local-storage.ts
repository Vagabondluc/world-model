'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

/**
 * Hook for persisting state to localStorage with automatic serialization
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, boolean, () => void] {
  // Use useSyncExternalStore for SSR-safe localStorage access
  const storedValue = useSyncExternalStore(
    () => () => {}, // No subscription needed for localStorage
    () => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch {
        return initialValue;
      }
    },
    () => initialValue
  );

  const [value, setValue] = useState<T>(storedValue);

  useEffect(() => {
    setValue(storedValue);
  }, [storedValue]);

  const setStoredValue = useCallback((newValue: T) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  const removeValue = useCallback(() => {
    try {
      setValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // isLoading is always false since we use sync external store
  return [value, setStoredValue, false, removeValue];
}

/**
 * Hook for managing encounter drafts with localStorage
 */
export interface EncounterDraft {
  id: string;
  name: string;
  type: 'balancer' | 'environmental';
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const ENCOUNTER_DRAFTS_KEY = 'dnd-encounter-drafts';

export function useEncounterDrafts() {
  const [drafts, setDrafts, isLoading] = useLocalStorage<EncounterDraft[]>(ENCOUNTER_DRAFTS_KEY, []);

  const addDraft = useCallback((draft: Omit<EncounterDraft, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDraft: EncounterDraft = {
      ...draft,
      id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDrafts(prev => [...prev, newDraft]);
    return newDraft;
  }, [setDrafts]);

  const updateDraft = useCallback((id: string, data: Partial<EncounterDraft>) => {
    setDrafts(prev => 
      prev.map(draft => 
        draft.id === id 
          ? { ...draft, ...data, updatedAt: new Date().toISOString() }
          : draft
      )
    );
  }, [setDrafts]);

  const removeDraft = useCallback((id: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== id));
  }, [setDrafts]);

  const getDraftsByType = useCallback((type: 'balancer' | 'environmental') => {
    return drafts.filter(draft => draft.type === type);
  }, [drafts]);

  return {
    drafts,
    isLoading,
    addDraft,
    updateDraft,
    removeDraft,
    getDraftsByType,
  };
}
