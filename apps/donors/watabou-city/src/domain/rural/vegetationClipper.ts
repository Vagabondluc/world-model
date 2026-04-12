// @ts-nocheck
import { Point, dist } from '../types';

/**
 * Configuration for vegetation clipping
 */
export interface VegetationClipConfig {
  riverCorridorBuffer: number;   // Buffer distance from river edges
  wallContactBuffer: number;     // Buffer distance from walls
  vegetationTolerance: number;   // Number of trees allowed in buffers (default: 0)
}

/**
 * Tree structure for clipping
 */
export interface TreeForClipping {
  id: string;
  position: Point;
  isException: boolean;
  clipMask?: string[];
}

/**
 * Clipping mask definition
 */
export interface ClippingMask {
  id: string;
  polygon: Point[];
}

/**
 * Result of vegetation clipping
 */
export interface VegetationClipResult {
  clippedTrees: TreeForClipping[];
  removedCount: number;
  exceptionCount: number;
  riverCorridorRemovals: number;
  wallBufferRemovals: number;
}

/**
 * Result of vegetation buffer validation
 */
export interface VegetationValidationResult {
  isValid: boolean;
  treesInRiverCorridor: number;
  treesInWallBuffer: number;
  violations: string[];
}

/**
 * Clipping artifact description
 */
export interface ClippingArtifact {
  treeId: string;
  maskId: string;
  artifactType: 'outside-mask' | 'partial-clip' | 'mask-conflict';
  description: string;
}

/**
 * Computes the minimum distance from a point to a river path.
 */
export function minDistanceToRiver(point: Point, rivers: Point[][]): number {
  let minDist = Infinity;
  
  for (const river of rivers) {
    for (let i = 0; i < river.length - 1; i++) {
      const d = distanceToSegment(point, river[i], river[i + 1]);
      minDist = Math.min(minDist, d);
    }
  }
  
  return minDist === Infinity ? 0 : minDist;
}

/**
 * Computes the minimum distance from a point to a wall polygon.
 */
export function minDistanceToWall(point: Point, wallPolygon: Point[]): number {
  let minDist = Infinity;
  const n = wallPolygon.length;
  
  for (let i = 0; i < n - 1; i++) {
    const d = distanceToSegment(point, wallPolygon[i], wallPolygon[i + 1]);
    minDist = Math.min(minDist, d);
  }
  
  return minDist === Infinity ? 0 : minDist;
}

/**
 * Computes the distance from a point to a line segment.
 */
function distanceToSegment(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lenSq = dx * dx + dy * dy;
  
  if (lenSq === 0) {
    return dist(point, start);
  }
  
  const t = Math.max(0, Math.min(1, 
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq
  ));
  
  const projection = {
    x: start.x + t * dx,
    y: start.y + t * dy
  };
  
  return dist(point, projection);
}

/**
 * Finds trees within the river corridor buffer.
 */
export function findTreesInRiverCorridor(
  trees: TreeForClipping[],
  rivers: Point[][],
  buffer: number
): TreeForClipping[] {
  return trees.filter(tree => {
    if (tree.isException) return false;
    const distance = minDistanceToRiver(tree.position, rivers);
    return distance < buffer;
  });
}

/**
 * Finds trees within the wall contact buffer.
 */
export function findTreesInWallBuffer(
  trees: TreeForClipping[],
  wallPolygon: Point[],
  buffer: number
): TreeForClipping[] {
  return trees.filter(tree => {
    if (tree.isException) return false;
    const distance = minDistanceToWall(tree.position, wallPolygon);
    return distance < buffer;
  });
}

/**
 * Computes a consistent rendering order for vegetation.
 */
export function computeVegetationRenderOrder(
  trees: TreeForClipping[],
  masks: ClippingMask[]
): string[] {
  // Sort by y-coordinate (top to bottom), then by x (left to right)
  const sorted = [...trees].sort((a, b) => {
    const dy = a.position.y - b.position.y;
    if (Math.abs(dy) > 1) return dy;
    return a.position.x - b.position.x;
  });
  
  return sorted.map(t => t.id);
}

/**
 * Finds clipping masks applicable to a tree.
 */
export function findApplicableClippingMasks(
  tree: TreeForClipping,
  masks: ClippingMask[]
): ClippingMask[] {
  return masks.filter(mask => isPointInPolygon(tree.position, mask.polygon));
}

/**
 * Detects clipping artifacts in the vegetation rendering.
 */
export function detectClippingArtifacts(
  trees: TreeForClipping[],
  masks: ClippingMask[]
): ClippingArtifact[] {
  const artifacts: ClippingArtifact[] = [];
  
  for (const tree of trees) {
    if (!tree.clipMask || tree.clipMask.length === 0) continue;
    
    for (const maskId of tree.clipMask) {
      const mask = masks.find(m => m.id === maskId);
      if (!mask) continue;
      
      // Check if tree is outside its clipping mask
      if (!isPointInPolygon(tree.position, mask.polygon)) {
        artifacts.push({
          treeId: tree.id,
          maskId,
          artifactType: 'outside-mask',
          description: `Tree ${tree.id} is outside its clipping mask ${maskId}`
        });
      }
    }
  }
  
  return artifacts;
}

/**
 * Checks if a point is inside a polygon using ray casting.
 */
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  const n = polygon.length;
  
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    if (((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

/**
 * VegetationClipper handles vegetation clipping according to CRC-A3-003.
 * Enforces river corridor and wall contact exclusion buffers.
 */
export class VegetationClipper {
  private config: VegetationClipConfig;
  
  constructor(config: VegetationClipConfig) {
    this.config = config;
  }
  
  /**
   * Clips vegetation to respect exclusion buffers.
   */
  clipVegetation(
    trees: TreeForClipping[],
    rivers: Point[][],
    wallPolygon: Point[]
  ): VegetationClipResult {
    const clippedTrees: TreeForClipping[] = [];
    let removedCount = 0;
    let exceptionCount = 0;
    let riverCorridorRemovals = 0;
    let wallBufferRemovals = 0;
    
    for (const tree of trees) {
      // Exception trees are always preserved
      if (tree.isException) {
        clippedTrees.push(tree);
        exceptionCount++;
        continue;
      }
      
      // Check river corridor buffer
      const riverDist = minDistanceToRiver(tree.position, rivers);
      if (riverDist < this.config.riverCorridorBuffer) {
        removedCount++;
        riverCorridorRemovals++;
        continue;
      }
      
      // Check wall contact buffer
      const wallDist = minDistanceToWall(tree.position, wallPolygon);
      if (wallDist < this.config.wallContactBuffer) {
        removedCount++;
        wallBufferRemovals++;
        continue;
      }
      
      clippedTrees.push(tree);
    }
    
    // Check tolerance
    if (removedCount > this.config.vegetationTolerance) {
      // Still return clipped result, but caller can check counts
    }
    
    return {
      clippedTrees,
      removedCount,
      exceptionCount,
      riverCorridorRemovals,
      wallBufferRemovals
    };
  }
  
  /**
   * Validates vegetation placement against buffer requirements.
   */
  validateVegetationBuffers(
    trees: TreeForClipping[],
    rivers: Point[][],
    wallPolygon: Point[]
  ): VegetationValidationResult {
    const violations: string[] = [];
    
    // Count trees in river corridor
    const treesInRiverCorridor = findTreesInRiverCorridor(
      trees, rivers, this.config.riverCorridorBuffer
    ).length;
    
    if (treesInRiverCorridor > this.config.vegetationTolerance) {
      violations.push(
        `Found ${treesInRiverCorridor} trees in river corridor buffer (max: ${this.config.vegetationTolerance})`
      );
    }
    
    // Count trees in wall buffer
    const treesInWallBuffer = findTreesInWallBuffer(
      trees, wallPolygon, this.config.wallContactBuffer
    ).length;
    
    if (treesInWallBuffer > this.config.vegetationTolerance) {
      violations.push(
        `Found ${treesInWallBuffer} trees in wall contact buffer (max: ${this.config.vegetationTolerance})`
      );
    }
    
    return {
      isValid: violations.length === 0,
      treesInRiverCorridor,
      treesInWallBuffer,
      violations
    };
  }
  
  /**
   * Applies clipping masks to trees.
   */
  applyClippingMasks(
    trees: TreeForClipping[],
    masks: ClippingMask[]
  ): TreeForClipping[] {
    return trees.map(tree => {
      const applicableMasks = findApplicableClippingMasks(tree, masks);
      return {
        ...tree,
        clipMask: applicableMasks.map(m => m.id)
      };
    });
  }
}

/**
 * ClippingMaskManager manages clipping masks for vegetation rendering.
 */
export class ClippingMaskManager {
  private masks: Map<string, ClippingMask> = new Map();
  
  /**
   * Adds a clipping mask.
   */
  addMask(mask: ClippingMask): void {
    this.masks.set(mask.id, mask);
  }
  
  /**
   * Gets a clipping mask by ID.
   */
  getMask(id: string): ClippingMask | undefined {
    return this.masks.get(id);
  }
  
  /**
   * Gets all clipping masks.
   */
  getAllMasks(): ClippingMask[] {
    return Array.from(this.masks.values());
  }
  
  /**
   * Creates a river corridor mask.
   */
  createRiverCorridorMask(
    riverPath: Point[],
    buffer: number,
    id: string
  ): ClippingMask {
    // Create a buffer polygon around the river
    const polygon = this.bufferLine(riverPath, buffer);
    return { id, polygon };
  }
  
  /**
   * Creates a wall contact mask.
   */
  createWallContactMask(
    wallPolygon: Point[],
    buffer: number,
    id: string
  ): ClippingMask {
    // Create an inner buffer polygon
    const polygon = this.bufferPolygon(wallPolygon, -buffer);
    return { id, polygon };
  }
  
  /**
   * Buffers a line to create a polygon.
   */
  private bufferLine(line: Point[], buffer: number): Point[] {
    if (line.length < 2) return [];
    
    const leftSide: Point[] = [];
    const rightSide: Point[] = [];
    
    for (let i = 0; i < line.length; i++) {
      const prev = line[Math.max(0, i - 1)];
      const curr = line[i];
      const next = line[Math.min(line.length - 1, i + 1)];
      
      // Compute normal direction
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      
      if (len === 0) continue;
      
      const nx = -dy / len;
      const ny = dx / len;
      
      leftSide.push({
        x: curr.x + nx * buffer,
        y: curr.y + ny * buffer
      });
      
      rightSide.push({
        x: curr.x - nx * buffer,
        y: curr.y - ny * buffer
      });
    }
    
    // Combine sides to form closed polygon
    return [...leftSide, ...rightSide.reverse()];
  }
  
  /**
   * Buffers a polygon inward (negative) or outward (positive).
   */
  private bufferPolygon(polygon: Point[], buffer: number): Point[] {
    // Simplified inward buffering
    const result: Point[] = [];
    const n = polygon.length;
    
    // Compute centroid
    let cx = 0, cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    cx /= n;
    cy /= n;
    
    // Move each point toward/away from centroid
    for (const p of polygon) {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const len = Math.sqrt(dx * dx + dy * dy);
      
      if (len === 0) {
        result.push(p);
      } else {
        const scale = (len - buffer) / len;
        result.push({
          x: cx + dx * scale,
          y: cy + dy * scale
        });
      }
    }
    
    return result;
  }
}
