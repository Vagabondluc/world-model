import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { CameraController } from '../CameraController';

// Mock OrbitControls
function createMockOrbitControls(camera: THREE.Camera) {
    return {
        target: new THREE.Vector3(0, 0, 0),
        enableDamping: true,
        dampingFactor: 0.05,
        autoRotate: true,
        autoRotateSpeed: 0.5,
        minDistance: 2,
        maxDistance: 10,
        minAzimuthAngle: -Infinity,
        maxAzimuthAngle: Infinity,
        getAzimuthalAngle: vi.fn(() => 0),
        getPolarAngle: vi.fn(() => Math.PI / 2),
        update: vi.fn(),
        dispose: vi.fn(),
    };
}

describe('CameraController', () => {
    let mockCamera: THREE.PerspectiveCamera;
    let mockControls: ReturnType<typeof createMockOrbitControls>;
    let controller: CameraController;

    beforeEach(() => {
        mockCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        mockCamera.position.set(0, 0, 5);
        mockControls = createMockOrbitControls(mockCamera);
        controller = new CameraController(mockControls as any, mockCamera, { globeRadius: 2 });
    });

    describe('Rotation', () => {
        it('should rotate camera horizontally', () => {
            const initialX = mockCamera.position.x;
            controller.rotateHorizontal(45); // 45 degrees

            // Camera position should have changed
            expect(mockCamera.position.x).not.toBeCloseTo(initialX);
            expect(mockControls.update).toHaveBeenCalled();
        });

        it('should rotate camera vertically', () => {
            const initialY = mockCamera.position.y;
            controller.rotateVertical(30); // 30 degrees up

            // Camera position should have changed
            expect(mockCamera.position.y).not.toBeCloseTo(initialY);
            expect(mockControls.update).toHaveBeenCalled();
        });

        it('should clamp vertical rotation to prevent pole flipping', () => {
            // Try to rotate all the way to the pole
            controller.rotateVertical(180);

            // Should be clamped, not at exactly 0 or PI
            const spherical = new THREE.Spherical();
            spherical.setFromVector3(mockCamera.position.clone().sub(mockControls.target));

            expect(spherical.phi).toBeGreaterThan(0.05);
            expect(spherical.phi).toBeLessThan(Math.PI - 0.05);
        });
    });

    describe('Zoom', () => {
        it('should zoom to specified distance', () => {
            controller.zoomTo(4);
            expect(mockCamera.position.length()).toBeCloseTo(4);
        });

        it('should enforce minimum zoom distance', () => {
            controller.zoomTo(0.5); // Below min (2 * 1.2 = 2.4)
            expect(mockCamera.position.length()).toBeGreaterThanOrEqual(2.4);
        });

        it('should enforce maximum zoom distance', () => {
            controller.zoomTo(100); // Above max (2 * 6 = 12)
            expect(mockCamera.position.length()).toBeLessThanOrEqual(12);
        });

        it('should zoom in by relative amount', () => {
            const initialDistance = controller.getCurrentDistance();
            controller.zoomIn(0.2); // 20%
            expect(controller.getCurrentDistance()).toBeLessThan(initialDistance);
        });

        it('should zoom out by relative amount', () => {
            const initialDistance = controller.getCurrentDistance();
            controller.zoomOut(0.2); // 20%
            expect(controller.getCurrentDistance()).toBeGreaterThan(initialDistance);
        });

        it('should return current distance', () => {
            const distance = controller.getCurrentDistance();
            expect(distance).toBeCloseTo(5); // Initial camera z position
        });
    });

    describe('Animated Zoom', () => {
        it('should animate zoom over time', () => {
            const initialDistance = controller.getCurrentDistance();
            controller.zoomTo(8, { animated: true });

            // After some time, should be partway
            controller.update(250); // Half of animation duration
            const midDistance = controller.getCurrentDistance();

            expect(midDistance).toBeGreaterThan(initialDistance);
            expect(midDistance).toBeLessThan(8);

            // After animation completes
            controller.update(500);
            expect(controller.getCurrentDistance()).toBeCloseTo(8);
        });
    });

    describe('Center On', () => {
        it('should update target to cell center', () => {
            const cell = { center: { x: 1, y: 0.5, z: 0 } };
            controller.centerOn(cell);

            expect(mockControls.target.x).toBeCloseTo(1);
            expect(mockControls.target.y).toBeCloseTo(0.5);
            expect(mockControls.target.z).toBeCloseTo(0);
        });

        it('should animate centering when animated option is true', () => {
            const cell = { center: { x: 2, y: 0, z: 0 } };
            controller.centerOn(cell, { animated: true });

            // Initially not at target
            expect(mockControls.target.x).toBeCloseTo(0);

            // After animation
            controller.update(600);
            expect(mockControls.target.x).toBeCloseTo(2);
        });
    });

    describe('Reset View', () => {
        it('should return camera to default position', () => {
            // Move camera
            controller.rotateHorizontal(90);
            controller.zoomTo(8);

            const movedPosition = mockCamera.position.clone();
            expect(movedPosition.z).not.toBeCloseTo(5);

            // Reset
            controller.resetView();

            expect(mockCamera.position.z).toBeCloseTo(5);
        });

        it('should animate reset when option is true', () => {
            controller.zoomTo(8);
            controller.resetView({ animated: true });

            // Should start animation, not immediately reset
            const posAfterCall = mockCamera.position.clone();
            controller.update(600);

            expect(mockCamera.position.z).toBeCloseTo(5);
        });
    });

    describe('Auto-Rotate', () => {
        it('should toggle auto-rotate', () => {
            expect(mockControls.autoRotate).toBe(true);

            const result = controller.toggleAutoRotate();
            expect(result).toBe(false);
            expect(mockControls.autoRotate).toBe(false);

            const result2 = controller.toggleAutoRotate();
            expect(result2).toBe(true);
            expect(mockControls.autoRotate).toBe(true);
        });

        it('should set auto-rotate explicitly', () => {
            controller.setAutoRotate(false);
            expect(mockControls.autoRotate).toBe(false);

            controller.setAutoRotate(true);
            expect(mockControls.autoRotate).toBe(true);
        });

        it('should report auto-rotate state', () => {
            mockControls.autoRotate = false;
            expect(controller.isAutoRotating()).toBe(false);
        });
    });

    describe('Configuration', () => {
        it('should allow updating movement config', () => {
            controller.setConfig({ rotationSpeed: 120 });
            const config = controller.getMovementConfig();
            expect(config.rotationSpeed).toBe(120);
        });

        it('should apply zoom constraints from config', () => {
            // Default min is 1.2 * radius = 2.4
            expect(mockControls.minDistance).toBe(2.4);
            // Default max is 6.0 * radius = 12
            expect(mockControls.maxDistance).toBe(12);
        });
    });
});
