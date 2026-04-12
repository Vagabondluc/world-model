
import React, { useState, useMemo } from 'react';
import GeographyAdvisor from './era-creation/GeographyAdvisor';
import type { ElementCard } from '@mi/types';
import ResourcePlacer from './era-creation/resources/ResourcePlacer';
import { useGameStore, initialEraUiState } from '@mi/stores/gameStore';
import { useEraCreationState } from '../../hooks/useEraCreationState';
import EraLayoutContainer from './common/EraLayoutContainer';
import EditElementModal from '../shared/EditElementModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import EraCreationRules from './common/rules/EraCreationRules';
import ObserverMode from '../shared/ObserverMode';
import StepProgressBar from '../shared/StepProgressBar';
import GeographyAdvicePanel from './era-creation/GeographyAdvicePanel';
import MapCreationStep from './era-creation/MapCreationStep';
import SitesPlacer from './era-creation/sites/SitesPlacer';

const RESOURCE_LIMIT = 2;
const SITES_LIMIT = 2;

const EraCreationContent = () => {
    const {
        currentPlayer,
        elements,
        updateElement,
        deleteElement,
        updateEraUiState,
        playerUiStates,
        exportElementHtml,
        exportElementMarkdown,
        mapData
    } = useGameStore();

    // Local state management for Era I specific logic
    const eraCreationState = useEraCreationState();

    // Derive current player's UI state
    const eraUiState = (currentPlayer && playerUiStates[currentPlayer.playerNumber]) || initialEraUiState;
    const gameplayStep = eraUiState.eraOne.gameplayStep;

    const [editingElement, setEditingElement] = useState<ElementCard | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: string, name: string } | null>(null);

    const sidebarElements = useMemo(() => {
        if (!currentPlayer) return [];
        return elements.filter(el =>
            (el.type === 'Resource' || el.type === 'Location') &&
            el.owner === currentPlayer.playerNumber &&
            el.era === 1
        );
    }, [elements, currentPlayer]);

    const handleOpenEditModal = (element: ElementCard) => setEditingElement(element);
    const handleCloseModal = () => setEditingElement(null);
    const handleSaveEdit = (updatedElement: ElementCard) => {
        updateElement(updatedElement);
        handleCloseModal();
    };
    const handleDeleteRequest = (elementId: string, elementName: string) => setConfirmDelete({ id: elementId, name: elementName });
    const handleConfirmDelete = () => {
        if (confirmDelete) {
            deleteElement(confirmDelete.id);
            setConfirmDelete(null);
        }
    };

    const steps = [
        { id: 'geography', title: '1.2 Geography' },
        { id: 'map-creation', title: '1.3 Map Creation' },
        { id: 'resources', title: '1.4 Resources' },
        { id: 'sites', title: '1.4 Special Sites' },
    ];

    const stepProgress = useMemo(() => {
        const resourceCount = elements.filter(el => el.type === 'Resource' && el.owner === currentPlayer?.playerNumber && el.era === 1).length;
        const siteCount = elements.filter(el => el.type === 'Location' && el.owner === currentPlayer?.playerNumber && el.era === 1).length;

        return {
            geography: { completed: 1, total: 1 },
            'map-creation': { completed: mapData?.hexBiomes && Object.keys(mapData.hexBiomes).length > 0 ? 1 : 0, total: 1 },
            resources: { completed: resourceCount, total: RESOURCE_LIMIT },
            sites: { completed: siteCount, total: SITES_LIMIT }
        };
    }, [elements, currentPlayer, mapData]);

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
                onEditElement={() => { }}
                onDeleteElement={() => { }}
                onExportHtml={() => { }}
                onExportMarkdown={() => { }}
            />
        );
    }

    const gameplayContent = useMemo(() => {
        const renderCurrentStep = () => {
            switch (gameplayStep) {
                case 'geography': return <GeographyAdvisor state={eraCreationState} />;
                case 'map-creation': return <MapCreationStep />;
                case 'resources': return <ResourcePlacer />;
                case 'sites': return <SitesPlacer />;
                default: return null;
            }
        };

        const isEraComplete =
            stepProgress.geography.completed >= stepProgress.geography.total &&
            stepProgress['map-creation'].completed >= stepProgress['map-creation'].total &&
            stepProgress.resources.completed >= stepProgress.resources.total &&
            stepProgress.sites.completed >= stepProgress.sites.total;

        return (
            <>
                <StepProgressBar
                    steps={steps}
                    currentStepId={gameplayStep}
                    stepProgress={stepProgress}
                    onStepChange={(stepId) => updateEraUiState({ eraOne: { gameplayStep: stepId as any } })}
                />
                <div className="space-y-8">{renderCurrentStep()}</div>

                {isEraComplete && gameplayStep === 'sites' && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg border border-amber-300 flex items-center justify-between shadow-lg">
                        <div>
                            <h3 className="text-xl font-bold text-amber-900">Era Complete: Age of Creation</h3>
                            <p className="text-amber-800">You have shaped the land and defined its initial features. The world is ready for the gods.</p>
                        </div>
                        <button
                            onClick={() => useGameStore.getState().advanceEra()}
                            className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-6 py-3 rounded-lg font-bold shadow transition-all transform hover:scale-105"
                        >
                            Advance to Era II: Age of Myth
                        </button>
                    </div>
                )}
            </>
        );
    }, [gameplayStep, updateEraUiState, stepProgress, eraCreationState]);


    return (
        <>
            <EraLayoutContainer
                eraName="Era I: Age of Creation"
                eraIcon="🌍"
                eraDescription="Mountains rise & forests grow. The world begins to take shape. This is the landmass and geography building era."
                rulesComponent={<EraCreationRules />}
                gameplayComponent={gameplayContent}
                fullWidthContent={gameplayStep === 'geography' ? <GeographyAdvicePanel state={eraCreationState} /> : null}
                sidebarTitle="Era I Creations"
                sidebarElements={sidebarElements}
                elementsForContext={elements}
                onEditElement={handleOpenEditModal}
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
        </>
    );
};

export default EraCreationContent;
