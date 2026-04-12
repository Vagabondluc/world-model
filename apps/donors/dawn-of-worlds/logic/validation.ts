import { GameState, WorldObject, PlayerId } from '../types';

export type ValidationResult = { ok: true } | { ok: false; reason: string };

/**
 * Checks if a world object is protected from modification by players other than its creator
 * during the round it was created.
 */
export function validateProtection(
  state: GameState,
  target: WorldObject | undefined,
  actorId: PlayerId
): ValidationResult {
  if (!state.settings.social.protectedUntilEndOfRound) {
    return { ok: true };
  }
  if (!target?.createdBy) return { ok: true };
  if (target.createdBy === actorId) return { ok: true };

  const createdThisRound =
    target.createdAge === state.age && target.createdRound === state.round;
  
  if (!createdThisRound) return { ok: true };

  return { ok: false, reason: "Target protected until end of round (Round-Scoped Protection Active)." };
}

/**
 * Calculates additional AP cost for modifying objects created or named by other players.
 */
export function costModifierForOtherPlayers(
  state: GameState,
  target: WorldObject | undefined,
  actorId: PlayerId
): number {
  const alter = state.settings.social.alterationCost;
  if (!alter.enabled) return 0;
  if (!target?.createdBy) return 0;
  if (target.createdBy === actorId) return 0;

  const base = alter.modifyOthersBasePlus;
  const named =
    target.isNamed && alter.namedKinds.includes(target.kind)
      ? alter.modifyOthersNamedPlus
      : 0;

  return base + named;
}

/**
 * Generates soft UI warnings for actions that are legal but potentially controversial.
 */
export function softWarnings(
  state: GameState,
  target: WorldObject | undefined,
  actorId: PlayerId
): string[] {
  const w: string[] = [];

  if (
    state.settings.social.warnings.warnOnModifyingOthers &&
    target?.createdBy &&
    target.createdBy !== actorId
  ) {
    w.push("Warning: Modifying another player's creation.");
  }

  if (state.settings.social.warnings.warnOnDeletingNamed && target?.isNamed) {
    w.push("Warning: Affecting a named world element.");
  }

  return w;
}