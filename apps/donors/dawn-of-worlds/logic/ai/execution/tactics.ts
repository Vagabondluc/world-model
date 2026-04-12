import { AIOption, AgentID, AIAction } from '../types';
import { GameState } from '../../../types';
import { tacticalActions } from '../../actions/tactical';
import { Pathfinder } from '../navigation/pathfinder';

/**
 * The bridge between STRATEGY (Options) and TACTICS (Moves).
 * Resolves a "Ready" Option into a stream of concrete Game Actions.
 */
export class TacticalMapper {

    public static generateMoves(option: AIOption, agentId: AgentID, state: GameState): AIAction[] {
        switch (option.storeId) {
            case "MILITARY_RAID":
                return this.planRaid(option, agentId, state);
            case "TRADE_EMBARGO":
                return this.planEmbargo(option, agentId, state);
            case "BUILD_MONUMENT":
                return this.planMonument(option, agentId, state);
            case "FORTIFY_BORDER":
                return this.planFortification(option, agentId, state);
            default:
                console.warn(`No tactical plan for Store: ${option.storeId}`);
                return [];
        }
    }

    // --- Specific Plan Generators ---

    private static planRaid(option: AIOption, agentId: AgentID, state: GameState): AIAction[] {
        const moves: AIAction[] = [];

        // 1. Resolve Target
        // If target represents Self (Opportunity), we need to FIND a target (Nearest Enemy)
        let actualTargetId = option.targetId;

        if (actualTargetId === agentId) {
            // Find nearest enemy city
            const enemyCity = Array.from(state.worldCache.values())
                .find(o => o.createdBy !== agentId && (o.kind === 'CITY' || o.kind === 'SETTLEMENT'));

            if (!enemyCity) return []; // Peace in our time?
            actualTargetId = enemyCity.id;
        }

        // 2. Resolve Target Location
        let targetHex: any = null; // Type 'Hex' from types
        const targetObj = state.worldCache.get(actualTargetId);
        if (targetObj && targetObj.hexes.length > 0) {
            targetHex = targetObj.hexes[0];
        } else {
            // Assume targetId is a PlayerId, find their assets
            const targetAsset = Array.from(state.worldCache.values())
                .find(o => o.createdBy === actualTargetId && (o.kind === 'CITY' || o.kind === 'ARMY'));
            if (targetAsset && targetAsset.hexes.length > 0) targetHex = targetAsset.hexes[0];
        }

        if (!targetHex) return [];

        // 3. Select Nearest Available Unit
        const myUnits = Array.from(state.worldCache.values())
            .filter(o => o.createdBy === agentId && o.kind === 'ARMY');

        let bestUnit: any = null;
        let minDist = 999;

        for (const unit of myUnits) {
            const dist = Pathfinder.distance(unit.hexes[0], targetHex);
            if (dist < minDist) {
                minDist = dist;
                bestUnit = unit;
            }
        }

        if (!bestUnit) return [];

        // 4. Generate Action
        // If adjacent, ATTACK
        if (minDist <= 1) {
            moves.push({
                id: `attack_${Date.now()}`,
                type: "ATTACK_TILE",
                payload: { attackerId: bestUnit.id, target: actualTargetId },
                score: 1, // High priority
                reason: ["Execution of Raid (At Range)"]
            });
        } else {
            // Move closer
            const nextStep = Pathfinder.findNextStep(bestUnit.hexes[0], targetHex);
            if (nextStep) {
                moves.push({
                    id: `move_${Date.now()}`,
                    type: "MOVE_UNIT",
                    payload: { unitId: bestUnit.id, to: nextStep }, // to is Hex
                    score: 1,
                    reason: [`Raiding ${actualTargetId}: Closing distance`]
                });
            }
        }

        return moves;
    }

    private static planEmbargo(option: AIOption, agentId: AgentID, state: GameState): AIAction[] {
        // Embargo doesn't stick to a specific ActionDef yet, might be a God Action?
        // Let's assume it's a Diplomatic Action (Age 3 Treaty variant?)
        return [{
            id: `embargo_${Date.now()}`,
            type: "DECLARE_EMBARGO",
            payload: { targetId: option.targetId },
            reason: ["Economic pressure strategy"]
        }];
    }

    private static planMonument(option: AIOption, agentId: AgentID, state: GameState): AIAction[] {
        // Resolve Location: Cannot build on "P2", needs a Hex.
        let buildLocationHex = null;

        if (option.targetId === agentId) {
            // Find one of our cities to build in/near
            const myCity = Array.from(state.worldCache.values())
                .find(o => o.createdBy === agentId && o.kind === 'CITY');

            if (myCity && myCity.hexes.length > 0) {
                buildLocationHex = myCity.hexes[0];
            }
        } else {
            // Target might be the hex itself if specific
            // Or we check if targetObj has hexes
            const targetObj = state.worldCache.get(option.targetId);
            if (targetObj && targetObj.hexes.length > 0) buildLocationHex = targetObj.hexes[0];
        }

        if (!buildLocationHex) return [];

        // Use Age 3 "Great Project"
        return [{
            id: `build_${Date.now()}`,
            type: "WORLD_CREATE", // "PROJECT" -> "WORLD_CREATE" with kind PROJECT
            payload: {
                kind: "PROJECT",
                name: "Monument of Power",
                hexes: [buildLocationHex]
            },
            reason: ["Demonstrating Power (Opportunity)"]
        }];
    }

    private static planFortification(option: AIOption, agentId: AgentID, state: GameState): AIAction[] {
        // Use Tactical "Fortify"
        return [{
            id: `fortify_${Date.now()}`,
            type: "UNIT_FORTIFY",
            payload: { unitId: "u_border_guard", location: option.targetId },
            reason: ["Fear response"]
        }];
    }
}
