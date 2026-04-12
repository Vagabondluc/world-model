
import { describe, it, expect } from 'vitest';
import { FormManager } from '../registry';
import { ChroniclerForm, FormQuestion } from '../types';

describe('FormManager Extended Coverage', () => {
    const manager = new FormManager();

    // Helper to quick-register a form
    const register = (id: string, questions: FormQuestion[]) => {
        manager.registerForm({
            id,
            version: '1',
            triggerType: id.toUpperCase(),
            title: id,
            description: 'desc',
            sections: [{ id: 's1', title: 's1', questions }],
            actions: []
        });
    };

    // --- GROUP 1: Initialization & Defaults (5 tests) ---
    it('1. Initializes simple form', () => {
        register('simple', [{ id: 'q1', type: 'TEXT', label: 'L' }]);
        const form = manager.initializeForm('SIMPLE', 'c1');
        expect(form).toBeDefined();
    });

    it('2. Populates defaults string', () => {
        register('def_str', [{ id: 'q1', type: 'TEXT', label: 'L', defaultValue: 'foo' }]);
        const form = manager.initializeForm('DEF_STR', 'c1');
        expect(form?.values['q1']).toBe('foo');
    });

    it('3. Populates defaults number', () => {
        register('def_num', [{ id: 'q1', type: 'NUMBER', label: 'L', defaultValue: 42 }]);
        const form = manager.initializeForm('DEF_NUM', 'c1');
        expect(form?.values['q1']).toBe(42);
    });

    it('4. Populates defaults array (checkbox)', () => {
        register('def_arr', [{ id: 'q1', type: 'CHECKBOX', label: 'L', defaultValue: ['a', 'b'] }]);
        const form = manager.initializeForm('DEF_ARR', 'c1');
        expect(form?.values['q1']).toEqual(['a', 'b']);
    });

    it('5. Handles missing trigger type gracefully', () => {
        const form = manager.initializeForm('MISSING', 'c1');
        expect(form).toBeUndefined();
    });

    // --- GROUP 2: Required Field Validation (5 tests) ---
    it('6. Validates REQUIRED string (success)', () => {
        register('req_str', [{ id: 'q1', type: 'TEXT', label: 'L', required: true }]);
        const form = manager.initializeForm('REQ_STR', 'c1')!;
        const next = manager.updateValue(form, 'q1', 'valid');
        expect(next.isValid).toBe(true);
    });

    it('7. Validates REQUIRED string (fail empty)', () => {
        register('req_str_fail', [{ id: 'q1', type: 'TEXT', label: 'L', required: true }]);
        const form = manager.initializeForm('REQ_STR_FAIL', 'c1')!;
        const next = manager.updateValue(form, 'q1', '');
        expect(next.isValid).toBe(false);
    });

    it('8. Validates REQUIRED array (fail empty)', () => {
        register('req_arr_fail', [{ id: 'q1', type: 'CHECKBOX', label: 'L', required: true }]);
        const form = manager.initializeForm('REQ_ARR_FAIL', 'c1')!;
        const next = manager.updateValue(form, 'q1', []);
        expect(next.isValid).toBe(false);
    });

    it('9. Validates REQUIRED array (success)', () => {
        register('req_arr_ok', [{ id: 'q1', type: 'CHECKBOX', label: 'L', required: true }]);
        const form = manager.initializeForm('REQ_ARR_OK', 'c1')!;
        const next = manager.updateValue(form, 'q1', ['opt1']);
        expect(next.isValid).toBe(true);
    });

    it('10. Required defaults to valid if defaultValue present', () => {
        register('req_def', [{ id: 'q1', type: 'TEXT', label: 'L', required: true, defaultValue: 'ok' }]);
        const form = manager.initializeForm('REQ_DEF', 'c1')!;
        expect(form.isValid).toBe(true);
    });

    // --- GROUP 3: Numeric Constraints (5 tests) ---
    it('11. MIN_VALUE pass', () => {
        register('min_val', [{ id: 'q1', type: 'NUMBER', label: 'L', validation: [{ type: 'MIN_VALUE', value: 10 }] }]);
        const form = manager.initializeForm('MIN_VAL', 'c1')!;
        expect(manager.updateValue(form, 'q1', 10).isValid).toBe(true);
    });

    it('12. MIN_VALUE fail', () => {
        register('min_val_fail', [{ id: 'q1', type: 'NUMBER', label: 'L', validation: [{ type: 'MIN_VALUE', value: 10 }] }]);
        const form = manager.initializeForm('MIN_VAL_FAIL', 'c1')!;
        expect(manager.updateValue(form, 'q1', 9).isValid).toBe(false);
    });

    it('13. MAX_VALUE pass', () => {
        register('max_val', [{ id: 'q1', type: 'NUMBER', label: 'L', validation: [{ type: 'MAX_VALUE', value: 5 }] }]);
        const form = manager.initializeForm('MAX_VAL', 'c1')!;
        expect(manager.updateValue(form, 'q1', 5).isValid).toBe(true);
    });

    it('14. MAX_VALUE fail', () => {
        register('max_val_fail', [{ id: 'q1', type: 'NUMBER', label: 'L', validation: [{ type: 'MAX_VALUE', value: 5 }] }]);
        const form = manager.initializeForm('MAX_VAL_FAIL', 'c1')!;
        expect(manager.updateValue(form, 'q1', 6).isValid).toBe(false);
    });

    it('15. Range (Min & Max)', () => {
        register('range', [{ id: 'q1', type: 'NUMBER', label: 'L', validation: [{ type: 'MIN_VALUE', value: 1 }, { type: 'MAX_VALUE', value: 3 }] }]);
        const form = manager.initializeForm('RANGE', 'c1')!;
        expect(manager.updateValue(form, 'q1', 0).isValid).toBe(false);
        expect(manager.updateValue(form, 'q1', 2).isValid).toBe(true);
        expect(manager.updateValue(form, 'q1', 4).isValid).toBe(false);
    });

    // --- GROUP 4: String Constraints & State (5 tests) ---
    it('16. MIN_LENGTH string', () => {
        register('len_min', [{ id: 'q1', type: 'TEXT', label: 'L', validation: [{ type: 'MIN_LENGTH', value: 3 }] }]);
        const form = manager.initializeForm('LEN_MIN', 'c1')!;
        expect(manager.updateValue(form, 'q1', 'ab').isValid).toBe(false);
        expect(manager.updateValue(form, 'q1', 'abc').isValid).toBe(true);
    });

    it('17. MAX_LENGTH string', () => {
        register('len_max', [{ id: 'q1', type: 'TEXT', label: 'L', validation: [{ type: 'MAX_LENGTH', value: 3 }] }]);
        const form = manager.initializeForm('LEN_MAX', 'c1')!;
        expect(manager.updateValue(form, 'q1', 'abcd').isValid).toBe(false);
        expect(manager.updateValue(form, 'q1', 'abc').isValid).toBe(true);
    });

    it('18. isDirty flag updates', () => {
        register('dirty_check', [{ id: 'q1', type: 'TEXT', label: 'L' }]);
        const form = manager.initializeForm('DIRTY_CHECK', 'c1')!;
        expect(form.isDirty).toBe(false);
        const next = manager.updateValue(form, 'q1', 'change');
        expect(next.isDirty).toBe(true);
    });

    it('19. Immutability check', () => {
        register('immut', [{ id: 'q1', type: 'TEXT', label: 'L' }]);
        const form = manager.initializeForm('IMMUT', 'c1')!;
        const next = manager.updateValue(form, 'q1', 'change');
        expect(form).not.toBe(next);
        expect(form.values).not.toBe(next.values);
    });

    it('20. Multiple Section Validation', () => {
        manager.registerForm({
            id: 'multi', version: '1', triggerType: 'MULTI', title: '', description: '',
            sections: [
                { id: 's1', title: 's1', questions: [{ id: 'q1', type: 'TEXT', label: '', required: true }] },
                { id: 's2', title: 's2', questions: [{ id: 'q2', type: 'TEXT', label: '', required: true }] }
            ], actions: []
        });
        const form = manager.initializeForm('MULTI', 'c1')!;

        // Neither
        expect(form.isValid).toBe(false);

        // One
        const step1 = manager.updateValue(form, 'q1', 'ok');
        expect(step1.isValid).toBe(false);

        // Both
        const step2 = manager.updateValue(step1, 'q2', 'ok');
        expect(step2.isValid).toBe(true);
    });
});
