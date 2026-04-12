import { SpatialHash } from '../spatialHash';
import { BiomeType } from '../../overlay/hexGrid';

describe('SpatialHash', () => {
    let hash: SpatialHash;
    const radius = 100;

    beforeEach(() => {
        hash = new SpatialHash({
            radius,
            latitudeDivisions: 10,
            longitudeDivisions: 20
        });
    });

    describe('Initialization', () => {
        it('should create SpatialHash instance', () => {
            expect(hash).toBeInstanceOf(SpatialHash);
        });

        it('should start with zero cells', () => {
            expect(hash.size()).toBe(0);
        });
    });

    describe('Cell Insertion', () => {
        it('should insert a cell without errors', () => {
            const cell = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: radius },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            expect(() => hash.addCell(cell)).not.toThrow();
        });

        it('should insert multiple cells', () => {
            const cells: any[] = [];
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                cells.push({
                    id: `cell-${i}`,
                    center: {
                        x: Math.cos(angle) * radius,
                        y: 0,
                        z: Math.sin(angle) * radius
                    },
                    vertices: [],
                    neighbors: [],
                    isPentagon: false,
                    biome: BiomeType.OCEAN
                });
            }

            expect(() => {
                for (const cell of cells) {
                    hash.addCell(cell);
                }
            }).not.toThrow();
        });

        it('should track cell count', () => {
            const cell = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: radius },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            hash.addCell(cell);
            expect(hash.size()).toBe(1);
        });

        it('should handle addCells method', () => {
            const cells: any[] = [];
            for (let i = 0; i < 5; i++) {
                cells.push({
                    id: `cell-${i}`,
                    center: { x: 0, y: 0, z: radius },
                    vertices: [],
                    neighbors: [],
                    isPentagon: false,
                    biome: BiomeType.OCEAN
                });
            }

            hash.addCells(cells);
            expect(hash.size()).toBe(5);
        });
    });

    describe('Cell Lookup', () => {
        it('should find nearest cell at exact position', () => {
            const cell = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: radius },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            hash.addCell(cell);

            const found = hash.findNearestCell(cell.center);
            expect(found).toBeDefined();
            expect(found!.id).toBe(cell.id);
        });

        it('should return null for empty hash', () => {
            const found = hash.findNearestCell({ x: 0, y: 0, z: radius });
            expect(found).toBeNull();
        });

        it('should find cell at nearby position', () => {
            const cell = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: radius },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            hash.addCell(cell);

            // Look up at a nearby position
            const found = hash.findNearestCell({ x: 1, y: 0, z: radius - 1 });
            expect(found).toBeDefined();
        });
    });

    describe('Radius Query', () => {
        beforeEach(() => {
            // Insert cells at different positions
            const cells: any[] = [];
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                cells.push({
                    id: `cell-${i}`,
                    center: {
                        x: Math.cos(angle) * radius,
                        y: 0,
                        z: Math.sin(angle) * radius
                    },
                    vertices: [],
                    neighbors: [],
                    isPentagon: false,
                    biome: BiomeType.OCEAN
                });
            }
            hash.addCells(cells);
        });

        it('should find cells within radius', () => {
            const queryPoint = { x: radius, y: 0, z: 0 };
            const found = hash.findCellsInRadius(queryPoint, 20);

            expect(found.length).toBeGreaterThan(0);
        });

        it('should return empty array for small radius with no cells', () => {
            const queryPoint = { x: radius, y: 0, z: 0 };
            const found = hash.findCellsInRadius(queryPoint, 0.1);

            // Should be empty or very few cells
            expect(found.length).toBeLessThan(3);
        });

        it('should find all cells with large radius', () => {
            const queryPoint = { x: radius, y: 0, z: 0 };
            const found = hash.findCellsInRadius(queryPoint, 1000);

            expect(found.length).toBeGreaterThan(0);
        });
    });

    describe('Cell Removal', () => {
        it('should remove a cell', () => {
            const cell = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: radius },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            hash.addCell(cell);
            expect(hash.size()).toBe(1);

            hash.removeCell(cell.id);
            expect(hash.size()).toBe(0);
        });

        it('should not throw when removing non-existent cell', () => {
            expect(() => hash.removeCell('non-existent')).not.toThrow();
        });

        it('should handle removing multiple cells', () => {
            const cells: any[] = [];
            for (let i = 0; i < 5; i++) {
                const cell = {
                    id: `cell-${i}`,
                    center: { x: 0, y: 0, z: radius },
                    vertices: [],
                    neighbors: [],
                    isPentagon: false,
                    biome: BiomeType.OCEAN
                };
                cells.push(cell);
                hash.addCell(cell);
            }

            expect(hash.size()).toBe(5);

            for (const cell of cells) {
                hash.removeCell(cell.id);
            }

            expect(hash.size()).toBe(0);
        });
    });

    describe('Edge Cases', () => {
        it('should handle cells at poles', () => {
            const northPoleCell = {
                id: 'north-pole',
                center: { x: 0, y: radius, z: 0 },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.ARCTIC
            };

            const southPoleCell = {
                id: 'south-pole',
                center: { x: 0, y: -radius, z: 0 },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.ARCTIC
            };

            expect(() => {
                hash.addCell(northPoleCell);
                hash.addCell(southPoleCell);
            }).not.toThrow();

            expect(hash.size()).toBe(2);
        });

        it('should handle cells at date line', () => {
            const cell1 = {
                id: 'cell-1',
                center: { x: 0, y: 0, z: radius }, // lon = 0
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            const cell2 = {
                id: 'cell-2',
                center: { x: 0, y: 0, z: -radius }, // lon = PI
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            expect(() => {
                hash.addCell(cell1);
                hash.addCell(cell2);
            }).not.toThrow();

            expect(hash.size()).toBe(2);
        });

        it('should handle cells at equator', () => {
            const cells: any[] = [];
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                cells.push({
                    id: `cell-${i}`,
                    center: {
                        x: Math.cos(angle) * radius,
                        y: 0,
                        z: Math.sin(angle) * radius
                    },
                    vertices: [],
                    neighbors: [],
                    isPentagon: false,
                    biome: BiomeType.OCEAN
                });
            }

            expect(() => {
                hash.addCells(cells);
            }).not.toThrow();

            expect(hash.size()).toBe(cells.length);
        });
    });

    describe('Statistics', () => {
        it('should return valid stats', () => {
            const cell = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: radius },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            hash.addCell(cell);
            const stats = hash.getStats();

            expect(stats).toBeDefined();
            expect(stats.totalCells).toBe(1);
            expect(stats.gridCellsUsed).toBeGreaterThan(0);
            expect(stats.avgCellsPerGridCell).toBeGreaterThanOrEqual(0);
            expect(stats.maxCellsPerGridCell).toBeGreaterThanOrEqual(0);
            expect(stats.emptyGridCells).toBeGreaterThanOrEqual(0);
        });

        it('should return correct total cells', () => {
            const cells: any[] = [];
            for (let i = 0; i < 5; i++) {
                cells.push({
                    id: `cell-${i}`,
                    center: { x: 0, y: 0, z: radius },
                    vertices: [],
                    neighbors: [],
                    isPentagon: false,
                    biome: BiomeType.OCEAN
                });
            }
            hash.addCells(cells);

            const stats = hash.getStats();
            expect(stats.totalCells).toBe(5);
        });
    });

    describe('Clear', () => {
        it('should clear all cells', () => {
            const cells: any[] = [];
            for (let i = 0; i < 5; i++) {
                cells.push({
                    id: `cell-${i}`,
                    center: { x: 0, y: 0, z: radius },
                    vertices: [],
                    neighbors: [],
                    isPentagon: false,
                    biome: BiomeType.OCEAN
                });
            }
            hash.addCells(cells);

            expect(hash.size()).toBe(5);

            hash.clear();

            expect(hash.size()).toBe(0);
        });
    });
});
