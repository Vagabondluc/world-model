/**
 * Unit tests for the BFS shortest-path algorithm in graphUtils.ts
 *
 * Tests cover:
 * - Happy path (simple chain, multi-hop)
 * - Disconnected graph (no path)
 * - Cycle safety (circular relationships)
 * - Bidirectional traversal (parent→child and child→parent)
 * - Same entity (distance 0)
 * - Missing entities (graceful null)
 * - Single-edge direct connection
 * - Multiple possible paths (BFS finds shortest)
 */

import { describe, it, expect } from 'vitest';
import { findShortestPath, buildAdjacencyList, buildEntityMap, getPathRelIds, getPathNodeIds } from '@/lib/graphUtils';
import type { Entity, Relationship } from '@/lib/types';

// =============================================================================
// Test fixtures
// =============================================================================

function makeEntity(id: string, title: string, category: string = 'NPC'): Entity {
  return {
    id,
    uuid_short: `E-${id.slice(0, 4).toUpperCase()}`,
    title,
    category,
    markdown_content: '',
    json_attributes: {},
    tags: [],
    isPinned: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
}

function makeRelationship(parentId: string, childId: string, type: string = 'related_to', id?: string): Relationship {
  return {
    id: id || `rel-${parentId}-${childId}`,
    parent_id: parentId,
    child_id: childId,
    relationship_type: type,
  };
}

// =============================================================================
// buildEntityMap
// =============================================================================

describe('buildEntityMap', () => {
  it('should create a Map keyed by entity id', () => {
    const entities = [makeEntity('a', 'A'), makeEntity('b', 'B')];
    const map = buildEntityMap(entities);
    expect(map).toBeInstanceOf(Map);
    expect(map.size).toBe(2);
    expect(map.get('a')?.title).toBe('A');
    expect(map.get('b')?.title).toBe('B');
  });

  it('should return empty map for empty array', () => {
    const map = buildEntityMap([]);
    expect(map.size).toBe(0);
  });
});

// =============================================================================
// buildAdjacencyList
// =============================================================================

describe('buildAdjacencyList', () => {
  it('should build bidirectional adjacency list', () => {
    const rels = [makeRelationship('a', 'b', 'allied_with')];
    const adj = buildAdjacencyList(rels);

    expect(adj.get('a')).toHaveLength(1);
    expect(adj.get('a')![0].neighborId).toBe('b');

    expect(adj.get('b')).toHaveLength(1);
    expect(adj.get('b')![0].neighborId).toBe('a');
  });

  it('should handle multiple relationships from same entity', () => {
    const rels = [
      makeRelationship('a', 'b', 'allied_with'),
      makeRelationship('a', 'c', 'enemy_of'),
    ];
    const adj = buildAdjacencyList(rels);
    expect(adj.get('a')).toHaveLength(2);
  });

  it('should return empty map for no relationships', () => {
    const adj = buildAdjacencyList([]);
    expect(adj.size).toBe(0);
  });
});

// =============================================================================
// findShortestPath — Core BFS
// =============================================================================

describe('findShortestPath', () => {
  it('should find path through a simple chain A → B → C', () => {
    const entities = [
      makeEntity('a', 'Entity A'),
      makeEntity('b', 'Entity B'),
      makeEntity('c', 'Entity C'),
    ];
    const rels = [
      makeRelationship('a', 'b', 'contains'),
      makeRelationship('b', 'c', 'contains'),
    ];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'c');
    expect(result).not.toBeNull();
    expect(result!.distance).toBe(2);
    expect(result!.steps).toHaveLength(2);
    expect(result!.steps[0].entityId).toBe('b');
    expect(result!.steps[1].entityId).toBe('c');
  });

  it('should find direct connection between two entities', () => {
    const entities = [
      makeEntity('a', 'Entity A'),
      makeEntity('b', 'Entity B'),
    ];
    const rels = [makeRelationship('a', 'b', 'allied_with')];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'b');
    expect(result).not.toBeNull();
    expect(result!.distance).toBe(1);
    expect(result!.steps).toHaveLength(1);
    expect(result!.steps[0].entityId).toBe('b');
    expect(result!.steps[0].relationshipType).toBe('allied_with');
  });

  it('should return distance 0 for same entity', () => {
    const entities = [makeEntity('a', 'Entity A')];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, [], 'a', 'a');
    expect(result).not.toBeNull();
    expect(result!.distance).toBe(0);
    expect(result!.steps).toHaveLength(0);
  });

  it('should return null for disconnected entities', () => {
    const entities = [
      makeEntity('a', 'Entity A'),
      makeEntity('b', 'Entity B'),
      makeEntity('c', 'Entity C'),
      makeEntity('d', 'Entity D'),
    ];
    const rels = [
      makeRelationship('a', 'b', 'allied_with'),
      makeRelationship('c', 'd', 'enemy_of'),
    ];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'c');
    expect(result).toBeNull();
  });

  it('should return null when start entity does not exist', () => {
    const entities = [makeEntity('b', 'Entity B')];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, [], 'nonexistent', 'b');
    expect(result).toBeNull();
  });

  it('should return null when end entity does not exist', () => {
    const entities = [makeEntity('a', 'Entity A')];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, [], 'a', 'nonexistent');
    expect(result).toBeNull();
  });

  it('should handle circular relationships without infinite loop', () => {
    const entities = [
      makeEntity('a', 'Entity A'),
      makeEntity('b', 'Entity B'),
      makeEntity('c', 'Entity C'),
    ];
    // A → B → C → A (cycle). Bidirectional traversal means A's neighbors include B and C.
    // So A→C is 1 hop (via the reverse edge of C→A), A→B is also 1 hop.
    const rels = [
      makeRelationship('a', 'b', 'related_to', 'rel-ab'),
      makeRelationship('b', 'c', 'related_to', 'rel-bc'),
      makeRelationship('c', 'a', 'related_to', 'rel-ca'),
    ];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'c');
    expect(result).not.toBeNull();
    // Bidirectional: A can reach C directly via C→A reverse edge (1 hop)
    expect(result!.distance).toBe(1);
  });

  it('should handle self-referencing cycle', () => {
    const entities = [
      makeEntity('a', 'Entity A'),
      makeEntity('b', 'Entity B'),
    ];
    const rels = [
      makeRelationship('a', 'a', 'related_to', 'rel-aa'),
      makeRelationship('a', 'b', 'contains', 'rel-ab'),
    ];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'b');
    expect(result).not.toBeNull();
    expect(result!.distance).toBe(1);
  });

  it('should traverse child→parent (reverse direction)', () => {
    const entities = [
      makeEntity('a', 'Entity A'),
      makeEntity('b', 'Entity B'),
    ];
    const rels = [makeRelationship('a', 'b', 'contains')];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'b', 'a');
    expect(result).not.toBeNull();
    expect(result!.distance).toBe(1);
    expect(result!.steps[0].entityId).toBe('a');
    expect(result!.steps[0].direction).toBe('reverse');
  });

  it('should traverse parent→child (forward direction)', () => {
    const entities = [
      makeEntity('a', 'Entity A'),
      makeEntity('b', 'Entity B'),
    ];
    const rels = [makeRelationship('a', 'b', 'contains', 'rel-ab')];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'b');
    expect(result).not.toBeNull();
    expect(result!.steps[0].direction).toBe('forward');
  });

  it('should find the shortest path when multiple routes exist', () => {
    const entities = [
      makeEntity('a', 'A'),
      makeEntity('b', 'B'),
      makeEntity('c', 'C'),
      makeEntity('d', 'D'),
    ];
    const rels = [
      makeRelationship('a', 'd', 'related_to', 'rel-ad'),
      makeRelationship('a', 'b', 'related_to', 'rel-ab'),
      makeRelationship('b', 'c', 'related_to', 'rel-bc'),
      makeRelationship('c', 'd', 'related_to', 'rel-cd'),
    ];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'd');
    expect(result).not.toBeNull();
    expect(result!.distance).toBe(1);
    expect(result!.steps).toHaveLength(1);
    expect(result!.steps[0].entityId).toBe('d');
  });

  it('should find path through 5-hop chain', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
    const entities = ids.map((id) => makeEntity(id, `Entity ${id.toUpperCase()}`));
    const rels = [
      makeRelationship('a', 'b', 'contains'),
      makeRelationship('b', 'c', 'contains'),
      makeRelationship('c', 'd', 'contains'),
      makeRelationship('d', 'e', 'contains'),
      makeRelationship('e', 'f', 'contains'),
    ];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'f');
    expect(result).not.toBeNull();
    expect(result!.distance).toBe(5);
    expect(result!.steps.map((s) => s.entityId)).toEqual(['b', 'c', 'd', 'e', 'f']);
  });

  it('should include correct metadata in path steps', () => {
    const entities = [
      makeEntity('a', 'King Arthur', 'NPC'),
      makeEntity('b', 'Camelot', 'Settlement'),
    ];
    const rels = [makeRelationship('a', 'b', 'ruler_of', 'rel-arthur-camelot')];
    const entityMap = buildEntityMap(entities);

    const result = findShortestPath(entityMap, rels, 'a', 'b');
    expect(result).not.toBeNull();
    const step = result!.steps[0];
    expect(step.entityId).toBe('b');
    expect(step.entityTitle).toBe('Camelot');
    expect(step.entityCategory).toBe('Settlement');
    expect(step.relationshipId).toBe('rel-arthur-camelot');
    expect(step.relationshipType).toBe('ruler_of');
    expect(step.direction).toBe('forward');
  });
});

// =============================================================================
// getPathRelIds / getPathNodeIds
// =============================================================================

describe('getPathRelIds', () => {
  it('should extract relationship IDs from path', () => {
    const path = [
      { entityId: 'b', entityTitle: 'B', entityCategory: 'NPC', relationshipId: 'r1', relationshipType: 'allied_with', direction: 'forward' as const },
      { entityId: 'c', entityTitle: 'C', entityCategory: 'City', relationshipId: 'r2', relationshipType: 'located_in', direction: 'forward' as const },
    ];
    const ids = getPathRelIds(path);
    expect(ids).toBeInstanceOf(Set);
    expect(ids.has('r1')).toBe(true);
    expect(ids.has('r2')).toBe(true);
    expect(ids.size).toBe(2);
  });

  it('should return empty set for null/undefined path', () => {
    expect(getPathRelIds(null).size).toBe(0);
    expect(getPathRelIds(undefined).size).toBe(0);
  });
});

describe('getPathNodeIds', () => {
  it('should extract entity IDs from path', () => {
    const path = [
      { entityId: 'b', entityTitle: 'B', entityCategory: 'NPC', relationshipId: 'r1', relationshipType: 'allied_with', direction: 'forward' as const },
      { entityId: 'c', entityTitle: 'C', entityCategory: 'City', relationshipId: 'r2', relationshipType: 'located_in', direction: 'forward' as const },
    ];
    const ids = getPathNodeIds(path);
    expect(ids).toBeInstanceOf(Set);
    expect(ids.has('b')).toBe(true);
    expect(ids.has('c')).toBe(true);
  });

  it('should return empty set for null/undefined path', () => {
    expect(getPathNodeIds(null).size).toBe(0);
  });
});
