
import React, { useState, useMemo } from 'react';
import type { Deity, Location, ElementCard } from '../../types';
import type { StepProgress } from '../../types/progress.types';
import EditElementModal from '../shared/EditElementModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import PantheonSetup from './era-myth/PantheonSetup';
import DeityCreator from './era-myth/DeityCreator';
import SacredSiteCreator from './era-myth/SacredSiteCreator';
import { useGameStore, initialEraUiState } from '@/stores/gameStore';
import EraLayoutContainer from './common/EraLayoutContainer';
import StepProgressBar from '../shared/StepProgressBar';
import EraMythRules from './common/rules/EraMythRules';
import ObserverMode from '../shared/ObserverMode';

type GameplayStep = 'setup' | 'pantheon' | 'sites';

const EraMythContent = () => {
    const {
        currentPlayer,
        elements,
        updateElement,
        deleteElement,
        exportElementHtml,
        exportElementMarkdown,
        createElement,
        updatePlayer,
        playerUiStates,
        updateEraUiState
    } = useGameStore();

    // Derive current player's UI state
    const eraUiState = (currentPlayer && playerUiStates[currentPlayer.playerNumber]) || initialEraUiState;
    const gameplayStep = eraUiState.eraTwo.gameplayStep as GameplayStep;
    const setGameplayStep = (step: GameplayStep) => updateEraUiState({ eraTwo: { gameplayStep: step } });

    const deityCount = useMemo(() => currentPlayer?.deityCount || 0, [currentPlayer]);

    const { playerDeities, playerSacredSites, sidebarElements, stepProgress } = useMemo(() => {
        if (!currentPlayer) return {
            playerDeities: [],
            playerSacredSites: [],
            sidebarElements: [],
            stepProgress: {
                setup: { completed: 0, total: 1 },
                pantheon: { completed: 0, total: 0 },
                sites: { completed: 0, total: 0 }
            }
        };
        const pDeities = elements.filter(el => el.type === 'Deity' && el.owner === currentPlayer.playerNumber);
        const pSites = elements.filter(el => el.type === 'Location' && el.owner === currentPlayer.playerNumber);
        const setupComplete = (currentPlayer.deityCount || 0) > 0;

        return {
            playerDeities: pDeities,
            playerSacredSites: pSites,
            sidebarElements: [...pDeities, ...pSites],
            stepProgress: {
                setup: { completed: setupComplete ? 1 : 0, total: 1 },
                pantheon: { completed: pDeities.length, total: currentPlayer.deityCount || 0 },
                sites: { completed: pSites.length, total: currentPlayer.deityCount || 0 }
            } as StepProgress
        };
    }, [elements, currentPlayer]);

    const [editingElement, setEditingElement] = useState<ElementCard | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: string, name: string } | null>(null);
    const [confirmStartOver, setConfirmStartOver] = useState(false);

    const handleDeityCreated = (deityData: Omit<Deity, 'id'>, year: number) => {
        if (!currentPlayer) return;
        createElement({
            type: 'Deity',
            name: deityData.name,
            owner: currentPlayer.playerNumber,
            era: 2,
            data: { id: `data-${crypto.randomUUID()}`, ...deityData }
        }, year);
    };

    const handleSacredSiteCreated = (locationData: Omit<Location, 'id'>, year: number) => {
        if (!currentPlayer) return;
        createElement({
            type: 'Location',
            name: locationData.name,
            owner: currentPlayer.playerNumber,
            era: 2,
            data: { id: `data-${crypto.randomUUID()}`, ...locationData }
        }, year);
    };

    const handlePantheonSetup = (count: number) => {
        if (!currentPlayer) return;
        setGameplayStep('pantheon');
        updatePlayer({ ...currentPlayer, deityCount: count });
    };

    const handleStartOver = () => {
        if (!currentPlayer) return;
        setGameplayStep('setup');
        updatePlayer({ ...currentPlayer, deityCount: 0 });
        setConfirmStartOver(false);
    };

    const handleOpenEditModal = (element: ElementCard) => setEditingElement(element);
    const handleCloseEditModal = () => setEditingElement(null);
    const handleSaveEdit = (updatedElement: ElementCard) => {
        updateElement(updatedElement);
        handleCloseEditModal();
    };
    const handleDelete = (elementId: string, elementName: string) => setConfirmDelete({ id: elementId, name: elementName });
    const handleConfirmDelete = () => {
        if (confirmDelete) {
            deleteElement(confirmDelete.id);
            setConfirmDelete(null);
        }
    };

    const steps = [
        { id: 'setup', title: '2.1 Setup' },
        { id: 'pantheon', title: '2.2 Pantheon' },
        { id: 'sites', title: '2.5 Sacred Sites' },
    ];

    if (!currentPlayer) {
        return (
            <EraLayoutContainer
                eraName="Era II: Age of Myth"
                eraIcon="⚡"
                eraDescription="The story of your world begins here with the development of a pantheon."
                rulesComponent={<EraMythRules />}
                gameplayComponent={<ObserverMode />}
                sidebarTitle="Era II Creations"
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
                case 'setup': return <PantheonSetup onCountSelect={handlePantheonSetup} />;
                case 'pantheon': return <DeityCreator deityCount={deityCount} playerDeities={playerDeities} onDeityCreated={handleDeityCreated} onProceed={() => setGameplayStep('sites')} onStartOver={() => setConfirmStartOver(true)} />;
                case 'sites': return <SacredSiteCreator deityCount={deityCount} playerDeities={playerDeities} playerSacredSites={playerSacredSites} onSacredSiteCreated={handleSacredSiteCreated} onStartOver={() => setConfirmStartOver(true)} />;
                default: return null;
            }
        };

        const isEraComplete = stepProgress.sites.completed >= stepProgress.sites.total && stepProgress.sites.total > 0;

        return (
            <>
                <StepProgressBar
                    steps={steps}
                    currentStepId={gameplayStep}
                    stepProgress={stepProgress}
                    onStepChange={(stepId) => setGameplayStep(stepId as GameplayStep)}
                />
                <div className="space-y-6">{renderCurrentStep()}</div>

                {isEraComplete && gameplayStep === 'sites' && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg border border-amber-300 flex items-center justify-between shadow-lg">
                        <div>
                            <h3 className="text-xl font-bold text-amber-900">Era Complete: Age of Myth</h3>
                            <p className="text-amber-800">The gods have taken their places and their sacred sites are known. The age of foundation awaits.</p>
                        </div>
                        <button
                            onClick={() => useGameStore.getState().advanceEra()}
                            className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-6 py-3 rounded-lg font-bold shadow transition-all transform hover:scale-105"
                        >
                            Advance to Era III: Age of Foundation
                        </button>
                    </div>
                )}
            </>
        )
    }, [currentPlayer, gameplayStep, stepProgress, deityCount, playerDeities, playerSacredSites, handlePantheonSetup, handleDeityCreated, handleSacredSiteCreated]);

    return (
        <div>
            <EraLayoutContainer
                eraName="Era II: Age of Myth"
                eraIcon="⚡"
                eraDescription="The story of your world begins here with the development of a pantheon. Each player will create a number of deities that inhabit their home region."
                rulesComponent={<EraMythRules />}
                gameplayComponent={gameplayContent}
                sidebarTitle="Era II Creations"
                sidebarElements={sidebarElements}
                elementsForContext={elements}
                onEditElement={handleOpenEditModal}
                onDeleteElement={handleDelete}
                onExportHtml={exportElementHtml}
                onExportMarkdown={exportElementMarkdown}
            />

            {editingElement && (
                <EditElementModal element={editingElement} isOpen={!!editingElement} onClose={handleCloseEditModal} onSave={handleSaveEdit} />
            )}
            {confirmDelete && (
                <ConfirmationModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleConfirmDelete} title="Confirm Deletion" message={<>Are you sure you want to delete <strong>{confirmDelete.name}</strong>?</>} confirmText="Delete" confirmButtonClass="bg-red-600 hover:bg-red-700" />
            )}
            {confirmStartOver && (
                <ConfirmationModal
                    isOpen={confirmStartOver}
                    onClose={() => setConfirmStartOver(false)}
                    onConfirm={handleStartOver}
                    title="Confirm Start Over"
                    message={<>Are you sure you want to start over? This will reset the UI steps but will <strong className="font-bold">not delete any elements</strong> you have already created.</>}
                    confirmText="Start Over"
                />
            )}
        </div>
    );
};

export default EraMythContent;
