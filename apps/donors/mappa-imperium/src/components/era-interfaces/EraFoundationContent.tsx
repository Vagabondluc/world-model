
import React, { useState, useMemo } from 'react';
import type { ElementCard, Faction, Settlement } from '../../types';
import type { StepProgress } from '../../types/progress.types';
import PrimeFactionCreator from './era-foundation/PrimeFactionCreator';
import NeighborPlacer from './era-foundation/NeighborPlacer';
import SettlementPlacer from './era-foundation/SettlementPlacer';
import ConfirmationModal from '../shared/ConfirmationModal';
import EditElementModal from '../shared/EditElementModal';
import { useGameStore, initialEraUiState } from '@/stores/gameStore';
import StepProgressBar from '../shared/StepProgressBar';
import EraLayoutContainer from './common/EraLayoutContainer';
import EraFoundationRules from './common/rules/EraFoundationRules';
import ObserverMode from '../shared/ObserverMode';

type GameplayStep = 'faction' | 'neighbor' | 'settlement';

const EraFoundationContent = () => {
    const {
        currentPlayer,
        elements,
        createElement,
        updateElement,
        deleteElement,
        exportElementHtml,
        exportElementMarkdown,
        playerUiStates,
        updateEraUiState
    } = useGameStore();

    const [editingElement, setEditingElement] = useState<ElementCard | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: string, name: string } | null>(null);

    // Derive current player's UI state
    const eraUiState = (currentPlayer && playerUiStates[currentPlayer.playerNumber]) || initialEraUiState;
    const gameplayStep = eraUiState.eraThree.gameplayStep as GameplayStep;

    const handleStepChange = (step: GameplayStep) => updateEraUiState({ eraThree: { gameplayStep: step } });

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
            } as StepProgress
        };
    }, [elements, currentPlayer]);

    const handleOpenModal = (element: ElementCard) => setEditingElement(element);
    const handleCloseModal = () => setEditingElement(null);

    const handleSaveEdit = (updatedElement: ElementCard) => {
        updateElement(updatedElement);
        handleCloseModal();
    };

    const handleDeleteRequest = (elementId: string, elementName: string) => {
        setConfirmDelete({ id: elementId, name: elementName });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete) {
            deleteElement(confirmDelete.id);
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
                onEditElement={() => { }}
                onDeleteElement={() => { }}
                onExportHtml={exportElementHtml}
                onExportMarkdown={exportElementMarkdown}
            />
        );
    }

    const gameplayContent = useMemo(() => {
        const renderCurrentStep = () => {
            switch (gameplayStep) {
                case 'faction': return <PrimeFactionCreator currentPlayer={currentPlayer} onCreateElement={createElement} />;
                case 'neighbor': return <NeighborPlacer currentPlayer={currentPlayer} onCreateElement={createElement} />;
                case 'settlement': return <SettlementPlacer currentPlayer={currentPlayer} primeFaction={playerFaction} onCreateElement={createElement} settlements={playerSettlements} />;
                default: return null;
            }
        };

        const isEraComplete =
            stepProgress.faction.completed >= 1 &&
            stepProgress.neighbor.completed >= 1 &&
            stepProgress.settlement.completed >= 2;

        return (
            <>
                <StepProgressBar
                    steps={steps}
                    currentStepId={gameplayStep}
                    stepProgress={stepProgress}
                    onStepChange={(stepId) => handleStepChange(stepId as GameplayStep)}
                />
                <div className="space-y-8">{renderCurrentStep()}</div>

                {isEraComplete && gameplayStep === 'settlement' && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg border border-amber-300 flex items-center justify-between shadow-lg">
                        <div>
                            <h3 className="text-xl font-bold text-amber-900">Era Complete: Age of Foundation</h3>
                            <p className="text-amber-800">Your empire has taken root. But the map has blank spaces waiting to be filled.</p>
                        </div>
                        <button
                            onClick={() => useGameStore.getState().advanceEra()}
                            className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-6 py-3 rounded-lg font-bold shadow transition-all transform hover:scale-105"
                        >
                            Advance to Era IV: Age of Discovery
                        </button>
                    </div>
                )}
            </>
        );
    }, [currentPlayer, gameplayStep, stepProgress, handleStepChange, createElement, playerFaction, playerSettlements, playerNeighbor]);


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
                onExportHtml={exportElementHtml}
                onExportMarkdown={exportElementMarkdown}
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
