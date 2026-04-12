import React from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Button } from '../ui/Button';
import { WifiOff, RefreshCw } from 'lucide-react';
import { ConnectionStatus } from '@mi/types';

interface MapStatusOverlayProps {
    isLoading: boolean;
    error: string | null;
    connectionStatus?: ConnectionStatus;
    onRetry?: () => void;
}

const MapStatusOverlay: React.FC<MapStatusOverlayProps> = ({
    isLoading,
    error,
    connectionStatus = 'connected',
    onRetry
}) => {
    // If everything is fine, don't render anything
    if (!isLoading && !error && connectionStatus === 'connected') {
        return null;
    }

    // Disconnected State (High Priority)
    if (connectionStatus === 'disconnected') {
        return (
            <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="bg-red-900/50 p-6 rounded-full mb-4 animate-pulse">
                    <WifiOff className="w-12 h-12 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connection Lost</h2>
                <p className="text-stone-300 max-w-sm mb-6">
                    You have lost connection to the game server. Attempting to reconnect...
                </p>
                {onRetry && (
                    <Button onClick={onRetry} variant="secondary" className="hover:bg-white/10">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry Now
                    </Button>
                )}
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="absolute inset-0 z-[150] bg-stone-900/90 flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="p-4 bg-red-900/30 rounded-lg border border-red-700 max-w-md">
                    <h3 className="text-xl font-bold text-red-400 mb-2">Map Error</h3>
                    <p className="text-stone-300 mb-4">{error}</p>
                    {onRetry && (
                        <Button onClick={onRetry} variant="primary">
                            Try Again
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // Loading State
    if (isLoading) {
        return (
            <div className="absolute inset-0 z-[150] bg-stone-900/90 flex flex-col items-center justify-center text-white">
                <LoadingSpinner message="Loading Map Data..." />
                <div className="w-64 h-1 bg-stone-800 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-amber-500 animate-indeterminate-progress"></div>
                </div>
            </div>
        );
    }

    return null;
};

export default MapStatusOverlay;
