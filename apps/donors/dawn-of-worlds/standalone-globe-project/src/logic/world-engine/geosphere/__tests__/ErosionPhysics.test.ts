
import { HydraulicErosion } from '../HydraulicErosion';
import { SphereGraph } from '../../core/SphereGraph';
import { Cell } from '../../core/types';

// Mock Graph: 3 cells in a line [0] -- [1] -- [2]
const mockGraph = {
    getCellCount: () => 3,
    getNeighbors: (id: number) => {
        if (id === 0) return [1];
        if (id === 1) return [0, 2];
        return [1];
    },
    mesh: {
        vertices: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }]
    }
} as unknown as SphereGraph;

describe('HydraulicErosion Physics', () => {
    let cells: Map<number, Cell>;

    beforeEach(() => {
        cells = new Map();
        // Setup a Slope: High -> Mid -> Low
        cells.set(0, { id: 0, height: 1.0, position: [0, 0, 0], temperature: 0, moisture: 0, biomeId: '', flux: 0 });
        cells.set(1, { id: 1, height: 0.5, position: [0, 0, 0], temperature: 0, moisture: 0, biomeId: '', flux: 0 });
        cells.set(2, { id: 2, height: 0.1, position: [0, 0, 0], temperature: 0, moisture: 0, biomeId: '', flux: 0 });
    });

    it('should flow downhill and accumulate flux', () => {
        // We force a droplet to start at 0
        // simulateDroplet is private, but we can call 'erode' with 1 iteration
        // However, 'erode' picks random start.
        // We can mock Math.random to always pick 0.
        const originalRandom = Math.random;
        Math.random = () => 0; // Pick index 0

        HydraulicErosion.erode(cells, mockGraph, 1);

        // Water should flow 0 -> 1 -> 2
        // Flux should accumulate
        expect(cells.get(0)?.flux).toBeGreaterThan(0);
        expect(cells.get(1)?.flux).toBeGreaterThan(0);
        expect(cells.get(2)?.flux).toBeGreaterThan(0);

        Math.random = originalRandom;
    });

    it('should erode high ground and deposit on low ground', () => {
        const originalRandom = Math.random;
        Math.random = () => 0;

        HydraulicErosion.erode(cells, mockGraph, 5); // Run a few drops

        const h0 = cells.get(0)!.height;
        const h2 = cells.get(2)!.height;

        // Top should erode
        expect(h0).toBeLessThan(1.0);

        // Bottom should deposit (gain mass)
        expect(h2).toBeGreaterThan(0.1);

        Math.random = originalRandom;
    });

    it('should identify rivers based on high flux', () => {
        // Manually set high flux
        cells.get(1)!.flux = 100;
        cells.get(2)!.flux = 1000;

        // Access private determineRivers via cast
        (HydraulicErosion as any).determineRivers(cells);

        expect(cells.get(2)?.isRiver).toBe(true);
    });

    it('should not create rivers if flux is zero', () => {
        (HydraulicErosion as any).determineRivers(cells);
        expect(cells.get(0)?.isRiver).toBeFalsy();
    });
});
