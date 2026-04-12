/**
 * Compass Store - State Management for Dual-Indicator Compass UI
 * 
 * Manages the state of the compass overlay including heading values,
 * declination angle, and display mode. Uses Zustand with persistence
 * for user preferences.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export type CompassDisplayMode = 'BOTH' | 'GEOGRAPHIC_ONLY' | 'MAGNETIC_ONLY';

export interface CompassState {
    geographicHeading: number;      // Degrees from True North (0-360)
    magneticHeading: number;        // Degrees from Magnetic North (0-360)
    declinationAngle: number;       // Declination setting (-180 to 180)
    displayMode: CompassDisplayMode;
    isAnimating: boolean;
}

export interface CompassActions {
    setGeographicHeading: (heading: number) => void;
    setMagneticHeading: (heading: number) => void;
    setDeclinationAngle: (angle: number) => void;
    setDisplayMode: (mode: CompassDisplayMode) => void;
    toggleDisplayMode: () => void;
    reset: () => void;
}

export type CompassStore = CompassState & CompassActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const INITIAL_STATE: CompassState = {
    geographicHeading: 0,
    magneticHeading: 0,
    declinationAngle: 12, // Default Earth declination
    displayMode: 'BOTH',
    isAnimating: false,
};

// ============================================================================
// STORE CREATION
// ============================================================================

export const useCompassStore = create<CompassStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,

            /**
             * Set the geographic heading (True North reference)
             */
            setGeographicHeading: (heading) => {
                set({ geographicHeading: heading });
            },

            /**
             * Set the magnetic heading (Magnetic North reference)
             */
            setMagneticHeading: (heading) => {
                set({ magneticHeading: heading });
            },

            /**
             * Set the declination angle
             * Angle is clamped to valid range (-180 to 180)
             */
            setDeclinationAngle: (angle) => {
                const clampedAngle = Math.max(-180, Math.min(180, angle));
                set({ declinationAngle: clampedAngle });
            },

            /**
             * Set the display mode directly
             */
            setDisplayMode: (mode) => {
                set({ displayMode: mode });
            },

            /**
             * Toggle through display modes in sequence:
             * BOTH -> GEOGRAPHIC_ONLY -> MAGNETIC_ONLY -> BOTH
             */
            toggleDisplayMode: () => {
                const modes: CompassDisplayMode[] = ['BOTH', 'GEOGRAPHIC_ONLY', 'MAGNETIC_ONLY'];
                const currentMode = get().displayMode;
                const currentIndex = modes.indexOf(currentMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                set({ displayMode: modes[nextIndex] });
            },

            /**
             * Reset compass to initial state
             */
            reset: () => {
                set({
                    geographicHeading: 0,
                    magneticHeading: 0,
                    displayMode: 'BOTH',
                    isAnimating: false,
                });
            },
        }),
        {
            name: 'compass-storage',
            partialize: (state) => ({
                declinationAngle: state.declinationAngle,
                displayMode: state.displayMode,
            }),
        }
    )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get the current compass state
 */
export const selectCompassState = (state: CompassStore): CompassState => ({
    geographicHeading: state.geographicHeading,
    magneticHeading: state.magneticHeading,
    declinationAngle: state.declinationAngle,
    displayMode: state.displayMode,
    isAnimating: state.isAnimating,
});

/**
 * Check if both needles are visible
 */
export const selectShowBothNeedles = (state: CompassStore): boolean => {
    return state.displayMode === 'BOTH';
};

/**
 * Check if geographic needle is visible
 */
export const selectShowGeographicNeedle = (state: CompassStore): boolean => {
    return state.displayMode === 'BOTH' || state.displayMode === 'GEOGRAPHIC_ONLY';
};

/**
 * Check if magnetic needle is visible
 */
export const selectShowMagneticNeedle = (state: CompassStore): boolean => {
    return state.displayMode === 'BOTH' || state.displayMode === 'MAGNETIC_ONLY';
};

/**
 * Check if declination arc should be shown
 */
export const selectShowDeclinationArc = (state: CompassStore): boolean => {
    return state.displayMode === 'BOTH' && state.declinationAngle !== 0;
};
