import { CellMesher } from '../cellMesher';
import { HexCell, BiomeType } from '../../overlay/hexGrid';
import { DisplayMode } from '../threeRenderer';
import * as THREE from 'three';

describe('CellMesher', () => {
    // Helper to generate mock cells
    const generateMockCells = (count: number = 2): HexCell[] => {
        const cells: HexCell[] = [];
        for (let i = 0; i < count; i++) {
            cells.push({
                id: `cell-${i}`,
                center: { x: 1, y: 0, z: 0 },
                vertices: [
                    { x: 1, y: 0.1, z: 0 },
                    { x: 1, y: 0, z: 0.1 },
                    { x: 1, y: -0.1, z: 0 }
                ], // Triangle for simplicity
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN,
                biomeData: { height: 0, temperature: 0, moisture: 0 }
            });
        }
        return cells;
    };

    describe('Color Modes', () => {
        it('should apply standard biome colors by default', () => {
            const cells = generateMockCells();
            cells[0].biome = BiomeType.FOREST; // Greenish

            const mesh = CellMesher.createSolidMesh(cells, 1.0);

            // Get color of first vertex (center of cell 0)
            const colorAttr = mesh.geometry.getAttribute('color');
            expect(colorAttr).toBeDefined();

            // Debug: log actual values
            const r = colorAttr.getX(0);
            const g = colorAttr.getY(0);
            const b = colorAttr.getZ(0);
            console.log(`Cell 0 biome: ${cells[0].biome}`);
            console.log(`Cell 0 biome lowercase: ${cells[0].biome.toLowerCase()}`);
            console.log(`Actual color: [${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}]`);

            // Forest is 0x2e7d32. In Three.js 0.160+, hex colors are converted to Linear color space.
            // sRGB [0.18, 0.49, 0.20] -> Linear [~0.027, ~0.205, ~0.032]
            expect(colorAttr.getX(0)).toBeCloseTo(0.027, 2);
            expect(colorAttr.getY(0)).toBeCloseTo(0.205, 2);
        });

        it('should apply elevation-based shading', () => {
            const cells = generateMockCells();
            cells[0].biomeData = { height: 0.9, temperature: 0.5, moisture: 0.5 }; // High

            const mesh = CellMesher.createSolidMesh(cells, 1.0, DisplayMode.ELEVATION);

            const colorAttr = mesh.geometry.getAttribute('color');
            const r = colorAttr.getX(0);

            // High elevation should be bright (close to 1)
            expect(r).toBeGreaterThan(0.8);
            // Grayscale
            expect(colorAttr.getY(0)).toBeCloseTo(r);
            expect(colorAttr.getZ(0)).toBeCloseTo(r);
        });

        it('should apply temperature overlay', () => {
            const cells = generateMockCells();
            cells[0].biomeData = { height: 0.5, temperature: 40, moisture: 0.5 }; // Hot (max)

            const mesh = CellMesher.createSolidMesh(cells, 1.0, DisplayMode.TEMPERATURE);

            const colorAttr = mesh.geometry.getAttribute('color');
            // Hot = Red
            expect(colorAttr.getX(0)).toBeGreaterThan(0.8); // R
            expect(colorAttr.getZ(0)).toBeLessThan(0.2);    // B
        });

        it('should apply moisture overlay', () => {
            const cells = generateMockCells();
            cells[0].biomeData = { height: 0.5, temperature: 10, moisture: 1.0 }; // Wet (max)

            const mesh = CellMesher.createSolidMesh(cells, 1.0, DisplayMode.MOISTURE);

            const colorAttr = mesh.geometry.getAttribute('color');
            // Wet = Blue (0, 0, 1)
            expect(colorAttr.getZ(0)).toBeCloseTo(1.0, 2);
            expect(colorAttr.getX(0)).toBeCloseTo(0, 2);
        });

        it('should apply plate colors', () => {
            const cells = generateMockCells();
            cells[0].plateColor = '#ff00ff'; // Magenta

            const mesh = CellMesher.createSolidMesh(cells, 1.0, DisplayMode.PLATE);

            const colorAttr = mesh.geometry.getAttribute('color');
            // Magenta = (1, 0, 1)
            expect(colorAttr.getX(0)).toBeCloseTo(1.0, 2);
            expect(colorAttr.getY(0)).toBeCloseTo(0, 2);
            expect(colorAttr.getZ(0)).toBeCloseTo(1.0, 2);
        });

        it('should apply civilization overlay in BIOME mode', () => {
            const cells = generateMockCells();
            cells[0].settlementType = 'CITY';
            cells[1].settlementType = 'VILLAGE';

            const mesh = CellMesher.createSolidMesh(cells, 1.0, DisplayMode.BIOME);

            const colorAttr = mesh.geometry.getAttribute('color');
            
            // City = Red (0.8, 0.2, 0.2)
            const cell0Start = 0;
            expect(colorAttr.getX(cell0Start)).toBeCloseTo(0.8, 2);
            
            // Village = Orange (0.9, 0.6, 0.2) - Need to find where cell 1 starts
            // Cell 0 has 1 center + 3 vertices = 4 vertices
            const cell1Start = 4; 
            expect(colorAttr.getX(cell1Start)).toBeCloseTo(0.9, 2);
            expect(colorAttr.getY(cell1Start)).toBeCloseTo(0.6, 2);
        });

        it('should apply river color in BIOME mode', () => {
            const cells = generateMockCells();
            cells[0].isRiver = true;

            const mesh = CellMesher.createSolidMesh(cells, 1.0, DisplayMode.BIOME);

            const colorAttr = mesh.geometry.getAttribute('color');
            // River = #42A5F5 (approx 0.26, 0.65, 0.96)
            expect(colorAttr.getX(0)).toBeCloseTo(0.26, 2);
            expect(colorAttr.getY(0)).toBeCloseTo(0.65, 2);
            expect(colorAttr.getZ(0)).toBeCloseTo(0.96, 2);
        });
    });

    describe('Dynamic Updates', () => {
        it('should update cell color dynamically', () => {
            const cells = generateMockCells();
            const mesh = CellMesher.createSolidMesh(cells, 1.0);

            const newColor = new THREE.Color(1, 0, 0); // Red

            CellMesher.updateCellColor(mesh, 0, newColor);

            const colorAttr = mesh.geometry.getAttribute('color');
            expect(colorAttr.getX(0)).toBe(1);
            expect(colorAttr.getY(0)).toBe(0);
            expect(colorAttr.getZ(0)).toBe(0);
        });
    });
});
