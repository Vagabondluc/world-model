import { describe, it, expect } from 'vitest';
import { SessionStateV2Schema } from '../../schemas/session';

const buildValidSessionState = () => ({
    version: 2 as const,
    campaignState: {
        config: {},
        activeView: 'default',
        bestiary: [],
        biomeData: {},
    },
    locationState: {
        maps: {},
        activeMapId: null,
        locations: {},
        regions: {},
        layers: {},
        viewSettings: {},
    },
    compendiumState: {
        loreEntries: [],
        compendiumEntries: [],
    },
    generatorState: {
        matrix: null,
        adventures: [],
        selectedHook: null,
        currentAdventureCompendiumIds: [],
        activeDelve: null,
        delveView: 'setup',
        currentConcepts: [],
        activeRoomId: null,
        activeTraps: [],
        npcPersonas: [],
        encounterDesigns: [],
        context: '',
        generationMethod: 'arcane',
        combinationMethod: '',
        primaryPlot: '',
        primaryTwist: '',
        secondaryPlot: '',
        secondaryTwist: '',
        sceneCount: 0,
        sceneTypes: {
            Exploration: false,
            Combat: false,
            'NPC Interaction': false,
            Dungeon: false,
        },
        generationHistory: [],
        searchQuery: '',
        filterLocationId: '',
        filterFactionId: '',
    },
});

describe('SessionStateV2Schema', () => {
    it('accepts a minimal valid session payload', () => {
        const sessionState = buildValidSessionState();
        const result = SessionStateV2Schema.safeParse(sessionState);
        expect(result.success).toBe(true);
    });

    it('rejects payloads missing generator state fields', () => {
        const sessionState = buildValidSessionState() as any;
        delete sessionState.generatorState.npcPersonas;
        const result = SessionStateV2Schema.safeParse(sessionState);
        expect(result.success).toBe(false);
    });
});
