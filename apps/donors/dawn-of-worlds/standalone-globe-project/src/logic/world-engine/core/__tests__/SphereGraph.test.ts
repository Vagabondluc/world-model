import { SphereGraph } from '../SphereGraph';
import { generateIcosphere } from '../../../globe/geometry/icosphere';

describe('SphereGraph', () => {
    let graph: SphereGraph;

    beforeEach(() => {
        const mesh = generateIcosphere({ radius: 100, subdivisions: 3 });
        graph = new SphereGraph(mesh);
    });

    describe('Graph Construction', () => {
        it('should build adjacency map from mesh', () => {
            expect(graph.adjacencies).toBeInstanceOf(Map);
            expect(graph.adjacencies.size).toBeGreaterThan(0);
        });

        it('should have adjacency entries for all cells', () => {
            const cellCount = graph.getCellCount();
            expect(graph.adjacencies.size).toBe(cellCount);
        });

        it('should store mesh reference', () => {
            expect(graph.mesh).toBeDefined();
            expect(graph.mesh.vertices).toBeDefined();
            expect(graph.mesh.faces).toBeDefined();
        });
    });

    describe('Cell Count', () => {
        it('should return correct cell count', () => {
            const cellCount = graph.getCellCount();
            expect(cellCount).toBe(graph.mesh.vertices.length);
        });

        it('should return positive cell count', () => {
            const cellCount = graph.getCellCount();
            expect(cellCount).toBeGreaterThan(0);
        });
    });

    describe('Neighbor Lookup', () => {
        it('should return neighbors for valid cell ID', () => {
            const neighbors = graph.getNeighbors(0);
            expect(Array.isArray(neighbors)).toBe(true);
            expect(neighbors.length).toBeGreaterThan(0);
        });

        it('should return empty array for invalid cell ID', () => {
            const neighbors = graph.getNeighbors(-1);
            expect(Array.isArray(neighbors)).toBe(true);
            expect(neighbors.length).toBe(0);
        });

        it('should return neighbors with valid IDs', () => {
            const cellCount = graph.getCellCount();
            const neighbors = graph.getNeighbors(0);

            for (const neighborId of neighbors) {
                expect(neighborId).toBeGreaterThanOrEqual(0);
                expect(neighborId).toBeLessThan(cellCount);
            }
        });

        it('should return symmetric adjacency', () => {
            const neighbors0 = graph.getNeighbors(0);
            if (neighbors0.length > 0) {
                const neighborId = neighbors0[0];
                const neighborsOfNeighbor = graph.getNeighbors(neighborId);
                expect(neighborsOfNeighbor).toContain(0);
            }
        });

        it('should return consistent neighbor count for all cells', () => {
            const cellCount = graph.getCellCount();
            const neighborCounts = new Set<number>();

            for (let i = 0; i < Math.min(10, cellCount); i++) {
                const neighbors = graph.getNeighbors(i);
                neighborCounts.add(neighbors.length);
            }

            // For an icosphere subdivision 3, most cells should have 5 or 6 neighbors
            // (12 pentagons with 5, rest hexagons with 6)
            expect(neighborCounts.has(5) || neighborCounts.has(6)).toBe(true);
        });
    });

    describe('Adjacency Properties', () => {
        it('should not contain duplicate neighbors', () => {
            for (let i = 0; i < Math.min(10, graph.getCellCount()); i++) {
                const neighbors = graph.getNeighbors(i);
                const uniqueNeighbors = new Set(neighbors);
                expect(neighbors.length).toBe(uniqueNeighbors.size);
            }
        });

        it('should not include cell as its own neighbor', () => {
            for (let i = 0; i < Math.min(10, graph.getCellCount()); i++) {
                const neighbors = graph.getNeighbors(i);
                expect(neighbors).not.toContain(i);
            }
        });
    });

    describe('Different Subdivision Levels', () => {
        it('should work with subdivision level 0', () => {
            const mesh = generateIcosphere({ radius: 100, subdivisions: 0 });
            const graph0 = new SphereGraph(mesh);
            expect(graph0.getCellCount()).toBe(12); // Base icosahedron has 12 vertices
        });

        it('should work with subdivision level 1', () => {
            const mesh = generateIcosphere({ radius: 100, subdivisions: 1 });
            const graph1 = new SphereGraph(mesh);
            expect(graph1.getCellCount()).toBe(42);
        });

        it('should work with subdivision level 2', () => {
            const mesh = generateIcosphere({ radius: 100, subdivisions: 2 });
            const graph2 = new SphereGraph(mesh);
            expect(graph2.getCellCount()).toBe(162);
        });
    });
});
