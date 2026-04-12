
import { GameEvent, GameState } from '../../../types';
import { SemanticTag, TagFamily, SatisfactionRule } from '../types';

/**
 * Factory for creating Semantic Tags (Pressure) from raw GameEvents.
 * This is how the AI "perceives" the world.
 */
export class TagFactory {

    /**
     * Analyzes an event and returns any Semantic Tags it should generate for a specific agent.
     * @param event The event that occurred
     * @param agentId The AI agent observing the event
     * @param state The current game state (context)
     */
    public static createTagsFromEvent(event: GameEvent, agentId: string, state: GameState): SemanticTag[] {
        const tags: SemanticTag[] = [];

        // 0. Ignore own events (usually), UNLESS it's a resource gain (Self-Reflection)
        const isSelf = event.playerId === agentId;
        if (isSelf && event.type !== 'POWER_ROLL') return tags;

        // 1. Analyze Event Type
        switch (event.type) {
            case 'POWER_ROLL':
                if (isSelf) this.handlePowerRoll(event, agentId, tags);
                break;
            case 'WORLD_DELETE': // Originally WORLD_DESTROY
                this.handleDestruction(event, agentId, tags);
                break;
            case 'COMBAT_RESOLVE': // If this event existed, but looking at types.ts, combatSession is state
                // We rely on the event that FINALIZED the combat or inflicted damage
                // For now, let's assume WORLD_DESTROY covers raizing
                break;
            // case 'DECLARE_EMBARGO': // Hypothetical
            //     this.handleDiplomacy(event, agentId, tags);
            //     break;

            // Age 3 specific: "Project" completion by others might trigger Ambition/Fear
            case 'WORLD_CREATE':
                this.handleCreation(event, agentId, tags);
                break;
        }

        return tags;
    }

    private static handleDestruction(event: GameEvent, agentId: string, tags: SemanticTag[]) {
        const payload = event.payload as any; // { targetId: string }

        // TODO: In a real implementation, we check if the destroyed object belonged to agentId.
        // For now, we simulate "If Player destroys anything, AI gets scared/angry"

        // GRUDGE: "They broke something."
        tags.push(this.createTag(
            `GRUDGE_DESTROY_${event.id}`,
            "GRUDGE",
            event.playerId,
            0.5, // Intensity
            0.2, // Low urgency unless it was *our* city
            { type: "THRESHOLD", metric: "damage_inflicted", requirement: 10 },
            event.turn
        ));
    }

    private static handleCreation(event: GameEvent, agentId: string, tags: SemanticTag[]) {
        // AMBITION: "They built something, we must keep up."
        tags.push(this.createTag(
            `AMBITION_RIVALRY_${event.id}`,
            "AMBITION",
            event.playerId,
            0.3,
            0.1,
            { type: "SYMBOLIC", metric: "monuments_built", requirement: 1 },
            event.turn
        ));
    }

    private static handleDiplomacy(event: GameEvent, agentId: string, tags: SemanticTag[]) {
        // Placeholder
    }

    private static handlePowerRoll(event: GameEvent, agentId: string, tags: SemanticTag[]) {
        // OPPORTUNITY: "I have power, I should use it."
        const payload = event.payload as any; // { result: number }
        const power = payload.result || 0;

        tags.push(this.createTag(
            `OPPORTUNITY_POWER_${event.id}`,
            "OPPORTUNITY",
            agentId, // Self is source
            0.8, // High intensity (Use it or lose it/it's available now)
            0.5,
            { type: "THRESHOLD", metric: "resources_spent", requirement: power }, // Satisfied when we spend it
            event.turn
        ));
    }

    private static createTag(
        id: string,
        family: TagFamily,
        source: string,
        intensity: number,
        urgency: number,
        satisfaction: SatisfactionRule,
        turn: number
    ): SemanticTag {
        return {
            id,
            family,
            source,
            intensity,
            urgency,
            satisfaction,
            accumulatedValue: 0,
            accumulatedLoss: 0,
            createdAtTurn: turn
        };
    }
}
