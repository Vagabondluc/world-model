
import React, { useState, useEffect, useCallback } from 'react';
import NavigationHeader from '../navigation/NavigationHeader';
import ElementManager from '../world-manager/ElementManager';
import EraContent from '../era-interfaces/EraContent';
import PlayerDashboard from '../player-board/PlayerDashboard';
// import CompletionTracker from './CompletionTracker'; // Deprecated/Refactored to PlayerDashboard
import CollaborationStatus from './CollaborationStatus';
import { useGameStore } from '@mi/stores/gameStore';
import SettingsModal from '../shared/SettingsModal';
import LoadingSpinner from '../shared/LoadingSpinner';
import { MapStyleToggle } from '../map/MapStyleToggle';
import ChatPanel from '../chat/ChatPanel';
import MainMapInterface from '../map/MainMapInterface';
import { componentStyles } from '../../design/tokens';
import { SVG_FILTERS } from '../../utils/accessibilityUtils';

/**
 * AppLayout Component
 * Defines the overall page structure. Consumes state from GameStore (Zustand).
 */
const AppLayout = () => {
  const {
    viewedEraId,
    view,
    players,
    currentPlayer,
    elements,
    gameRole,
    appSettings,
    isSettingsModalOpen,
    toggleSettingsModal,
    saveSettings,
    updateElement,
    deleteElement,
    exportElementHtml,
    exportElementMarkdown,
    gameSettings,
    isTransitioning,
    isGameReady,
  } = useGameStore();

  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isContentLoadedAndReady, setIsContentLoadedAndReady] = useState(true);

  // FIX: Wrapped in useCallback to maintain stable reference and prevent infinite render loops
  // in child components (EraContent) that depend on this function in their useEffects.
  const handleContentReady = useCallback((isReady: boolean) => {
    setIsContentLoadedAndReady(isReady);
  }, []);

  // This effect handles the fade-out process when a transition begins.
  useEffect(() => {
    if (isTransitioning) {
      setIsContentVisible(false);
    }
  }, [isTransitioning]);

  // This effect handles the fade-in, waiting for two signals:
  // 1. The transition from useTransition is complete (`!isTransitioning`).
  // 2. The new content has signaled that it's fully rendered (`isContentLoadedAndReady`).
  useEffect(() => {
    if (!isTransitioning && isContentLoadedAndReady) {
      // Use a micro-task delay to ensure the browser renders the component
      // in its `opacity-0` state before applying the animation class.
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, isContentLoadedAndReady, viewedEraId, view]);

  // Initialization Gate: Prevent rendering until the store is hydrated/ready.
  if (!isGameReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <LoadingSpinner message="Initializing World..." />
      </div>
    );
  }

  if (gameRole === 'player' && !currentPlayer) {
    return <div>Error: Player role selected, but no current player is set.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationHeader />
      <main className="flex-grow container mx-auto my-8 pb-40">
        <div className={componentStyles.layout.contentBoxMain}>
          <div className={isContentVisible ? 'animate-fade-in' : 'opacity-0'}>
            {view === 'eras' && (
              <EraContent
                key={viewedEraId}
                eraId={viewedEraId}
                onReady={handleContentReady}
              />
            )}
            {view === 'elements' && (
              <ElementManager
                elements={elements}
                players={players}
                currentPlayer={currentPlayer}
                gameRole={gameRole}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
                appSettings={appSettings}
                onExportElementHtml={exportElementHtml}
                onExportMarkdown={exportElementMarkdown}
              />
            )}
            {view === 'map' && <MainMapInterface />}
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-10 mt-auto">
        <PlayerDashboard />
        <CollaborationStatus />
      </div>
      <ChatPanel />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={toggleSettingsModal}
        currentSettings={appSettings}
        onSave={saveSettings}
        gameSettings={gameSettings}
      />
      <MapStyleToggle />
      <MapStyleToggle />
      {/* Accessibility Filters */}
      <div dangerouslySetInnerHTML={{ __html: SVG_FILTERS }} />
    </div>
  );
};

export default AppLayout;
