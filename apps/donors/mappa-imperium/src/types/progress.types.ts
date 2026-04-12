import { Player } from './player.types';
import { ElementCard } from './element.types';

// --- Player Progress ---

export interface EraProgressDetail {
    completed: number;
    total: number;
    progress: number; // 0-1 ratio
}

export interface PlayerProgress {
    playerNumber: number;
    name: string;
    eras: Record<number, EraProgressDetail>;
    totalGamePercentage: number;
}

// --- Chronicle Stats ---

export interface PrimeFactionSummary {
    name: string;
    ownerName: string;
}

export interface ChronicleStats {
    totalYears: number;
    primeFactions: PrimeFactionSummary[];
    totalElements: number;
    elementCounts: Record<string, number>;
}

// --- Resource Totals ---

export type ResourceTotals = Record<string, number>;

// --- Era Breakdown ---

export interface EraBreakdown {
    era3: number;
    era4: number;
    era5: number;
    era6: number;
}

export interface GameDurationPreview {
    totalYears: number;
    eraBreakdown: EraBreakdown;
}

// --- Step Progress ---

export interface StepProgressItem {
    completed: number;
    total: number;
}

export type StepProgress = Record<string, StepProgressItem>;

// --- Era Goals ---

export interface EraGoalTaskCount {
    completed: number;
    total: number;
    normalizedCompleted?: number;
    normalizedTotal?: number;
}

export interface EraGoal {
    name: string;
    getTaskCount: (player: Player, elements: ElementCard[]) => EraGoalTaskCount;
}

export type EraGoals = Record<number, EraGoal>;

// --- Current Year Display ---

export type CurrentYearDisplay = string | null;

// --- Era Creation State ---
// Defined in map.types.ts
