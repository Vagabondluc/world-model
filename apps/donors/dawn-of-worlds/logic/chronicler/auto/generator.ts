
import { JournalEntry, ChronicleCandidate } from '../types';
import { resolveTemplateText } from '../../templates/engine';
import { getTemplate } from '../../templates/library';
import { GameEvent } from '../../../types';

export class AutoChronicler {
    /**
     * Attempts to auto-resolve a candidate into a Journal Entry.
     * Returns the entry if successful, or null if it requires manual intervention
     * or fails to resolve.
     */
    static tryAutoChronicle(candidate: ChronicleCandidate, event: GameEvent): JournalEntry | null {
        // 1. Check eligibility
        if (!candidate.autoEligible) return null;

        // 2. Select Template (Deterministic fallback: first one)
        const templateId = candidate.suggestedTemplates[0];
        if (!templateId) return null;

        const template = getTemplate(templateId);
        if (!template) return null;

        // 3. Build Context (Best Effort)
        // Auto-Chronicler relies purely on the Event Payload + Defaults
        // It cannot ask the user for "Tone" or "Reason", so it must pick defaults or randomized values.
        // For V1, we use pure event payload.
        const payload = event.payload as any;
        const context: any = {
            ...payload,
            // Generic helpers suitable for auto-generated text
            ageName: `Age ${event.age}`,
            prevAgeName: `Age ${event.age - 1}`,

            // Heuristic fallbacks for missing data in raw payload
            // In a real system, we'd query the world state here using World ID
            raceName: payload.raceName || "Unknown Race",
            cityName: payload.cityName || "Unamed Settlement",
            regionName: payload.regionName || "the Region",
            terrainName: payload.terrainName || "the Wilds"
        };

        // TODO: randomness injection for "Tone" if template supports {{tone}}
        // context.tone = pickRandom(['stoic', 'hopeful', 'grim']);

        // 4. Resolve Text
        const { title, body } = resolveTemplateText(template, context);

        const author = typeof template.author === 'function' ? template.author(context) : (template.author || 'THE_WORLD');

        // 5. Create Entry
        return {
            id: `je_auto_${candidate.id}`,
            title: title,
            text: body,
            type: template.entryType,
            scope: candidate.scope,
            age: candidate.age,
            relatedWorldIds: payload.worldId ? [payload.worldId] : [],
            triggeredByEventIds: candidate.sourceEventIds,
            author: author,
            timestamp: Date.now()
        };
    }
}
