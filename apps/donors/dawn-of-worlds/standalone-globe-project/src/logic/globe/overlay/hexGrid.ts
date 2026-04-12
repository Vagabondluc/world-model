import { Vec3, SphereMesh } from '../types';
import { vec3 } from '../geometry/vec3';
import { BiomeMapper } from '../generation/biomeMapper';
import { generateIcosphere } from '../geometry/icosphere';
import { BiomeType } from '../rendering/BiomeColors';

// Re-export BiomeType for backward compatibility
export { BiomeType };


export interface HexCell {
    id: string;
    center: Vec3;
    vertices: Vec3[];
    neighbors: string[];
    isPentagon: boolean;
    biome: BiomeType;
    biomeData?: {
        height: number;
        temperature: number;
        moisture: number;
    };
    plateId?: number;
    plateColor?: string;
    isRiver?: boolean;
    settlementType?: 'VILLAGE' | 'CITY' | 'NONE';
}


export enum GeneratorType {
    SIMPLE = 'SIMPLE',
    SIMPLEX = 'SIMPLEX'
}

export interface HexGridConfig {
    cellCount: number; // Approximate number of cells
    radius: number;
    subdivisions?: number;
    generatorType?: GeneratorType;
    seed?: number;
}

/**
 * Generate hex grid on sphere using fibonacci spiral
 */
export function generateHexGrid(config: HexGridConfig): HexCell[] {
    // If subdivisions is provided and is > 0, use Icosphere Dual for perfect imbricking
    // OR if subdivisions is 0 (Fibonacci mode) but we have a cell count that maps to a valid subdivision level
    let targetSubdivisions = config.subdivisions;

    if (config.subdivisions === 0 && config.cellCount) {
        // Same mapping as in icosphere.ts to ensure alignment
        if (config.cellCount <= 42) targetSubdivisions = 1;
        else if (config.cellCount <= 162) targetSubdivisions = 2;
        else if (config.cellCount <= 642) targetSubdivisions = 3;
        else if (config.cellCount <= 2562) targetSubdivisions = 4;
        else targetSubdivisions = 5;

        console.log(`[HexGrid] Mapping cell count ${config.cellCount} to subdivision level ${targetSubdivisions} for efficient generation.`);
    }

    if (targetSubdivisions !== undefined && targetSubdivisions > 0) {
        const icosphere = generateIcosphere({
            radius: config.radius,
            subdivisions: targetSubdivisions
        });
        return generateGeodesicGrid(icosphere, config);
    }

    const cells: HexCell[] = [];
    const points = generateFibonacciSphere(config.cellCount, config.radius);

    // Create cells from points
    points.forEach((center, i) => {
        const cell: HexCell = {
            id: `cell-${i}`,
            center,
            vertices: [],
            neighbors: [],
            isPentagon: false,
            biome: BiomeType.OCEAN
        };
        cells.push(cell);
    });

    // Build adjacency graph (simplified - will be enhanced later)
    buildAdjacency(cells);

    // Identify pentagon cells (12 cells with 5 neighbors)
    identifyPentagons(cells);

    // Generate vertex positions for each cell
    cells.forEach(cell => {
        cell.vertices = generateCellVertices(cell, config.radius, config.cellCount);
    });

    // Assign biomes based on generator type
    if (config.generatorType === GeneratorType.SIMPLEX) {
        generateProceduralBiomes(cells, config.seed || Date.now());
    } else {
        assignMockBiomes(cells);
    }

    return cells;
}

function generateProceduralBiomes(cells: HexCell[], seed: number) {
    const mapper = new BiomeMapper(seed);
    cells.forEach(cell => mapper.generateBiome(cell));
}

/**
 * Generate evenly distributed points on sphere using fibonacci spiral
 */
function generateFibonacciSphere(count: number, radius: number): Vec3[] {
    const points: Vec3[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < count; i++) {
        const t = i / count;
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = angleIncrement * i;

        const x = Math.sin(inclination) * Math.cos(azimuth);
        const y = Math.sin(inclination) * Math.sin(azimuth);
        const z = Math.cos(inclination);

        points.push(vec3.scale({ x, y, z }, radius));
    }

    return points;
}

/**
 * Build adjacency graph between cells
 */
function buildAdjacency(cells: HexCell[]): void {
    // Simple nearest-neighbor approach
    // For each cell, find 6 closest neighbors (or 5 for pentagons)

    cells.forEach((cell, i) => {
        const distances: Array<{ index: number; distance: number }> = [];

        cells.forEach((other, j) => {
            if (i === j) return;
            const dist = vec3.distance(cell.center, other.center);
            distances.push({ index: j, distance: dist });
        });

        // Sort by distance and take closest 6-7 neighbors
        distances.sort((a, b) => a.distance - b.distance);
        const neighborCount = Math.min(7, distances.length);

        for (let k = 0; k < neighborCount; k++) {
            const neighborId = cells[distances[k].index].id;
            if (!cell.neighbors.includes(neighborId)) {
                cell.neighbors.push(neighborId);
            }
        }
    });
}

/**
 * Identify pentagon cells (cells with exactly 5 neighbors)
 */
function identifyPentagons(cells: HexCell[]): void {
    cells.forEach(cell => {
        // Trim to 5 or 6 neighbors
        if (cell.neighbors.length === 5) {
            cell.isPentagon = true;
        } else if (cell.neighbors.length > 6) {
            cell.neighbors = cell.neighbors.slice(0, 6);
        }
    });

    // Ensure we have approximately 12 pentagons
    // If not enough, convert some 6-neighbor cells to 5-neighbor
    const pentagonCount = cells.filter(c => c.isPentagon).length;

    if (pentagonCount < 12) {
        const needed = 12 - pentagonCount;
        let converted = 0;

        for (const cell of cells) {
            if (!cell.isPentagon && cell.neighbors.length === 6) {
                cell.neighbors.pop();
                cell.isPentagon = true;
                converted++;
                if (converted >= needed) break;
            }
        }
    }
}

/**
 * Generate vertex positions for a cell
 */
function generateCellVertices(cell: HexCell, radius: number, cellCount: number): Vec3[] {
    const vertexCount = cell.isPentagon ? 5 : 6;
    const vertices: Vec3[] = [];

    // Calculate tangent basis at cell center
    const normal = vec3.normalize(cell.center);
    const tangentU = calculateTangentU(normal);
    const tangentV = vec3.cross(normal, tangentU);

    // Dynamic cell size calculation for proper tessellation
    // Average area per cell on a sphere: 4 * PI * radius^2 / cellCount
    // Approximate hex radius = sqrt(area / (1.5 * sqrt(3)))
    // Simplified: radius * Constant / sqrt(cellCount)
    const avgCellArea = (4 * Math.PI * radius * radius) / (1.15 * cellCount); // Adjusted for better density
    const cellSize = Math.sqrt(avgCellArea / (1.5 * Math.sqrt(3))) * 1.55; // Slightly larger to close gaps

    // Generate vertices in a circle around center
    for (let i = 0; i < vertexCount; i++) {
        const angle = (i / vertexCount) * Math.PI * 2;
        const localX = Math.cos(angle) * cellSize;
        const localY = Math.sin(angle) * cellSize;

        // Convert local coordinates to sphere surface
        const offset = vec3.add(
            vec3.scale(tangentU, localX),
            vec3.scale(tangentV, localY)
        );

        const vertex = vec3.add(cell.center, offset);
        const projected = vec3.scale(vec3.normalize(vertex), radius);
        vertices.push(projected);
    }

    return vertices;
}

/**
 * Calculate tangent U vector for a given normal
 */
function calculateTangentU(normal: Vec3): Vec3 {
    // Choose arbitrary perpendicular vector
    const arbitrary = Math.abs(normal.y) < 0.9
        ? { x: 0, y: 1, z: 0 }
        : { x: 1, y: 0, z: 0 };

    return vec3.normalize(vec3.cross(normal, arbitrary));
}


/**
 * Assign mock biomes for visual testing
 */
function assignMockBiomes(cells: HexCell[]): void {
    cells.forEach(cell => {
        // Simple noise-like assignment based on position
        const noise = Math.sin(cell.center.x * 2) + Math.sin(cell.center.y * 3) + Math.sin(cell.center.z * 4);

        // Polar caps
        if (Math.abs(cell.center.y) > 0.8) {
            cell.biome = BiomeType.SNOW;
        }
        // Banded based on Y + noise
        else if (noise > 1.5) {
            cell.biome = BiomeType.FOREST;
        } else if (noise > 0) {
            cell.biome = BiomeType.DESERT;
        } else {
            cell.biome = BiomeType.OCEAN;
        }
    });
}

/**
 * Generate a gapless geodesic grid (Dual of Icosphere)
 */
function generateGeodesicGrid(icosphere: SphereMesh, config: HexGridConfig): HexCell[] {
    const cells: HexCell[] = [];
    const { vertices, faces, radius } = icosphere;

    // 1. Map each vertex to the faces that share it
    const vertexToFaces = new Map<number, number[]>();
    faces.forEach((face, faceIndex) => {
        face.forEach(vertexIndex => {
            if (!vertexToFaces.has(vertexIndex)) {
                vertexToFaces.set(vertexIndex, []);
            }
            vertexToFaces.get(vertexIndex)!.push(faceIndex);
        });
    });

    // 2. Pre-calculate face centroids (dual vertices)
    const faceCentroids = faces.map(face => {
        const v1 = vertices[face[0]];
        const v2 = vertices[face[1]];
        const v3 = vertices[face[2]];
        const centroid = vec3.scale(vec3.add(vec3.add(v1, v2), v3), 1 / 3);
        // Project to sphere surface
        return vec3.scale(vec3.normalize(centroid), radius);
    });

    // 3. For each icosphere vertex, create a hexagon (or pentagon)
    vertices.forEach((v, vIndex) => {
        const sharedFaceIndices = vertexToFaces.get(vIndex) || [];

        // Even if no faces (shouldn't happen), keep a placeholder to maintain indices
        if (sharedFaceIndices.length === 0) {
            cells.push({
                id: `cell-${vIndex}`,
                center: v,
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            });
            return;
        }

        const cellFaceCentroids = sharedFaceIndices.map(fIdx => faceCentroids[fIdx]);

        // Sorting vertices CCW around the normal
        const normal = vec3.normalize(v);
        const tangentU = calculateTangentU(normal);
        const tangentV = vec3.cross(normal, tangentU);

        const sortedVertices = cellFaceCentroids.sort((a, b) => {
            const da = vec3.subtract(a, v);
            const db = vec3.subtract(b, v);

            const angleA = Math.atan2(vec3.dot(da, tangentV), vec3.dot(da, tangentU));
            const angleB = Math.atan2(vec3.dot(db, tangentV), vec3.dot(db, tangentU));

            return angleA - angleB;
        });

        const cell: HexCell = {
            id: `cell-${vIndex}`,
            center: v,
            vertices: sortedVertices.map(sv => {
                const dir = vec3.subtract(sv, v);
                return vec3.add(v, vec3.scale(dir, 1.001)); // 0.1% overlap to close seams
            }),
            neighbors: [],
            isPentagon: sharedFaceIndices.length === 5,
            biome: BiomeType.OCEAN
        };
        cells.push(cell);
    });

    // Build adjacency from icosphere edges for the dual grid
    // Neighbors are vertices that share an edge in the icosphere
    const vertexNeighbors = new Map<number, Set<number>>();
    faces.forEach(face => {
        const [a, b, c] = face;
        [[a, b], [b, c], [c, a]].forEach(([u, v]) => {
            if (!vertexNeighbors.has(u)) vertexNeighbors.set(u, new Set());
            if (!vertexNeighbors.has(v)) vertexNeighbors.set(v, new Set());
            vertexNeighbors.get(u)!.add(v);
            vertexNeighbors.get(v)!.add(u);
        });
    });

    cells.forEach((cell, i) => {
        const neighbors = vertexNeighbors.get(i) || new Set();
        cell.neighbors = Array.from(neighbors).map(nIdx => `cell-${nIdx}`);
    });

    // Assign biomes
    if (config.generatorType === GeneratorType.SIMPLEX) {
        generateProceduralBiomes(cells, config.seed || Date.now());
    } else {
        assignMockBiomes(cells);
    }

    return cells;
}/**
 * Get cell statistics
 */
export function getGridStats(cells: HexCell[]) {
    const hexCount = cells.filter(c => !c.isPentagon).length;
    const pentCount = cells.filter(c => c.isPentagon).length;

    return {
        totalCells: cells.length,
        hexagons: hexCount,
        pentagons: pentCount
    };
}
