/**
 * Camera Controller
 * Programmatic camera API wrapping OrbitControls
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MovementConfig, DEFAULT_MOVEMENT_CONFIG } from './types';

export interface CameraControllerConfig {
    globeRadius: number;
    minZoomMultiplier?: number;  // Default 1.2
    maxZoomMultiplier?: number;  // Default 6.0
    movement?: Partial<MovementConfig>;
}

interface AnimationTarget {
    azimuth?: number;
    polar?: number;
    distance?: number;
    targetX?: number;
    targetY?: number;
    targetZ?: number;
}

export class CameraController {
    private controls: OrbitControls;
    private camera: THREE.Camera;
    private config: CameraControllerConfig;
    private movement: MovementConfig;

    private defaultPosition: THREE.Vector3;
    private defaultTarget: THREE.Vector3;

    private animationTarget: AnimationTarget | null = null;
    private animationDuration: number = 500; // ms
    private animationProgress: number = 0;
    private animationStartState: AnimationTarget = {};

    constructor(controls: OrbitControls, camera: THREE.Camera, config: CameraControllerConfig) {
        this.controls = controls;
        this.camera = camera;
        this.config = {
            minZoomMultiplier: 1.2,
            maxZoomMultiplier: 6.0,
            ...config
        };
        this.movement = { ...DEFAULT_MOVEMENT_CONFIG, ...config.movement };

        // Store default position for reset
        this.defaultPosition = camera.position.clone();
        this.defaultTarget = controls.target.clone();

        // Apply zoom constraints
        this.controls.minDistance = this.config.globeRadius * this.config.minZoomMultiplier!;
        this.controls.maxDistance = this.config.globeRadius * this.config.maxZoomMultiplier!;
    }

    // --- Rotation ---

    /**
     * Rotate camera horizontally (azimuth) by degrees
     */
    rotateHorizontal(degrees: number): void {
        const radians = degrees * (Math.PI / 180);
        const currentAzimuth = this.controls.getAzimuthalAngle();
        this.controls.minAzimuthAngle = -Infinity;
        this.controls.maxAzimuthAngle = Infinity;

        // OrbitControls uses spherical coordinates, we need to adjust camera position
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(
            this.camera.position.clone().sub(this.controls.target)
        );
        spherical.theta += radians;

        const newPos = new THREE.Vector3().setFromSpherical(spherical).add(this.controls.target);
        this.camera.position.copy(newPos);
        this.controls.update();
    }

    /**
     * Rotate camera vertically (polar angle) by degrees
     */
    rotateVertical(degrees: number): void {
        const radians = degrees * (Math.PI / 180);

        const spherical = new THREE.Spherical();
        spherical.setFromVector3(
            this.camera.position.clone().sub(this.controls.target)
        );

        // Clamp to prevent flipping at poles
        const minPolar = 0.1;
        const maxPolar = Math.PI - 0.1;
        spherical.phi = Math.max(minPolar, Math.min(maxPolar, spherical.phi - radians));

        const newPos = new THREE.Vector3().setFromSpherical(spherical).add(this.controls.target);
        this.camera.position.copy(newPos);
        this.controls.update();
    }

    // --- Zoom ---

    /**
     * Zoom to a specific distance from the target
     */
    zoomTo(distance: number, options?: { animated?: boolean }): void {
        const minDist = this.config.globeRadius * this.config.minZoomMultiplier!;
        const maxDist = this.config.globeRadius * this.config.maxZoomMultiplier!;
        const clampedDistance = Math.max(minDist, Math.min(maxDist, distance));

        if (options?.animated) {
            this.startAnimation({ distance: clampedDistance });
        } else {
            this.setDistance(clampedDistance);
        }
    }

    /**
     * Zoom in by a relative amount
     */
    zoomIn(amount: number = 0.1): void {
        // Move camera closer to target
        const currentDistance = this.getCurrentDistance();
        const newDistance = currentDistance / (1 + amount);
        const minDist = this.config.globeRadius * this.config.minZoomMultiplier!;
        const maxDist = this.config.globeRadius * this.config.maxZoomMultiplier!;
        const clampedDistance = Math.max(minDist, Math.min(maxDist, newDistance));
        this.setDistance(clampedDistance);
    }

    /**
     * Zoom out by a relative amount
     */
    zoomOut(amount: number = 0.1): void {
        // Move camera further from target
        const currentDistance = this.getCurrentDistance();
        const newDistance = currentDistance * (1 + amount);
        const minDist = this.config.globeRadius * this.config.minZoomMultiplier!;
        const maxDist = this.config.globeRadius * this.config.maxZoomMultiplier!;
        const clampedDistance = Math.max(minDist, Math.min(maxDist, newDistance));
        this.setDistance(clampedDistance);
    }

    private setDistance(distance: number): void {
        const direction = this.camera.position.clone().sub(this.controls.target).normalize();
        this.camera.position.copy(direction.multiplyScalar(distance).add(this.controls.target));
        // It's preferred to use zoomIn/zoomOut which use dolly.
        // If setDistance is used for absolute positioning (like zoomTo),
        // we might need to force update OrbitControls state if possible, though it's private.
        // For now, keep as is for absolute positioning but rely on dolly for relative zoom.
        this.controls.update();
    }

    getCurrentDistance(): number {
        return this.camera.position.distanceTo(this.controls.target);
    }

    // --- Center On ---

    /**
     * Center camera on a cell or point
     */
    centerOn(target: { center: { x: number; y: number; z: number } }, options?: { animated?: boolean }): void {
        const targetPoint = new THREE.Vector3(target.center.x, target.center.y, target.center.z);

        if (options?.animated) {
            this.startAnimation({
                targetX: targetPoint.x,
                targetY: targetPoint.y,
                targetZ: targetPoint.z
            });
        } else {
            this.controls.target.copy(targetPoint);
            this.controls.update();
        }
    }

    // --- Reset ---

    /**
     * Reset camera to default position
     */
    resetView(options?: { animated?: boolean }): void {
        if (options?.animated) {
            const defaultSpherical = new THREE.Spherical();
            defaultSpherical.setFromVector3(this.defaultPosition.clone().sub(this.defaultTarget));

            this.startAnimation({
                azimuth: defaultSpherical.theta,
                polar: defaultSpherical.phi,
                distance: defaultSpherical.radius,
                targetX: this.defaultTarget.x,
                targetY: this.defaultTarget.y,
                targetZ: this.defaultTarget.z
            });
        } else {
            this.camera.position.copy(this.defaultPosition);
            this.controls.target.copy(this.defaultTarget);
            this.controls.update();
        }
    }

    // --- Auto-Rotate ---

    toggleAutoRotate(): boolean {
        this.controls.autoRotate = !this.controls.autoRotate;
        return this.controls.autoRotate;
    }

    setAutoRotate(enabled: boolean): void {
        this.controls.autoRotate = enabled;
    }

    isAutoRotating(): boolean {
        return this.controls.autoRotate;
    }

    // --- Animation ---

    private startAnimation(target: AnimationTarget): void {
        this.animationTarget = target;
        this.animationProgress = 0;

        const spherical = new THREE.Spherical();
        spherical.setFromVector3(this.camera.position.clone().sub(this.controls.target));

        this.animationStartState = {
            azimuth: spherical.theta,
            polar: spherical.phi,
            distance: spherical.radius,
            targetX: this.controls.target.x,
            targetY: this.controls.target.y,
            targetZ: this.controls.target.z
        };
    }

    /**
     * Update animation state. Call this every frame.
     */
    update(deltaTimeMs: number): void {
        if (!this.animationTarget) return;

        this.animationProgress += deltaTimeMs;
        const t = Math.min(1, this.animationProgress / this.animationDuration);
        const eased = this.easeOutCubic(t);

        const spherical = new THREE.Spherical();

        // Interpolate spherical coordinates
        const currentAzimuth = this.lerp(
            this.animationStartState.azimuth ?? 0,
            this.animationTarget.azimuth ?? this.animationStartState.azimuth ?? 0,
            eased
        );
        const currentPolar = this.lerp(
            this.animationStartState.polar ?? Math.PI / 2,
            this.animationTarget.polar ?? this.animationStartState.polar ?? Math.PI / 2,
            eased
        );
        const currentDistance = this.lerp(
            this.animationStartState.distance ?? this.getCurrentDistance(),
            this.animationTarget.distance ?? this.animationStartState.distance ?? this.getCurrentDistance(),
            eased
        );

        // Interpolate target
        const currentTargetX = this.lerp(
            this.animationStartState.targetX ?? 0,
            this.animationTarget.targetX ?? this.animationStartState.targetX ?? 0,
            eased
        );
        const currentTargetY = this.lerp(
            this.animationStartState.targetY ?? 0,
            this.animationTarget.targetY ?? this.animationStartState.targetY ?? 0,
            eased
        );
        const currentTargetZ = this.lerp(
            this.animationStartState.targetZ ?? 0,
            this.animationTarget.targetZ ?? this.animationStartState.targetZ ?? 0,
            eased
        );

        this.controls.target.set(currentTargetX, currentTargetY, currentTargetZ);

        spherical.theta = currentAzimuth;
        spherical.phi = currentPolar;
        spherical.radius = currentDistance;

        const newPos = new THREE.Vector3().setFromSpherical(spherical).add(this.controls.target);
        this.camera.position.copy(newPos);
        this.controls.update();

        if (t >= 1) {
            this.animationTarget = null;
        }
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    private easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    // --- Config ---

    setConfig(config: Partial<MovementConfig>): void {
        this.movement = { ...this.movement, ...config };
    }

    getMovementConfig(): MovementConfig {
        return { ...this.movement };
    }
}
