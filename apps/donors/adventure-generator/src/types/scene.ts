export type SceneTypeOption = 'Exploration' | 'Combat' | 'NPC Interaction' | 'Dungeon';

export interface SceneDetails {
    introduction: string;
    interactionPoints: string[];
    npcs: { name: string; description: string; motivation: string; }[];
    dmNotes: string;
}

export interface Scene {
    id: string;
    title: string;
    type: SceneTypeOption;
    challenge: string;
    locationId?: string;
    details?: SceneDetails;
}
