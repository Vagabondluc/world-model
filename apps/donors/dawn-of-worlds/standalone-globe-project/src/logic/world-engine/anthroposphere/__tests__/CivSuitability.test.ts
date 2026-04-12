
import { CivilizationEngine } from '../CivilizationEngine';
import { SphereGraph } from '../../core/SphereGraph';
import { Cell } from '../../core/types';

// Mock Graph
const mockGraph = {
    getNeighbors: (id: number) => [id + 1, id - 1].filter(n => n >= 0 && n < 10)
} as unknown as SphereGraph;

describe('CivilizationEngine Suitability', () => {
    let cells: Map<number, Cell>;

    beforeEach(() => {
        cells = new Map();
        // Setup baseline cells
        for (let i = 0; i < 10; i++) {
            cells.set(i, {
                id: i,
                position: [0, 0, 0],
                height: 0.2, // Land
                temperature: 20,
                moisture: 0.5,
                biomeId: 'grassland',
                isRiver: false
            });
        }
    });

    it('should penalize Ocean to negative', () => {
        const cell = cells.get(0)!;
        cell.height = -0.1; // Ocean

        const score = (CivilizationEngine as any).calculateSuitability(cell, cells, mockGraph);
        expect(score).toBeLessThan(0);
    });

    it('should penalize High Mountains', () => {
        const cell = cells.get(0)!;
        cell.height = 0.8; // Mountain

        const score = (CivilizationEngine as any).calculateSuitability(cell, cells, mockGraph);
        expect(score).toBeLessThan(0);
    });

    it('should penalize Extreme Cold', () => {
        const cell = cells.get(0)!;
        cell.temperature = -20;

        const score = (CivilizationEngine as any).calculateSuitability(cell, cells, mockGraph);
        expect(score).toBeLessThan(0); // -20 hard return
    });

    it('should boost Grassland', () => {
        const cell = cells.get(0)!;
        cell.biomeId = 'grassland';
        const score = (CivilizationEngine as any).calculateSuitability(cell, cells, mockGraph);
        expect(score).toBeGreaterThan(0);
    });

    it('should penalize Desert', () => {
        const cell = cells.get(0)!;
        cell.biomeId = 'desert';
        // Desert gets -10. Base is 0. 
        // But height > 0 gives no explicit positive base, just doesn't fail.
        // Let's compare to Grassland.

        const gCell = { ...cell, biomeId: 'grassland' };

        const dScore = (CivilizationEngine as any).calculateSuitability(cell, cells, mockGraph);
        const gScore = (CivilizationEngine as any).calculateSuitability(gCell, cells, mockGraph);

        expect(gScore).toBeGreaterThan(dScore);
    });

    it('should boost River access', () => {
        const cell1 = cells.get(0)!;
        const cell2 = cells.get(1)!;

        cell1.isRiver = true;
        cell2.isRiver = false;

        const s1 = (CivilizationEngine as any).calculateSuitability(cell1, cells, mockGraph);
        const s2 = (CivilizationEngine as any).calculateSuitability(cell2, cells, mockGraph);

        expect(s1).toBeGreaterThan(s2);
    });

    describe('Settlement Placement', () => {
        it('should place highest score first', () => {
            // Cell 0: Perfect
            // Cell 1: Bad
            cells.get(0)!.biomeId = 'grassland';
            cells.get(1)!.biomeId = 'desert';

            CivilizationEngine.placeSettlements(cells, mockGraph, 1);

            // Sorting isn't stable but Grassland score >> Desert score
            // Wait, logic: candidates sorted desc.
            // place 0.

            // Is it marked? current impl adds property? 
            // Logic says: cell.settlementType = 'VILLAGE' or 'CITY'

            // Check if 0 got settled
            const c0 = cells.get(0)!;
            expect(c0.settlementType).toBeDefined();
        });

        it('should respect minimum distance', () => {
            // Cell 0, 1, 2 are neighbors (dist 1)
            // If Cell 0 is placed, Cell 1 shouldn't be if MIN_DISTANCE=3

            // Force 0 and 1 to be high score
            cells.get(0)!.biomeId = 'grassland';
            cells.get(0)!.isRiver = true;

            cells.get(1)!.biomeId = 'grassland';
            cells.get(1)!.isRiver = true;

            // Mock isFarEnough to return FALSE for neighbor
            // Real implementation uses spatial distance.
            // Our mock cells all have position [0,0,0], so distance is 0.
            // So they overlap.
            // So if 0 is placed, 1 is distSq=0 < SAFE_RADIUS.
            // So 1 should NOT be placed.

            CivilizationEngine.placeSettlements(cells, mockGraph, 5);

            // Only 1 should be placed because all others are at [0,0,0] (clashing)
            const settledCount = Array.from(cells.values()).filter(c => c.settlementType).length;
            expect(settledCount).toBe(1);
        });
    });
});
