
import React, { useState, useMemo } from 'react';
import type { ElementCard, GameSettings, Faction } from '@mi/types';
import type { StepProgress } from '../../types/progress.types';
import DiscoveryEngine from './era-discovery/DiscoveryEngine';
import ColonizationPlanner from './era-discovery/ColonizationPlanner';
import ProsperityDeveloper from './era-discovery/ProsperityDeveloper';
import EditElementModal from '../shared/EditElementModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import { useGameStore, initialEraUiState } from '@mi/stores/gameStore';
import EraLayoutContainer from './common/EraLayoutContainer';
import EraDiscoveryRules from './common/rules/EraDiscoveryRules';
import ObserverMode from '../shared/ObserverMode';
import StepProgressBar from '../shared/StepProgressBar';

type GameplayStep = 'exploration' | 'colonization' | 'prosperity';

const HERO_LIMIT = 3;

const EraDiscoveryContent = () => {
    const {
        currentPlayer,
        elements,
        createElement,
        updateElement,
        deleteElement,
        exportElementHtml,
        exportElementMarkdown,
        gameSettings,
        appSettings,
        playerUiStates,
        updateEraUiState
    } = useGameStore();

    // Derive current player's UI state
    const eraUiState = (currentPlayer && playerUiStates[currentPlayer.playerNumber]) || initialEraUiState;
    const gameplayStep = eraUiState.eraFour.gameplayStep as GameplayStep;
    const setGameplayStep = (step: GameplayStep) => updateEraUiState({ eraFour: { gameplayStep: step } });

    const [editingElement, setEditingElement] = useState<ElementCard | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: string, name: string } | null>(null);

    const { stepProgress, sidebarElements, heroCount } = useMemo(() => {
        if (!gameSettings || !currentPlayer) {
            return {
                stepProgress: {
                    exploration: { completed: 0, total: 1 },
                    colonization: { completed: 0, total: 1 },
                    prosperity: { completed: 0, total: 1 },
                } as StepProgress,
                sidebarElements: [],
                heroCount: 0,
            };
        }

        const turnsPerEra: Record<GameSettings['length'], { 4: number }> = { Short: { 4: 3 }, Standard: { 4: 6 }, Long: { 4: 8 }, Epic: { 4: 11 } };
        const totalTurns = turnsPerEra[gameSettings.length][4];

        const playerEraElements = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 4);

        const completedTurns = playerEraElements.filter(el => el.creationStep === '4.1 Exploration').length;

        const heroesCreated = playerEraElements.filter(el => el.type === 'Character').length;

        const primeFaction = elements.find(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && !(el.data as Faction).isNeighbor);
        const prosperityComplete = !!(primeFaction?.data as Faction)?.industry;

        return {
            stepProgress: {
                exploration: { completed: completedTurns, total: totalTurns },
                colonization: { completed: heroesCreated, total: HERO_LIMIT },
                prosperity: { completed: prosperityComplete ? 1 : 0, total: 1 },
            } as StepProgress,
            sidebarElements: playerEraElements,
            heroCount: heroesCreated,
        };
    }, [currentPlayer, elements, gameSettings]);

    const handleCreateDiscoveryElement = (element: Omit<ElementCard, 'id'>, createdYear?: number) => {
        createElement(element, createdYear, '4.1 Exploration');
    };

    const handleCreateColonizationElement = (element: Omit<ElementCard, 'id'>, createdYear?: number) => {
        createElement(element, createdYear, '4.2 Colonization & Heroes');
    };

    const handleSaveEdit = (updatedElement: ElementCard) => {
        updateElement(updatedElement);
        setEditingElement(null);
    };

    const handleDelete = (elementId: string, elementName: string) => {
        setConfirmDelete({ id: elementId, name: elementName });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete) {
            deleteElement(confirmDelete.id);
            setConfirmDelete(null);
        }
    };

    const steps = [
        { id: 'exploration', title: '4.1 Exploration' },
        { id: 'colonization', title: '4.2 Colonization & Heroes' },
        { id: 'prosperity', title: '4.3 Faction Prosperity' },
    ];

    if (!currentPlayer) {
        return (
            <EraLayoutContainer
                eraName="Era IV: Age of Discovery"
                eraIcon="🗺️"
                eraDescription="The Empires are ready to explore and expand."
                rulesComponent={<EraDiscoveryRules />}
                gameplayComponent={<ObserverMode />}
                sidebarTitle="Era IV Discoveries"
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
                case 'exploration':
                    return <DiscoveryEngine
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={handleCreateDiscoveryElement}
                        gameSettings={gameSettings}
                    />;
                case 'colonization':
                    return <ColonizationPlanner
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={handleCreateColonizationElement}
                        gameSettings={gameSettings}
                        heroCount={heroCount}
                        heroLimit={HERO_LIMIT}
                    />;
                case 'prosperity':
                    return <ProsperityDeveloper currentPlayer={currentPlayer} elements={elements} onUpdateElement={updateElement} />;
                default:
                    return null;
            }
        };

        const isEraComplete =
            stepProgress.exploration.completed >= stepProgress.exploration.total &&
            stepProgress.colonization.completed >= stepProgress.colonization.total &&
            stepProgress.prosperity.completed >= stepProgress.prosperity.total;

        return (
            <>
                <StepProgressBar
                    steps={steps}
                    currentStepId={gameplayStep}
                    stepProgress={stepProgress}
                    onStepChange={(stepId) => setGameplayStep(stepId as GameplayStep)}
                />
                <div className="mt-6">{renderCurrentStep()}</div>

                {isEraComplete && gameplayStep === 'prosperity' && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg border border-amber-300 flex items-center justify-between shadow-lg">
                        <div>
                            <h3 className="text-xl font-bold text-amber-900">Era Complete: Age of Discovery</h3>
                            <p className="text-amber-800">The world is mapped, colonies are established, and wealth flows. Empires now turn their eyes to their neighbors.</p>
                        </div>
                        <button
                            onClick={() => useGameStore.getState().advanceEra()}
                            className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-6 py-3 rounded-lg font-bold shadow transition-all transform hover:scale-105"
                        >
                            Advance to Era V: Age of Empires
                        </button>
                    </div>
                )}
            </>
        );
    }, [currentPlayer, gameplayStep, elements, gameSettings, heroCount, stepProgress, updateElement, setGameplayStep]);

    return (
        <div>
            <EraLayoutContainer
                eraName="Era IV: Age of Discovery"
                eraIcon="🗺️"
                eraDescription="The Empires are ready to explore and expand. Scouts and settlers are now being sent to explore and colonize the world."
                rulesComponent={<EraDiscoveryRules />}
                gameplayComponent={gameplayContent}
                sidebarTitle="Era IV Discoveries"
                sidebarElements={sidebarElements}
                elementsForContext={elements}
                onEditElement={setEditingElement}
                onDeleteElement={handleDelete}
                onExportHtml={exportElementHtml}
                onExportMarkdown={exportElementMarkdown}
            />
            {editingElement && <EditElementModal element={editingElement} isOpen={!!editingElement} onClose={() => setEditingElement(null)} onSave={handleSaveEdit} />}
            {confirmDelete && <ConfirmationModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleConfirmDelete} title="Confirm Deletion" message={<>Delete <strong>{confirmDelete.name}</strong>?</>} confirmText="Delete" confirmButtonClass="bg-red-600 hover:bg-red-700" />}
        </div>
    );
};

export default EraDiscoveryContent;
