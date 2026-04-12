// @ts-nocheck
import { PRNG } from '../seed/prng';
import { Point } from '../types';
import { NoiseField } from '../terrain/fields';

// Export all boundary-related classes
export { ForbiddenMaskCalculator } from './forbiddenMaskCalculator';
export { ClearZoneCalculator } from './clearZoneCalculator';
export { GateResolver } from './gateResolver';
export { RiverWallResolver } from './riverWallResolver';
export { WallScaler } from './wallScaler';
export { TowerScaler } from './towerScaler';
export { TowerPlacer } from './towerPlacer';

// Re-export types for convenience
export type {
  Wall,
  Tower,
  ForbiddenMaskPolygon
} from './forbiddenMaskCalculator';
export type {
  ClearZone
} from './clearZoneCalculator';
export type {
  Gate,
  RoadWallIntersection,
  Road
} from './gateResolver';
export type {
  River,
  RiverWallCrossing,
  RiverWallResolverType,
  RiverWallStructure
} from './riverWallResolver';
export type {
  ViewportTransform
} from './wallScaler';
export type {
  TowerPlacementConfig
} from './towerPlacer';

/**
 * Selects a city hub point near the center with deterministic jitter.
 */
export function selectHub(suitability: NoiseField, rng: PRNG): Point {
  let bestPoint: Point = { x: 0.5, y: 0.5 };
  let maxScore = -Infinity;

  const w1 = 1.0;
  const w2 = 0.5;
  const center = { x: 0.5, y: 0.5 };

  // Sample a grid of candidates
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const p = {
        x: 0.3 + 0.4 * (i / 9) + (rng.nextFloat() - 0.5) * 0.05,
        y: 0.3 + 0.4 * (j / 9) + (rng.nextFloat() - 0.5) * 0.05,
      };

      const dist = Math.sqrt((p.x - center.x) ** 2 + (p.y - center.y) ** 2);
      const score = w1 * suitability(p.x * 10, p.y * 10) - w2 * dist;

      if (score > maxScore) {
        maxScore = score;
        bestPoint = p;
      }
    }
  }

  return bestPoint;
}

/**
 * Builds a closed boundary ring around the hub.
 */
export function buildBoundary(hub: Point, size: number, rng: PRNG): Point[] {
  const n = 16 + Math.floor(size / 2);
  const r = 0.1 + (size / 40) * 0.3;
  const rMin = r * 0.6;
  const rMax = r * 1.4;

  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    const theta = (2 * Math.PI * i) / n;
    const eps = (rng.nextFloat() - 0.5) * (r * 0.4);
    const ri = Math.min(Math.max(r + eps, rMin), rMax);

    points.push({
      x: hub.x + ri * Math.cos(theta),
      y: hub.y + ri * Math.sin(theta),
    });
  }

  return points;
}

/**
 * Selects gate points on the boundary.
 */
export function selectGates(boundary: Point[], gmin: number, gmax: number, rng: PRNG): Point[] {
  const gates: Point[] = [];
  const n = boundary.length;
  const deltaArc = 3; // Minimum index separation

  const candidates = Array.from({ length: n }, (_, i) => i);
  
  // Shuffle candidates
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (const idx of candidates) {
    if (gates.length >= gmax) break;

    let tooClose = false;
    for (const gate of gates) {
      // Find index of existing gate
      const gateIdx = boundary.findIndex(p => p.x === gate.x && p.y === gate.y);
      const diff = Math.abs(idx - gateIdx);
      const circularDiff = Math.min(diff, n - diff);
      
      if (circularDiff < deltaArc) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      gates.push(boundary[idx]);
    }
  }

  // Ensure minimum gates
  while (gates.length < gmin && candidates.length > 0) {
    // This is a fallback, might violate deltaArc but ensures gmin
    const idx = candidates.pop()!;
    if (!gates.some(g => boundary[idx].x === g.x && boundary[idx].y === g.y)) {
      gates.push(boundary[idx]);
    }
  }

  return gates;
}
