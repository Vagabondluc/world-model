
import { DomainId, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { TechDefinition, PressureState, ImpactAxisValue } from './types';
import { SimTracer } from '../history/EventTracer';

// Sample Tech Tree (V1)
const TECH_CATALOG: TechDefinition[] = [
  {
    id: 'AGRICULTURE',
    name: 'Agrarianism',
    cost: 100,
    impacts: {
      economy: { growth: 1, resource_pressure: 1 },
      population: { urbanization: 1 }
    },
    prereqs: []
  },
  {
    id: 'WRITING',
    name: 'Written Record',
    cost: 300,
    impacts: {
      governance: { bureaucracy: 2, centralization: 1 },
      economy: { growth: 1 }
    },
    prereqs: ['AGRICULTURE']
  },
  {
    id: 'METAL_WORKING',
    name: 'Metallurgy',
    cost: 600,
    impacts: {
      military: { readiness: 2, projection: 1 },
      economy: { inequality: 1 }
    },
    prereqs: ['AGRICULTURE']
  },
  {
    id: 'CURRENCY',
    name: 'Currency',
    cost: 1000,
    impacts: {
      economy: { growth: 2, inequality: 2 },
      governance: { centralization: 1 }
    },
    prereqs: ['WRITING', 'METAL_WORKING']
  }
];

// 1 Impact Unit = 50,000 PPM per tick emission (Spec 79.0.1)
const IMPACT_SCALAR = 50_000;

export class TechTreeDomain implements ISimDomain {
  public readonly id = DomainId.CIVILIZATION_TECH;

  private unlockedTechs: Set<string> = new Set();
  private researchProgress: number = 0;
  
  // Aggregate emissions from all active techs
  private currentEmissions: PressureState = this.createZeroState();

  public step(): void {
    // 1. Passive Research Growth
    this.researchProgress += 10; // Placeholder rate

    // 2. Check Unlocks
    for (const tech of TECH_CATALOG) {
      if (this.unlockedTechs.has(tech.id)) continue;
      
      const prereqsMet = tech.prereqs.every(p => this.unlockedTechs.has(p));
      if (prereqsMet && this.researchProgress >= tech.cost) {
        this.unlockTech(tech);
      }
    }
  }

  private unlockTech(tech: TechDefinition) {
    this.unlockedTechs.add(tech.id);
    this.recalculateEmissions();
    
    SimTracer.trace({
      time: 0n, // Context will fill
      domain: this.id,
      title: "Technological Breakthrough",
      message: `Society has mastered ${tech.name}. This will reshape social pressures.`,
      severity: 'info'
    });
  }

  private recalculateEmissions() {
    this.currentEmissions = this.createZeroState();
    
    for (const techId of this.unlockedTechs) {
      const tech = TECH_CATALOG.find(t => t.id === techId)!;
      this.applyImpacts(tech.impacts);
    }
  }

  private applyImpacts(impacts: Partial<Record<keyof PressureState, Partial<Record<string, ImpactAxisValue>>>>) {
    // Helper to safely add nested impacts
    const add = (category: keyof PressureState, field: string, val: number | undefined) => {
      if (!val) return;
      const target = this.currentEmissions[category] as any;
      if (target && typeof target[field] === 'number') {
        target[field] += val * IMPACT_SCALAR;
      }
    };

    if (impacts.economy) {
      add('economy', 'growth', impacts.economy.growth);
      add('economy', 'inequality', impacts.economy.inequality);
      add('economy', 'resource_pressure', impacts.economy.resource_pressure);
    }
    if (impacts.governance) {
      add('governance', 'centralization', impacts.governance.centralization);
      add('governance', 'bureaucracy', impacts.governance.bureaucracy);
      add('governance', 'legitimacy', impacts.governance.legitimacy);
    }
    if (impacts.population) {
      add('population', 'urbanization', impacts.population.urbanization);
      add('population', 'unrest', impacts.population.unrest);
    }
    if (impacts.military) {
        add('military', 'readiness', impacts.military.readiness);
        add('military', 'projection', impacts.military.projection);
    }
  }

  private createZeroState(): PressureState {
    return {
      economy: { growth: 0, inequality: 0, resource_pressure: 0 },
      governance: { centralization: 0, bureaucracy: 0, legitimacy: 0 },
      population: { urbanization: 0, unrest: 0 },
      military: { readiness: 0, projection: 0 }
    };
  }

  public getEmissions(): PressureState {
    return this.currentEmissions;
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.unlockedTechs.clear();
    this.researchProgress = 0;
    this.currentEmissions = this.createZeroState();
  }
}
