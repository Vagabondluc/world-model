
export type DelveTheme = 'crypt' | 'ruin' | 'cavern' | 'tower' | 'sewer' | 'haunted_mansion';

export type DelveRoomType = 'guardian' | 'puzzle' | 'trick' | 'climax' | 'reward';

export type MonsterTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface SensoryPackage {
    sound: string;
    smell: string;
    feel: string;
}

export interface MechanicsPackage {
    encounter?: {
        monsters: string[];
        difficulty: string;
        xp?: number;
    };
    trap?: {
        name?: string;
        trigger: string;
        effect: string;
        dc: number; // Saving Throw DC
        spotDC: number; // Passive Perception / Investigation DC
        disarmDC: number; // Thieves' Tools / Sleight of Hand DC
    };
    puzzle?: {
        type: string;
        description: string;
        solution: string;
    };
    treasure?: string[];
}

export interface DelveSceneNode {
    id: string;
    stage: DelveRoomType;
    title: string;
    narrative: string;
    sensory: SensoryPackage;
    mechanics: MechanicsPackage;
    features: string[];
    emotionalBeat: string;
    thematicTags: string[];
    continuityRefs: string[];
    externalRef?: string; // Path or ID of an external encounter/artifact
    nodeType: 'standard' | 'narrative-encounter';
}

export interface DelveConcept {
    id: string;
    title: string;
    theme: DelveTheme;
    description: string;
    tags: string[]; // Specific sub-themes (e.g. "fire", "necrotic")
    visuals: string; // Short visual prompt
}

export type DelveViewState = 'setup' | 'concepts' | 'hub' | 'room-editor';

export interface Delve {
    id: string;
    title: string;
    theme: DelveTheme;
    level: number;
    rooms: DelveSceneNode[];
    createdAt: Date;
    seed?: string;
    concept?: DelveConcept;
}
