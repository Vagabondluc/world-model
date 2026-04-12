// @ts-nocheck
/**
 * C3: Offscreen Route Minimum Evaluator (CRC-A6-031)
 * 
 * Invariant: Minimum 2 offscreen routes
 * Routes start at gates
 * No extra wall crossings
 * 
 * Measure: Count offscreen routes
 * Check: Count >= 2, all start at gates
 * Repair: Add routes from gates
 * 
 * Evidence:
 * - external_route_count: Total external routes
 * - offscreen_route_count: Routes that extend offscreen
 * - external_route_gate_connected_ratio: Ratio of gate-connected routes
 * - routes_added: Array of route IDs added during repair
 * 
 * @module domain/invariants/evaluators/c3-externalRoutes
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

/**
 * Represents an external route.
 */
export interface ExternalRoute {
  id: string;
  gateId: string;
  path: { x: number; y: number }[];
  length: number;
  connectedToNetwork: boolean;
}

/**
 * C3 Offscreen Route Minimum Evaluator
 * Ensures minimum offscreen routes exist and start at gates.
 */
export class C3ExternalRoutesEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-031';
  readonly name = 'Offscreen Route Minimum';
  
  private readonly MIN_ROUTES = 2;
  private readonly MIN_ROUTE_LENGTH = 0.15;
  
  /**
   * Measure external routes in the current model.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    
    const gates = model.gates || [];
    const externalRoutes = model.externalRoutes || [];
    const walls = model.walls || [];
    
    // Count routes that start at gates
    const gateIds = new Set(gates.map((g: any) => g.id));
    let gateConnectedCount = 0;
    let offscreenCount = 0;
    
    for (const route of externalRoutes) {
      // Check if route starts at a gate
      if (route.gateId && gateIds.has(route.gateId)) {
        gateConnectedCount++;
      }
      
      // Check if route extends offscreen (beyond boundary)
      if (this.extendsOffscreen(route, context.size)) {
        offscreenCount++;
      }
    }
    
    const totalRoutes = externalRoutes.length;
    const ratio = totalRoutes > 0 ? gateConnectedCount / totalRoutes : 0;
    
    return {
      value: offscreenCount,
      evidence: {
        external_route_count: totalRoutes,
        offscreen_route_count: offscreenCount,
        external_route_gate_connected_ratio: ratio,
        routes_added: [] as string[],
        gates_total: gates.length,
        gates_without_routes: this.findGatesWithoutRoutes(gates, externalRoutes)
      }
    };
  }
  
  /**
   * Check if minimum routes exist and start at gates.
   */
  check(metrics: InvariantMetrics): boolean {
    const offscreenCount = metrics.evidence.offscreen_route_count as number;
    const ratio = metrics.evidence.external_route_gate_connected_ratio as number;
    
    return offscreenCount >= this.MIN_ROUTES && ratio === 1;
  }
  
  /**
   * Repair by adding routes from gates without routes.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const gatesWithoutRoutes = beforeMetrics.evidence.gates_without_routes as any[];
    
    const routesAdded: string[] = [];
    const geometryIdsTouched: string[] = [];
    
    const model = context.model as any;
    
    // Ensure external routes array exists
    if (!model.externalRoutes) {
      model.externalRoutes = [];
    }
    
    for (const gate of gatesWithoutRoutes) {
      // Create a route from this gate
      const route = this.createRouteFromGate(gate, context);
      model.externalRoutes.push(route);
      routesAdded.push(route.id);
      geometryIdsTouched.push(route.id);
    }
    
    // If we still don't have enough routes, add more from existing gates
    let currentCount = beforeMetrics.evidence.offscreen_route_count as number;
    const gates = model.gates || [];
    
    while (currentCount < this.MIN_ROUTES && gates.length > 0) {
      // Pick a gate to add another route from
      const gate = gates[currentCount % gates.length];
      const route = this.createRouteFromGate(gate, context);
      model.externalRoutes.push(route);
      routesAdded.push(route.id);
      geometryIdsTouched.push(route.id);
      currentCount++;
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied: routesAdded.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        {
          offscreen_route_count: beforeMetrics.evidence.offscreen_route_count as number,
          external_route_gate_connected_ratio: beforeMetrics.evidence.external_route_gate_connected_ratio as number
        },
        {
          offscreen_route_count: afterMetrics.evidence.offscreen_route_count as number,
          external_route_gate_connected_ratio: afterMetrics.evidence.external_route_gate_connected_ratio as number
        },
        geometryIdsTouched,
        'C3ExternalRoutesEvaluator.repair',
        context.stage,
        context.attempt
      )
    };
  }
  
  /**
   * Find gates that don't have associated external routes.
   */
  private findGatesWithoutRoutes(gates: any[], externalRoutes: any[]): any[] {
    const gatesWithRoutes = new Set(
      externalRoutes.map(r => r.gateId).filter(id => id)
    );
    
    return gates.filter(g => !gatesWithRoutes.has(g.id));
  }
  
  /**
   * Check if a route extends offscreen.
   */
  private extendsOffscreen(route: ExternalRoute, size: number): boolean {
    if (!route.path || route.path.length === 0) return false;
    
    const boundary = size / 2;
    
    for (const point of route.path) {
      if (
        point.x < -boundary || point.x > boundary ||
        point.y < -boundary || point.y > boundary
      ) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Create an external route from a gate.
   */
  private createRouteFromGate(gate: any, context: GenerationContext): ExternalRoute {
    const size = context.size;
    const boundary = size / 2;
    
    // Calculate outward direction from city center
    const dx = gate.position.x;
    const dy = gate.position.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    
    // Extend route outward beyond boundary
    const routeLength = this.MIN_ROUTE_LENGTH + context.rng.nextFloat() * 0.2;
    
    const endPoint = {
      x: gate.position.x + (dx / len) * routeLength,
      y: gate.position.y + (dy / len) * routeLength
    };
    
    return {
      id: this.generateId('external-route'),
      gateId: gate.id,
      path: [gate.position, endPoint],
      length: routeLength,
      connectedToNetwork: true
    };
  }
}

/**
 * Singleton instance of the C3 evaluator.
 */
export const c3ExternalRoutesEvaluator = new C3ExternalRoutesEvaluator();
