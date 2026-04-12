/**
 * Tests for Compass Store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCompassStore, type CompassDisplayMode } from '../compassStore';

describe('CompassStore', () => {
    beforeEach(() => {
        // Reset store to initial state before each test
        useCompassStore.getState().reset();
    });

    describe('Initialization', () => {
        it('should have correct initial state', () => {
            const state = useCompassStore.getState();

            expect(state.geographicHeading).toBe(0);
            expect(state.magneticHeading).toBe(0);
            expect(state.declinationAngle).toBe(12);
            expect(state.displayMode).toBe('BOTH');
            expect(state.isAnimating).toBe(false);
        });
    });

    describe('Heading Updates', () => {
        it('should update geographic heading', () => {
            const { setGeographicHeading } = useCompassStore.getState();

            setGeographicHeading(90);

            expect(useCompassStore.getState().geographicHeading).toBe(90);
        });

        it('should update magnetic heading', () => {
            const { setMagneticHeading } = useCompassStore.getState();

            setMagneticHeading(102);

            expect(useCompassStore.getState().magneticHeading).toBe(102);
        });
    });

    describe('Declination Angle', () => {
        it('should update declination angle', () => {
            const { setDeclinationAngle } = useCompassStore.getState();

            setDeclinationAngle(15);

            expect(useCompassStore.getState().declinationAngle).toBe(15);
        });

        it('should clamp declination angle to -180', () => {
            const { setDeclinationAngle } = useCompassStore.getState();

            setDeclinationAngle(-200);

            expect(useCompassStore.getState().declinationAngle).toBe(-180);
        });

        it('should clamp declination angle to 180', () => {
            const { setDeclinationAngle } = useCompassStore.getState();

            setDeclinationAngle(200);

            expect(useCompassStore.getState().declinationAngle).toBe(180);
        });

        it('should handle negative declination', () => {
            const { setDeclinationAngle } = useCompassStore.getState();

            setDeclinationAngle(-8);

            expect(useCompassStore.getState().declinationAngle).toBe(-8);
        });
    });

    describe('Display Mode', () => {
        it('should set display mode directly', () => {
            const { setDisplayMode } = useCompassStore.getState();

            setDisplayMode('GEOGRAPHIC_ONLY');

            expect(useCompassStore.getState().displayMode).toBe('GEOGRAPHIC_ONLY');
        });

        it('should toggle from BOTH to GEOGRAPHIC_ONLY', () => {
            const { toggleDisplayMode } = useCompassStore.getState();

            toggleDisplayMode();

            expect(useCompassStore.getState().displayMode).toBe('GEOGRAPHIC_ONLY');
        });

        it('should toggle from GEOGRAPHIC_ONLY to MAGNETIC_ONLY', () => {
            const { setDisplayMode, toggleDisplayMode } = useCompassStore.getState();

            setDisplayMode('GEOGRAPHIC_ONLY');
            toggleDisplayMode();

            expect(useCompassStore.getState().displayMode).toBe('MAGNETIC_ONLY');
        });

        it('should toggle from MAGNETIC_ONLY to BOTH', () => {
            const { setDisplayMode, toggleDisplayMode } = useCompassStore.getState();

            setDisplayMode('MAGNETIC_ONLY');
            toggleDisplayMode();

            expect(useCompassStore.getState().displayMode).toBe('BOTH');
        });

        it('should cycle through all modes correctly', () => {
            const { toggleDisplayMode } = useCompassStore.getState();

            // Start at BOTH
            expect(useCompassStore.getState().displayMode).toBe('BOTH');

            // Cycle to GEOGRAPHIC_ONLY
            toggleDisplayMode();
            expect(useCompassStore.getState().displayMode).toBe('GEOGRAPHIC_ONLY');

            // Cycle to MAGNETIC_ONLY
            toggleDisplayMode();
            expect(useCompassStore.getState().displayMode).toBe('MAGNETIC_ONLY');

            // Cycle back to BOTH
            toggleDisplayMode();
            expect(useCompassStore.getState().displayMode).toBe('BOTH');
        });

        it('should handle rapid toggles', () => {
            const { toggleDisplayMode } = useCompassStore.getState();

            // Toggle 10 times
            for (let i = 0; i < 10; i++) {
                toggleDisplayMode();
            }

            // Should be at GEOGRAPHIC_ONLY (10 % 3 = 1)
            expect(useCompassStore.getState().displayMode).toBe('GEOGRAPHIC_ONLY');
        });
    });

    describe('Reset', () => {
        it('should reset to initial state', () => {
            const store = useCompassStore.getState();

            // Modify state
            store.setGeographicHeading(90);
            store.setMagneticHeading(102);
            store.setDisplayMode('MAGNETIC_ONLY');

            // Reset
            store.reset();

            // Verify reset (note: declinationAngle should NOT reset as it's persisted)
            const state = useCompassStore.getState();
            expect(state.geographicHeading).toBe(0);
            expect(state.magneticHeading).toBe(0);
            expect(state.displayMode).toBe('BOTH');
            expect(state.isAnimating).toBe(false);
        });
    });
});
