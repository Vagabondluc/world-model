import React, { useMemo } from 'react';
import type { Player, ElementCard, GameSettings, Faction } from '../../types';
import EmpiresEventEngine from './era-empires/EmpiresEventEngine';
import EraEmpiresRules from './common/rules/EraEmpiresRules';
import EraLayoutContainer from './common/EraLayoutContainer';
import ObserverMode from '../shared/ObserverMode';
import { useGame } from '../../contexts/GameContext';
import StepProgressBar from '../shared/StepProgressBar';
import NeighborDeveloper from './era-empires/NeighborDeveloper';

interface EraEmpiresContentProps {
    currentPlayer: Player | null;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    onUpdateElement: (element: ElementCard) => void;
    gameSettings: GameSettings | null;
}

const EraEmpiresContent = ({ currentPlayer, elements, onCreateElement, onUpdateElement, gameSettings }: EraEmpiresContentProps) => {
    const { eraUiState, handleUpdateEraUiState } = useGame();
    const gameplayStep = eraUiState.eraFive.gameplayStep;
    const setGameplayStep = (step: 'expansion' | 'neighbors') => handleUpdateEraUiState({ eraFive: { gameplayStep: step } });

    const { stepProgress } = useMemo(() => {
        if (!gameSettings || !currentPlayer) {
            return { stepProgress: {} };
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
            }
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
                case 'expansion':
                    return <EmpiresEventEngine
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={onCreateElement}
                        gameSettings={gameSettings}
                    />;
                case 'neighbors':
                    return <NeighborDeveloper
                        currentPlayer={currentPlayer}
                        elements={elements}
                        onCreateElement={onCreateElement}
                        onUpdateElement={onUpdateElement}
                        gameSettings={gameSettings}
                    />;
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
                    onStepChange={(stepId) => setGameplayStep(stepId as 'expansion' | 'neighbors')}
                />
                <div className="mt-6">{renderCurrentStep()}</div>
            </>
        );

    }, [currentPlayer, elements, gameSettings, gameplayStep, onCreateElement, onUpdateElement, stepProgress, setGameplayStep]);

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
            onEditElement={() => {}}
            onDeleteElement={() => {}}
            onExportHtml={() => {}}
            onExportMarkdown={() => {}}
        />
    );
};

export default EraEmpiresContent;