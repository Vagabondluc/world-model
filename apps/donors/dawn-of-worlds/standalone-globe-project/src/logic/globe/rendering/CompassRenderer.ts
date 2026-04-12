/**
 * Three.js Compass Renderer - 3D Axis Gizmo
 * 
 * Renders a 3-axis orientation gizmo (X, Y, Z) to show the camera's orientation
 * relative to the world.
 */

import * as THREE from 'three';
import { CompassDisplayMode } from '../../../store/compassStore';

export interface CompassRendererConfig {
    container: HTMLElement;
    size?: number; // Compass diameter in pixels
}

export class CompassRenderer {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private axesGroup: THREE.Group;
    private background: THREE.Mesh;

    private container: HTMLElement;
    private displayMode: CompassDisplayMode = 'BOTH';

    constructor(config: CompassRendererConfig) {
        this.container = config.container;

        // Create scene
        this.scene = new THREE.Scene();

        // Create orthographic camera
        this.camera = this.createCamera();

        // Create axes group (rotates to match world orientation)
        this.axesGroup = new THREE.Group();
        this.scene.add(this.axesGroup);

        // Create background
        this.background = this.createBackground();
        this.scene.add(this.background);

        // Create axes
        this.createAxes();

        // Position compass in bottom-left corner
        this.updatePosition();
    }

    private createCamera(): THREE.OrthographicCamera {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const frustumSize = 10;

        const camera = new THREE.OrthographicCamera(
            -frustumSize * aspect / 2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            -frustumSize / 2,
            0.1,
            1000
        );

        camera.position.z = 10;
        return camera;
    }

    private createBackground(): THREE.Mesh {
        const geometry = new THREE.CircleGeometry(0.7, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.2, // Subtle background
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -1; // Behind axes
        return mesh;
    }

    private createAxes(): void {
        const axisLength = 0.5;
        const axisRadius = 0.03;
        const headLength = 0.15;
        const headRadius = 0.08;

        // X Axis (Red)
        this.createArrow(
            new THREE.Vector3(1, 0, 0),
            0xff4444,
            'X',
            axisLength, axisRadius, headLength, headRadius
        );

        // Y Axis (Green)
        this.createArrow(
            new THREE.Vector3(0, 1, 0),
            0x44ff44,
            'Y',
            axisLength, axisRadius, headLength, headRadius
        );

        // Z Axis (Blue)
        this.createArrow(
            new THREE.Vector3(0, 0, 1),
            0x4444ff,
            'Z',
            axisLength, axisRadius, headLength, headRadius
        );

        // Center sphere
        const centerGeometry = new THREE.SphereGeometry(axisRadius * 1.5, 16, 16);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        this.axesGroup.add(center);
    }

    private createArrow(
        direction: THREE.Vector3,
        color: number,
        label: string,
        length: number,
        radius: number,
        headLength: number,
        headRadius: number
    ): void {
        const arrowGroup = new THREE.Group();

        // Shaft
        const shaftLength = length - headLength;
        const shaftGeometry = new THREE.CylinderGeometry(radius, radius, shaftLength, 12);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const shaft = new THREE.Mesh(shaftGeometry, material);
        shaft.position.y = shaftLength / 2;
        arrowGroup.add(shaft);

        // Head
        const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 12);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = shaftLength + headLength / 2;
        arrowGroup.add(head);

        // Label
        const labelSprite = this.createLabel(label, color);
        labelSprite.position.y = length + 0.15;
        arrowGroup.add(labelSprite);

        // Rotate arrow to direction
        arrowGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

        this.axesGroup.add(arrowGroup);
    }

    private createLabel(text: string, color: number): THREE.Sprite {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#' + new THREE.Color(color).getHexString();
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.3, 0.3, 1);
        return sprite;
    }

    private updatePosition(): void {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const frustumSize = 10;

        // Position in bottom-left
        const paddingX = 1.0;
        const paddingY = 1.0;
        const compassX = -frustumSize * aspect / 2 + paddingX;
        const compassY = -frustumSize / 2 + paddingY;

        this.axesGroup.position.set(compassX, compassY, 0);
        this.background.position.set(compassX, compassY, -1);
    }

    /**
     * Update orientation based on main camera
     */
    update(mainCamera: THREE.Camera): void {
        // Inverse of main camera rotation makes the axes appear fixed in world space
        this.axesGroup.quaternion.copy(mainCamera.quaternion).invert();

        // Ensure labels always face the camera (optional polish)
        // With Orthographic camera, sprites usually auto-face.
    }

    /**
     * Legacy method for compatibility - no-op for now as we don't use headings
     */
    updateHeading(geographic: number, magnetic: number): void {
        // No-op
    }

    setDisplayMode(mode: CompassDisplayMode): void {
        this.displayMode = mode;
        // Could toggle visibility here if requested
    }

    hitTest(x: number, y: number): boolean {
        // Simple bounding box/circle check around the axes group position
        // Since it's 2D overlay coords, we can check radius distance

        const aspect = this.container.clientWidth / this.container.clientHeight;
        const frustumSize = 10;
        const paddingX = 1.0;
        const paddingY = 1.0;
        const centerX = -frustumSize * aspect / 2 + paddingX;
        const centerY = -frustumSize / 2 + paddingY;

        // Convert mouse to view coords
        // Standard normalized device coords: [-1, 1]
        const ndcX = (x / this.container.clientWidth) * 2 - 1;
        const ndcY = -(y / this.container.clientHeight) * 2 + 1;

        // Convert to camera coords
        const viewX = ndcX * (this.camera.right - this.camera.left) / 2 + (this.camera.right + this.camera.left) / 2;
        const viewY = ndcY * (this.camera.top - this.camera.bottom) / 2 + (this.camera.top + this.camera.bottom) / 2;

        // Check distance
        const dx = viewX - centerX;
        const dy = viewY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        return dist < 0.8; // Radius of interaction
    }

    resize(): void {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const frustumSize = 10;

        this.camera.left = -frustumSize * aspect / 2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = -frustumSize / 2;
        this.camera.updateProjectionMatrix();

        this.updatePosition();
    }

    render(renderer: THREE.WebGLRenderer): void {
        renderer.render(this.scene, this.camera);
    }

    dispose(): void {
        this.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
                (obj.material as THREE.Material).dispose();
            } else if (obj instanceof THREE.Sprite) {
                obj.material.map?.dispose();
                obj.material.dispose();
            }
        });
    }
}
