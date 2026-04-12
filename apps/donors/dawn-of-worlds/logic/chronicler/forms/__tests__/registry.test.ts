import { describe, it, expect } from 'vitest';
import { FormManager } from '../registry';
import { ChroniclerForm } from '../types';

describe('FormManager', () => {
    const manager = new FormManager();

    const TEST_FORM = {
        id: 'test_form',
        version: '1.0.0',
        triggerType: 'TEST_TRIGGER',
        title: 'Test',
        description: 'Test',
        sections: [
            {
                id: 'sec1',
                title: 'Section 1',
                questions: [
                    {
                        id: 'q1',
                        type: 'TEXT' as const,
                        label: 'Question 1',
                        required: true,
                        defaultValue: 'default'
                    },
                    {
                        id: 'q2',
                        type: 'NUMBER' as const,
                        label: 'Question 2',
                        required: false,
                        validation: [{ type: 'MIN_VALUE' as const, value: 10 }]
                    }
                ]
            }
        ],
        actions: []
    };

    manager.registerForm(TEST_FORM);

    it('initializes form with defaults', () => {
        const form = manager.initializeForm('TEST_TRIGGER', 'cand_1');
        expect(form).toBeDefined();
        expect(form?.values['q1']).toBe('default');
        expect(form?.isValid).toBe(true);
        expect(form?.candidateId).toBe('cand_1');
    });

    it('validates required fields', () => {
        const form = manager.initializeForm('TEST_TRIGGER', 'cand_1')!;
        // Clearing required field
        const updated = manager.updateValue(form, 'q1', '');
        expect(updated.isValid).toBe(false);
    });

    it('validates rules (MIN_VALUE)', () => {
        const form = manager.initializeForm('TEST_TRIGGER', 'cand_1')!;

        // Invalid value
        const invalid = manager.updateValue(form, 'q2', 5);
        expect(invalid.isValid).toBe(false); // < 10

        // Valid value
        const valid = manager.updateValue(form, 'q2', 15);
        expect(valid.isValid).toBe(true);
    });

    it('returns undefined for unknown trigger', () => {
        const form = manager.initializeForm('UNKNOWN', 'c1');
        expect(form).toBeUndefined();
    });
});
