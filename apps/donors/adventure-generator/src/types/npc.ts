
import { z } from 'zod';
import {
    NpcTypeEnum,
    MinorNpcDetailsSchema,
    MajorNpcDetailsSchema,
    CreatureDetailsSchema,
    NpcDetailsSchema,
    NpcSchema,
    SavedMonsterSchema
} from '../schemas/npc'; // Direct import
import { IdSchema } from '../schemas/common'; // Direct import

// Re-export the NpcType enum for use throughout the application
export type NpcType = z.infer<typeof NpcTypeEnum>;

export type MinorNpcDetails = z.infer<typeof MinorNpcDetailsSchema>;
export type MajorNpcDetails = z.infer<typeof MajorNpcDetailsSchema>;
export type CreatureDetails = z.infer<typeof CreatureDetailsSchema>;
export type NpcDetails = z.infer<typeof NpcDetailsSchema>;

export type NPC = z.infer<typeof NpcSchema>;

// Saved Monster (includes origin context)
export type SavedMonster = z.infer<typeof SavedMonsterSchema>;

// Narrative/NPC persona used by Chronicler/Persona tools
export interface NpcPersona {
    name: string;
    race: string;
    role: string;
    alignment: string;
    appearance: string;
    motivations: string;
    personalityTraits: string;
    flaws: string;
    catchphrase: string;
    mannerisms: string;
    speechPatterns: string;
    knowledgeAvailable: string;
    knowledgeSecret: string;
    bonds: string;
    roleplayingCues: string[];
    backstory: string;
    detailedPersonality: string;
    archetype?: string;
    motivation?: string;
    quirk?: string;
    flaw?: string;
}

export interface NpcPersonaSeed {
    archetype: string;
    quirk: string;
    flaw: string;
    motivation: string;
}

export interface NpcMannerisms {
    voice: string;
    phrases: string[];
    mannerisms: string;
}

// --- Monster Index for Lazy Loading ---
// This type is used by the database loader and does not require runtime validation
export interface MonsterIndexEntry {
    id: string;
    name: string;
    type: string;
    size: string;
    cr: string;
    isSrd?: boolean; // Legacy flag, prefer 'source'
    source?: string; // 'srd5.1', 'a5esrd', 'kp-ogl', etc.
}
