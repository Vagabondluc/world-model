
import { TectonicEngine, Plate, BoundaryType, PlateType } from '../TectonicEngine';
import { SphereGraph } from '../../core/SphereGraph';
import { WorldConfig, Cell } from '../../core/types';

// Mock SphereGraph
const mockGraph = {
    getCellCount: () => 10,
    getNeighbors: (id: number) => {
        // Simple linear graph: 0-1-2-3...
        if (id === 0) return [1];
        if (id === 9) return [8];
        return [id - 1, id + 1];
    },
    mesh: {
        vertices: Array(10).fill({ x: 0, y: 0, z: 0 })
    }
} as unknown as SphereGraph;

describe('TectonicEngine Advanced', () => {
    let engine: TectonicEngine;
    let config: WorldConfig;
    let cells: Map<number, Cell>;

    beforeEach(() => {
        config = {
            seed: 'TECTONIC_TEST',
            radius: 10,
            axialTilt: 0,
            plateCount: 2,
        };
        engine = new TectonicEngine(config);

        // Mock Cells
        cells = new Map();
        for (let i = 0; i < 10; i++) {
            cells.set(i, {
                id: i,
                position: [0, 0, 0],
                height: 0,
                temperature: 20,
                moisture: 0.5,
                biomeId: 'test'
            });
        }
    });

    describe('Plate Boundaries', () => {
        it('should detect CONVERGENT boundary when plates move together', () => {
            // Setup 2 plates
            // Plate 0: Cells 0,1,2 | Center at (0,0) | Velocity (1, 0) (Moving Right)
            // Plate 1: Cells 3,4,5 | Center at (10,0) | Velocity (-1, 0) (Moving Left)
            // Boundary at 2-3

            const p1: Plate = { id: 0, type: PlateType.CONTINENTAL, center: [0, 0, 0], velocity: { x: 1, y: 0 }, speed: 1, cells: new Set([0, 1, 2]), color: '' };
            const p2: Plate = { id: 1, type: PlateType.CONTINENTAL, center: [10, 0, 0], velocity: { x: -1, y: 0 }, speed: 1, cells: new Set([3, 4, 5]), color: '' };

            // Bypass private hack or just use internal arrays if public enough, 
            // but TectonicEngine plates are private. 
            // We can assume generatePlates creates them or we can manipulate the instance if we use 'any'
            (engine as any).plates = [p1, p2];
            (engine as any).cellOwner = new Map();
            [0, 1, 2].forEach(c => (engine as any).cellOwner.set(c, 0));
            [3, 4, 5].forEach(c => (engine as any).cellOwner.set(c, 1));

            const interactions = engine.resolveBoundaries(mockGraph);

            // Cell 2 is neighbor to 3. 2 belongs to P0. 3 belongs to P1.
            // P0 moving Right, P1 moving Left -> Convergent.

            const interaction = interactions.get(2);
            expect(interaction).toBeDefined();
            expect(interaction?.type).toBe(BoundaryType.CONVERGENT);
        });

        it('should detect DIVERGENT boundary when plates move apart', () => {
            const p1: Plate = { id: 0, type: PlateType.CONTINENTAL, center: [0, 0, 0], velocity: { x: -1, y: 0 }, speed: 1, cells: new Set([0, 1, 2]), color: '' };
            const p2: Plate = { id: 1, type: PlateType.CONTINENTAL, center: [10, 0, 0], velocity: { x: 1, y: 0 }, speed: 1, cells: new Set([3, 4, 5]), color: '' };

            (engine as any).plates = [p1, p2];
            (engine as any).cellOwner = new Map();
            [0, 1, 2].forEach(c => (engine as any).cellOwner.set(c, 0));
            [3, 4, 5].forEach(c => (engine as any).cellOwner.set(c, 1));

            const interactions = engine.resolveBoundaries(mockGraph);

            const interaction = interactions.get(2);
            expect(interaction?.type).toBe(BoundaryType.DIVERGENT);
        });

        it('should detect TRANSFORM boundary when plates slide past', () => {
            // P1 moves UP (y=1), P2 moves DOWN (y=-1)
            // Relative X is 0. Dot product with X-axis direction (neighbor vector) should be near 0.
            const p1: Plate = { id: 0, type: PlateType.CONTINENTAL, center: [0, 0, 0], velocity: { x: 0, y: 1 }, speed: 1, cells: new Set([0, 1, 2]), color: '' };
            const p2: Plate = { id: 1, type: PlateType.CONTINENTAL, center: [10, 0, 0], velocity: { x: 0, y: -1 }, speed: 1, cells: new Set([3, 4, 5]), color: '' };

            (engine as any).plates = [p1, p2];
            (engine as any).cellOwner = new Map();
            [0, 1, 2].forEach(c => (engine as any).cellOwner.set(c, 0));
            [3, 4, 5].forEach(c => (engine as any).cellOwner.set(c, 1));

            const interactions = engine.resolveBoundaries(mockGraph);

            const interaction = interactions.get(2);
            // The logic uses dot product of relative velocity and direction vector.
            // Rel Vel = (0, 2). Dir = (10, 0). Dot = 0.
            // < 0.1 -> Transform.
            expect(interaction?.type).toBe(BoundaryType.TRANSFORM);
        });
    });

    describe('Terrain Modification', () => {
        it('should raise land at Continental-Continental convergence', () => {
            const interactions = new Map();
            interactions.set(1, {
                cellId: 1,
                plate1Id: 0,
                plate2Id: 1,
                type: BoundaryType.CONVERGENT,
                pressure: 1.0
            });

            (engine as any).plates = [
                { id: 0, type: PlateType.CONTINENTAL },
                { id: 1, type: PlateType.CONTINENTAL }
            ];

            const initialHeight = cells.get(1)!.height;

            engine.applyBoundaryEffects(interactions, cells, mockGraph);

            // expect height to increase
            expect(cells.get(1)!.height).toBeGreaterThan(initialHeight);
        });

        it('should lower land at Divergent boundary', () => {
            const interactions = new Map();
            interactions.set(1, {
                cellId: 1,
                plate1Id: 0,
                plate2Id: 1,
                type: BoundaryType.DIVERGENT,
                pressure: 1.0
            });

            (engine as any).plates = [
                { id: 0, type: PlateType.CONTINENTAL },
                { id: 1, type: PlateType.CONTINENTAL }
            ];

            const initialHeight = cells.get(1)!.height;
            engine.applyBoundaryEffects(interactions, cells, mockGraph);

            expect(cells.get(1)!.height).toBeLessThan(initialHeight);
        });
    });
});
