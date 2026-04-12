import { describe, it, expect, beforeEach } from 'vitest';
import { FileSystemStore } from '../../services/fileSystemStore';
import { DEFAULT_CAMPAIGN_CONFIG } from '../../data/constants';

describe('FileSystemStore schema validation', () => {
    const rootPath = 'test-campaign';

    beforeEach(() => {
        localStorage.clear();
    });

    it('falls back to defaults when campaign config is invalid', async () => {
        await FileSystemStore.writeFileContent(`${rootPath}/campaign.json`, '{ invalid json');
        const config = await FileSystemStore.loadConfig(rootPath);
        expect(config).toEqual(DEFAULT_CAMPAIGN_CONFIG);
    });

    it('returns null when location state is invalid', async () => {
        await FileSystemStore.writeFileContent(`${rootPath}/locations/locations_state.json`, '{ invalid json');
        const state = await FileSystemStore.loadLocationState(rootPath);
        expect(state).toBe(null);
    });

    it('returns null when biome data is invalid', async () => {
        await FileSystemStore.writeFileContent(`${rootPath}/assets/biome_data.json`, '{ invalid json');
        const data = await FileSystemStore.loadBiomeData(rootPath);
        expect(data).toBe(null);
    });
});
