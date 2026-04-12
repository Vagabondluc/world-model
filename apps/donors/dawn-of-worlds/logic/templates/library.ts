import { LoreTemplate } from '../chronicler/types';
import { CATALOG } from '../chronicler/triggers/catalog';

// Helper to find trigger definition
const getTrigger = (id: string) => CATALOG.find(t => t.id === id)!;

export const TEMPLATE_LIBRARY: LoreTemplate[] = [
    // --- Age Transition ---
    {
        id: "age_transition_chronicle",
        version: "1.0.0",
        trigger: getTrigger("AGE_ADVANCE"),
        entryType: "CHRONICLE",
        scope: "GLOBAL",
        title: "The Dawning of the {{ageName}} Age",
        text: "The world shifts. As the {{prevAgeName}} Age fades into memory, a new era begins. It is the {{ageName}} Age, a time of new rules and new powers.",
        author: "THE_WORLD",
        requiredContext: ["ageName", "prevAgeName"],
        optionalContext: [],
    },

    // --- City Founding ---
    {
        id: "city_founded_chronicle",
        version: "1.0.0",
        trigger: getTrigger("CITY_FOUNDED"),
        entryType: "CHRONICLE",
        scope: "REGIONAL",
        title: "The Founding of {{cityName}}",
        text: "In the region of {{regionName}}, the {{raceName}} people have laid the first stone of {{cityName}}. It stands as a beacon of civilization in the {{terrainName}}.",
        author: "IMPERIAL_SCRIBE",
        requiredContext: ["cityName", "raceName", "regionName", "terrainName"],
        optionalContext: [],
    }
];

export const getTemplate = (id: string) => TEMPLATE_LIBRARY.find(t => t.id === id);
