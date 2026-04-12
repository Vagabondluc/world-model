
import React, { useMemo } from 'react';
import type { GameSettings } from '../../types';
import EraCollapseRules from './common/rules/EraCollapseRules';
import EraLayoutContainer from './common/EraLayoutContainer';
import ObserverMode from '../shared/ObserverMode';
import CollapseEventEngine from './era-collapse/CollapseEventEngine';
import StepProgressBar from '../shared/StepProgressBar';
import { useGameStore, initialEraUiState } from '@/stores/gameStore';
import IconicLandmarkCreator from './era-collapse/IconicLandmarkCreator';
import WorldOmenCreator from './era-collapse/WorldOmenCreator';

type GameplayStep = 'events' | 'landmarks' | 'omen';

const EraCollapseContent = () => {
    const {
        currentPlayer,
        elements,
        createElement,
        exportElementHtml,
        exportElementMarkdown,
        gameSettings,
        playerUiStates,
        updateEraUiState
    } = useGameStore();

    // Derive current player's UI state
    const eraUiState = (currentPlayer && playerUiStates[currentPlayer.playerNumber]) || initialEraUiState;
    const gameplayStep = eraUiState.eraSix.gameplayStep as GameplayStep;
    const setGameplayStep = (step: GameplayStep) => updateEraUiState({ eraSix: { gameplayStep: step } });

    const { stepProgress } = useMemo(() => {
        if (!gameSettings || !currentPlayer) return {
            stepProgress: {
                events: { completed: 0, total: 1 },
                landmarks: { completed: 0, total: 1 },
                omen: { completed: 0, total: 1 }
            }
        };

        const turnsPerEra: Record<GameSettings['length'], { 6: number }> = { Short: { 6: 3 }, Standard: { 6: 5 }, Long: { 6: 6 }, Epic: { 6: 10 } };
        const totalTurns = turnsPerEra[gameSettings.length][6];

        const eventsCompleted = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 6 && el.creationStep === '6.1 Final Era Event').length;
        const landmarksCompleted = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 6 && el.creationStep === '6.2 Iconic Landmark').length;
        const omenCompleted = elements.some(el => el.era === 6 && el.creationStep === '6.3 World Omen');

        return {
            stepProgress: {
                events: { completed: eventsCompleted, total: totalTurns },
                landmarks: { completed: landmarksCompleted, total: 1 },
                omen: { completed: omenCompleted ? 1 : 0, total: 1 }
            }
        };
    }, [currentPlayer, elements, gameSettings]);

    const steps = [
        { id: 'events', title: '6.1 Final Era Events' },
        { id: 'landmarks', title: '6.2 Iconic Landmarks' },
        { id: 'omen', title: '6.3 World Omen' },
    ];

    if (!currentPlayer) {
        return (
            <EraLayoutContainer
                eraName="Era VI: Age of Collapse"
                eraIcon="🔥"
                eraDescription="With every rising empire there is a falling one. This era covers the final years of your story."
                rulesComponent={<EraCollapseRules />}
                gameplayComponent={<ObserverMode />}
                sidebarTitle="Era VI Events"
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
                case 'events':
                    return <CollapseEventEngine
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={(el, year, step) => createElement(el, year, step)}
                        gameSettings={gameSettings}
                    />;
                case 'landmarks':
                    return <IconicLandmarkCreator
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={(el, year, step) => createElement(el, year, step)}
                        gameSettings={gameSettings}
                    />;
                case 'omen':
                    return <WorldOmenCreator
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={(el, year, step) => createElement(el, year, step)}
                        gameSettings={gameSettings}
                    />;
                default: return null;
            }
        };

        const isEraComplete =
            stepProgress.events.completed >= stepProgress.events.total &&
            stepProgress.landmarks.completed >= 1 &&
            stepProgress.omen.completed >= 1;

        return (
            <>
                <StepProgressBar
                    steps={steps}
                    currentStepId={gameplayStep}
                    stepProgress={stepProgress}
                    onStepChange={(stepId) => setGameplayStep(stepId as GameplayStep)}
                />
                <div className="mt-6">{renderCurrentStep()}</div>

                {isEraComplete && gameplayStep === 'omen' && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-red-100 to-red-200 rounded-lg border border-red-300 flex items-center justify-between shadow-lg">
                        <div>
                            <h3 className="text-xl font-bold text-red-900">The Cycle is Complete</h3>
                            <p className="text-red-800">The Age of Collapse has ended. The world forever changed. History is written.</p>
                        </div>
                        <button
                            onClick={() => useGameStore.getState().advanceEra()}
                            className="bg-red-800 hover:bg-red-900 text-red-50 px-6 py-3 rounded-lg font-bold shadow transition-all transform hover:scale-105"
                        >
                            Finish Game
                        </button>
                    </div>
                )}
            </>
        );

    }, [currentPlayer, elements, gameSettings, gameplayStep, createElement, stepProgress, setGameplayStep]);

    return (
        <EraLayoutContainer
            eraName="Era VI: Age of Collapse"
            eraIcon="🔥"
            eraDescription="With every rising empire there is a falling one. This era covers the final years of your story."
            rulesComponent={<EraCollapseRules />}
            gameplayComponent={gameplayContent}
            sidebarTitle="Era VI Events"
            sidebarElements={elements.filter(e => e.owner === currentPlayer?.playerNumber && e.era === 6)}
            elementsForContext={elements}
            onEditElement={() => { }}
            onDeleteElement={() => { }}
            onExportHtml={exportElementHtml}
            onExportMarkdown={exportElementMarkdown}
        />
    );
};

export default EraCollapseContent;
