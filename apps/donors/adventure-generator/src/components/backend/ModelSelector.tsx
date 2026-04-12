import React, { useEffect } from 'react';
import { useBackendStore } from '../../stores/backendStore';
import { Box, Layers } from 'lucide-react';

export const ModelSelector: React.FC = () => {
    const {
        availableModels,
        selectedModel,
        setSelectedModel,
        fetchModels,
        providerConnected
    } = useBackendStore();

    useEffect(() => {
        if (providerConnected) {
            fetchModels();
        }
    }, [fetchModels, providerConnected]);

    if (!providerConnected) return null;

    return (
        <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Layers size={14} />
                <span className="font-medium">Active Language Model</span>
            </div>

            <div className="relative group">
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                >
                    {availableModels.length > 0 ? (
                        availableModels.map(model => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))
                    ) : (
                        <option disabled>No models found</option>
                    )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Box size={14} />
                </div>
            </div>

            <p className="text-[10px] text-slate-500 px-1">
                Note: Selecting a different model updates the backend configuration instantly.
            </p>
        </div>
    );
};
