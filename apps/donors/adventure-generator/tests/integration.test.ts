import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCampaignStore } from '../src/stores/campaignStore';
import { DEFAULT_CAMPAIGN_CONFIG } from '../src/data/constants';

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn(),
}));

// Mock FS plugin
vi.mock('@tauri-apps/plugin-fs', () => ({
    readTextFile: vi.fn(),
    writeTextFile: vi.fn(),
    exists: vi.fn(),
}));

describe('App Integration Logic', () => {
    beforeEach(() => {
        // Reset stores before each test
        useCampaignStore.getState().setConfig(DEFAULT_CAMPAIGN_CONFIG);
        vi.clearAllMocks();
    });

    it('should initialize with default configuration', () => {
        const state = useCampaignStore.getState();
        expect(state.config.worldName).toBe(DEFAULT_CAMPAIGN_CONFIG.worldName);
    });

    it('should update configuration and reflect in state', () => {
        const newConfig = { ...DEFAULT_CAMPAIGN_CONFIG, worldName: 'Forgotten Realms' };
        useCampaignStore.getState().setConfig(newConfig);

        const state = useCampaignStore.getState();
        expect(state.config.worldName).toBe('Forgotten Realms');
    });

    it('should handle monster addition to bestiary', () => {
        const monster = {
            id: 'm1',
            name: 'Ancient Red Dragon',
            profile: { table: { challengeRating: '24' } },
            source: 'manual'
        };

        useCampaignStore.getState().addToBestiary(monster as any);

        const state = useCampaignStore.getState();
        expect(state.bestiary).toContainEqual(monster);
    });
});
