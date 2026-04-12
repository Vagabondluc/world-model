import { GameEvent, GameState } from '../../types';

// --- Identifiers ---
export type AgentID = string;
export type EntityID = string;
export type TagID = string;
export type StoreID = string;
export type OptionID = string;

// =========================================================================================
// LEVEL 3: FORESIGHT SYSTEM (Deliberation Layer)
// See: docs/specs/061-ai-foresight-system.md
// =========================================================================================

export interface ReadinessBreakdown {
    total: number;       // The final score 0-1
    capability: number;  // Can we do it?
    opportunity: number; // Is it a good time?
    confidence: number;  // Do we know enough?
    timing: number;      // Are prerequisites met?
}

export type SchemeID = "MUSTERING" | "HOARDING" | "DESTABILIZING" | "PROBING" | "BIDING";

export interface PreparationScheme {
    id: SchemeID;
    name: string;
    boostsFactor: keyof Omit<ReadinessBreakdown, 'total'>; // e.g. "capability"
    costPerTurn: Partial<StoreCost>;
}

export interface IntelligenceReport {
    targetId: EntityID;
    lastUpdated: number;
    visibleUnits: number;
    mappedTerrainPct: number; // 0-1
    estimatedStrength: number;
}

export interface AIOption {
    id: OptionID;
    storeId: StoreID;
    targetId: EntityID;
    associatedTagId: TagID;

    // Lifecycle
    phase: "CONSIDER" | "PREPARE" | "EXECUTE";

    // Analysis
    readiness: ReadinessBreakdown; // Detailed score breakdown

    // The Active Plan
    activeScheme: SchemeID | null; // What are we doing while waiting?
    missingFactors: string[];
    turnsInPrep: number;
}

export interface ForesightConfig {
    baseThreshold: number;
    weights: {
        capability: number;
        opportunity: number;
        confidence: number;
        timing: number;
    };
}

// =========================================================================================
// LEVEL 2: SEMANTIC PRESSURE SYSTEM (Strategic Layer)
// =========================================================================================

export type TagFamily = "GRUDGE" | "FEAR" | "SHAME" | "AMBITION" | "OPPORTUNITY";

export interface SatisfactionRule {
    type: "THRESHOLD" | "SYMBOLIC" | "ESCALATING";
    metric: string;
    requirement: number;
}

export interface SemanticTag {
    id: TagID;
    family: TagFamily;
    source: EntityID;
    intensity: number;
    urgency: number;
    satisfaction: SatisfactionRule;
    accumulatedValue: number;
    accumulatedLoss: number;
    createdAtTurn: number;
}

export interface StoreCost {
    military: number;
    economic: number;
    political: number;
    stability: number;
    legitimacy: number;
}

export interface StoreProfile {
    id: StoreID;
    name: string;
    reducesFamilies: TagFamily[];
    costs: StoreCost;
    risk: number;
    visibility: number;
}

export interface CulturalBias {
    id: string;
    name: string;
    storePreferences: Record<StoreID, number>;
    lossTolerance: number;
    symbolismPreference: number;
    familyWeights: Record<TagFamily, number>;

    // Foresight Modifiers
    impulsiveness: number; // 0-1 (Lowers threshold)
    paranoia: number;      // 0-1 (Lowers confidence)
}

export interface ObsolescenceRecord {
    originalTagId: TagID;
    reason: string;
    turnObsolete: number;
    accumulatedLoss: number;
}

// =========================================================================================
// LEVEL 1: TACTICAL UTILITY SYSTEM (Action Layer)
// =========================================================================================

export interface AIAction {
    id: string;
    type: string;
    payload: any;
    score?: number;
    reason?: string[];
}

export interface ScoredAction extends AIAction {
    score: number;
    breakdown: any[];
}
