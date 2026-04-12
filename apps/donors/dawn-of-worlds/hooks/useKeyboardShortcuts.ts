import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { triggerHaptic } from '../logic/haptics';
import { proposeTurnScopedUndo } from '../logic/undo';

export const useKeyboardShortcuts = (
  toggleSearch: () => void,
  toggleEndTurn: () => void,
  toggleDashboard: () => void,
  toggleChronicler: () => void,
  toggleTimeline: () => void,
  toggleShortcuts: () => void
) => {
  const state = useGameStore.getState();
  const dispatch = useGameStore(s => s.dispatch);
  const setSelection = useGameStore(s => s.setSelection);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Prevent shortcuts if typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isInput && e.key !== 'Escape') return;

      // 2. Map Actions
      switch (e.key.toLowerCase()) {
        // WASD/Arrows handled in MapViewport for local container scrolling

        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleChronicler();
          }
          break;

        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const undoEvt = proposeTurnScopedUndo(useGameStore.getState() as any);
            if (undoEvt) {
              triggerHaptic('confirm');
              dispatch(undoEvt);
            } else {
              triggerHaptic('reject');
            }
          }
          break;

        case '/':
          e.preventDefault();
          toggleSearch();
          break;

        case 'enter':
          if (!e.shiftKey) {
            e.preventDefault();
            toggleEndTurn();
          }
          break;

        case 'escape':
          setSelection({ kind: 'NONE' });
          // Close active modals if possible (handled by App.tsx state mostly)
          break;

        case 'c':
          toggleDashboard();
          break;

        case 't':
          toggleTimeline();
          break;

        case '?':
          toggleShortcuts();
          break;

        // Fallback for some layouts or user preference
        case 'f1':
          e.preventDefault();
          toggleShortcuts();
          break;

        case ' ':
          // Space to center is handled elsewhere or via scroll container ref
          break;
      }

      // Explicit check for Shift + / in case '?' isn't reported correctly
      if (e.key === '/' && e.shiftKey) {
        toggleShortcuts();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch, toggleEndTurn, toggleDashboard, toggleChronicler, toggleTimeline, toggleShortcuts]);
};
