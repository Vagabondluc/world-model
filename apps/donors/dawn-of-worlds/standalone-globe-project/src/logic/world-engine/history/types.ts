
import { NameStyle } from "./WorldLinguist";
import { NarrativeOutput } from "./NarrativeGenerator";

export enum HistoryEventType {
    TECTONICS_FORMED = 'TECTONICS_FORMED',
    CONTINENT_BORN = 'CONTINENT_BORN',
    RIVER_CARVED = 'RIVER_CARVED',
    SETTLEMENT_FOUNDED = 'SETTLEMENT_FOUNDED',
    ERA_COMPLETE = 'ERA_COMPLETE'
}

export interface HistoryEvent {
    id: string; // UUID
    year: number;
    type: HistoryEventType;

    // Narrative
    narrative: NarrativeOutput;

    // Meta
    location?: [number, number, number];
    regionId?: string;
    cultureId?: NameStyle;
    importance: number; // 0.0 - 1.0
    causeId?: string;
}
