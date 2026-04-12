import { ChroniclerForm } from './types';

// We omit 'candidateId', 'values', 'isDirty', 'isValid' for the template definition
type FormTemplate = Omit<ChroniclerForm, 'candidateId' | 'values' | 'isDirty' | 'isValid'>;

export const AGE_TRANSITION_FORM: FormTemplate = {
    id: "age_transition_form",
    version: "1.0.0",
    triggerType: "AGE_ADVANCE",
    title: "THE PASSING OF AN AGE",
    description: "How will this Age be remembered?",
    sections: [
        {
            id: "definition",
            title: "What defined this Age most?",
            questions: [
                {
                    id: "age_definition",
                    type: "RADIO",
                    label: "Primary characteristic",
                    required: true,
                    defaultValue: "creation",
                    options: [
                        { value: "creation", label: "Creation" },
                        { value: "conflict", label: "Conflict" },
                        { value: "expansion", label: "Expansion" },
                        { value: "decline", label: "Decline" },
                        { value: "transformation", label: "Transformation" }
                    ]
                }
            ]
        },
        {
            id: "memory",
            title: "How is it remembered?",
            questions: [
                {
                    id: "age_memory",
                    type: "RADIO",
                    label: "Emotional tone",
                    required: true,
                    defaultValue: "reverence",
                    options: [
                        { value: "reverence", label: "With reverence" },
                        { value: "regret", label: "With regret" },
                        { value: "awe", label: "With awe" },
                        { value: "dread", label: "With dread" }
                    ]
                }
            ]
        }
    ],
    actions: [
        { id: "submit", type: "SUBMIT", label: "Write Chronicle", primary: true },
        { id: "auto_fill", type: "AUTO_FILL", label: "Auto-Fill Defaults" },
        { id: "cancel", type: "CANCEL", label: "Cancel" }
    ]
};

export const SETTLEMENT_FOUNDING_FORM: FormTemplate = {
    id: "settlement_founding_form",
    version: "1.0.0",
    triggerType: "CITY_FOUNDED", // Matches trigger id in catalog
    title: "THE FOUNDING",
    description: "Why was this place settled?",
    sections: [
        {
            id: "motive",
            title: "Why was this place settled?",
            questions: [
                {
                    id: "settlement_motive",
                    type: "RADIO",
                    label: "Primary reason",
                    required: true,
                    defaultValue: "shelter",
                    options: [
                        { value: "shelter", label: "Shelter" },
                        { value: "trade", label: "Trade" },
                        { value: "defense", label: "Defense" },
                        { value: "faith", label: "Faith" }
                    ]
                }
            ]
        },
        {
            id: "character",
            title: "What defines it?",
            questions: [
                {
                    id: "settlement_character",
                    type: "CHECKBOX",
                    label: "Characteristics",
                    required: true,
                    defaultValue: ["stone", "markets"],
                    options: [
                        { value: "stone", label: "Stone" },
                        { value: "markets", label: "Markets" },
                        { value: "walls", label: "Walls" },
                        { value: "learning", label: "Learning" }
                    ]
                }
            ]
        }
    ],
    actions: [
        { id: "submit", type: "SUBMIT", label: "Write Chronicle", primary: true },
        { id: "auto_fill", type: "AUTO_FILL", label: "Auto-Fill Defaults" },
        { id: "cancel", type: "CANCEL", label: "Cancel" }
    ]
};

export const FORM_CATALOG = [
    AGE_TRANSITION_FORM,
    SETTLEMENT_FOUNDING_FORM
    // Add others as we add their triggers to the main catalog
];
