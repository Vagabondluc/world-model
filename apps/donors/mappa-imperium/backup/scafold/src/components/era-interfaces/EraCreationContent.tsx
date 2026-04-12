import React, { useState, useMemo } from 'react';
import GeographyAdvisor from './era-creation/GeographyAdvisor';
import { EraCreationProvider } from '../../contexts/EraCreationContext';
import type { Player, ElementCard } from '../../types';
import ResourcePlacer from './era-creation/resources/ResourcePlacer';
import { useGame } from '../../contexts/GameContext';
import EraLayoutContainer from './common/EraLayoutContainer';
import EditElementModal from '../shared/EditElementModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import EraCreationRules from './common/rules/EraCreationRules';
import ObserverMode from '../shared/ObserverMode';
import StepProgressBar from '../shared/StepProgressBar';
import GeographyAdvicePanel from './era-creation/GeographyAdvicePanel';

interface EraCreationContentProps {
    currentPlayer: Player | null;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>) => void;
    onUpdateElement: (element: ElementCard) => void;
    onDeleteElement: (elementId: string) => void;
    onExportElementHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const RESOURCE_LIMIT = 2;

const EraCreationContent = ({ 
    currentPlayer, 
    elements,
    onCreateElement, 
    onUpdateElement, 
    onDeleteElement,
    onExportElementHtml,
    onExportMarkdown
}: EraCreationContentProps) => {
    const { eraUiState, handleUpdateEraUiState } = useGame();
    const gameplayStep = eraUiState.eraOne.gameplayStep;
    
    const [editingElement, setEditingElement] = useState<ElementCard | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{id: string, name: string} | null>(null);

    const sidebarElements = useMemo(() => {
        if (!currentPlayer) return [];
        return elements.filter(el => el.type === 'Resource' && el.owner === currentPlayer.playerNumber && el.era === 1);
    }, [elements, currentPlayer]);

    const handleOpenEditModal = (element: ElementCard) => setEditingElement(element);
    const handleCloseModal = () => setEditingElement(null);
    const handleSaveEdit = (updatedElement: ElementCard) => {
        onUpdateElement(updatedElement);
        handleCloseModal();
    };
    const handleDeleteRequest = (elementId: string, elementName: string) => setConfirmDelete({ id: elementId, name: elementName });
    const handleConfirmDelete = () => {
        if (confirmDelete) {
            onDeleteElement(confirmDelete.id);
            setConfirmDelete(null);
        }
    };

    const steps = [
        { id: 'geography', title: '1.2 Geography' },
        { id: 'resources', title: '1.4 Resources' },
    ];
    
    const stepProgress = {
        geography: { completed: 1, total: 1 }, // Geography is always considered "complete" to allow navigation
        resources: { completed: sidebarElements.length, total: RESOURCE_LIMIT }
    };
    
    if (!currentPlayer) {
        return (
             <EraLayoutContainer
                eraName="Era I: Age of Creation"
                eraIcon="🌍"
                eraDescription="Mountains rise & forests grow. The world begins to take shape. This is the landmass and geography building era."
                rulesComponent={<EraCreationRules />}
                gameplayComponent={<ObserverMode />}
                sidebarTitle="Era I Creations"
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
                case 'geography': return <GeographyAdvisor />;
                case 'resources': return (
                    <ResourcePlacer
                        currentPlayer={currentPlayer}
                        onCreateElement={onCreateElement}
                        resourceCount={sidebarElements.length}
                        resourceLimit={RESOURCE_LIMIT}
                    />
                );
                default: return null;
            }
        };

        return (
            <>
                <StepProgressBar 
                    steps={steps} 
                    currentStepId={gameplayStep} 
                    stepProgress={stepProgress}
                    onStepChange={(stepId) => handleUpdateEraUiState({ eraOne: { gameplayStep: stepId as 'geography' | 'resources' }})}
                />
                <div className="space-y-8">{renderCurrentStep()}</div>
            </>
        );
    }, [currentPlayer, gameplayStep, handleUpdateEraUiState, onCreateElement, sidebarElements.length, stepProgress]);


    return (
        <EraCreationProvider currentPlayer={currentPlayer}>
            <EraLayoutContainer
                eraName="Era I: Age of Creation"
                eraIcon="🌍"
                eraDescription="Mountains rise & forests grow. The world begins to take shape. This is the landmass and geography building era."
                rulesComponent={<EraCreationRules />}
                gameplayComponent={gameplayContent}
                fullWidthContent={gameplayStep === 'geography' ? <GeographyAdvicePanel /> : null}
                sidebarTitle="Era I Creations"
                sidebarElements={sidebarElements}
                elementsForContext={elements}
                onEditElement={handleOpenEditModal}
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
                    confirmButtonClass="btn-destructive"
                />
            )}
        </EraCreationProvider>
    );
};

export default EraCreationContent;