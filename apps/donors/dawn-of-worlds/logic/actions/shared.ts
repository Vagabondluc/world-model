
import { GameState, Selection } from '../../types';
import { selectApRemaining } from '../selectors';

export const createBaseEvent = (state: GameState, cost: number): any => ({
  id: crypto.randomUUID(),
  ts: Date.now(),
  playerId: state.activePlayerId,
  age: state.age,
  round: state.round,
  turn: state.turn,
  cost,
});

export type ValidationResult = { ok: true } | { ok: false; reason: string };

export const requireHexSelection = (sel: Selection): ValidationResult => {
  if (sel.kind !== "HEX") return { ok: false, reason: "Select a hex." };
  return { ok: true };
};

export const requireWorldSelection = (sel: Selection): ValidationResult => {
  if (sel.kind !== "WORLD") return { ok: false, reason: "Select a target." };
  return { ok: true };
};

export const requireAp = (state: GameState, cost: number): ValidationResult => {
  if (selectApRemaining(state) < cost) return { ok: false, reason: "Insufficient AP." };
  return { ok: true };
};

export const combineValidations = (...validators: (() => ValidationResult)[]): ValidationResult => {
  for (const validator of validators) {
    const result = validator();
    if (!result.ok) return result;
  }
  return { ok: true };
};
