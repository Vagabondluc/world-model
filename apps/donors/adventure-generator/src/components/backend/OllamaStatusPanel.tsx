import React, { useEffect } from 'react';
import { useBackendStore } from '../../stores/backendStore';
import { Activity, Globe, Cpu, RefreshCw } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';

export const OllamaStatusPanel: React.FC = () => {
    const {
        providerConnected: ollamaConnected,
        providerUrl: ollamaUrl,
        providerVersion: ollamaVersion,
        checkProviderStatus: checkOllamaStatus
    } = useBackendStore();

    const { userRole } = useUserStore();

    useEffect(() => {
        checkOllamaStatus();
    }, [checkOllamaStatus]);

    if (!ollamaConnected) {
        return (
            <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-6 text-center">
                <Activity size={32} className="text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">AI Engine is Unavailable</h3>
                <p className="text-rose-200 mb-6 text-sm max-w-sm mx-auto">
                    Some tools (Trap Generator, NPC Chatter) require the AI engine to function.
                    You can still use manual tools like the Dice Roller or Compendium.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => checkOllamaStatus()}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <RefreshCw size={16} /> Retry Connection
                    </button>
                    {userRole !== 'GM' && (
                        <div className="text-xs text-rose-400 mt-2 font-mono flex items-center gap-1 justify-center">
                            Target: {ollamaUrl}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-emerald-400" />
                    <h3 className="font-semibold text-emerald-100 italic">AI Engine Status</h3>
                </div>
                {userRole === 'Admin' && (
                    <button
                        onClick={() => checkOllamaStatus()}
                        className="text-xs bg-emerald-800/50 hover:bg-emerald-700/50 px-2 py-1 rounded text-emerald-200 transition-colors"
                    >
                        Check Status
                    </button>
                )}
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-emerald-300 font-medium">Online & Ready</span>
                {(userRole === 'Admin' || userRole === 'Designer') && (
                    <div className="flex items-center gap-4 text-xs text-emerald-500/60 border-l border-emerald-500/20 pl-4">
                        <div className="flex items-center gap-1">
                            <Globe size={12} />
                            <span className="truncate">{ollamaUrl}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Cpu size={12} />
                            <span>v{ollamaVersion}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
