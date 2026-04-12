import { HexCell } from '../overlay/hexGrid';

/**
 * Get all cells within a certain radius (steps) from a center cell.
 * Breadth-first search.
 */
export function getNeighborsInRadius(
    centerId: string,
    radius: number,
    allCells: HexCell[]
): string[] {
    if (radius < 1) return [centerId];

    const cellMap = new Map<string, HexCell>();
    allCells.forEach(c => cellMap.set(c.id, c));

    const visited = new Set<string>();
    const results = new Set<string>();
    const queue: { id: string; dist: number }[] = [{ id: centerId, dist: 0 }];

    visited.add(centerId);
    results.add(centerId);

    while (queue.length > 0) {
        const current = queue.shift()!;

        if (current.dist >= radius) continue;

        const cell = cellMap.get(current.id);
        if (!cell) continue;

        for (const neighborId of cell.neighbors) {
            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                results.add(neighborId);
                queue.push({ id: neighborId, dist: current.dist + 1 });
            }
        }
    }

    return Array.from(results);
}
