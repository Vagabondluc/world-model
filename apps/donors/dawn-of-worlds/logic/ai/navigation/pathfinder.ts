
import { Hex } from '../../../types';
import { getNeighbors } from '../../geometry';

interface Cube {
    x: number;
    y: number;
    z: number;
}

/**
 * A* Pathfinder for Hex Grids (Odd-R Offset).
 */
export class Pathfinder {

    public static distance(a: Hex, b: Hex): number {
        const ac = this.offsetToCube(a);
        const bc = this.offsetToCube(b);
        return Math.max(Math.abs(ac.x - bc.x), Math.abs(ac.y - bc.y), Math.abs(ac.z - bc.z));
    }

    public static findPath(start: Hex, goal: Hex, obstacles: Set<string> = new Set()): Hex[] {
        if (obstacles.has(this.hexKey(goal))) return [];

        const frontier: { hex: Hex, priority: number }[] = [];
        frontier.push({ hex: start, priority: 0 });

        const cameFrom = new Map<string, Hex | null>();
        const costSoFar = new Map<string, number>();

        const startKey = this.hexKey(start);
        cameFrom.set(startKey, null);
        costSoFar.set(startKey, 0);

        let iterations = 0;
        const MAX_ITERATIONS = 2000;

        while (frontier.length > 0) {
            iterations++;
            if (iterations > MAX_ITERATIONS) break; // Safety break

            // Pop lowest priority
            // Pop lowest priority
            frontier.sort((a, b) => a.priority - b.priority);
            const current = frontier.shift()!.hex;

            if (current.q === goal.q && current.r === goal.r) {
                break; // Reached
            }

            for (const next of getNeighbors(current.q, current.r)) {
                const nextKey = this.hexKey(next);
                if (obstacles.has(nextKey)) continue;

                const newCost = (costSoFar.get(this.hexKey(current)) || 0) + 1; // Assume cost 1
                if (!costSoFar.has(nextKey) || newCost < costSoFar.get(nextKey)!) {
                    costSoFar.set(nextKey, newCost);
                    const priority = newCost + this.distance(next, goal);
                    frontier.push({ hex: next, priority });
                    cameFrom.set(nextKey, current);
                }
            }
        }

        // Reconstruct
        const path: Hex[] = [];
        let curr: Hex | null | undefined = goal;
        // If goal unreachable, cameFrom uses string key
        // Wait, Map keys are strings.
        if (!cameFrom.has(this.hexKey(goal))) return []; // No path

        while (curr) {
            // Exclude start? No, include usually, but path is start->goal or goal->start?
            // Reconstruct backwards
            path.push(curr);
            const key = this.hexKey(curr);
            curr = cameFrom.get(key);
            // Handle start (value is null)
            if (curr === null) break;
        }

        return path.reverse(); // Start ... Goal
    }

    public static findNextStep(start: Hex, goal: Hex, obstacles: Set<string> = new Set()): Hex | null {
        const path = this.findPath(start, goal, obstacles);
        if (path.length > 1) {
            return path[1]; // Index 0 is Start, Index 1 is Next Step
        }
        return null; // Already there or no path
    }

    // --- Helpers ---

    private static offsetToCube(hex: Hex): Cube {
        const q = hex.q;
        const r = hex.r;
        const x = q - (r - (r & 1)) / 2;
        const z = r;
        const y = -x - z;
        return { x, y, z };
    }

    private static hexKey(h: Hex): string {
        return `${h.q},${h.r}`;
    }
}
