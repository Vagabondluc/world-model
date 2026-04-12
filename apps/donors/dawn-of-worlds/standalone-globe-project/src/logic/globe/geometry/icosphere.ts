/**
 * Icosphere generation for smooth spherical globe
 * Based on subdivided icosahedron with spherical projection
 */

import { Vec3, SphereMesh, IcosphereConfig } from '../types';
import { vec3 } from './vec3';

/**
 * Generate a smooth icosphere mesh
 */
export function generateIcosphere(config: IcosphereConfig & { cellCount?: number }): SphereMesh {
    // If subdivisions is explicitly 0 (Fibonacci mode requested) or undefined, 
    // try to derive from cellCount.
    let targetSubdivisions = config.subdivisions;

    if (config.subdivisions === 0 && config.cellCount) {
        // Approximate vertex counts for icosphere: 10 * 4^k + 2
        // k=0 -> 12
        // k=1 -> 42
        // k=2 -> 162
        // k=3 -> 642
        // k=4 -> 2562
        // k=5 -> 10242

        if (config.cellCount <= 42) targetSubdivisions = 1;
        else if (config.cellCount <= 162) targetSubdivisions = 2;
        else if (config.cellCount <= 642) targetSubdivisions = 3;
        else if (config.cellCount <= 2562) targetSubdivisions = 4;
        else targetSubdivisions = 5;

        console.log(`[Icosphere] Mapped cell count ${config.cellCount} to subdivision level ${targetSubdivisions}`);
    }

    // Start with base icosahedron
    let mesh = generateBaseIcosahedron(config.radius);

    // Subdivide to desired level
    for (let i = 0; i < targetSubdivisions; i++) {
        mesh = subdivideMesh(mesh);
    }

    // Project all vertices to sphere surface
    mesh = projectToSphere(mesh, config.radius);

    // Calculate normals
    calculateNormals(mesh);

    return mesh;
}

/**
 * Generate base icosahedron (12 vertices, 20 faces)
 */
function generateBaseIcosahedron(radius: number): SphereMesh {
    const t = (1 + Math.sqrt(5)) / 2; // Golden ratio

    const vertices: Vec3[] = [
        vec3.create(-1, t, 0),
        vec3.create(1, t, 0),
        vec3.create(-1, -t, 0),
        vec3.create(1, -t, 0),

        vec3.create(0, -1, t),
        vec3.create(0, 1, t),
        vec3.create(0, -1, -t),
        vec3.create(0, 1, -t),

        vec3.create(t, 0, -1),
        vec3.create(t, 0, 1),
        vec3.create(-t, 0, -1),
        vec3.create(-t, 0, 1)
    ];

    // Normalize and scale to radius
    const normalizedVertices = vertices.map(v =>
        vec3.scale(vec3.normalize(v), radius)
    );

    const faces: number[][] = [
        // 5 faces around point 0
        [0, 11, 5],
        [0, 5, 1],
        [0, 1, 7],
        [0, 7, 10],
        [0, 10, 11],

        // 5 adjacent faces
        [1, 5, 9],
        [5, 11, 4],
        [11, 10, 2],
        [10, 7, 6],
        [7, 1, 8],

        // 5 faces around point 3
        [3, 9, 4],
        [3, 4, 2],
        [3, 2, 6],
        [3, 6, 8],
        [3, 8, 9],

        // 5 adjacent faces
        [4, 9, 5],
        [2, 4, 11],
        [6, 2, 10],
        [8, 6, 7],
        [9, 8, 1]
    ];

    return {
        vertices: normalizedVertices,
        faces,
        normals: [],
        radius
    };
}

/**
 * Subdivide mesh by splitting each triangle into 4 smaller triangles
 */
function subdivideMesh(mesh: SphereMesh): SphereMesh {
    const newVertices: Vec3[] = [...mesh.vertices];
    const newFaces: number[][] = [];
    const midpointCache = new Map<string, number>();

    // Helper to get or create midpoint vertex
    const getMidpoint = (i1: number, i2: number): number => {
        const key = i1 < i2 ? `${i1}-${i2}` : `${i2}-${i1}`;

        if (midpointCache.has(key)) {
            return midpointCache.get(key)!;
        }

        const v1 = mesh.vertices[i1];
        const v2 = mesh.vertices[i2];
        const mid = vec3.scale(vec3.add(v1, v2), 0.5);

        const index = newVertices.length;
        newVertices.push(mid);
        midpointCache.set(key, index);

        return index;
    };

    // Subdivide each face
    for (const face of mesh.faces) {
        const [v1, v2, v3] = face;

        // Get midpoints
        const a = getMidpoint(v1, v2);
        const b = getMidpoint(v2, v3);
        const c = getMidpoint(v3, v1);

        // Create 4 new faces
        newFaces.push([v1, a, c]);
        newFaces.push([v2, b, a]);
        newFaces.push([v3, c, b]);
        newFaces.push([a, b, c]);
    }

    return {
        vertices: newVertices,
        faces: newFaces,
        normals: [],
        radius: mesh.radius
    };
}

/**
 * Project all vertices to sphere surface
 */
function projectToSphere(mesh: SphereMesh, radius: number): SphereMesh {
    const projectedVertices = mesh.vertices.map(v => {
        const normalized = vec3.normalize(v);
        return vec3.scale(normalized, radius);
    });

    return {
        ...mesh,
        vertices: projectedVertices,
        radius
    };
}

/**
 * Calculate vertex normals (for smooth shading)
 */
function calculateNormals(mesh: SphereMesh): void {
    // For a sphere, normals are just normalized vertex positions
    mesh.normals = mesh.vertices.map(v => vec3.normalize(v));
}

/**
 * Get statistics about the mesh
 */
export function getMeshStats(mesh: SphereMesh) {
    return {
        vertexCount: mesh.vertices.length,
        faceCount: mesh.faces.length,
        radius: mesh.radius
    };
}
