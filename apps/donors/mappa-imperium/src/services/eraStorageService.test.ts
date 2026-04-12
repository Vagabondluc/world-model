import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { EraStorageService, SavedEraGraph } from './eraStorageService';
import { NodeEditorSchema } from '@/types/nodeEditor.types';
import 'fake-indexeddb/auto'; // Use fake-indexeddb for testing

const mockSchema: NodeEditorSchema = {
    version: '1.0.0',
    metadata: {
        name: 'Test Schema',
        description: 'Test Description',
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
    },
    nodes: [],
    connections: [],
    globalSettings: {
        theme: 'light',
        snapToGrid: true,
        gridSize: 20
    }
};

describe('EraStorageService', () => {

    // Clear DB before each test to ensure clean state
    beforeEach(async () => {
        const db = await EraStorageService.openDB();
        const transaction = db.transaction(['era_graphs'], 'readwrite');
        const store = transaction.objectStore('era_graphs');
        store.clear();
    });

    it('should save a graph', async () => {
        const saved = await EraStorageService.saveEraGraph(1, 'Test Save', mockSchema);

        expect(saved).toBeDefined();
        expect(saved.id).toBeDefined();
        expect(saved.eraId).toBe(1);
        expect(saved.name).toBe('Test Save');
        expect(saved.schema).toEqual(mockSchema);
    });

    it('should load a saved graph', async () => {
        const saved = await EraStorageService.saveEraGraph(1, 'Test Save', mockSchema);
        const loaded = await EraStorageService.loadEraGraph(saved.id);

        expect(loaded).toBeDefined();
        expect(loaded?.id).toBe(saved.id);
        expect(loaded?.name).toBe('Test Save');
    });

    it('should list saved graphs for a specific era', async () => {
        await EraStorageService.saveEraGraph(1, 'Era 1 Save 1', mockSchema);
        await EraStorageService.saveEraGraph(1, 'Era 1 Save 2', mockSchema);
        await EraStorageService.saveEraGraph(2, 'Era 2 Save 1', mockSchema);

        const era1Saves = await EraStorageService.listSavedEras(1);
        expect(era1Saves).toHaveLength(2);

        const era2Saves = await EraStorageService.listSavedEras(2);
        expect(era2Saves).toHaveLength(1);

        const allSaves = await EraStorageService.listSavedEras();
        expect(allSaves).toHaveLength(3);
    });

    it('should delete a saved graph', async () => {
        const saved = await EraStorageService.saveEraGraph(1, 'To Delete', mockSchema);

        let loaded = await EraStorageService.loadEraGraph(saved.id);
        expect(loaded).toBeDefined();

        await EraStorageService.deleteEraGraph(saved.id);

        loaded = await EraStorageService.loadEraGraph(saved.id);
        expect(loaded).toBeNull();
    });
});
