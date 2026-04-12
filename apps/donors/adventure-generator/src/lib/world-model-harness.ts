import type { AdventureDataStateExport, GeneratorStateCleaned, GenerationHistory } from '../types/generator';
import type { CampaignStateExport } from '../types/campaign';
import type { CompendiumStateExport } from '../types/compendium';
import type { LocationStateExport, WorldMap, ManagedLocation, Region, MapLayer, HexCoordinate } from '../types/location';

import { syncAdventureWorldModel, hydrateAdventureWorldState, type AdventureSessionSnapshot } from './world-model';

export interface AdventureWorldModelHarnessResult {
  response: ReturnType<typeof syncAdventureWorldModel>;
  hydratedState: ReturnType<typeof hydrateAdventureWorldState>;
}

function buildCampaignState(): CampaignStateExport {
  return {
    config: {
      language: 'en',
      genre: 'fantasy',
      ruleset: '5e',
      crRange: '1-5',
      tone: 'heroic',
      complexity: 'standard',
      artStyle: 'classic',
      narrativeTechniques: [],
      narrativeIntegration: '',
      worldInformation: '',
      playerInformation: '',
      npcInformation: '',
      worldName: 'Adventure Harness World',
      theme: 'parchment',
    },
    activeView: 'world',
    bestiary: [],
    biomeData: {},
  };
}

function buildLocationState(): LocationStateExport {
  const hex: HexCoordinate = { q: 0, r: 0, s: 0 };
  const map: WorldMap = {
    id: 'map-1',
    name: 'Harness Map',
    description: 'Round-trip harness map',
    imageUrl: '',
    createdAt: new Date('2026-04-02T00:00:00.000Z'),
    lastModified: new Date('2026-04-02T00:00:00.000Z'),
    layerOrder: [],
    radius: 10,
  };
  const location: ManagedLocation = {
    id: 'loc-1',
    name: 'First Gate',
    description: 'Harness location',
    type: 'Dungeon',
    biome: 'forest',
    hexCoordinate: hex,
    mapId: 'map-1',
    associatedMapId: null,
    customTags: ['harness'],
    connectedLocations: [],
  } as ManagedLocation;
  const region: Region = {
    id: 'region-1',
    name: 'Harness Region',
    description: 'Harness region',
    mapId: 'map-1',
    politicalControl: 'Independent',
    dangerLevel: 2,
    dominantBiome: 'forest',
    keyFeatures: ['gate'],
    color: '#ffffff',
  } as Region;
  const layer: MapLayer = {
    id: 'layer-1',
    mapId: 'map-1',
    name: 'Surface',
    type: 'surface',
    visible: true,
    opacity: 1,
    data: {
      hexBiomes: {},
      revealedHexes: {},
      regions: ['region-1'],
      locations: ['loc-1'],
    },
    theme: {
      mode: 'surface',
      biomePalette: 'standard',
      backgroundColor: '#000000',
      patternSet: 'default',
    },
  };

  return {
    maps: { 'map-1': map },
    activeMapId: 'map-1',
    locations: { 'loc-1': location },
    regions: { 'region-1': region },
    layers: { 'layer-1': layer },
    viewSettings: {},
  };
}

function buildGeneratorState(): AdventureDataStateExport & Partial<GeneratorStateCleaned> {
  const history: GenerationHistory[] = [
    {
      id: 'history-1',
      type: 'hooks',
      label: 'Harness hook generation',
      timestamp: new Date('2026-04-02T00:00:00.000Z'),
      data: {
        adventures: [],
        matrix: [[1]],
      },
    },
  ];

  return {
    matrix: [[1]],
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
    context: 'Harness context',
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
    generationHistory: history,
    searchQuery: '',
    filterLocationId: '',
    filterFactionId: '',
  };
}

function buildSessionSnapshot(): AdventureSessionSnapshot {
  return {
    campaignState: buildCampaignState(),
    locationState: buildLocationState(),
    compendiumState: {
      loreEntries: [],
      compendiumEntries: [],
    } as CompendiumStateExport,
    generatorState: buildGeneratorState(),
    workflowState: {
      step: 'initial',
      loading: {
        hooks: false,
        refining: false,
        outline: false,
        details: null,
        statblock: null,
      },
      error: null,
      detailingEntity: null,
    },
  };
}

export function createAdventureWorldModelHarnessSession(): AdventureSessionSnapshot {
  return buildSessionSnapshot();
}

export function roundTripAdventureWorldModel(session: AdventureSessionSnapshot = buildSessionSnapshot()): AdventureWorldModelHarnessResult {
  const response = syncAdventureWorldModel(session);
  return {
    response,
    hydratedState: hydrateAdventureWorldState(
      response,
      session.generatorState as AdventureDataStateExport & Partial<GeneratorStateCleaned>,
      session.locationState
    ),
  };
}
