
/**
 * Design tokens and type-safe accessors for the application theme.
 * This file acts as the single source of truth for colors, fonts, and spacing.
 */

const parchmentTileUrl = new URL('../assets/textures/parchment-tile.png', import.meta.url).toString();
const cubesTileUrl = new URL('../assets/textures/cubes-tile.png', import.meta.url).toString();

// --- 1. CSS Variable Keys ---
// We map semantic names (e.g., 'primary') to the existing CSS variable names
// to maintain compatibility with any inline styles while improving developer experience.
export const cssVarNames = {
    colors: {
        background: '--parchment-bg',
        backgroundImage: '--parchment-bg-image',
        textMain: '--dark-brown',
        textMuted: '--medium-brown',
        textLight: '--light-brown',
        cardBackground: '--card-bg',
        accent: '--dnd-red',
        error: '--error-red',
        errorBg: '--error-bg',
        success: '--success-green',
        viewBg: '--view-bg',  // New token for full-page backgrounds
        contentBoxBg: '--content-box-bg', // New token for white content boxes

        // Form Inputs
        inputBg: '--input-bg',
        inputText: '--input-text',
        inputBorder: '--input-border',
        inputFocus: '--input-focus-border',
        inputPlaceholder: '--input-placeholder',

        // Entities (Static)
        entityDungeon: '--dungeon-color',
        entityBattlemap: '--battlemap-color',
        entitySettlement: '--settlement-color',
        entitySpecial: '--special-color',
        npcMinor: '--minor-npc',
        npcMajor: '--major-npc',
        npcAntagonist: '--antagonist-npc',
        npcCreature: '--creature-npc',
    },
    fonts: {
        header: '--header-font',
        body: '--body-font',
        statTitle: '--stat-title-font',
        statBody: '--stat-body-font',
    },
    spacing: {
        xs: '--space-xs',
        s: '--space-s',
        m: '--space-m',
        l: '--space-l',
        xl: '--space-xl',
        xxl: '--space-xxl',
    },
    borders: {
        radius: '--border-radius',
        main: '--border-main',
        light: '--border-light',
    }
};

export type ThemeSkin = 'parchment' | 'modern' | 'highContrast';

export interface ThemeConfig {
    skin: ThemeSkin;
    layerPalette?: string;
    customOverrides?: Partial<ThemePalette>;
}

export const SKIN_TO_PALETTE: Record<ThemeSkin, keyof typeof PALETTES> = {
    parchment: 'default',
    modern: 'dark',
    highContrast: 'highContrast',
};

// --- 2. Palette Definitions ---
export interface ThemePalette {
    background: string;
    backgroundImage: string;
    textMain: string;
    textMuted: string;
    textLight: string;
    cardBackground: string;
    accent: string;
    error: string;
    errorBg: string;
    success: string;
    viewBg: string;
    contentBoxBg: string;
    inputBg: string;
    inputText: string;
    inputBorder: string;
    inputFocus: string;
    inputPlaceholder: string;
    borderMain: string;
    borderLight: string;
}

export const PALETTES: Record<'default' | 'dark' | 'highContrast', ThemePalette> = {
    default: {
        background: '#f5e8c3',
        viewBg: '#fdfaf6', // Matches ChroniclerView container
        contentBoxBg: '#ffffff', // Matches ChroniclerView content areas
        backgroundImage: `url('${parchmentTileUrl}')`,
        textMain: '#3a2d1d',
        textMuted: '#6f4e37',
        textLight: '#c4a484',
        cardBackground: '#faf0d7',
        accent: '#922610',
        error: '#a02d2d',
        errorBg: '#fdd',
        success: '#2a7d2a',
        inputBg: '#ffffff',
        inputText: '#3a2d1d',
        inputBorder: '#6f4e37',
        inputFocus: '#922610',
        inputPlaceholder: '#999',
        borderMain: '1px solid var(--medium-brown)',
        borderLight: '1px solid var(--light-brown)',
    },
    dark: {
        background: '#1e1e1e',
        viewBg: '#1e1e1e',
        contentBoxBg: '#2a2a2a',
        backgroundImage: 'none',
        textMain: '#e0e0e0',
        textMuted: '#a0a0a0',
        textLight: '#555555',
        cardBackground: '#2a2a2a',
        accent: '#d9573a',
        error: '#ff6b6b',
        errorBg: '#4a2a2a',
        success: '#4caf50',
        inputBg: '#3a3a3a',
        inputText: '#e0e0e0',
        inputBorder: '#555555',
        inputFocus: '#d9573a',
        inputPlaceholder: '#888',
        borderMain: '1px solid var(--light-brown)',
        borderLight: '1px solid #444',
    },
    highContrast: {
        background: '#ffffff',
        viewBg: '#ffffff',
        contentBoxBg: '#ffffff',
        backgroundImage: 'none',
        textMain: '#000000',
        textMuted: '#222222',
        textLight: '#444444',
        cardBackground: '#f5f5f5',
        accent: '#c00000',
        error: '#d00000',
        errorBg: '#ffd0d0',
        success: '#006400',
        inputBg: '#ffffff',
        inputText: '#000000',
        inputBorder: '#222222',
        inputFocus: '#c00000',
        inputPlaceholder: '#666',
        borderMain: '2px solid var(--dark-brown)',
        borderLight: '1px solid var(--medium-brown)',
    }
};

export const LAYER_PALETTES: Record<string, Partial<ThemePalette>> = {
    surface: {
        background: '#f5e8c3',
        backgroundImage: `url('${parchmentTileUrl}')`,
        accent: '#922610',
    },
    underdark: {
        background: '#1a1a2e',
        backgroundImage: 'none',
        accent: '#9d00ff',
    },
    feywild: {
        background: '#e0f7fa',
        backgroundImage: `url('${cubesTileUrl}')`,
        accent: '#e91e63',
    },
    shadowfell: {
        background: '#2c2c2c',
        backgroundImage: 'none',
        accent: '#4a148c',
    },
    elemental: {
        background: '#fff3e0',
        backgroundImage: 'none',
        accent: '#ff9800',
    },
};

// --- 3. Static Variables (Fonts, Entity Colors) ---
export const STATIC_VARS = {
    entityColors: {
        dungeon: '#6a0dad',
        battlemap: '#b22222',
        settlement: '#228b22',
        special: '#4682b4',
        npcMinor: '#007bff',
        npcMajor: '#6f42c1',
        npcAntagonist: '#dc3545',
        npcCreature: '#2E8B57',
    },
    factions: {
        government: '#1E3A8A',
        religious: '#FBBF24',
        criminal: '#7F1D1D',
        economic: '#059669',
        arcane: '#7C3AED',
        mercenary: '#B45309',
        racial: '#A16207',
        revolutionary: '#DC2626',
        shadow: '#374151',
        planar: '#BE185D',
        environmental: '#166534',
    },
    fonts: {
        header: "'MedievalSharp', cursive",
        body: "'Lora', serif",
        statTitle: "'Sorts Mill Goudy', serif",
        statBody: "'Noto Sans', sans-serif",
    },
    spacing: {
        xs: '0.25rem',
        s: '0.5rem',
        m: '1rem',
        l: '1.5rem',
        xl: '2rem',
        xxl: '3rem',
    },
    radius: '8px'
};

// --- 4. Helper to generate CSS ---
const formatVar = (key: string, val: string) => `${key}: ${val};`;

export const generateThemeVars = (palette: Partial<ThemePalette>) => {
    const vars: string[] = [];
    if (palette.background) vars.push(formatVar(cssVarNames.colors.background, palette.background));
    if (palette.backgroundImage) vars.push(formatVar(cssVarNames.colors.backgroundImage, palette.backgroundImage));
    if (palette.textMain) vars.push(formatVar(cssVarNames.colors.textMain, palette.textMain));
    if (palette.textMuted) vars.push(formatVar(cssVarNames.colors.textMuted, palette.textMuted));
    if (palette.textLight) vars.push(formatVar(cssVarNames.colors.textLight, palette.textLight));
    if (palette.cardBackground) vars.push(formatVar(cssVarNames.colors.cardBackground, palette.cardBackground));
    if (palette.accent) vars.push(formatVar(cssVarNames.colors.accent, palette.accent));
    if (palette.error) vars.push(formatVar(cssVarNames.colors.error, palette.error));
    if (palette.errorBg) vars.push(formatVar(cssVarNames.colors.errorBg, palette.errorBg));
    if (palette.success) vars.push(formatVar(cssVarNames.colors.success, palette.success));
    if (palette.viewBg) vars.push(formatVar(cssVarNames.colors.viewBg, palette.viewBg));
    if (palette.contentBoxBg) vars.push(formatVar(cssVarNames.colors.contentBoxBg, palette.contentBoxBg));

    if (palette.inputBg) vars.push(formatVar(cssVarNames.colors.inputBg, palette.inputBg));
    if (palette.inputText) vars.push(formatVar(cssVarNames.colors.inputText, palette.inputText));
    if (palette.inputBorder) vars.push(formatVar(cssVarNames.colors.inputBorder, palette.inputBorder));
    if (palette.inputFocus) vars.push(formatVar(cssVarNames.colors.inputFocus, palette.inputFocus));
    if (palette.inputPlaceholder) vars.push(formatVar(cssVarNames.colors.inputPlaceholder, palette.inputPlaceholder));

    if (palette.borderMain) vars.push(formatVar(cssVarNames.borders.main, palette.borderMain));
    if (palette.borderLight) vars.push(formatVar(cssVarNames.borders.light, palette.borderLight));

    return vars.join('\n');
};

// --- 5. Type-Safe Accessor Object ---
// Use this object in your emotion styles instead of raw strings.
const v = (name: string) => `var(${name})`;

export const theme = {
    colors: {
        bg: v(cssVarNames.colors.background),
        bgImage: v(cssVarNames.colors.backgroundImage),
        text: v(cssVarNames.colors.textMain),
        textMuted: v(cssVarNames.colors.textMuted),
        textLight: v(cssVarNames.colors.textLight),
        card: v(cssVarNames.colors.cardBackground),
        accent: v(cssVarNames.colors.accent),
        error: v(cssVarNames.colors.error),
        errorBg: v(cssVarNames.colors.errorBg),
        success: v(cssVarNames.colors.success),
        viewBg: v(cssVarNames.colors.viewBg),
        contentBoxBg: v(cssVarNames.colors.contentBoxBg),

        inputBg: v(cssVarNames.colors.inputBg),
        inputText: v(cssVarNames.colors.inputText),
        inputBorder: v(cssVarNames.colors.inputBorder),
        inputFocus: v(cssVarNames.colors.inputFocus),
        inputPlaceholder: v(cssVarNames.colors.inputPlaceholder),

        entity: {
            dungeon: v(cssVarNames.colors.entityDungeon),
            battlemap: v(cssVarNames.colors.entityBattlemap),
            settlement: v(cssVarNames.colors.entitySettlement),
            special: v(cssVarNames.colors.entitySpecial),
            npcMinor: v(cssVarNames.colors.npcMinor),
            npcMajor: v(cssVarNames.colors.npcMajor),
            npcAntagonist: v(cssVarNames.colors.npcAntagonist),
            npcCreature: v(cssVarNames.colors.npcCreature),
        }
    },
    fonts: {
        header: v(cssVarNames.fonts.header),
        body: v(cssVarNames.fonts.body),
        statTitle: v(cssVarNames.fonts.statTitle),
        statBody: v(cssVarNames.fonts.statBody),
    },
    spacing: {
        xs: v(cssVarNames.spacing.xs),
        s: v(cssVarNames.spacing.s),
        m: v(cssVarNames.spacing.m),
        l: v(cssVarNames.spacing.l),
        xl: v(cssVarNames.spacing.xl),
        xxl: v(cssVarNames.spacing.xxl),
    },
    borders: {
        radius: v(cssVarNames.borders.radius),
        main: v(cssVarNames.borders.main),
        light: v(cssVarNames.borders.light),
    }
};
