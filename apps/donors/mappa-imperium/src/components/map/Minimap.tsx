import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { cn } from '../../utils/cn';
import { Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';

export const Minimap = () => {
    const { mapData } = useGameStore();

    // Placeholder data/logic
    const hasMap = !!mapData;

    return (
        <div className="bg-white border border-stone-200 rounded-lg shadow-md p-2 w-48 h-48 flex flex-col gap-2 relative">
            <div className="flex-1 bg-stone-100 rounded border border-stone-200 relative overflow-hidden flex items-center justify-center">
                {hasMap ? (
                    <div className="text-[10px] text-stone-400">Map View</div>
                ) : (
                    <div className="text-[10px] text-stone-300 italic">No Map</div>
                )}
                {/* Viewport Frame Placeholder */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-amber-500 rounded-sm pointer-events-none opacity-50"></div>
            </div>

            <div className="flex justify-between items-center px-1">
                <div className="flex gap-1">
                    <button className="text-stone-400 hover:text-stone-600"><Minimize2 className="w-3 h-3" /></button>
                    <button className="text-stone-400 hover:text-stone-600"><Maximize2 className="w-3 h-3" /></button>
                </div>
                <button className="text-stone-400 hover:text-stone-600"><Eye className="w-3 h-3" /></button>
            </div>
        </div>
    );
};
