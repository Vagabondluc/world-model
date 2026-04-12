'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ============== Types ==============

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

// ============== useUndoableState Hook ==============

export function useUndoableState<T>(initialState: T, maxHistory = 50) {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory(prev => {
      const resolvedState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev.present) 
        : newState;
      
      // Don't add to history if state hasn't changed
      if (JSON.stringify(prev.present) === JSON.stringify(resolvedState)) {
        return prev;
      }
      
      const newPast = [...prev.past, prev.present].slice(-maxHistory);
      return {
        past: newPast,
        present: resolvedState,
        future: [], // Clear future on new action
      };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newInitialState: T) => {
    setHistory({
      past: [],
      present: newInitialState,
      future: [],
    });
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historyLength: history.past.length,
  };
}

// ============== Context ==============

interface HistoryContextValue {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

// ============== Provider ==============

interface HistoryProviderProps {
  children: ReactNode;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function HistoryProvider({ 
  children, 
  onUndo, 
  onRedo,
  canUndo: externalCanUndo = false,
  canRedo: externalCanRedo = false 
}: HistoryProviderProps) {
  const undo = useCallback(() => {
    if (onUndo) onUndo();
  }, [onUndo]);

  const redo = useCallback(() => {
    if (onRedo) onRedo();
  }, [onRedo]);

  const value: HistoryContextValue = {
    canUndo: externalCanUndo,
    canRedo: externalCanRedo,
    undo,
    redo,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}

// ============== Hook ==============

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}

export default HistoryContext;
