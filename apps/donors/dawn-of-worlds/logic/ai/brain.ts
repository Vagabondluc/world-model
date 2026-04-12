
import { GameState, PlayerId } from "../../types";
import { AIPersonality } from "./profiles";
import { scanForActions, CandidateAction } from "./scanner";

export interface Decision {
    action: CandidateAction | null;
    reason: string;
    shouldYield: boolean;
}

import { AIManager } from "./manager";

export const decideNextMove = (
    state: GameState,
    playerId: PlayerId,
    personality: AIPersonality
): Decision => {

    // 1. Get Agent for this player (Ensure it exists)
    const manager = AIManager.getInstance();
    const agent = manager.getAgent(playerId);

    // 2. Update Agent State (Senses) - Broadcast new events to all agents
    manager.update(state);
    // TODO: Pass personality to agent if creating first time?
    // For now manager has default logic.

    // 3. Think (Decide)
    const actions = agent.think(state);

    // 4. Return Decision
    if (actions.length > 0) {
        // Pick first action
        // AIAction needs mapping to CandidateAction style for Controller compatibility if strict?
        // AIController expects { type, payload, cost... }
        // AIAction has { type, payload, score... } 
        // We use spread to be safe, assuming Controller usage handles keys

        return {
            action: {
                ...actions[0],
                description: actions[0].reason?.[0] || actions[0].type,
                cost: 1 // Default cost if missing
            } as any,
            reason: actions[0].reason?.[0] || "AI Decision",
            shouldYield: false
        };
    }

    return {
        action: null,
        reason: "No actions generated.",
        shouldYield: true
    };
};
