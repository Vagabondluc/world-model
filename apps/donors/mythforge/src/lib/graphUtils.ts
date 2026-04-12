/**
 * Graph utility functions for MythosForge.
 * Pure functions for traversing the entity-relationship graph.
 */

import type { Entity, Relationship } from './types';

// =============================================================================
// Types
// =============================================================================

export interface PathStep {
  entityId: string;
  entityTitle: string;
  entityCategory: string;
  relationshipId: string;
  relationshipType: string;
  direction: 'forward' | 'reverse'; // parent→child vs child→parent
}

export interface PathResult {
  steps: PathStep[];
  distance: number;
}

// =============================================================================
// BFS Shortest Path Finder
// =============================================================================

/**
 * Build a bidirectional adjacency list from relationships.
 * Each entity maps to an array of its neighbors with relationship metadata.
 */
export function buildAdjacencyList(
  relationships: Relationship[],
): Map<string, { neighborId: string; relId: string; relType: string }[]> {
  const adjacency = new Map<string, { neighborId: string; relId: string; relType: string }[]>();

  for (const rel of relationships) {
    // parent → child edge
    const parentNeighbors = adjacency.get(rel.parent_id) || [];
    parentNeighbors.push({ neighborId: rel.child_id, relId: rel.id, relType: rel.relationship_type });
    adjacency.set(rel.parent_id, parentNeighbors);

    // child → parent edge (reverse traversal)
    const childNeighbors = adjacency.get(rel.child_id) || [];
    childNeighbors.push({ neighborId: rel.parent_id, relId: rel.id, relType: rel.relationship_type });
    adjacency.set(rel.child_id, childNeighbors);
  }

  return adjacency;
}

/**
 * Build a Map<string, Entity> from an Entity array for O(1) lookups.
 */
export function buildEntityMap(entities: Entity[]): Map<string, Entity> {
  return new Map(entities.map((e) => [e.id, e]));
}

/**
 * BFS to find the shortest path between two entities in the relationship graph.
 * The graph is bidirectional — we traverse both parent→child and child→parent.
 *
 * @returns PathResult with steps and distance, null if no path exists,
 *          or { steps: [], distance: 0 } if startId === endId.
 */
export function findShortestPath(
  entities: Map<string, Entity>,
  relationships: Relationship[],
  startId: string,
  endId: string,
): PathResult | null {
  if (startId === endId) return { steps: [], distance: 0 };
  if (!entities.has(startId) || !entities.has(endId)) return null;

  // Build adjacency list (bidirectional)
  const adjacency = buildAdjacencyList(relationships);

  // Build a lookup map for relationships to determine direction
  const relMap = new Map<string, Relationship>();
  for (const rel of relationships) {
    relMap.set(rel.id, rel);
  }

  // BFS
  const queue: Array<{ entityId: string; path: PathStep[] }> = [{ entityId: startId, path: [] }];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    const { entityId, path } = current;
    const neighbors = adjacency.get(entityId) || [];

    for (const { neighborId, relId, relType } of neighbors) {
      if (visited.has(neighborId)) continue;
      visited.add(neighborId);

      const neighbor = entities.get(neighborId);

      // Determine direction: if the relationship's parent_id matches entityId, it's forward
      const rel = relMap.get(relId);
      const direction = rel && rel.parent_id === entityId ? 'forward' : 'reverse';

      const step: PathStep = {
        entityId: neighborId,
        entityTitle: neighbor?.title ?? 'Unknown',
        entityCategory: neighbor?.category ?? 'Unknown',
        relationshipId: relId,
        relationshipType: relType,
        direction,
      };

      const newPath = [...path, step];

      if (neighborId === endId) {
        return { steps: newPath, distance: newPath.length };
      }

      queue.push({ entityId: neighborId, path: newPath });
    }
  }

  return null; // No path found
}

/**
 * Collect the set of relationship IDs from a path result.
 * Useful for highlighting edges on the graph canvas.
 */
export function getPathRelIds(path: PathStep[] | null | undefined): Set<string> {
  if (!path) return new Set<string>();
  return new Set(path.map((s) => s.relationshipId));
}

/**
 * Collect the set of entity IDs from a path result.
 * Useful for highlighting nodes on the graph canvas.
 */
export function getPathNodeIds(path: PathStep[] | null | undefined): Set<string> {
  if (!path) return new Set<string>();
  return new Set(path.map((s) => s.entityId));
}
