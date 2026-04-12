import React from 'react';
import './scafold/index.css';
import ReactDOM from 'react-dom/client';
import AppLayout from './src/components/layout/AppLayout';
import GameSetup from './src/components/session/GameSetup';
import PlayerSelection from './src/components/session/PlayerSelection';
import { GameProvider, useGame } from './src/contexts/GameContext';
import ChronicleLobby from './src/components/session/ChronicleLobby';
import AiPlayerSetup from './src/components/session/AiPlayerSetup';
import { AIProvider } from './src/contexts/AIContext';
import GameEndScreen from './src/components/session/GameEndScreen';


/**
 * Main App Component
 * Now acts as a view controller, displaying content based on the gameState from context.
 */
const App = () => {
    const { 
        gameState, 
        gameSettings,
        players, 
        elements,
        handleGameStart, 
        handleDebugSetup, 
        handleImport,
        handleImportFromFeed,
        handleBrowseLobby,
        handleBackToSetup,
        handlePlayerSelect, 
        handleJoinAsObserver,
        handleAiConfigurationComplete,
    } = useGame();

    const renderContent = () => {
        switch (gameState) {
            case 'setup':
                return <GameSetup onStart={handleGameStart} onDebug={handleDebugSetup} onImport={handleImport} onImportFromFeed={handleImportFromFeed} onBrowseLobby={handleBrowseLobby} />;
            case 'ai_configuration':
                return <AiPlayerSetup gameSettings={gameSettings!} onComplete={handleAiConfigurationComplete} onBack={handleBackToSetup} />;
            case 'player_selection':
                return <PlayerSelection players={players} onSelect={handlePlayerSelect} onJoinAsObserver={handleJoinAsObserver} />;
            case 'lobby':
                return <ChronicleLobby onImportFromFeed={handleImportFromFeed} onBackToSetup={handleBackToSetup} />;
            case 'playing':
                return <AppLayout />;
            case 'loading_feed':
                return <div className="layout-centered-card text-2xl font-bold text-amber-800">Loading Chronicle...</div>;
            case 'finished':
                return <GameEndScreen />;
            default:
                return <div>Loading...</div>;
        }
    };

    return (
        <AIProvider elements={elements}>
            {renderContent()}
        </AIProvider>
    )
};

// --- Render App ---
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);