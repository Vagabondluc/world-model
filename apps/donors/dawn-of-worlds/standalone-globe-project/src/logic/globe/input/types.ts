/**
 * Types for the input control system
 */

export interface ModifierState {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
}

export interface MousePosition {
    x: number;  // Normalized device coordinates (-1 to 1)
    y: number;
}

export interface ViewportRect {
    width: number;
    height: number;
    left?: number;
    top?: number;
}

export interface WheelEvent {
    deltaY: number;
    deltaX?: number;
}

export interface MovementConfig {
    rotationSpeed: number;      // Degrees per second
    zoomSpeed: number;          // Units per scroll tick
    shiftMultiplier: number;    // Speed multiplier when Shift held
    ctrlMultiplier: number;     // Speed multiplier when Ctrl held
    dampingFactor: number;      // Smoothing factor (0-1)
}

export const DEFAULT_MOVEMENT_CONFIG: MovementConfig = {
    rotationSpeed: 60,          // 60 degrees per second
    zoomSpeed: 0.5,             // 0.5 units per scroll tick
    shiftMultiplier: 2.0,
    ctrlMultiplier: 0.5,
    dampingFactor: 0.05
};

export type InputAction =
    // Camera actions
    | 'rotate-left'
    | 'rotate-right'
    | 'rotate-up'
    | 'rotate-down'
    | 'zoom-in'
    | 'zoom-out'
    | 'reset-view'
    | 'toggle-auto-rotate'
    // Selection actions
    | 'clear-selection'
    | 'cycle-next'
    | 'cycle-back'
    | 'center-selected'
    // Application actions
    | 'toggle-panel'
    | 'toggle-info'
    | 'step-simulation'
    | 'toggle-auto-run'
    | 'generate-world'
    | 'cycle-display-mode';

export interface KeybindConfig {
    camera: {
        rotateLeft: string[];
        rotateRight: string[];
        rotateUp: string[];
        rotateDown: string[];
        zoomIn: string[];
        zoomOut: string[];
        resetView: string[];
        toggleAutoRotate: string[];
    };
    selection: {
        clear: string[];
        cycleNext: string[];
        cycleBack: string[];
        centerSelected: string[];
    };
    application: {
        togglePanel: string[];
        toggleInfo: string[];
        stepSimulation: string[];
        toggleAutoRun: string[];
        generateWorld: string[];
        cycleDisplayMode: string[];
    };
}

export const DEFAULT_KEYBINDS: KeybindConfig = {
    camera: {
        rotateLeft: ['KeyA', 'ArrowLeft'],
        rotateRight: ['KeyD', 'ArrowRight'],
        rotateUp: ['KeyW', 'ArrowUp'],
        rotateDown: ['KeyS', 'ArrowDown'],
        zoomIn: ['Equal', 'NumpadAdd'],
        zoomOut: ['Minus', 'NumpadSubtract'],
        resetView: ['KeyR', 'Home'],
        toggleAutoRotate: ['Space']
    },
    selection: {
        clear: ['Escape'],
        cycleNext: ['Tab'],
        cycleBack: ['Shift+Tab'],
        centerSelected: ['KeyC']
    },
    application: {
        togglePanel: ['KeyP'],
        toggleInfo: ['KeyI'],
        stepSimulation: ['KeyN'],
        toggleAutoRun: ['KeyT'],
        generateWorld: ['KeyG'],
        cycleDisplayMode: ['KeyM']
    }
};

// Actions that fire continuously while held
export const CONTINUOUS_ACTIONS: InputAction[] = [
    'rotate-left',
    'rotate-right',
    'rotate-up',
    'rotate-down',
    'zoom-in',
    'zoom-out'
];
