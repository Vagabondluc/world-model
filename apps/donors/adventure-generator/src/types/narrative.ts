export type NarrativeScriptCategory = 'Adventure' | 'NPC' | 'Location' | 'Encounter' | 'Trap' | 'Mystery' | 'Dungeon' | 'Other';

export interface NarrativeScriptMetadata {
    id: string;
    title: string;
    description: string;
    category: NarrativeScriptCategory;
    filePath: string;
    version?: string;
    tags?: string[];
}

export type NarrativeScriptViewMode = 'hub' | 'detail' | 'architect';
