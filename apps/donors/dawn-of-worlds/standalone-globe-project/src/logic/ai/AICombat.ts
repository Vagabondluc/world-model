
import { GameState } from '../../types';

export interface CombatResult {
    winnerId: string;
    loserId: string;
    description: string;
    isConquest: boolean; // True if territory changed hands
}

export class AICombat {
    /**
     * Resolves a battle between an attacker (AI) and a defender (Target Cell Owner).
     * "Black Box" implementation: Simple Dice Roll for now.
     */
    static resolve(
        attackerId: string,
        defenderId: string,
        cellId: number,
        _gameState: GameState
    ): CombatResult {
        // 1. Simulate Rolls
        const attackRoll = Math.floor(Math.random() * 6) + 1; // 1-6
        const defenseRoll = Math.floor(Math.random() * 6) + 1; // 1-6

        // 2. Modifiers (Placeholder for biome/tech bonuses)
        const attackMod = 0;
        const defenseMod = 0;

        const attackTotal = attackRoll + attackMod;
        const defenseTotal = defenseRoll + defenseMod;

        // 3. Determine Winner
        // Tie goes to defender
        const attackerWins = attackTotal > defenseTotal;

        if (attackerWins) {
            return {
                winnerId: attackerId,
                loserId: defenderId,
                description: `${attackerId} (Roll ${attackTotal}) defeated ${defenderId} (Roll ${defenseTotal}) at Cell ${cellId}.`,
                isConquest: true
            };
        } else {
            return {
                winnerId: defenderId,
                loserId: attackerId,
                description: `${attackerId} (Roll ${attackTotal}) was repelled by ${defenderId} (Roll ${defenseTotal}) at Cell ${cellId}.`,
                isConquest: false
            };
        }
    }
}
