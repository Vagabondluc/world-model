import { TectonicEngine, PlateType, BoundaryType } from '../TectonicEngine';
import { SphereGraph } from '../../core/SphereGraph';
import { generateIcosphere } from '../../../globe/geometry/icosphere';
import { WorldConfig } from '../../core/types';

describe('TectonicEngine', () => {
    let engine: TectonicEngine;
    let graph: SphereGraph;
    let config: WorldConfig;

    beforeEach(() => {
        config = {
            seed: 'test-seed-12345',
            radius: 100,
            axialTilt: 23.5,
            plateCount: 8
        };
        const mesh = generateIcosphere({ radius: 100, subdivisions: 3 });
        graph = new SphereGraph(mesh);
        engine = new TectonicEngine(config);
        engine.generatePlates(graph);
    });

    describe('Plate Generation', () => {
        it('should generate plates without errors', () => {
            expect(() => engine.generatePlates(graph)).not.toThrow();
        });

        it('should generate configured number of plates', () => {
            const plates = engine.getPlates();
            expect(plates).toBeDefined();
            expect(plates.length).toBe(config.plateCount);
        });

        it('should create plates with valid types', () => {
            const plates = engine.getPlates();
            for (const plate of plates) {
                expect([PlateType.OCEANIC, PlateType.CONTINENTAL]).toContain(plate.type);
            }
        });

        it('should create plates with valid center positions on sphere', () => {
            const plates = engine.getPlates();
            for (const plate of plates) {
                const [x, y, z] = plate.center;
                const distance = Math.sqrt(x * x + y * y + z * z);
                expect(distance).toBeCloseTo(config.radius, 1);
            }
        });
    });

    describe('Plate Movement', () => {
        it('should move plates without errors', () => {
            expect(() => engine.movePlates(graph)).not.toThrow();
        });

        it('should update plate center positions after movement', () => {
            const platesBefore = engine.getPlates().map(p => [...p.center]);
            engine.movePlates(graph);
            const platesAfter = engine.getPlates().map(p => [...p.center]);

            for (let i = 0; i < platesBefore.length; i++) {
                expect(platesBefore[i][0]).not.toBe(platesAfter[i][0]);
                expect(platesBefore[i][1]).not.toBe(platesAfter[i][1]);
            }
        });
    });

    describe('Boundary Resolution', () => {
        beforeEach(() => {
            // Setup a controlled scenario with 2 plates
            // We force specific plate configurations to test collision
            const p1 = {
                id: 0,
                type: PlateType.CONTINENTAL,
                center: [100, 0, 0] as [number, number, number],
                velocity: { x: 1, y: 0 },
                speed: 0.1,
                cells: new Set<number>(),
                color: 'red'
            };
            const p2 = {
                id: 1,
                type: PlateType.CONTINENTAL,
                center: [-100, 0, 0] as [number, number, number],
                velocity: { x: -1, y: 0 }, // Moving towards P1 (Convergent since P1 is at 100 moving -1 and P2 is at -100 moving 1? wait)
                // Let's make it simpler: P1 at X=100 moving -X, P2 at X=-100 moving +X
                speed: 0.1,
                cells: new Set<number>(),
                color: 'blue'
            };
            p1.velocity = { x: -1, y: 0 };
            p2.velocity = { x: 1, y: 0 };

            // Manually assign cells to plates (Split sphere in half roughly)
            // We need graph neighbors to be correct for boundary detection
            // Simple split: x > 0 is P1, x <= 0 is P2
            const cellCount = graph.getCellCount();
            const ownership = new Map<number, number>();

            for (let i = 0; i < cellCount; i++) {
                const v = graph.mesh.vertices[i];
                if (v.x > 0) {
                    p1.cells.add(i);
                    ownership.set(i, 0);
                } else {
                    p2.cells.add(i);
                    ownership.set(i, 1);
                }
            }

            // Inject into engine
            (engine as any).plates = [p1, p2];
            (engine as any).cellOwner = ownership;
        });

        it('should detect convergent boundaries', () => {
            const interactions = engine.resolveBoundaries(graph);
            expect(interactions.size).toBeGreaterThan(0);

            // Check a known boundary interaction (should be convergent)
            // Since velocities are opposing on X axis (+1 and -1)
            let hasConvergent = false;
            for (const interaction of interactions.values()) {
                if (interaction.type === BoundaryType.CONVERGENT) {
                    hasConvergent = true;
                }
            }
            expect(hasConvergent).toBe(true);
        });

        it('should raise elevation at convergent boundaries', () => {
            const interactions = engine.resolveBoundaries(graph);

            // Create mock cells
            const cells = new Map<number, any>();
            const cellCount = graph.getCellCount();
            for (let i = 0; i < cellCount; i++) {
                cells.set(i, { height: 0, id: i });
            }

            engine.applyBoundaryEffects(interactions, cells, graph);

            // Find a boundary cell
            let maxElevation = 0;
            for (const i of interactions.keys()) {
                maxElevation = Math.max(maxElevation, cells.get(i).height);
            }

            expect(maxElevation).toBeGreaterThan(0);
        });
    });
});
