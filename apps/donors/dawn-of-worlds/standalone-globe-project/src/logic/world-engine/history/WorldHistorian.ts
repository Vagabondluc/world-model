import { NameStyle } from './WorldLinguist';
import { NarrativeGenerator, NarrativeOutput } from './NarrativeGenerator';
import { HistoryEventType } from './types';
import type { HistoryEvent } from './types';

// Re-export for compatibility with other files (like App.tsx)
export { HistoryEventType };
export type { HistoryEvent };

export class WorldHistorian {
    private history: HistoryEvent[] = [];
    private generator: NarrativeGenerator;

    constructor() {
        this.generator = new NarrativeGenerator();
    }

    public getHistory(): HistoryEvent[] {
        return this.history;
    }

    public getMythicHistory(minImportance: number = 0.7): HistoryEvent[] {
        return this.history.filter(e => e.importance >= minImportance);
    }

    public log(type: HistoryEventType, era: number, data: any, regionId?: string, cultureId: NameStyle = NameStyle.English): void {
        const narrative = this.generator.generate(type, data, cultureId);

        // Determine importance based on type or data
        let importance = 0.5;
        if (type === HistoryEventType.TECTONICS_FORMED) importance = 1.0;
        if (type === HistoryEventType.SETTLEMENT_FOUNDED && data.type === 'CITY') importance = 0.8;
        if (type === HistoryEventType.ERA_COMPLETE) importance = 1.0;

        const event: HistoryEvent = {
            id: crypto.randomUUID(),
            year: era * 1000,
            type,
            narrative,
            location: data.location,
            regionId,
            cultureId,
            importance,
            causeId: data.causeId
        };

        this.history.push(event);
        console.log(`[HISTORY] ${narrative.scientific}`);
    }
    public clear(): void {
        this.history = [];
    }
}
