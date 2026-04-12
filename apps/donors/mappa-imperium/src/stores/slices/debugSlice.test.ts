import { useGameStore } from '../gameStore';
import { initialGameState } from '../initialState';

// Mock map generator
vi.mock('@/services/generators/mapGenerator', () => ({
    generateMap: vi.fn(() => ({
        hexBiomes: { '0,0,0': 'grassland' },
        regions: [],
        locations: []
    }))
}));

describe('debugSlice', () => {
    // Use the singleton store
    const store = useGameStore;

    beforeEach(() => {
        store.setState(initialGameState);
    });

    it('should generate map data when prepopulating if none exists', () => {
        expect(store.getState().mapData).toBeNull();

        // Setup initial debug state
        store.getState().debugSetup();

        // Trigger prepopulate
        store.getState().prepopulateEra(1, 0); // All players

        const state = store.getState();
        expect(state.mapData).not.toBeNull();
        expect(state.mapData.hexBiomes).toEqual({ '0,0,0': 'grassland' });
        expect(state.gameSettings.worldSettings).toBeDefined();
    });

    it('should not overwrite existing map data', () => {
        const existingMap = { hexBiomes: { '1,1,-2': 'ocean' }, regions: [], locations: [] };
        store.setState({ mapData: existingMap });

        // Setup initial debug state
        store.getState().debugSetup();

        store.getState().prepopulateEra(1, 0);

        expect(store.getState().mapData).toEqual(existingMap);
    });
});
