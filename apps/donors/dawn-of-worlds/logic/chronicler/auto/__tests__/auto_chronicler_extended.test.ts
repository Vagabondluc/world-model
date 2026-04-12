
import { describe, it, expect, vi } from 'vitest';
import { AutoChronicler } from '../generator';
import { ChronicleCandidate, LoreTemplate } from '../../types';
import { GameEvent } from '../../../../types';

// Mock Library
const MOCK_TEMPLATES: Record<string, LoreTemplate> = {
    'tpl_city': { id: 'tpl_city', text: 'City {{cityName}} found.', entryType: 'CHRONICLE', author: 'BOT' },
    'tpl_war': { id: 'tpl_war', text: 'War in {{regionName}}.', entryType: 'CHRONICLE' },
    'tpl_func': { id: 'tpl_func', text: 'Dynamic.', entryType: 'CHRONICLE', author: (ctx) => `Sage of ${ctx.ageName}` },
    'tpl_missing_vars': { id: 'tpl_missing_vars', text: '{{unknown}} var.', entryType: 'CHRONICLE' },
};

vi.mock('../../../templates/library', () => ({
    getTemplate: (id: string) => MOCK_TEMPLATES[id] || null
}));

// Simple mock engine
vi.mock('../../../templates/engine', () => ({
    resolveTemplateText: (template: any, context: any) => {
        let text = template.text;
        Object.keys(context).forEach(k => {
            text = text.replace(`{{${k}}}`, String(context[k]));
        });
        // cleanup unknowns
        text = text.replace(/{{.*?}}/g, '???');
        return { title: 'Auto Title', body: text };
    }
}));

describe('AutoChronicler Extended Coverage', () => {
    const baseEvent: GameEvent = {
        id: 'e1', type: 'TEST', ts: 100, playerId: 'p1', age: 3, round: 1, turn: 1, payload: {}
    };

    const baseCandidate: ChronicleCandidate = {
        id: 'c1', triggerType: 'TEST', sourceEventIds: ['e1'], suggestedTemplates: ['tpl_city'],
        autoEligible: true, urgency: 'LOW', scope: 'GLOBAL', age: 3, createdAtTurn: 1
    };

    // --- GROUP 1: Payload Variations (8 tests) ---
    it('1. City Payload (Explicit)', () => {
        const ev = { ...baseEvent, payload: { cityName: 'Metropolis' } };
        const entry = AutoChronicler.tryAutoChronicle(baseCandidate, ev)!;
        expect(entry.text).toBe('City Metropolis found.');
    });

    it('2. City Payload (Missing -> Fallback)', () => {
        const ev = { ...baseEvent, payload: {} }; // No cityName
        const entry = AutoChronicler.tryAutoChronicle(baseCandidate, ev)!;
        expect(entry.text).toBe('City Unamed Settlement found.');
    });

    it('3. Region Payload (Explicit)', () => {
        const ev = { ...baseEvent, payload: { regionName: 'Badlands' } };
        const cand = { ...baseCandidate, suggestedTemplates: ['tpl_war'] };
        const entry = AutoChronicler.tryAutoChronicle(cand, ev)!;
        expect(entry.text).toBe('War in Badlands.');
    });

    it('4. Region Payload (Missing -> Fallback)', () => {
        const ev = { ...baseEvent, payload: {} };
        const cand = { ...baseCandidate, suggestedTemplates: ['tpl_war'] };
        const entry = AutoChronicler.tryAutoChronicle(cand, ev)!;
        expect(entry.text).toBe('War in the Region.');
    });

    it('5. Race Payload fallback', () => {
        // Just checking context hygiene - assuming template used it
        const ev = { ...baseEvent, payload: {} };
        // We inspect internal logic by observing effect on a template requesting raceName?
        // Let's rely on valid property access in the code under test being safe.
        // It passes if no crash.
        AutoChronicler.tryAutoChronicle(baseCandidate, ev);
    });

    it('6. WorldId mapping (Found)', () => {
        const ev = { ...baseEvent, payload: { worldId: 'w123' } };
        const entry = AutoChronicler.tryAutoChronicle(baseCandidate, ev)!;
        expect(entry.relatedWorldIds).toEqual(['w123']);
    });

    it('7. WorldId mapping (Missing)', () => {
        const ev = { ...baseEvent, payload: {} };
        const entry = AutoChronicler.tryAutoChronicle(baseCandidate, ev)!;
        expect(entry.relatedWorldIds).toEqual([]);
    });

    it('8. Age Context Injection', () => {
        const ev = { ...baseEvent, age: 5 };
        const cand = { ...baseCandidate, suggestedTemplates: ['tpl_func'] };
        const entry = AutoChronicler.tryAutoChronicle(cand, ev)!;
        // Author function uses ctx.ageName
        expect(entry.author).toBe('Sage of Age 5');
    });

    // --- GROUP 2: Logic & Eligibility (7 tests) ---
    it('9. Non-eligible candidate Returns Null', () => {
        const cand = { ...baseCandidate, autoEligible: false };
        expect(AutoChronicler.tryAutoChronicle(cand, baseEvent)).toBeNull();
    });

    it('10. Undefined eligible (defaults falsey) Returns Null', () => { // if logic checks explicit truth
        const cand = { ...baseCandidate } as any;
        delete cand.autoEligible;
        expect(AutoChronicler.tryAutoChronicle(cand, baseEvent)).toBeNull();
    });

    it('11. Missing template ID', () => {
        const cand = { ...baseCandidate, suggestedTemplates: [] };
        expect(AutoChronicler.tryAutoChronicle(cand, baseEvent)).toBeNull();
    });

    it('12. Missing template in Library', () => {
        const cand = { ...baseCandidate, suggestedTemplates: ['non_existent'] };
        expect(AutoChronicler.tryAutoChronicle(cand, baseEvent)).toBeNull();
    });

    it('13. Author Fallback (String)', () => {
        const cand = { ...baseCandidate, suggestedTemplates: ['tpl_city'] };
        const entry = AutoChronicler.tryAutoChronicle(cand, baseEvent)!;
        expect(entry.author).toBe('BOT');
    });

    it('14. Author Fallback (Global Default)', () => {
        const cand = { ...baseCandidate, suggestedTemplates: ['tpl_war'] }; // tpl_war has no author
        const entry = AutoChronicler.tryAutoChronicle(cand, baseEvent)!;
        expect(entry.author).toBe('THE_WORLD'); // Default in generator.ts
    });

    it('15. Unknown Vars in Template replaced safely', () => {
        const cand = { ...baseCandidate, suggestedTemplates: ['tpl_missing_vars'] };
        const entry = AutoChronicler.tryAutoChronicle(cand, baseEvent)!;
        expect(entry.text).toBe('??? var.');
    });
});
