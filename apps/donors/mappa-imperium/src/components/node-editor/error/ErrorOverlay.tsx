/**
 * Error Overlay
 * Floating panel displaying validation errors.
 */

import React, { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { ErrorCard } from './ErrorCard';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export const ErrorOverlay: React.FC = () => {
    const { validationErrors } = useGameStore();
    const [isExpanded, setIsExpanded] = useState(true);

    if (validationErrors.length === 0) return null;

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[400px] max-w-[90vw] flex flex-col gap-2 z-50 pointer-events-none">

            {/* Header / Toggle */}
            <div className="pointer-events-auto flex justify-center">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
                >
                    <AlertTriangle size={16} />
                    <span className="text-xs font-bold">
                        {validationErrors.length} Issue{validationErrors.length !== 1 ? 's' : ''} Found
                    </span>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
            </div>

            {/* Error List */}
            {isExpanded && (
                <div className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-red-200 rounded-lg shadow-xl p-3 max-h-[300px] overflow-y-auto space-y-2 animate-in slide-in-from-bottom-4">
                    {validationErrors.map((error, idx) => (
                        <div key={`${error.id}-${idx}`}>
                            <ErrorCard error={error} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
