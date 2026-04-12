// @ts-nocheck
import { Point, dist, lerp } from '../types';
import { PRNG } from '../seed/prng';
import { NoiseField } from '../terrain/fields';
import { Scaffold } from '../scaffold/tessellate';
import { River } from '../terrain/river';
import { GateResolver, Wall, Road } from '../boundary/gateResolver';

export type RoadKind = 'trunk' | 'secondary' | 'local';

export interface RoadNode {
  id: string;
  point: Point;
}

export interface RoadEdge {
  id: string;
  u: string; // node id
  v: string; // node id
  kind: RoadKind;
}

export class RoadGraph {
  nodes: Map<string, RoadNode> = new Map();
  edges: RoadEdge[] = [];

  addNode(point: Point): string {
    const id = `n-${this.nodes.size}`;
    this.nodes.set(id, { id, point });
    return id;
  }

  addEdge(u: string, v: string, kind: RoadKind): string {
    const id = `e-${this.edges.length}`;
    this.edges.push({ id, u, v, kind });
    return id;
  }

  getNeighbors(nodeId: string): string[] {
    const neighbors: string[] = [];
    for (const edge of this.edges) {
      if (edge.u === nodeId) neighbors.push(edge.v);
      else if (edge.v === nodeId) neighbors.push(edge.u);
    }
    return neighbors;
  }
}

/**
 * Generates a hierarchical road network.
 */
export function generateRoads(
  hub: Point,
  gates: Point[],
  suitability: NoiseField,
  boundary: Point[],
  rng: PRNG,
  walls?: Wall[]
): RoadGraph {
  const graph = new RoadGraph();
  const hubId = graph.addNode(hub);
  
  // Initialize gate resolver if walls are provided
  const gateResolver = walls ? new GateResolver() : null;
  
  // 1. Connect gates to hub (Trunk roads)
  const gateIds: string[] = [];
  for (const gate of gates) {
    const gateId = graph.addNode(gate);
    gateIds.push(gateId);
    
    // Create a few intermediate nodes for a more organic look
    let currentId = hubId;
    const steps = 3;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const p = lerp(hub, gate, t);
      // Jitter
      p.x += (rng.nextFloat() - 0.5) * 0.05;
      p.y += (rng.nextFloat() - 0.5) * 0.05;
      
      const nextId = graph.addNode(p);
      graph.addEdge(currentId, nextId, 'trunk');
      currentId = nextId;
    }
    graph.addEdge(currentId, gateId, 'trunk');
  }

  // 2. Secondary roads (Connect trunks or expand)
  // Simple implementation: connect trunk nodes to each other if close
  const allNodes = Array.from(graph.nodes.values());
  for (let i = 0; i < allNodes.length; i++) {
    for (let j = i + 1; j < allNodes.length; j++) {
      const u = allNodes[i];
      const v = allNodes[j];
      const d = dist(u.point, v.point);
      if (d < 0.15 && rng.bernoulli(0.3)) {
        // Check if edge already exists
        if (!graph.getNeighbors(u.id).includes(v.id)) {
          graph.addEdge(u.id, v.id, 'secondary');
        }
      }
    }
  }

  // 3. Dense inner mesh (secondary + local) to avoid empty walled interior
  const innerNodeIds: string[] = [];
  const rings = [
    { radius: 0.06, count: 10, kind: 'secondary' as const },
    { radius: 0.11, count: 16, kind: 'local' as const },
    { radius: 0.16, count: 22, kind: 'local' as const },
  ];

  for (const ring of rings) {
    const ringIds: string[] = [];
    for (let i = 0; i < ring.count; i++) {
      const t = (i / ring.count) * Math.PI * 2;
      const p = {
        x: hub.x + Math.cos(t) * ring.radius + (rng.nextFloat() - 0.5) * 0.015,
        y: hub.y + Math.sin(t) * ring.radius + (rng.nextFloat() - 0.5) * 0.015,
      };
      const id = graph.addNode(p);
      ringIds.push(id);
      innerNodeIds.push(id);
    }

    for (let i = 0; i < ringIds.length; i++) {
      const a = ringIds[i];
      const b = ringIds[(i + 1) % ringIds.length];
      graph.addEdge(a, b, ring.kind);
      if (rng.bernoulli(0.32)) {
        const c = ringIds[(i + 2) % ringIds.length];
        graph.addEdge(a, c, 'local');
      }
    }

    // spokes from hub
    for (let i = 0; i < ringIds.length; i += 2) {
      graph.addEdge(hubId, ringIds[i], ring.kind === 'secondary' ? 'secondary' : 'local');
    }
  }

  // connect inner mesh to trunk paths
  const trunkNodes = Array.from(graph.nodes.values()).filter((n) => n.id === hubId || graph.getNeighbors(n.id).length >= 2);
  for (const innerId of innerNodeIds) {
    const p = graph.nodes.get(innerId)!.point;
    let best: { id: string; d: number } | null = null;
    for (const n of trunkNodes) {
      if (n.id === innerId) continue;
      const d = dist(p, n.point);
      if (d < 0.12 && (!best || d < best.d)) best = { id: n.id, d };
    }
    if (best && !graph.getNeighbors(innerId).includes(best.id)) {
      graph.addEdge(innerId, best.id, 'secondary');
    }
  }

  // Resolve road-wall intersections through gates if walls are provided
  if (gateResolver && walls) {
    // Convert graph edges to road format for intersection detection
    const roads: Road[] = [];
    for (const edge of graph.edges) {
      const u = graph.nodes.get(edge.u)?.point;
      const v = graph.nodes.get(edge.v)?.point;
      if (u && v) {
        roads.push({
          id: edge.id,
          start: u,
          end: v,
          kind: edge.kind
        });
      }
    }
    
    // Detect and resolve intersections
    const intersections = gateResolver.detectRoadWallIntersections(roads, walls);
    gateResolver.resolveRoadWallIntersections(intersections, roads, walls);
    
    // Update gates array with resolved gates
    const resolvedGates = gateResolver.getGates();
    gates.length = 0;
    gates.push(...resolvedGates.map(g => g.position));
  }
  
  return graph;
}

/**
 * Builds roads by routing gates to core over scaffold adjacency.
 */
export function generateRoadsFromScaffold(
  scaffold: Scaffold,
  innerIds: number[],
  hub: Point,
  gates: Point[],
  rng: PRNG,
  river?: River,
  walls?: Wall[]
): RoadGraph {
  const graph = new RoadGraph();
  const inner = new Set(innerIds);
  const cellById = new Map(scaffold.cells.map((c) => [c.id, c]));
  const centroidCache = new Map<number, Point>();
  const nodeByCell = new Map<number, string>();
  
  // Initialize gate resolver if walls are provided
  const gateResolver = walls ? new GateResolver() : null;

  const centroid = (id: number): Point => {
    const cached = centroidCache.get(id);
    if (cached) return cached;
    const poly = cellById.get(id)?.polygon ?? [];
    let x = 0;
    let y = 0;
    for (const p of poly) {
      x += p.x;
      y += p.y;
    }
    const c = poly.length ? { x: x / poly.length, y: y / poly.length } : { x: 0.5, y: 0.5 };
    centroidCache.set(id, c);
    return c;
  };

  const nearestInner = (p: Point): number => {
    let best = innerIds[0];
    let bestD = dist(centroid(best), p);
    for (let i = 1; i < innerIds.length; i++) {
      const id = innerIds[i];
      const d = dist(centroid(id), p);
      if (d < bestD) {
        best = id;
        bestD = d;
      }
    }
    return best;
  };

  const ensureNode = (cellId: number): string => {
    const existing = nodeByCell.get(cellId);
    if (existing) return existing;
    const p = centroid(cellId);
    const id = graph.addNode({
      x: p.x + (rng.nextFloat() - 0.5) * 0.004,
      y: p.y + (rng.nextFloat() - 0.5) * 0.004,
    });
    nodeByCell.set(cellId, id);
    return id;
  };

  const crossingBudget = {
    secondary: 1,
    local: 0,
  };

  const hubCell = nearestInner(hub);
  ensureNode(hubCell);

  const gateCells = gates.map((g) => nearestInner(g));
  for (let gi = 0; gi < gateCells.length; gi++) {
    const gateCell = gateCells[gi];
    const gatePoint = gates[gi];
    const path = bfsPath(hubCell, gateCell, inner, cellById);
    for (let i = 0; i < path.length - 1; i++) {
      const u = ensureNode(path[i]);
      const v = ensureNode(path[i + 1]);
      if (!graph.getNeighbors(u).includes(v)) graph.addEdge(u, v, 'trunk');
    }

    const gateInnerNode = ensureNode(gateCell);
    const gateNode = graph.addNode(gatePoint);
    if (!graph.getNeighbors(gateInnerNode).includes(gateNode)) {
      graph.addEdge(gateInnerNode, gateNode, 'trunk');
    }

    const out = outwardPoint(gatePoint, hub, 0.08);
    const outerGateNode = graph.addNode(out);
    if (!graph.getNeighbors(gateNode).includes(outerGateNode)) {
      graph.addEdge(gateNode, outerGateNode, 'trunk');
    }
  }

  // Inner mesh connections
  for (const id of inner) {
    const u = ensureNode(id);
    const c = cellById.get(id);
    if (!c) continue;
    for (const n of c.neighbors) {
      if (!inner.has(n)) continue;
      const v = ensureNode(n);
      if (u === v || graph.getNeighbors(u).includes(v)) continue;
      const d = dist(centroid(id), centroid(n));
      const crosses = river ? edgeCrossesRiver(centroid(id), centroid(n), river) : false;
      if (d < 0.07) {
        if (crosses) {
          if (crossingBudget.secondary <= 0) continue;
          crossingBudget.secondary--;
        }
        graph.addEdge(u, v, 'secondary');
      } else if (d < 0.11 && rng.bernoulli(0.42)) {
        if (crosses || crossingBudget.local <= 0) continue;
        crossingBudget.local--;
        graph.addEdge(u, v, 'local');
      }
    }
  }

  // Ensure a single connected component rooted at the hub path.
  const hubNodeId = nodeByCell.get(hubCell);
  if (hubNodeId) {
    let seen = bfsNodes(graph, hubNodeId);
    if (seen.size < graph.nodes.size) {
      const nodeEntries = Array.from(graph.nodes.entries());
      while (seen.size < graph.nodes.size) {
        let bestFrom: string | null = null;
        let bestTo: string | null = null;
        let bestD = Infinity;
        let bestCrossing = false;
        for (const [idA, a] of nodeEntries) {
          if (seen.has(idA)) continue;
          for (const [idB, b] of nodeEntries) {
            if (!seen.has(idB)) continue;
            const d = dist(a.point, b.point);
            const crosses = river ? edgeCrossesRiver(a.point, b.point, river) : false;
            if (crosses && crossingBudget.secondary <= 0) continue;
            if (d < bestD) {
              bestD = d;
              bestFrom = idA;
              bestTo = idB;
              bestCrossing = crosses;
            }
          }
        }
        if (!bestFrom || !bestTo) break;
        if (!graph.getNeighbors(bestFrom).includes(bestTo)) {
          if (bestCrossing) crossingBudget.secondary--;
          graph.addEdge(bestFrom, bestTo, bestD < 0.08 ? 'secondary' : 'local');
        }
        seen = bfsNodes(graph, hubNodeId);
      }
    }
  }

  // Resolve road-wall intersections through gates if walls are provided
  if (gateResolver && walls) {
    // Convert graph edges to road format for intersection detection
    const roads: Road[] = [];
    for (const edge of graph.edges) {
      const u = graph.nodes.get(edge.u)?.point;
      const v = graph.nodes.get(edge.v)?.point;
      if (u && v) {
        roads.push({
          id: edge.id,
          start: u,
          end: v,
          kind: edge.kind
        });
      }
    }
    
    // Detect and resolve intersections
    const intersections = gateResolver.detectRoadWallIntersections(roads, walls);
    gateResolver.resolveRoadWallIntersections(intersections, roads, walls);
    
    // Update gates array with resolved gates
    const resolvedGates = gateResolver.getGates();
    gates.length = 0;
    gates.push(...resolvedGates.map(g => g.position));
  }
  
  return graph;
}

function edgeCrossesRiver(a: Point, b: Point, river: River): boolean {
  if (river.points.length < 2) return false;
  for (let i = 0; i < river.points.length - 1; i++) {
    if (segmentIntersection(a, b, river.points[i], river.points[i + 1])) return true;
  }
  return false;
}

function outwardPoint(gate: Point, hub: Point, length: number): Point {
  const dx = gate.x - hub.x;
  const dy = gate.y - hub.y;
  const m = Math.hypot(dx, dy) || 1;
  return {
    x: gate.x + (dx / m) * length,
    y: gate.y + (dy / m) * length,
  };
}

function segmentIntersection(a: Point, b: Point, c: Point, d: Point): Point | null {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const den = r.x * s.y - r.y * s.x;
  if (Math.abs(den) < 1e-12) return null;
  const qp = { x: c.x - a.x, y: c.y - a.y };
  const t = (qp.x * s.y - qp.y * s.x) / den;
  const u = (qp.x * r.y - qp.y * r.x) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: a.x + r.x * t, y: a.y + r.y * t };
}

function bfsNodes(graph: RoadGraph, start: string): Set<string> {
  const seen = new Set<string>([start]);
  const q = [start];
  while (q.length) {
    const u = q.shift()!;
    for (const v of graph.getNeighbors(u)) {
      if (seen.has(v)) continue;
      seen.add(v);
      q.push(v);
    }
  }
  return seen;
}

function bfsPath(start: number, goal: number, allowed: Set<number>, byId: Map<number, any>): number[] {
  const q = [start];
  const parent = new Map<number, number | null>([[start, null]]);
  while (q.length) {
    const u = q.shift()!;
    if (u === goal) break;
    const neighbors: number[] = (byId.get(u)?.neighbors ?? []).filter((n: number) => allowed.has(n));
    for (const v of neighbors) {
      if (parent.has(v)) continue;
      parent.set(v, u);
      q.push(v);
    }
  }
  if (!parent.has(goal)) return [start, goal];
  const path: number[] = [];
  let cur: number | null = goal;
  while (cur !== null) {
    path.push(cur);
    cur = parent.get(cur) ?? null;
  }
  path.reverse();
  return path;
}
