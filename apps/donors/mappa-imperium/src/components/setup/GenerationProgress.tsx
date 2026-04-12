import React from 'react';
import { Loader2 } from 'lucide-react';

interface GenerationProgressProps {
    stage: string;
    progress: number; // 0-100
    error?: string | null;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
    stage,
    progress,
    error
}) => {
    if (error) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 p-8">
                <div className="flex flex-col items-center gap-4 text-center max-w-md bg-white p-6 rounded-2xl shadow-xl border border-red-200">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-800">Generation Failed</h3>
                        <p className="text-red-600 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                </div>

                <div className="w-full space-y-2 text-center">
                    <h3 className="font-bold text-xl text-indigo-900 animate-pulse">{stage}</h3>
                    <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-indigo-400 font-mono tracking-wider">{Math.round(progress)}% COMPLETE</p>
                </div>
            </div>
        </div>
    );
};
