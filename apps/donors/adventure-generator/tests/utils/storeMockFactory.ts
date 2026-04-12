import { vi } from 'vitest';

/**
 * Factory for creating mock store states with sensible defaults.
 * Reduces boilerplate and ensures type safety in tests.
 */

export interface MockLocationStoreState {
    currentLocationId: string | null;
    locations: Record<string, unknown>;
    isLoading: boolean;
    error: string | null;
}

export interface MockSettingsStoreState {
    theme: 'light' | 'dark' | 'system';
    fontSize: number;
    reducedMotion: boolean;
}

const defaultLocationState: MockLocationStoreState = {
    currentLocationId: null,
    locations: {},
    isLoading: false,
    error: null,
};

const defaultSettingsState: MockSettingsStoreState = {
    theme: 'system',
    fontSize: 16,
    reducedMotion: false,
};

/**
 * Creates a mock location store state with overrides.
 */
export function createMockLocationStore(
    overrides: Partial<MockLocationStoreState> = {}
): MockLocationStoreState {
    return { ...defaultLocationState, ...overrides };
}

/**
 * Creates a mock settings store state with overrides.
 */
export function createMockSettingsStore(
    overrides: Partial<MockSettingsStoreState> = {}
): MockSettingsStoreState {
    return { ...defaultSettingsState, ...overrides };
}

/**
 * Sets up mocked stores with the given states.
 * Returns a cleanup function to reset mocks.
 */
export function setupMockStores(options: {
    locationStore?: Partial<MockLocationStoreState>;
    settingsStore?: Partial<MockSettingsStoreState>;
} = {}) {
    const locationState = createMockLocationStore(options.locationStore);
    const settingsState = createMockSettingsStore(options.settingsStore);

    // Import and mock the stores
    // These will be applied when the test imports the actual stores
    const mockLocationStore = {
        getState: () => locationState,
        setState: vi.fn(),
        subscribe: vi.fn(),
    };

    const mockSettingsStore = {
        getState: () => settingsState,
        setState: vi.fn(),
        subscribe: vi.fn(),
    };

    return {
        locationStore: mockLocationStore,
        settingsStore: mockSettingsStore,
        locationState,
        settingsState,
        cleanup: () => {
            vi.clearAllMocks();
        },
    };
}
