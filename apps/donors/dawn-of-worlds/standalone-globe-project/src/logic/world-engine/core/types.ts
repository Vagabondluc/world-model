
import { BiomeType } from "../../globe/rendering/BiomeColors";

export interface WorldConfig {
    seed: string;
    radius: number;
    subdivisions: number;
    axialTilt: number; // in degrees
    plateCount: number; // 7-15 ideal
    noiseScale?: number;
    noiseOctaves?: number;
    cellCount?: number;
    playerCulture?: string;
    onHistoryEvent?: (event: HistoryEventPayload) => void;
}

export interface Cell {
    id: number;
    position: [number, number, number]; // x,y,z on unit sphere
    height: number; // -1 to 1 (0 = sea level)
    temperature: number; // Celsius
    moisture: number; // 0-1
    biomeId: BiomeType;
    // Hydrology
    flux?: number;
    isRiver?: boolean;
    settlementType?: 'VILLAGE' | 'CITY' | 'NONE';
    // Polygon type
    isPentagon?: boolean;
    // Civilization
    ownerId?: string;
}

export interface Region {
    id: string;
    center: [number, number, number];
    cells: number[];
    biome: BiomeType; // Dominant biome
    area: number;
    cultureId?: string;
    name?: string;
}

export interface HistoryEventPayload {
    type: string;
    data: any;
    regionId?: string;
    cultureId?: string;
}

export interface WorldState {
    config: WorldConfig;
    cells: Map<number, Cell>;
    plates: any[]; // To be defined
    regions: Region[];

    // Engine State
    era: number;
    isComplete: boolean;
}
