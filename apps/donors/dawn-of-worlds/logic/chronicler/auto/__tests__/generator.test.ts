
import { describe, it, expect, vi } from 'vitest';
import { AutoChronicler } from '../generator';
import { ChronicleCandidate } from '../../types';
import { GameEvent } from '../../../../types';

// Mock dependencies
vi.mock('../../../templates/library', () => ({
    getTemplate: (id: string) => {
        if (id === 'test_template') {
            return {
                id: 'test_template',
                text: 'A test entry about {{cityName}}.',
                entryType: 'CHRONICLE',
                author: 'TEST_AUTHOR'
            };
        }
        return null;
    }
}));

vi.mock('../../../templates/engine', () => ({
    resolveTemplateText: (template: any, context: any) => ({
        title: 'Test Title',
        body: `A test entry about ${context.cityName}.`
    })
}));

describe('AutoChronicler', () => {
    const mockEvent: GameEvent = {
        id: 'evt_1',
        type: 'CITY_FOUNDED',
        ts: 100,
        playerId: 'p1',
        age: 2,
        round: 1,
        turn: 1,
        payload: {
            worldId: 'w1',
            cityName: 'Atlantis'
        }
    };

    const mockCandidate: ChronicleCandidate = {
        id: 'cand_1',
        triggerType: 'CITY_FOUNDED',
        sourceEventIds: ['evt_1'],
        suggestedTemplates: ['test_template'],
        autoEligible: true,
        urgency: 'MEDIUM',
        scope: 'REGIONAL',
        age: 2,
        createdAtTurn: 1
    };

    it('successfully generates an entry for eligible candidate', () => {
        const entry = AutoChronicler.tryAutoChronicle(mockCandidate, mockEvent);

        expect(entry).toBeDefined();
        expect(entry?.title).toBe('Test Title');
        expect(entry?.text).toBe('A test entry about Atlantis.');
        expect(entry?.author).toBe('TEST_AUTHOR');
        expect(entry?.relatedWorldIds).toContain('w1');
    });

    it('returns null if candidate is not autoEligible', () => {
        const notEligible = { ...mockCandidate, autoEligible: false };
        const entry = AutoChronicler.tryAutoChronicle(notEligible, mockEvent);
        expect(entry).toBeNull();
    });

    it('returns null if template not found', () => {
        const noTemplate = { ...mockCandidate, suggestedTemplates: ['unknown'] };
        const entry = AutoChronicler.tryAutoChronicle(noTemplate, mockEvent);
        expect(entry).toBeNull();
    });

    it('uses default fallbacks when payload is missing data', () => {
        const emptyEvent = { ...mockEvent, payload: {} }; // Missing cityName
        const entry = AutoChronicler.tryAutoChronicle(mockCandidate, emptyEvent);

        expect(entry).toBeDefined();
        expect(entry?.text).toBe('A test entry about Unamed Settlement.'); // Matches fallback in generator.ts
    });
});
