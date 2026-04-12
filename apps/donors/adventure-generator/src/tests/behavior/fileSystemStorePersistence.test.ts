import { describe, it, expect, beforeEach } from 'vitest';
import { FileSystemStore } from '../../services/fileSystemStore';
import type { LocationStateExport, BiomeData } from '../../types/location';

describe('FileSystemStore persistence (mock FS)', () => {
    const rootPath = 'test-campaign';

    beforeEach(() => {
        localStorage.clear();
    });

    it('saves and loads location state', async () => {
        const state = {
            maps: {
                map1: {
                    id: 'map1',
                    name: 'Test Map',
                    description: '',
                    createdAt: new Date(0),
                    lastModified: new Date(0),
                    layerOrder: ['layer1'],
                    radius: 10
                }
            },
            activeMapId: 'map1',
            locations: {},
            regions: {},
            layers: {
                layer1: {
                    id: 'layer1',
                    mapId: 'map1',
                    name: 'Surface',
                    type: 'surface',
                    visible: true,
                    opacity: 1,
                    data: {
                        hexBiomes: {},
                        revealedHexes: {},
                        regions: [],
                        locations: []
                    },
                    theme: {
                        mode: 'surface',
                        biomePalette: 'standard',
                        backgroundColor: '#ffffff',
                        patternSet: 'standard'
                    }
                }
            },
            viewSettings: {}
        } as unknown as LocationStateExport;

        await FileSystemStore.saveLocationState(rootPath, state);
        const loaded = await FileSystemStore.loadLocationState(rootPath);

        expect(loaded).toEqual(state);
    });

    it('saves and loads biome data assets', async () => {
        const data: BiomeData = {
            forest: { creatureIds: ['wolf'] }
        };

        await FileSystemStore.saveBiomeData(rootPath, data);
        const loaded = await FileSystemStore.loadBiomeData(rootPath);

        expect(loaded).toEqual(data);
    });
});
