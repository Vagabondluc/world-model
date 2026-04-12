/**
 * Tests for Compass Calculations
 */

import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
    calculateCompassHeading,
    calculateMagneticHeading,
    normalizeHeading,
    validateDeclinationAngle,
    isAtPole,
    formatDeclinationAngle,
    formatHeading,
    getCardinalDirection,
    getShortestRotationDelta,
    easeOutCubic,
} from '../compassCalculations';

// Helper to create a camera at a specific position looking at origin
function createCameraLookingAt(x: number, y: number, z: number): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    return camera;
}

describe('Compass Calculations', () => {
    describe('calculateCompassHeading', () => {
        const globe = new THREE.Mesh();

        it('should return 0° when camera faces north', () => {
            const camera = createCameraLookingAt(0, 0, 5);
            const heading = calculateCompassHeading(camera, globe);

            expect(heading).toBeCloseTo(0, 1);
        });

        it('should return 90° when camera faces east', () => {
            const camera = createCameraLookingAt(5, 0, 0);
            const heading = calculateCompassHeading(camera, globe);

            expect(heading).toBeCloseTo(90, 1);
        });

        it('should return 180° when camera faces south', () => {
            const camera = createCameraLookingAt(0, 0, -5);
            const heading = calculateCompassHeading(camera, globe);

            expect(heading).toBeCloseTo(180, 1);
        });

        it('should return 270° when camera faces west', () => {
            const camera = createCameraLookingAt(-5, 0, 0);
            const heading = calculateCompassHeading(camera, globe);

            expect(heading).toBeCloseTo(270, 1);
        });

        it('should return null when camera is at north pole', () => {
            const camera = createCameraLookingAt(0, 5, 0);
            const heading = calculateCompassHeading(camera, globe);

            expect(heading).toBeNull();
        });

        it('should return null when camera is at south pole', () => {
            const camera = createCameraLookingAt(0, -5, 0);
            const heading = calculateCompassHeading(camera, globe);

            expect(heading).toBeNull();
        });

        it('should handle diagonal orientations', () => {
            const camera = createCameraLookingAt(3, 0, 3);
            const heading = calculateCompassHeading(camera, globe);

            // Should return a valid heading (camera looking at origin from diagonal)
            expect(heading).not.toBeNull();
            expect(heading).toBeGreaterThanOrEqual(0);
            expect(heading).toBeLessThan(360);
        });
    });

    describe('calculateMagneticHeading', () => {
        it('should add positive declination', () => {
            const result = calculateMagneticHeading(0, 12);
            expect(result).toBe(12);
        });

        it('should add negative declination', () => {
            const result = calculateMagneticHeading(90, -8);
            expect(result).toBe(82);
        });

        it('should handle zero declination', () => {
            const result = calculateMagneticHeading(180, 0);
            expect(result).toBe(180);
        });

        it('should wrap at 360 boundary', () => {
            const result = calculateMagneticHeading(350, 15);
            expect(result).toBe(5);
        });

        it('should handle large positive declination', () => {
            const result = calculateMagneticHeading(270, 180);
            expect(result).toBe(90);
        });

        it('should handle large negative declination', () => {
            const result = calculateMagneticHeading(90, -180);
            expect(result).toBe(270);
        });

        it('should handle negative geographic heading', () => {
            const result = calculateMagneticHeading(-45, 10);
            expect(result).toBe(325);
        });
    });

    describe('normalizeHeading', () => {
        it('should keep values in range', () => {
            expect(normalizeHeading(180)).toBe(180);
            expect(normalizeHeading(0)).toBe(0);
            expect(normalizeHeading(359)).toBe(359);
        });

        it('should handle 360', () => {
            expect(normalizeHeading(360)).toBe(0);
        });

        it('should normalize negative values', () => {
            expect(normalizeHeading(-45)).toBe(315);
            expect(normalizeHeading(-90)).toBe(270);
            expect(normalizeHeading(-180)).toBe(180);
        });

        it('should normalize large positive values', () => {
            expect(normalizeHeading(450)).toBe(90);
            expect(normalizeHeading(720)).toBe(0);
            expect(normalizeHeading(361)).toBe(1);
        });

        it('should normalize large negative values', () => {
            expect(normalizeHeading(-450)).toBe(270);
            expect(normalizeHeading(-720)).toBeCloseTo(0, 5);
        });

        it('should handle decimal values', () => {
            expect(normalizeHeading(361.5)).toBeCloseTo(1.5, 1);
            expect(normalizeHeading(-45.3)).toBeCloseTo(314.7, 1);
        });
    });

    describe('validateDeclinationAngle', () => {
        it('should return valid angles unchanged', () => {
            expect(validateDeclinationAngle(12)).toBe(12);
            expect(validateDeclinationAngle(0)).toBe(0);
            expect(validateDeclinationAngle(-8)).toBe(-8);
        });

        it('should clamp at minimum', () => {
            expect(validateDeclinationAngle(-180)).toBe(-180);
            expect(validateDeclinationAngle(-181)).toBe(-180);
            expect(validateDeclinationAngle(-200)).toBe(-180);
        });

        it('should clamp at maximum', () => {
            expect(validateDeclinationAngle(180)).toBe(180);
            expect(validateDeclinationAngle(181)).toBe(180);
            expect(validateDeclinationAngle(200)).toBe(180);
        });

        it('should handle extreme values', () => {
            expect(validateDeclinationAngle(-540)).toBe(-180);
            expect(validateDeclinationAngle(540)).toBe(180);
        });
    });

    describe('isAtPole', () => {
        const globe = new THREE.Mesh();

        it('should detect north pole', () => {
            const camera = createCameraLookingAt(0, 5, 0);
            expect(isAtPole(camera)).toBe(true);
        });

        it('should detect south pole', () => {
            const camera = createCameraLookingAt(0, -5, 0);
            expect(isAtPole(camera)).toBe(true);
        });

        it('should not detect pole for horizontal view', () => {
            const camera = createCameraLookingAt(5, 0, 0);
            expect(isAtPole(camera)).toBe(false);
        });

        it('should respect custom threshold', () => {
            const camera = createCameraLookingAt(0, 3, 1);
            // Camera at (0,3,1) looking at origin has ~71deg vertical angle (cos 0.95)
            expect(isAtPole(camera, 0.94)).toBe(true);
            expect(isAtPole(camera, 0.96)).toBe(false);
        });
    });

    describe('formatDeclinationAngle', () => {
        it('should format positive angles as East', () => {
            expect(formatDeclinationAngle(12)).toBe('12°E');
            expect(formatDeclinationAngle(25)).toBe('25°E');
        });

        it('should format negative angles as West', () => {
            expect(formatDeclinationAngle(-8)).toBe('8°W');
            expect(formatDeclinationAngle(-15)).toBe('15°W');
        });

        it('should format zero', () => {
            expect(formatDeclinationAngle(0)).toBe('0°E');
        });

        it('should round to nearest degree', () => {
            expect(formatDeclinationAngle(12.6)).toBe('13°E');
            expect(formatDeclinationAngle(-8.3)).toBe('8°W');
        });
    });

    describe('formatHeading', () => {
        it('should format with leading zeros', () => {
            expect(formatHeading(0)).toBe('000°');
            expect(formatHeading(45)).toBe('045°');
            expect(formatHeading(180)).toBe('180°');
        });

        it('should normalize before formatting', () => {
            expect(formatHeading(360)).toBe('000°');
            expect(formatHeading(-45)).toBe('315°');
        });

        it('should support precision', () => {
            expect(formatHeading(45.678, 1)).toBe('045.7°');
            expect(formatHeading(180.123, 2)).toBe('180.12°');
        });
    });

    describe('getCardinalDirection', () => {
        it('should return correct cardinal directions', () => {
            expect(getCardinalDirection(0)).toBe('N');
            expect(getCardinalDirection(45)).toBe('NE');
            expect(getCardinalDirection(90)).toBe('E');
            expect(getCardinalDirection(135)).toBe('SE');
            expect(getCardinalDirection(180)).toBe('S');
            expect(getCardinalDirection(225)).toBe('SW');
            expect(getCardinalDirection(270)).toBe('W');
            expect(getCardinalDirection(315)).toBe('NW');
        });

        it('should handle values near boundaries', () => {
            expect(getCardinalDirection(22)).toBe('N');
            expect(getCardinalDirection(23)).toBe('NE');
            expect(getCardinalDirection(67)).toBe('NE');
            expect(getCardinalDirection(68)).toBe('E');
        });

        it('should normalize before determining direction', () => {
            expect(getCardinalDirection(360)).toBe('N');
            expect(getCardinalDirection(-90)).toBe('W');
        });
    });

    describe('getShortestRotationDelta', () => {
        it('should return simple delta for nearby values', () => {
            expect(getShortestRotationDelta(0, 45)).toBe(45);
            expect(getShortestRotationDelta(45, 90)).toBe(45);
            expect(getShortestRotationDelta(90, 45)).toBe(-45);
        });

        it('should take shorter path across 0/360 boundary', () => {
            expect(getShortestRotationDelta(350, 10)).toBe(20);
            expect(getShortestRotationDelta(10, 350)).toBe(-20);
        });

        it('should handle 180 degree rotation', () => {
            const delta = getShortestRotationDelta(0, 180);
            expect(Math.abs(delta)).toBe(180);
        });

        it('should prefer clockwise for exact 180', () => {
            expect(getShortestRotationDelta(90, 270)).toBe(180);
        });
    });

    describe('easeOutCubic', () => {
        it('should return 0 at start', () => {
            expect(easeOutCubic(0)).toBe(0);
        });

        it('should return 1 at end', () => {
            expect(easeOutCubic(1)).toBe(1);
        });

        it('should ease out (slow at end)', () => {
            const mid = easeOutCubic(0.5);
            expect(mid).toBeGreaterThan(0.5); // Should be ahead of linear
            expect(mid).toBeLessThan(1);
        });

        it('should be continuous', () => {
            const values = [0, 0.25, 0.5, 0.75, 1].map(easeOutCubic);
            for (let i = 1; i < values.length; i++) {
                expect(values[i]).toBeGreaterThan(values[i - 1]);
            }
        });
    });
});
