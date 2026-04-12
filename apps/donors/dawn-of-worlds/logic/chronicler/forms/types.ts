
export type QuestionType =
    | "RADIO"
    | "CHECKBOX"
    | "SELECT"
    | "TEXT"
    | "TEXTAREA"
    | "NUMBER"
    | "RANGE";

export type FormValue = string | number | boolean | string[] | number[];

export interface FormValues {
    [questionId: string]: FormValue;
}

export interface FormOption {
    value: FormValue;
    label: string;
    description?: string;
}

export interface ValidationRule {
    type: "MIN_LENGTH" | "MAX_LENGTH" | "MIN_VALUE" | "MAX_VALUE" | "REQUIRED";
    value?: number; // For length/value checks
}

export interface FormQuestion {
    id: string;
    type: QuestionType;
    label: string;
    description?: string;
    required: boolean;
    options?: FormOption[];
    defaultValue?: FormValue;
    validation?: ValidationRule[];
}

export interface FormSection {
    id: string;
    title: string;
    questions: FormQuestion[];
}

export type ActionType =
    | "SUBMIT"
    | "CANCEL"
    | "SAVE_DRAFT"
    | "AUTO_FILL"
    | "RESET";

export interface FormAction {
    id: string;
    type: ActionType;
    label: string;
    primary?: boolean;
    disabled?: boolean;
    // onClick handled by UI, not defined in pure data schema usually, but spec had it.
    // For serialization safety, we remove onClick from the schema and handle in UI maps.
}

export interface ChroniclerForm {
    id: string;
    version: string;
    triggerType: string;
    candidateId: string; // Bound to a specific candidate instance

    title: string;
    description: string;

    sections: FormSection[];
    actions: FormAction[];

    // State
    values: FormValues;
    isDirty: boolean;
    isValid: boolean;
}
