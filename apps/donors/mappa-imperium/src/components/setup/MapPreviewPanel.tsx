import React from 'react';
import { UnifiedMapRenderer } from '@/components/map/UnifiedMapRenderer';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { GenerationProgress } from './GenerationProgress';
import { MapRenderMode, TileTheme, BiomeType } from '@/types';

interface MapPreviewPanelProps {
    generationState: {
        isGenerating: boolean;
        stage: string;
        progress: number;
        error: string | null;
    };
    previewMap: {
        hexBiomes: Record<string, BiomeType>;
        regions: any[];
        locations: any[];
    } | null;
    renderMode: MapRenderMode;
    tileTheme: TileTheme;
    handleConfirm: () => void;
}

export const MapPreviewPanel: React.FC<MapPreviewPanelProps> = ({
    generationState, previewMap, renderMode, tileTheme, handleConfirm
}) => {
    return (
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden relative shadow-2xl min-h-[500px]">
                {generationState.isGenerating || generationState.error ? (
                    <GenerationProgress
                        stage={generationState.stage}
                        progress={generationState.progress}
                        error={generationState.error}
                    />
                ) : previewMap ? (
                    <UnifiedMapRenderer
                        hexBiomes={previewMap.hexBiomes}
                        locations={previewMap.locations}
                        mode={renderMode}
                        theme={tileTheme}
                        size={40}
                        zoom={1}
                        pan={{ x: 0, y: 0 }}
                        bindGestures={() => { }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400 italic">
                        No preview generated.
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleConfirm}
                    disabled={!previewMap || generationState.isGenerating}
                    className="px-12 py-8 text-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-indigo-500/20 disabled:bg-stone-300 disabled:shadow-none transition-all flex items-center gap-3"
                >
                    <CheckCircle className="w-6 h-6" /> Embark into this World
                </Button>
            </div>
        </div>
    );
};
