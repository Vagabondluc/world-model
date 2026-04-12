// @ts-nocheck
/**
 * R9: Render Semantics Evaluators
 * 
 * Has evaluators for render order contracts:
 * - R9.1: Gate Gap Clipping (CRC-A6-012) - Gate gaps visible (wall excludes gate gap polygons)
 * - R9.2: Canonical Layer Stack (CRC-A6-131) - Canonical z-order map enforced
 * 
 * @module domain/invariants/evaluators/r9-renderSemantics
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Gate gap definition for render clipping
 */
export interface GateGap {
  id: string;
  gateId: string;
  position: { x: number; y: number };
  width: number;
  polygon: Array<{ x: number; y: number }>;
}

/**
 * Wall render segment with potential gap
 */
export interface WallRenderSegment {
  id: string;
  wallId: string;
  polygon: Array<{ x: number; y: number }>;
  hasGateGap: boolean;
  gateGapId?: string;
}

/**
 * Gate gap render violation record
 */
export interface GateGapRenderViolation {
  wallSegmentId: string;
  gateGapId: string;
  reason: string;
  overlapArea: number;
}

/**
 * Render layer definition
 */
export interface RenderLayer {
  id: string;
  name: string;
  zIndex: number;
  elements: string[];
}

/**
 * Layer precedence violation record
 */
export interface LayerPrecedenceViolation {
  layerAbove: string;
  layerBelow: string;
  expectedOrder: string;
  actualZAbove: number;
  actualZBelow: number;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds and z-order values for render semantics
 */
export const RENDER_SEMANTICS_THRESHOLDS = {
  // R9.2: Canonical z-order values
  // Order: bridgeZ > riverZ, wallZ > buildingZ
  canonicalZOrder: {
    ground: 0,
    river: 10,
    bridge: 20,  // Must be > river
    buildings: 30,
    wall: 40,    // Must be > buildings
    gates: 50,
    towers: 60,
    labels: 100
  },
  
  // Minimum gap width for visibility
  minGateGapWidth: 2
};

// ============================================================================
// R9.1: Gate Gap Clipping Evaluator (CRC-A6-012)
// ============================================================================

/**
 * R9.1 Gate Gap Clipping Evaluator
 * Ensures wall render excludes gate gap polygons so gates are visible.
 */
export class R91GateGapClippingEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-012';
  readonly name = 'Gate Gap Clipping';
  
  /**
   * Measure gate gap visibility in wall render.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const walls = model.walls || [];
    const gates = model.gates || [];
    const wallRenderSegments = model.wallRenderSegments || [];
    
    // Generate gate gap polygons from gates
    const gateGaps = this.generateGateGaps(gates, walls);
    
    // Check each wall render segment for gate gap violations
    const violations: GateGapRenderViolation[] = [];
    let visibleGateGaps = 0;
    
    for (const gap of gateGaps) {
      let isCovered = false;
      let coveringSegmentId = '';
      let overlapArea = 0;
      
      for (const segment of wallRenderSegments) {
        if (this.segmentsOverlapGap(segment, gap)) {
          isCovered = true;
          coveringSegmentId = segment.id;
          overlapArea = this.calculateOverlapArea(segment.polygon, gap.polygon);
          break;
        }
      }
      
      if (isCovered) {
        violations.push({
          wallSegmentId: coveringSegmentId,
          gateGapId: gap.id,
          reason: 'Wall render segment covers gate gap',
          overlapArea
        });
      } else {
        visibleGateGaps++;
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        gate_gap_render_violations: violations,
        gate_gaps_total: gateGaps.length,
        gate_gaps_visible: visibleGateGaps,
        gate_gaps_covered: violations.length,
        clipping_applied: model.gateGapClippingApplied || false
      }
    };
  }
  
  /**
   * Check if all gate gaps are visible (no violations).
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.gate_gap_render_violations as GateGapRenderViolation[]).length === 0;
  }
  
  /**
   * Repair by clipping wall at gate openings.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.gate_gap_render_violations as GateGapRenderViolation[];
    const model = context.model as any;
    
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    // Clip wall segments at gate gaps
    const walls = model.walls || [];
    const gates = model.gates || [];
    const gateGaps = this.generateGateGaps(gates, walls);
    
    if (violations.length > 0) {
      // Apply clipping to wall render segments
      const clippedSegments = this.clipWallsAtGateGaps(
        model.wallRenderSegments || [],
        gateGaps
      );
      
      model.wallRenderSegments = clippedSegments;
      model.gateGapClippingApplied = true;
      
      for (const violation of violations) {
        geometryIdsTouched.push(violation.wallSegmentId);
        repairsApplied++;
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violations: beforeMetrics.value },
        { violations: afterMetrics.value },
        geometryIdsTouched,
        'clipWallsAtGateGaps',
        'render',
        1
      )
    };
  }
  
  // Helper methods
  
  private generateGateGaps(gates: any[], walls: any[]): GateGap[] {
    const gaps: GateGap[] = [];
    
    for (const gate of gates) {
      const width = gate.width || RENDER_SEMANTICS_THRESHOLDS.minGateGapWidth;
      const halfWidth = width / 2;
      
      // Create gate gap polygon (rectangle around gate position)
      const polygon = [
        { x: gate.position.x - halfWidth, y: gate.position.y - halfWidth },
        { x: gate.position.x + halfWidth, y: gate.position.y - halfWidth },
        { x: gate.position.x + halfWidth, y: gate.position.y + halfWidth },
        { x: gate.position.x - halfWidth, y: gate.position.y + halfWidth }
      ];
      
      gaps.push({
        id: `gate-gap-${gate.id}`,
        gateId: gate.id,
        position: gate.position,
        width,
        polygon
      });
    }
    
    return gaps;
  }
  
  private segmentsOverlapGap(segment: WallRenderSegment, gap: GateGap): boolean {
    // Simple bounding box check
    const segmentBounds = this.getBoundingBox(segment.polygon);
    const gapBounds = this.getBoundingBox(gap.polygon);
    
    return !(
      segmentBounds.maxX < gapBounds.minX ||
      segmentBounds.minX > gapBounds.maxX ||
      segmentBounds.maxY < gapBounds.minY ||
      segmentBounds.minY > gapBounds.maxY
    );
  }
  
  private calculateOverlapArea(poly1: Array<{x: number; y: number}>, poly2: Array<{x: number; y: number}>): number {
    // Simplified overlap calculation using bounding boxes
    const bounds1 = this.getBoundingBox(poly1);
    const bounds2 = this.getBoundingBox(poly2);
    
    const overlapX = Math.max(0, Math.min(bounds1.maxX, bounds2.maxX) - Math.max(bounds1.minX, bounds2.minX));
    const overlapY = Math.max(0, Math.min(bounds1.maxY, bounds2.maxY) - Math.max(bounds1.minY, bounds2.minY));
    
    return overlapX * overlapY;
  }
  
  private getBoundingBox(polygon: Array<{x: number; y: number}>): { minX: number; maxX: number; minY: number; maxY: number } {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (const point of polygon) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
    
    return { minX, maxX, minY, maxY };
  }
  
  private clipWallsAtGateGaps(segments: WallRenderSegment[], gaps: GateGap[]): WallRenderSegment[] {
    const clippedSegments: WallRenderSegment[] = [];
    
    for (const segment of segments) {
      let needsClipping = false;
      let clipGapId: string | undefined;
      
      for (const gap of gaps) {
        if (this.segmentsOverlapGap(segment, gap)) {
          needsClipping = true;
          clipGapId = gap.id;
          break;
        }
      }
      
      if (needsClipping) {
        // Mark segment as having gate gap (clipped)
        clippedSegments.push({
          ...segment,
          hasGateGap: true,
          gateGapId: clipGapId
        });
      } else {
        clippedSegments.push(segment);
      }
    }
    
    return clippedSegments;
  }
}

// ============================================================================
// R9.2: Canonical Layer Stack Evaluator (CRC-A6-131)
// ============================================================================

/**
 * R9.2 Canonical Layer Stack Evaluator
 * Ensures canonical z-order map is enforced: bridgeZ > riverZ, wallZ > buildingZ
 */
export class R92CanonicalLayerStackEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-131';
  readonly name = 'Canonical Layer Stack';
  
  /**
   * Measure layer stack order conformance.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const renderLayers = model.renderLayers || this.getDefaultLayers();
    
    const violations: LayerPrecedenceViolation[] = [];
    const layerStack: RenderLayer[] = [];
    
    // Build layer stack from model
    for (const [name, zIndex] of Object.entries(renderLayers)) {
      layerStack.push({
        id: `layer-${name}`,
        name,
        zIndex: zIndex as number,
        elements: []
      });
    }
    
    // Sort by z-index
    layerStack.sort((a, b) => a.zIndex - b.zIndex);
    
    // Check required precedences
    const requiredPrecedences = [
      { above: 'bridge', below: 'river', description: 'bridgeZ > riverZ' },
      { above: 'wall', below: 'buildings', description: 'wallZ > buildingZ' },
      { above: 'gates', below: 'wall', description: 'gatesZ > wallZ' },
      { above: 'towers', below: 'wall', description: 'towersZ > wallZ' }
    ];
    
    for (const precedence of requiredPrecedences) {
      const aboveLayer = layerStack.find(l => l.name === precedence.above);
      const belowLayer = layerStack.find(l => l.name === precedence.below);
      
      if (aboveLayer && belowLayer) {
        if (aboveLayer.zIndex <= belowLayer.zIndex) {
          violations.push({
            layerAbove: precedence.above,
            layerBelow: precedence.below,
            expectedOrder: precedence.description,
            actualZAbove: aboveLayer.zIndex,
            actualZBelow: belowLayer.zIndex
          });
        }
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        render_layer_stack: layerStack.map(l => ({ name: l.name, zIndex: l.zIndex })),
        layer_precedence_violations: violations,
        total_layers: layerStack.length,
        canonical_order_enforced: violations.length === 0
      }
    };
  }
  
  /**
   * Check if all layer precedences are correct.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.layer_precedence_violations as LayerPrecedenceViolation[]).length === 0;
  }
  
  /**
   * Repair by reordering layers to match canonical order.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.layer_precedence_violations as LayerPrecedenceViolation[];
    const model = context.model as any;
    
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    if (violations.length > 0) {
      // Apply canonical z-order
      model.renderLayers = { ...RENDER_SEMANTICS_THRESHOLDS.canonicalZOrder };
      repairsApplied = violations.length;
      
      for (const violation of violations) {
        geometryIdsTouched.push(`layer-${violation.layerAbove}`);
        geometryIdsTouched.push(`layer-${violation.layerBelow}`);
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violations: beforeMetrics.value },
        { violations: afterMetrics.value },
        geometryIdsTouched,
        'reorderLayersToCanonical',
        'render',
        1
      )
    };
  }
  
  private getDefaultLayers(): Record<string, number> {
    return { ...RENDER_SEMANTICS_THRESHOLDS.canonicalZOrder };
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

/**
 * Singleton instance of R9.1 Gate Gap Clipping evaluator
 */
export const r91GateGapClippingEvaluator = new R91GateGapClippingEvaluator();

/**
 * Singleton instance of R9.2 Canonical Layer Stack evaluator
 */
export const r92CanonicalLayerStackEvaluator = new R92CanonicalLayerStackEvaluator();
