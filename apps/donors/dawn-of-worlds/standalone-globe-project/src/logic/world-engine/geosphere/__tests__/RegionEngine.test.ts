
import { RegionMap } from "../RegionMap";
import { CultureMap } from "../../anthroposphere/CultureMap";
import { Cell, Region } from "../../core/types";
import { SphereGraph } from "../../core/SphereGraph";
import { NameStyle } from "../../history/WorldLinguist";

// Mock SphereGraph
const mockGraph = {
    getNeighbors: (id: number) => {
        // Simple linear graph: 0-1-2-3
        // Disconnected: 5-6
        if (id === 0) return [1];
        if (id === 1) return [0, 2];
        if (id === 2) return [1, 3];
        if (id === 3) return [2];
        if (id === 5) return [6];
        if (id === 6) return [5];
        return [];
    }
} as unknown as SphereGraph;

describe('Region Engine', () => {

    describe('RegionMap', () => {
        it('should group connected land cells into regions', () => {
            const cells = new Map<number, Cell>();

            // Region A: 0, 1, 2
            cells.set(0, { id: 0, height: 0.5, position: [0, 0, 0], temperature: 20, moisture: 0.5, biomeId: 'forest' } as Cell);
            cells.set(1, { id: 1, height: 0.5, position: [0, 0, 0], temperature: 20, moisture: 0.5, biomeId: 'forest' } as Cell);
            cells.set(2, { id: 2, height: 0.5, position: [0, 0, 0], temperature: 20, moisture: 0.5, biomeId: 'forest' } as Cell);

            // Water Gap: 3
            cells.set(3, { id: 3, height: -0.5, position: [0, 0, 0], temperature: 20, moisture: 0.5, biomeId: 'ocean' } as Cell);

            // Region B: 5, 6
            cells.set(5, { id: 5, height: 0.5, position: [1, 1, 1], temperature: -10, moisture: 0.5, biomeId: 'tundra' } as Cell);
            cells.set(6, { id: 6, height: 0.5, position: [1, 1, 1], temperature: -10, moisture: 0.5, biomeId: 'tundra' } as Cell);

            const regions = RegionMap.findRegions(cells, mockGraph);

            expect(regions.length).toBe(2);

            // Verify Region 1 (0,1,2)
            const r1 = regions.find(r => r.cells.includes(0));
            expect(r1).toBeDefined();
            expect(r1!.cells.length).toBe(3);
            expect(r1!.biome).toBe('forest');

            // Verify Region 2 (5,6)
            const r2 = regions.find(r => r.cells.includes(5));
            expect(r2).toBeDefined();
            expect(r2!.cells.length).toBe(2);
            expect(r2!.biome).toBe('tundra');
        });
    });

    describe('CultureMap', () => {
        it('should assign deterministic cultures based on seed', () => {
            const region: Region = {
                id: 'R_1',
                cells: [0],
                biome: 'polar_ice',
                area: 1,
                center: [0, 1, 0] // North Pole
            };

            const seed1 = 'SEED_A';
            const seed2 = 'SEED_B';

            // Run multiple times with same seed to ensure determinism
            CultureMap.assignCultures([region], seed1);
            const cultureA1 = region.cultureId;

            CultureMap.assignCultures([region], seed1);
            const cultureA2 = region.cultureId;

            expect(cultureA1).toBe(cultureA2);

            // Change seed, expect potential change (though not guaranteed if weight is super high, but likely)
            // With Inuit at 0.5, it might be same, but testing determinism is key
            CultureMap.assignCultures([region], seed2);
            // Just verifying it runs without error and assigns SOMETHING valid
            expect(Object.values(NameStyle)).toContain(region.cultureId);
        });

        it('should assign culturally appropriate styles', () => {
            const iceRegion: Region = { id: 'R_1', cells: [], biome: 'polar_ice', area: 1, center: [0, 1, 0] };
            const desertRegion: Region = { id: 'R_2', cells: [], biome: 'subtropical_desert', area: 1, center: [0, 0, 0] };

            // Run many times to check distribution validity (statistically)
            // Or just check that it picks from the ALLOWED list
            CultureMap.assignCultures([iceRegion], 'TEST');
            expect([NameStyle.Inuit, NameStyle.Uralic, NameStyle.Germanic]).toContain(iceRegion.cultureId);

            CultureMap.assignCultures([desertRegion], 'TEST');
            expect([NameStyle.Arabic, NameStyle.AfroAsiatic, NameStyle.Swahili]).toContain(desertRegion.cultureId);
        });
    });
});
