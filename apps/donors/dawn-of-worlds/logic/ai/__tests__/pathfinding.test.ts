
import { describe, it, expect } from 'vitest';
import { Pathfinder } from '../navigation/pathfinder';
import { Hex } from '../../../types';

describe('AI Phase 3: Pathfinder', () => {

    it('Calculates Distance Correctly', () => {
        const start: Hex = { q: 0, r: 0 };
        const neighbor: Hex = { q: 1, r: 0 }; // Adjacent

        expect(Pathfinder.distance(start, neighbor)).toBe(1);

        // Odd-r offset math is tricky, usually verify with straight line
        // (0,0) -> (0,2) is distance 2? 
        // offsetToCube:
        // (0,0) -> x=0, z=0, y=0.
        // (0,2) -> q=0, r=2. x = 0 - (2-0)/2 = -1. z=2. y = 1-2 = -1. 
        // Dist = (|-1| + |-1| + |2|) / 2 = 2. Correct.
        expect(Pathfinder.distance({ q: 0, r: 0 }, { q: 0, r: 2 })).toBe(2);
    });

    it('Finds Path avoiding obstacles', () => {
        // Simple line blocked
        const start = { q: 0, r: 0 };
        const goal = { q: 2, r: 0 };
        const obstacle = { q: 1, r: 0 }; // The middle hex

        const obstacles = new Set<string>(['1,0']);
        const path = Pathfinder.findPath(start, goal, obstacles);

        // Path should go around. Length > 3? 
        // Start(0,0) -> Neighbors(0,1 or 1,1???) -> ... -> Goal
        expect(path.length).toBeGreaterThan(0);
        expect(path[0]).toEqual(start);
        expect(path[path.length - 1]).toEqual(goal);

        // Ensure middle hex is NOT in path
        const pathKeys = path.map(h => `${h.q},${h.r}`);
        expect(pathKeys).not.toContain('1,0');
    });

    it('Returns Next Step', () => {
        const start = { q: 0, r: 0 };
        const goal = { q: 1, r: 0 };
        const next = Pathfinder.findNextStep(start, goal);

        expect(next).toEqual(goal); // Since it's adjacent
    });
});
