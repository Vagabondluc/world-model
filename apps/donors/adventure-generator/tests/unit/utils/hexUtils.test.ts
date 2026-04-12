import { describe, it, expect } from 'vitest';
import { hexToPixel, pixelToHex, roundHex, hexDistance, getNeighbors } from '../../../src/utils/hexUtils';

function full(hex: { q: number; r: number; s?: number }) {
  if (typeof hex.s === 'number') return { q: hex.q, r: hex.r, s: hex.s };
  return { q: hex.q, r: hex.r, s: -hex.q - hex.r };
}

describe('hexUtils', () => {
  describe('coordinate conversions', () => {
    it('round-trip hexToPixel -> pixelToHex returns original for several coords and sizes', () => {
      const cases = [
        { q: 0, r: 0, s: 0 },
        { q: 1, r: 0, s: -1 },
        { q: -2, r: 3, s: -1 }
      ];
      const sizes = [1, 10, 2.5];

      for (const h of cases) {
        for (const size of sizes) {
          const p = hexToPixel(h, size);
          const h2 = pixelToHex(p, size);
          expect(h2).toEqual(h);
        }
      }
    });

    it('hexToPixel uses expected arithmetic (explicit numeric check)', () => {
      const h = { q: 3, r: -1, s: -2 };
      const size = 10;
      const p = hexToPixel(h, size);
      const expectedX = size * (3 / 2 * h.q);
      const expectedY = size * (Math.sqrt(3) / 2 * h.q + Math.sqrt(3) * h.r);
      expect(p.x).toBeCloseTo(expectedX, 10);
      expect(p.y).toBeCloseTo(expectedY, 10);

      // Inverse should restore original
      const roundTripped = pixelToHex(p, size);
      expect(roundTripped).toEqual(h);
    });
  });

  describe('roundHex', () => {
    it('rounds fractional coordinates (0.5 boundary goes up)', () => {
      const input = { q: 1.5, r: -0.5, s: -1 };
      const out = roundHex(input);
      // Math.round(1.5) -> 2, Math.round(-0.5) -> -1
      expect(out.q).toBe(2);
      expect(out.r).toBe(-1);
      expect(out.s).toBe(-1);
      // invariant holds
      expect(out.q + out.r + out.s).toBe(0);
    });

    it('resolves ties by largest difference (tie-breaking branch coverage)', () => {
      const input = { q: 0.4, r: 0.4, s: -0.8 };
      const out = roundHex(input);
      // manual expectation from algorithm: initial rounds (0,0,-1) -> r adjusted to 1
      expect(out).toEqual({ q: 0, r: 1, s: -1 });
      expect(out.q + out.r + out.s).toBe(0);
    });
  });

  describe('hexDistance', () => {
    it('is symmetric and gives known values', () => {
      const a = { q: 0, r: 0, s: 0 };
      const b = { q: 2, r: -1, s: -1 };
      const dab = hexDistance(a, b);
      const dba = hexDistance(b, a);
      expect(dab).toBe(dba);
      expect(dab).toBe(2); // known distance

      // zero distance
      expect(hexDistance(a, a)).toBe(0);

      // neighbor test
      const neigh = { q: 1, r: 0, s: -1 };
      expect(hexDistance(a, neigh)).toBe(1);
    });

    it('matches explicit arithmetic expression (mutation-killer for operators)', () => {
      const a = { q: 1, r: 2, s: -3 };
      const b = { q: -2, r: 4, s: -2 };
      const expected = (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
      expect(hexDistance(a, b)).toBe(expected);
    });
  });

  describe('getNeighbors', () => {
    it('returns exactly 6 distinct neighbors all at distance 1', () => {
      const origin = { q: 2, r: -1, s: -1 };
      const neighbors = getNeighbors(origin as any);
      expect(Array.isArray(neighbors)).toBe(true);
      expect(neighbors.length).toBe(6);

      const seen = new Set<string>();
      for (const n of neighbors) {
        const f = full(n as any);
        // distinct
        const key = `${f.q},${f.r}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
        // adjacent
        expect(hexDistance(origin, f)).toBe(1);
      }
      expect(seen.size).toBe(6);
    });
  });

  // Additional mutation-killer tests
  describe('mutation killers and boundaries', () => {
    it('roundHex preserves q+r+s===0', () => {
      const input = { q: -0.7, r: 1.2, s: -0.5 };
      const out = roundHex(input);
      expect(Number.isInteger(out.q)).toBe(true);
      expect(Number.isInteger(out.r)).toBe(true);
      expect(Number.isInteger(out.s)).toBe(true);
      expect(out.q + out.r + out.s).toBe(0);
    });

    it('pixelToHex inversion is sensitive to sign and scale (off-by-one detector)', () => {
      const h = { q: -3, r: 5, s: -2 };
      const size = 7.25;
      const p = hexToPixel(h, size);
      // move by more than one hex spacing in q direction to guarantee a different hex
      const perturbed = { x: p.x + size * 1.6, y: p.y };
      const mapped = pixelToHex(perturbed, size);
      // ensure exact original still maps back, and perturbed does not equal original (safeguard)
      expect(pixelToHex(p, size)).toEqual(h);
      expect(mapped).not.toEqual(h);
    });
  });
});
