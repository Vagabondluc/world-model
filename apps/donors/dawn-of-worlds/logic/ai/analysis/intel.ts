
import { GameState } from '../../../types';
import { IntelligenceReport } from '../types';

/**
 * The Eyes of the AI.
 * Gathers data about a target entity (Player or City) from the GameState.
 */
export class IntelSystem {

    public static generateReport(agentId: string, targetId: string, state: GameState): IntelligenceReport {
        // Default report for unknown targets
        const report: IntelligenceReport = {
            targetId,
            lastUpdated: Date.now(),
            visibleUnits: 0,
            mappedTerrainPct: 0.5,
            estimatedStrength: 0
        };

        // 1. Analyze Cache for Units
        // Assuming WorldObject kind="ARMY" or similar, or checking attributes
        // State.worldCache is a Map<string, WorldObject>
        let unitCount = 0;
        let strength = 0;

        for (const obj of state.worldCache.values()) {
            // Check if object belongs to target
            if (obj.createdBy === targetId) {
                // If it's a military unit or fortified location
                if (obj.kind === 'ARMY' || obj.kind === 'AVATAR' || obj.kind === 'CITY') {
                    unitCount++;
                    // Estimate strength based on attributes or default
                    // (Assuming 'power' or 'strength' attr, else 1)
                    const power = (obj.attrs['power'] as number) || 1;
                    strength += power;
                }
            }
        }

        report.visibleUnits = unitCount;
        report.estimatedStrength = strength;

        // 2. Mapped Terrain
        // TODO: Check Fog of War system if implemented. For now, assume partial visibility.
        report.mappedTerrainPct = 0.8;

        return report;
    }
}
