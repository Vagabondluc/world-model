import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateEncounterResult } from '../../services/encounterStoreAi';
import { useCombatEncounterStore } from '../../stores/encounters/useCombatEncounterStore';
import { useCombatEncounterV2Store } from '../../stores/encounters/useCombatEncounterV2Store';
import { useCombatEncounterBalancerStore } from '../../stores/encounters/useCombatEncounterBalancerStore';
import { useEncounterGenricBetaStore } from '../../stores/encounters/useEncounterGenricBetaStore';
import { useEncounterdesignV1Store } from '../../stores/encounters/useEncounterdesignV1Store';
import { useEncounterdesignOlderV1Store } from '../../stores/encounters/useEncounterdesignOlderV1Store';
import { useEncounterdesignV1DeprecatedStore } from '../../stores/encounters/useEncounterdesignV1DeprecatedStore';
import { useRpgadventureScenecraftingV1Store } from '../../stores/encounters/useRpgadventureScenecraftingV1Store';
import { useSocialEventStore } from '../../stores/encounters/useSocialEventStore';
import { useTrapPrepStore } from '../../stores/encounters/useTrapPrepStore';
import { useUrbanCrawlStore } from '../../stores/encounters/useUrbanCrawlStore';

vi.mock('../../services/encounterStoreAi', () => ({
    generateEncounterResult: vi.fn()
}));

type StoreShape = {
    getState: () => {
        input: { title?: string; level?: number };
        output: { description?: string } | null;
        isGenerating: boolean;
        error: string | null;
        generate: () => Promise<void>;
    };
    setState: (state: Partial<{ input: { title?: string; level?: number }; output: null | { description?: string }; isGenerating: boolean; error: string | null }>, replace?: boolean) => void;
};

const storeCases: Array<{ label: string; store: StoreShape }> = [
    { label: 'Combat Encounter', store: useCombatEncounterStore },
    { label: 'Combat Encounter V2', store: useCombatEncounterV2Store },
    { label: 'Combat Encounter Balancer', store: useCombatEncounterBalancerStore },
    { label: 'Encounter (Generic Beta)', store: useEncounterGenricBetaStore },
    { label: 'Encounter Design V1', store: useEncounterdesignV1Store },
    { label: 'Encounter Design Older V1', store: useEncounterdesignOlderV1Store },
    { label: 'Encounter Design V1 (Deprecated)', store: useEncounterdesignV1DeprecatedStore },
    { label: 'RPG Adventure Scene Crafting V1', store: useRpgadventureScenecraftingV1Store },
    { label: 'Social Event', store: useSocialEventStore },
    { label: 'Trap Prep', store: useTrapPrepStore },
    { label: 'Urban Crawl', store: useUrbanCrawlStore }
];

describe('Encounter stores AI generation', () => {
    beforeEach(() => {
        vi.mocked(generateEncounterResult).mockReset();
    });

    it.each(storeCases)('uses encounter AI helper for %s', async ({ label, store }) => {
        vi.mocked(generateEncounterResult).mockResolvedValue({ description: 'ok' });
        store.setState({ input: { title: 'Test Encounter', level: 3 }, output: null, isGenerating: false, error: null });

        await store.getState().generate();

        expect(generateEncounterResult).toHaveBeenCalledWith(
            { title: 'Test Encounter', level: 3 },
            expect.anything(),
            label
        );
        expect(store.getState().output).toEqual({ description: 'ok' });
        expect(store.getState().isGenerating).toBe(false);
        expect(store.getState().error).toBe(null);
    });
});
