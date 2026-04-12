import { GameState, GameEvent, Age, Selection, WorldEvent, PlayerId } from '../types';
import { deriveWorld } from './deriveWorld';

export type GameAction =
  | { type: "DISPATCH_EVENT"; event: GameEvent }
  | { type: "SET_SELECTION"; selection: Selection }
  | { type: "SET_PREVIEW"; event: WorldEvent | null };

export function reducer(
  state: GameState,
  action: GameAction
): GameState {
  switch (action.type) {
    case "SET_SELECTION":
      return { ...state, activeSelection: action.selection, previewEvent: null };

    case "SET_PREVIEW":
      return { ...state, previewEvent: action.event };

    case "DISPATCH_EVENT": {
      let next: GameState = {
        ...state,
        events: [...state.events, action.event],
        previewEvent: null, // Clear preview on commit
      };

      const event = action.event;

      if (event.type === "EVENT_REVOKE") {
        const revoked = new Set(next.revokedEventIds);
        for (const id of event.payload.targetEventIds) {
          revoked.add(id);
        }
        next.revokedEventIds = revoked;
      }

      if (event.type === "DRAFT_ROLLBACK_USED") {
        next.draftRollbackUsedByAge = {
          ...next.draftRollbackUsedByAge,
          [event.payload.age]: true,
        };
      }

      // Progression Logic
      if (event.type === "TURN_END") {
        const currentIndex = state.players.indexOf(state.activePlayerId);
        const nextIndex = (currentIndex + 1) % state.players.length;

        if (nextIndex === 0) {
          // New Round
          next.round = state.round + 1;
          next.turn = 1;
        } else {
          next.turn = state.turn + 1;
        }
        next.activePlayerId = state.players[nextIndex];
        next.isHandoverActive = true;
      }

      if (event.type === "AGE_ADVANCE") {
        if (event.payload.to <= 3) {
          next.age = event.payload.to as Age;
          next.round = 1;
          next.turn = 1;
          next.isHandoverActive = true;
        }
      }

      if (event.type === "TURN_BEGIN") {
        next.activePlayerId = event.payload.playerId;
        next.isHandoverActive = false;
      }

      // Maintain worldCache for legacy reducer consumers
      next.worldCache = deriveWorld(next.events, next.revokedEventIds, next.settings, state.worldCache);

      return next;
    }
    default:
      return state;
  }
}