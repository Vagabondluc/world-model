// @ts-nocheck
import { Point } from '../types';
import { RoadGraph } from './graph';

/**
 * Computes gate-to-core reachability ratio.
 * Returns 1.0 if all gates can reach the core, 0.0 otherwise.
 */
export function computeGateCoreReachability(roads: RoadGraph, gates: Point[], core: Point): number {
  if (gates.length === 0) return 1;
  
  let reachableCount = 0;
  for (const gate of gates) {
    if (hasPathToCore(gate, core, roads)) {
      reachableCount++;
    }
  }
  
  return reachableCount / gates.length;
}

/**
 * Checks if a gate has a path to the core through the road network.
 */
export function hasPathToCore(gate: Point, core: Point, roads: RoadGraph): boolean {
  // Find nearest road node to gate
  const gateNode = findNearestNode(gate, roads);
  if (gateNode === null) return false;
  
  // Find nearest road node to core
  const coreNode = findNearestNode(core, roads);
  if (coreNode === null) return false;
  
  // Check if there's a path between them using BFS
  return hasPath(gateNode, coreNode, roads);
}

/**
 * Finds the nearest road node to a point.
 */
function findNearestNode(point: Point, roads: RoadGraph): string | null {
  let nearestId: string | null = null;
  let nearestDist = Infinity;
  
  for (const [id, node] of roads.nodes) {
    const d = Math.hypot(node.point.x - point.x, node.point.y - point.y);
    if (d < nearestDist) {
      nearestDist = d;
      nearestId = id;
    }
  }
  
  // Only return if reasonably close
  return nearestDist < 0.2 ? nearestId : null;
}

/**
 * Checks if there's a path between two nodes using BFS.
 */
function hasPath(startId: string, endId: string, roads: RoadGraph): boolean {
  if (startId === endId) return true;
  
  // Build adjacency list from edges
  const adjacency = new Map<string, string[]>();
  for (const edge of roads.edges) {
    if (!adjacency.has(edge.u)) adjacency.set(edge.u, []);
    if (!adjacency.has(edge.v)) adjacency.set(edge.v, []);
    adjacency.get(edge.u)!.push(edge.v);
    adjacency.get(edge.v)!.push(edge.u);
  }
  
  // BFS
  const visited = new Set<string>();
  const queue = [startId];
  visited.add(startId);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adjacency.get(current) || [];
    
    for (const neighbor of neighbors) {
      if (neighbor === endId) return true;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return false;
}
