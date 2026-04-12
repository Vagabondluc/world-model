
import * as THREE from 'three';

export interface HexGeometry {
  id: string;
  index: number;
  center: [number, number, number];
  vertices: [number, number, number][];
  neighbors: string[];
  neighborIndices: number[];
  isPentagon: boolean;
}

interface CachedGrid {
  subdivisions: number;
  geometries: HexGeometry[];
}

let gridCache: CachedGrid | null = null;

interface IcoFace { v1: number; v2: number; v3: number; }

const getMidpoint = (v1Idx: number, v2Idx: number, vertices: THREE.Vector3[], cache: Map<string, number>): number => {
  const key = v1Idx < v2Idx ? `${v1Idx}_${v2Idx}` : `${v2Idx}_${v1Idx}`;
  if (cache.has(key)) return cache.get(key)!;
  const v1 = vertices[v1Idx], v2 = vertices[v2Idx];
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5).normalize();
  const idx = vertices.length;
  vertices.push(mid);
  cache.set(key, idx);
  return idx;
};

export const generateGrid = (subdivisions: number): HexGeometry[] => {
  if (gridCache && gridCache.subdivisions === subdivisions) {
    return gridCache.geometries;
  }

  // 1. Generate Icosahedron Geometry
  const t = (1 + Math.sqrt(5)) / 2;
  const rawVertices: THREE.Vector3[] = [
    new THREE.Vector3(-1, t, 0).normalize(), new THREE.Vector3(1, t, 0).normalize(),
    new THREE.Vector3(-1, -t, 0).normalize(), new THREE.Vector3(1, -t, 0).normalize(),
    new THREE.Vector3(0, -1, t).normalize(), new THREE.Vector3(0, 1, t).normalize(),
    new THREE.Vector3(0, -1, -t).normalize(), new THREE.Vector3(0, 1, -t).normalize(),
    new THREE.Vector3(t, 0, -1).normalize(), new THREE.Vector3(t, 0, 1).normalize(),
    new THREE.Vector3(-t, 0, -1).normalize(), new THREE.Vector3(-t, 0, 1).normalize(),
  ];

  let faces: IcoFace[] = [
    { v1: 0, v2: 11, v3: 5 }, { v1: 0, v2: 5, v3: 1 }, { v1: 0, v2: 1, v3: 7 }, { v1: 0, v2: 7, v3: 10 }, { v1: 0, v2: 10, v3: 11 },
    { v1: 1, v2: 5, v3: 9 }, { v1: 5, v2: 11, v3: 4 }, { v1: 11, v2: 10, v3: 2 }, { v1: 10, v2: 7, v3: 6 }, { v1: 7, v2: 1, v3: 8 },
    { v1: 3, v2: 9, v3: 4 }, { v1: 3, v2: 4, v3: 2 }, { v1: 3, v2: 2, v3: 6 }, { v1: 3, v2: 6, v3: 8 }, { v1: 3, v2: 8, v3: 9 },
    { v1: 4, v2: 9, v3: 5 }, { v1: 2, v2: 4, v3: 11 }, { v1: 6, v2: 2, v3: 10 }, { v1: 8, v2: 6, v3: 7 }, { v1: 9, v2: 8, v3: 1 },
  ];

  const adj = new Map<number, Set<number>>();
  const addEdge = (a: number, b: number) => {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  };
  faces.forEach(f => { addEdge(f.v1, f.v2); addEdge(f.v2, f.v3); addEdge(f.v3, f.v1); });

  const midCache = new Map<string, number>();
  for (let s = 0; s < subdivisions; s++) {
    const nextFaces: IcoFace[] = [];
    faces.forEach(f => {
      const a = getMidpoint(f.v1, f.v2, rawVertices, midCache);
      const b = getMidpoint(f.v2, f.v3, rawVertices, midCache);
      const c = getMidpoint(f.v3, f.v1, rawVertices, midCache);
      nextFaces.push({ v1: f.v1, v2: a, v3: c }, { v1: f.v2, v2: b, v3: a }, { v1: f.v3, v2: c, v3: b }, { v1: a, v2: b, v3: c });
      addEdge(f.v1, a); addEdge(a, f.v2); addEdge(f.v2, b); addEdge(b, f.v3); addEdge(f.v3, c); addEdge(c, f.v1);
      addEdge(a, b); addEdge(b, c); addEdge(c, a);
    });
    faces = nextFaces;
  }

  // Build Dual Polyhedron (Hexes)
  const vertexToFaces = new Array(rawVertices.length).fill(null).map(() => [] as number[]);
  faces.forEach((f, idx) => { vertexToFaces[f.v1].push(idx); vertexToFaces[f.v2].push(idx); vertexToFaces[f.v3].push(idx); });
  const faceCentroids = faces.map(f => new THREE.Vector3().add(rawVertices[f.v1]).add(rawVertices[f.v2]).add(rawVertices[f.v3]).divideScalar(3).normalize());

  const geometries: HexGeometry[] = rawVertices.map((center, vIdx) => {
    const sharedFaceIndices = vertexToFaces[vIdx];
    const centroids = sharedFaceIndices.map(fIdx => faceCentroids[fIdx]);
    
    // Sort centroids to form a convex polygon
    const normal = center.clone(); // Normalized by definition (mostly)
    const axisX = centroids[0].clone().sub(center).normalize();
    const axisY = new THREE.Vector3().crossVectors(normal, axisX).normalize();
    
    centroids.sort((a, b) => {
      const relA = a.clone().sub(center), relB = b.clone().sub(center);
      return Math.atan2(relA.dot(axisY), relA.dot(axisX)) - Math.atan2(relB.dot(axisY), relB.dot(axisX));
    });

    // Scale vertices slightly to reduce z-fighting gaps
    const vertices = centroids.map(c => c.clone().multiplyScalar(1.001).toArray() as [number, number, number]);
    const neighborIndices = Array.from(adj.get(vIdx) || []);
    const neighborIds = neighborIndices.map(n => `cell-${n}`);

    return {
      id: `cell-${vIdx}`,
      index: vIdx,
      center: center.toArray() as [number, number, number],
      vertices,
      neighbors: neighborIds,
      neighborIndices,
      isPentagon: sharedFaceIndices.length === 5,
    };
  });

  gridCache = { subdivisions, geometries };
  return geometries;
};
