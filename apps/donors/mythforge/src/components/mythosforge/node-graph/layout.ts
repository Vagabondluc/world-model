// =============================================================================
// MythosForge - Node Graph Layout: Force-Directed with Relationship Awareness
// =============================================================================

import type { Entity, Relationship } from '@/lib/types';

/** Relationship weights — stronger = nodes pulled closer together */
const RELATIONSHIP_STRENGTH: Record<string, number> = {
  contains: 0.035,
  parent_of: 0.035,
  located_in: 0.03,
  part_of: 0.03,
  member_of: 0.025,
  ruler_of: 0.025,
  owns: 0.02,
  allied_with: 0.02,
  knows_about: 0.015,
  created_by: 0.015,
  student_of: 0.015,
  guardian_of: 0.015,
  derived_from: 0.012,
  enemy_of: 0.018,
  related_to: 0.01,
};

const DEFAULT_STRENGTH = 0.012;
const REPULSION = 6000;
const GRAVITY = 0.01;
const IDEAL_EDGE_LENGTH = 180;
const ITERATIONS = 120;
const COOLING_START = 1.0;
const COOLING_END = 0.01;

interface ForceNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface ForceEdge {
  source: string;
  target: string;
  strength: number;
  idealLength: number;
}

/**
 * Compute force-directed graph positions.
 * Uses Fruchterman-Reingold with relationship-weighted springs.
 * Deterministic (no random seed) — same data always produces the same layout.
 */
export function computeNodePositions(
  entities: Entity[],
  relationships: Relationship[],
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  if (entities.length === 0) return positions;
  if (entities.length === 1) {
    positions.set(entities[0].id, { x: 500, y: 400 });
    return positions;
  }

  const entityIds = new Set(entities.map((e) => e.id));
  const entityIndex = new Map(entities.map((e, i) => [e.id, i]));

  // Build adjacency list (only for entities in the current view)
  const edges: ForceEdge[] = [];
  const adjacencyCount = new Map<string, number>();

  for (const rel of relationships) {
    if (!entityIds.has(rel.parent_id) || !entityIds.has(rel.child_id)) continue;
    const strength = RELATIONSHIP_STRENGTH[rel.relationship_type] ?? DEFAULT_STRENGTH;
    // Stronger relationships → shorter ideal length
    const idealLength = IDEAL_EDGE_LENGTH * (1.1 - Math.min(strength / 0.04, 0.7));
    edges.push({ source: rel.parent_id, target: rel.child_id, strength, idealLength });

    adjacencyCount.set(rel.parent_id, (adjacencyCount.get(rel.parent_id) ?? 0) + 1);
    adjacencyCount.set(rel.child_id, (adjacencyCount.get(rel.child_id) ?? 0) + 1);
  }

  // Initialize nodes in a circle (stable starting point)
  const radius = Math.max(250, entities.length * 40);
  const cx = 500;
  const cy = 400;
  const nodes: ForceNode[] = entities.map((entity, index) => {
    const angle = (2 * Math.PI * index) / entities.length - Math.PI / 2;
    return {
      id: entity.id,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      vx: 0,
      vy: 0,
    };
  });

  // Build edge lookup for O(1) access
  const edgeLookup = new Map<string, ForceEdge[]>();
  for (const edge of edges) {
    const sourceEdges = edgeLookup.get(edge.source) ?? [];
    sourceEdges.push(edge);
    edgeLookup.set(edge.source, sourceEdges);
  }

  const n = nodes.length;
  const area = n * n * 100;

  // Simulated annealing
  for (let iteration = 0; iteration < ITERATIONS; iteration++) {
    const t = COOLING_START - (iteration / ITERATIONS) * (COOLING_START - COOLING_END);
    const maxDisplacement = Math.sqrt(area) * t * 0.1;

    // Repulsion (all pairs)
    for (let i = 0; i < n; i++) {
      let dx = 0;
      let dy = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const ddx = nodes[i].x - nodes[j].x;
        const ddy = nodes[i].y - nodes[j].y;
        const distSq = ddx * ddx + ddy * ddy;
        const dist = Math.sqrt(Math.max(distSq, 1));
        const force = REPULSION / distSq;
        dx += (ddx / dist) * force;
        dy += (ddy / dist) * force;
      }
      nodes[i].vx += dx;
      nodes[i].vy += dy;
    }

    // Attraction (connected pairs)
    for (const edge of edges) {
      const si = entityIndex.get(edge.source);
      const ti = entityIndex.get(edge.target);
      if (si === undefined || ti === undefined) continue;

      const ddx = nodes[ti].x - nodes[si].x;
      const ddy = nodes[ti].y - nodes[si].y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      const force = edge.strength * (dist - edge.idealLength);
      const fx = (ddx / Math.max(dist, 1)) * force;
      const fy = (ddy / Math.max(dist, 1)) * force;

      nodes[si].vx += fx;
      nodes[si].vy += fy;
      nodes[ti].vx -= fx;
      nodes[ti].vy -= fy;
    }

    // Gravity (pull toward center)
    for (const node of nodes) {
      const ddx = cx - node.x;
      const ddy = cy - node.y;
      node.vx += ddx * GRAVITY;
      node.vy += ddy * GRAVITY;
    }

    // Apply velocities with cooling + displacement cap
    for (const node of nodes) {
      const dist = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (dist > 0) {
        const capped = Math.min(dist, maxDisplacement);
        node.x += (node.vx / dist) * capped;
        node.y += (node.vy / dist) * capped;
      }
      node.vx = 0;
      node.vy = 0;
    }
  }

  // Map to output
  for (const node of nodes) {
    positions.set(node.id, { x: Math.round(node.x), y: Math.round(node.y) });
  }

  return positions;
}
