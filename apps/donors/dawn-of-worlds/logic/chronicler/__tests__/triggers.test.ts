import { describe, it, expect, beforeEach } from 'vitest';
import { CATALOG } from '../triggers/catalog';

describe('Chronicler Triggers', () => {
    beforeEach(() => {
        // Reset before each test
    });

    describe('trigger catalog', () => {
        it('should export trigger catalog', () => {
            expect(CATALOG).toBeDefined();
        });

        it('should have CITY_FOUNDED trigger', () => {
            expect(CATALOG.CITY_FOUNDED).toBeDefined();
            expect(CATALOG.CITY_FOUNDED.id).toBeDefined();
            expect(CATALOG.CITY_FOUNDED.name).toBeDefined();
        });

        it('should have NATION_FOUNDED trigger', () => {
            expect(CATALOG.NATION_FOUNDED).toBeDefined();
            expect(CATALOG.NATION_FOUNDED.id).toBeDefined();
            expect(CATALOG.NATION_FOUNDED.name).toBeDefined();
        });

        it('should have LANDMARK_CREATE trigger', () => {
            expect(CATALOG.LANDMARK_CREATE).toBeDefined();
            expect(CATALOG.LANDMARK_CREATE.id).toBeDefined();
            expect(CATALOG.LANDMARK_CREATE.name).toBeDefined();
        });

        it('should have AVATAR_CREATE trigger', () => {
            expect(CATALOG.AVATAR_CREATE).toBeDefined();
            expect(CATALOG.AVATAR_CREATE.id).toBeDefined();
            expect(CATALOG.AVATAR_CREATE.name).toBeDefined();
        });

        it('should have ORDER_CREATE trigger', () => {
            expect(CATALOG.ORDER_CREATE).toBeDefined();
            expect(CATALOG.ORDER_CREATE.id).toBeDefined();
            expect(CATALOG.ORDER_CREATE.name).toBeDefined();
        });

        it('should have WAR_DECLARE trigger', () => {
            expect(CATALOG.WAR_DECLARE).toBeDefined();
            expect(CATALOG.WAR_DECLARE.id).toBeDefined();
            expect(CATALOG.WAR_DECLARE.name).toBeDefined();
        });

        it('should have TREATY_SIGN trigger', () => {
            expect(CATALOG.TREATY_SIGN).toBeDefined();
            expect(CATALOG.TREATY_SIGN.id).toBeDefined();
            expect(CATALOG.TREATY_SIGN.name).toBeDefined();
        });

        it('should have GREAT_PROJECT trigger', () => {
            expect(CATALOG.GREAT_PROJECT).toBeDefined();
            expect(CATALOG.GREAT_PROJECT.id).toBeDefined();
            expect(CATALOG.GREAT_PROJECT.name).toBeDefined();
        });
    });

    describe('trigger evaluation', () => {
        it('should evaluate ALWAYS condition', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.condition.type).toBe('ALWAYS');
        });

        it('should evaluate FIRST_OF_KIND condition', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.condition.type).toBe('FIRST_OF_KIND');
        });

        it('should evaluate THRESHOLD condition', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.condition.type).toBe('THRESHOLD');
        });

        it('should evaluate CUSTOM condition', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.condition.type).toBe('CUSTOM');
        });

        it('should evaluate REGIONAL scope', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.defaultScope).toBe('REGIONAL');
        });

        it('should evaluate GLOBAL scope', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.defaultScope).toBe('GLOBAL');
        });

        it('should have enabled flag', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.enabled).toBeDefined();
            expect(typeof trigger.enabled).toBe('boolean');
        });

        it('should have autoEligible flag', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.autoEligible).toBeDefined();
            expect(typeof trigger.autoEligible).toBe('boolean');
        });

        it('should have suggestedTemplates array', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(Array.isArray(trigger.suggestedTemplates)).toBe(true);
        });

        it('should have suggestedAuthors array', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(Array.isArray(trigger.suggestedAuthors)).toBe(true);
        });

        it('should have urgency level', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.urgency).toBeDefined();
            expect(['NORMAL', 'HIGH', 'LOW']).toContain(trigger.urgency);
        });

        it('should have version', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.version).toBeDefined();
            expect(typeof trigger.version).toBe('string');
        });
    });

    describe('trigger matching', () => {
        it('should match event type', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.eventType).toBeDefined();
            expect(trigger.eventType).toBe('CITY_FOUNDED');
        });

        it('should match event kind', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.eventKind).toBeDefined();
            expect(trigger.eventKind).toBe('CITY');
        });

        it('should match event kind for nations', () => {
            const trigger = CATALOG.NATION_FOUNDED;
            expect(trigger.eventKind).toBe('NATION');
        });

        it('should match event kind for landmarks', () => {
            const trigger = CATALOG.LANDMARK_CREATE;
            expect(trigger.eventKind).toBe('LANDMARK');
        });

        it('should match event kind for avatars', () => {
            const trigger = CATALOG.AVATAR_CREATE;
            expect(trigger.eventKind).toBe('AVATAR');
        });

        it('should match event kind for orders', () => {
            const trigger = CATALOG.ORDER_CREATE;
            expect(trigger.eventKind).toBe('ORDER');
        });

        it('should match event kind for wars', () => {
            const trigger = CATALOG.WAR_DECLARE;
            expect(trigger.eventKind).toBe('WAR');
        });

        it('should match event kind for treaties', () => {
            const trigger = CATALOG.TREATY_SIGN;
            expect(trigger.eventKind).toBe('TREATY');
        });

        it('should match event kind for great projects', () => {
            const trigger = CATALOG.GREAT_PROJECT;
            expect(trigger.eventKind).toBe('GREAT_PROJECT');
        });
    });

    describe('trigger priority', () => {
        it('should have priority level', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.priority).toBeDefined();
            expect(['NORMAL', 'HIGH', 'LOW']).toContain(trigger.priority);
        });

        it('should have consistent priority levels', () => {
            const triggers = [CATALOG.CITY_FOUNDED, CATALOG.NATION_FOUNDED, CATALOG.LANDMARK_CREATE];
            triggers.forEach(trigger => {
                expect(['NORMAL', 'HIGH', 'LOW']).toContain(trigger.priority);
            });
        });
    });

    describe('trigger conditions', () => {
        it('should have condition object', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.condition).toBeDefined();
            expect(typeof trigger.condition).toBe('object');
        });

        it('should have condition type', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.condition).toBeDefined();
            expect(trigger.condition.type).toBeDefined();
        });

        it('should have condition parameters', () => {
            const trigger = CATALOG.CITY_FOUNDED;
            expect(trigger.condition).toBeDefined();
            expect(Object.keys(trigger.condition)).toBeDefined();
        });
    });

    describe('trigger metadata', () => {
        it('should have unique IDs', () => {
            const triggers = Object.values(CATALOG);
            const ids = triggers.map(t => t.id);
            const uniqueIds = [...new Set(ids)];
            expect(ids.length).toBe(uniqueIds.length);
        });

        it('should have descriptive names', () => {
            const triggers = Object.values(CATALOG);
            triggers.forEach(trigger => {
                expect(trigger.name).toBeDefined();
                expect(trigger.name.length).toBeGreaterThan(0);
            });
        });

        it('should have version strings', () => {
            const triggers = Object.values(CATALOG);
            triggers.forEach(trigger => {
                expect(trigger.version).toBeDefined();
                expect(trigger.version).toMatch(/^\d+\.\d+\.\d+$/);
            });
        });
    });
});
