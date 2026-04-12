
import { describe, it, expect } from 'vitest';
import { Chronicler } from '../chronicler/engine';
import { GameEvent, WorldObject } from '../../types';
import { TriggerCondition, LoreTrigger } from '../chronicler/types';

describe('Chronicler Logic', () => {
    const chronicler = new Chronicler();

    const BASE_EVENT: GameEvent = {
        id: 'evt_1',
        ts: 1000,
        type: 'WORLD_CREATE',
        playerId: 'P1',
        age: 1,
        round: 1,
        turn: 1,
        payload: {
            worldId: 'w_1',
            kind: 'SETTLEMENT',
            isNamed: true
        }
    };

    const MOCK_TRIGGER: LoreTrigger = {
        id: "TEST_TRIGGER",
        name: "Test Trigger",
        version: "1.0",
        eventType: "WORLD_CREATE",
        eventKind: "SETTLEMENT",
        condition: { type: "ALWAYS" }, // Overridden in tests
        suggestedTemplates: [],
        suggestedAuthors: [],
        defaultScope: "GLOBAL",
        autoEligible: true,
        urgency: "NORMAL",
        enabled: true
    };

    it('should filter events by type mismatch', () => {
        // @ts-ignore - Accessing private for test injection or using public method with mock internal triggers would be harder
        // We will test via public processEvent but we need to inject our test trigger.
        // Since triggers are private hardcoded catalog, we can't easily swap them without a setter or constructor arg.
        // For this test, we'll assume the public method works if we can pass a matching event to the real catalog
        // OR we just test the private logic if we cast to any.

        // Actually, let's test the public behavior with the REAL catalog first, 
        // ensuring CITY_FOUNDED only fires for Settlements.

        const terrainEvent: GameEvent = {
            ...BASE_EVENT,
            payload: { ...BASE_EVENT.payload, kind: 'TERRAIN', worldId: 't_1' }
        };

        const state = { events: [], worldCache: new Map() };
        const candidates = chronicler.processEvent(terrainEvent, state);

        // Should NOT trigger CITY_FOUNDED
        const cityTrigger = candidates.find(c => c.triggerType === 'CITY_FOUNDED');
        expect(cityTrigger).toBeUndefined();
    });

    describe('Condition Evaluation (Private Logic via method access)', () => {
        // We'll cast to any to access private methods for unit testing specific logic 
        // without relying on the fixed Catalog
        const evaluate = (condition: TriggerCondition, event: GameEvent, items: WorldObject[]) => {
            const worldCache = new Map<string, WorldObject>();
            items.forEach(i => worldCache.set(i.id, i));
            return (chronicler as any).evaluateCondition(condition, event, { events: [], worldCache });
        };

        it('FIRST_OF_KIND: should return TRUE if it is the only one in cache', () => {
            const condition: TriggerCondition = { type: 'FIRST_OF_KIND', kind: 'SETTLEMENT', scope: 'GLOBAL' };
            const event = { ...BASE_EVENT };
            const myCity: WorldObject = {
                id: 'w_1', kind: 'SETTLEMENT', hexes: [], attrs: {}, isNamed: true
            };

            // Cache contains ONLY me
            const result = evaluate(condition, event, [myCity]);
            expect(result).toBe(true);
        });

        it('FIRST_OF_KIND: should return FALSE if another exists', () => {
            const condition: TriggerCondition = { type: 'FIRST_OF_KIND', kind: 'SETTLEMENT', scope: 'GLOBAL' };
            const event = { ...BASE_EVENT }; // ID w_1
            const myCity: WorldObject = { id: 'w_1', kind: 'SETTLEMENT', hexes: [], attrs: {}, isNamed: true };
            const oldCity: WorldObject = { id: 'w_2', kind: 'SETTLEMENT', hexes: [], attrs: {}, isNamed: true };

            // Cache contains me AND old one
            const result = evaluate(condition, event, [oldCity, myCity]);
            expect(result).toBe(false);
        });

        it('FIRST_OF_KIND (Regional): should return TRUE if others exist but in DIFFERENT region', () => {
            const condition: TriggerCondition = { type: 'FIRST_OF_KIND', kind: 'SETTLEMENT', scope: 'REGIONAL' };
            const event = { ...BASE_EVENT }; // ID w_1

            const myCity: WorldObject = {
                id: 'w_1', kind: 'SETTLEMENT', hexes: [],
                attrs: { regionId: 'r_A' }, isNamed: true
            };
            const otherRegionCity: WorldObject = {
                id: 'w_2', kind: 'SETTLEMENT', hexes: [],
                attrs: { regionId: 'r_B' }, isNamed: true
            };

            const result = evaluate(condition, event, [otherRegionCity, myCity]);
            expect(result).toBe(true);
        });

        it('FIRST_OF_KIND (Regional): should return FALSE if another exists in SAME region', () => {
            const condition: TriggerCondition = { type: 'FIRST_OF_KIND', kind: 'SETTLEMENT', scope: 'REGIONAL' };
            const event = { ...BASE_EVENT }; // ID w_1

            const myCity: WorldObject = {
                id: 'w_1', kind: 'SETTLEMENT', hexes: [],
                attrs: { regionId: 'r_A' }, isNamed: true
            };
            const sameRegionCity: WorldObject = {
                id: 'w_2', kind: 'SETTLEMENT', hexes: [],
                attrs: { regionId: 'r_A' }, isNamed: true
            };

            const result = evaluate(condition, event, [sameRegionCity, myCity]);
            expect(result).toBe(false);
        });

        it('THRESHOLD: should trigger ONLY on exact boundary (Edge Detection)', () => {
            const condition: TriggerCondition = {
                type: 'THRESHOLD', metric: 'COUNT_SETTLEMENT', operator: 'GTE', value: 3, scope: 'GLOBAL'
            };
            const event = { ...BASE_EVENT };

            // Scenario 1: Count is 2 -> False
            let items = [
                { id: '1', kind: 'SETTLEMENT' } as WorldObject,
                { id: '2', kind: 'SETTLEMENT' } as WorldObject
            ];
            expect(evaluate(condition, event, items)).toBe(false);

            // Scenario 2: Count becomes 3 -> TRUE (Transition)
            items.push({ id: '3', kind: 'SETTLEMENT' } as WorldObject);
            expect(evaluate(condition, event, items)).toBe(true);

            // Scenario 3: Count becomes 4 -> FALSE (Already passed)
            items.push({ id: '4', kind: 'SETTLEMENT' } as WorldObject);
            expect(evaluate(condition, event, items)).toBe(false);
        });
    });
});
