import { GameState, WorldObject, Hex } from '../types';

export type SearchResult = 
  | { kind: 'HEX'; hex: Hex; label: string; sublabel: string }
  | { kind: 'WORLD'; worldId: string; label: string; sublabel: string };

export function queryWorld(state: GameState, query: string): SearchResult[] {
  const term = query.toLowerCase().trim();
  if (!term) return [];

  const results: SearchResult[] = [];
  // Use the cached world state for O(1) access instead of re-deriving
  const world = state.worldCache;

  // 1. Search World Objects by Name or Kind
  for (const obj of world.values()) {
    const matchesName = obj.name?.toLowerCase().includes(term);
    const matchesKind = obj.kind.toLowerCase().includes(term);

    if (matchesName || matchesKind) {
      results.push({
        kind: 'WORLD',
        worldId: obj.id,
        label: obj.name || obj.kind,
        sublabel: `${obj.kind} • Created by ${obj.createdBy || 'System'}`
      });
    }
  }

  // 2. Search Hexes by coordinate syntax (e.g. "2,-1" or "h:2,1")
  const coordMatch = term.match(/(-?\d+)\s*,\s*(-?\d+)/);
  if (coordMatch) {
    const q = parseInt(coordMatch[1]);
    const r = parseInt(coordMatch[2]);
    results.push({
      kind: 'HEX',
      hex: { q, r },
      label: `Hex (${q}, ${r})`,
      sublabel: 'Coordinate Match'
    });
  }

  return results.slice(0, 10);
}