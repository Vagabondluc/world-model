/**
 * Error Card
 * Displays a single validation error.
 */

import React from 'react';
import { GraphError, NodeId } from '@/types/nodeEditor.types';
import { useGameStore } from '@/stores/gameStore';
import { AlertCircle, Target, X } from 'lucide-react';

interface ErrorCardProps {
    error: GraphError;
    onDismiss?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, onDismiss }) => {
    const { selectNode, selectConnection } = useGameStore();

    const handleJumpTo = () => {
        if (error.id) {
            if (error.type === 'node') {
                selectNode(error.id as NodeId);
            } else if (error.type === 'connection') {
                selectConnection(error.id);
            }
        }
    };

    return (
        <div className="bg-white border-l-4 border-red-500 rounded shadow-md p-3 flex gap-3 items-start animate-in slide-in-from-bottom-2 fade-in duration-300">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />

            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 font-medium break-words">
                    {error.message}
                </p>
                {error.id && (
                    <button
                        onClick={handleJumpTo}
                        className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 mt-1"
                    >
                        <Target size={10} />
                        Jump to source
                    </button>
                )}
            </div>

            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};
