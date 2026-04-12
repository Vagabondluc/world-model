import { create } from 'zustand';
import { GeneratorState, LoadingState, DetailingEntity } from '../schemas';
import { GeneratedAdventure } from '../schemas';
import { useCampaignStore } from './campaignStore';
import { useCompendiumStore } from './compendiumStore';
import { useGeneratorConfigStore } from './generatorConfigStore';
import { useAdventureDataStore } from './adventureDataStore';
import { useHistoryStore } from './historyStore';
import { getErrorMessage } from '../utils/helpers';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { processOutlineData } from '../utils/outlineHelpers';
import { commitOutline } from '../utils/workflowHelpers';
import { 
    generateHooks as generateHooksHandler,
    developScene as developSceneHandler,
    developLocation as developLocationHandler,
    developNpc as developNpcHandler,
    developFaction as developFactionHandler
} from '../services/adventureHandlers';
import {
    refineHooksStrategy,
    generateOutlineStrategy,
    generateFullOutlineStrategy
} from '../services/adventureGenerators';

type DevelopHandler = (
    api: ImprovedAdventureAPIService,
    entry: ReturnType<typeof useCompendiumStore.getState>['compendiumEntries'][number],
    config: ReturnType<typeof useCampaignStore.getState>['config'],
    context: string,
    currentContext: string,
    opts?: { creatureRole?: string }
) => Promise<unknown>;

const createDevelopHandler = (
    type: DetailingEntity['type'],
    handler: DevelopHandler,
    errorLabel: string,
    set: (
        partial:
            | Partial<WorkflowState & WorkflowActions>
            | ((state: WorkflowState & WorkflowActions) => Partial<WorkflowState & WorkflowActions>)
    ) => void
) => {
    return async (api: ImprovedAdventureAPIService, id: string, ctx: string, opts?: { creatureRole?: string }) => {
        set(s => ({ loading: { ...s.loading, details: { type, id } }, error: null }));
        try {
            const { config } = useCampaignStore.getState();
            const entry = useCompendiumStore.getState().compendiumEntries.find(e => e.id === id);
            if (!entry) throw new Error("Entry not found");
            const details = await handler(api, entry, config, useGeneratorConfigStore.getState().context, ctx, opts);
            useCompendiumStore.getState().updateCompendiumEntry({ ...entry, fullContent: JSON.stringify(details), lastModified: new Date() });
        } catch (e) {
            set({ error: getErrorMessage(e as Error, errorLabel) });
        } finally {
            set(s => ({ loading: { ...s.loading, details: null } }));
        }
    };
};

export interface WorkflowState {
    step: GeneratorState['step'];
    loading: LoadingState;
    error: string | null;
    detailingEntity: DetailingEntity;
}

export interface WorkflowActions {
    setStep: (step: GeneratorState['step']) => void;
    setLoading: (loading: Partial<LoadingState>) => void;
    setError: (error: string | null) => void;
    setDetailingEntity: (entity: DetailingEntity) => void;
    reset: (keepContext: boolean) => void;
    generateHooks: (apiService: ImprovedAdventureAPIService) => Promise<void>;
    refineHooks: (apiService: ImprovedAdventureAPIService) => Promise<void>;
    generateOutline: (apiService: ImprovedAdventureAPIService, hook: GeneratedAdventure) => Promise<void>;
    generateFullOutline: (apiService: ImprovedAdventureAPIService) => Promise<void>;
    developFaction: (apiService: ImprovedAdventureAPIService, factionId: string, ctx: string) => Promise<void>;
    developLocation: (apiService: ImprovedAdventureAPIService, locationId: string, ctx: string) => Promise<void>;
    developNpc: (apiService: ImprovedAdventureAPIService, npcId: string, ctx: string, opts?: { creatureRole?: string }) => Promise<void>;
    developScene: (apiService: ImprovedAdventureAPIService, sceneId: string, ctx: string) => Promise<void>;
}

const initialState: WorkflowState = {
    step: 'initial',
    loading: { hooks: false, refining: false, outline: false, details: null, statblock: null },
    error: null,
    detailingEntity: null,
};

export const useWorkflowStore = create<WorkflowState & WorkflowActions>((set, get) => ({
    ...initialState,
    setStep: (step) => set({ step }),
    setLoading: (loading) => set(state => ({ loading: { ...state.loading, ...loading } })),
    setError: (error) => set({ error }),
    setDetailingEntity: (entity) => set({ detailingEntity: entity }),
    reset: (keepContext) => {
        set(initialState);
        useGeneratorConfigStore.getState().reset(keepContext);
    },
    generateHooks: async (api) => {
        set(s => ({ loading: { ...s.loading, hooks: true }, error: null }));
        try {
            const { config } = useCampaignStore.getState();
            const { context } = useGeneratorConfigStore.getState();
            const { adventures, matrix } = await generateHooksHandler(api, config, context);
            useAdventureDataStore.setState({ adventures, matrix, currentAdventureCompendiumIds: [] });
            useHistoryStore.getState().addHistoryEntry('hooks', { adventures, matrix }, 'Generated Hooks');
            set({ step: 'hooks' });
        } catch (e) {
            set({ error: getErrorMessage(e as Error, 'generating hooks') });
        } finally {
            set(s => ({ loading: { ...s.loading, hooks: false } }));
        }
    },
    refineHooks: async (api) => {
        set(s => ({ loading: { ...s.loading, refining: true }, error: null }));
        try {
            const { config } = useCampaignStore.getState();
            const { context } = useGeneratorConfigStore.getState();
            const { matrix } = useAdventureDataStore.getState();
            if (!matrix) throw new Error("No hook matrix available to refine.");
            const adventures = await refineHooksStrategy(api, config, context, matrix);
            useAdventureDataStore.setState({ adventures });
            useHistoryStore.getState().addHistoryEntry('hooks', { adventures, matrix }, 'Refined Hooks');
        } catch (e) {
            set({ error: getErrorMessage(e as Error, 'refining hooks') });
        } finally {
            set(s => ({ loading: { ...s.loading, refining: false } }));
        }
    },
    generateOutline: async (api, hook) => {
        set(s => ({ loading: { ...s.loading, outline: true }, error: null }));
        try {
            const { config } = useCampaignStore.getState();
            const { context } = useGeneratorConfigStore.getState();
            const outlineData = await generateOutlineStrategy(api, config, context, hook);
            const { newScenes, newLocations, newNpcs, newFactions } = processOutlineData(outlineData);
            commitOutline({ newScenes, newLocations, newNpcs, newFactions, selectedHook: hook });
            set({ step: 'outline' });
        } catch (e) {
            set({ error: getErrorMessage(e as Error, 'generating outline') });
        } finally {
            set(s => ({ loading: { ...s.loading, outline: false } }));
        }
    },
    generateFullOutline: async (api) => {
        set(s => ({ loading: { ...s.loading, outline: true }, error: null }));
        try {
            const { config } = useCampaignStore.getState();
            const generatorConfig = useGeneratorConfigStore.getState();
            const outlineData = await generateFullOutlineStrategy(api, config, generatorConfig.context, {
                primaryPlot: generatorConfig.primaryPlot,
                primaryTwist: generatorConfig.primaryTwist,
                combinationMethod: generatorConfig.combinationMethod,
                secondaryPlot: generatorConfig.secondaryPlot,
                secondaryTwist: generatorConfig.secondaryTwist,
                sceneCount: generatorConfig.sceneCount,
                sceneTypes: generatorConfig.sceneTypes,
            });
            const { newScenes, newLocations, newNpcs, newFactions } = processOutlineData(outlineData);
            commitOutline({ newScenes, newLocations, newNpcs, newFactions, selectedHook: useAdventureDataStore.getState().selectedHook });
            set({ step: 'outline' });
        } catch (e) {
            set({ error: getErrorMessage(e as Error, 'generating full outline') });
        } finally {
            set(s => ({ loading: { ...s.loading, outline: false } }));
        }
    },
    developFaction: createDevelopHandler('faction', developFactionHandler, 'developing faction', set),
    developLocation: createDevelopHandler('location', developLocationHandler, 'developing location', set),
    developNpc: createDevelopHandler('npc', developNpcHandler, 'developing npc', set),
    developScene: createDevelopHandler('scene', developSceneHandler, 'developing scene', set),
}));
