import { GameEvent, WorldObject } from '../../types';
import { ChronicleCandidate, LoreTrigger, TriggerCondition } from './types';
import { CATALOG } from './triggers/catalog';

// Helper to access state shapes
interface ChroniclerState {
    events: GameEvent[];
    worldCache: Map<string, WorldObject>;
}

export class Chronicler {
    private triggers: LoreTrigger[] = CATALOG;

    public processEvent(event: GameEvent, state: ChroniclerState): ChronicleCandidate[] {
        const candidates: ChronicleCandidate[] = [];

        for (const trigger of this.triggers) {
            if (!trigger.enabled) continue;
            if (trigger.eventType !== event.type) continue;

            // Fix: Check eventKind if specified in trigger
            if (trigger.eventKind) {
                // Only WORLD_CREATE and WORLD_MODIFY usually establish "kind" context clearly without deep queries
                if (event.type === 'WORLD_CREATE') {
                    // Safe cast because checked type
                    if ('kind' in event.payload && event.payload.kind !== trigger.eventKind) {
                        continue;
                    }
                } else {
                    // For non-create events, we might need to lookup the object in cache to check kind
                    // For now, we skip if strict kind matching is required but not easily available
                    // or implement lookup if targetId is standard.
                    continue;
                }
            }

            if (this.evaluateCondition(trigger.condition, event, state)) {
                candidates.push(this.createCandidate(trigger, event));
            }
        }

        return candidates;
    }

    private evaluateCondition(condition: TriggerCondition, event: GameEvent, state: ChroniclerState): boolean {
        switch (condition.type) {
            case 'ALWAYS':
                return true;
            case 'FIRST_OF_KIND':
                return this.evaluateFirstOfKind(condition, event, state);
            case 'THRESHOLD':
                return this.evaluateThreshold(condition, event, state);
            case 'CUSTOM':
                if (condition.safe) {
                    try {
                        return condition.evaluate(event, state);
                    } catch (e) {
                        console.error('Chronicler Trigger Failed', e);
                        return false;
                    }
                }
                return condition.evaluate(event, state);
            default:
                return false;
        }
    }

    private evaluateFirstOfKind(condition: Extract<TriggerCondition, { type: 'FIRST_OF_KIND' }>, event: GameEvent, state: ChroniclerState): boolean {
        // Must be a creation event to trigger "First of Kind"
        if (event.type !== 'WORLD_CREATE') return false;

        const targetKind = condition.kind;
        const targetId = event.payload.worldId;

        // Count EXISTING objects of this kind, EXCLUDING the one just created
        let count = 0;

        // Context for Regional Scope
        let targetRegionId: string | undefined;
        if (condition.scope === 'REGIONAL') {
            const subject = state.worldCache.get(targetId);
            targetRegionId = subject?.attrs?.regionId;
            // If we can't determine region, we can't validly check "First in Region", so fail safe or fallback to global?
            // For now, fail safe: if no region defined, cannot be first in it.
            if (!targetRegionId) return false;
        }

        for (const [id, obj] of state.worldCache) {
            if (id === targetId) continue; // Exclude self
            if (obj.kind !== targetKind) continue;

            // Scope Check
            if (condition.scope === 'REGIONAL') {
                if (obj.attrs?.regionId !== targetRegionId) continue;
            }

            // If we find ANY match, we are not the first
            return false;
        }

        return true;
    }

    private evaluateThreshold(condition: Extract<TriggerCondition, { type: 'THRESHOLD' }>, event: GameEvent, state: ChroniclerState): boolean {
        // Only count metrics supported for now
        if (condition.metric.startsWith('COUNT_')) {
            const kindToCount = condition.metric.replace('COUNT_', '');

            // Count current instances
            let currentCount = 0;
            for (const obj of state.worldCache.values()) {
                if (obj.kind === kindToCount) currentCount++;
            }

            // EDGE DETECTION
            // We only want to trigger EXACTLY when we cross the threshold
            // Because this runs AFTER the event is applied, 'currentCount' includes the new change.
            // So if condition is GTE 5, we trigger if currentCount === 5 (implying prev was 4).
            // If currentCount is 6, we already triggered.

            if (condition.operator === 'GTE') {
                return currentCount === condition.value;
            }
            if (condition.operator === 'EQ') {
                return currentCount === condition.value;
            }
            if (condition.operator === 'LTE') {
                return currentCount === condition.value;
            }
        }
        return false;
    }

    private createCandidate(trigger: LoreTrigger, event: GameEvent): ChronicleCandidate {
        return {
            id: `cc_${event.ts}_${trigger.id}`,
            triggerType: trigger.id,
            sourceEventIds: [event.id],
            age: event.age,
            scope: trigger.defaultScope,
            urgency: trigger.urgency,
            createdAtTurn: event.turn,
            suggestedTemplates: trigger.suggestedTemplates,
            suggestedAuthors: trigger.suggestedAuthors,
            autoEligible: trigger.autoEligible,
            status: 'PENDING'
        };
    }
}

export const chronicler = new Chronicler();
