import React, { useLayoutEffect, useEffect } from 'react';
import EraHomeContent from './EraHomeContent';
import EraCreationContent from './EraCreationContent';
import EraMythContent from './EraMythContent';
import EraFoundationContent from './EraFoundationContent';
import EraDiscoveryContent from './EraDiscoveryContent';
import EraEmpiresContent from './EraEmpiresContent';
import EraCollapseContent from './EraCollapseContent';
import type { Player, ElementCard, AppSettings, GameSettings } from '../../types';

interface EraContentProps {
    eraId: number;
    currentPlayer: Player | null;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    onUpdateElement: (element: ElementCard) => void;
    onUpdatePlayer: (player: Player) => void;
    onDeleteElement: (elementId: string) => void;
    appSettings: AppSettings;
    onExportElementHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
    gameSettings: GameSettings | null;
    onReady: (isReady: boolean) => void;
}

const EraContent = ({ 
    eraId, 
    currentPlayer, 
    elements, 
    onCreateElement, 
    onUpdateElement,
    onUpdatePlayer, 
    onDeleteElement,
    appSettings,
    onExportElementHtml,
    onExportMarkdown,
    gameSettings,
    onReady,
}: EraContentProps) => {
    // Immediately signal that we are not ready when the component is about to render with a new eraId.
    // useLayoutEffect runs synchronously before the browser paints, preventing race conditions.
    useLayoutEffect(() => {
        onReady(false);
    }, [eraId, onReady]);

    // Signal that we are ready after the component has mounted/updated.
    // A timeout ensures this runs after the current render pass is complete.
    useEffect(() => {
        const timer = setTimeout(() => {
            onReady(true);
        }, 0); // next tick
        return () => clearTimeout(timer);
    }, [eraId, onReady]);

    const renderEra = () => {
        switch (eraId) {
            case 0:
                return <EraHomeContent />;
            case 1:
                return <EraCreationContent 
                            currentPlayer={currentPlayer} 
                            elements={elements}
                            onCreateElement={onCreateElement} 
                            onUpdateElement={onUpdateElement}
                            onDeleteElement={onDeleteElement}
                            onExportElementHtml={onExportElementHtml}
                            onExportMarkdown={onExportMarkdown}
                        />;
            case 2:
                return <EraMythContent 
                    currentPlayer={currentPlayer}
                    elements={elements}
                    onCreateElement={onCreateElement} 
                    onUpdateElement={onUpdateElement}
                    onUpdatePlayer={onUpdatePlayer}
                    onDeleteElement={onDeleteElement}
                    appSettings={appSettings}
                    onExportElementHtml={onExportElementHtml}
                    onExportMarkdown={onExportMarkdown}
                />;
            case 3:
                return <EraFoundationContent 
                    currentPlayer={currentPlayer}
                    elements={elements}
                    onCreateElement={onCreateElement}
                    onUpdateElement={onUpdateElement}
                    onDeleteElement={onDeleteElement}
                    onExportElementHtml={onExportElementHtml}
                    onExportMarkdown={onExportMarkdown}
                />;
            case 4:
                return <EraDiscoveryContent 
                    currentPlayer={currentPlayer}
                    elements={elements}
                    onCreateElement={onCreateElement}
                    onUpdateElement={onUpdateElement}
                    onDeleteElement={onDeleteElement}
                    appSettings={appSettings}
                    onExportElementHtml={onExportElementHtml}
                    onExportMarkdown={onExportMarkdown}
                    gameSettings={gameSettings}
                />;
            case 5:
                return <EraEmpiresContent 
                    currentPlayer={currentPlayer}
                    elements={elements}
                    onCreateElement={onCreateElement}
                    onUpdateElement={onUpdateElement}
                    gameSettings={gameSettings}
                />;
            case 6:
                return <EraCollapseContent 
                    currentPlayer={currentPlayer}
                    elements={elements}
                    onCreateElement={onCreateElement}
                    gameSettings={gameSettings}
                />;
            default:
                return <EraHomeContent />;
        }
    };

    return (
        <div>
            {renderEra()}
        </div>
    );
};

export default EraContent;