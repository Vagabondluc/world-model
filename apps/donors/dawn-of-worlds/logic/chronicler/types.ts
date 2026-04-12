import { Hex } from '../../types';

// --- Identifiers ---

export type JournalEntryID = string;         // Format: "je_A{age}_{seq}"
export type ChronicleCandidateID = string;  // Format: "cc_{timestamp}_{seq}"

// --- Journal System ---

export interface JournalEntry {
    id: JournalEntryID;
    type: "CHRONICLE" | "MYTH" | "OBSERVATION";
    age: number;
    title: string;
    text: string;
    scope: "GLOBAL" | "REGIONAL" | "LOCAL";
    relatedWorldIds?: string[];
    relatedHexes?: Hex[];
    triggeredByEventIds: string[];
    author: string; // e.g. "THE_WORLD", "IMPERIAL_SCRIBE"
    timestamp: number;
    provenance?: {
        generatedBy: "AUTO" | "GUIDED" | "MANUAL";
        tablesUsed?: string[];
        reviewed?: boolean;
    };
}

export interface ChronicleCandidate {
    id: ChronicleCandidateID;
    triggerType: string;
    sourceEventIds: string[];
    age: number;
    scope: "GLOBAL" | "REGIONAL" | "LOCAL";
    urgency: "LOW" | "NORMAL" | "HIGH";
    createdAtTurn: number;
    expiresAtAge?: number;
    suggestedTemplates: string[];
    suggestedAuthors: string[];
    autoEligible: boolean;
    status: "PENDING" | "CHRONICLED" | "DISMISSED" | "EXPIRED";
    processedAtTurn?: number;
    resultingEntryId?: JournalEntryID;
}

// --- Template System ---

export interface LoreContext {
    age: number;
    eventName?: string;
    eventPayload?: Record<string, unknown>;
    terrainName?: string;
    cityName?: string;
    raceName?: string;
    nationName?: string;
    capitalName?: string;
    warName?: string;
    cultureName?: string;
    isFirstCity?: boolean;
    isFirstWar?: boolean;
    isRegional?: boolean;
    isGlobal?: boolean;
    thresholdReached?: string;
    mythicSeed?: string[];
    tone?: "neutral" | "reverent" | "ominous" | "triumphant";
    custom?: Record<string, unknown>;
}

export interface LoreTemplate {
    id: string;
    version: string;
    trigger: LoreTrigger;
    entryType: "CHRONICLE" | "MYTH" | "OBSERVATION";
    scope: "GLOBAL" | "REGIONAL" | "LOCAL";
    title: string | { type: "TEMPLATE"; pattern: string } | ((ctx: LoreContext) => string);
    text: string | { type: "TEMPLATE"; pattern: string } | ((ctx: LoreContext) => string);
    author: string | ((ctx: LoreContext) => string);
    requiredContext: string[];
    optionalContext: string[];
    canGenerateMyths?: boolean;
    canGenerateObservations?: boolean;
}

// --- Trigger System ---

export type TriggerCondition =
    | { type: "ALWAYS" }
    | { type: "FIRST_OF_KIND"; kind: string; scope: "GLOBAL" | "REGIONAL" | "LOCAL"; filters?: { named?: boolean; uniqueKind?: boolean } }
    | { type: "THRESHOLD"; metric: string; operator: "GTE" | "LTE" | "EQ"; value: number; scope: "GLOBAL" | "REGIONAL" | "LOCAL"; oneTime?: boolean }
    | { type: "AND" | "OR"; conditions: TriggerCondition[] }
    | { type: "NOT"; conditions: [TriggerCondition] }
    | { type: "CUSTOM"; evaluate: (event: any, state: any) => boolean; safe: boolean };

export interface LoreTrigger {
    id: string;
    name: string;
    version: string;
    eventType: string;
    eventKind?: string;
    condition: TriggerCondition;
    suggestedTemplates: string[];
    suggestedAuthors: string[];
    defaultScope: "GLOBAL" | "REGIONAL" | "LOCAL";
    autoEligible: boolean;
    urgency: "LOW" | "NORMAL" | "HIGH";
    enabled: boolean;
}
