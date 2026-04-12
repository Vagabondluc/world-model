
import { GameEvent, PlayerId, PlayerRuntimeState } from '../types';
import { createDefaultPlayerRuntimeState } from './playerState';

/**
 * Derives the runtime state of all players (Power, Bonuses) from the event log.
 * Implements Rule III: Powers & Costs.
 */
export function derivePlayerState(
  events: GameEvent[],
  revokedIds: Set<string>,
  players: PlayerId[]
): Record<PlayerId, PlayerRuntimeState> {
  const state: Record<PlayerId, PlayerRuntimeState> = {};

  // Initialize default state
  players.forEach(p => {
    state[p] = createDefaultPlayerRuntimeState();
  });

  for (const e of events) {
    if (revokedIds.has(e.id)) continue;

    const p = state[e.playerId];
    if (!p) continue; // Should not happen if player list is consistent

    // 1. Power Income (Rule III)
    if (e.type === 'POWER_ROLL') {
      // The event payload already contains the calculated result (roll + bonus)
      // We trust the event log as the source of truth
      p.currentPower += e.payload.result;
      p.hasRolledThisTurn = true;
    }

    // 2. Spending Power
    if (e.type === 'WORLD_CREATE' || e.type === 'WORLD_MODIFY' || e.type === 'WORLD_DELETE') {
      if ('cost' in e) {
        p.currentPower -= e.cost;
        p.lastTurnSpend += e.cost;
      }
    }

    // 3. Turn Lifecycle & Bonus Calculation
    if (e.type === 'TURN_END') {
      // Rule III: Low Power Bonus
      // "If you end a turn with 5 or fewer points..."
      if (p.currentPower <= 5) {
        p.lowPowerBonus = Math.min(3, p.lowPowerBonus + 1);
      } else {
        p.lowPowerBonus = 0;
      }

      p.lastTurnSpend = 0;

      // Note: We don't reset hasRolledThisTurn here because it technically belongs to the *next* turn cycle.
      // However, for the purpose of the current state snapshot, if the turn ended, 
      // the *next* time this player is active, they will need to roll.
      // But we can't look ahead.
      // Handled by TURN_BEGIN logic below.
    }

    if (e.type === 'TURN_BEGIN') {
      // When a player's turn begins, they haven't rolled yet.
      p.hasRolledThisTurn = false;
    }

    // Age Advance resets everyone's roll status to be safe, though Round End usually covers it
    if (e.type === 'AGE_ADVANCE') {
      players.forEach(pid => {
        state[pid].hasRolledThisTurn = false;
      });
    }
  }

  return state;
}
