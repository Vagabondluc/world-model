import type { GameSettings, Player, ElementCard } from '../types';
import { TURNS_PER_ERA } from '../data/eras';

export const calculateCurrentYearForPlayer = (
    viewedEraId: number,
    gameSettings: GameSettings | null,
    elements: ElementCard[],
    currentPlayer: Player | null
): string => {
    if (viewedEraId === 0) return '';
    if (viewedEraId === 1) return 'Primordial Times';
    if (viewedEraId === 2) return 'Ancient Times';

    if (!gameSettings) {
        return 'Timeline Active';
    }
    
    const turnDuration = gameSettings.turnDuration || 10;
    const era3Turns = TURNS_PER_ERA[gameSettings.length][3] || 3;
    // Era 3 is at least 30 years, or turns * duration if that's longer
    const era3Years = Math.max(30, era3Turns * turnDuration);

    if (viewedEraId === 3) {
        return `Years 1-${era3Years}`;
    }

    if (!currentPlayer) {
        return 'Timeline Active'; // For observers
    }

    const completedTurns = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === viewedEraId && !el.isDebug).length;
    const currentTurn = completedTurns + 1;
    
    const totalTurnsForEra = (era: 4 | 5 | 6) => TURNS_PER_ERA[gameSettings.length][era] || 0;

    const safeEraId = viewedEraId as 4 | 5 | 6;

    if (currentTurn > totalTurnsForEra(safeEraId)) {
        // Player has completed this era, so let's show the range of the whole era.
        let precedingYears = era3Years;
        if (viewedEraId > 4) precedingYears += totalTurnsForEra(4) * turnDuration;
        if (viewedEraId > 5) precedingYears += totalTurnsForEra(5) * turnDuration;

        const startYear = precedingYears + 1;
        const endYear = startYear + (totalTurnsForEra(safeEraId) * turnDuration) - 1;
        return `Years ${startYear}-${endYear}`;
    }


    let precedingYears = era3Years;
    if (viewedEraId > 4) precedingYears += totalTurnsForEra(4) * turnDuration;
    if (viewedEraId > 5) precedingYears += totalTurnsForEra(5) * turnDuration;

    const startYear = precedingYears + ((currentTurn - 1) * turnDuration) + 1;
    
    return `Year ~${startYear}`;
};