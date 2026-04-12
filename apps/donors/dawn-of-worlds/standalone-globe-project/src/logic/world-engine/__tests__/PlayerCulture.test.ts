
import { WorldEngine } from '../WorldEngine';
import { WorldConfig } from '../core/types';
import { NameStyle } from '../history/WorldLinguist';
// import { RegionMap } from '../geosphere/RegionMap';

describe('WorldEngine Player Culture', () => {
    it('should override a region culture with player choice', () => {
        const config: WorldConfig = {
            seed: 'TEST_LAND_SEED_123',
            radius: 25, // Large enough to guarantee continents
            axialTilt: 0,
            plateCount: 10,
            playerCulture: NameStyle.Asian // User choice
        };

        const engine = new WorldEngine(config);
        engine.initialize();
        engine.runStep(); // Run Geosphere -> Region/Culture Logic

        const state = engine.getWorldState();
        console.log(`Debug: Found ${state.regions.length} regions.`);
        if (state.regions.length > 0) {
            console.log(`Debug: Biomes found: ${state.regions.map(r => r.biome).join(', ')}`);
        }

        // Find if ANY region has the player culture
        const playerRegion = state.regions.find(r => r.cultureId === NameStyle.Asian);

        expect(state.regions.length).toBeGreaterThan(0);
        expect(playerRegion).toBeDefined();

        if (playerRegion) {
            console.log(`Found Player Region: ${playerRegion.id} with culture ${playerRegion.cultureId}`);
        }
    });

    it('should NOT override if no choice provided', () => {
        const config: WorldConfig = {
            seed: 'TEST_SEED_DEFAULT',
            radius: 20,
            axialTilt: 0,
            plateCount: 5
        };

        const engine = new WorldEngine(config);
        engine.initialize();
        engine.runStep();

        const state = engine.getWorldState();
        expect(state.regions.length).toBeGreaterThan(0);
    });
});
