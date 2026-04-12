import { FileSystemStore } from './fileSystemStore';
import { useAdventureDataStore } from '../stores/adventureDataStore';
import { useCampaignStore } from '../stores/campaignStore';
import { useCompendiumStore } from '../stores/compendiumStore';
import { useGeneratorConfigStore } from '../stores/generatorConfigStore';
import { useHistoryStore } from '../stores/historyStore';
import { useHubFiltersStore } from '../stores/hubFiltersStore';
import { useLocationStore } from '../stores/locationStore';
import { useNavigationStore } from '../stores/navigationStore';
import { useWorkflowStore } from '../stores/workflowStore';
import { DEFAULT_CAMPAIGN_CONFIG } from '../data/constants';
import {
    hydrateAdventureWorldState,
    type AdventureWorldModelResponse,
    type AdventureSessionSnapshot,
    type AdventureWorkflowStateSnapshot,
} from '../lib/world-model-browser';
import type { CampaignStateExport } from '../types/campaign';
import type { CompendiumStateExport } from '../types/compendium';
import type { GeneratorStateCleaned } from '../types/generator';
import type { LocationStateExport } from '../types/location';
import type { SessionStateV2 } from '../types/session';

export const ADVENTURE_WORLD_MODEL_DIR = 'world-model';
export const ADVENTURE_WORLD_MODEL_FILE = `${ADVENTURE_WORLD_MODEL_DIR}/session.bundle.json`;

export function buildAdventureSessionSnapshot(sessionState: SessionStateV2): AdventureSessionSnapshot {
    return {
        campaignState: sessionState.campaignState,
        locationState: sessionState.locationState,
        compendiumState: sessionState.compendiumState,
        generatorState: sessionState.generatorState,
    };
}

export function isAdventureWorldModelResponse(value: unknown): value is AdventureWorldModelResponse {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as Partial<AdventureWorldModelResponse> & { bundle?: unknown; status?: unknown };
    return typeof candidate.command_id === 'string' && typeof candidate.status === 'string' && !!candidate.bundle;
}

export async function saveAdventureWorldModelBundle(
    rootPath: string,
    sessionState: SessionStateV2,
    workflowState?: AdventureWorkflowStateSnapshot | null
): Promise<AdventureWorldModelResponse> {
    const { syncAdventureWorldModel } = await import('../lib/world-model');
    const response = syncAdventureWorldModel({
        ...buildAdventureSessionSnapshot(sessionState),
        workflowState: workflowState ?? undefined,
    });

    await FileSystemStore.ensureDir(`${rootPath}/${ADVENTURE_WORLD_MODEL_DIR}`);
    await FileSystemStore.writeFileContent(
        `${rootPath}/${ADVENTURE_WORLD_MODEL_FILE}`,
        JSON.stringify(response, null, 2)
    );

    return response;
}

export async function saveAdventureWorldModelBackup(
    rootPath: string,
    sessionState: SessionStateV2,
    workflowState?: AdventureWorkflowStateSnapshot | null
): Promise<string> {
    const { syncAdventureWorldModel } = await import('../lib/world-model');
    const response = syncAdventureWorldModel({
        ...buildAdventureSessionSnapshot(sessionState),
        workflowState: workflowState ?? undefined,
    });

    const backupsDir = `${rootPath}/backups`;
    await FileSystemStore.ensureDir(backupsDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${backupsDir}/session_world_model_${timestamp}.json`;
    await FileSystemStore.writeFileContent(backupPath, JSON.stringify(response, null, 2));
    return backupPath;
}

export async function loadAdventureWorldModelResponse(rootPath: string): Promise<AdventureWorldModelResponse | null> {
    const filePath = `${rootPath}/${ADVENTURE_WORLD_MODEL_FILE}`;
    if (!await FileSystemStore.fileExists(filePath)) return null;

    const content = await FileSystemStore.readFileContent(filePath);
    try {
        const raw = JSON.parse(content) as unknown;
        return isAdventureWorldModelResponse(raw) ? raw : null;
    } catch (error) {
        console.error('Failed to parse canonical adventure world-model bundle', error);
        return null;
    }
}

export function hydrateAdventureSessionStateFromResponse(
    response: AdventureWorldModelResponse,
    fallbackSession: SessionStateV2
): SessionStateV2 {
    const payload = (response.bundle.world?.payload as Partial<AdventureSessionSnapshot> | undefined) ?? {};
    const hydrated = hydrateAdventureWorldState(
        response,
        fallbackSession.generatorState,
        fallbackSession.locationState
    );

    const campaignState: CampaignStateExport = {
        ...(payload.campaignState ?? fallbackSession.campaignState),
        activeView: 'adventure',
    };

    const locationState: LocationStateExport = {
        ...fallbackSession.locationState,
        ...(payload.locationState ?? {}),
        ...hydrated.locationState,
    };

    const compendiumState: CompendiumStateExport = {
        ...(payload.compendiumState ?? fallbackSession.compendiumState),
    };

    const generatorState: GeneratorStateCleaned = {
        ...fallbackSession.generatorState,
        ...(payload.generatorState ?? {}),
        ...hydrated.adventureState,
    } as GeneratorStateCleaned;

    return {
        version: 2,
        campaignState,
        locationState,
        compendiumState,
        generatorState,
    };
}

export async function loadAdventureWorldModelSession(
    rootPath: string,
    fallbackSession: SessionStateV2
): Promise<SessionStateV2 | null> {
    const response = await loadAdventureWorldModelResponse(rootPath);
    if (!response) return null;
    return hydrateAdventureSessionStateFromResponse(response, fallbackSession);
}

export function applyAdventureSessionState(sessionState: SessionStateV2): void {
    const campaignState = {
        ...DEFAULT_CAMPAIGN_CONFIG,
        ...sessionState.campaignState.config,
    };
    const biomeEntries = Object.entries(sessionState.campaignState.biomeData ?? {}).map(([key, value]) => ([
        key,
        { creatureIds: value?.creatureIds ?? [] }
    ]));

    useCampaignStore.getState().importState({
        ...sessionState.campaignState,
        config: campaignState,
        activeView: 'adventure',
        biomeData: Object.fromEntries(biomeEntries),
    });

    useLocationStore.getState().importState(sessionState.locationState);
    useCompendiumStore.getState().importState(sessionState.compendiumState);
    useAdventureDataStore.getState().importState(sessionState.generatorState);
    useGeneratorConfigStore.getState().importState(sessionState.generatorState);
    useHistoryStore.getState().importState(sessionState.generatorState);
    useHubFiltersStore.getState().importState(sessionState.generatorState);

    useNavigationStore.getState().resetNavigation('adventure');
    useWorkflowStore.setState({
        step: 'initial',
        loading: { hooks: false, refining: false, outline: false, details: null, statblock: null },
        error: null,
        detailingEntity: null,
    });
    useCampaignStore.getState().closeDrawer();
}
