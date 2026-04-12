
import { GameState, PlayerId } from '../../types';
import { AIAgent, AgentConfig } from './agent';
import { CulturalBias, StoreProfile } from './types';
import { DEFAULT_PERSONALITIES } from './profiles';

/**
 * Singleton to manage stateful AI Agents.
 */
export class AIManager {
    private static instance: AIManager;
    private agents: Map<PlayerId, AIAgent> = new Map();
    private lastProcessedEventIndex: number = 0;

    private constructor() { }

    public static getInstance(): AIManager {
        if (!this.instance) {
            this.instance = new AIManager();
        }
        return this.instance;
    }

    public getAgent(playerId: PlayerId): AIAgent {
        if (!this.agents.has(playerId)) {
            // Initialize new Agent
            // TODO: Select personality based on player config or random
            const profile = DEFAULT_PERSONALITIES.AGGRESSOR; // Default for now

            const config: AgentConfig = {
                id: playerId,
                culture: profile.culture,
                availableStores: profile.stores,
                foresightConfig: profile.foresight
            };

            this.agents.set(playerId, new AIAgent(config));
        }
        return this.agents.get(playerId)!;
    }

    /**
     * Feeds new events to all agents so they can update their internal Pressure/Memory.
     */
    public update(state: GameState) {
        // 1. Identify New Events
        const allEvents = state.events;
        // Optimization: track index. state.events is append-only?
        // Ideally we track by ID or index. 
        // For simplicity, let's just assume we process from last index.

        // Reset index if array shrunk (rollback/load)
        if (this.lastProcessedEventIndex > allEvents.length) {
            this.lastProcessedEventIndex = 0;
        }

        const newEvents = allEvents.slice(this.lastProcessedEventIndex);

        if (newEvents.length > 0) {
            // 2. Broadcast to all agents
            // TODO: In future, only broadcast visible events (Fog of War)
            for (const agent of this.agents.values()) {
                for (const event of newEvents) {
                    agent.onGameEvent(event, state);
                }
            }
            this.lastProcessedEventIndex = allEvents.length;
        }
    }
}
