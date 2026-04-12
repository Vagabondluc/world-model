
import React, { useMemo } from 'react';
import type { ElementCard, GameSettings, Faction } from '../../types';
import type { StepProgress } from '../../types/progress.types';
import EmpiresEventEngine from './era-empires/EmpiresEventEngine';
import EraEmpiresRules from './common/rules/EraEmpiresRules';
import EraLayoutContainer from './common/EraLayoutContainer';
import ObserverMode from '../shared/ObserverMode';
import { useGameStore, initialEraUiState } from '@/stores/gameStore';
import StepProgressBar from '../shared/StepProgressBar';
import NeighborDeveloper from './era-empires/NeighborDeveloper';

const EraEmpiresContent = () => {
    const {
        currentPlayer,
        elements,
        createElement,
        updateElement,
        exportElementHtml,
        exportElementMarkdown,
        gameSettings,
        playerUiStates,
        updateEraUiState
    } = useGameStore();

    // Derive current player's UI state
    const eraUiState = (currentPlayer && playerUiStates[currentPlayer.playerNumber]) || initialEraUiState;
    const gameplayStep = eraUiState.eraFive.gameplayStep;
    const setGameplayStep = (step: 'expansion' | 'neighbors') => updateEraUiState({ eraFive: { gameplayStep: step } });

    const { stepProgress } = useMemo(() => {
        if (!gameSettings || !currentPlayer) {
            return {
                stepProgress: {
                    expansion: { completed: 0, total: 1 },
                    neighbors: { completed: 0, total: 1 }
                }
            };
        }

        const turnsPerEra: Record<GameSettings['length'], { 5: number }> = { Short: { 5: 4 }, Standard: { 5: 6 }, Long: { 5: 8 }, Epic: { 5: 12 } };
        const expansionTurnsTotal = turnsPerEra[gameSettings.length][5];
        const expansionTurnsCompleted = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 5 && el.creationStep === '5.1 Empire Event').length;

        const neighbors = elements.filter(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && (el.data as Faction).isNeighbor);
        const neighborsTotal = neighbors.length;
        const developmentEvents = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 5 && el.creationStep === '5.2 Neighbor Development');
        const neighborsCompleted = developmentEvents.length;

        return {
            stepProgress: {
                expansion: { completed: expansionTurnsCompleted, total: expansionTurnsTotal },
                neighbors: { completed: neighborsCompleted, total: neighborsTotal }
            } as StepProgress
        };
    }, [currentPlayer, elements, gameSettings]);

    const steps = [
        { id: 'expansion', title: '5.1 Worldwide Expansion' },
        { id: 'neighbors', title: '5.2 Neighbor Development' },
    ];

    if (!currentPlayer) {
        return (
            <EraLayoutContainer
                eraName="Era V: Age of Empires"
                eraIcon="👑"
                eraDescription="Empires have settled and can start flexing their might."
                rulesComponent={<EraEmpiresRules />}
                gameplayComponent={<ObserverMode />}
                sidebarTitle="Era V Events"
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
                case 'expansion':
                    return <EmpiresEventEngine
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={(el, year, step) => createElement(el, year, step)}
                        gameSettings={gameSettings}
                    />;
                case 'neighbors':
                    return <NeighborDeveloper
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={(el, year, step) => createElement(el, year, step)}
                        onUpdateElement={updateElement}
                        gameSettings={gameSettings}
                    />;
                default:
                    return null;
            }
        };

        const isEraComplete =
            stepProgress.expansion.completed >= stepProgress.expansion.total &&
            stepProgress.neighbors.completed >= stepProgress.neighbors.total;

        return (
            <>
                <StepProgressBar
                    steps={steps}
                    currentStepId={gameplayStep}
                    stepProgress={stepProgress}
                    onStepChange={(stepId) => setGameplayStep(stepId as 'expansion' | 'neighbors')}
                />
                <div className="mt-6">{renderCurrentStep()}</div>

                {isEraComplete && gameplayStep === 'neighbors' && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg border border-amber-300 flex items-center justify-between shadow-lg">
                        <div>
                            <h3 className="text-xl font-bold text-amber-900">Era Complete: Age of Empires</h3>
                            <p className="text-amber-800">The world is full, and tensions are high. The height of power often precedes the fall.</p>
                        </div>
                        <button
                            onClick={() => useGameStore.getState().advanceEra()}
                            className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-6 py-3 rounded-lg font-bold shadow transition-all transform hover:scale-105"
                        >
                            Advance to Era VI: Age of Collapse
                        </button>
                    </div>
                )}
            </>
        );

    }, [currentPlayer, elements, gameSettings, gameplayStep, createElement, updateElement, stepProgress, setGameplayStep]);

    return (
        <EraLayoutContainer
            eraName="Era V: Age of Empires"
            eraIcon="👑"
            eraDescription="Empires have settled and can start flexing their might. This era should fill out the map considerably."
            rulesComponent={<EraEmpiresRules />}
            gameplayComponent={gameplayContent}
            sidebarTitle="Era V Events"
            sidebarElements={elements.filter(e => e.owner === currentPlayer?.playerNumber && e.era === 5)}
            elementsForContext={elements}
            onEditElement={() => { }}
            onDeleteElement={() => { }}
            onExportHtml={exportElementHtml}
            onExportMarkdown={exportElementMarkdown}
        />
    );
};

export default EraEmpiresContent;
