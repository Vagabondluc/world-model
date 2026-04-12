import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DEFAULT_CAMPAIGN_CONFIG } from '../../data/constants';
import {
    developScene,
    developLocation,
    developNpc,
    developFaction
} from '../../services/adventureHandlers';
import {
    SceneDetailsSchema,
    DungeonDetailsSchema,
    BattlemapDetailsSchema,
    SettlementDetailsSchema,
    SpecialLocationDetailsSchema,
    MinorNpcDetailsSchema,
    MajorNpcDetailsSchema,
    CreatureDetailsSchema,
    FactionDetailsSchema
} from '../../schemas';
import type { CompendiumEntry } from '../../types/compendium';

const makeEntry = (overrides: Partial<CompendiumEntry> = {}): CompendiumEntry => ({
    id: 'entry-1',
    category: 'location',
    title: 'Test Entry',
    content: 'content',
    tags: ['Special Location'],
    ...overrides
});

describe('adventureHandlers entity development', () => {
    const apiService = {
        generateStructuredContent: vi.fn()
    } as any;

    beforeEach(() => {
        apiService.generateStructuredContent.mockReset().mockResolvedValue({});
    });

    it('developScene uses SceneDetailsSchema', async () => {
        const entry = makeEntry({ category: 'event' });
        await developScene(apiService, entry, DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'scene ctx');

        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.stringContaining('Develop the scene'),
            SceneDetailsSchema,
            expect.any(String),
            expect.any(String)
        );
    });

    it('developLocation selects schema by location tag', async () => {
        await developLocation(apiService, makeEntry({ tags: ['Dungeon'] }), DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'loc ctx');
        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.any(String),
            DungeonDetailsSchema,
            expect.any(String),
            expect.any(String)
        );

        await developLocation(apiService, makeEntry({ tags: ['Battlemap'] }), DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'loc ctx');
        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.any(String),
            BattlemapDetailsSchema,
            expect.any(String),
            expect.any(String)
        );

        await developLocation(apiService, makeEntry({ tags: ['Settlement'] }), DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'loc ctx');
        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.any(String),
            SettlementDetailsSchema,
            expect.any(String),
            expect.any(String)
        );

        await developLocation(apiService, makeEntry({ tags: [] }), DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'loc ctx');
        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.any(String),
            SpecialLocationDetailsSchema,
            expect.any(String),
            expect.any(String)
        );
    });

    it('developNpc selects schema by npc tag', async () => {
        await developNpc(apiService, makeEntry({ category: 'npc', tags: ['Creature'] }), DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'npc ctx');
        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.any(String),
            CreatureDetailsSchema,
            expect.any(String),
            expect.any(String)
        );

        await developNpc(apiService, makeEntry({ category: 'npc', tags: ['Major'] }), DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'npc ctx');
        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.any(String),
            MajorNpcDetailsSchema,
            expect.any(String),
            expect.any(String)
        );

        await developNpc(apiService, makeEntry({ category: 'npc', tags: [] }), DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'npc ctx');
        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.any(String),
            MinorNpcDetailsSchema,
            expect.any(String),
            expect.any(String)
        );
    });

    it('developFaction uses FactionDetailsSchema', async () => {
        const entry = makeEntry({ category: 'faction', tags: ['Faction'] });
        await developFaction(apiService, entry, DEFAULT_CAMPAIGN_CONFIG, 'ctx', 'faction ctx');

        expect(apiService.generateStructuredContent).toHaveBeenCalledWith(
            expect.stringContaining('Develop the faction'),
            FactionDetailsSchema,
            expect.any(String),
            expect.any(String)
        );
    });
});
