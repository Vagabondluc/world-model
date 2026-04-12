// @ts-nocheck
/**
 * Building Density Baseline Capture Script
 * 
 * Captures baseline metrics for building density and alignment quality
 * on canonical seeds before implementing the deterministic cell-fill packer.
 * 
 * Run with: npx tsx src/scripts/captureBuildingDensityBaseline.ts
 */

import { generateCity, CityModel } from '../pipeline/generateCity';
import { Point } from '../domain/types';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Canonical seeds as specified in the test plan
const CANONICAL_SEEDS = [1, 42, 123, 456, 789, 1234];
const SIZE = 20;

interface BuildingDensityMetrics {
  mean_cell_coverage: number;
  p50_cell_coverage: number;
  p90_cell_coverage: number;
  mean_alignment_error_deg: number;
  building_overlap_count: number;
  blocker_failures: number;
}

interface BaselineArtifact {
  version: string;
  description: string;
  generated: string;
  canonicalSeeds: number[];
  baselineSeedResults: Record<number, BuildingDensityMetrics>;
  thresholds: {
    mean_cell_coverage_improvement_min: number;
    p50_cell_coverage_improvement_min: number;
    alignment_error_reduction_min_percent: number;
  };
}

/**
 * Calculate polygon area using shoelace formula
 */
function polygonArea(polygon: Point[]): number {
  if (polygon.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i].x * polygon[j].y;
    area -= polygon[j].x * polygon[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Calculate the angle of the dominant axis of a polygon (PCA-like)
 */
function calculateDominantAxis(polygon: Point[]): number {
  if (polygon.length < 2) return 0;
  
  const centroid = polygon.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  );
  centroid.x /= polygon.length;
  centroid.y /= polygon.length;
  
  // Compute covariance matrix elements
  let cxx = 0, cxy = 0, cyy = 0;
  for (const p of polygon) {
    const dx = p.x - centroid.x;
    const dy = p.y - centroid.y;
    cxx += dx * dx;
    cxy += dx * dy;
    cyy += dy * dy;
  }
  
  // Compute angle of principal axis
  const angle = 0.5 * Math.atan2(2 * cxy, cxx - cyy);
  return angle * (180 / Math.PI); // Convert to degrees
}

/**
 * Check if two polygons overlap
 */
function polygonsOverlap(poly1: Point[], poly2: Point[]): boolean {
  // Bounding box check first
  const bounds1 = getBounds(poly1);
  const bounds2 = getBounds(poly2);
  
  if (bounds1.maxX < bounds2.minX || bounds2.maxX < bounds1.minX ||
      bounds1.maxY < bounds2.minY || bounds2.maxY < bounds1.minY) {
    return false;
  }
  
  // Check if any point of poly1 is inside poly2 or vice versa
  for (const p of poly1) {
    if (isPointInPolygon(p, poly2)) return true;
  }
  for (const p of poly2) {
    if (isPointInPolygon(p, poly1)) return true;
  }
  
  return false;
}

function getBounds(polygon: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of polygon) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
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
 * Count building overlaps
 */
function countBuildingOverlaps(buildings: { polygon: Point[] }[]): number {
  let overlapCount = 0;
  for (let i = 0; i < buildings.length; i++) {
    for (let j = i + 1; j < buildings.length; j++) {
      if (polygonsOverlap(buildings[i].polygon, buildings[j].polygon)) {
        overlapCount++;
      }
    }
  }
  return overlapCount;
}

/**
 * Calculate road tangent angles near buildings
 */
function getRoadTangentAngles(
  buildingCentroid: Point,
  roads: { edges: Array<{ u: string; v: string; kind: string }> },
  roadNodes: Map<string, { point: Point }>
): number[] {
  const angles: number[] = [];
  const maxDist = 0.05; // Greatest distance to consider road as adjacent
  
  for (const edge of roads.edges) {
    const fromNode = roadNodes.get(edge.u);
    const toNode = roadNodes.get(edge.v);
    if (!fromNode || !toNode) continue;
    
    // Check if edge is near building
    const midX = (fromNode.point.x + toNode.point.x) / 2;
    const midY = (fromNode.point.y + toNode.point.y) / 2;
    const dist = Math.sqrt(
      Math.pow(buildingCentroid.x - midX, 2) + 
      Math.pow(buildingCentroid.y - midY, 2)
    );
    
    if (dist < maxDist) {
      const dx = toNode.point.x - fromNode.point.x;
      const dy = toNode.point.y - fromNode.point.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      angles.push(angle);
    }
  }
  
  return angles;
}

/**
 * Calculate alignment error for a building
 */
function calculateAlignmentError(
  buildingAngle: number,
  roadAngles: number[]
): number {
  if (roadAngles.length === 0) return 0;
  
  // Find smallest angle difference
  let minError = 180;
  for (const roadAngle of roadAngles) {
    let diff = Math.abs(buildingAngle - roadAngle);
    if (diff > 90) diff = 180 - diff; // Normalize to 0-90 range
    if (diff > 45) diff = 90 - diff; // Consider perpendicular alignment
    minError = Math.min(minError, diff);
  }
  
  return minError;
}

/**
 * Calculate cell coverage for a parcel/cell
 */
function calculateCellCoverage(
  parcelPolygon: Point[],
  buildings: { polygon: Point[] }[]
): number {
  const parcelArea = polygonArea(parcelPolygon);
  if (parcelArea === 0) return 0;
  
  let buildingArea = 0;
  for (const building of buildings) {
    // Check if building centroid is in parcel
    const centroid = building.polygon.reduce(
      (acc, p) => ({ x: acc.x + p.x / building.polygon.length, y: acc.y + p.y / building.polygon.length }),
      { x: 0, y: 0 }
    );
    if (isPointInPolygon(centroid, parcelPolygon)) {
      buildingArea += polygonArea(building.polygon);
    }
  }
  
  return Math.min(1, buildingArea / parcelArea);
}

/**
 * Extract metrics from a generated city model
 */
function extractMetrics(model: CityModel): BuildingDensityMetrics {
  const coverages: number[] = [];
  const alignmentErrors: number[] = [];
  
  // Get road nodes as proper type
  const roadNodes = model.roads.nodes;
  
  // Calculate coverage per parcel
  for (const parcel of model.parcels) {
    const parcelBuildings = model.buildings.filter(b => b.parcelId === parcel.id);
    const coverage = calculateCellCoverage(parcel.polygon, parcelBuildings);
    coverages.push(coverage);
    
    // Calculate alignment for buildings in this parcel
    for (const building of parcelBuildings) {
      const buildingAngle = calculateDominantAxis(building.polygon);
      const centroid = building.polygon.reduce(
        (acc, p) => ({ x: acc.x + p.x / building.polygon.length, y: acc.y + p.y / building.polygon.length }),
        { x: 0, y: 0 }
      );
      const roadAngles = getRoadTangentAngles(centroid, model.roads, roadNodes);
      const error = calculateAlignmentError(buildingAngle, roadAngles);
      alignmentErrors.push(error);
    }
  }
  
  // Sort for percentiles
  coverages.sort((a, b) => a - b);
  alignmentErrors.sort((a, b) => a - b);
  
  // Calculate statistics
  const meanCoverage = coverages.length > 0 
    ? coverages.reduce((a, b) => a + b, 0) / coverages.length 
    : 0;
  
  const p50Coverage = coverages.length > 0 
    ? coverages[Math.floor(coverages.length * 0.5)] 
    : 0;
  
  const p90Coverage = coverages.length > 0 
    ? coverages[Math.floor(coverages.length * 0.9)] 
    : 0;
  
  const meanAlignmentError = alignmentErrors.length > 0 
    ? alignmentErrors.reduce((a, b) => a + b, 0) / alignmentErrors.length 
    : 0;
  
  // Count building overlaps
  const overlapCount = countBuildingOverlaps(model.buildings);
  
  // Count blocker failures from invariants
  const blockerFailures = model.invariants.failed.length;
  
  return {
    mean_cell_coverage: Math.round(meanCoverage * 10000) / 10000,
    p50_cell_coverage: Math.round(p50Coverage * 10000) / 10000,
    p90_cell_coverage: Math.round(p90Coverage * 10000) / 10000,
    mean_alignment_error_deg: Math.round(meanAlignmentError * 100) / 100,
    building_overlap_count: overlapCount,
    blocker_failures: blockerFailures
  };
}

/**
 * Main entry point to capture baseline
 */
async function captureBaseline(): Promise<void> {
  console.log('Building Density Baseline Capture');
  console.log('=================================\n');
  
  const results: Record<number, BuildingDensityMetrics> = {};
  
  for (const seed of CANONICAL_SEEDS) {
    console.log(`Processing seed ${seed}...`);
    
    try {
      const model = generateCity(seed, SIZE);
      const metrics = extractMetrics(model);
      results[seed] = metrics;
      
      console.log(`  mean_cell_coverage: ${metrics.mean_cell_coverage}`);
      console.log(`  p50_cell_coverage: ${metrics.p50_cell_coverage}`);
      console.log(`  p90_cell_coverage: ${metrics.p90_cell_coverage}`);
      console.log(`  mean_alignment_error_deg: ${metrics.mean_alignment_error_deg}`);
      console.log(`  building_overlap_count: ${metrics.building_overlap_count}`);
      console.log(`  blocker_failures: ${metrics.blocker_failures}`);
      console.log('');
    } catch (error) {
      console.error(`  Error processing seed ${seed}:`, error);
      results[seed] = {
        mean_cell_coverage: 0,
        p50_cell_coverage: 0,
        p90_cell_coverage: 0,
        mean_alignment_error_deg: 0,
        building_overlap_count: 0,
        blocker_failures: -1 // Error indicator
      };
    }
  }
  
  const artifact: BaselineArtifact = {
    version: '1.0.0',
    description: 'Baseline metrics for building density and alignment quality before deterministic cell-fill packer implementation',
    generated: new Date().toISOString(),
    canonicalSeeds: CANONICAL_SEEDS,
    baselineSeedResults: results,
    thresholds: {
      mean_cell_coverage_improvement_min: 0.08,
      p50_cell_coverage_improvement_min: 0.06,
      alignment_error_reduction_min_percent: 20
    }
  };
  
  // Write to fixtures directory
  const outputPath = join(__dirname, '../../tests/fixtures/building-density-baseline.json');
  writeFileSync(outputPath, JSON.stringify(artifact, null, 2));
  console.log(`\nBaseline artifact written to: ${outputPath}`);
  
  // Summary
  console.log('\nSummary');
  console.log('-------');
  const avgMeanCoverage = Object.values(results).reduce((a, b) => a + b.mean_cell_coverage, 0) / CANONICAL_SEEDS.length;
  const avgP50Coverage = Object.values(results).reduce((a, b) => a + b.p50_cell_coverage, 0) / CANONICAL_SEEDS.length;
  const avgAlignmentError = Object.values(results).reduce((a, b) => a + b.mean_alignment_error_deg, 0) / CANONICAL_SEEDS.length;
  const totalOverlaps = Object.values(results).reduce((a, b) => a + b.building_overlap_count, 0);
  const totalBlockers = Object.values(results).reduce((a, b) => a + b.blocker_failures, 0);
  
  console.log(`Average mean_cell_coverage: ${avgMeanCoverage.toFixed(4)}`);
  console.log(`Average p50_cell_coverage: ${avgP50Coverage.toFixed(4)}`);
  console.log(`Average mean_alignment_error_deg: ${avgAlignmentError.toFixed(2)}`);
  console.log(`Total building_overlap_count: ${totalOverlaps}`);
  console.log(`Total blocker_failures: ${totalBlockers}`);
}

// Run the capture
captureBaseline().catch(console.error);
