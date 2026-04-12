/**
 * Keyboard Shortcut Manager
 * Maps keycodes to actions with support for modifier combinations
 */

import {
    InputAction,
    ModifierState,
    KeybindConfig,
    DEFAULT_KEYBINDS,
    CONTINUOUS_ACTIONS
} from './types';

interface ActionBinding {
    action: InputAction;
    keys: string[];
}

export class KeyboardShortcutManager {
    private bindings: Map<string, InputAction> = new Map();
    private actionToKeys: Map<InputAction, string[]> = new Map();

    constructor(keybinds: KeybindConfig = DEFAULT_KEYBINDS) {
        this.loadKeybinds(keybinds);
    }

    private loadKeybinds(keybinds: KeybindConfig): void {
        this.bindings.clear();
        this.actionToKeys.clear();

        // Camera bindings
        this.registerAction('rotate-left', keybinds.camera.rotateLeft);
        this.registerAction('rotate-right', keybinds.camera.rotateRight);
        this.registerAction('rotate-up', keybinds.camera.rotateUp);
        this.registerAction('rotate-down', keybinds.camera.rotateDown);
        this.registerAction('zoom-in', keybinds.camera.zoomIn);
        this.registerAction('zoom-out', keybinds.camera.zoomOut);
        this.registerAction('reset-view', keybinds.camera.resetView);
        this.registerAction('toggle-auto-rotate', keybinds.camera.toggleAutoRotate);

        // Selection bindings
        this.registerAction('clear-selection', keybinds.selection.clear);
        this.registerAction('cycle-next', keybinds.selection.cycleNext);
        this.registerAction('cycle-back', keybinds.selection.cycleBack);
        this.registerAction('center-selected', keybinds.selection.centerSelected);

        // Application bindings
        this.registerAction('toggle-panel', keybinds.application.togglePanel);
        this.registerAction('toggle-info', keybinds.application.toggleInfo);
        this.registerAction('step-simulation', keybinds.application.stepSimulation);
        this.registerAction('toggle-auto-run', keybinds.application.toggleAutoRun);
        this.registerAction('generate-world', keybinds.application.generateWorld);
        this.registerAction('cycle-display-mode', keybinds.application.cycleDisplayMode);
    }

    private registerAction(action: InputAction, keys: string[]): void {
        this.actionToKeys.set(action, keys);
        for (const key of keys) {
            this.bindings.set(key, action);
        }
    }

    /**
     * Match a key code to an action, considering modifiers
     */
    matchAction(keyCode: string, modifiers: ModifierState = { shift: false, ctrl: false, alt: false }): InputAction | null {
        // Check for modifier combinations first
        const combo = this.buildComboString(keyCode, modifiers);

        if (combo !== keyCode) {
            const comboAction = this.bindings.get(combo);
            if (comboAction) return comboAction;
        }

        // If no combo match and modifiers are active, don't match plain key
        // (Exception: continuous actions work with modifiers for speed adjustment)
        if ((modifiers.ctrl || modifiers.alt) && !this.isContinuousKey(keyCode)) {
            return null;
        }

        // Handle Shift+Tab specially
        if (modifiers.shift && keyCode === 'Tab') {
            const shiftTabAction = this.bindings.get('Shift+Tab');
            if (shiftTabAction) return shiftTabAction;
        }

        return this.bindings.get(keyCode) || null;
    }

    private buildComboString(keyCode: string, modifiers: ModifierState): string {
        const parts: string[] = [];
        if (modifiers.ctrl) parts.push('Ctrl');
        if (modifiers.alt) parts.push('Alt');
        if (modifiers.shift) parts.push('Shift');
        parts.push(keyCode);
        return parts.join('+');
    }

    private isContinuousKey(keyCode: string): boolean {
        const action = this.bindings.get(keyCode);
        return action ? CONTINUOUS_ACTIONS.includes(action) : false;
    }

    /**
     * Check if an action is continuous (fires while held) or single-fire
     */
    isContinuous(action: InputAction): boolean {
        return CONTINUOUS_ACTIONS.includes(action);
    }

    /**
     * Set or update a keybind at runtime
     */
    setKeybind(action: InputAction, keys: string[]): void {
        // Remove old bindings for this action
        const oldKeys = this.actionToKeys.get(action);
        if (oldKeys) {
            for (const key of oldKeys) {
                if (this.bindings.get(key) === action) {
                    this.bindings.delete(key);
                }
            }
        }

        // Register new bindings
        this.registerAction(action, keys);
    }

    /**
     * Get all keys bound to an action
     */
    getKeysForAction(action: InputAction): string[] {
        return this.actionToKeys.get(action) || [];
    }

    /**
     * Get all registered actions
     */
    getAllActions(): InputAction[] {
        return Array.from(this.actionToKeys.keys());
    }
}
