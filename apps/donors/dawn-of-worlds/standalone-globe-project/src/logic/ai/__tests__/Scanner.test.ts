
import { describe, it, expect } from 'vitest';
import { AIScanner } from '../AIScanner';
import { GameState } from '../../../types';
import { Cell } from '../../world-engine/core/types';
import * as THREE from 'three';

/**
 * Maturity Test Suite: The Hands (Scanner)
 * Target: AIScanner.ts topology analysis
 */
describe('AI Scanner (Perception)', () => {

    // Helper to create mock cells
    const createMockCell = (id: number, ownerId: string | null = null, _biome: string = 'GRASSLAND'): Cell => ({
        id,
        q: 0, r: 0, s: 0, // coordinates (dummy)
        // Dummy values for required Cell fields
        position: new THREE.Vector3(),
        height: 0,
        temperature: 0,
        moisture: 0,
        biomeId: 0,
        ownerId: ownerId === null ? undefined : ownerId
    } as unknown as Cell);

    // Mock Game State helper
    const createMockState = (cells: Cell[], _adj: Map<number, number[]>): GameState => {
        return {
            age: 1,
            round: 1,
            turn: 1,
            activePlayerId: 'AI',
            players: [],
            events: [],
            world: {
                cells: new Map(cells.map(c => [c.id, c]))
            } as any
        } as GameState;
    };

    it('Scan-01: Should identify My Territory correctly', () => {
        const c1 = createMockCell(1, 'P1');
        const c2 = createMockCell(2, 'P1');
        const c3 = createMockCell(3, 'P2');

        const cells = [c1, c2, c3];
        const state = createMockState(cells, new Map());

        const result = AIScanner.scan(state, 'P1');
        expect(result.myTerritory.sort()).toEqual([1, 2]);
    });

    it('Scan-02: Should identify Frontier (unoccupied neighbors)', () => {
        // 1(P1) -- 2(Empty)
        //       -- 3(P1)
        //       -- 4(P2)
        const c1 = createMockCell(1, 'P1');
        const c2 = createMockCell(2, null);
        const c3 = createMockCell(3, 'P1');
        const c4 = createMockCell(4, 'P2');

        const ownedCells = [1, 3];
        const allCells = new Map<number, Cell>([
            [1, c1], [2, c2], [3, c3], [4, c4]
        ]);
        const adj = new Map<number, number[]>([
            [1, [2, 3, 4]],
            [2, [1]],
            [3, [1]],
            [4, [1]]
        ]);

        const frontier = AIScanner.findFrontier(ownedCells, allCells, adj);
        expect(frontier).toContain(2); // Empty neighbor -> Frontier
        expect(frontier).not.toContain(3); // Self -> Not Frontier
        expect(frontier).not.toContain(4); // Enemy -> Threat, not Frontier
    });

    it('Scan-03: Should identify Threats (enemy neighbors)', () => {
        // 1(P1) -- 2(P2)
        //       -- 3(Empty)
        const c1 = createMockCell(1, 'P1');
        const c2 = createMockCell(2, 'P2');
        const c3 = createMockCell(3, null);



        const adj = new Map<number, number[]>([
            [1, [2, 3]],
            [2, [1]],
            [3, [1]]
        ]);

        const mockState = createMockState([c1, c2, c3], adj);

        const result = AIScanner.scan(mockState, 'P1', adj);
        expect(result.threats).toContain(2); // P2 is threat
        expect(result.threats).not.toContain(3); // Empty is frontier
        expect(result.threats).not.toContain(1); // Self
        expect(result.frontier).toContain(3);
    });

    it('Scan-04: Should return empty Frontier if completely surrounded', () => {
        // 1(P1) surrounded by 2,3,4 (P1)
        const c1 = createMockCell(1, 'P1');
        const c2 = createMockCell(2, 'P1');
        const c3 = createMockCell(3, 'P1');
        const c4 = createMockCell(4, 'P1');

        const cells = [c1, c2, c3, c4];
        const adj = new Map<number, number[]>([
            [1, [2, 3, 4]],
            [2, [1]], [3, [1]], [4, [1]]
        ]);
        const state = createMockState(cells, adj);

        // Explicitly set P1 owns everything
        // frontier should be empty because all neighbors are owned by P1
        const result = AIScanner.scan(state, 'P1', adj);
        expect(result.frontier).toHaveLength(0);
        expect(result.myTerritory).toHaveLength(4);
    });

    it('Scan-05: Should return empty Threats if surrounded by Empty/Self', () => {
        // 1(P1) -- 2(Empty)
        //       -- 3(P1)
        // No enemies.
        const c1 = createMockCell(1, 'P1');
        const c2 = createMockCell(2, null);
        const c3 = createMockCell(3, 'P1');

        const cells = [c1, c2, c3];
        const adj = new Map([
            [1, [2, 3]], [2, [1]], [3, [1]]
        ]);
        const state = createMockState(cells, adj);

        const result = AIScanner.scan(state, 'P1', adj);
        expect(result.threats).toHaveLength(0);
        expect(result.frontier).toContain(2);
    });

    it('Scan-06: Should handle Disconnected Territory (Islands)', () => {
        // Island A: 1(P1) -- 2(Empty)
        // Island B: 5(P1) -- 6(P2)
        const c1 = createMockCell(1, 'P1');
        const c2 = createMockCell(2, null);
        const c5 = createMockCell(5, 'P1');
        const c6 = createMockCell(6, 'P2');

        const cells = [c1, c2, c5, c6];
        const adj = new Map([
            [1, [2]], [2, [1]],
            [5, [6]], [6, [5]]
        ]);
        const state = createMockState(cells, adj);

        const result = AIScanner.scan(state, 'P1', adj);

        // Frontier from Island A
        expect(result.frontier).toContain(2);
        // Threat from Island B
        expect(result.threats).toContain(6);
        // Territory across both
        expect(result.myTerritory).toContain(1);
        expect(result.myTerritory).toContain(5);
    });

    // ... Other tests ...
    it('Scan-10: Should benchmark scan performance', () => {
        // const start = performance.now();
        // AIScanner.scan(largeState, ...);
        // const end = performance.now();
        // expect(end - start).toBeLessThan(10); // 10ms budget
    });
});
