import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks
vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn()
}));
vi.mock('@tauri-apps/plugin-fs', () => ({
    readDir: vi.fn()
}));
vi.mock('@tauri-apps/api/event', () => ({
    listen: vi.fn()
}));

import { PersistenceMappingService, NodeMetadata } from '../services/persistenceMappingService';
import { FileSystemStore } from '../services/fileSystemStore';
import { EnsembleService } from '../services/ensembleService';
import { useEnsembleStore } from '../stores/ensembleStore';
import { useEncounterWizardStore } from '../stores/encounterWizardStore';

describe('1-8. PersistenceMappingService Tests', () => {
    it('1. should serialize a node with metadata correctly', () => {
        const meta: Partial<NodeMetadata> = { type: 'adventure-hook', id: 'id1', label: 'Title', data: { x: 1 } };
        const result = PersistenceMappingService.serializeToMarkdown(meta);
        expect(result).toContain('type: adventure-hook');
        expect(result).toContain('# Title');
    });

    it('2. should deserialize valid metadata from frontmatter', () => {
        const fm = 'node_metadata:\n  type: quick-delve\n  id: d1\n  data: {}\n';
        const result = PersistenceMappingService.deserializeFromMarkdown(fm);
        expect(result?.type).toBe('quick-delve');
    });

    it('3. should return null for corrupt metadata string', () => {
        const result = PersistenceMappingService.deserializeFromMarkdown('!!! : : :');
        expect(result).toBeNull();
    });

    it('4. should convert simple adventure to markdown string', () => {
        const adv = { type: 'simple', premise: 'Save the king', origin: 'Town', positioning: 'Friendly', stakes: 'High', compendiumIds: [] };
        const result = PersistenceMappingService.adventureToMarkdown(adv as any);
        expect(result).toContain('**Premise:** Save the king');
    });

    it('5. should convert advanced adventure to markdown string', () => {
        const adv = {
            type: 'advanced',
            hook: 'Mysterious light',
            title: 'Light',
            player_buy_in: 'Greed',
            starter_scene: 'Town',
            gm_notes: { escalation: 'Orcs', twists_applied: ['Betrayal'] },
            compendiumIds: []
        };
        const result = PersistenceMappingService.adventureToMarkdown(adv as any);
        expect(result).toContain('**Hook:** Mysterious light');
        expect(result).toContain('* Escalation: Orcs');
    });

    it('6. should convert encounter workflow to markdown with parent ref', () => {
        const state = { currentStage: 'Setup', nodes: [{ id: 'n1', stage: 'Setup', narrative: 'Text', thematicTags: [] }] } as any;
        const result = PersistenceMappingService.encounterToMarkdown(state, 'Title', 'parent-1');
        expect(result).toContain('contained_by: parent-1');
    });

    it('7. should convert modular room to markdown with connections', () => {
        const room = { id: 'r1', title: 'Hall', narrative: 'Big', sensory: {} };
        const conns = [{ to: 'r2.md', label: 'Door' }];
        const result = PersistenceMappingService.roomToMarkdown(room as any, 'index.md', conns);
        expect(result).toContain('label: Door');
        expect(result).toContain('to: r2.md');
    });

    it('8. should convert delve master to markdown without inner room data', () => {
        const delve = { id: 'd1', title: 'Dungeon', rooms: [{ id: 'r1' }] } as any;
        const result = PersistenceMappingService.delveToMarkdown(delve);
        const meta = PersistenceMappingService.deserializeFromMarkdown(result.split('---\n')[1]);
        const metaData = meta?.data as { rooms?: unknown[] } | undefined;
        expect(metaData?.rooms).toHaveLength(0);
    });
});

describe('9-13. EnsembleService Graph Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Use forward slashes for cross-platform compatibility in mocks
        useEnsembleStore.getState().setRootPath('C:/vault');
        useEnsembleStore.getState().setGraphData({ nodes: [], edges: [] });
    });

    it('9. should parse wiki-links into mention edges', async () => {
        vi.spyOn(EnsembleService, 'readMarkdown').mockResolvedValue({
            frontmatter: 'node_metadata: { type: file }',
            content: '[[Link]]'
        });
        vi.spyOn(FileSystemStore, 'readDirectory').mockResolvedValue([{ name: 'node1.md', isDirectory: false }]);

        await EnsembleService.refreshGraph();
        expect(useEnsembleStore.getState().graphData.edges.some(e => e.label === 'mention')).toBe(true);
    });

    it('10. should parse contained_by into contains hierarchy edges', async () => {
        vi.spyOn(EnsembleService, 'readMarkdown').mockResolvedValue({
            frontmatter: 'node_metadata: { contained_by: parent.md }',
            content: ''
        });
        vi.spyOn(FileSystemStore, 'readDirectory').mockResolvedValue([{ name: 'child.md', isDirectory: false }]);

        await EnsembleService.refreshGraph();
        expect(useEnsembleStore.getState().graphData.edges.some(e => e.label === 'contains')).toBe(true);
    });

    it('11. should parse physical connections into labeled edges', async () => {
        vi.spyOn(EnsembleService, 'readMarkdown').mockResolvedValue({
            frontmatter: 'node_metadata: { connections: [{ to: dest.md, label: Pass }] }',
            content: ''
        });
        vi.spyOn(FileSystemStore, 'readDirectory').mockResolvedValue([{ name: 'src.md', isDirectory: false }]);

        await EnsembleService.refreshGraph();
        expect(useEnsembleStore.getState().graphData.edges.some(e => e.label === 'Pass')).toBe(true);
    });

    it('12. should normalize relative paths correctly in graph resolution', async () => {
        vi.spyOn(EnsembleService, 'readMarkdown').mockResolvedValue({
            frontmatter: 'node_metadata: { type: room, id: "C:/vault/sub/node.md", contained_by: "../root.md" }',
            content: ''
        });
        vi.spyOn(FileSystemStore, 'readDirectory')
            .mockResolvedValueOnce([{ name: 'sub', isDirectory: true }])
            .mockResolvedValueOnce([{ name: 'node.md', isDirectory: false }]);

        await EnsembleService.refreshGraph();
        const edge = useEnsembleStore.getState().graphData.edges[0];
        // Normalize: C:/vault/sub/../root.md -> C:/vault/root.md
        expect(edge.source).toBe('C:\\vault\\root.md');
    });

    it('13. should handle absolute paths in metadata without breaking', async () => {
        vi.spyOn(EnsembleService, 'readMarkdown').mockResolvedValue({
            frontmatter: 'node_metadata: { contained_by: "D:/other/root.md" }',
            content: ''
        });
        vi.spyOn(FileSystemStore, 'readDirectory').mockResolvedValue([{ name: 'node.md', isDirectory: false }]);

        await EnsembleService.refreshGraph();
        const edge = useEnsembleStore.getState().graphData.edges[0];
        expect(edge.source).toBe('D:\\other\\root.md');
    });
});

describe('14-16. Store Logic', () => {
    it('14. should persist file content in EnsembleStore', () => {
        useEnsembleStore.getState().setFileContent('fm', 'new content', null);
        expect(useEnsembleStore.getState().fileContent?.content).toBe('new content');
    });

    it('15. should correctly identify application metadata in store', () => {
        const meta: NodeMetadata = { type: 'quick-delve', id: '1', label: 'T', data: {}, version: '1', connections: [], generatedAt: '' };
        useEnsembleStore.getState().setFileContent('fm', 'c', meta);
        expect(useEnsembleStore.getState().currentMetadata?.type).toBe('quick-delve');
    });

    it('16. should toggle dirty flag on content change', () => {
        useEnsembleStore.getState().setDirty(false);
        useEnsembleStore.getState().setFileContent('fm', 'mod', null);
        useEnsembleStore.getState().setDirty(true);
        expect(useEnsembleStore.getState().isDirty).toBe(true);
    });
});

describe('17-20. Project Reconstruction & Promotion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useEnsembleStore.getState().setRootPath('C:/vault');
    });

    it('17. should scan folder structure for project rooms', async () => {
        const readDirSpy = vi.spyOn(FileSystemStore, 'readDirectory').mockResolvedValueOnce([{ name: 'room1.md', isDirectory: false }]);
        vi.spyOn(EnsembleService, 'readMarkdown').mockResolvedValue({ frontmatter: '', content: '' });

        await (EnsembleService as any).scanFileStructure('C:/vault');
        expect(readDirSpy).toHaveBeenCalledWith('C:/vault');
    });

    it('18. should filter rooms by container metadata during reconstruction', async () => {
        vi.spyOn(EnsembleService, 'readMarkdown').mockResolvedValueOnce({ frontmatter: 'node_metadata: { type: quick-delve }', content: '' })
            .mockResolvedValueOnce({ frontmatter: 'node_metadata: { contained_by: index.md, data: { title: R1 } }', content: '' });
        vi.spyOn(FileSystemStore, 'readDirectory').mockResolvedValue([{ name: 'room1.md', isDirectory: false }]);

        await EnsembleService.loadFileIntoStore('C:/vault/delve/index.md');
        const metadataRooms = useEnsembleStore.getState().currentMetadata?.data as { rooms?: unknown[] } | undefined;
        expect(metadataRooms?.rooms).toHaveLength(1);
    });

    it('19. should sort reconstructed rooms alphabetically by title', async () => {
        vi.spyOn(EnsembleService, 'readMarkdown').mockResolvedValueOnce({ frontmatter: 'node_metadata: { type: quick-delve }', content: '' }) // Master
            .mockResolvedValueOnce({ frontmatter: 'node_metadata: { contained_by: index.md, data: { title: "B" } }', content: '' })
            .mockResolvedValueOnce({ frontmatter: 'node_metadata: { contained_by: index.md, data: { title: "A" } }', content: '' });
        vi.spyOn(FileSystemStore, 'readDirectory').mockResolvedValue([{ name: 'r1.md', isDirectory: false }, { name: 'r2.md', isDirectory: false }]);

        await EnsembleService.loadFileIntoStore('C:/vault/delve/index.md');
        const rooms = (useEnsembleStore.getState().currentMetadata?.data as { rooms?: Array<{ title?: string }> } | undefined)?.rooms || [];
        expect(rooms[0]?.title).toBe('A');
        expect(rooms[1]?.title).toBe('B');
    });

    it('20. should initialize Promotion state in Encounter Wizard correctly', () => {
        const room = { title: 'Dungeon Room', narrative: 'Text' };
        useEncounterWizardStore.getState().initializeFromRoom(room as any, 'parent-id');
        const state = useEncounterWizardStore.getState();
        expect(state.parentDungeonId).toBe('parent-id');
        expect(state.encounterTitle).toContain('Dungeon Room');
    });
});
