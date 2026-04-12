
import { CivilizationEngine } from '../CivilizationEngine';
import { SphereGraph } from '../../core/SphereGraph';
import { Cell } from '../../core/types';

describe('CivilizationEngine', () => {
    let cells: Map<number, Cell>;
    let graph: SphereGraph;

    beforeEach(() => {
        cells = new Map();

        // Helper to create cell
        const addCell = (id: number, h: number, temp: number, biome: string, pos: [number, number, number]) => {
            cells.set(id, {
                id,
                position: pos,
                height: h,
                temperature: temp,
                moisture: 0.5,
                biomeId: biome,
                isRiver: false
            } as any);
            // Mock neighbor storage
            (cells.get(id) as any)._neighbors = [];
        };

        // Create a small cluster
        // 1: Ideal spot (Grassland, Flat, Temp 20)
        addCell(1, 0.1, 20, 'grassland', [0, 0, 0]);
        // 2: Too high (Mountain)
        addCell(2, 0.9, 0, 'mountain', [0.1, 0, 0]);
        // 3: Too cold (Ice)
        addCell(3, 0.1, -10, 'tundra', [0, 0.1, 0]);
        // 4: Another good spot, but close to 1
        addCell(4, 0.1, 20, 'forest', [0.01, 0.01, 0]);
        // 5: Far away good spot
        addCell(5, 0.1, 20, 'grassland', [10, 10, 10]);

        // Mock Graph
        graph = {
            getNeighbors: (id: number) => (cells.get(id) as any)._neighbors
        } as unknown as SphereGraph;
    });

    it('should place settlements on suitable tiles', () => {
        CivilizationEngine.placeSettlements(cells, graph, 1);

        const c1 = cells.get(1);
        const c2 = cells.get(2);

        // 1 is ideal, should have settlement
        expect(c1?.settlementType).toBeDefined();
        // 2 is mountain, should not
        expect(c2?.settlementType).toBeUndefined();
    });

    it('should respect spacing', () => {
        // Try to place 3 settlments
        // We have 1, 4 (close to 1), and 5 (far)
        // 1 and 4 are close, so only one should get it.
        // 5 is far, so it should get one too.

        CivilizationEngine.placeSettlements(cells, graph, 3);

        const c1 = cells.get(1);
        const c4 = cells.get(4);
        const c5 = cells.get(5);

        // One of 1 or 4 should be settled, but not both if logic works
        // (Assuming spacing check uses position properly)
        const settledCountLocal = (c1?.settlementType ? 1 : 0) + (c4?.settlementType ? 1 : 0);
        expect(settledCountLocal).toBeLessThan(2);

        // 5 is far, should be settled
        expect(c5?.settlementType).toBeDefined();
    });
});
