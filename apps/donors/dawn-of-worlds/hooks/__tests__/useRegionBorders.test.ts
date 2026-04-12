import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRegionBorders } from '../useRegionBorders';
import { WorldObject } from '../../types';

describe('useRegionBorders', () => {
    let mockWorldCache: Map<string, WorldObject>;
    let mockPlayers: any[];

    beforeEach(() => {
        mockWorldCache = new Map();
        mockPlayers = [
            { id: 'P1', name: 'Player 1', color: '#ff0000' },
            { id: 'P2', name: 'Player 2', color: '#00ff00' }
        ];
    });

    describe('border calculation', () => {
        it('should return empty array when no world objects', () => {
            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            expect(result.current).toEqual([]);
        });

        it('should calculate borders for nation objects', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }, { q: 1, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            expect(result.current.length).toBeGreaterThan(0);
        });

        it('should calculate borders for region objects', () => {
            const region: WorldObject = {
                id: 'region_1',
                kind: 'REGION',
                hexes: [{ q: 0, r: 0 }, { q: 1, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockWorldCache.set('region_1', region);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            expect(result.current.length).toBeGreaterThan(0);
        });

        it('should use nation color for nation borders', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current.find(b => b.id.includes('nation_1'));
            expect(border?.color).toBe('#ff0000');
        });

        it('should use default color for region borders', () => {
            const region: WorldObject = {
                id: 'region_1',
                kind: 'REGION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockWorldCache.set('region_1', region);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current.find(b => b.id.includes('region_1'));
            expect(border?.color).toBe('#ad92c9');
        });

        it('should use white color for nation without player', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current.find(b => b.id.includes('nation_1'));
            expect(border?.color).toBe('#ffffff');
        });
    });

    describe('border rendering', () => {
        it('should generate SVG path for borders', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }, { q: 1, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current[0];
            expect(border?.path).toMatch(/^M/);
            expect(border?.path).toMatch(/L/);
        });

        it('should set correct stroke width for nation borders', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current[0];
            expect(border?.strokeWidth).toBe(4);
        });

        it('should set correct stroke width for region borders', () => {
            const region: WorldObject = {
                id: 'region_1',
                kind: 'REGION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockWorldCache.set('region_1', region);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current[0];
            expect(border?.strokeWidth).toBe(2);
        });

        it('should set correct opacity for nation borders', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current[0];
            expect(border?.opacity).toBe(1.0);
        });

        it('should set correct opacity for region borders', () => {
            const region: WorldObject = {
                id: 'region_1',
                kind: 'REGION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockWorldCache.set('region_1', region);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current[0];
            expect(border?.opacity).toBe(0.6);
        });

        it('should set stroke dash array for region borders', () => {
            const region: WorldObject = {
                id: 'region_1',
                kind: 'REGION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockWorldCache.set('region_1', region);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current[0];
            expect(border?.strokeDasharray).toBe('4 4');
        });

        it('should not set stroke dash array for nation borders', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            const border = result.current[0];
            expect(border?.strokeDasharray).toBeUndefined();
        });
    });

    describe('border updates', () => {
        it('should recalculate when worldCache changes', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result, rerender } = renderHook(
                ({ worldCache }) => useRegionBorders(worldCache, mockPlayers),
                { initialProps: { worldCache: mockWorldCache } }
            );

            const initialBorders = result.current.length;

            mockWorldCache.set('nation_2', {
                id: 'nation_2',
                kind: 'NATION',
                hexes: [{ q: 1, r: 0 }],
                attrs: {},
                createdBy: 'P2',
                isNamed: false
            });

            rerender({ worldCache: mockWorldCache });

            expect(result.current.length).toBeGreaterThan(initialBorders);
        });

        it('should recalculate when players change', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result, rerender } = renderHook(
                ({ players }) => useRegionBorders(mockWorldCache, players),
                { initialProps: { players: mockPlayers } }
            );

            const initialBorders = result.current.length;

            const newPlayers = [
                { id: 'P1', name: 'Player 1', color: '#ff0000' },
                { id: 'P2', name: 'Player 2', color: '#00ff00' },
                { id: 'P3', name: 'Player 3', color: '#0000ff' }
            ];

            rerender({ players: newPlayers });

            expect(result.current.length).toBe(initialBorders);
        });
    });

    describe('border edge cases', () => {
        it('should handle objects with single hex', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            expect(result.current.length).toBe(0);
        });

        it('should handle adjacent objects of same type', () => {
            const nation1: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            const nation2: WorldObject = {
                id: 'nation_2',
                kind: 'NATION',
                hexes: [{ q: 1, r: 0 }],
                attrs: {},
                createdBy: 'P2',
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation1);
            mockWorldCache.set('nation_2', nation2);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            expect(result.current.length).toBe(0);
        });

        it('should handle adjacent objects of different types', () => {
            const nation: WorldObject = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            const region: WorldObject = {
                id: 'region_1',
                kind: 'REGION',
                hexes: [{ q: 1, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockWorldCache.set('nation_1', nation);
            mockWorldCache.set('region_1', region);

            const { result } = renderHook(() => useRegionBorders(mockWorldCache, mockPlayers));
            expect(result.current.length).toBeGreaterThan(0);
        });
    });
});
