import React, { useMemo } from 'react';
import type { Player, ElementCard, GameSettings } from '../../types';
import EraCollapseRules from './common/rules/EraCollapseRules';
import EraLayoutContainer from './common/EraLayoutContainer';
import ObserverMode from '../shared/ObserverMode';
import CollapseEventEngine from './era-collapse/CollapseEventEngine';
import StepProgressBar from '../shared/StepProgressBar';
import { useGame } from '../../contexts/GameContext';
import IconicLandmarkCreator from './era-collapse/IconicLandmarkCreator';
import WorldOmenCreator from './era-collapse/WorldOmenCreator';

interface EraCollapseContentProps {
    currentPlayer: Player | null;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    gameSettings: GameSettings | null;
}

type GameplayStep = 'events' | 'landmarks' | 'omen';

const EraCollapseContent = ({ currentPlayer, elements, onCreateElement, gameSettings }: EraCollapseContentProps) => {
    const { eraUiState, handleUpdateEraUiState } = useGame();
    const gameplayStep = eraUiState.eraSix.gameplayStep as GameplayStep;
    const setGameplayStep = (step: GameplayStep) => handleUpdateEraUiState({ eraSix: { gameplayStep: step } });

    const { stepProgress } = useMemo(() => {
        if (!gameSettings || !currentPlayer) return { stepProgress: {} };

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
                onEditElement={() => {}}
                onDeleteElement={() => {}}
                onExportHtml={() => {}}
                onExportMarkdown={() => {}}
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
                        onCreateElement={onCreateElement}
                        gameSettings={gameSettings}
                    />;
                case 'landmarks':
                    return <IconicLandmarkCreator
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={onCreateElement}
                        gameSettings={gameSettings}
                    />;
                 case 'omen':
                    return <WorldOmenCreator
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={onCreateElement}
                        gameSettings={gameSettings}
                    />;
                default: return null;
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

    }, [currentPlayer, elements, gameSettings, gameplayStep, onCreateElement, stepProgress, setGameplayStep]);

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
            onEditElement={() => {}}
            onDeleteElement={() => {}}
            onExportHtml={() => {}}
            onExportMarkdown={() => {}}
        />
    );
};

export default EraCollapseContent;