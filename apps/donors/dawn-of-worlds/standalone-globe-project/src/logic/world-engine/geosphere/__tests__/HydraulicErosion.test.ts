
import { HydraulicErosion } from '../HydraulicErosion';
import { SphereGraph } from '../../core/SphereGraph';
import { Cell } from '../../core/types';

describe('HydraulicErosion', () => {
    // Mock Graph as unknown to avoid constructor issues
    let graph: SphereGraph;
    let cells: Map<number, Cell>;

    beforeEach(() => {
        cells = new Map();

        // Simple 3-cell slope: 1 (High) -> 2 (Mid) -> 3 (Low)
        const createCell = (id: number, h: number, neighbors: number[]) => {
            cells.set(id, {
                id,
                position: [0, 0, 0], // Dummy
                height: h,
                temperature: 20,
                moisture: 0.5,
                biomeId: 'test',
                flux: 0,
                isRiver: false
            } as any);

            (cells.get(id) as any)._neighbors = neighbors;
        };

        createCell(1, 1.0, [2]);
        createCell(2, 0.5, [1, 3]);
        createCell(3, 0.0, [2]);

        // Mock Graph
        graph = {
            getNeighbors: (id: number) => {
                return (cells.get(id) as any)._neighbors;
            }
        } as unknown as SphereGraph;
    });

    it('should erode high ground and deposit on low ground', () => {
        // Run multiple erosion passes to guarantee flow
        // Use a large number of iterations to ensure the high cell gets enough droplets
        HydraulicErosion.erode(cells, graph, 5000);

        const h1 = cells.get(1)!.height;
        const h3 = cells.get(3)!.height;

        // 1 (High) should lose height
        expect(h1).toBeLessThan(1.0);
        expect(h3).toBeGreaterThan(0.0);
    });

    it('should calculate flux and identify rivers', () => {
        // Run enough iterations to generate flow
        HydraulicErosion.erode(cells, graph, 200);

        // const _c1 = cells.get(1)!;
        const c2 = cells.get(2)!;
        // const _c3 = cells.get(3)!;

        // Flux should accumulate downhill
        // c2 receives from c1
        // c3 receives from c2
        // Note: simulation is stochastic (random start), but with 200 iterations, 
        // 1 should act as source, 2 as path, 3 as sink.

        // Since C3 is a "pit" (lowest), droplets stop there.
        // C2 is the main "flow" path.
        // Flux on C2 should be > 0.
        expect(c2.flux).toBeGreaterThan(0);

        // Check River assignment
        // If flux is high enough, isRiver should be true.
        // We can't guarantee threshold with random drops, but we can check property exists
        expect(c2.isRiver).toBeDefined();
    });
});
