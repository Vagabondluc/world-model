
import { MathPPM } from '../../core/types';

// --- Spec 80: Pressure State Model ---
export interface PressureState {
  economy: {
    growth: MathPPM;
    inequality: MathPPM;
    resource_pressure: MathPPM;
  };
  governance: {
    centralization: MathPPM;
    bureaucracy: MathPPM;
    legitimacy: MathPPM;
  };
  population: {
    urbanization: MathPPM;
    unrest: MathPPM;
  };
  military: {
    readiness: MathPPM;
    projection: MathPPM;
  };
}

// --- Spec 79: Tech Impact ---
export type ImpactAxisValue = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export interface TechDefinition {
  id: string;
  name: string;
  cost: number;
  impacts: Partial<Record<keyof PressureState, Partial<Record<string, ImpactAxisValue>>>>;
  prereqs: string[];
}

// --- Spec 83: Factions ---
export type FactionType = 'ELITE' | 'POPULIST' | 'MILITARY' | 'RELIGIOUS' | 'ACADEMIC';

export interface Faction {
  id: string;
  name: string;
  type: FactionType;
  influencePPM: MathPPM; // 0..1,000,000
  radicalizationPPM: MathPPM; // 0..1,000,000
  demands: string[];
  formedTick: bigint;
}
