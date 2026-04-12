// @ts-nocheck
/**
 * G6: Connectivity Robustness Evaluators
 * 
 * Has evaluators for connectivity invariants:
 * - G6.1: Largest Component Ratio (CRC-A6-101) - Largest component ratio ≥ threshold
 * - G6.2: Bridge Connectivity Contribution (CRC-A6-102) - Bridges reduce fragmentation
 * - G6.3: Meaningless Loops (CRC-A6-103) - No meaningless loops
 * 
 * @module domain/invariants/evaluators/g6-connectivity
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Graph node for connectivity analysis
 */
export interface GraphNode {
  id: string;
  position: { x: number; y: number };
  edges: string[]; // Connected node IDs
}

/**
 * Connected component information
 */
export interface ConnectedComponent {
  id: string;
  nodeIds: string[];
  size: number;
}

/**
 * Connectivity repair action
 */
export interface ConnectivityRepair {
  type: 'add_road' | 'add_bridge';
  fromNodeId: string;
  toNodeId: string;
  roadId?: string;
}

/**
 * Meaningless loop information
 */
export interface MeaninglessLoop {
  id: string;
  nodeIds: string[];
  roadIds: string[];
  reason: string;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for connectivity invariants
 */
export const CONNECTIVITY_THRESHOLDS = {
  // G6.1: Smallest largest component ratio
  largestComponentRatio: 0.8,
  
  // G6.2: Expected bridge connectivity improvement
  bridgeConnectivityDelta: 1
};

// ============================================================================
// G6.1: Largest Component Ratio Evaluator (CRC-A6-101)
// ============================================================================

/**
 * G6.1 Largest Component Ratio Evaluator
 * Ensures the road network is well-connected.
 */
export class G61LargestComponentEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-101';
  readonly name = 'Largest Component Ratio';
  
  /**
   * Measure connected components in the road network.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const roads = model.roads || [];
    const bridges = model.bridges || [];
    
    // Build graph from roads and bridges
    const graph = this.buildGraph(roads, bridges);
    
    // Find connected components
    const components = this.findConnectedComponents(graph);
    
    // Calculate largest component ratio
    const totalNodes = graph.size;
    const largestComponentSize = components.length > 0 
      ? Math.max(...components.map(c => c.size))
      : 0;
    const ratio = totalNodes > 0 ? largestComponentSize / totalNodes : 1;
    
    // Identify connectivity repairs needed
    const connectivityRepairs: ConnectivityRepair[] = [];
    if (ratio < CONNECTIVITY_THRESHOLDS.largestComponentRatio && components.length > 1) {
      // Sort components by size
      const sortedComponents = [...components].sort((a, b) => b.size - a.size);
      
      // Find connections between largest and other components
      for (let i = 1; i < sortedComponents.length; i++) {
        const repair = this.findConnectionPath(
          sortedComponents[0],
          sortedComponents[i],
          graph
        );
        if (repair) {
          connectivityRepairs.push(repair);
        }
      }
    }
    
    return {
      value: ratio,
      evidence: {
        road_component_count: components.length,
        largest_component_ratio: ratio,
        largest_component_size: largestComponentSize,
        total_nodes: totalNodes,
        connectivity_repairs: connectivityRepairs,
        components: components.map(c => ({
          id: c.id,
          size: c.size,
          nodeIds: c.nodeIds.slice(0, 5) // First 5 nodes only for evidence
        }))
      }
    };
  }
  
  /**
   * Check if largest component ratio meets threshold.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.value >= CONNECTIVITY_THRESHOLDS.largestComponentRatio;
  }
  
  /**
   * Repair by connecting components with new roads.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const repairs = beforeMetrics.evidence.connectivity_repairs as ConnectivityRepair[];
    
    const model = context.model as any;
    const roads = model.roads || [];
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    for (const repair of repairs) {
      // Create new road connecting components
      const newRoad = {
        id: this.generateId('road'),
        path: [
          this.getNodePosition(repair.fromNodeId, model),
          this.getNodePosition(repair.toNodeId, model)
        ],
        roadClass: 'local'
      };
      
      roads.push(newRoad);
      geometryIdsTouched.push(newRoad.id);
      repairsApplied++;
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: afterMetrics.value >= CONNECTIVITY_THRESHOLDS.largestComponentRatio,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        {
          component_count: beforeMetrics.evidence.road_component_count as number,
          ratio: beforeMetrics.value
        },
        {
          component_count: afterMetrics.evidence.road_component_count as number,
          ratio: afterMetrics.value
        },
        geometryIdsTouched,
        'connect_components',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Build a graph from roads and bridges.
   */
  private buildGraph(roads: any[], bridges: any[]): Map<string, GraphNode> {
    const graph = new Map<string, GraphNode>();
    
    // Add road segments
    for (const road of roads) {
      const path = road.path || [];
      
      for (let i = 0; i < path.length; i++) {
        const point = path[i];
        const nodeId = this.pointToNodeId(point);
        
        if (!graph.has(nodeId)) {
          graph.set(nodeId, {
            id: nodeId,
            position: point,
            edges: []
          });
        }
        
        // Connect to previous point
        if (i > 0) {
          const prevNodeId = this.pointToNodeId(path[i - 1]);
          this.addEdge(graph, nodeId, prevNodeId);
        }
      }
    }
    
    // Add bridge connections
    for (const bridge of bridges) {
      const startNodeId = this.pointToNodeId(bridge.startPoint);
      const endNodeId = this.pointToNodeId(bridge.endPoint);
      
      // Ensure nodes exist
      if (!graph.has(startNodeId)) {
        graph.set(startNodeId, {
          id: startNodeId,
          position: bridge.startPoint,
          edges: []
        });
      }
      if (!graph.has(endNodeId)) {
        graph.set(endNodeId, {
          id: endNodeId,
          position: bridge.endPoint,
          edges: []
        });
      }
      
      this.addEdge(graph, startNodeId, endNodeId);
    }
    
    return graph;
  }
  
  /**
   * Convert a point to a node ID.
   */
  private pointToNodeId(point: { x: number; y: number }): string {
    return `${point.x.toFixed(4)},${point.y.toFixed(4)}`;
  }
  
  /**
   * Add an edge between two nodes.
   */
  private addEdge(graph: Map<string, GraphNode>, nodeId1: string, nodeId2: string): void {
    const node1 = graph.get(nodeId1);
    const node2 = graph.get(nodeId2);
    
    if (node1 && !node1.edges.includes(nodeId2)) {
      node1.edges.push(nodeId2);
    }
    if (node2 && !node2.edges.includes(nodeId1)) {
      node2.edges.push(nodeId1);
    }
  }
  
  /**
   * Find connected components using BFS.
   */
  private findConnectedComponents(graph: Map<string, GraphNode>): ConnectedComponent[] {
    const visited = new Set<string>();
    const components: ConnectedComponent[] = [];
    
    for (const [nodeId, node] of graph) {
      if (visited.has(nodeId)) continue;
      
      // BFS to find component
      const component: ConnectedComponent = {
        id: `component-${components.length}`,
        nodeIds: [],
        size: 0
      };
      
      const queue: string[] = [nodeId];
      
      while (queue.length > 0) {
        const currentId = queue.shift()!;
        
        if (visited.has(currentId)) continue;
        visited.add(currentId);
        
        component.nodeIds.push(currentId);
        component.size++;
        
        const currentNode = graph.get(currentId);
        if (currentNode) {
          for (const edgeId of currentNode.edges) {
            if (!visited.has(edgeId)) {
              queue.push(edgeId);
            }
          }
        }
      }
      
      components.push(component);
    }
    
    return components;
  }
  
  /**
   * Find a potential connection path between two components.
   */
  private findConnectionPath(
    component1: ConnectedComponent,
    component2: ConnectedComponent,
    graph: Map<string, GraphNode>
  ): ConnectivityRepair | null {
    // Find closest pair of nodes between components
    let minDist = Infinity;
    let closestPair: { node1: string; node2: string } | null = null;
    
    for (const nodeId1 of component1.nodeIds) {
      const node1 = graph.get(nodeId1);
      if (!node1) continue;
      
      for (const nodeId2 of component2.nodeIds) {
        const node2 = graph.get(nodeId2);
        if (!node2) continue;
        
        const dist = Math.sqrt(
          Math.pow(node1.position.x - node2.position.x, 2) +
          Math.pow(node1.position.y - node2.position.y, 2)
        );
        
        if (dist < minDist) {
          minDist = dist;
          closestPair = { node1: nodeId1, node2: nodeId2 };
        }
      }
    }
    
    if (closestPair) {
      return {
        type: 'add_road',
        fromNodeId: closestPair.node1,
        toNodeId: closestPair.node2
      };
    }
    
    return null;
  }
  
  /**
   * Get node position from model.
   */
  private getNodePosition(nodeId: string, model: any): { x: number; y: number } {
    const [x, y] = nodeId.split(',').map(parseFloat);
    return { x, y };
  }
}

// ============================================================================
// G6.2: Bridge Connectivity Contribution Evaluator (CRC-A6-102)
// ============================================================================

/**
 * G6.2 Bridge Connectivity Contribution Evaluator
 * Measures how much bridges improve connectivity.
 */
export class G62BridgeConnectivityEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-102';
  readonly name = 'Bridge Connectivity Contribution';
  
  /**
   * Measure bridge connectivity contribution.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const roads = model.roads || [];
    const bridges = model.bridges || [];
    
    // Count components without bridges
    const graphWithoutBridges = this.buildGraph(roads, []);
    const componentsBefore = this.findConnectedComponents(graphWithoutBridges).length;
    
    // Count components with bridges
    const graphWithBridges = this.buildGraph(roads, bridges);
    const componentsAfter = this.findConnectedComponents(graphWithBridges).length;
    
    // Delta (positive means bridges improved connectivity)
    const delta = componentsBefore - componentsAfter;
    
    return {
      value: delta,
      evidence: {
        components_before_bridges: componentsBefore,
        components_after_bridges: componentsAfter,
        bridge_connectivity_delta: delta,
        bridge_count: bridges.length,
        bridges_effective: delta > 0
      }
    };
  }
  
  /**
   * Check if bridges contribute to connectivity.
   */
  check(metrics: InvariantMetrics): boolean {
    // Informational - bridges should not harm connectivity
    return (metrics.evidence.bridge_connectivity_delta as number) >= 0;
  }
  
  /**
   * No repair - this is informational.
   */
  repair(context: GenerationContext): RepairResult {
    return {
      success: true,
      repairsApplied: 0,
      geometryIdsTouched: [],
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { delta: 0 },
        { delta: 0 },
        [],
        'no_repair_needed',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Build a graph from roads and bridges.
   */
  private buildGraph(roads: any[], bridges: any[]): Map<string, GraphNode> {
    const graph = new Map<string, GraphNode>();
    
    // Add road segments
    for (const road of roads) {
      const path = road.path || [];
      
      for (let i = 0; i < path.length; i++) {
        const point = path[i];
        const nodeId = `${point.x.toFixed(4)},${point.y.toFixed(4)}`;
        
        if (!graph.has(nodeId)) {
          graph.set(nodeId, {
            id: nodeId,
            position: point,
            edges: []
          });
        }
        
        if (i > 0) {
          const prevNodeId = `${path[i - 1].x.toFixed(4)},${path[i - 1].y.toFixed(4)}`;
          this.addEdge(graph, nodeId, prevNodeId);
        }
      }
    }
    
    // Add bridge connections
    for (const bridge of bridges) {
      const startNodeId = `${bridge.startPoint.x.toFixed(4)},${bridge.startPoint.y.toFixed(4)}`;
      const endNodeId = `${bridge.endPoint.x.toFixed(4)},${bridge.endPoint.y.toFixed(4)}`;
      
      if (!graph.has(startNodeId)) {
        graph.set(startNodeId, {
          id: startNodeId,
          position: bridge.startPoint,
          edges: []
        });
      }
      if (!graph.has(endNodeId)) {
        graph.set(endNodeId, {
          id: endNodeId,
          position: bridge.endPoint,
          edges: []
        });
      }
      
      this.addEdge(graph, startNodeId, endNodeId);
    }
    
    return graph;
  }
  
  /**
   * Add an edge between two nodes.
   */
  private addEdge(graph: Map<string, GraphNode>, nodeId1: string, nodeId2: string): void {
    const node1 = graph.get(nodeId1);
    const node2 = graph.get(nodeId2);
    
    if (node1 && !node1.edges.includes(nodeId2)) {
      node1.edges.push(nodeId2);
    }
    if (node2 && !node2.edges.includes(nodeId1)) {
      node2.edges.push(nodeId1);
    }
  }
  
  /**
   * Find connected components using BFS.
   */
  private findConnectedComponents(graph: Map<string, GraphNode>): ConnectedComponent[] {
    const visited = new Set<string>();
    const components: ConnectedComponent[] = [];
    
    for (const [nodeId, node] of graph) {
      if (visited.has(nodeId)) continue;
      
      const component: ConnectedComponent = {
        id: `component-${components.length}`,
        nodeIds: [],
        size: 0
      };
      
      const queue: string[] = [nodeId];
      
      while (queue.length > 0) {
        const currentId = queue.shift()!;
        
        if (visited.has(currentId)) continue;
        visited.add(currentId);
        
        component.nodeIds.push(currentId);
        component.size++;
        
        const currentNode = graph.get(currentId);
        if (currentNode) {
          for (const edgeId of currentNode.edges) {
            if (!visited.has(edgeId)) {
              queue.push(edgeId);
            }
          }
        }
      }
      
      components.push(component);
    }
    
    return components;
  }
}

// ============================================================================
// G6.3: Meaningless Loops Evaluator (CRC-A6-103)
// ============================================================================

/**
 * G6.3 Meaningless Loops Evaluator
 * Detects and removes loops with no purpose.
 */
export class G63MeaninglessLoopsEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-103';
  readonly name = 'Meaningless Loops';
  
  /**
   * Measure meaningless loops in the road network.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const roads = model.roads || [];
    
    // Build graph
    const graph = this.buildGraph(roads);
    
    // Find all cycles
    const cycles = this.findAllCycles(graph);
    
    // Identify meaningless loops
    const meaninglessLoops: MeaninglessLoop[] = [];
    
    for (const cycle of cycles) {
      const reason = this.isLoopMeaningless(cycle, graph, model);
      if (reason) {
        meaninglessLoops.push({
          id: `loop-${meaninglessLoops.length}`,
          nodeIds: cycle,
          roadIds: this.findRoadsForCycle(cycle, roads),
          reason
        });
      }
    }
    
    return {
      value: meaninglessLoops.length,
      evidence: {
        meaningless_loops: meaninglessLoops,
        loops_removed: [],
        total_cycles_found: cycles.length
      }
    };
  }
  
  /**
   * Check if there are no meaningless loops.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.meaningless_loops as MeaninglessLoop[]).length === 0;
  }
  
  /**
   * Repair by pruning meaningless loops.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const loops = beforeMetrics.evidence.meaningless_loops as MeaninglessLoop[];
    
    const model = context.model as any;
    const roads = model.roads || [];
    const geometryIdsTouched: string[] = [];
    const loopsRemoved: string[] = [];
    let repairsApplied = 0;
    
    for (const loop of loops) {
      // Remove roads that form the loop
      const roadsToRemove = new Set(loop.roadIds);
      
      for (let i = roads.length - 1; i >= 0; i--) {
        if (roadsToRemove.has(roads[i].id)) {
          geometryIdsTouched.push(roads[i].id);
          roads.splice(i, 1);
          repairsApplied++;
        }
      }
      
      loopsRemoved.push(loop.id);
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: (afterMetrics.evidence.meaningless_loops as MeaninglessLoop[]).length === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { loop_count: beforeMetrics.value },
        { loop_count: afterMetrics.value },
        geometryIdsTouched,
        'prune_meaningless_loops',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Build a graph from roads.
   */
  private buildGraph(roads: any[]): Map<string, GraphNode> {
    const graph = new Map<string, GraphNode>();
    
    for (const road of roads) {
      const path = road.path || [];
      
      for (let i = 0; i < path.length; i++) {
        const point = path[i];
        const nodeId = `${point.x.toFixed(4)},${point.y.toFixed(4)}`;
        
        if (!graph.has(nodeId)) {
          graph.set(nodeId, {
            id: nodeId,
            position: point,
            edges: []
          });
        }
        
        if (i > 0) {
          const prevNodeId = `${path[i - 1].x.toFixed(4)},${path[i - 1].y.toFixed(4)}`;
          this.addEdge(graph, nodeId, prevNodeId);
        }
      }
    }
    
    return graph;
  }
  
  /**
   * Add an edge between two nodes.
   */
  private addEdge(graph: Map<string, GraphNode>, nodeId1: string, nodeId2: string): void {
    const node1 = graph.get(nodeId1);
    const node2 = graph.get(nodeId2);
    
    if (node1 && !node1.edges.includes(nodeId2)) {
      node1.edges.push(nodeId2);
    }
    if (node2 && !node2.edges.includes(nodeId1)) {
      node2.edges.push(nodeId1);
    }
  }
  
  /**
   * Find all cycles in the graph using DFS.
   */
  private findAllCycles(graph: Map<string, GraphNode>): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    
    for (const [startNodeId] of graph) {
      if (visited.has(startNodeId)) continue;
      
      this.findCyclesFromNode(
        startNodeId,
        null,
        [startNodeId],
        new Set([startNodeId]),
        graph,
        cycles,
        visited
      );
    }
    
    return cycles;
  }
  
  /**
   * Find cycles starting from a node.
   */
  private findCyclesFromNode(
    currentNode: string,
    parentNode: string | null,
    path: string[],
    pathSet: Set<string>,
    graph: Map<string, GraphNode>,
    cycles: string[][],
    globalVisited: Set<string>
  ): void {
    const node = graph.get(currentNode);
    if (!node) return;
    
    for (const neighborId of node.edges) {
      if (neighborId === parentNode) continue;
      
      if (pathSet.has(neighborId)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighborId);
        const cycle = path.slice(cycleStart);
        
        // Only add if this is a new cycle (avoid duplicates)
        if (cycle.length >= 3 && !this.cycleExists(cycle, cycles)) {
          cycles.push(cycle);
        }
      } else {
        path.push(neighborId);
        pathSet.add(neighborId);
        
        this.findCyclesFromNode(
          neighborId,
          currentNode,
          path,
          pathSet,
          graph,
          cycles,
          globalVisited
        );
        
        path.pop();
        pathSet.delete(neighborId);
      }
    }
    
    globalVisited.add(currentNode);
  }
  
  /**
   * Check if a cycle already exists in the list.
   */
  private cycleExists(cycle: string[], existingCycles: string[][]): boolean {
    const normalized = this.normalizeCycle(cycle);
    
    for (const existing of existingCycles) {
      const existingNormalized = this.normalizeCycle(existing);
      if (normalized === existingNormalized) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Normalize a cycle for comparison.
   */
  private normalizeCycle(cycle: string[]): string {
    if (cycle.length === 0) return '';
    
    // Find smallest element
    const minIndex = cycle.reduce((minIdx, val, idx, arr) => 
      val < arr[minIdx] ? idx : minIdx
    , 0);
    
    // Rotate to start from smallest
    const rotated = [...cycle.slice(minIndex), ...cycle.slice(0, minIndex)];
    return rotated.join('|');
  }
  
  /**
   * Determine if a loop is meaningless.
   */
  private isLoopMeaningless(
    cycle: string[],
    graph: Map<string, GraphNode>,
    model: any
  ): string | null {
    // A loop is meaningless if:
    // 1. It's too small (less than 3 nodes)
    if (cycle.length < 3) {
      return 'Loop too small';
    }
    
    // 2. It has no connections to the rest of the network
    let externalConnections = 0;
    for (const nodeId of cycle) {
      const node = graph.get(nodeId);
      if (node) {
        for (const edgeId of node.edges) {
          if (!cycle.includes(edgeId)) {
            externalConnections++;
          }
        }
      }
    }
    
    if (externalConnections === 0) {
      return 'Isolated loop with no external connections';
    }
    
    // 3. It's a dead-end loop (only one connection point)
    if (externalConnections === 1) {
      return 'Dead-end loop with only one connection';
    }
    
    return null;
  }
  
  /**
   * Find roads that form a cycle.
   */
  private findRoadsForCycle(cycle: string[], roads: any[]): string[] {
    const roadIds: string[] = [];
    const cycleSet = new Set(cycle);
    
    for (const road of roads) {
      const path = road.path || [];
      
      // Check if this road connects two cycle nodes
      for (let i = 0; i < path.length - 1; i++) {
        const nodeId1 = `${path[i].x.toFixed(4)},${path[i].y.toFixed(4)}`;
        const nodeId2 = `${path[i + 1].x.toFixed(4)},${path[i + 1].y.toFixed(4)}`;
        
        if (cycleSet.has(nodeId1) && cycleSet.has(nodeId2)) {
          roadIds.push(road.id);
          break;
        }
      }
    }
    
    return roadIds;
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const g61LargestComponentEvaluator = new G61LargestComponentEvaluator();
export const g62BridgeConnectivityEvaluator = new G62BridgeConnectivityEvaluator();
export const g63MeaninglessLoopsEvaluator = new G63MeaninglessLoopsEvaluator();
