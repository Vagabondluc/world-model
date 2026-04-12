import { GameState, GameEvent } from '../types';

export function proposeTurnScopedUndo(state: GameState): GameEvent | null {
  const actor = state.activePlayerId;

  // Find the last non-revoked event by the active player in the current turn
  for (let i = state.events.length - 1; i >= 0; i--) {
    const e = state.events[i];
    
    // Skip if already revoked
    if (state.revokedEventIds.has(e.id)) continue;
    
    // Must be current player and current turn context
    if (e.playerId !== actor) continue;
    if (e.age !== state.age || e.round !== state.round || e.turn !== state.turn) continue;

    // Do not allow revoking turn markers
    if (e.type === "TURN_BEGIN" || e.type === "TURN_END" || e.type === "ROUND_END" || e.type === "AGE_ADVANCE") {
      continue;
    }
    
    // Revocation events cannot be revoked recursively
    if (e.type === "EVENT_REVOKE") continue;

    return {
      id: crypto.randomUUID(),
      ts: Date.now(),
      playerId: actor,
      age: state.age,
      round: state.round,
      turn: state.turn,
      type: "EVENT_REVOKE",
      payload: { 
        targetEventIds: [e.id], 
        reason: "User Undo" 
      },
    };
  }

  return null;
}