import { generateHexGrid, BiomeType, GeneratorType } from '../hexGrid';

describe('HexGrid', () => {
    describe('Cell Generation', () => {
        it('should generate hex grid with specified cell count', () => {
            const config = {
                cellCount: 100,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);
            expect(cells.length).toBe(config.cellCount);
        });

        it('should generate cells with unique IDs', () => {
            const config = {
                cellCount: 50,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);
            const ids = new Set(cells.map(c => c.id));
            expect(ids.size).toBe(cells.length);
        });

        it('should generate cells with center positions on sphere surface', () => {
            const config = {
                cellCount: 50,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);

            for (const cell of cells) {
                const { x, y, z } = cell.center;
                const distance = Math.sqrt(x * x + y * y + z * z);
                expect(distance).toBeCloseTo(config.radius, 1);
            }
        });
    });

    describe('Adjacency', () => {
        it('should build neighbor relationships', () => {
            const config = {
                cellCount: 100,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);

            // At least some cells should have neighbors
            const cellsWithNeighbors = cells.filter(c => c.neighbors.length > 0);
            expect(cellsWithNeighbors.length).toBeGreaterThan(0);
        });
    });

    describe('Pentagon Detection', () => {
        it('should identify pentagon cells', () => {
            const config = {
                cellCount: 100,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);
            const pentagons = cells.filter(c => c.isPentagon);

            // There should be some pentagons (cells with 5 neighbors)
            expect(pentagons.length).toBeGreaterThan(0);
        });

        it('should mark pentagons with isPentagon flag', () => {
            const config = {
                cellCount: 100,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);

            for (const cell of cells) {
                expect(typeof cell.isPentagon).toBe('boolean');
            }
        });

        it('should have pentagons with 5 neighbors', () => {
            const config = {
                cellCount: 100,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);
            const pentagons = cells.filter(c => c.isPentagon);

            for (const pentagon of pentagons) {
                expect(pentagon.neighbors.length).toBe(5);
            }
        });
    });

    describe('Biome Assignment', () => {
        it('should assign biomes to all cells', () => {
            const config = {
                cellCount: 50,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);

            for (const cell of cells) {
                expect(cell.biome).toBeDefined();
                expect(Object.values(BiomeType)).toContain(cell.biome);
            }
        });

        it('should generate different biomes with simplex generator', () => {
            const config = {
                cellCount: 100,
                radius: 100,
                generatorType: GeneratorType.SIMPLEX as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);
            const uniqueBiomes = new Set(cells.map(c => c.biome));

            // Should have multiple different biomes
            expect(uniqueBiomes.size).toBeGreaterThan(1);
        });
    });

    describe('Vertex Generation', () => {
        it('should generate vertices for each cell', () => {
            const config = {
                cellCount: 50,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);

            for (const cell of cells) {
                expect(cell.vertices.length).toBeGreaterThan(0);
            }
        });

        it('should have vertices on sphere surface', () => {
            const config = {
                cellCount: 50,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);

            for (const cell of cells) {
                for (const vertex of cell.vertices) {
                    const { x, y, z } = vertex;
                    const distance = Math.sqrt(x * x + y * y + z * z);
                    expect(distance).toBeCloseTo(config.radius, 1);
                }
            }
        });

        it('should have 5 or 6 vertices per cell', () => {
            const config = {
                cellCount: 100,
                radius: 100,
                generatorType: GeneratorType.SIMPLE as GeneratorType,
                seed: 12345
            };
            const cells = generateHexGrid(config);

            for (const cell of cells) {
                expect([5, 6]).toContain(cell.vertices.length);
            }
        });
    });
});
