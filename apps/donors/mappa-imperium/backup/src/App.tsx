import React, { useState, useEffect } from 'react';
import { useGameStore } from './stores/gameStore';

import GameSetup from './components/session/GameSetup';
import AiPlayerSetup from './components/session/AiPlayerSetup';
import PlayerSelection from './components/session/PlayerSelection';
import ChronicleLobby from './components/session/ChronicleLobby';
import GameEndScreen from './components/session/GameEndScreen';
import AppLayout from './components/layout/AppLayout';
import UnifiedDebugSystem from './components/debug/UnifiedDebugSystem';
import LoadingSpinner from './components/shared/LoadingSpinner';

import { Bug } from 'lucide-react';
import { Button } from './components/ui/Button';

// The App component now acts as a view router based on the global game state.
const App = () => {
    const {
        gameState,
        gameSettings,
        players,
        isDebuggerOpen,
        toggleDebugger,
        isDebugMode,
        prepopulateEra,
        toggleEraNavigationLock,
        exportGameData,
        importGameData,
        clearAllData,
        currentEraId,
        getCompletedEras,
        isGameReady,
    } = useGameStore();

    const [showReset, setShowReset] = useState(false);

    useEffect(() => {
        if (isGameReady) {
            setShowReset(false);
            return;
        }

        const timer = setTimeout(() => {
            if (!useGameStore.getState().isGameReady) {
                setShowReset(true);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [isGameReady]);

    const handleReset = () => {
        if (window.confirm('Are you sure you want to perform a hard reset? This will clear all saved game data from this browser session.')) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
    };


    const renderGameState = () => {
        switch (gameState) {
            case 'setup':
                return <GameSetup />;
            case 'ai_configuration':
                if (!gameSettings) return <div>Error: Game settings not found for AI configuration.</div>;
                return <AiPlayerSetup />;
            case 'player_selection':
                return <PlayerSelection />;
            case 'lobby':
                return <ChronicleLobby />;
            case 'loading_feed':
                return <div className="min-h-screen flex items-center justify-center bg-gray-200"><LoadingSpinner message="Loading Chronicle..." /></div>;
            case 'playing':
                return <AppLayout />;
            case 'finished':
                return <GameEndScreen />;
            default:
                return <div>Unknown game state</div>;
        }
    };

    return (
        <>
            {showReset && !isGameReady && (
                <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-red-700 mb-4">Application Failed to Load</h2>
                        <p className="text-gray-600 mb-6">The application seems to be stuck. This can sometimes happen due to corrupted session data. A hard reset might fix the issue.</p>
                        <Button onClick={handleReset} variant="destructive">
                            Hard Reset Application
                        </Button>
                        <p className="text-xs text-gray-500 mt-4"><strong>Warning:</strong> This will clear all game data from your browser's session and local storage.</p>
                    </div>
                </div>
            )}
            
            {renderGameState()}
            
            {/* Debug Toggle Button */}
            {isDebugMode && (
                <div className="fixed bottom-4 right-4 z-[100]">
                    <Button
                    onClick={toggleDebugger}
                    variant="destructive"
                    size="lg"
                    className="rounded-full !p-3 aspect-square"
                    aria-label="Toggle Debug Menu"
                    title="Toggle Debug Menu (Ctrl+Shift+D)"
                    >
                    <Bug className="w-6 h-6" />
                    </Button>
                </div>
            )}

            {/* Debug System Component */}
            <UnifiedDebugSystem
                isOpen={isDebuggerOpen}
                onClose={toggleDebugger}
                isDebugMode={isDebugMode}
                players={players}
                onPrepopulateEra={prepopulateEra}
                onUnlockAllEras={toggleEraNavigationLock}
                onExportGameData={exportGameData}
                onImportGameData={importGameData}
                onClearAllData={clearAllData}
                currentEraId={currentEraId}
                completedEras={getCompletedEras()}
            />
        </>
    );
};

export default App;