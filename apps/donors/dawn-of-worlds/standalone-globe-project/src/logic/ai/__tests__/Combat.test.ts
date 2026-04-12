
import { describe, it, expect } from 'vitest';
import { AICombat } from '../AICombat';
import { GameState } from '../../../types';

describe('AI Combat (The Sword)', () => {

    const mockState: GameState = {
        age: 1, round: 1, turn: 1, activePlayerId: 'P1', players: [], events: [], world: {} as any
    };

    it('Combat-01: Should resolve combat with a winner', () => {
        // Since it uses random, we run it multiple times or expect structural correctness
        const result = AICombat.resolve('Attacker', 'Defender', 10, mockState);

        expect(result.winnerId).toBeDefined();
        expect(result.loserId).toBeDefined();
        expect(result.description).toContain('Roll');
    });

    it('Combat-02: Conquest flag should follow the winner', () => {
        // We can't deterministic force a win easily without mocking Math.random.
        // But logic is: Attacker > Defender -> Conquest = True.

        // Let's monkey-patch Math.random for a moment
        const originalRandom = Math.random;

        // Force Attacker Win (6 vs 1)
        // First roll is Attacker, Second is Defender
        // We need 0.99 (mapped to 6) and 0.0 (mapped to 1) 
        let callCount = 0;
        Math.random = () => {
            callCount++;
            return callCount === 1 ? 0.99 : 0.0;
        };

        const resultWin = AICombat.resolve('Attacker', 'Defender', 10, mockState);
        expect(resultWin.winnerId).toBe('Attacker');
        expect(resultWin.isConquest).toBe(true);

        // Force Defender Win (1 vs 6)
        callCount = 0;
        Math.random = () => {
            callCount++;
            return callCount === 1 ? 0.0 : 0.99;
        };

        const resultLose = AICombat.resolve('Attacker', 'Defender', 10, mockState);
        expect(resultLose.winnerId).toBe('Defender');
        expect(resultLose.isConquest).toBe(false);

        // Restore
        Math.random = originalRandom;
    });
});
