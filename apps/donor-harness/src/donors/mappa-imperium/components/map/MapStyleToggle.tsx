import React from 'react';
import { useGameStore } from '@mi/stores/gameStore';
import { Button } from '@mi/components/ui/Button';
import { Layout, Image as ImageIcon, Palette, BoxSelect } from 'lucide-react';
import { cn } from '@mi/utils/cn';
import { TileTheme, OutlineStyle } from '@mi/types';

// Outline definitions - could be moved to a config file
const OUTLINE_STYLES: OutlineStyle[] = [
    {
        id: 'no-outline',
        name: 'No Outline',
        description: 'Clean tiles without borders',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - No Outline - 128x144.png',
        thickness: 0,
        color: 'transparent'
    },
    {
        id: 'black-1px',
        name: 'Black Thin',
        description: 'Thin black border',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - Black Outline 1px - 128x128.png',
        thickness: 1,
        color: '#000000'
    },
    {
        id: 'black-2px',
        name: 'Black Medium',
        description: 'Medium black border',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - Black Outline 2px - 128x128.png',
        thickness: 2,
        color: '#000000'
    },
    {
        id: 'white-1px',
        name: 'White Thin',
        description: 'Thin white border',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - White Outline 1px - 128x128.png',
        thickness: 1,
        color: '#FFFFFF'
    },
    {
        id: 'white-2px',
        name: 'White Medium',
        description: 'Medium white border',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - White Outline 2px - 128x128.png',
        thickness: 2,
        color: '#FFFFFF'
    }
];

const THEMES: TileTheme[] = ['classic', 'vibrant', 'pastel', 'sketchy'];

export const MapStyleToggle: React.FC = () => {
    const { appSettings, saveSettings } = useGameStore();
    const mode = appSettings.mapRender?.mode || 'svg';
    const currentTheme = appSettings.mapRender?.theme || 'classic';
    const currentOutlineId = appSettings.mapRender?.outline?.id || 'no-outline';
    const currentOutline = OUTLINE_STYLES.find(o => o.id === currentOutlineId) || OUTLINE_STYLES[0];

    const updateSettings = (updates: Partial<typeof appSettings.mapRender>) => {
        saveSettings({
            ...appSettings,
            mapRender: {
                // Ensure defaults if undefined
                mode: 'svg',
                theme: 'classic',
                ...appSettings.mapRender,
                ...updates
            }
        });
    };

    const toggleMode = () => {
        updateSettings({ mode: mode === 'svg' ? 'tile' : 'svg' });
    };

    const toggleTheme = () => {
        const currentIndex = THEMES.indexOf(currentTheme);
        const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
        updateSettings({ theme: nextTheme });
    };

    const toggleOutline = () => {
        const currentIndex = OUTLINE_STYLES.findIndex(o => o.id === currentOutline.id);
        const nextOutline = OUTLINE_STYLES[(currentIndex + 1) % OUTLINE_STYLES.length];
        updateSettings({ outline: nextOutline });
    };

    return (
        <div className="fixed bottom-20 right-4 z-[40] flex flex-col gap-2">

            {/* Outline Toggle (Tile Mode Only) */}
            {mode === 'tile' && (
                <Button
                    onClick={toggleOutline}
                    variant="secondary"
                    size="sm"
                    className="rounded-full shadow-lg border-2 border-stone-200 bg-white text-stone-600 transition-all p-3 aspect-square hover:bg-stone-50"
                    title={`Outline: ${currentOutline.name}`}
                >
                    <BoxSelect className="w-5 h-5" />
                </Button>
            )}

            {/* Theme Toggle (Tile Mode Only) */}
            {mode === 'tile' && (
                <Button
                    onClick={toggleTheme}
                    variant="secondary"
                    size="sm"
                    className={cn(
                        "rounded-full shadow-lg border-2 transition-all p-3 aspect-square",
                        currentTheme === 'classic' && "border-amber-600 bg-amber-50 text-amber-700",
                        currentTheme === 'vibrant' && "border-purple-600 bg-purple-50 text-purple-700",
                        currentTheme === 'pastel' && "border-pink-600 bg-pink-50 text-pink-700",
                        currentTheme === 'sketchy' && "border-slate-600 bg-slate-50 text-slate-700",
                    )}
                    title={`Theme: ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`}
                >
                    <Palette className="w-5 h-5" />
                </Button>
            )}

            {/* Main Mode Toggle */}
            <Button
                onClick={toggleMode}
                variant="secondary"
                size="sm"
                className={cn(
                    "rounded-full shadow-lg border-2 transition-all p-3 aspect-square",
                    mode === 'tile' ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-stone-200 bg-white text-stone-600"
                )}
                title={`Switch to ${mode === 'svg' ? 'Illustrated' : 'Schematic'} View`}
            >
                {mode === 'svg' ? <ImageIcon className="w-5 h-5" /> : <Layout className="w-5 h-5" />}
            </Button>
        </div>
    );
};
