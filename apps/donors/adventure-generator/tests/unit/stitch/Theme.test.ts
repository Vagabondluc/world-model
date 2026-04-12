/**
 * Theme Hook Tests
 * 
 * Uses storeMockFactory for type-safe mock state construction.
 * @see tests/utils/storeMockFactory.ts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from '../../../src/hooks/useTheme';
import { useLocationStore, type LocationStoreState } from '../../../src/stores/locationStore';
import { useSettingsStore, type SettingsState } from '../../../src/stores/settingsStore';
import { setupMockStores, createMockSettingsStore } from '../../utils/storeMockFactory';
import { createMockLayer, mockThemeStores } from '../../utils/themeTestUtils';

// Mock stores
vi.mock('../../../src/stores/locationStore');
vi.mock('../../../src/stores/settingsStore');

describe('useTheme Hook (T-710)', () => {
    beforeEach(() => {
        // Reset document before each test
        document.documentElement.removeAttribute('data-theme');
        
        // Clean up any style elements
        const existingStyle = document.getElementById('dynamic-theme-vars');
        if (existingStyle) {
            existingStyle.remove();
        }
    });

    afterEach(() => {
        // Clean up after each test
        document.documentElement.removeAttribute('data-theme');
        const existingStyle = document.getElementById('dynamic-theme-vars');
        if (existingStyle) {
            existingStyle.remove();
        }
    });

    describe('Theme Engine', () => {
        it('should correctly read activeLayer from store', () => {
            const mockActiveLayerId = 'layer-1';
            const mockLayers = {
                'layer-1': {
                    id: 'layer-1',
                    type: 'shadowfell',
                    name: 'Shadowfell Layer',
                    visible: true,
                    opacity: 1,
                    data: {
                        hexBiomes: {},
                        revealedHexes: {},
                        regions: [],
                        locations: []
                    },
                    theme: {
                        mode: 'shadowfell',
                        biomePalette: 'necrotic',
                        backgroundColor: '#2c2c2c',
                        patternSet: 'shadowfell'
                    }
                }
            };

            // Use helper to apply mocks
            mockThemeStores({
                activeLayerId: mockActiveLayerId,
                layers: mockLayers as any,
            });

            renderHook(() => useTheme());

            expect(useLocationStore).toHaveBeenCalled();
        });

        it('should correctly apply data-theme="shadowfell" to document root', () => {
            const layer = createMockLayer({
                id: 'layer-1',
                type: 'shadowfell',
                name: 'Shadowfell Layer',
                theme: { mode: 'shadowfell', biomePalette: 'necrotic', backgroundColor: '#2c2c2c', patternSet: 'shadowfell' }
            });

            mockThemeStores({
                activeLayerId: 'layer-1',
                layers: { 'layer-1': layer },
                themeSkin: 'parchment'
            });

            const { unmount } = renderHook(() => useTheme());

            expect(document.documentElement.getAttribute('data-theme')).toBe('shadowfell');

            unmount();
            expect(document.documentElement.getAttribute('data-theme')).toBeNull();
        });

        it('should correctly apply data-theme="feywild" to document root', () => {
            const layer = createMockLayer({
                id: 'layer-1',
                type: 'feywild',
                name: 'Feywild Layer',
                theme: { mode: 'feywild', biomePalette: 'psychedelic', backgroundColor: '#e0f7fa', patternSet: 'feywild' }
            });

            mockThemeStores({
                activeLayerId: 'layer-1',
                layers: { 'layer-1': layer },
                themeSkin: 'parchment'
            });

            renderHook(() => useTheme());

            expect(document.documentElement.getAttribute('data-theme')).toBe('feywild');
        });

        it('should remove data-theme when no active layer', () => {
            mockThemeStores({ activeLayerId: null, layers: {} });

            mockThemeStores({ activeLayerId: null, layers: {}, themeSkin: 'parchment' });

            renderHook(() => useTheme());

            expect(document.documentElement.getAttribute('data-theme')).toBeNull();
        });

        it('should update data-theme when layer changes', () => {
            const mockLayers = {
                'layer-1': {
                    id: 'layer-1',
                    type: 'shadowfell',
                    name: 'Shadowfell Layer',
                    visible: true,
                    opacity: 1,
                    data: {
                        hexBiomes: {},
                        revealedHexes: {},
                        regions: [],
                        locations: []
                    },
                    theme: {
                        mode: 'shadowfell',
                        biomePalette: 'necrotic',
                        backgroundColor: '#2c2c2c',
                        patternSet: 'shadowfell'
                    }
                },
                'layer-2': {
                    id: 'layer-2',
                    type: 'feywild',
                    name: 'Feywild Layer',
                    visible: true,
                    opacity: 1,
                    data: {
                        hexBiomes: {},
                        revealedHexes: {},
                        regions: [],
                        locations: []
                    },
                    theme: {
                        mode: 'feywild',
                        biomePalette: 'psychedelic',
                        backgroundColor: '#e0f7fa',
                        patternSet: 'feywild'
                    }
                }
            };

            const layer1 = createMockLayer({ id: 'layer-1', type: 'shadowfell', name: 'Shadowfell Layer', theme: { mode: 'shadowfell', biomePalette: 'necrotic', backgroundColor: '#2c2c2c', patternSet: 'shadowfell' } });
            const layer2 = createMockLayer({ id: 'layer-2', type: 'feywild', name: 'Feywild Layer', theme: { mode: 'feywild', biomePalette: 'psychedelic', backgroundColor: '#e0f7fa', patternSet: 'feywild' } });

            mockThemeStores({ activeLayerId: 'layer-1', layers: { 'layer-1': layer1, 'layer-2': layer2 }, themeSkin: 'parchment' });

            const { rerender } = renderHook(() => useTheme());

            expect(document.documentElement.getAttribute('data-theme')).toBe('shadowfell');

            // Simulate layer change
            mockThemeStores({ activeLayerId: 'layer-2', layers: { 'layer-1': layer1, 'layer-2': layer2 }, themeSkin: 'parchment' });

            rerender();

            expect(document.documentElement.getAttribute('data-theme')).toBe('feywild');
        });

        it('should inject CSS variables into style element', () => {
            const layer = createMockLayer({ id: 'layer-1', type: 'shadowfell', name: 'Shadowfell Layer', theme: { mode: 'shadowfell', biomePalette: 'necrotic', backgroundColor: '#2c2c2c', patternSet: 'shadowfell' } });

            mockThemeStores({ activeLayerId: 'layer-1', layers: { 'layer-1': layer }, themeSkin: 'parchment' });

            renderHook(() => useTheme());

            const styleEl = document.getElementById('dynamic-theme-vars') as HTMLStyleElement;
            expect(styleEl).not.toBeNull();
            expect(styleEl?.textContent).toContain('--parchment-bg:');
            expect(styleEl?.textContent).toContain('--dnd-red:');
        });

        it('should handle surface layer type', () => {
            const mockLayers = {
                'layer-1': {
                    id: 'layer-1',
                    type: 'surface',
                    name: 'Surface Layer',
                    visible: true,
                    opacity: 1,
                    data: {
                        hexBiomes: {},
                        revealedHexes: {},
                        regions: [],
                        locations: []
                    },
                    theme: {
                        mode: 'surface',
                        biomePalette: 'standard',
                        backgroundColor: '#f5e8c3',
                        patternSet: 'default'
                    }
                }
            };

            vi.mocked(useLocationStore).mockImplementation((selector) => {
                const state = {
                    activeLayerId: 'layer-1',
                    layers: mockLayers
                };
                return selector(state as LocationStoreState);
            });

            // Settings provided by mockThemeStores; no-op here

            renderHook(() => useTheme());

            expect(document.documentElement.getAttribute('data-theme')).toBe('surface');
        });

        it('should handle underdark layer type', () => {
            const layer = createMockLayer({ id: 'layer-1', type: 'underdark', name: 'Underdark Layer', theme: { mode: 'underdark', biomePalette: 'subterranean', backgroundColor: '#1a1a2e', patternSet: 'underdark' } });

            mockThemeStores({ activeLayerId: 'layer-1', layers: { 'layer-1': layer }, themeSkin: 'parchment' });

            renderHook(() => useTheme());

            expect(document.documentElement.getAttribute('data-theme')).toBe('underdark');
        });

        it('should handle elemental layer type', () => {
            const mockLayers = {
                'layer-1': {
                    id: 'layer-1',
                    type: 'elemental',
                    name: 'Elemental Layer',
                    visible: true,
                    opacity: 1,
                    data: {
                        hexBiomes: {},
                        revealedHexes: {},
                        regions: [],
                        locations: []
                    },
                    theme: {
                        mode: 'elemental',
                        biomePalette: 'standard',
                        backgroundColor: '#fff3e0',
                        patternSet: 'elemental'
                    }
                }
            };

            const layer = createMockLayer({ id: 'layer-1', type: 'elemental', name: 'Elemental Layer', theme: { mode: 'elemental', biomePalette: 'standard', backgroundColor: '#fff3e0', patternSet: 'elemental' } });
            mockThemeStores({ activeLayerId: 'layer-1', layers: { 'layer-1': layer }, themeSkin: 'parchment' });

            renderHook(() => useTheme());

            expect(document.documentElement.getAttribute('data-theme')).toBe('elemental');
        });
    });
});
