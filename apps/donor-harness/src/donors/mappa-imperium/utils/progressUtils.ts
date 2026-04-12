import { TURNS_PER_ERA } from '../data/eras';
import type { ElementCard, Player, Faction, Settlement, GameSettings } from '@mi/types';
import type { EraGoals, PlayerProgress, ChronicleStats, ResourceTotals, EraBreakdown, GameDurationPreview } from '../types/progress.types';

// --- Era Goals Logic ---

export const getEraGoals = (gameSettings: GameSettings | null): EraGoals => {
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
        3: {
            name: 'Age of Foundation',
            getTaskCount: (p: Player, els: ElementCard[]) => {
                const f = els.filter(el => el.owner === p.playerNumber && el.era === 3 && el.type === 'Faction');
                const s = els.filter(el => el.owner === p.playerNumber && el.era === 3 && el.type === 'Settlement');
                const pF = f.some(i => !(i.data as Faction).isNeighbor) ? 1 : 0;
                const n = f.some(i => (i.data as Faction).isNeighbor) ? 1 : 0;
                const rS = s.filter(i => (i.data as Settlement).purpose !== 'Capital').length;
                return { completed: pF + n + rS, total: 4 };
            }
        },
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

                const neighborsTotal = els.filter(el => {
                    if (el.owner === p.playerNumber && el.type === 'Faction') {
                        return (el.data as Faction).isNeighbor;
                    }
                    return false;
                }).length;
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
};

export const getTrackedEraIds = (eraGoals: EraGoals): number[] => {
    return Object.keys(eraGoals).map(Number).sort((a, b) => a - b);
};

// --- Player Progress Logic ---

export const calculatePlayerProgress = (
    player: Player,
    elements: ElementCard[] = [],
    eraGoals: EraGoals,
    trackedEraIds: number[]
): PlayerProgress => {
    let totalGameTasks = 0;
    let completedGameTasks = 0;
    const eraProgress: PlayerProgress['eras'] = {};

    trackedEraIds.forEach(eraId => {
        const result = eraGoals[eraId].getTaskCount(player, elements);

        eraProgress[eraId] = {
            completed: result.completed,
            total: result.total,
            progress: result.total > 0 ? Math.min(1, result.completed / result.total) : 0
        };

        totalGameTasks += result.normalizedTotal !== undefined ? result.normalizedTotal : result.total;
        completedGameTasks += result.normalizedCompleted !== undefined ? result.normalizedCompleted : result.completed;
    });

    return {
        playerNumber: player.playerNumber,
        name: player.name,
        eras: eraProgress,
        totalGamePercentage: totalGameTasks > 0 ? Math.round((completedGameTasks / totalGameTasks) * 100) : 0
    };
};

// --- Chronicle Stats Logic ---

export const calculateChronicleStats = (
    gameSettings: GameSettings | null,
    elements: ElementCard[],
    players: Player[],
    currentEraId: number
): ChronicleStats | null => {
    if (!gameSettings) return null;

    const ypt = gameSettings.turnDuration;
    const latestYearNum = Math.max(0, ...elements.filter(el => el.createdYear).map(el => el.createdYear!));
    // Fallback calculation if latestYearNum is 0 (start of game)
    const calculatedTotalYears = currentEraId * 100; // Simplified placeholder, the component logic was simpler

    return {
        totalYears: latestYearNum > 0 ? latestYearNum : 0,
        primeFactions: players.map(p => {
            const faction = elements.find(el => el.owner === p.playerNumber && el.type === 'Faction' && !(el.data as Faction).isNeighbor);
            return {
                name: faction ? faction.name : 'Unknown Faction',
                ownerName: p.name
            };
        }).filter(f => f.name !== 'Unknown Faction'),
        totalElements: elements.length,
        elementCounts: elements.reduce((acc, el) => {
            acc[el.type] = (acc[el.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    };
};

// --- Resource Totals Logic ---

export const calculateResourceTotals = (player: Player | null, elements: ElementCard[]): ResourceTotals => {
    if (!player) return {};

    const playerResources = elements.filter(
        el => el.owner === player.playerNumber && el.type === 'Resource'
    );

    // Initialize with core resources guaranteed to exist in UI
    const totals: ResourceTotals = {
        'Gold': 100, // Base income
        'Food': 50,  // Base supply
        'Mana': 0,
        'Iron': 0,
        'Wood': 0,
        'Darksteel': 0
    };

    playerResources.forEach(res => {
        // Simple mock calculation: in a real game, this would sum up values from the Resource card data
        // For now, we assume each resource card adds +10 to its named type for demonstration
        const resourceName = res.name; // Assuming name matches type for MVP
        if (totals[resourceName] !== undefined) {
            totals[resourceName] += 10;
        } else {
            // Check if name is part of standard set or add new custom
            totals[resourceName] = 10;
        }
    });

    return totals;
};

// --- Era Breakdown Logic ---

export const calculateGameDurationPreview = (length: GameSettings['length'], turnDuration: number): GameDurationPreview => {
    const turnsConfig = TURNS_PER_ERA[length];

    const eraBreakdown: EraBreakdown = {
        era3: (turnsConfig[3] || 3) * turnDuration, // Use config or default 3
        era4: turnsConfig[4] * turnDuration,
        era5: turnsConfig[5] * turnDuration,
        era6: turnsConfig[6] * turnDuration
    };

    const totalYears = 30 + (2 * 50) + // Era 1 & 2 approx
        eraBreakdown.era3 + eraBreakdown.era4 + eraBreakdown.era5 + eraBreakdown.era6;

    return {
        totalYears,
        eraBreakdown
    };
};
