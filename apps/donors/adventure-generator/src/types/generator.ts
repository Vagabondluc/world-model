
import { z } from 'zod';
import { LoadingState, GenerationHistory } from '../schemas/generator';
import { GeneratedAdventure } from '../schemas/adventure';
import { SceneTypeEnum } from '../schemas/common';
import { Scene } from '../schemas/scene';
import { Location } from '../schemas/location';
import { NPC } from '../schemas/npc';
import { Faction } from '../schemas/faction';
import { Delve, DelveViewState, DelveConcept } from './delve';
import { GeneratedTrap } from './trap';
import { NpcPersona } from './npc';
import { EncounterTactic } from './encounter';

// --- Re-exports ---
export type { LoadingState, GenerationHistory };

export type SimpleAdventureDetails = {
    origin: string;
    positioning: string;
    stakes: string;
};

// --- Export State Interfaces (Decoupled from Stores) ---

export interface AdventureDataStateExport {
    matrix: number[][] | null;
    adventures: GeneratedAdventure[];
    selectedHook: GeneratedAdventure | null;
    currentAdventureCompendiumIds: string[];
    activeDelve: Delve | null;
    delveView: DelveViewState;
    currentConcepts: DelveConcept[];
    activeRoomId: string | null;
    activeTraps: GeneratedTrap[];
    npcPersonas: NpcPersona[];
    encounterDesigns: EncounterTactic[];
}

export interface ConfigStateExport {
    context: string;
    generationMethod: 'arcane' | 'pattern' | 'delve';
    combinationMethod: string;
    primaryPlot: string;
    primaryTwist: string;
    secondaryPlot: string;
    secondaryTwist: string;
    sceneCount: number;
    sceneTypes: Record<z.infer<typeof SceneTypeEnum>, boolean>;
}

export interface HistoryStateExport {
    generationHistory: GenerationHistory[];
}

export interface HubFiltersStateExport {
    searchQuery: string;
    filterLocationId: string;
    filterFactionId: string;
}

export type GeneratorStateCleaned = AdventureDataStateExport & ConfigStateExport & HistoryStateExport & HubFiltersStateExport;

// Legacy aliases for backward compatibility
export interface GeneratorState extends GeneratorStateCleaned {
    step: 'initial' | 'hooks' | 'outline' | 'delve';
    loading: LoadingState;
    error: string | null;
    detailingEntity: DetailingEntity;

    // Redundant fields from merged types kept for legacy type safety if needed
    adventureOutline: Scene[];
    locations: Location[];
    npcs: NPC[];
    factions: Faction[];
}

export type AdventureState = GeneratorState;
export type AdventureAction = unknown;

export type DetailingEntity = {
    type: 'scene' | 'location' | 'npc' | 'faction';
    id: string;
} | null;
