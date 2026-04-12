
import { HexData } from '../types';
import { TagId } from '../core/types';

/**
 * SpatialQueryAPI
 * Provides O(1) lookup for hexes based on their semantic tags.
 * Acts as an inverted index for the world state.
 */
export class SpatialQueryAPI {
  private index = new Map<TagId, Set<string>>(); // TagId -> Set<HexId>

  /**
   * Rebuilds the spatial index from the authoritative hex array.
   * Call this after world generation or major state updates.
   */
  public rebuild(hexes: HexData[]) {
    this.index.clear();
    for (const h of hexes) {
      if (!h.tags) continue;
      for (const tag of h.tags) {
        if (!this.index.has(tag)) this.index.set(tag, new Set());
        this.index.get(tag)!.add(h.id);
      }
    }
  }

  /**
   * Returns all Hex IDs that possess the specified TagId.
   */
  public query(tag: TagId): string[] {
    return Array.from(this.index.get(tag) || []);
  }

  /**
   * Returns all Hex IDs that possess ALL of the specified TagIds.
   */
  public queryAll(tags: TagId[]): string[] {
    if (tags.length === 0) return [];
    
    // Start with the smallest set for optimization
    let candidateSet = this.index.get(tags[0]);
    if (!candidateSet) return [];

    // Intersect with remaining
    const result: string[] = [];
    for (const id of candidateSet) {
        let match = true;
        for (let i = 1; i < tags.length; i++) {
            const set = this.index.get(tags[i]);
            if (!set || !set.has(id)) {
                match = false;
                break;
            }
        }
        if (match) result.push(id);
    }
    return result;
  }
}

export const SpatialQuery = new SpatialQueryAPI();
