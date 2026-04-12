
import { describe, it, expect } from 'vitest';
import { AIDispatcher } from '../AIDispatcher';
import { GameState } from '../../../types';

/**
 * Maturity Test Suite: The Hands (Dispatcher)
 * Target: AIDispatcher.ts event integrity
 */
describe('AI Dispatcher (Action)', () => {

    const mockState: GameState = {
        age: 2,
        round: 5,
        turn: 3,
        activePlayerId: 'AI',
        players: [],
        events: [],
        world: {} as any
    };

    it('Disp-01: endTurn should produce valid TURN_END event', () => {
        const event = AIDispatcher.endTurn('AI', mockState);

        expect(event.type).toBe('TURN_END');
        expect(event.playerId).toBe('AI');
        expect(event.age).toBe(2);
        expect(event.round).toBe(5);
        expect(event.turn).toBe(3);
    });

    it('Disp-02: sendMessage should produce valid CHAT_MESSAGE payload', () => {
        const event = AIDispatcher.sendMessage('AI', 'Hello World');

        expect(event.type).toBe('CHAT_MESSAGE');
        expect(event.payload).toMatchObject({
            senderId: 'AI',
            content: 'Hello World',
            type: 'CHAT'
        });
    });

    it('Disp-03: Should generate unique UUIDs', () => {
        const e1 = AIDispatcher.endTurn('AI', mockState);
        const e2 = AIDispatcher.endTurn('AI', mockState);
        expect(e1.id).not.toBe(e2.id);
    });

    it('Disp-04: Should include correct timestamp', () => {
        const now = Date.now();
        const event = AIDispatcher.endTurn('AI', mockState);

        expect(event.ts).toBeGreaterThanOrEqual(now);
        expect(event.ts).toBeLessThan(now + 100);
    });

    it('Disp-05: Payload structure integrity', () => {
        // Verify keys exist
        const event = AIDispatcher.endTurn('AI', mockState);
        expect(event).toHaveProperty('payload');
        expect(event.payload).toHaveProperty('playerId');
    });
});
