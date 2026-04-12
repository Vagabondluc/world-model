import React from 'react';
import ReactDOM from 'react-dom/client';
import { GameProvider, useGame } from './scafold/src/contexts/GameContext';
import { AIProvider } from './scafold/src/contexts/AIContext';
import GameSetup from './scafold/src/components/session/GameSetup';
import AiPlayerSetup from './scafold/src/components/session/AiPlayerSetup';
import PlayerSelection from './scafold/src/components/session/PlayerSelection';
import ChronicleLobby from './scafold/src/components/session/ChronicleLobby';
import GameEndScreen from './scafold/src/components/session/GameEndScreen';
import AppLayout from './scafold/src/components/layout/AppLayout';
import LoadingSpinner from './scafold/src/components/shared/LoadingSpinner';

// The App component now acts as a view router based on the global game state.
const App = () => {
    const { 
        gameState, 
        handleGameStart, 
        handleDebugSetup, 
        handleImport, 
        handleImportFromFeed,
        handleBrowseLobby,
        handleBackToSetup,
        gameSettings,
        handleAiConfigurationComplete,
        players,
        handlePlayerSelect,
        handleJoinAsObserver
    } = useGame();

    switch (gameState) {
        case 'setup':
            return <GameSetup 
                        onStart={handleGameStart} 
                        onDebug={handleDebugSetup}
                        onImport={handleImport}
                        onImportFromFeed={handleImportFromFeed}
                        onBrowseLobby={handleBrowseLobby}
                    />;
        case 'ai_configuration':
            if (!gameSettings) return <div>Error: Game settings not found for AI configuration.</div>;
            return <AiPlayerSetup 
                        gameSettings={gameSettings} 
                        onComplete={handleAiConfigurationComplete}
                        onBack={handleBackToSetup}
                    />;
        case 'player_selection':
            return <PlayerSelection 
                        players={players} 
                        onSelect={handlePlayerSelect}
                        onJoinAsObserver={handleJoinAsObserver}
                    />;
        case 'lobby':
            return <ChronicleLobby 
                        onImportFromFeed={handleImportFromFeed} 
                        onBackToSetup={handleBackToSetup} 
                    />;
        case 'loading_feed':
            return <div className="layout-centered-card"><LoadingSpinner message="Loading Chronicle..." /></div>;
        case 'playing':
            return <AppLayout />;
        case 'finished':
            return <GameEndScreen />;
        default:
            return <div>Unknown game state</div>;
    }
};

const Root = () => {
    return (
        <GameProvider>
            <AIProviderWrapper>
                <App />
            </AIProviderWrapper>
        </GameProvider>
    );
};

const AIProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const { elements } = useGame();
    return <AIProvider elements={elements}>{children}</AIProvider>;
}


const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);