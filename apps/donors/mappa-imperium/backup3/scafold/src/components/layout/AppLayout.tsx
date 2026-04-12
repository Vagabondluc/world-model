import React, { useState, useEffect } from 'react';
import NavigationHeader from '../navigation/NavigationHeader';
import ElementManager from '../world-manager/ElementManager';
import EraContent from '../era-interfaces/EraContent';
import CompletionTracker from './CompletionTracker';
import CollaborationStatus from './CollaborationStatus';
import { useGame } from '../../contexts/GameContext';
import SettingsModal from '../shared/SettingsModal';
import UnifiedDebugSystem from '../debug/UnifiedDebugSystem';

/**
 * AppLayout Component
 * Defines the overall page structure. Consumes state from GameContext.
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
    onToggleSettingsModal,
    handleSaveSettings,
    handleUpdateElement,
    handleDeleteElement,
    handleExportElementHtml,
    handleExportElementMarkdown,
    isDebugMode,
    isDebuggerOpen,
    onToggleDebugModal,
    handlePrepopulateEra,
    gameSettings,
    handleUpdatePlayer,
    handleCreateElement,
    isEraNavigationUnlocked,
    handleToggleEraNavigationLock,
    handleExport,
    handleImport,
    handleClearAllData,
    currentEraId,
    isTransitioning,
  } = useGame();

  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isContentLoadedAndReady, setIsContentLoadedAndReady] = useState(true);

  const handleContentReady = (isReady: boolean) => {
    setIsContentLoadedAndReady(isReady);
  };

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


  if (gameRole === 'player' && !currentPlayer) {
      return <div>Error: Player role selected, but no current player is set.</div>;
  }
  
  const completedEras = Array.from({ length: currentEraId > 0 ? currentEraId - 1 : 0 }, (_, i) => i + 1);
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationHeader />
      <main className="flex-grow container mx-auto my-8 pb-40">
        <div className="content-box-main">
            <div className={isContentVisible ? 'animate-fade-in' : 'opacity-0'}>
                {view === 'eras' ? (
                    <EraContent 
                        eraId={viewedEraId} 
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={handleCreateElement} 
                        onUpdateElement={handleUpdateElement}
                        onUpdatePlayer={handleUpdatePlayer}
                        onDeleteElement={handleDeleteElement}
                        appSettings={appSettings}
                        onExportElementHtml={handleExportElementHtml}
                        onExportMarkdown={handleExportElementMarkdown}
                        gameSettings={gameSettings}
                        onReady={handleContentReady}
                    />
                ) : (
                    <ElementManager 
                        elements={elements} 
                        players={players} 
                        currentPlayer={currentPlayer}
                        gameRole={gameRole}
                        onUpdateElement={handleUpdateElement}
                        onDeleteElement={handleDeleteElement}
                        appSettings={appSettings}
                        onExportElementHtml={handleExportElementHtml}
                        onExportMarkdown={handleExportElementMarkdown}
                    />
                )}
            </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-10 mt-auto">
        <CompletionTracker />
        <CollaborationStatus />
      </div>
       <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onToggleSettingsModal}
        currentSettings={appSettings}
        onSave={handleSaveSettings}
        gameSettings={gameSettings}
      />
      {isDebugMode && (
          <UnifiedDebugSystem
            isOpen={isDebuggerOpen}
            onClose={onToggleDebugModal}
            onPrepopulateEra={handlePrepopulateEra}
            onUnlockAllEras={handleToggleEraNavigationLock}
            onExportGameData={handleExport}
            onImportGameData={handleImport}
            onClearAllData={handleClearAllData}
            currentEra={currentEraId}
            completedEras={completedEras}
            players={players}
          />
      )}
    </div>
  );
};

export default AppLayout;