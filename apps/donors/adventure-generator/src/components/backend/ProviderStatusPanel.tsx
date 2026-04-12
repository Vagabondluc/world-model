import React, { useEffect } from 'react';
import { useBackendStore } from '../../stores/backendStore';
import { Activity, Globe, Cpu } from 'lucide-react';

export const ProviderStatusPanel: React.FC = () => {
    const {
        providerConnected,
        activeProvider,
        providerUrl,
        providerVersion,
        checkProviderStatus
    } = useBackendStore();

    useEffect(() => {
        checkProviderStatus();
    }, [checkProviderStatus]);

    const getProviderName = () => {
        switch (activeProvider) {
            case 'ollama': return 'Ollama';
            case 'lm_studio': return 'LM Studio';
            case 'webui': return 'Text Gen WebUI';
            default: return 'AI Provider';
        }
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Activity size={18} className={providerConnected ? "text-emerald-400" : "text-rose-400"} />
                    <h3 className="font-semibold text-slate-100 italic">{getProviderName()} Service Status</h3>
                </div>
                <button
                    onClick={() => checkProviderStatus()}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300 transition-colors"
                >
                    Retry Connection
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Globe size={14} />
                    <span className="truncate">{providerUrl}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Cpu size={14} />
                    <span>{providerVersion ? `v${providerVersion}` : (providerConnected ? "Connected" : "Offline")}</span>
                </div>
            </div>

            {!providerConnected && (
                <div className="mt-3 p-2 bg-rose-500/10 border border-rose-500/20 rounded text-xs text-rose-300">
                    Warning: {getProviderName()} is unreachable. AI generation will fail.
                    Ensure the service is running at {providerUrl}.
                </div>
            )}
        </div>
    );
};
