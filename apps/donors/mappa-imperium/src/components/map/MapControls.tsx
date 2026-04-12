import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../ui/Button';
import { Plus, Minus, Maximize, Layers, Eye, EyeOff } from 'lucide-react';
import { Minimap } from './Minimap';
import { cn } from '../../utils/cn';

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetView: () => void;
}

const MapControls = ({ onZoomIn, onZoomOut, onResetView }: MapControlsProps) => {
    const { layerState, toggleLayer } = useGameStore();

    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 pointer-events-none">
            {/* Map Actions */}
            <div className="flex flex-col gap-1 pointer-events-auto bg-white rounded-lg shadow-md p-1 border border-stone-200">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomIn}
                    className="h-8 w-8 p-0 flex items-center justify-center"
                    title="Zoom In (+)"
                >
                    <Plus className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomOut}
                    className="h-8 w-8 p-0 flex items-center justify-center"
                    title="Zoom Out (-)"
                >
                    <Minus className="w-4 h-4" />
                </Button>
                <div className="h-px bg-stone-200 my-0.5" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onResetView}
                    className="h-8 w-8 p-0 flex items-center justify-center"
                    title="Reset View (0)"
                >
                    <Maximize className="w-4 h-4" />
                </Button>
            </div>

            {/* Layer Controls */}
            <div className="flex flex-col gap-1 pointer-events-auto bg-white rounded-lg shadow-md p-2 border border-stone-200 min-w-[120px]">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-1 px-1">
                    <Layers className="w-3 h-3" /> LAYERS
                </div>

                <button
                    onClick={() => toggleLayer('surface')}
                    className={cn(
                        "flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors",
                        layerState.surface ? "bg-amber-50 text-amber-900 font-semibold" : "text-stone-500 hover:bg-stone-50"
                    )}
                >
                    <span>Surface</span>
                    {layerState.surface ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>

                <button
                    onClick={() => toggleLayer('underdark')}
                    className={cn(
                        "flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors",
                        layerState.underdark ? "bg-indigo-50 text-indigo-900 font-semibold" : "text-stone-500 hover:bg-stone-50"
                    )}
                >
                    <span>Underdark</span>
                    {layerState.underdark ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>

                <button
                    onClick={() => toggleLayer('fogOfWar')}
                    className={cn(
                        "flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors",
                        layerState.fogOfWar ? "bg-stone-100 text-stone-900 font-semibold" : "text-stone-500 hover:bg-stone-50"
                    )}
                >
                    <span>Fog of War</span>
                    {layerState.fogOfWar ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
            </div>

            {/* Minimap - Visible on larger screens */}
            <div className="hidden lg:block pointer-events-auto">
                <Minimap />
            </div>
        </div>
    );
};

export default MapControls;
