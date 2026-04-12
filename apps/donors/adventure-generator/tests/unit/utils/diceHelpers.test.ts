import { describe, it, expect } from 'vitest';
import { parseDiceString, formatDamagePayload, getAverageDamage, nudgeDice } from '../../../src/utils/diceHelpers';
import type { PowerAtom, DamagePayload } from '../../../src/types/monsterGrammar';

describe('diceHelpers', () => {
  describe('parseDiceString', () => {
    it('parses standard notations without modifier or type', () => {
      expect(parseDiceString('2d6')).toEqual({ count: 2, die: 'd6', modifier: 0, type: '' });
      expect(parseDiceString('1d8+3')).toEqual({ count: 1, die: 'd8', modifier: 3, type: '' });
      expect(parseDiceString('4d10 + 5 fire')).toEqual({ count: 4, die: 'd10', modifier: 5, type: 'fire' });
    });

    it('parses negative modifier and trailing type', () => {
      expect(parseDiceString('1d8-3 acid')).toEqual({ count: 1, die: 'd8', modifier: -3, type: 'acid' });
    });

    it('returns null for single-die shorthand or malformed input', () => {
      expect(parseDiceString('d6')).toBeNull();
      expect(parseDiceString('')).toBeNull();
      expect(parseDiceString('not a die')).toBeNull();
    });

    it('captures numeric groups correctly for large values', () => {
      expect(parseDiceString('10d12 cold')).toEqual({ count: 10, die: 'd12', modifier: 0, type: 'cold' });
    });
  });

  describe('formatDamagePayload', () => {
    it('formats positive modifiers and types correctly', () => {
      const payload: DamagePayload = { count: 2, die: 'd6', modifier: 3, type: 'fire' };
      expect(formatDamagePayload(payload)).toBe('2d6 + 3 fire');
    });

    it('formats negative modifiers correctly', () => {
      const payload: DamagePayload = { count: 1, die: 'd8', modifier: -2, type: 'slashing' };
      expect(formatDamagePayload(payload)).toBe('1d8 - 2 slashing');
    });

    it('omits modifier when zero and still includes type', () => {
      const payload: DamagePayload = { count: 1, die: 'd6', modifier: 0, type: 'cold' };
      expect(formatDamagePayload(payload)).toBe('1d6 cold');
    });
  });

  describe('getAverageDamage', () => {
    it('computes known averages correctly', () => {
      expect(getAverageDamage('2d6')).toBeCloseTo(7, 6);
      expect(getAverageDamage('1d8+3')).toBeCloseTo(7.5, 6);
    });

    it('handles edge dice and missing die averages as implemented', () => {
      // Implementation uses DICE_AVG lookup; unknown dice fall back to 0
      expect(getAverageDamage('1d1')).toBe(0);
      expect(getAverageDamage('0d6')).toBe(0);
    });
  });

  describe('nudgeDice', () => {
    it('returns original atoms when there are no damaging Action atoms', () => {
      const atoms: PowerAtom[] = [
        { id: 't1', label: 'TraitOnly', axis: 'Utility', cost: 0, text: '', tags: [], actionType: 'Trait' }
      ];

      const result = nudgeDice(atoms, 10);
      // Should return the same reference when nothing to scale
      expect(result).toBe(atoms);
    });

    it('buffs weak attacks toward the target DPR per attack', () => {
      const atoms: PowerAtom[] = [
        { id: 'a1', label: 'Bolt', axis: 'Offense', cost: 1, text: '', tags: [], actionType: 'Action', damage: '1d6' }
      ];

      const targetDpr = 10; // attacksPerRound = 1 => target per attack = 10
      const out = nudgeDice(atoms, targetDpr);
      expect(out).not.toBe(atoms);

      const parsed = parseDiceString(out[0].damage!);
      expect(parsed).not.toBeNull();
      const newAvg = getAverageDamage(out[0].damage!);

      // algorithm stops when within 3 of target
      expect(Math.abs(newAvg - targetDpr)).toBeLessThanOrEqual(3);
      // should have increased average from original 3.5
      expect(newAvg).toBeGreaterThan(3.5);
    });

    it('nerfs strong attacks toward the target DPR per attack', () => {
      const atoms: PowerAtom[] = [
        { id: 'a2', label: 'Smash', axis: 'Offense', cost: 1, text: '', tags: [], actionType: 'Action', damage: '5d10' }
      ];

      const targetDpr = 10; // target per attack = 10
      const out = nudgeDice(atoms, targetDpr);
      const newAvg = getAverageDamage(out[0].damage!);

      expect(Math.abs(newAvg - targetDpr)).toBeLessThanOrEqual(3);
      // should have reduced from original ~27.5
      expect(newAvg).toBeLessThan(27.5);
    });

    it('adds flat modifier when count is at cap and die cannot upgrade', () => {
      const atoms: PowerAtom[] = [
        { id: 'a3', label: 'HugeBlast', axis: 'Offense', cost: 1, text: '', tags: [], actionType: 'Action', damage: '12d12' }
      ];

      // Use a very high target to force buff path and trigger modifier addition
      const out = nudgeDice(atoms, 200);
      const parsed = parseDiceString(out[0].damage!);
      expect(parsed).not.toBeNull();
      // When die is 'd12' and count is already 12, algorithm adds flat modifier
      expect(parsed!.modifier).toBeGreaterThan(0);
    });

    it('completes without throwing for extreme targets (iteration cap path)', () => {
      const atoms: PowerAtom[] = [
        { id: 'a4', label: 'Tiny', axis: 'Offense', cost: 1, text: '', tags: [], actionType: 'Action', damage: '1d4' }
      ];

      // Extremely large target that the loop cannot fully reach within 20 iterations
      const out = nudgeDice(atoms, 1000000);
      expect(out).toBeDefined();
      expect(Array.isArray(out)).toBe(true);
      // Confirm it returns a damage string that still parses
      const parsed = parseDiceString(out[0].damage!);
      expect(parsed).not.toBeNull();
    });
  
    describe('additional mutation killers', () => {
      it('parseDiceString trims trailing and leading whitespace in type', () => {
        const p = parseDiceString('2d4 + 1   cold   ');
        expect(p).not.toBeNull();
        expect(p!.type).toBe('cold');
      });
  
      it('nudgeDice should respect positive modifier when nerfing (average decreases)', () => {
        const atoms: PowerAtom[] = [
          { id: 'mod1', label: 'HeavyMod', axis: 'Offense', cost: 1, text: '', tags: [], actionType: 'Action', damage: '1d6+10' }
        ];
        const originalAvg = getAverageDamage(atoms[0].damage!);
        const out = nudgeDice(atoms, 1);
        const parsed = parseDiceString(out[0].damage!);
        expect(parsed).not.toBeNull();
        const newAvg = getAverageDamage(out[0].damage!);
        expect(newAvg).toBeLessThan(originalAvg);
      });
    });
  });

  // MUTATION KILLERS - targeted tests to catch common operator/loop mutants
  describe('mutation killers', () => {
    it('parseDiceString must detect negative sign (not just presence of +)', () => {
      const p = parseDiceString('1d8-5');
      expect(p).not.toBeNull();
      expect(p!.modifier).toBe(-5);
    });

    it('formatDamagePayload must include correct sign and absolute modifier', () => {
      expect(formatDamagePayload({ count: 1, die: 'd8', modifier: -7, type: 'cold' })).toBe('1d8 - 7 cold');
      expect(formatDamagePayload({ count: 1, die: 'd8', modifier: 7, type: 'cold' })).toBe('1d8 + 7 cold');
    });

    it('getAverageDamage must add modifier (not subtract) - operator check', () => {
      // Specific numeric assertion will fail if +/- is flipped
      expect(getAverageDamage('1d8+3')).toBeCloseTo(7.5, 6);
    });

    it('nudgeDice must converge within 3 of target (loop boundary check)', () => {
      const atoms: PowerAtom[] = [
        { id: 'a5', label: 'Test', axis: 'Offense', cost: 1, text: '', tags: [], actionType: 'Action', damage: '2d6' }
      ];
      const out = nudgeDice(atoms, 20);
      const newAvg = getAverageDamage(out[0].damage!);
      expect(Math.abs(newAvg - 20)).toBeLessThanOrEqual(3);
    });

    // Additional mutation-focused tests
    it('upgrades die when count == 12 and die can upgrade (do not increment count past cap)', () => {
      const atoms: PowerAtom[] = [
        { id: 'm1', label: 'EdgeUpgrade', axis: 'Offense', cost: 1, text: '', tags: [], actionType: 'Action', damage: '12d6' }
      ];
      // High target to force buff path
      const originalAvg = getAverageDamage(atoms[0].damage!);
      const out = nudgeDice(atoms, 200);
      const parsed = parseDiceString(out[0].damage!);
      expect(parsed).not.toBeNull();
      const newAvg = getAverageDamage(out[0].damage!);
      // Ensure average did not decrease and count does not exceed original cap
      expect(newAvg).toBeGreaterThanOrEqual(originalAvg);
      expect(parsed!.count).toBeLessThanOrEqual(12);
    });

    it('downgrades die when count == 1 and die can downgrade (do not decrement below 1)', () => {
      const atoms: PowerAtom[] = [
        { id: 'm2', label: 'EdgeDowngrade', axis: 'Offense', cost: 1, text: '', tags: [], actionType: 'Action', damage: '1d8' }
      ];
      // Low target to force nerf path
      const originalAvg = getAverageDamage(atoms[0].damage!);
      const out = nudgeDice(atoms, 1);
      const parsed = parseDiceString(out[0].damage!);
      expect(parsed).not.toBeNull();
      const newAvg = getAverageDamage(out[0].damage!);
      // Ensure average did not increase and count stays >= 1
      expect(newAvg).toBeLessThanOrEqual(originalAvg);
      expect(parsed!.count).toBeGreaterThanOrEqual(1);
    });
  });
});
