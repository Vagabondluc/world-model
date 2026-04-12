import { useEffect } from 'react';
import { useLocationStore } from '../stores/locationStore';
import { useSettingsStore } from '../stores/settingsStore';
import { generateThemeVars, LAYER_PALETTES, PALETTES, SKIN_TO_PALETTE, ThemeSkin } from '../styles/theme';

export const useTheme = () => {
    const activeLayerId = useLocationStore(s => s.activeLayerId);
    const layers = useLocationStore(s => s.layers);
    const themeSkin = useSettingsStore(s => s.themeSkin);

    useEffect(() => {
        // 1. Apply base skin palette
        const paletteKey = SKIN_TO_PALETTE[themeSkin as ThemeSkin];
        const basePalette = PALETTES[paletteKey];
        const baseVars = generateThemeVars(basePalette);

        // 2. Apply layer overrides if active
        let layerVars = '';
        let currentTheme: string | null = null;
        if (activeLayerId && layers[activeLayerId]) {
            const layer = layers[activeLayerId];
            const layerPalette = LAYER_PALETTES[layer.type];
            if (layerPalette) {
                layerVars = generateThemeVars(layerPalette);
            }
            // Apply data-theme attribute to root (document.documentElement) as per T-710 spec
            currentTheme = layer.type;
            document.documentElement.setAttribute('data-theme', layer.type);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // 3. Inject CSS variables
        const styleId = 'dynamic-theme-vars';
        let styleEl = document.getElementById(styleId) as HTMLStyleElement;
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = `:root { ${baseVars} ${layerVars} }`;

        return () => {
            document.documentElement.removeAttribute('data-theme');
        };
    }, [activeLayerId, layers, themeSkin]);
};
