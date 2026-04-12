import React from 'react';
import { Settings, Compass, Trees, Eye } from 'lucide-react';
import { SeedControls } from './SeedControls';
import { MapGenerationAlgorithm, MapRenderMode, TileTheme } from '@mi/types';

interface GenerationSettingsPanelProps {
    algorithm: MapGenerationAlgorithm;
    setAlgorithm: (algo: MapGenerationAlgorithm) => void;
    renderMode: MapRenderMode;
    setRenderMode: (mode: MapRenderMode) => void;
    tileTheme: TileTheme;
    setTileTheme: (theme: TileTheme) => void;
    seed: string;
    setSeed: (seed: string) => void;
    locationDensity: number;
    setLocationDensity: (val: number) => void;
    settlementDensity: number;
    setSettlementDensity: (val: number) => void;
}

export const GenerationSettingsPanel: React.FC<GenerationSettingsPanelProps> = ({
    algorithm, setAlgorithm,
    renderMode, setRenderMode,
    tileTheme, setTileTheme,
    seed, setSeed,
    locationDensity, setLocationDensity,
    settlementDensity, setSettlementDensity
}) => {
    return (
        <div className="space-y-6">
            <section className="bg-white/80 backdrop-blur-md border border-stone-200 p-6 rounded-2xl shadow-xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-stone-800">
                    <Settings className="w-5 h-5" /> Generation Method
                </h2>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => setAlgorithm('imperial')}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${algorithm === 'imperial'
                            ? 'border-indigo-600 bg-indigo-50 shadow-md'
                            : 'border-stone-200 hover:border-indigo-300'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Compass className={`w-6 h-6 ${algorithm === 'imperial' ? 'text-indigo-600' : 'text-stone-400'}`} />
                            <span className="font-bold text-lg">Imperial Architect</span>
                        </div>
                        <p className="text-sm text-stone-500 leading-snug">Symmetric, fair, and balanced. Best for competitive multiplayer.</p>
                    </button>

                    <button
                        onClick={() => setAlgorithm('wilderness')}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${algorithm === 'wilderness'
                            ? 'border-emerald-600 bg-emerald-50 shadow-md'
                            : 'border-stone-200 hover:border-emerald-300'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Trees className={`w-6 h-6 ${algorithm === 'wilderness' ? 'text-emerald-600' : 'text-stone-400'}`} />
                            <span className="font-bold text-lg">Wilderness Weaver</span>
                        </div>
                        <p className="text-sm text-stone-500 leading-snug">Organic, chaotic, and natural. Best for discovery and solo play.</p>
                    </button>
                </div>

                {/* Density Controls (Wilderness Only) */}
                {algorithm === 'wilderness' && (
                    <div className="space-y-4 pt-4 border-t border-stone-200 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-stone-700">Settlement Density</span>
                                <span className="text-stone-500 text-xs">{(settlementDensity * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="2" step="0.1"
                                value={settlementDensity}
                                onChange={(e) => setSettlementDensity(parseFloat(e.target.value))}
                                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-stone-500">Frequency of cities and villages.</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-stone-700">Location Density</span>
                                <span className="text-stone-500 text-xs">{(locationDensity * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="2" step="0.1"
                                value={locationDensity}
                                onChange={(e) => setLocationDensity(parseFloat(e.target.value))}
                                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-stone-500">Frequency of dungeons and landmarks.</p>
                        </div>
                    </div>
                )}
            </section>

            <section className="bg-white/80 backdrop-blur-md border border-stone-200 p-6 rounded-2xl shadow-xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-stone-800">
                    <Eye className="w-5 h-5" /> Visual Style
                </h2>

                <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-stone-100 rounded-lg">
                        <button
                            onClick={() => setRenderMode('svg')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${renderMode === 'svg' ? 'bg-white shadow text-indigo-600' : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            Schematic (SVG)
                        </button>
                        <button
                            onClick={() => setRenderMode('tile')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${renderMode === 'tile' ? 'bg-white shadow text-indigo-600' : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            Illustrated (Atlas)
                        </button>
                    </div>

                    {renderMode === 'tile' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Tile Theme</label>
                            <select
                                value={tileTheme}
                                onChange={(e) => setTileTheme(e.target.value as TileTheme)}
                                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="classic">Classic</option>
                                <option value="vibrant">Vibrant (Thick)</option>
                                <option value="pastel">Pastel (Flat)</option>
                                <option value="sketchy">Sketchy (Draft)</option>
                            </select>
                        </div>
                    )}
                </div>
            </section>

            <div className="pt-4 border-t border-stone-200">
                <SeedControls
                    seed={seed}
                    onSeedChange={setSeed}
                />
            </div>
        </div>
    );
};
