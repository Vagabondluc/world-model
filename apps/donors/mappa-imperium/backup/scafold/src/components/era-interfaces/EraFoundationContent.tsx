import React, { useState, useMemo } from 'react';
import type { ElementCard, Player, Faction, Settlement } from '../../types';
import PrimeFactionCreator from './era-foundation/PrimeFactionCreator';
import NeighborPlacer from './era-foundation/NeighborPlacer';
import SettlementPlacer from './era-foundation/SettlementPlacer';
import ConfirmationModal from '../shared/ConfirmationModal';
import EditElementModal from '../shared/EditElementModal';
import { useGame } from '../../contexts/GameContext';
import StepProgressBar from '../shared/StepProgressBar';
import EraLayoutContainer from './common/EraLayoutContainer';
import EraFoundationRules from './common/rules/EraFoundationRules';
import ObserverMode from '../shared/ObserverMode';

interface EraFoundationContentProps {
    currentPlayer: Player | null;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>) => void;
    onUpdateElement: (element: ElementCard) => void;
    onDeleteElement: (elementId: string) => void;
    onExportElementHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

type GameplayStep = 'faction' | 'neighbor' | 'settlement';

const EraFoundationContent = ({ 
    currentPlayer, 
    elements, 
    onCreateElement, 
    onUpdateElement,
    onDeleteElement,
    onExportElementHtml,
    onExportMarkdown
}: EraFoundationContentProps) => {
    const [editingElement, setEditingElement] = useState<ElementCard | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{id: string, name: string} | null>(null);

    const { eraUiState, handleUpdateEraUiState } = useGame();
    const gameplayStep = eraUiState.eraThree.gameplayStep as GameplayStep;
    
    const handleStepChange = (step: GameplayStep) => handleUpdateEraUiState({ eraThree: { gameplayStep: step }});

    const { playerFaction, playerNeighbor, playerSettlements, sidebarElements, stepProgress } = useMemo(() => {
        if (!currentPlayer) return { playerFaction: null, playerNeighbor: null, playerSettlements: [], sidebarElements: [], stepProgress: {} };
        const playerElements = elements.filter(e => e.owner === currentPlayer.playerNumber && e.era === 3);
        const factions = playerElements.filter(e => e.type === 'Faction');
        
        const pFaction = factions.find(e => !(e.data as Faction).isNeighbor) || null;
        const pNeighbor = factions.find(e => (e.data as Faction).isNeighbor) || null;
        const pSettlements = playerElements.filter(e => e.type === 'Settlement');
        
        const settlementProgress = pSettlements.filter(s => (s.data as Settlement).purpose !== 'Capital').length;

        return {
            playerFaction: pFaction,
            playerNeighbor: pNeighbor,
            playerSettlements: pSettlements,
            sidebarElements: [pFaction, pNeighbor, ...pSettlements].filter(Boolean) as ElementCard[],
            stepProgress: {
                faction: { completed: pFaction ? 1 : 0, total: 1 },
                neighbor: { completed: pNeighbor ? 1 : 0, total: 1 },
                settlement: { completed: settlementProgress, total: 2 }
            }
        };
    }, [elements, currentPlayer]);

    const handleOpenModal = (element: ElementCard) => setEditingElement(element);
    const handleCloseModal = () => setEditingElement(null);
    
    const handleSaveEdit = (updatedElement: ElementCard) => {
        onUpdateElement(updatedElement);
        handleCloseModal();
    };

    const handleDeleteRequest = (elementId: string, elementName: string) => {
        setConfirmDelete({ id: elementId, name: elementName });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete) {
            onDeleteElement(confirmDelete.id);
            setConfirmDelete(null);
        }
    };

    const steps = [
        { id: 'faction', title: 'Prime Faction' },
        { id: 'neighbor', title: 'Neighbor' },
        { id: 'settlement', title: 'Settlements' },
    ];

    if (!currentPlayer) {
        return (
            <EraLayoutContainer
                eraName="Era III: Age of Foundation"
                eraIcon="🏛️"
                eraDescription="The wandering clans of the world are beginning to come together and form permanent settlements."
                rulesComponent={<EraFoundationRules />}
                gameplayComponent={<ObserverMode />}
                sidebarTitle="Era III Creations"
                sidebarElements={[]}
                elementsForContext={elements}
                onEditElement={() => {}}
                onDeleteElement={() => {}}
                onExportHtml={onExportElementHtml}
                onExportMarkdown={onExportMarkdown}
            />
        );
    }

    const gameplayContent = useMemo(() => {
        const renderCurrentStep = () => {
            switch(gameplayStep) {
                case 'faction': return <PrimeFactionCreator currentPlayer={currentPlayer} onCreateElement={onCreateElement} />;
                case 'neighbor': return <NeighborPlacer currentPlayer={currentPlayer} onCreateElement={onCreateElement} />;
                case 'settlement': return <SettlementPlacer currentPlayer={currentPlayer} primeFaction={playerFaction} onCreateElement={onCreateElement} settlements={playerSettlements} />;
                default: return null;
            }
        };

        return (
            <>
                <StepProgressBar 
                    steps={steps} 
                    currentStepId={gameplayStep} 
                    stepProgress={stepProgress} 
                    onStepChange={(stepId) => handleStepChange(stepId as GameplayStep)} 
                />
                <div className="space-y-8">{renderCurrentStep()}</div>
            </>
        );
    }, [currentPlayer, gameplayStep, stepProgress, handleStepChange, onCreateElement, playerFaction, playerSettlements]);


    return (
        <div>
            <EraLayoutContainer
                eraName="Era III: Age of Foundation"
                eraIcon="🏛️"
                eraDescription="The wandering clans of the world are beginning to come together and form permanent settlements. This era covers the first 30 years of your faction's story."
                rulesComponent={<EraFoundationRules />}
                gameplayComponent={gameplayContent}
                sidebarTitle="Era III Creations"
                sidebarElements={sidebarElements}
                elementsForContext={elements}
                onEditElement={handleOpenModal}
                onDeleteElement={handleDeleteRequest}
                onExportHtml={onExportElementHtml}
                onExportMarkdown={onExportMarkdown}
            />

            {editingElement && (
                <EditElementModal
                    element={editingElement}
                    isOpen={!!editingElement}
                    onClose={handleCloseModal}
                    onSave={handleSaveEdit}
                />
            )}
            {confirmDelete && (
                <ConfirmationModal
                    isOpen={!!confirmDelete}
                    onClose={() => setConfirmDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Deletion"
                    message={<>Are you sure you want to permanently delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</>}
                    confirmText="Delete"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                />
            )}
        </div>
    );
};

export default EraFoundationContent;