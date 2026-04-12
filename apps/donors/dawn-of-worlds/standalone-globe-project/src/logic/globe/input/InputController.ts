/**
 * Input Controller
 * Central manager for keyboard and mouse input state and event emission
 */

import {
    InputAction,
    ModifierState,
    MousePosition,
    ViewportRect,
    WheelEvent,
    MovementConfig,
    DEFAULT_MOVEMENT_CONFIG
} from './types';
import { KeyboardShortcutManager } from './KeyboardShortcutManager';

type InputEventCallback = (deltaTime: number) => void;

export class InputController {
    private pressedKeys: Set<string> = new Set();
    private justPressedKeys: Set<string> = new Set();
    private mouseButtons: Set<number> = new Set();
    private _mousePosition: MousePosition = { x: 0, y: 0 };
    private _scrollDelta: number = 0;
    private _modifiers: ModifierState = { shift: false, ctrl: false, alt: false };

    private shortcutManager: KeyboardShortcutManager;
    private config: MovementConfig;
    private eventListeners: Map<InputAction, InputEventCallback[]> = new Map();

    // Track which single-fire actions have already fired this press
    private firedSingleActions: Set<InputAction> = new Set();

    constructor(
        shortcutManager: KeyboardShortcutManager = new KeyboardShortcutManager(),
        config: MovementConfig = DEFAULT_MOVEMENT_CONFIG
    ) {
        this.shortcutManager = shortcutManager;
        this.config = config;
    }

    // --- Key State ---

    handleKeyDown(code: string): void {
        if (!this.pressedKeys.has(code)) {
            this.pressedKeys.add(code);
            this.justPressedKeys.add(code);
        }

        // Update modifiers
        if (code === 'ShiftLeft' || code === 'ShiftRight') {
            this._modifiers.shift = true;
        } else if (code === 'ControlLeft' || code === 'ControlRight') {
            this._modifiers.ctrl = true;
        } else if (code === 'AltLeft' || code === 'AltRight') {
            this._modifiers.alt = true;
        }
    }

    handleKeyUp(code: string): void {
        this.pressedKeys.delete(code);
        this.justPressedKeys.delete(code);

        // Update modifiers
        if (code === 'ShiftLeft' || code === 'ShiftRight') {
            this._modifiers.shift = false;
        } else if (code === 'ControlLeft' || code === 'ControlRight') {
            this._modifiers.ctrl = false;
        } else if (code === 'AltLeft' || code === 'AltRight') {
            this._modifiers.alt = false;
        }

        // Clear fired single actions for this key
        const action = this.shortcutManager.matchAction(code, this._modifiers);
        if (action) {
            this.firedSingleActions.delete(action);
        }
    }

    isKeyPressed(code: string): boolean {
        return this.pressedKeys.has(code);
    }

    getPressedKeys(): string[] {
        return Array.from(this.pressedKeys);
    }

    get modifiers(): ModifierState {
        return { ...this._modifiers };
    }

    // --- Mouse State ---

    handleMouseMove(event: { clientX: number; clientY: number }, rect: ViewportRect): void {
        const left = rect.left ?? 0;
        const top = rect.top ?? 0;

        this._mousePosition = {
            x: ((event.clientX - left) / rect.width) * 2 - 1,
            y: -((event.clientY - top) / rect.height) * 2 + 1
        };
    }

    handleMouseDown(button: number): void {
        this.mouseButtons.add(button);
    }

    handleMouseUp(button: number): void {
        this.mouseButtons.delete(button);
    }

    isMouseButtonPressed(button: number): boolean {
        return this.mouseButtons.has(button);
    }

    get mousePosition(): MousePosition {
        return { ...this._mousePosition };
    }

    // --- Scroll ---

    handleWheel(event: WheelEvent): void {
        this._scrollDelta = event.deltaY;
    }

    getScrollDelta(): number {
        return this._scrollDelta;
    }

    // --- Event System ---

    on(action: InputAction, callback: InputEventCallback): void {
        const listeners = this.eventListeners.get(action) || [];
        listeners.push(callback);
        this.eventListeners.set(action, listeners);
    }

    off(action: InputAction, callback: InputEventCallback): void {
        const listeners = this.eventListeners.get(action);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    private emit(action: InputAction, deltaTime: number): void {
        const listeners = this.eventListeners.get(action);
        if (listeners) {
            for (const listener of listeners) {
                listener(deltaTime);
            }
        }
    }

    // --- Update Loop ---

    update(deltaTimeMs: number): void {
        const deltaTime = deltaTimeMs / 1000; // Convert to seconds

        // Process all pressed keys
        for (const code of this.pressedKeys) {
            const action = this.shortcutManager.matchAction(code, this._modifiers);
            if (!action) continue;

            const isContinuous = this.shortcutManager.isContinuous(action);

            if (isContinuous) {
                // Continuous actions fire every frame
                this.emit(action, deltaTime);
            } else {
                // Single-fire actions only fire once per press
                if (!this.firedSingleActions.has(action) && this.justPressedKeys.has(code)) {
                    this.firedSingleActions.add(action);
                    this.emit(action, deltaTime);
                }
            }
        }

        // Clear just-pressed state
        this.justPressedKeys.clear();

        // Process scroll delta
        if (this._scrollDelta !== 0) {
            const scrollAction = this._scrollDelta < 0 ? 'zoom-in' : 'zoom-out';
            // Scroll is an event, but we can treat it as a momentary input
            // Multiply by a factor to make it feel responsive (e.g. 5.0 for strong impulse)
            const scrollStrength = 15.0;
            this.emit(scrollAction as InputAction, deltaTime * scrollStrength);
        }

        // Reset scroll delta after processing
        this._scrollDelta = 0;
    }

    // --- Config ---

    setConfig(config: Partial<MovementConfig>): void {
        this.config = { ...this.config, ...config };
    }

    getConfig(): MovementConfig {
        return { ...this.config };
    }

    /**
     * Get speed multiplier based on current modifiers
     */
    getSpeedMultiplier(): number {
        if (this._modifiers.shift) return this.config.shiftMultiplier;
        if (this._modifiers.ctrl) return this.config.ctrlMultiplier;
        return 1.0;
    }

    // --- Cleanup ---

    dispose(): void {
        this.pressedKeys.clear();
        this.justPressedKeys.clear();
        this.mouseButtons.clear();
        this.eventListeners.clear();
        this.firedSingleActions.clear();
    }
}
