import { SemanticTag, TagFamily } from '../types';

/**
 * Factory for creating concrete Tags from templates.
 */
export const TagFactory = {
    create(templateId: keyof typeof TAG_TEMPLATES, sourceId: string, intensity: number = 0.5): SemanticTag {
        const template = TAG_TEMPLATES[templateId];
        return {
            id: `${templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            family: template.family,
            source: sourceId,
            intensity: Math.min(1.0, Math.max(0.0, intensity)),
            urgency: template.baseUrgency,
            satisfaction: { ...template.satisfaction },
            accumulatedValue: 0,
            accumulatedLoss: 0,
            createdAtTurn: 0 // Should be injected by context
        };
    }
};

interface TagTemplate {
    family: TagFamily;
    baseUrgency: number;
    satisfaction: SemanticTag['satisfaction'];
}

export const TAG_TEMPLATES: Record<string, TagTemplate> = {
    // --- GRUDGE (Harm Imbalance) ---
    VENGEFUL: {
        family: "GRUDGE",
        baseUrgency: 0.8, // High urgency, decays slowly
        satisfaction: { type: "THRESHOLD", metric: "damage_inflicted", requirement: 100 }
    },
    WRONGED: {
        family: "GRUDGE",
        baseUrgency: 0.4, // Lower urgency, simpler to satisfy
        satisfaction: { type: "THRESHOLD", metric: "reparations_gold", requirement: 50 }
    },

    // --- FEAR (Risk Imbalance) ---
    THREATENED: {
        family: "FEAR",
        baseUrgency: 0.9, // Very high, survival mode
        satisfaction: { type: "THRESHOLD", metric: "defense_rating", requirement: 200 }
    },
    ENCIRCLED: {
        family: "FEAR",
        baseUrgency: 0.6,
        satisfaction: { type: "THRESHOLD", metric: "alliances_formed", requirement: 1 }
    },

    // --- SHAME (Status Imbalance) ---
    HUMILIATED: {
        family: "SHAME",
        baseUrgency: 0.5,
        satisfaction: { type: "SYMBOLIC", metric: "public_victory", requirement: 1 }
    },
    UNRECOGNIZED: {
        family: "SHAME",
        baseUrgency: 0.2,
        satisfaction: { type: "THRESHOLD", metric: "culture_output", requirement: 500 }
    },

    // --- AMBITION (Potential Imbalance) ---
    EXPANSIONIST: {
        family: "AMBITION",
        baseUrgency: 0.3, // Low urgency, long term
        satisfaction: { type: "THRESHOLD", metric: "cities_founded", requirement: 3 }
    },
    SCIENTIFIC: {
        family: "AMBITION",
        baseUrgency: 0.3,
        satisfaction: { type: "THRESHOLD", metric: "tech_researched", requirement: 5 }
    }
};
