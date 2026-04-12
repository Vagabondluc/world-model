/**
 * Hex overlay rendering for Three.js
 */

import * as THREE from 'three';
import { HexCell } from '../overlay/hexGrid';

export interface HexOverlayConfig {
    borderColor: number;
    borderOpacity: number;
    borderWidth: number;
    enableHover: boolean;
}

export class HexOverlayRenderer {
    private scene: THREE.Scene;
    // private cells: HexCell[];
    private borderLines: THREE.LineSegments | null = null;
    // private hoveredCell: string | null = null;
    private config: HexOverlayConfig;

    constructor(scene: THREE.Scene, config: Partial<HexOverlayConfig> = {}) {
        this.scene = scene;
        // this.cells = [];
        this.config = {
            borderColor: 0x7f13ec,
            borderOpacity: 0.4,
            borderWidth: 2,
            enableHover: true,
            ...config
        };
    }

    /**
     * Create hex overlay from cells
     */
    createOverlay(cells: HexCell[]): void {
        // this.cells = cells;

        // Remove existing overlay
        if (this.borderLines) {
            this.scene.remove(this.borderLines);
            this.borderLines.geometry.dispose();
            (this.borderLines.material as THREE.Material).dispose();
        }

        // Create border geometry
        const positions: number[] = [];

        cells.forEach(cell => {
            const vertexCount = cell.vertices.length;

            // Create lines between vertices
            for (let i = 0; i < vertexCount; i++) {
                const v1 = cell.vertices[i];
                const v2 = cell.vertices[(i + 1) % vertexCount];

                // Subdivide edges to follow sphere curvature
                this.addCurvedEdge(positions, v1, v2);
            }
        });

        // Create Three.js geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        // Create material
        const material = new THREE.LineBasicMaterial({
            color: this.config.borderColor,
            transparent: true,
            opacity: this.config.borderOpacity,
            linewidth: this.config.borderWidth
        });

        // Create line segments
        this.borderLines = new THREE.LineSegments(geometry, material);
        this.scene.add(this.borderLines);
    }

    /**
     * Update overlay colors (for biome visualization)
     */
    updateColors(_cellColors: Map<string, number>): void {
        // TODO: Implement per-cell coloring
        // This will require instanced rendering or separate geometries per cell
    }

    /**
     * Highlight a cell on hover
     */
    highlightCell(_cellId: string | null): void {
        // this.hoveredCell = cellId;
        // TODO: Implement hover highlighting
    }

    /**
     * Dispose resources
     */
    dispose(): void {
        if (this.borderLines) {
            this.scene.remove(this.borderLines);
            this.borderLines.geometry.dispose();
            (this.borderLines.material as THREE.Material).dispose();
            this.borderLines = null;
        }
    }


    /**
     * Add edge points following great circle arc from v1 to v2
     */
    private addCurvedEdge(positions: number[], v1: { x: number, y: number, z: number }, v2: { x: number, y: number, z: number }): void {
        const start = new THREE.Vector3(v1.x, v1.y, v1.z);
        const end = new THREE.Vector3(v2.x, v2.y, v2.z);

        // Number of segments based on distance/angle could be dynamic, hardcoded for now
        const segments = 4; // Sufficient for hex edges on sphere

        let prev = start;
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const current = new THREE.Vector3().copy(start).lerp(end, t).normalize().multiplyScalar(start.length());

            // Push segment
            positions.push(prev.x, prev.y, prev.z);
            positions.push(current.x, current.y, current.z);

            prev = current;
        }
    }
}
