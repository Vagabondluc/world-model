import { hexToPixel, pixelToHex, hexDistance, getNeighbors, roundHex } from './hexUtils';

describe('hexUtils', () => {
    describe('hexToPixel', () => {
        it('converts origin correctly', () => {
            const result = hexToPixel({ q: 0, r: 0, s: 0 }, 10);
            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('converts axial coordinates correctly (q=1, r=0)', () => {
            const size = 10;
            const result = hexToPixel({ q: 1, r: 0, s: -1 }, size);
            // x = size * 3/2 * q = 10 * 1.5 * 1 = 15
            // y = size * sqrt(3) * (r + q/2) = 10 * sqrt(3) * 0.5 = 5 * sqrt(3)
            expect(result.x).toBeCloseTo(15);
            expect(result.y).toBeCloseTo(5 * Math.sqrt(3));
        });
    });

    describe('pixelToHex', () => {
        it('converts origin pixel back to origin hex', () => {
            const hex = pixelToHex({ x: 0, y: 0 }, 10);
            expect(hex).toEqual({ q: 0, r: 0, s: 0 });
        });

        it('round-trips correctly', () => {
            const size = 10;
            const original = { q: 2, r: -3, s: 1 };
            const pixel = hexToPixel(original, size);
            const returned = pixelToHex(pixel, size);
            expect(returned).toEqual(original);
        });
    });

    describe('roundHex', () => {
        it('rounds exact coordinates to themselves', () => {
            const hex = { q: 1, r: -1, s: 0 };
            expect(roundHex(hex)).toEqual(hex);
        });

        it('rounds fractional coordinates correctly', () => {
            // slightly off from 1, -1, 0
            const hex = { q: 1.1, r: -1.1, s: 0 };
            // 1.1 rounds to 1, -1.1 rounds to -1, 0 rounds to 0. 
            // 1 + (-1) + 0 = 0.
            expect(roundHex(hex)).toEqual({ q: 1, r: -1, s: 0 });
        });

        it('maintains q + r + s = 0 constraint', () => {
            // Case where specialized logic is needed
            // q=0.6 (rounds to 1), r=0.7 (rounds to 1), s=-1.3 (rounds to -1)
            // sum would be 1+1-1=1 != 0 without adjustment
            const hex = { q: 0.6, r: 0.7, s: -1.3 };
            const rounded = roundHex(hex);
            expect(rounded.q + rounded.r + rounded.s).toBe(0);
        });
    });

    describe('hexDistance', () => {
        it('calculates distance 0 for same hex', () => {
            const hex = { q: 1, r: 2, s: -3 };
            expect(hexDistance(hex, hex)).toBe(0);
        });

        it('calculates distance 1 for neighbors', () => {
            const a = { q: 0, r: 0, s: 0 };
            const b = { q: 1, r: -1, s: 0 };
            expect(hexDistance(a, b)).toBe(1);
        });

        it('calculates larger distances correctly', () => {
            const a = { q: 0, r: 0, s: 0 };
            const b = { q: 2, r: -4, s: 2 };
            // formula: (abs(diffQ) + abs(diffR) + abs(diffS)) / 2
            // diffQ=2, diffR=-4, diffS=2
            // (2 + 4 + 2) / 2 = 4
            expect(hexDistance(a, b)).toBe(4);
        });
    });

    describe('getNeighbors', () => {
        it('returns 6 neighbors', () => {
            const neighbors = getNeighbors({ q: 0, r: 0, s: 0 });
            expect(neighbors).toHaveLength(6);
        });

        it('neighbors assume valid coordinates', () => {
            const center = { q: 5, r: 5, s: -10 };
            const neighbors = getNeighbors(center);
            neighbors.forEach(n => {
                expect(n.q + n.r + n.s).toBe(0);
                expect(hexDistance(center, n)).toBe(1);
            });
        });
    });

    describe('Performance', () => {
        it('performs 10,000 conversions in under 100ms', () => {
            const start = performance.now();
            const size = 10;
            for (let i = 0; i < 10000; i++) {
                const hex = { q: i, r: -i, s: 0 };
                const px = hexToPixel(hex, size);
                pixelToHex(px, size);
            }
            const end = performance.now();
            expect(end - start).toBeLessThan(100);
        });
    });
});
