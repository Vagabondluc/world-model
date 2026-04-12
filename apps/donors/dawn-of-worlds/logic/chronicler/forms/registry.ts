import { ChroniclerForm, FormValues, FormValue, ValidationRule } from './types';

export class FormManager {
    private forms: Map<string, Omit<ChroniclerForm, 'candidateId' | 'values' | 'isDirty' | 'isValid'>> = new Map();

    // Register a static form template
    registerForm(formTemplate: Omit<ChroniclerForm, 'candidateId' | 'values' | 'isDirty' | 'isValid'>): void {
        this.forms.set(formTemplate.id, formTemplate);
    }

    getFormByTrigger(triggerType: string): Omit<ChroniclerForm, 'candidateId' | 'values' | 'isDirty' | 'isValid'> | undefined {
        return Array.from(this.forms.values()).find(f => f.triggerType === triggerType);
    }

    // Initialize a live form instance for a candidate
    initializeForm(triggerType: string, candidateId: string): ChroniclerForm | undefined {
        const template = this.getFormByTrigger(triggerType);
        if (!template) return undefined;

        const defaultValues = this.getDefaultValues(template);
        // Initially dirty is false
        return {
            ...template,
            candidateId,
            values: defaultValues,
            isDirty: false,
            isValid: this.validateForm(template, defaultValues)
        };
    }

    private getDefaultValues(form: Pick<ChroniclerForm, 'sections'>): FormValues {
        const values: FormValues = {};
        for (const section of form.sections) {
            for (const question of section.questions) {
                if (question.defaultValue !== undefined) {
                    values[question.id] = question.defaultValue;
                }
            }
        }
        return values;
    }

    updateValue(form: ChroniclerForm, questionId: string, value: FormValue): ChroniclerForm {
        const newValues = { ...form.values, [questionId]: value };
        const isValid = this.validateForm(form, newValues);

        return {
            ...form,
            values: newValues,
            isDirty: true,
            isValid
        };
    }

    validateForm(form: Pick<ChroniclerForm, 'sections'>, values: FormValues): boolean {
        for (const section of form.sections) {
            for (const question of section.questions) {
                const val = values[question.id];

                if (question.required) {
                    if (val === undefined || val === null || val === '') return false;
                    if (Array.isArray(val) && val.length === 0) return false;
                }

                if (question.validation && val !== undefined) {
                    for (const rule of question.validation) {
                        if (!this.validateRule(val, rule)) return false;
                    }
                }
            }
        }
        return true;
    }

    private validateRule(value: FormValue, rule: ValidationRule): boolean {
        switch (rule.type) {
            case "MIN_LENGTH":
                return typeof value === "string" && value.length >= (rule.value || 0);
            case "MAX_LENGTH":
                return typeof value === "string" && value.length <= (rule.value || 0);
            case "MIN_VALUE":
                return typeof value === "number" && value >= (rule.value || 0);
            case "MAX_VALUE":
                return typeof value === "number" && value <= (rule.value || 0);
            case "REQUIRED":
                return value !== undefined && value !== null && value !== "";
            default:
                return true;
        }
    }
}

export const formManager = new FormManager();

// Auto-register catalog
import { FORM_CATALOG } from './catalog';
FORM_CATALOG.forEach(form => formManager.registerForm(form));

