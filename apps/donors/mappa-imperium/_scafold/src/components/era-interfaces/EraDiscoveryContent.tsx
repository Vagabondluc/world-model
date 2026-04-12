import React, { useState, useMemo } from 'react';
import type { Player, ElementCard, GameSettings, Faction } from '../../types';
import DiscoveryEngine from './era-discovery/DiscoveryEngine';
import ColonizationPlanner from './era-discovery/ColonizationPlanner';
import ProsperityDeveloper from './era-discovery/ProsperityDeveloper';
import EditElementModal from '../shared/EditElementModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import { useGame } from '../../contexts/GameContext';
import EraLayoutContainer from './common/EraLayoutContainer';
import EraDiscoveryRules from './common/rules/EraDiscoveryRules';
import ObserverMode from '../shared/ObserverMode';
import StepProgressBar from '../shared/StepProgressBar';
import type { EraDiscoveryContentProps } from '../../types';

type GameplayStep = 'exploration' | 'colonization' | 'prosperity';

const HERO_LIMIT = 3;

const EraDiscoveryContent = ({ 
    currentPlayer, 
    elements, 
    onCreateElement, 
    onUpdateElement,
    onDeleteElement,
    onExportElementHtml,
    onExportMarkdown,
    gameSettings 
}: EraDiscoveryContentProps) => {
    const { eraUiState, handleUpdateEraUiState } = useGame();
    const gameplayStep = eraUiState.eraFour.gameplayStep as GameplayStep;
    const setGameplayStep = (step: GameplayStep) => handleUpdateEraUiState({ eraFour: { gameplayStep: step } });
    
    const [editingElement, setEditingElement] = useState<ElementCard | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{id: string, name: string} | null>(null);

    const { stepProgress, sidebarElements, heroCount } = useMemo(() => {
        if (!gameSettings || !currentPlayer) {
            return {
                stepProgress: {
                    exploration: { completed: 0, total: 1 },
                    colonization: { completed: 0, total: 1 },
                    prosperity: { completed: 0, total: 1 },
                },
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
            },
            sidebarElements: playerEraElements,
            heroCount: heroesCreated,
        };
    }, [currentPlayer, elements, gameSettings]);

    const handleCreateDiscoveryElement = (element: Omit<ElementCard, 'id'>, createdYear?: number) => {
        onCreateElement(element, createdYear, '4.1 Exploration');
    };
    
    const handleCreateColonizationElement = (element: Omit<ElementCard, 'id'>, createdYear?: number) => {
        onCreateElement(element, createdYear, '4.2 Colonization & Heroes');
    };
    
    const handleSaveEdit = (updatedElement: ElementCard) => {
        onUpdateElement(updatedElement);
        setEditingElement(null);
    };

    const handleDelete = (elementId: string, elementName: string) => {
        setConfirmDelete({ id: elementId, name: elementName });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete) {
            onDeleteElement(confirmDelete.id);
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
                    return <ProsperityDeveloper currentPlayer={currentPlayer} elements={elements} onUpdateElement={onUpdateElement} />;
                default:
                    return null;
            }
        };

        return (
            <>
                <StepProgressBar
                    steps={steps}
                    currentStepId={gameplayStep}
                    stepProgress={stepProgress}
                    onStepChange={(stepId) => setGameplayStep(stepId as GameplayStep)}
                />
                <div className="mt-6">{renderCurrentStep()}</div>
            </>
        );
    }, [currentPlayer, gameplayStep, elements, gameSettings, heroCount, stepProgress, onUpdateElement, setGameplayStep]);

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
                onExportHtml={onExportElementHtml}
                onExportMarkdown={onExportMarkdown}
            />
            {editingElement && <EditElementModal element={editingElement} isOpen={!!editingElement} onClose={() => setEditingElement(null)} onSave={handleSaveEdit} />}
            {confirmDelete && <ConfirmationModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleConfirmDelete} title="Confirm Deletion" message={<>Delete <strong>{confirmDelete.name}</strong>?</>} confirmText="Delete" confirmButtonClass="bg-red-600 hover:bg-red-700"/>}
        </div>
    );
};

export default EraDiscoveryContent;