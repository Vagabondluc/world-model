import React, { useState, useMemo } from 'react';
import { getEraGoals, getTrackedEraIds, calculatePlayerProgress } from '../../utils/progressUtils';
import type { PlayerProgress } from '../../types/progress.types';
import { useGameStore } from '../../stores/gameStore';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

const CompletionTracker = () => {
    const { elements, players, currentEraId, advanceEra, currentPlayer, gameSettings } = useGameStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const ERA_GOALS = useMemo(() => getEraGoals(gameSettings), [gameSettings]);

    const TRACKED_ERA_IDS = useMemo(() => getTrackedEraIds(ERA_GOALS), [ERA_GOALS]);

    const progressData = useMemo(() => {
        if (!players.length) return { playerDetails: [], allRequiredPlayersComplete: false, totalGamePercentageAllPlayers: 0, totalGamePercentageCurrentPlayer: 0, latestYear: 'N/A' };

        const playerDetails = players.map(player =>
            calculatePlayerProgress(player, elements, ERA_GOALS, TRACKED_ERA_IDS)
        );

        const isPlayerEraComplete = (pDetail: PlayerProgress, eraId: number) => {
            const eraTasks = pDetail.eras[eraId];
            if (!eraTasks) return true;
            if (eraTasks.progress >= 1) return true;
            if (eraId === 2 && eraTasks.total === 0) { const p = players.find(pl => pl.playerNumber === pDetail.playerNumber); return !p || p.deityCount === 0; }
            if (eraTasks.total === 0) return true;
            return false;
        };

        const playersToCheck = players.filter(p => p.isOnline);
        let allRequiredPlayersComplete = playersToCheck.length > 0 && playersToCheck.every(p => { const d = playerDetails.find(pd => pd.playerNumber === p.playerNumber); return d ? isPlayerEraComplete(d, currentEraId) : false; });

        // Special check for Era 6: all players must complete their individual tasks AND the global omen must be created.
        if (currentEraId === 6 && allRequiredPlayersComplete) {
            allRequiredPlayersComplete = elements.some(el => el.era === 6 && el.creationStep === '6.3 World Omen');
        }

        const totalCompletedAll = playerDetails.reduce((sum, p) => {
            let playerCompleted = 0;
            TRACKED_ERA_IDS.forEach(eraId => {
                const result = ERA_GOALS[eraId].getTaskCount(players.find(pl => pl.playerNumber === p.playerNumber)!, elements);
                playerCompleted += result.normalizedCompleted !== undefined ? result.normalizedCompleted : result.completed;
            });
            return sum + playerCompleted;
        }, 0);

        const totalTasksAll = playerDetails.reduce((sum, p) => {
            let playerTotal = 0;
            TRACKED_ERA_IDS.forEach(eraId => {
                const result = ERA_GOALS[eraId].getTaskCount(players.find(pl => pl.playerNumber === p.playerNumber)!, elements);
                playerTotal += result.normalizedTotal !== undefined ? result.normalizedTotal : result.total;
            });
            return sum + playerTotal;
        }, 0);

        const latestYearNum = Math.max(0, ...elements.filter(el => el.createdYear).map(el => el.createdYear!));

        return {
            playerDetails, allRequiredPlayersComplete,
            totalGamePercentageAllPlayers: totalTasksAll > 0 ? Math.round((totalCompletedAll / totalTasksAll) * 100) : 0,
            totalGamePercentageCurrentPlayer: currentPlayer ? playerDetails.find(p => p.playerNumber === currentPlayer.playerNumber)?.totalGamePercentage || 0 : 0,
            latestYear: latestYearNum > 0 ? `Year ${latestYearNum}` : 'Timeline Start'
        };
    }, [elements, players, currentEraId, ERA_GOALS, TRACKED_ERA_IDS, currentPlayer]);

    const ProgressBar = ({ label, percentage, size = 'large' }: { label: string, percentage: number, size?: 'large' | 'small' }) => (
        <div className="flex-grow">
            <h3 className={`font-bold tracking-wide ${size === 'large' ? 'text-md' : 'text-sm'}`}>{label}</h3>
            <div className="flex items-center gap-3">
                <div className={cn(componentStyles.progressBar.track, size === 'small' ? 'h-2.5' : '')}>
                    <div className={componentStyles.progressBar.fill} style={{ width: `${percentage}%` }}></div>
                </div>
                <span className={`font-semibold ${size === 'large' ? 'text-lg' : 'text-md'}`}>{percentage}%</span>
            </div>
        </div>
    );

    const renderPlayerDetail = (playerDetail: PlayerProgress) => (
        <div key={playerDetail.playerNumber} className="p-3 bg-gray-700/50 rounded-lg">
            <ProgressBar label={playerDetail.name} percentage={playerDetail.totalGamePercentage} size="small" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {TRACKED_ERA_IDS.map(eraId => {
                    const eraData = playerDetail.eras[eraId];
                    const eraName = ERA_GOALS[eraId].name;
                    return (
                        <div key={eraId} className="bg-gray-800/50 p-2 rounded flex flex-col gap-1">
                            <div className="flex justify-between items-center text-xs text-gray-400">
                                <span className="font-bold text-amber-500 uppercase tracking-wider">{eraName}</span>
                                <span>{eraData.total > 0 ? `${eraData.completed}/${eraData.total}` : 'N/A'}</span>
                            </div>
                            <div className={cn(componentStyles.progressBar.track, "h-1.5")}>
                                <div className={componentStyles.progressBar.fill} style={{ width: `${Math.round(eraData.progress * 100)}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const nextEraId = currentEraId + 1;
    const nextEra = ERA_GOALS[nextEraId] ? { id: nextEraId, name: ERA_GOALS[nextEraId].name } : null;

    return (
        <footer className="w-full bg-gray-800 text-white shadow-lg border-t-2 border-amber-500" aria-label="Game Completion Progress">
            <div className="container mx-auto p-3">
                <div className="flex justify-between items-center gap-4">
                    <ProgressBar label="Total Game Progress" percentage={progressData.totalGamePercentageAllPlayers} />
                    {currentPlayer && <div className="w-48 flex-shrink-0"><ProgressBar label="Your Progress" percentage={progressData.totalGamePercentageCurrentPlayer} size="small" /></div>}
                    <div className="text-center flex-shrink-0 w-32">
                        <h3 className="text-sm font-bold tracking-wide">Latest Year</h3>
                        <p className="text-lg font-semibold">{progressData.latestYear}</p>
                    </div>

                    {progressData.allRequiredPlayersComplete && currentEraId < 6 && nextEra && (
                        <button onClick={advanceEra} className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:scale-105">
                            Advance to {nextEra.name}
                        </button>
                    )}
                    {progressData.allRequiredPlayersComplete && currentEraId === 6 && (
                        <button onClick={advanceEra} className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out bg-green-600 hover:bg-green-500 text-white shadow-lg hover:scale-105">
                            Finish Chronicle & View Summary
                        </button>
                    )}
                    <button onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Collapse progress details' : 'Expand progress details'} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-4 animate-fade-in-slide-up">
                        {progressData.playerDetails.length > 0 ? progressData.playerDetails.map(renderPlayerDetail) : <p className="text-center text-gray-400">No players have joined yet.</p>}
                    </div>
                )}
            </div>
        </footer>
    );
};

export default CompletionTracker;