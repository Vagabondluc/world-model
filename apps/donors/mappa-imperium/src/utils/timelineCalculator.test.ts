import { calculateCurrentYearForPlayer } from './timelineCalculator';
import { GameSettings, Player, ElementCard } from '../types';

describe('timelineCalculator', () => {
    const mockSettings: GameSettings = {
        length: 'Standard', // 3 eras: 3, 4, 5 turns? No.
        // Eras.ts says Standard: { 3: 3, 4: 6, 5: 6, 6: 5 }
        turnDuration: 10,
        playerCount: 1,
        // other fields irrelevant for this test
        worldName: 'Test World',
        eraDuration: 10,
        startingEra: 1,
        currentEra: 1,
        currentTurn: 1,
        aiPlayers: 0,
        players: 1
    };

    const mockPlayer: Player = {
        playerNumber: 1,
        name: 'Player 1',
        isOnline: true,
        isAi: false
    };

    it('should return empty string for Era 0', () => {
        expect(calculateCurrentYearForPlayer(0, mockSettings, [], mockPlayer)).toBe('');
    });

    it('should return "Primordial Times" for Era 1', () => {
        expect(calculateCurrentYearForPlayer(1, mockSettings, [], mockPlayer)).toBe('Primordial Times');
    });

    it('should return "Ancient Times" for Era 2', () => {
        expect(calculateCurrentYearForPlayer(2, mockSettings, [], mockPlayer)).toBe('Ancient Times');
    });

    it('should return "Timeline Active" if settings are missing', () => {
        expect(calculateCurrentYearForPlayer(3, null, [], mockPlayer)).toBe('Timeline Active');
    });

    it('should return range for Era 3 (Years 1-30)', () => {
        expect(calculateCurrentYearForPlayer(3, mockSettings, [], mockPlayer)).toBe('Years 1-30');
    });

    it('should return specific year for Era 4 based on completed turns', () => {
        const elements: ElementCard[] = [];
        expect(calculateCurrentYearForPlayer(4, mockSettings, elements, mockPlayer)).toBe('Year ~31');
    });

    it('should increment year based on turns in Era 4', () => {
        // 1 turn complete. Current is 2. (1*10) + 31 = 41.
        const elements: ElementCard[] = [
            { id: '1', owner: 1, era: 4, isDebug: false } as ElementCard
        ];
        expect(calculateCurrentYearForPlayer(4, mockSettings, elements, mockPlayer)).toBe('Year ~41');
    });

    it('should return full range if Era 4 is completed', () => {
        // Standard Era 4 has 6 turns. We need 6 cards.
        const elements: ElementCard[] = Array(6).fill(null).map((_, i) => ({
            id: String(i), owner: 1, era: 4, isDebug: false
        } as ElementCard));

        // Start 31. End = 31 + 60 - 1 = 90.
        expect(calculateCurrentYearForPlayer(4, mockSettings, elements, mockPlayer)).toBe('Years 31-90');
    });

    it('should handle Era 5 correctly', () => {
        // Era 3 ends 30.
        // Era 4 ends 90 (6 turns * 10).
        // Era 5 starts 91.
        const elements: ElementCard[] = [];
        expect(calculateCurrentYearForPlayer(5, mockSettings, elements, mockPlayer)).toBe('Year ~91');
    });

    it('should return range for observer (no player) in Era 3', () => {
        // Since Era 3 logic comes before player check, it returns range.
        expect(calculateCurrentYearForPlayer(3, mockSettings, [], null)).toBe('Years 1-30');
    });

    it('should return defined for Era 6', () => {
        expect(calculateCurrentYearForPlayer(6, mockSettings, [], mockPlayer)).toBeDefined();
    });
});
