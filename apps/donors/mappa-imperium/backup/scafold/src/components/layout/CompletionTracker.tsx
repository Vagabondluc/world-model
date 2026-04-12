import React, { useState, useMemo } from 'react';
import { eras } from '../../data/eras';
import type { ElementCard, Player, Faction, Settlement, GameSettings } from '../../types';
import { useGame } from '../../contexts/GameContext';

// Define turns per era based on game length from the rulebook
const TURNS_PER_ERA: Record<GameSettings['length'], { 4: number; 5: number; 6: number; }> = {
    Short: { 4: 3, 5: 4, 6: 3 },
    Standard: { 4: 6, 5: 6, 6: 5 },
    Long: { 4: 8, 5: 8, 6: 6 },
    Epic: { 4: 11, 5: 12, 6: 10 }
};

const CompletionTracker = () => {
    const { elements, players, currentEraId, handleAdvanceEra, isDebugMode, currentPlayer, gameSettings } = useGame();
    const [isExpanded, setIsExpanded] = useState(false);

    const ERA_GOALS = useMemo(() => {
        const getTurns = (eraId: 4 | 5 | 6) => {
            const length = gameSettings?.length || 'Standard';
            return TURNS_PER_ERA[length][eraId] || 0;
        };

        return {
            1: { name: 'Age of Creation', getTaskCount: (p: Player, els: ElementCard[]) => ({ completed: els.filter(el => el.owner === p.playerNumber && el.era === 1 && el.type === 'Resource').length, total: 2 }) },
            2: {
                name: 'Age of Myth',
                getTaskCount: (p: Player, els: ElementCard[]) => {
                    const deityCount = p.deityCount || 0;
                    if (deityCount === 0) {
                        return { completed: 0, total: 0 }; // Era not started for this player.
                    }
                    const deitiesCreated = els.filter(el => el.owner === p.playerNumber && el.era === 2 && el.type === 'Deity').length;
                    const sitesCreated = els.filter(el => el.owner === p.playerNumber && el.era === 2 && el.type === 'Location').length;
                    
                    const totalTasks = deityCount * 2;
                    const completedTasks = deitiesCreated + sitesCreated;

                    return {
                        completed: completedTasks, // For display
                        total: totalTasks, // For display
                        normalizedCompleted: totalTasks > 0 ? (completedTasks / totalTasks) : 0, // For calculation
                        normalizedTotal: 1, // For calculation
                    };
                }
            },
            3: { name: 'Age of Foundation', getTaskCount: (p: Player, els: ElementCard[]) => { const f = els.filter(el => el.owner === p.playerNumber && el.era === 3 && el.type === 'Faction'); const s = els.filter(el => el.owner === p.playerNumber && el.era === 3 && el.type === 'Settlement'); const pF = f.some(i => !(i.data as Faction).isNeighbor) ? 1:0; const n = f.some(i => (i.data as Faction).isNeighbor) ? 1:0; const rS = s.filter(i => (i.data as Settlement).purpose !== 'Capital').length; return { completed: pF + n + rS, total: 4 }; } },
            4: { 
                name: 'Age of Discovery', 
                getTaskCount: (p: Player, els: ElementCard[]) => ({ 
                    completed: els.filter(el => el.owner === p.playerNumber && el.era === 4 && el.creationStep === '4.1 Exploration').length, 
                    total: getTurns(4) 
                }) 
            },
            5: { 
                name: 'Age of Empires', 
                getTaskCount: (p: Player, els: ElementCard[]) => {
                    const expansionTurnsTotal = getTurns(5);
                    const expansionTurnsCompleted = els.filter(el => el.owner === p.playerNumber && el.era === 5 && el.creationStep === '5.1 Empire Event').length;
                    
                    const neighborsTotal = els.filter(el => el.owner === p.playerNumber && el.type === 'Faction' && (el.data as Faction).isNeighbor).length;
                    const neighborDevelopmentsCompleted = els.filter(el => el.owner === p.playerNumber && el.era === 5 && el.creationStep === '5.2 Neighbor Development').length;

                    return { 
                        completed: expansionTurnsCompleted + neighborDevelopmentsCompleted, 
                        total: expansionTurnsTotal + neighborsTotal
                    };
                }
            },
            6: { 
                name: 'Age of Collapse', 
                getTaskCount: (p: Player, els: ElementCard[]) => {
                    const totalTurns = getTurns(6);
                    const eventsCompleted = els.filter(el => el.owner === p.playerNumber && el.era === 6 && el.creationStep === '6.1 Final Era Event').length;
                    const landmarksCompleted = els.filter(el => el.owner === p.playerNumber && el.era === 6 && el.creationStep === '6.2 Iconic Landmark').length;
                    const totalIndividualTasks = totalTurns + 1;
                    const completedIndividualTasks = eventsCompleted + landmarksCompleted;
                    return { 
                        completed: completedIndividualTasks, 
                        total: totalIndividualTasks
                    };
                } 
            }
        };
    }, [gameSettings]);

    const TRACKED_ERA_IDS = useMemo(() => Object.keys(ERA_GOALS).map(Number).sort((a, b) => a - b), [ERA_GOALS]);

    const progressData = useMemo(() => {
        if (!players.length) return { playerDetails: [], allRequiredPlayersComplete: false, totalGamePercentageAllPlayers: 0, totalGamePercentageCurrentPlayer: 0, latestYear: 'N/A' };

        const playerDetails = players.map(player => {
            let totalGameTasks = 0, completedGameTasks = 0;
            const eraProgress: { [key: number]: { completed: number; total: number; progress: number; } } = {};
            
            TRACKED_ERA_IDS.forEach(eraId => {
                const result = (ERA_GOALS as any)[eraId].getTaskCount(player, elements);
                
                eraProgress[eraId] = { 
                    completed: result.completed, 
                    total: result.total, 
                    progress: result.total > 0 ? Math.min(1, result.completed / result.total) : 0 
                };

                totalGameTasks += result.normalizedTotal !== undefined ? result.normalizedTotal : result.total;
                completedGameTasks += result.normalizedCompleted !== undefined ? result.normalizedCompleted : result.completed;
            });
            
            return {
                playerNumber: player.playerNumber, name: player.name, eras: eraProgress,
                totalGamePercentage: totalGameTasks > 0 ? Math.round((completedGameTasks / totalGameTasks) * 100) : 0
            };
        });

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
        
        // Special check for Era 6: all players must complete their individual tasks AND the global omen must be created.
        if (currentEraId === 6 && allRequiredPlayersComplete) {
            allRequiredPlayersComplete = elements.some(el => el.era === 6 && el.creationStep === '6.3 World Omen');
        }

        const totalCompletedAll = playerDetails.reduce((sum, p) => {
            let playerCompleted = 0;
            TRACKED_ERA_IDS.forEach(eraId => {
                 const result = (ERA_GOALS as any)[eraId].getTaskCount(players.find(pl => pl.playerNumber === p.playerNumber)!, elements);
                 playerCompleted += result.normalizedCompleted !== undefined ? result.normalizedCompleted : result.completed;
            });
            return sum + playerCompleted;
        }, 0);
        
        const totalTasksAll = playerDetails.reduce((sum, p) => {
             let playerTotal = 0;
            TRACKED_ERA_IDS.forEach(eraId => {
                 const result = (ERA_GOALS as any)[eraId].getTaskCount(players.find(pl => pl.playerNumber === p.playerNumber)!, elements);
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
                <div className={`progress-bar-track ${size === 'small' ? 'h-2.5' : ''}`}>
                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className={`font-semibold ${size === 'large' ? 'text-lg' : 'text-md'}`}>{percentage}%</span>
            </div>
        </div>
    );

    const renderPlayerDetail = (playerDetail: (typeof progressData.playerDetails)[0]) => (
        <div key={playerDetail.playerNumber} className="p-3 bg-gray-700/50 rounded-lg">
            <ProgressBar label={playerDetail.name} percentage={playerDetail.totalGamePercentage} size="small" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2 text-xs text-gray-300 mt-2">
                {TRACKED_ERA_IDS.map(eraId => {
                    const eraData = playerDetail.eras[eraId];
                    const eraName = (ERA_GOALS as any)[eraId].name;
                    return <div key={eraId} title={`Era ${eraId}: ${eraName}`}><span className="font-bold">E{eraId}:</span> {eraData.total > 0 ? `${eraData.completed}/${eraData.total}` : 'N/A'}</div>;
                })}
            </div>
        </div>
    );
    
    const nextEra = eras.find(e => e.id === currentEraId + 1);

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
                        <button onClick={handleAdvanceEra} className="btn btn-primary bg-blue-600 hover:bg-blue-500">
                           Advance to {nextEra.name}
                        </button>
                    )}
                    {progressData.allRequiredPlayersComplete && currentEraId === 6 && (
                        <button onClick={handleAdvanceEra} className="btn btn-primary bg-green-600 hover:bg-green-500">
                           Finish Chronicle & View Summary
                        </button>
                    )}
                    <button onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Collapse progress details' : 'Expand progress details'} className="p-2">
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