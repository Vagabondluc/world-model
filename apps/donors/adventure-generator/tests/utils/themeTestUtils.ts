import { vi } from 'vitest';
import { useLocationStore, type LocationStoreState } from '../../src/stores/locationStore';
import { useSettingsStore, type SettingsState } from '../../src/stores/settingsStore';
import type { MapLayer, LayerTheme } from '../../src/types/location';

export function createMockLayer(overrides: Partial<MapLayer> = {}): MapLayer {
    const defaultLayer: MapLayer = {
        id: 'layer-1',
        mapId: 'map-1',
        name: 'Layer 1',
        type: 'surface',
        visible: true,
        opacity: 1,
        data: {
            hexBiomes: {},
            revealedHexes: {},
            regions: [],
            locations: [],
        },
        theme: {
            mode: 'surface',
            biomePalette: 'standard',
            backgroundColor: '#ffffff',
            patternSet: 'default',
        } as LayerTheme,
    };

    return { ...defaultLayer, ...overrides } as MapLayer;
}

export function mockThemeStores(options: {
    activeLayerId?: string | null;
    layers?: Record<string, MapLayer>;
    themeSkin?: SettingsState['themeSkin'];
} = {}) {
    const layers = options.layers ?? {};
    const activeLayerId = options.activeLayerId ?? (Object.keys(layers)[0] || null);

    // Lightweight settings state with required fields
    const settingsState: Partial<SettingsState> = {
        backendUrl: 'http://localhost',
        setBackendUrl: () => {},
        backendEndpoint: 'http://localhost',
        setBackendEndpoint: () => {},
        themeSkin: options.themeSkin ?? 'parchment',
        setThemeSkin: () => {},
    };

    // Minimal location state that is sufficient for the theme selectors used in tests
    const locationState: Partial<LocationStoreState> = {
        activeLayerId,
        layers,
        maps: {},
        activeMapId: null,
        locations: {},
        regions: {},
        viewSettings: {},
        // Provide stub functions to avoid runtime errors if selectors call them
        getMapList: () => Object.values(locationState.maps || {}),
        getActiveMap: () => null,
        getLocationList: () => [],
        getRegionList: () => [],
        getFilteredLocationList: () => [],
        getGroundingContext: () => '',
        exportState: () => ({ maps: {}, activeMapId: null, locations: {}, regions: {}, layers, viewSettings: {} }),
        importState: () => {},
    };

    // Apply mocks to the selectors. We use any in the mockImplementation to avoid forcing
    // callers to perform unsafe double-casts; tests call these helpers for type-safe setup.
    vi.mocked(useLocationStore).mockImplementation((selector: any) => selector(locationState as LocationStoreState));
    vi.mocked(useSettingsStore).mockImplementation((selector: any) => selector(settingsState as SettingsState));

    return { locationState: locationState as LocationStoreState, settingsState: settingsState as SettingsState };
}
