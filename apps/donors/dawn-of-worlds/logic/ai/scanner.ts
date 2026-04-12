import { GameState } from "../../types";
import { PlayerId } from "../../types";

export interface CandidateAction {
    type: string;
    payload: any;
    score: number;
    description: string;
    cost: number;
}

/**
 * Scans the game state and generates a list of possible actions for the AI.
 * This is a simplified version for Phase 2, focusing on basic expansion and rolling.
 */
export const scanForActions = (
    state: GameState,
    playerId: PlayerId
): CandidateAction[] => {
    const candidates: CandidateAction[] = [];
    const player = state.playerCache[playerId];
    // const map = state.worldCache; // Updated to match GameState shape

    // Safety check
    if (!player) return [];

    // 1. ROLL DICE (Priority if not rolled)
    if (!player.hasRolledThisTurn) {
        // AI always wants to roll immediately if it hasn't
        // We don't dispatch the action here, the Brain handles the decision
        // But if this was an Action, it would be top priority.
        // However, Rolling is usually a phase transition or a specific event, not a standard "Action" that costs AP.
        // In this architecture, we treat Rolling as a must-do "Meta-Action".
    }

    // 2. CREATE AVATAR (Priority if checking profile)
    // Cost: 7 Power (Standard for Tier 1 Avatar)
    // Condition: Player has NO avatar currently (Simplified)
    const AVATAR_COST = 7;

    // Check if player already has an avatar (simplest check: scan world for unit with owner)
    const hasAvatar = Object.values(state.worldCache).some(
        obj => obj.ownerId === playerId && obj.kind === 'AVATAR'
    );

    if (!hasAvatar && player.currentPower >= AVATAR_COST) {
        // Find a valid spawn location (e.g., any empty hex, or a capital)
        // For Phase 2, pick the first hex we own, or just a random empty one if we own nothing.
        // Simplified: Pick '0:0' or first available key.

        // Note: In real game, need to iterate `state.worldCache` entries where kind === 'HEX'
        const validHex = Array.from(state.worldCache.values()).find(
            obj => obj.kind === 'HEX' && (obj.ownerId === playerId || !obj.ownerId)
        );

        if (validHex) {
            candidates.push({
                type: 'CREATE_AVATAR',
                payload: {
                    targetHexId: validHex.id,
                    name: `${player.id}'s Avatar`
                },
                score: 0.9, // High priority
                description: "Create new Avatar",
                cost: AVATAR_COST
            });
        }
    }

    return candidates;
};
