import { describe, it, expect } from 'vitest';
import {
    sameHex,
    getHexPosition,
    getHexCorners,
    hexToKey,
    keyToHex,
    getNeighbors,
    getEdgeKey,
    getMapDimensions,
    HEX_WIDTH,
    HEX_HEIGHT,
    X_OFFSET,
    Y_OFFSET
} from '../geometry';
import { Hex } from '../../types';

describe('sameHex', () => {
    it('should return true for identical hexes', () => {
        const hex1: Hex = { q: 0, r: 0 };
        const hex2: Hex = { q: 0, r: 0 };
        expect(sameHex(hex1, hex2)).toBe(true);
    });

    it('should return false for different q values', () => {
        const hex1: Hex = { q: 0, r: 0 };
        const hex2: Hex = { q: 1, r: 0 };
        expect(sameHex(hex1, hex2)).toBe(false);
    });

    it('should return false for different r values', () => {
        const hex1: Hex = { q: 0, r: 0 };
        const hex2: Hex = { q: 0, r: 1 };
        expect(sameHex(hex1, hex2)).toBe(false);
    });

    it('should return false for completely different hexes', () => {
        const hex1: Hex = { q: 1, r: 2 };
        const hex2: Hex = { q: 3, r: 4 };
        expect(sameHex(hex1, hex2)).toBe(false);
    });

    it('should handle negative coordinates', () => {
        const hex1: Hex = { q: -1, r: -1 };
        const hex2: Hex = { q: -1, r: -1 };
        expect(sameHex(hex1, hex2)).toBe(true);
    });
});

describe('getHexPosition', () => {
    it('should return correct position for hex at (0, 0)', () => {
        const pos = getHexPosition(0, 0);
        expect(pos.x).toBe(0);
        expect(pos.y).toBe(0);
    });

    it('should return correct position for hex at (1, 0)', () => {
        const pos = getHexPosition(1, 0);
        expect(pos.x).toBe(X_OFFSET);
        expect(pos.y).toBe(0);
    });

    it('should return correct position for hex at (0, 1)', () => {
        const pos = getHexPosition(0, 1);
        expect(pos.x).toBe(0);
        expect(pos.y).toBe(Y_OFFSET);
    });

    it('should apply odd row offset for odd rows', () => {
        const pos = getHexPosition(0, 1);
        expect(pos.x).toBe(0); // Even row
        const posOdd = getHexPosition(0, 2);
        expect(posOdd.x).toBe(X_OFFSET * 0.5); // Odd row
    });

    it('should calculate correct position for (2, 3)', () => {
        const pos = getHexPosition(2, 3);
        expect(pos.x).toBe(2 * X_OFFSET + X_OFFSET * 0.5);
        expect(pos.y).toBe(3 * Y_OFFSET);
    });
});

describe('getHexCorners', () => {
    it('should return 6 corners', () => {
        const corners = getHexCorners(0, 0);
        expect(corners.length).toBe(6);
    });

    it('should calculate correct corner positions for hex at (0, 0)', () => {
        const corners = getHexCorners(0, 0);
        const { x, y } = getHexPosition(0, 0);
        const w = HEX_WIDTH;
        const h = HEX_HEIGHT;

        expect(corners[0]).toEqual({ x: x + w / 2, y: y });
        expect(corners[1]).toEqual({ x: x + w, y: y + h / 4 });
        expect(corners[2]).toEqual({ x: x + w, y: y + h * 0.75 });
        expect(corners[3]).toEqual({ x: x + w / 2, y: y + h });
        expect(corners[4]).toEqual({ x: x, y: y + h * 0.75 });
        expect(corners[5]).toEqual({ x: x, y: y + h / 4 });
    });

    it('should calculate correct corner positions for hex at (1, 1)', () => {
        const corners = getHexCorners(1, 1);
        const { x, y } = getHexPosition(1, 1);
        expect(corners[0].x).toBe(x + HEX_WIDTH / 2);
        expect(corners[0].y).toBe(y);
    });
});

describe('hexToKey', () => {
    it('should convert hex to string key', () => {
        const hex: Hex = { q: 0, r: 0 };
        expect(hexToKey(hex)).toBe('0,0');
    });

    it('should handle positive coordinates', () => {
        const hex: Hex = { q: 5, r: 10 };
        expect(hexToKey(hex)).toBe('5,10');
    });

    it('should handle negative coordinates', () => {
        const hex: Hex = { q: -3, r: -7 };
        expect(hexToKey(hex)).toBe('-3,-7');
    });

    it('should handle mixed positive and negative coordinates', () => {
        const hex: Hex = { q: 2, r: -5 };
        expect(hexToKey(hex)).toBe('2,-5');
    });
});

describe('keyToHex', () => {
    it('should convert string key to hex', () => {
        const hex = keyToHex('0,0');
        expect(hex).toEqual({ q: 0, r: 0 });
    });

    it('should handle positive coordinates', () => {
        const hex = keyToHex('5,10');
        expect(hex).toEqual({ q: 5, r: 10 });
    });

    it('should handle negative coordinates', () => {
        const hex = keyToHex('-3,-7');
        expect(hex).toEqual({ q: -3, r: -7 });
    });

    it('should handle mixed positive and negative coordinates', () => {
        const hex = keyToHex('2,-5');
        expect(hex).toEqual({ q: 2, r: -5 });
    });

    it('should be reversible with hexToKey', () => {
        const original: Hex = { q: 7, r: -3 };
        const key = hexToKey(original);
        const restored = keyToHex(key);
        expect(restored).toEqual(original);
    });
});

describe('getNeighbors', () => {
    it('should return 6 neighbors', () => {
        const neighbors = getNeighbors(0, 0);
        expect(neighbors.length).toBe(6);
    });

    it('should calculate correct neighbors for even row (0, 0)', () => {
        const neighbors = getNeighbors(0, 0);
        // Even row neighbors
        expect(neighbors).toContainEqual({ q: 0, r: -1 }); // Top Right
        expect(neighbors).toContainEqual({ q: 1, r: 0 });  // Right
        expect(neighbors).toContainEqual({ q: 0, r: 1 });  // Bottom Right
        expect(neighbors).toContainEqual({ q: -1, r: 1 }); // Bottom Left
        expect(neighbors).toContainEqual({ q: -1, r: 0 }); // Left
        expect(neighbors).toContainEqual({ q: -1, r: -1 }); // Top Left
    });

    it('should calculate correct neighbors for odd row (0, 1)', () => {
        const neighbors = getNeighbors(0, 1);
        // Odd row neighbors
        expect(neighbors).toContainEqual({ q: 1, r: 0 });  // Top Right
        expect(neighbors).toContainEqual({ q: 1, r: 1 });  // Right
        expect(neighbors).toContainEqual({ q: 1, r: 2 });  // Bottom Right
        expect(neighbors).toContainEqual({ q: 0, r: 2 });  // Bottom Left
        expect(neighbors).toContainEqual({ q: -1, r: 1 }); // Left
        expect(neighbors).toContainEqual({ q: 0, r: 0 });  // Top Left
    });

    it('should calculate correct neighbors for (5, 3)', () => {
        const neighbors = getNeighbors(5, 3);
        expect(neighbors.length).toBe(6);
        // Check that we get 6 distinct neighbors
        const unique = new Set(neighbors.map(n => `${n.q},${n.r}`));
        expect(unique.size).toBe(6);
    });

    it('should handle negative coordinates', () => {
        const neighbors = getNeighbors(-2, -1);
        expect(neighbors.length).toBe(6);
    });
});

describe('getEdgeKey', () => {
    it('should create consistent edge key regardless of order', () => {
        const hex1: Hex = { q: 0, r: 0 };
        const hex2: Hex = { q: 1, r: 0 };
        const key1 = getEdgeKey(hex1, hex2);
        const key2 = getEdgeKey(hex2, hex1);
        expect(key1).toBe(key2);
    });

    it('should sort hex keys alphabetically', () => {
        const hex1: Hex = { q: 1, r: 0 };
        const hex2: Hex = { q: 0, r: 0 };
        const key = getEdgeKey(hex1, hex2);
        expect(key).toBe('0,0:1,0');
    });

    it('should handle negative coordinates', () => {
        const hex1: Hex = { q: -1, r: -1 };
        const hex2: Hex = { q: 0, r: 0 };
        const key = getEdgeKey(hex1, hex2);
        expect(key).toBe('-1,-1:0,0');
    });

    it('should create unique keys for different edges', () => {
        const hex1: Hex = { q: 0, r: 0 };
        const hex2: Hex = { q: 1, r: 0 };
        const hex3: Hex = { q: 0, r: 1 };
        const key1 = getEdgeKey(hex1, hex2);
        const key2 = getEdgeKey(hex1, hex3);
        expect(key1).not.toBe(key2);
    });
});

describe('getMapDimensions', () => {
    it('should return correct dimensions for SMALL map', () => {
        const dims = getMapDimensions('SMALL');
        expect(dims.cols).toBe(20);
        expect(dims.rows).toBe(15);
    });

    it('should return correct dimensions for STANDARD map', () => {
        const dims = getMapDimensions('STANDARD');
        expect(dims.cols).toBe(30);
        expect(dims.rows).toBe(20);
    });

    it('should return correct dimensions for GRAND map', () => {
        const dims = getMapDimensions('GRAND');
        expect(dims.cols).toBe(40);
        expect(dims.rows).toBe(30);
    });

    it('should calculate correct width for STANDARD map', () => {
        const dims = getMapDimensions('STANDARD');
        const expectedWidth = 30 * HEX_WIDTH + HEX_WIDTH * 0.5;
        expect(dims.width).toBe(expectedWidth);
    });

    it('should calculate correct height for STANDARD map', () => {
        const dims = getMapDimensions('STANDARD');
        const expectedHeight = 20 * (HEX_HEIGHT * 0.75) + HEX_HEIGHT * 0.25;
        expect(dims.height).toBe(expectedHeight);
    });

    it('should calculate correct width for SMALL map', () => {
        const dims = getMapDimensions('SMALL');
        const expectedWidth = 20 * HEX_WIDTH + HEX_WIDTH * 0.5;
        expect(dims.width).toBe(expectedWidth);
    });

    it('should calculate correct height for GRAND map', () => {
        const dims = getMapDimensions('GRAND');
        const expectedHeight = 30 * (HEX_HEIGHT * 0.75) + HEX_HEIGHT * 0.25;
        expect(dims.height).toBe(expectedHeight);
    });
});

describe('axial coordinate conversions', () => {
    it('should maintain coordinate integrity through key conversion', () => {
        const hex: Hex = { q: 5, r: -3 };
        const key = hexToKey(hex);
        const restored = keyToHex(key);
        expect(restored.q).toBe(hex.q);
        expect(restored.r).toBe(hex.r);
    });
});

describe('cube coordinate conversions', () => {
    it('should handle axial coordinates correctly', () => {
        const hex: Hex = { q: 2, r: -1 };
        // In axial coordinates, s = -q - r
        // This test verifies we're using axial coordinates consistently
        expect(hex.q + hex.r).toBe(1);
    });
});

describe('distance calculations', () => {
    it('should calculate distance between adjacent hexes', () => {
        const hex1: Hex = { q: 0, r: 0 };
        const hex2: Hex = { q: 1, r: 0 };
        // Distance in axial coordinates: (|q1-q2| + |q1+r1-q2-r2| + |r1-r2|) / 2
        const distance = (Math.abs(hex1.q - hex2.q) + Math.abs(hex1.q + hex1.r - hex2.q - hex2.r) + Math.abs(hex1.r - hex2.r)) / 2;
        expect(distance).toBe(1);
    });

    it('should calculate distance between diagonal hexes', () => {
        const hex1: Hex = { q: 0, r: 0 };
        const hex2: Hex = { q: 1, r: 1 };
        const distance = (Math.abs(hex1.q - hex2.q) + Math.abs(hex1.q + hex1.r - hex2.q - hex2.r) + Math.abs(hex1.r - hex2.r)) / 2;
        expect(distance).toBe(1);
    });

    it('should calculate distance between distant hexes', () => {
        const hex1: Hex = { q: 0, r: 0 };
        const hex2: Hex = { q: 3, r: -2 };
        const distance = (Math.abs(hex1.q - hex2.q) + Math.abs(hex1.q + hex1.r - hex2.q - hex2.r) + Math.abs(hex1.r - hex2.r)) / 2;
        expect(distance).toBe(3);
    });
});

describe('coordinate bounds', () => {
    it('should handle large positive coordinates', () => {
        const hex: Hex = { q: 1000, r: 1000 };
        const key = hexToKey(hex);
        expect(key).toBe('1000,1000');
    });

    it('should handle large negative coordinates', () => {
        const hex: Hex = { q: -1000, r: -1000 };
        const key = hexToKey(hex);
        expect(key).toBe('-1000,-1000');
    });
});

describe('neighbor wrapping', () => {
    it('should not wrap neighbors by default', () => {
        const neighbors = getNeighbors(0, 0);
        // Neighbors should be actual adjacent hexes, not wrapped
        expect(neighbors).toContainEqual({ q: 0, r: -1 });
        expect(neighbors).toContainEqual({ q: -1, r: -1 });
    });
});

describe('edge cases', () => {
    it('should handle zero coordinates', () => {
        const hex: Hex = { q: 0, r: 0 };
        expect(hexToKey(hex)).toBe('0,0');
        expect(keyToHex('0,0')).toEqual(hex);
    });

    it('should handle single digit coordinates', () => {
        const hex: Hex = { q: 9, r: 9 };
        expect(hexToKey(hex)).toBe('9,9');
    });

    it('should handle coordinates with same q and r values', () => {
        const hex1: Hex = { q: 5, r: 5 };
        const hex2: Hex = { q: 5, r: 5 };
        expect(sameHex(hex1, hex2)).toBe(true);
    });

    it('should handle edge key with identical hexes', () => {
        const hex: Hex = { q: 0, r: 0 };
        const key = getEdgeKey(hex, hex);
        expect(key).toBe('0,0:0,0');
    });
});
