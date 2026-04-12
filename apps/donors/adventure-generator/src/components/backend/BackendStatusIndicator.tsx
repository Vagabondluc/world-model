import React, { useEffect } from 'react';
import { useBackendStore } from '../../stores/backendStore';
import { Activity, Wifi, WifiOff } from 'lucide-react';

export const BackendStatusIndicator: React.FC = () => {
    const { isConnected, latency, checkHealth, lastHealthCheck } = useBackendStore();

    useEffect(() => {
        // Poll every 5 seconds
        const interval = setInterval(checkHealth, 5000);
        checkHealth(); // Initial check
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`
            flex items-center gap-4 px-4 py-3 rounded-lg border backdrop-blur-md transition-all
            ${isConnected
                ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                : 'bg-red-500/10 border-red-500/30 text-red-400'}
        `}>
            <div className="relative">
                {isConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                {isConnected && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide uppercase">
                    {isConnected ? "System Online" : "Disconnected"}
                </span>
                <span className="text-xs opacity-70 font-mono">
                    {isConnected
                        ? `Latency: ${latency}ms`
                        : "Backend unreachable"}
                </span>
            </div>

            {isConnected && (
                <div className="ml-auto text-xs opacity-50">
                    <Activity className="w-4 h-4 inline mr-1" />
                    v{useBackendStore.getState().version}
                </div>
            )}
        </div>
    );
};
