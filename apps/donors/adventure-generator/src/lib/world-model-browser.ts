import type { CampaignStateExport } from '../types/campaign';
import type { CompendiumStateExport } from '../types/compendium';
import type { AdventureDataStateExport, GeneratorStateCleaned, GenerationHistory } from '../types/generator';
import type { LocationStateExport, ManagedLocation, Region, WorldMap, HexCoordinate } from '../types/location';
import type { GeneratedAdventure } from '../schemas/adventure';
import type { Delve } from '../types/delve';
import type { GeneratedTrap } from '../types/trap';
import type { NpcPersona } from '../types/npc';
import type { EncounterTactic } from '../types/encounter';

export interface AdventureWorkflowStateSnapshot {
  step: 'initial' | 'hooks' | 'outline' | 'delve';
  loading?: {
    hooks: boolean;
    refining: boolean;
    outline: boolean;
    details: { type: string; id: string } | null;
    statblock: string | null;
  };
  error?: string | null;
  detailingEntity?: { type: 'scene' | 'location' | 'npc' | 'faction'; id: string } | null;
}

export interface AdventureSessionSnapshot {
  campaignState: CampaignStateExport;
  locationState: LocationStateExport;
  compendiumState: CompendiumStateExport;
  generatorState: AdventureDataStateExport & Partial<GeneratorStateCleaned>;
  workflowState?: AdventureWorkflowStateSnapshot;
}

export type AdventureWorldModelResponse = {
  command_id: string;
  status: 'Applied' | 'Rejected';
  bundle: {
    world: { payload?: Partial<AdventureSessionSnapshot> | null } | null;
    entities: Record<string, { entity_type: string; payload: unknown }>;
    assets: Record<string, { asset_kind: string; payload: unknown }>;
    workflows: Record<string, unknown>;
    relations: unknown[];
    events: Array<{ event_type: string; payload: { inline_payload?: unknown | null } }>;
    projections: Record<string, unknown>;
    migrations: unknown[];
  };
  event_deltas: unknown[];
  projection_deltas: unknown[];
  migration_deltas: unknown[];
  warnings: string[];
  issues: Array<{ code: string; message: string; path?: string | null }>;
};

export function hydrateAdventureWorldState(
  response: AdventureWorldModelResponse,
  currentAdventureState: AdventureDataStateExport & Partial<GeneratorStateCleaned>,
  currentLocationState: LocationStateExport
): {
  adventureState: Partial<AdventureDataStateExport & Partial<GeneratorStateCleaned>>;
  locationState: Partial<LocationStateExport>;
} {
  const payload = (response.bundle.world?.payload as Record<string, unknown> | undefined) ?? {};
  const session = payload as Partial<AdventureSessionSnapshot>;
  const currentGeneratorState = currentAdventureState as Partial<GeneratorStateCleaned>;

  const locations = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'location')
    .map((entity) => entity.payload as ManagedLocation);
  const regions = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'region')
    .map((entity) => entity.payload as Region);
  const adventures = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'adventure-hook')
    .map((entity) => entity.payload as GeneratedAdventure);
  const delve = Object.values(response.bundle.entities)
    .find((entity) => entity.entity_type === 'delve')?.payload as Delve | undefined;
  const traps = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'trap')
    .map((entity) => entity.payload as GeneratedTrap);
  const personas = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'npc-persona')
    .map((entity) => entity.payload as NpcPersona);
  const encounterDesigns = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'encounter-design')
    .map((entity) => entity.payload as EncounterTactic);
  const maps = Object.values(response.bundle.assets)
    .filter((asset: any) => asset.asset_kind === 'world-map')
    .reduce<Record<string, WorldMap>>((acc, asset: any) => {
      const map = asset.payload as WorldMap;
      acc[map.id] = map;
      return acc;
    }, {});
  const layers = Object.values(response.bundle.assets)
    .filter((asset: any) => asset.asset_kind === 'map-layer')
    .reduce<Record<string, any>>((acc, asset: any) => {
      const layer = asset.payload as any;
      acc[layer.id] = layer;
      return acc;
    }, {});
  const activeMapId = session.locationState?.activeMapId ?? currentLocationState.activeMapId ?? null;
  const generationHistory = response.bundle.events
    .filter((event) => event.event_type.startsWith('generation.history.'))
    .map((event) => event.payload.inline_payload as GenerationHistory)
    .filter(Boolean);

  return {
    adventureState: {
      adventures: adventures.length > 0 ? adventures : currentAdventureState.adventures,
      selectedHook: session.generatorState?.selectedHook ?? currentAdventureState.selectedHook,
      currentAdventureCompendiumIds: session.generatorState?.currentAdventureCompendiumIds ?? currentAdventureState.currentAdventureCompendiumIds,
      activeDelve: delve ?? currentAdventureState.activeDelve,
      delveView: session.generatorState?.delveView ?? currentAdventureState.delveView,
      currentConcepts: session.generatorState?.currentConcepts ?? currentAdventureState.currentConcepts,
      activeRoomId: session.generatorState?.activeRoomId ?? currentAdventureState.activeRoomId,
      activeTraps: traps.length > 0 ? traps : currentAdventureState.activeTraps,
      npcPersonas: personas.length > 0 ? personas : currentAdventureState.npcPersonas,
      encounterDesigns: encounterDesigns.length > 0 ? encounterDesigns : currentAdventureState.encounterDesigns,
      matrix: session.generatorState?.matrix ?? currentAdventureState.matrix,
      context: session.generatorState?.context ?? '',
      generationMethod: session.generatorState?.generationMethod ?? 'arcane',
      combinationMethod: session.generatorState?.combinationMethod ?? '',
      primaryPlot: session.generatorState?.primaryPlot ?? '',
      primaryTwist: session.generatorState?.primaryTwist ?? '',
      secondaryPlot: session.generatorState?.secondaryPlot ?? '',
      secondaryTwist: session.generatorState?.secondaryTwist ?? '',
      sceneCount: session.generatorState?.sceneCount ?? 0,
      sceneTypes:
        session.generatorState?.sceneTypes ??
        currentGeneratorState.sceneTypes ??
        {
          Exploration: false,
          Combat: false,
          'NPC Interaction': false,
          Dungeon: false,
        },
      generationHistory: generationHistory.length > 0 ? generationHistory : currentGeneratorState.generationHistory ?? [],
      searchQuery: session.generatorState?.searchQuery ?? '',
      filterLocationId: session.generatorState?.filterLocationId ?? '',
      filterFactionId: session.generatorState?.filterFactionId ?? '',
    },
    locationState: {
      maps,
      activeMapId,
      locations: Object.fromEntries(locations.map((location) => [location.id, location])),
      regions: Object.fromEntries(regions.map((region) => [region.id, region])),
      layers,
      viewSettings: (session.locationState?.viewSettings ?? currentLocationState.viewSettings) as LocationStateExport['viewSettings'],
    },
  };
}
