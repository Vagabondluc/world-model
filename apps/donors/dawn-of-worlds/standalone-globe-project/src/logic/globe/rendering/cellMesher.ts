/**
 * Cell Mesher - Generates solid geometry for hex/pentagon cells
 */

import * as THREE from 'three';
import { HexCell } from '../overlay/hexGrid';
import { DisplayMode } from './threeRenderer';
import { getBiomeColor, normalizeBiomeId } from './BiomeColors';

export class CellMesher {
    /**
     * Create a single mesh containing all solid cells
     */
    static createSolidMesh(cells: HexCell[], radius: number, displayMode: DisplayMode = DisplayMode.BIOME): THREE.Mesh {
        const positions: number[] = [];
        const colors: number[] = [];
        const indices: number[] = [];
        let vertexIndex = 0;

        // Radius offset to avoid z-fighting with base sphere
        const offsetRadius = radius * 1.002;


        cells.forEach(cell => {
            // Scale center to offset radius
            const centerScale = offsetRadius / radius;
            const ax = cell.center.x * centerScale;
            const ay = cell.center.y * centerScale;
            const az = cell.center.z * centerScale;

            // Add center vertex
            positions.push(ax, ay, az);

            let color = [0.5, 0.5, 0.5];

            if (cell.isPentagon) {
                // Visual Mitigation: Mask pentagons with distinct color (Magenta for debug/mask)
                color = [1.0, 0.0, 1.0];
            } else if (displayMode === DisplayMode.BIOME) {
                // Use new BiomeColors logic with normalization
                const normalizedBiomeId = normalizeBiomeId(cell.biome);
                const biomeColor = getBiomeColor(normalizedBiomeId);

                // DEBUG: Log if default color is used
                if (biomeColor === 0xcccccc) {
                    console.warn(`[CellMesher] Grey hex (DEFAULT) detected! Original Biome: '${cell.biome}', Normalized: '${normalizedBiomeId}'`);
                }

                const c = new THREE.Color(biomeColor);

                // Prioritize Civilization > River > Biome
                if (cell.settlementType === 'CITY') {
                    color = [0.8, 0.2, 0.2]; // Reddish
                } else if (cell.settlementType === 'VILLAGE') {
                    color = [0.9, 0.6, 0.2]; // Orangeish
                } else if (cell.isRiver) {
                    color = [0.26, 0.65, 0.96]; // #42A5F5
                } else {
                    color = [c.r, c.g, c.b];
                }
            } else if (displayMode === DisplayMode.CIVILIZATION) {
                if (cell.settlementType === 'CITY') {
                    color = [0.8, 0.2, 0.2];
                } else if (cell.settlementType === 'VILLAGE') {
                    color = [0.9, 0.6, 0.2];
                } else {
                    // Dimmed background
                    color = [0.1, 0.1, 0.15];
                }
            } else if (displayMode === DisplayMode.ELEVATION) {
                const h = cell.biomeData?.height || 0;
                // Height usually -0.3 to 0.4
                // Map to 0-1 grayscale
                let val = (h + 0.3) / 0.7;
                val = Math.max(0, Math.min(1, val));
                color = [val, val, val];
            } else if (displayMode === DisplayMode.TEMPERATURE) {
                const t = cell.biomeData?.temperature || 0;
                // Temp usually -20 to 40
                // Map to Blue-Red gradient
                let val = (t + 20) / 60;
                val = Math.max(0, Math.min(1, val));
                color = [val, 0, 1 - val]; // Simple Red/Blue
            } else if (displayMode === DisplayMode.MOISTURE) {
                const m = cell.biomeData?.moisture || 0;
                // Moisture 0 to 1
                // Map to Yellow-Blue gradient
                let val = Math.max(0, Math.min(1, m));
                color = [1 - val, 1 - val, val]; // yellowish to blue
            } else if (displayMode === DisplayMode.PLATE) {
                if (cell.plateColor) {
                    const c = new THREE.Color(cell.plateColor);
                    color = [c.r, c.g, c.b];
                } else {
                    color = [0.2, 0.2, 0.2]; // Grey fallback
                }
            }

            colors.push(...color);

            const centerIndex = vertexIndex;
            vertexIndex++;

            // Add perimeter vertices
            cell.vertices.forEach(v => {
                const vx = v.x * centerScale;
                const vy = v.y * centerScale;
                const vz = v.z * centerScale;

                positions.push(vx, vy, vz);
                colors.push(...color);
                vertexIndex++;
            });

            // Create triangles (triangle fan around center)
            const vertexCount = cell.vertices.length;
            for (let i = 0; i < vertexCount; i++) {
                const current = centerIndex + 1 + i;
                const next = centerIndex + 1 + ((i + 1) % vertexCount);

                indices.push(centerIndex, current, next);
            }
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.8,
            metalness: 0.1,
            flatShading: false,
            side: THREE.DoubleSide
        }));

        // Store mapping for updates
        const cellRanges: { start: number, count: number }[] = [];
        let currentStart = 0;

        cells.forEach(cell => {
            const count = 1 + cell.vertices.length; // Center + perimeter
            cellRanges.push({ start: currentStart, count });
            currentStart += count;
        });

        mesh.userData.cellRanges = cellRanges;

        return mesh;
    }

    /**
     * Efficiently update the color of a specific cell in the mesh
     * @param mesh The mesh created by createSolidMesh
     * @param cellIndex The index of the cell in the original cells array
     * @param color The new color as [r, g, b]
     */
    static updateCellColor(mesh: THREE.Mesh, cellIndex: number, color: THREE.Color | number[]): void {
        const geometry = mesh.geometry;
        const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute;
        const cellRanges = mesh.userData.cellRanges as { start: number, count: number }[] | undefined;

        if (!colorAttribute || !cellRanges || !cellRanges[cellIndex]) return;

        const range = cellRanges[cellIndex];
        const rgb = Array.isArray(color) ? color : [color.r, color.g, color.b];

        for (let i = 0; i < range.count; i++) {
            colorAttribute.setXYZ(range.start + i, rgb[0], rgb[1], rgb[2]);
        }

        colorAttribute.needsUpdate = true;
    }
}
