import { LoreTrigger } from '../types';

export const CATALOG: LoreTrigger[] = [
    {
        id: "AGE_ADVANCE",
        name: "Age Transition",
        version: "1.0.0",
        eventType: "AGE_ADVANCE",
        condition: { type: "ALWAYS" },
        suggestedTemplates: ["age_transition_chronicle"],
        suggestedAuthors: ["THE_WORLD"],
        defaultScope: "GLOBAL",
        autoEligible: true,
        urgency: "HIGH",
        enabled: true
    },
    {
        id: "CITY_FOUNDED",
        name: "City Founded",
        version: "1.0.0",
        eventType: "WORLD_CREATE",
        eventKind: "SETTLEMENT", // Assuming event payload checks for City subtype or we refine this
        condition: {
            type: "FIRST_OF_KIND",
            kind: "SETTLEMENT",
            scope: "REGIONAL"
            // Note: Simplification for initial implementation. Real check might look at 'type' in payload
        },
        suggestedTemplates: ["city_founded_chronicle"],
        suggestedAuthors: ["IMPERIAL_SCRIBE"],
        defaultScope: "REGIONAL",
        autoEligible: true,
        urgency: "NORMAL",
        enabled: true
    }
];
