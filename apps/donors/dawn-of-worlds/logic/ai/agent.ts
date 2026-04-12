
import { GameState, GameEvent } from '../../types';
import { PressureEngine } from './pressure';
import { ForesightEngine } from './foresight';
import { TacticalMapper } from './execution/tactics';
import {
    AgentID,
    CulturalBias,
    SemanticTag,
    StoreProfile,
    AIAction,
    AIOption,
    OptionID,
    ForesightConfig
} from './types';
import { TagFactory } from './catalogs/tag_factory';

export interface AgentConfig {
    id: AgentID;
    culture: CulturalBias;
    availableStores: StoreProfile[];
    foresightConfig: ForesightConfig;
}

export class AIAgent {
    public readonly id: AgentID;
    private culture: CulturalBias;

    // The "Brain" Components
    private pressureEngine: PressureEngine;
    private foresightEngine: ForesightEngine;

    // Internal State
    private knownStores: StoreProfile[];
    private activeTags: SemanticTag[] = [];
    private activePlans: Map<OptionID, AIOption> = new Map();

    constructor(config: AgentConfig) {
        this.id = config.id;
        this.culture = config.culture;
        this.knownStores = config.availableStores;

        this.pressureEngine = new PressureEngine();
        this.foresightEngine = new ForesightEngine(config.foresightConfig);
    }

    /**
     * 1. OBSERVE
     * Ingest new events and create/update Tags.
     */
    public onGameEvent(event: GameEvent, state: GameState): void {
        const newTags = TagFactory.createTagsFromEvent(event, this.id, state);
        if (newTags.length > 0) {
            console.log(`[AI-AGENT] Ingested Event ${event.type} -> Created ${newTags.length} Tags: ${newTags.map(t => t.family).join(', ')}`);
        }
        newTags.forEach(tag => this.addTag(tag));
    }

    /**
     * 2. THINK (The Decision Loop)
     * Returns a list of Actions to execute this turn.
     * (Can decide to Wait, in which case handling Schemes internally).
     */
    public think(gameState: GameState): AIAction[] {
        // A. Update Tags (Pressure Layer)
        this.updatePressureLayer(gameState);

        // B. Generate Candidates (Strategic Layer)
        this.generateoptionsFromPressure();

        // C. Evaluate Plans (Foresight Layer)
        const actions: AIAction[] = [];

        for (const [id, plan] of this.activePlans) {
            // 1. Calculate Readiness
            const updatedPlan = this.foresightEngine.evaluateOption(plan, this.culture, gameState, this.id);
            this.activePlans.set(id, updatedPlan);

            // 2. Gate Logic
            if (updatedPlan.phase === "EXECUTE") {
                // Generates concrete moves (e.g. Move Unit)
                const tacticalMoves = TacticalMapper.generateMoves(updatedPlan, this.id, gameState);
                actions.push(...tacticalMoves);

                // If it's a one-off execution, maybe remove plan? 
                // For now, keep it until pressure goes away.
            } else if (updatedPlan.phase === "PREPARE") {
                // Generates "Wait" actions (e.g. Muster)
                // These might be internal state changes or actual game actions
                if (updatedPlan.activeScheme) {
                    // For now, we just log the scheme or generate a generic 'WAIT' action
                    // In a real implementation, 'MUSTERING' might trigger a 'TRAIN_UNIT' action
                    actions.push({
                        id: `scheme_${Date.now()}`,
                        type: "EXECUTE_SCHEME",
                        payload: { scheme: updatedPlan.activeScheme, target: updatedPlan.targetId },
                        reason: [`Preparing: ${updatedPlan.activeScheme} (Readiness: ${updatedPlan.readiness.total.toFixed(2)})`]
                    });
                }
            }
        }

        return actions;
    }

    // --- Private Helpers ---

    private updatePressureLayer(state: GameState): void {
        this.activeTags = this.activeTags
            .map(tag => this.pressureEngine.processTagDecay(tag))
            .filter(tag => !this.pressureEngine.isTagSatisfied(tag))
            .filter(tag => !this.pressureEngine.isObsolete(tag, this.culture));
    }

    private generateoptionsFromPressure(): void {
        const prioritizedTags = this.pressureEngine.prioritizeTags(this.activeTags, this.culture);
        const topTag = prioritizedTags[0];

        if (!topTag) return;

        // If we don't have a plan for this tag, create one
        const existingPlan = Array.from(this.activePlans.values())
            .find(p => p.associatedTagId === topTag.id);

        if (!existingPlan) {
            // Pick Strategy
            const relevantStores = this.pressureEngine.getValidStores(topTag, this.knownStores);
            // Simple select best based on preference (no state needed for static pref)
            // Real logic needs state score
            const bestStore = relevantStores.sort((a, b) =>
                (this.culture.storePreferences[b.id] || 1) - (this.culture.storePreferences[a.id] || 1)
            )[0];

            if (bestStore) {
                const newOption: AIOption = {
                    id: `opt_${Date.now()}`,
                    storeId: bestStore.id,
                    targetId: topTag.source,
                    associatedTagId: topTag.id,
                    phase: "CONSIDER",
                    readiness: { total: 0, capability: 0, opportunity: 0, confidence: 0, timing: 0 }, // Init
                    missingFactors: [],
                    activeScheme: null,
                    turnsInPrep: 0
                };
                this.activePlans.set(newOption.id, newOption);
            }
        }
    }

    // --- Public API ---
    public addTag(tag: SemanticTag): void {
        this.activeTags.push(tag);
    }

    public getStatus(): string {
        const topTag = this.activeTags[0]?.family || "None";
        const plans = Array.from(this.activePlans.values()).map(p =>
            `${p.storeId} [${p.phase} ${(p.readiness.total * 100).toFixed(0)}%]`
        ).join(", ");

        return `Agent ${this.id} [${this.culture.name}] - Focus: ${topTag} | Plans: ${plans}`;
    }
}
