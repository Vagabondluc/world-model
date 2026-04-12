'use client';

import { useEffect, useCallback, useRef } from 'react';

// ============== Types ==============

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
  preventDefault?: boolean;
}

// ============== Hook ==============

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  // Store shortcuts in ref to avoid re-binding events on every change
  const shortcutsRef = useRef(shortcuts);
  
  // Update ref inside useEffect to avoid render-time ref updates
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Allow Ctrl+Z, Ctrl+Y, Ctrl+S even in inputs
      const isUndoRedo = (event.ctrlKey || event.metaKey) && (event.key === 'z' || event.key === 'y');
      const isSave = (event.ctrlKey || event.metaKey) && event.key === 's';
      if (!isUndoRedo && !isSave) return;
    }

    for (const shortcut of shortcutsRef.current) {
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action();
        return;
      }
    }
  }, [enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
}

// ============== Preset Shortcuts ==============

export function useEncounterShortcuts(
  onUndo?: () => void,
  onRedo?: () => void,
  onSave?: () => void,
  onExport?: () => void,
  onGenerate?: () => void,
  onClear?: () => void,
  onPrint?: () => void
) {
  const shortcuts: KeyboardShortcut[] = [
    // Undo/Redo
    ...(onUndo ? [{
      key: 'z',
      ctrl: true,
      action: onUndo,
      description: 'Undo last action',
    }] : []),
    ...(onRedo ? [{
      key: 'y',
      ctrl: true,
      action: onRedo,
      description: 'Redo last action',
    }, {
      key: 'z',
      ctrl: true,
      shift: true,
      action: onRedo,
      description: 'Redo last action (alternative)',
    }] : []),
    
    // Save
    ...(onSave ? [{
      key: 's',
      ctrl: true,
      action: onSave,
      description: 'Save encounter',
    }] : []),
    
    // Export
    ...(onExport ? [{
      key: 'e',
      ctrl: true,
      action: onExport,
      description: 'Export encounter',
    }] : []),
    
    // Generate
    ...(onGenerate ? [{
      key: 'g',
      ctrl: true,
      action: onGenerate,
      description: 'Generate encounter',
    }] : []),
    
    // Clear
    ...(onClear ? [{
      key: 'Delete',
      ctrl: true,
      shift: true,
      action: onClear,
      description: 'Clear all',
    }] : []),
    
    // Print
    ...(onPrint ? [{
      key: 'p',
      ctrl: true,
      action: onPrint,
      description: 'Print encounter',
    }] : []),
  ];

  return useKeyboardShortcuts(shortcuts);
}

// ============== Help Dialog Data ==============

export const KEYBOARD_SHORTCUTS_HELP = [
  { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
  { keys: ['Ctrl', 'Y'], description: 'Redo last action' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo (alternative)' },
  { keys: ['Ctrl', 'S'], description: 'Save encounter' },
  { keys: ['Ctrl', 'E'], description: 'Export encounter' },
  { keys: ['Ctrl', 'G'], description: 'Generate encounter' },
  { keys: ['Ctrl', 'P'], description: 'Print encounter' },
  { keys: ['Ctrl', 'Shift', 'Delete'], description: 'Clear all' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
];

export default useKeyboardShortcuts;
