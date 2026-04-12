import { GameState, Hex, WorldObject, GameEvent, Selection, ActionDef, PlayerId, WorldKind } from '../types';
import { sameHex, getNeighbors as getNeighborsGeo } from './geometry';

export { sameHex };

/**
 * Returns hex neighbors using odd-r offset coordinates
 * Adapts geometry util (q,r) to Hex object expected by legacy selectors
 */
export function getNeighbors(hex: Hex): Hex[] {
  return getNeighborsGeo(hex.q, hex.r);
}

export function existsKindAtHex(state: GameState, hex: Hex, kind: WorldKind): boolean {
  // Use cached world from state instead of re-deriving
  for (const obj of state.worldCache.values()) {
    if (obj.kind === kind && obj.hexes.some(h => sameHex(h, hex))) {
      return true;
    }
  }
  return false;
}

export function isAdjacentToKind(state: GameState, hex: Hex, kind: WorldKind): boolean {
  const neighbors = getNeighborsGeo(hex.q, hex.r);
  return neighbors.some(n => existsKindAtHex(state, n, kind));
}

export function selectLegalActions(
  state: GameState,
  selection: Selection,
  actions: ActionDef[]
): Array<{ action: ActionDef; enabled: boolean; reason?: string }> {
  return actions
    .filter(a => a.age <= state.age)
    .map(action => {
      const validation = action.validate(state, selection);
      return {
        action,
        enabled: validation.ok,
        reason: !validation.ok ? (validation as any).reason : undefined
      };
    })
    .filter(item => {
      if (state.settings.ui.contextFilterActions) {
        return item.enabled || item.action.age === state.age;
      }
      return true;
    });
}

// Deprecated in favor of state.playerCache[p].currentPower, but kept for legacy
export function selectApSpentThisTurn(state: GameState): number {
  return state.playerCache[state.activePlayerId]?.lastTurnSpend || 0;
}

// Updated to use the authoritative derived cache
export function selectApRemaining(state: GameState): number {
  return state.playerCache[state.activePlayerId]?.currentPower || 0;
}

export function selectCanAdvanceAge(state: GameState): boolean {
  const minRounds = state.settings.turn.minRoundsByAge[state.age];
  if (state.round < minRounds) return false;

  if (state.settings.turn.requireAllPlayersActedToAdvance) {
    const playersWhoActed = new Set(
      state.events
        .filter(e => e.age === state.age && e.round === state.round && !state.revokedEventIds.has(e.id))
        .map(e => e.playerId)
    );
    return state.players.every(p => playersWhoActed.has(p));
  }

  return true;
}

export function selectWorldObjectsAtHex(
  state: GameState,
  hex: Hex
): WorldObject[] {
  // Use cached world
  const result: WorldObject[] = [];

  for (const obj of state.worldCache.values()) {
    if (obj.hexes.some(h => sameHex(h, hex))) {
      result.push(obj);
    }
  }
  return result;
}

export function selectEventsAffectingHex(
  state: GameState,
  hex: Hex
): GameEvent[] {
  const result: GameEvent[] = [];
  // Use cached world for modifying events lookup
  const world = state.worldCache;

  for (const e of state.events) {
    if (state.revokedEventIds.has(e.id)) continue;

    if (e.type === "WORLD_CREATE") {
      if (e.payload.hexes?.some(h => sameHex(h, hex))) {
        result.push(e);
      }
    } else if (e.type === "WORLD_MODIFY" || e.type === "WORLD_DELETE") {
      const objId = e.payload.worldId;
      const obj = world.get(objId);
      if (obj && obj.hexes.some(h => sameHex(h, hex))) {
        result.push(e);
      }
    }
  }
  return result;
}
// Player Selectors
export const selectPlayerConfig = (state: GameState, playerId: PlayerId) =>
  state.config?.players.find(p => p.id === playerId);

export const selectPlayerColor = (state: GameState, playerId: PlayerId): string =>
  selectPlayerConfig(state, playerId)?.color || '#fff';
