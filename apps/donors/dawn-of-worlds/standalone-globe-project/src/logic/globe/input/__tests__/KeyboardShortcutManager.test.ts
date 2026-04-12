import { describe, it, expect } from 'vitest';
import { KeyboardShortcutManager } from '../KeyboardShortcutManager';
import { DEFAULT_KEYBINDS } from '../types';

describe('KeyboardShortcutManager', () => {
    describe('Simple Keybinds', () => {
        it('should match single key shortcuts', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.matchAction('KeyA')).toBe('rotate-left');
            expect(manager.matchAction('ArrowLeft')).toBe('rotate-left');
        });

        it('should match arrow keys to rotation', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.matchAction('ArrowUp')).toBe('rotate-up');
            expect(manager.matchAction('ArrowDown')).toBe('rotate-down');
            expect(manager.matchAction('ArrowRight')).toBe('rotate-right');
        });

        it('should return null for unbound keys', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.matchAction('KeyQ')).toBeNull();
            expect(manager.matchAction('KeyZ')).toBeNull();
        });

        it('should match zoom keys', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.matchAction('Equal')).toBe('zoom-in');
            expect(manager.matchAction('Minus')).toBe('zoom-out');
        });

        it('should match application shortcuts', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.matchAction('KeyP')).toBe('toggle-panel');
            expect(manager.matchAction('KeyI')).toBe('toggle-info');
            expect(manager.matchAction('KeyN')).toBe('step-simulation');
            expect(manager.matchAction('KeyM')).toBe('cycle-display-mode');
        });
    });

    describe('Combo Keybinds', () => {
        it('should match Shift+Tab for cycle-back', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.matchAction('Tab', { shift: true, ctrl: false, alt: false })).toBe('cycle-back');
        });

        it('should match Tab without Shift for cycle-next', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.matchAction('Tab', { shift: false, ctrl: false, alt: false })).toBe('cycle-next');
        });

        it('should not match plain key when Ctrl is held for non-continuous actions', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            // toggle-panel is a single-fire action, should not match with Ctrl
            expect(manager.matchAction('KeyP', { shift: false, ctrl: true, alt: false })).toBeNull();
        });

        it('should allow modifiers for continuous camera actions', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            // Continuous actions (rotation) work with modifiers for speed adjustment
            expect(manager.matchAction('KeyA', { shift: true, ctrl: false, alt: false })).toBe('rotate-left');
        });
    });

    describe('Action Categories', () => {
        it('should categorize camera movement actions as continuous', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.isContinuous('rotate-left')).toBe(true);
            expect(manager.isContinuous('rotate-right')).toBe(true);
            expect(manager.isContinuous('rotate-up')).toBe(true);
            expect(manager.isContinuous('rotate-down')).toBe(true);
            expect(manager.isContinuous('zoom-in')).toBe(true);
            expect(manager.isContinuous('zoom-out')).toBe(true);
        });

        it('should categorize toggle actions as single-fire', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            expect(manager.isContinuous('reset-view')).toBe(false);
            expect(manager.isContinuous('toggle-panel')).toBe(false);
            expect(manager.isContinuous('toggle-auto-rotate')).toBe(false);
            expect(manager.isContinuous('step-simulation')).toBe(false);
        });
    });

    describe('Custom Keybinds', () => {
        it('should allow runtime keybind updates', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            manager.setKeybind('rotate-left', ['KeyQ']);
            expect(manager.matchAction('KeyQ')).toBe('rotate-left');
            // Old binding should be removed
            expect(manager.matchAction('KeyA')).toBeNull();
        });

        it('should support multiple keys for same action', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            manager.setKeybind('zoom-in', ['Equal', 'KeyZ', 'NumpadAdd']);
            expect(manager.matchAction('Equal')).toBe('zoom-in');
            expect(manager.matchAction('KeyZ')).toBe('zoom-in');
            expect(manager.matchAction('NumpadAdd')).toBe('zoom-in');
        });
    });

    describe('Key Retrieval', () => {
        it('should return all keys for an action', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            const keys = manager.getKeysForAction('rotate-left');
            expect(keys).toContain('KeyA');
            expect(keys).toContain('ArrowLeft');
        });

        it('should return empty array for unregistered action', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            // Cast to bypass type checking for testing
            const keys = manager.getKeysForAction('nonexistent-action' as any);
            expect(keys).toEqual([]);
        });

        it('should return all registered actions', () => {
            const manager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
            const actions = manager.getAllActions();
            expect(actions).toContain('rotate-left');
            expect(actions).toContain('zoom-in');
            expect(actions).toContain('toggle-panel');
            expect(actions.length).toBeGreaterThan(10);
        });
    });
});
