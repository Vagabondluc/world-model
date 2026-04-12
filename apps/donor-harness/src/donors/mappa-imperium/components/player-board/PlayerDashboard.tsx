import { useState, useMemo } from 'react';
import { eras } from '../../data/eras';
import { getEraGoals, getTrackedEraIds, calculatePlayerProgress } from '../../utils/progressUtils';
import { useGameStore } from '../../stores/gameStore';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';
import { LayoutDashboard, Target } from 'lucide-react'; // Example icons
import ResourcePanel from './ResourcePanel';
import ActionPanel from './ActionPanel';
import SettlementPanel from './SettlementPanel';

const PlayerDashboard = () => {
    const { elements, players, currentEraId, advanceEra, currentPlayer, gameSettings } = useGameStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'progress' | 'management'>('progress');

    const ERA_GOALS = useMemo(() => getEraGoals(gameSettings), [gameSettings]);

    const TRACKED_ERA_IDS = useMemo(() => getTrackedEraIds(ERA_GOALS), [ERA_GOALS]);

    const progressData = useMemo(() => {
        if (!players.length) return { playerDetails: [], allRequiredPlayersComplete: false, totalGamePercentageAllPlayers: 0, totalGamePercentageCurrentPlayer: 0, latestYear: 'N/A' };

        const playerDetails = players.map(player =>
            calculatePlayerProgress(player, elements, ERA_GOALS, TRACKED_ERA_IDS)
        );

        const isPlayerEraComplete = (pDetail: typeof playerDetails[0], eraId: number) => {
            const eraTasks = pDetail.eras[eraId];
            if (!eraTasks) return true;
            if (eraTasks.progress >= 1) return true;
            if (eraId === 2 && eraTasks.total === 0) { const p = players.find(pl => pl.playerNumber === pDetail.playerNumber); return !p || p.deityCount === 0; }
            if (eraTasks.total === 0) return true;
            return false;
        };

        const playersToCheck = players.filter(p => p.isOnline);
        let allRequiredPlayersComplete = playersToCheck.length > 0 && playersToCheck.every(p => { const d = playerDetails.find(pd => pd.playerNumber === p.playerNumber); return d ? isPlayerEraComplete(d, currentEraId) : false; });

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

    const renderPlayerDetail = (playerDetail: (typeof progressData.playerDetails)[0]) => (
        <div key={playerDetail.playerNumber} className="p-3 bg-gray-700/50 rounded-lg">
            <ProgressBar label={playerDetail.name} percentage={playerDetail.totalGamePercentage} size="small" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {TRACKED_ERA_IDS.map(eraId => {
                    const eraData = playerDetail.eras[eraId];
                    const eraName = (ERA_GOALS as any)[eraId].name;
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

    const nextEra = eras.find(e => e.id === currentEraId + 1);

    return (
        <footer className="w-full bg-gray-800 text-white shadow-lg border-t-2 border-amber-500" aria-label="Player Dashboard">
            <div className="container mx-auto p-3">
                {/* Collapsed/Footer View */}
                <div className="flex justify-between items-center gap-4">
                    {/* Mode Toggles when Expanded */}
                    <div className="flex items-center gap-4 flex-grow">
                        {isExpanded ? (
                            <div className="flex bg-gray-900 rounded-lg p-1 gap-1">
                                <button
                                    onClick={() => setActiveTab('progress')}
                                    className={cn("px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-bold transition-all", activeTab === 'progress' ? "bg-amber-600 text-white shadow" : "text-gray-400 hover:text-white")}
                                >
                                    <Target className="w-4 h-4" />
                                    Progress
                                </button>
                                <button
                                    onClick={() => setActiveTab('management')}
                                    className={cn("px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-bold transition-all", activeTab === 'management' ? "bg-amber-600 text-white shadow" : "text-gray-400 hover:text-white")}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </button>
                            </div>
                        ) : (
                            // Collapsed State: Show Simple Progress Summary
                            <ProgressBar label="Total Game Progress" percentage={progressData.totalGamePercentageAllPlayers} />
                        )}
                    </div>


                    {currentPlayer && !isExpanded && <div className="hidden lg:block w-48 flex-shrink-0"><ProgressBar label="Your Progress" percentage={progressData.totalGamePercentageCurrentPlayer} size="small" /></div>}

                    {!isExpanded && (
                        <div className="text-center flex-shrink-0 w-32">
                            <h3 className="text-sm font-bold tracking-wide">Latest Year</h3>
                            <p className="text-lg font-semibold">{progressData.latestYear}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {progressData.allRequiredPlayersComplete && currentEraId < 6 && nextEra && (
                            <button onClick={advanceEra} className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:scale-105 whitespace-nowrap">
                                Advance Era
                            </button>
                        )}

                        <button onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Collapse dashboard' : 'Expand dashboard'} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-700 animate-fade-in-slide-up h-[400px] overflow-y-auto custom-scrollbar">
                        {activeTab === 'progress' && (
                            <div className="space-y-4">
                                {progressData.playerDetails.length > 0 ? progressData.playerDetails.map(renderPlayerDetail) : <p className="text-center text-gray-400">No players have joined yet.</p>}
                            </div>
                        )}

                        {activeTab === 'management' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                                {/* Placeholders for Management Panels */}
                                <div className="h-full">
                                    <ActionPanel />
                                </div>
                                <div className="h-full">
                                    <ResourcePanel />
                                </div>
                                <div className="h-full">
                                    <SettlementPanel />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </footer>
    );
};

export default PlayerDashboard;
