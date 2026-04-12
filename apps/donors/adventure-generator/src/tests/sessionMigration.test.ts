import { describe, it, expect } from 'vitest';
import { migrateSession } from '../services/sessionMigration';
import type { SessionStateV2 } from '../types/session';

const makeFallbackSession = (): SessionStateV2 => ({
    version: 2,
    campaignState: {
        config: {},
        activeView: 'adventure',
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

describe('migrateSession', () => {
    it('returns v2 data without warnings when valid', () => {
        const fallback = makeFallbackSession();
        const { session, warnings } = migrateSession(fallback, fallback);
        expect(warnings).toEqual([]);
        expect(session).toEqual(fallback);
    });

    it('upgrades unknown versions to v2 with warnings', () => {
        const fallback = makeFallbackSession();
        const raw = { version: 1 };
        const { session, warnings } = migrateSession(raw, fallback);
        expect(session.version).toBe(2);
        expect(warnings.length).toBeGreaterThan(0);
    });

    it('falls back on invalid slices and emits warnings', () => {
        const fallback = makeFallbackSession();
        const raw = {
            version: 1,
            campaignState: { config: {}, activeView: 'adventure' },
            locationState: 'not-an-object',
            compendiumState: { loreEntries: [], compendiumEntries: [] },
            generatorState: {},
        };
        const { session, warnings } = migrateSession(raw, fallback);
        expect(session.locationState).toEqual(fallback.locationState);
        expect(session.generatorState).toEqual(fallback.generatorState);
        expect(warnings.length).toBeGreaterThan(0);
    });

    it('handles non-object payloads with safe fallback', () => {
        const fallback = makeFallbackSession();
        const { session, warnings } = migrateSession('oops', fallback);
        expect(session).toEqual(fallback);
        expect(warnings.length).toBeGreaterThan(0);
    });
});
