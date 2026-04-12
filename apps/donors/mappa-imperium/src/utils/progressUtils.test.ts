
import {
    getEraGoals,
    getTrackedEraIds,
    calculatePlayerProgress,
    calculateChronicleStats,
    calculateResourceTotals,
    calculateGameDurationPreview
} from './progressUtils';
import type { Player, ElementCard, GameSettings, Faction, Settlement } from '../types';

// Mocks
const mockPlayer: Player = { playerNumber: 1, name: 'Player 1', isOnline: true, deityCount: 3, isAi: false };
const mockSettings: GameSettings = { length: 'Standard', turnDuration: 10, players: 4, aiPlayers: 0 };

describe('progressUtils Integration Tests', () => {

    describe('getEraGoals', () => {
        const goals = getEraGoals(mockSettings);

        it('should return goals for eras 1 through 6', () => { // Test 1
            expect(Object.keys(goals)).toEqual(['1', '2', '3', '4', '5', '6']);
        });

        it('should have correct names for all eras', () => { // Test 2
            expect(goals[1].name).toBe('Age of Creation');
            expect(goals[6].name).toBe('Age of Collapse');
        });

        it('should calculate Era 1 progress based on Resources (2 required)', () => { // Test 3
            const resources: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 1, era: 1, name: 'R1', data: {} } as ElementCard,
                { id: '2', type: 'Resource', owner: 1, era: 1, name: 'R2', data: {} } as ElementCard
            ];
            const result = goals[1].getTaskCount(mockPlayer, resources);
            expect(result.completed).toBe(2);
            expect(result.total).toBe(2);
        });

        it('should calculate Era 2 progress based on Deity count', () => { // Test 4
            // mockPlayer bas deityCount 3 -> total 6 tasks
            const elements: ElementCard[] = [
                { id: '1', type: 'Deity', owner: 1, era: 2, name: 'D1', data: {} } as ElementCard,
                { id: '2', type: 'Location', owner: 1, era: 2, name: 'L1', data: {} } as ElementCard
            ];
            const result = goals[2].getTaskCount(mockPlayer, elements);
            expect(result.total).toBe(6);
            expect(result.completed).toBe(2);
        });

        it('should result in 0/0 for Era 2 if deityCount is 0', () => { // Test 5
            const p0 = { ...mockPlayer, deityCount: 0 };
            const result = goals[2].getTaskCount(p0, []);
            expect(result.total).toBe(0);
        });

        it('should calculate Era 3 Foundation progress correctly', () => { // Test 6
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', owner: 1, era: 3, name: 'Main', data: { isNeighbor: false } } as ElementCard,
                { id: '2', type: 'Faction', owner: 1, era: 3, name: 'Neighbor', data: { isNeighbor: true } } as ElementCard,
                { id: '3', type: 'Settlement', owner: 1, era: 3, name: 'S1', data: { purpose: 'Trade' } } as ElementCard
            ];
            const result = goals[3].getTaskCount(mockPlayer, elements);
            // 1 main + 1 neighbor + 1 settlement = 3
            expect(result.completed).toBe(3);
            expect(result.total).toBe(4);
        });

        it('should ignore Capital settlements in Era 3 count', () => { // Test 7
            const elements: ElementCard[] = [
                { id: '1', type: 'Settlement', owner: 1, era: 3, name: 'Cap', data: { purpose: 'Capital' } } as ElementCard
            ];
            const result = goals[3].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(0);
        });

        it('should use turns per era for Era 4 Exploration (Standard = 6 turns)', () => { // Test 8
            const result = goals[4].getTaskCount(mockPlayer, []);
            expect(result.total).toBe(6); // Standard length
        });

        it('should count completed exploration turns in Era 4', () => { // Test 9
            const elements: ElementCard[] = [
                { id: '1', type: 'Location', owner: 1, era: 4, creationStep: '4.1 Exploration', name: 'Exp1', data: {} } as ElementCard
            ];
            const result = goals[4].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1);
        });

        it('should calculate Era 5 progress (Expansion + Neighbors)', () => { // Test 10
            const result = goals[5].getTaskCount(mockPlayer, []);
            // Standard Era 5 turns = 6. No neighbors created yet.
            expect(result.total).toBe(6);
        });

        it('should include Neighbor count in Era 5 total', () => { // Test 11
            const neighborFaction: Faction = {
                id: '1',
                name: 'Neighbor',
                race: 'Elves',
                symbolName: 'Tree',
                emoji: '🌳',
                color: 'green',
                theme: 'Nature',
                description: 'A neighboring faction',
                leaderName: 'Leader',
                isNeighbor: true
            };
            const elements: ElementCard[] = [
                {
                    id: '1',
                    type: 'Faction',
                    owner: 1,
                    era: 3,
                    name: 'Neighbor',
                    data: neighborFaction
                } as ElementCard
            ];
            const result = goals[5].getTaskCount(mockPlayer, elements);
            // 6 turns + 1 neighbor
            expect(result.total).toBe(7);
        });

        it('should calculate Era 6 progress (Events + Landmarks)', () => { // Test 12
            const result = goals[6].getTaskCount(mockPlayer, []);
            // Standard Era 6 turns = 5. Total = 5 + 1 (landmark) = 6
            expect(result.total).toBe(6);
        });
    });

    describe('calculatePlayerProgress', () => {
        const goals = getEraGoals(mockSettings);
        const trackedIds = getTrackedEraIds(goals);

        it('should return a PlayerProgress object with correct shape', () => { // Test 13
            const progress = calculatePlayerProgress(mockPlayer, [], goals, trackedIds);
            expect(progress.playerNumber).toBe(1);
            expect(progress.eras).toBeDefined();
            expect(progress.totalGamePercentage).toBe(0);
        });

        it('should correctly calculate total game percentage', () => { // Test 14
            // Mock Era 1 completion (2/2)
            const elements: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 1, era: 1, name: 'R1', data: {} } as ElementCard,
                { id: '2', type: 'Resource', owner: 1, era: 1, name: 'R2', data: {} } as ElementCard
            ];
            const progress = calculatePlayerProgress(mockPlayer, elements, goals, trackedIds);

            // Total tasks approx: E1(2) + E2(6) + E3(4) + E4(6) + E5(6) + E6(7) = 31
            // Completed: 2
            // 2/31 ~= 6%
            expect(progress.totalGamePercentage).toBeGreaterThan(0);
            expect(progress.eras[1].progress).toBe(1); // 100%
        });

        it('should handle empty element list gracefully', () => { // Test 15
            const progress = calculatePlayerProgress(mockPlayer, [], goals, trackedIds);
            expect(progress.totalGamePercentage).toBe(0);
        });
    });

    describe('calculateChronicleStats', () => {
        it('should return null if no settings provided', () => { // Test 16
            expect(calculateChronicleStats(null, [], [], 1)).toBeNull();
        });

        it('should calculate total years based on latest element', () => { // Test 17
            const elements: ElementCard[] = [
                { id: '1', type: 'Event', createdYear: 450, data: {} } as ElementCard
            ];
            const stats = calculateChronicleStats(mockSettings, elements, [mockPlayer], 4);
            expect(stats?.totalYears).toBe(450);
        });

        it('should identify Prime Factions correctly', () => { // Test 18
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', owner: 1, name: 'My Empire', data: { isNeighbor: false } } as ElementCard
            ];
            const stats = calculateChronicleStats(mockSettings, elements, [mockPlayer], 1);
            expect(stats?.primeFactions[0].name).toBe('My Empire');
        });

        it('should count elements by type', () => { // Test 19
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', data: {} } as ElementCard,
                { id: '2', type: 'Faction', data: {} } as ElementCard,
                { id: '3', type: 'Event', data: {} } as ElementCard
            ];
            const stats = calculateChronicleStats(mockSettings, elements, [mockPlayer], 1);
            expect(stats?.elementCounts['Faction']).toBe(2);
            expect(stats?.elementCounts['Event']).toBe(1);
        });
    });

    describe('calculateResourceTotals', () => {
        it('should return default resources for new player', () => { // Test 20
            const totals = calculateResourceTotals(mockPlayer, []);
            expect(totals['Gold']).toBe(100);
            expect(totals['Food']).toBe(50);
        });

        it('should add resources from cards', () => { // Test 21
            const elements: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 1, name: 'Gold', data: {} } as ElementCard,
                { id: '2', type: 'Resource', owner: 1, name: 'Iron', data: {} } as ElementCard
            ];
            const totals = calculateResourceTotals(mockPlayer, elements);
            expect(totals['Gold']).toBe(110); // 100 base + 10 card
            expect(totals['Iron']).toBe(10);  // 0 base + 10 card
        });

        it('should handle custom resource names', () => { // Test 22
            const elements: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 1, name: 'Spice', data: {} } as ElementCard
            ];
            const totals = calculateResourceTotals(mockPlayer, elements);
            expect(totals['Spice']).toBe(10);
        });

        it('should ignore resources owned by other players', () => { // Test 23
            const elements: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 2, name: 'Gold', data: {} } as ElementCard
            ];
            const totals = calculateResourceTotals(mockPlayer, elements);
            expect(totals['Gold']).toBe(100); // Unchanged
        });

        it('should return empty object if player is null', () => { // Test 24
            expect(calculateResourceTotals(null, [])).toEqual({});
        });
    });

    describe('calculateGameDurationPreview', () => {
        it('should calculate Era 3 duration (Standard 3 turns * 10y)', () => { // Test 25
            const prev = calculateGameDurationPreview('Standard', 10);
            expect(prev.eraBreakdown.era3).toBe(30);
        });

        it('should calculate Era 4 duration (Standard 6 turns * 10y)', () => { // Test 26
            const prev = calculateGameDurationPreview('Standard', 10);
            expect(prev.eraBreakdown.era4).toBe(60);
        });

        it('should calculate Era 5 duration (Standard 6 turns * 10y)', () => { // Test 27
            const prev = calculateGameDurationPreview('Standard', 10);
            expect(prev.eraBreakdown.era5).toBe(60);
        });

        it('should calculate different durations for Short game', () => { // Test 28
            const prev = calculateGameDurationPreview('Short', 10);
            // Short Era 4 = 3 turns
            expect(prev.eraBreakdown.era4).toBe(30);
        });

        it('should calculate different durations for Epic game', () => { // Test 29
            const prev = calculateGameDurationPreview('Epic', 10);
            // Epic Era 4 = 11 turns
            expect(prev.eraBreakdown.era4).toBe(110);
        });

        it('should sum up total years correctly', () => { // Test 30 (Final)
            const prev = calculateGameDurationPreview('Standard', 10);
            // 30 (E1) + 100 (E2) + 30 (E3) + 60 (E4) + 60 (E5) + 50 (E6) = 330
            expect(prev.totalYears).toBe(330);
        });
    });

    describe('Additional Scenarios (30 more tests)', () => {
        const goals = getEraGoals(mockSettings);

        // --- Era 1 Edge Cases ---
        it('should not count Resources owned by other players in Era 1', () => { // Test 31
            const resources: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 2, era: 1, name: 'R1', data: {} } as ElementCard
            ];
            const result = goals[1].getTaskCount(mockPlayer, resources);
            expect(result.completed).toBe(0);
        });

        it('should not count non-Resource elements in Era 1', () => { // Test 32
            const elements: ElementCard[] = [
                { id: '1', type: 'Location', owner: 1, era: 1, name: 'L1', data: {} } as ElementCard
            ];
            const result = goals[1].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(0);
        });

        it('should not count Resources from wrong era in Era 1', () => { // Test 33
            const resources: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 1, era: 2, name: 'R1', data: {} } as ElementCard
            ];
            const result = goals[1].getTaskCount(mockPlayer, resources);
            expect(result.completed).toBe(0);
        });

        // --- Era 2 Edge Cases ---
        it('should handle mixed ownership in Era 2 (Deities)', () => { // Test 34
            const elements: ElementCard[] = [
                { id: '1', type: 'Deity', owner: 1, era: 2, name: 'D1', data: {} } as ElementCard,
                { id: '2', type: 'Deity', owner: 2, era: 2, name: 'D2', data: {} } as ElementCard
            ];
            const result = goals[2].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1);
        });

        it('should handle mixed ownership in Era 2 (Locations)', () => { // Test 35
            const elements: ElementCard[] = [
                { id: '1', type: 'Location', owner: 1, era: 2, name: 'L1', data: {} } as ElementCard,
                { id: '2', type: 'Location', owner: 2, era: 2, name: 'L2', data: {} } as ElementCard
            ];
            const result = goals[2].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1);
        });

        it('should handle missing deityCount (default 0)', () => { // Test 36
            const playerNoDeity = { ...mockPlayer, deityCount: undefined };
            const result = goals[2].getTaskCount(playerNoDeity, []);
            expect(result.total).toBe(0);
        });

        // --- Era 3 Edge Cases ---
        it('should handle mixed ownership in Era 3 (Factions)', () => { // Test 37
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', owner: 1, era: 3, name: 'F1', data: { isNeighbor: false } } as unknown as ElementCard,
                { id: '2', type: 'Faction', owner: 2, era: 3, name: 'F2', data: { isNeighbor: false } } as unknown as ElementCard
            ];
            const result = goals[3].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1); // Only own faction
        });

        it('should count multiple non-capital settlements correctly', () => { // Test 38
            const elements: ElementCard[] = [
                { id: '1', type: 'Settlement', owner: 1, era: 3, name: 'S1', data: { purpose: 'Trade' } } as ElementCard,
                { id: '2', type: 'Settlement', owner: 1, era: 3, name: 'S2', data: { purpose: 'Military' } } as ElementCard
            ];
            const result = goals[3].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(2);
        });

        it('should not double count if multiple neighbors exist (check logic)', () => { // Test 39
            // Logic check: pF + n + rS. n = some(...) ? 1 : 0.
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', owner: 1, era: 3, name: 'N1', data: { isNeighbor: true } } as unknown as ElementCard,
                { id: '2', type: 'Faction', owner: 1, era: 3, name: 'N2', data: { isNeighbor: true } } as unknown as ElementCard
            ];
            const result = goals[3].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1); // 'n' is binary 1 or 0
        });

        it('should not double count if multiple primary factions exist (check logic)', () => { // Test 40
            // Logic check: pF = some(...) ? 1 : 0.
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', owner: 1, era: 3, name: 'F1', data: { isNeighbor: false } } as unknown as ElementCard,
                { id: '2', type: 'Faction', owner: 1, era: 3, name: 'F2', data: { isNeighbor: false } } as unknown as ElementCard
            ];
            const result = goals[3].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1);
        });

        // --- Era 4 Edge Cases ---
        it('should not count Era 4 Exploration from wrong owner', () => { // Test 41
            const elements: ElementCard[] = [
                { id: '1', type: 'Location', owner: 2, era: 4, creationStep: '4.1 Exploration', name: 'Exp1', data: {} } as ElementCard
            ];
            const result = goals[4].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(0);
        });

        it('should not count Era 4 items with wrong creationStep', () => { // Test 42
            const elements: ElementCard[] = [
                { id: '1', type: 'Location', owner: 1, era: 4, creationStep: '4.2 Colonization', name: 'Exp1', data: {} } as ElementCard
            ];
            const result = goals[4].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(0);
        });

        it('should use Long game settings for Era 4 turns', () => { // Test 43
            const longSettings: GameSettings = { ...mockSettings, length: 'Long' };
            const longGoals = getEraGoals(longSettings);
            const result = longGoals[4].getTaskCount(mockPlayer, []);
            expect(result.total).toBe(8); // Long = 8 turns
        });

        // --- Era 5 Edge Cases ---
        it('should count Era 5 Neighbor Development correctly', () => { // Test 44
            const elements: ElementCard[] = [
                { id: '1', type: 'Event', owner: 1, era: 5, creationStep: '5.2 Neighbor Development', name: 'Dev1', data: {} } as ElementCard
            ];
            const result = goals[5].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1);
        });

        it('should not count Era 5 Dev from other players', () => { // Test 45
            const elements: ElementCard[] = [
                { id: '1', type: 'Event', owner: 2, era: 5, creationStep: '5.2 Neighbor Development', name: 'Dev1', data: {} } as ElementCard
            ];
            const result = goals[5].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(0);
        });

        it('should count generic Factions as neighbors if isNeighbor true', () => { // Test 46
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', owner: 1, era: 5, name: 'N', data: { isNeighbor: true } } as unknown as ElementCard
            ];
            const result = goals[5].getTaskCount(mockPlayer, elements);
            expect(result.total).toBe(7); // 6 base + 1 neighbor
        });

        it('should NOT count primary Factions as neighbors', () => { // Test 47
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', owner: 1, era: 3, name: 'P', data: { isNeighbor: false } } as unknown as ElementCard
            ];
            const result = goals[5].getTaskCount(mockPlayer, elements);
            expect(result.total).toBe(6); // 6 base
        });

        // --- Era 6 Edge Cases ---
        it('should count Iconic landmarks', () => { // Test 48
            const elements: ElementCard[] = [
                { id: '1', type: 'Monument', owner: 1, era: 6, creationStep: '6.2 Iconic Landmark', name: 'M1', data: {} } as ElementCard
            ];
            const result = goals[6].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1);
        });

        it('should count Final Era Events', () => { // Test 49
            const elements: ElementCard[] = [
                { id: '1', type: 'Event', owner: 1, era: 6, creationStep: '6.1 Final Era Event', name: 'E1', data: {} } as ElementCard
            ];
            const result = goals[6].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(1);
        });

        it('should ignore Era 6 events with wrong step', () => { // Test 50
            const elements: ElementCard[] = [
                { id: '1', type: 'Event', owner: 1, era: 6, creationStep: '6.0 Omen', name: 'E1', data: {} } as ElementCard
            ];
            const result = goals[6].getTaskCount(mockPlayer, elements);
            expect(result.completed).toBe(0);
        });

        // --- General Utils Edge Cases ---
        it('getTrackedEraIds should return sorted array', () => { // Test 51
            const ids = getTrackedEraIds(goals);
            expect(ids).toEqual([1, 2, 3, 4, 5, 6]);
            // Ensure strictly sorted
            const sorted = [...ids].sort((a, b) => a - b);
            expect(ids).toEqual(sorted);
        });

        it('calculatePlayerProgress should handle undefined element list', () => { // Test 52
            // @ts-ignore
            const progress = calculatePlayerProgress(mockPlayer, undefined, goals, [1]);
            expect(progress.playerNumber).toBe(1);
            // Will throw/fail if not handled? Function signature implies elements required.
            // Let's passed empty array as safeguard in component usage, check empty behaviour
            const p2 = calculatePlayerProgress(mockPlayer, [], goals, [1]);
            expect(p2.eras[1].completed).toBe(0);
        });

        it('calculatePlayerProgress should cap progress at 1 (100%)', () => { // Test 53
            // 3 resources for Era 1 (needs 2)
            const elements: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 1, era: 1, name: 'R1', data: {} } as ElementCard,
                { id: '2', type: 'Resource', owner: 1, era: 1, name: 'R2', data: {} } as ElementCard,
                { id: '3', type: 'Resource', owner: 1, era: 1, name: 'R3', data: {} } as ElementCard
            ];
            const progress = calculatePlayerProgress(mockPlayer, elements, goals, [1]);
            expect(progress.eras[1].progress).toBe(1); // Capped
        });

        it('calculateChronicleStats with multiple players', () => { // Test 54
            const p2 = { ...mockPlayer, playerNumber: 2, name: 'P2' };
            const elements: ElementCard[] = [
                { id: '1', type: 'Faction', owner: 1, name: 'F1', data: { isNeighbor: false } } as ElementCard,
                { id: '2', type: 'Faction', owner: 2, name: 'F2', data: { isNeighbor: false } } as ElementCard
            ];
            const stats = calculateChronicleStats(mockSettings, elements, [mockPlayer, p2], 1);
            expect(stats?.primeFactions.length).toBe(2);
        });

        it('calculateChronicleStats excludes unknown factions', () => { // Test 55
            // If no faction card found for player
            const stats = calculateChronicleStats(mockSettings, [], [mockPlayer], 1);
            expect(stats?.primeFactions.length).toBe(0);
        });

        it('calculateResourceTotals accommodates weird resource names', () => { // Test 56
            const elements: ElementCard[] = [
                { id: '1', type: 'Resource', owner: 1, name: 'Unobtainium', data: {} } as ElementCard
            ];
            const totals = calculateResourceTotals(mockPlayer, elements);
            expect(totals['Unobtainium']).toBe(10);
        });

        it('calculateGameDurationPreview for Epic length Era 6', () => { // Test 57
            const prev = calculateGameDurationPreview('Epic', 10);
            // Epic Era 6 = 10 turns
            expect(prev.eraBreakdown.era6).toBe(100);
        });

        it('calculateGameDurationPreview for Short length Era 3 check', () => { // Test 58
            // Short Era 3 is 3 turns * 10 = 30
            const prev = calculateGameDurationPreview('Short', 10);
            expect(prev.eraBreakdown.era3).toBe(30);
        });

        it('calculateGameDurationPreview should handle default turnDuration if 0 provided (logic check)', () => { // Test 59
            // Function just multiplies.
            const prev = calculateGameDurationPreview('Standard', 0);
            expect(prev.totalYears).toBe(130); // 30+100 base
        });

        it('verify EraGoals naming consistency', () => { // Test 60
            expect(goals[4].name).toContain('Discovery');
            expect(goals[5].name).toContain('Empires');
        });

    });
});
