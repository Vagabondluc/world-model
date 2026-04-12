
import { GameEvent, GameState } from '../../types';

export class AIDispatcher {
    static endTurn(playerId: string, state: GameState): GameEvent {
        return {
            id: crypto.randomUUID(),
            type: 'TURN_END',
            ts: Date.now(),
            playerId: playerId,
            age: state.age,
            round: state.round,
            turn: state.turn,
            payload: { playerId }
        };
    }

    static sendMessage(playerId: string, content: string): GameEvent {
        return {
            id: crypto.randomUUID(),
            type: 'CHAT_MESSAGE',
            ts: Date.now(),
            playerId: playerId,
            payload: {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                senderId: playerId,
                content: content,
                type: 'CHAT'
            }
        };
    }
}
