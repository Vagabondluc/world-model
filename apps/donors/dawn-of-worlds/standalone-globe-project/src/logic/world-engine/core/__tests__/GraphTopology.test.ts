
import { SphereGraph } from '../SphereGraph';
import { SphereMesh } from '../../../globe/types';

describe('SphereGraph Topology', () => {

    it('should correctly build adjacencies from a single face', () => {
        // A single triangle face: 0 - 1 - 2
        const mesh: SphereMesh = {
            vertices: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }],
            faces: [[0, 1, 2]],
            normals: [],
            radius: 1
        };

        const graph = new SphereGraph(mesh);

        // 0 should connect to 1 and 2
        const n0 = graph.getNeighbors(0);
        expect(n0).toContain(1);
        expect(n0).toContain(2);
        expect(n0.length).toBe(2);

        // Symmetry Check
        const n1 = graph.getNeighbors(1);
        expect(n1).toContain(0);
        expect(n1).toContain(2);
    });

    it('should not duplicate connections if shared by multiple faces', () => {
        // Two faces sharing edge 0-1
        // Face A: 0, 1, 2
        // Face B: 0, 1, 3
        const mesh: SphereMesh = {
            vertices: [
                { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 }
            ],
            faces: [
                [0, 1, 2],
                [0, 1, 3]
            ],
            normals: [],
            radius: 1
        };

        const graph = new SphereGraph(mesh);

        const n0 = graph.getNeighbors(0);
        // Should contain 1, 2, 3
        expect(n0).toContain(1);
        expect(n0).toContain(2);
        expect(n0).toContain(3);

        // Should NOT contain 1 twice
        // Set logic or filter unique
        const unique = new Set(n0);
        expect(unique.size).toBe(n0.length);
    });

    it('should support graph traversal (BFS)', () => {
        // Chain: 0-1-2-3
        // Faces: (0,1,100), (1,2,101), (2,3,102) ... dummy aux
        // Or just explicit faces
        const mesh: SphereMesh = {
            vertices: [
                { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }
            ],
            faces: [
                [0, 1, 4], // 0-1
                [1, 2, 4], // 1-2
                [2, 3, 4]  // 2-3
            ],
            normals: [],
            radius: 1
        };
        const graph = new SphereGraph(mesh);

        // BFS from 0 to find 3
        const queue = [{ id: 0, dist: 0 }];
        const visited = new Set([0]);
        let foundDist = -1;

        while (queue.length > 0) {
            const curr = queue.shift()!;
            if (curr.id === 3) {
                foundDist = curr.dist;
                break;
            }

            for (const n of graph.getNeighbors(curr.id)) {
                if (!visited.has(n)) {
                    visited.add(n);
                    queue.push({ id: n, dist: curr.dist + 1 });
                }
            }
        }

        // 0 -> 1 -> 2 -> 3 is distance 3
        // But we also have 0-4-1, 1-4-2, 2-4-3 via vertex 4 (central hub)
        // 0 -> 4 -> 3 ? No, 4 connects 0,1,2,3?
        // 0 connects 4.
        // 4 connects 0, 1, 2, 3.
        // So 0 -> 4 -> 3 is distance 2.

        expect(foundDist).toBeGreaterThan(0);
        expect(foundDist).toBe(2); // Via hub 4

        // Force long path?
        // Remove hub 4 logic check. Just assert it found it.
    });

    it('should return correct cell count', () => {
        const mesh: SphereMesh = {
            vertices: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }],
            faces: [],
            normals: [],
            radius: 1
        };
        const graph = new SphereGraph(mesh);
        expect(graph.getCellCount()).toBe(2);
    });
});
