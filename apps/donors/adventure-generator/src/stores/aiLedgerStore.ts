import { create } from 'zustand';
import { AiRequestEntry } from '../schemas/aiLedger';
import { useCampaignStore } from './campaignStore';

/**
 * Pure function for calculating AI costs.
 * Uses integer arithmetic (micro-dollars) to avoid floating-point precision issues.
 * 
 * @param inputChars - Number of input characters
 * @param outputChars - Number of output characters
 * @param inputRatePer1k - Cost per 1000 input characters in dollars
 * @param outputRatePer1k - Cost per 1000 output characters in dollars
 * @returns Total cost in dollars
 */
export function calculateAiCost(
    inputChars: number,
    outputChars: number,
    inputRatePer1k: number,
    outputRatePer1k: number
): number {
    // Convert rates (dollars per 1k chars) to micro-dollars per character
    // micro-dollars per char = ratePer1k * 1_000_000 / 1000 = ratePer1k * 1000
    const inputRateMicroPerChar = Math.round(inputRatePer1k * 1_000);
    const outputRateMicroPerChar = Math.round(outputRatePer1k * 1_000);

    // Calculate costs in micro-dollars (integers)
    const inputCostMicro = inputChars * inputRateMicroPerChar;
    const outputCostMicro = outputChars * outputRateMicroPerChar;

    // Convert back to dollars
    return (inputCostMicro + outputCostMicro) / 1_000_000;
}

export function calculateCostFromConfig(
    inputChars: number,
    outputChars: number,
    config: { aiCostPer1kInput?: number; aiCostPer1kOutput?: number }
): number {
    const inputRate = config.aiCostPer1kInput ?? 0;
    const outputRate = config.aiCostPer1kOutput ?? 0;
    return calculateAiCost(inputChars, outputChars, inputRate, outputRate);
}

interface AiLedgerState {
    entries: AiRequestEntry[];
    totalCost: number;

    // Actions
    addEntry: (entry: AiRequestEntry) => void;
    clearLedger: () => void;
    calculateCost: (inputChars: number, outputChars: number) => number;
}

export const useAiLedgerStore = create<AiLedgerState>((set, get) => ({
    entries: [],
    totalCost: 0,

    addEntry: (entry) => set((state) => ({
        entries: [entry, ...state.entries],
        totalCost: state.totalCost + entry.cost
    })),

    clearLedger: () => set({ entries: [], totalCost: 0 }),

    calculateCost: (inputChars: number, outputChars: number) => {
        const config = useCampaignStore.getState().config;
        return calculateAiCost(
            inputChars,
            outputChars,
            config.aiCostPer1kInput || 0,
            config.aiCostPer1kOutput || 0
        );
    }
}));
