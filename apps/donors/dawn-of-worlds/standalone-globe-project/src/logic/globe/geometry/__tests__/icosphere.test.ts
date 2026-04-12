import { generateIcosphere, getMeshStats } from '../icosphere';

describe('Icosphere', () => {
    describe('Geometry Generation', () => {
        it('should generate icosphere with subdivision level 0', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 0 });
            expect(mesh.vertices.length).toBe(12);
            expect(mesh.faces.length).toBe(20);
        });

        it('should generate icosphere with subdivision level 1', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 1 });
            expect(mesh.vertices.length).toBe(42);
            expect(mesh.faces.length).toBe(80);
        });

        it('should generate icosphere with subdivision level 2', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });
            expect(mesh.vertices.length).toBe(162);
            expect(mesh.faces.length).toBe(320);
        });

        it('should generate icosphere with subdivision level 3', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 3 });
            expect(mesh.vertices.length).toBe(642);
            expect(mesh.faces.length).toBe(1280);
        });

        it('should generate icosphere with subdivision level 4', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 4 });
            expect(mesh.vertices.length).toBe(2562);
            expect(mesh.faces.length).toBe(5120);
        });
    });

    describe('Sphere Projection', () => {
        it('should place all vertices on sphere surface', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });

            for (const vertex of mesh.vertices) {
                const length = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
                expect(length).toBeCloseTo(1.0, 5);
            }
        });

        it('should respect specified radius', () => {
            const radius = 100;
            const mesh = generateIcosphere({ radius, subdivisions: 2 });

            for (const vertex of mesh.vertices) {
                const length = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
                expect(length).toBeCloseTo(radius, 1);
            }
        });
    });

    describe('Mesh Stats', () => {
        it('should return correct vertex count', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });
            const stats = getMeshStats(mesh);
            expect(stats.vertexCount).toBe(mesh.vertices.length);
        });

        it('should return correct face count', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });
            const stats = getMeshStats(mesh);
            expect(stats.faceCount).toBe(mesh.faces.length);
        });

        it('should return correct radius', () => {
            const radius = 50;
            const mesh = generateIcosphere({ radius, subdivisions: 2 });
            const stats = getMeshStats(mesh);
            expect(stats.radius).toBeCloseTo(radius, 1);
        });
    });

    describe('Normals', () => {
        it('should calculate normals for all vertices', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });
            expect(mesh.normals.length).toBe(mesh.vertices.length);
        });

        it('should have normalized normals', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });

            for (const normal of mesh.normals) {
                const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
                expect(length).toBeCloseTo(1.0, 5);
            }
        });
    });

    describe('Face Structure', () => {
        it('should have triangular faces with 3 vertices', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });

            for (const face of mesh.faces) {
                expect(face.length).toBe(3);
            }
        });

        it('should have valid vertex indices in faces', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });
            const vertexCount = mesh.vertices.length;

            for (const face of mesh.faces) {
                for (const vertexIndex of face) {
                    expect(vertexIndex).toBeGreaterThanOrEqual(0);
                    expect(vertexIndex).toBeLessThan(vertexCount);
                }
            }
        });

        it('should have no duplicate vertices in a face', () => {
            const mesh = generateIcosphere({ radius: 1.0, subdivisions: 2 });

            for (const face of mesh.faces) {
                const uniqueVertices = new Set(face);
                expect(uniqueVertices.size).toBe(3);
            }
        });
    });
});
