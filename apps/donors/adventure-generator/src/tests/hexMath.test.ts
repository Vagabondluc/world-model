import { describe, it, expect } from 'vitest';
import { hexDistance, getNeighbors, hexToPixel, pixelToHex, roundHex } from '../utils/hexUtils';

describe('HexMathUtils', () => {
    const center = { q: 0, r: 0 };
    const neighbor = { q: 1, r: -1 };

    it('should correctly calculate distance between centers and neighbors', () => {
        expect(hexDistance(center, neighbor)).toBe(1);
    });

    it('should calculate distance correctly for far hexes', () => {
        const a = { q: 0, r: 0 };
        const b = { q: 2, r: 3 }; // dist = (2 + |2+3| + 3)/2 = (2 + 5 + 3)/2 = 5
        expect(hexDistance(a, b)).toBe(5);
    });

    it('should return 6 unique neighbors', () => {
        const neighbors = getNeighbors(center);
        expect(neighbors.length).toBe(6);
        const unique = new Set(neighbors.map(n => `${n.q},${n.r}`));
        expect(unique.size).toBe(6);
    });

    it('should be reversible for pixel-to-hex conversion', () => {
        const size = 30;
        const startHex = { q: 5, r: -2 };
        const pixel = hexToPixel(startHex, size);
        const endHex = pixelToHex(pixel, size);
        expect(endHex.q).toBe(startHex.q);
        expect(endHex.r).toBe(startHex.r);
    });

    it('should round fractional coordinates to nearest whole hex', () => {
        const fractional = { q: 0.1, r: 0.8, s: -0.9 };
        const rounded = roundHex(fractional);
        expect(rounded.q).toBe(0);
        expect(rounded.r).toBe(1);
        expect(rounded.s).toBe(-1);
    });
});
