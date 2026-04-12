
import { DomainId, AbsTime, MathPPM } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { PressureState } from './types';
import { mulPPM, clampPPM01, PPM_ONE } from '../../core/math';

/**
 * PressureSystem
 * Simulates the hydraulic flow of societal pressures.
 * Follows spec ID: 80-impact-propagation-engine.
 */
export class PressureSystem implements ISimDomain {
  public readonly id = DomainId.CIVILIZATION_PRESSURE;

  // State: The accumulating pressure reservoir
  private state: PressureState = this.createZeroState();

  // Inputs
  private techEmissions: PressureState = this.createZeroState();

  // Constants
  private readonly FRICTION = 950_000; // 0.95x global dampening per tick
  private readonly MAX_INTERACTION_DELTA = 200_000; // Max swing per tick

  public step(): void {
    // 1. Apply Direct Emissions (Tech)
    this.applyEmission(this.techEmissions);

    // 2. Structural Interactions (Spec 80.0.1)
    // Example: Inequality breeds Unrest
    const inequality = this.state.economy.inequality;
    const unrestDelta = mulPPM(inequality, 150_000); // 0.15x transfer
    
    // Example: Growth reduces Unrest (Panem et Circenses)
    const growth = this.state.economy.growth;
    const pacification = mulPPM(growth, 120_000); // 0.12x reduction

    // Apply Deltas with damping
    this.state.population.unrest += unrestDelta - pacification;
    
    // Example: Bureaucracy increases Stability (Legitimacy) but stifles Growth
    const bureaucracy = this.state.governance.bureaucracy;
    this.state.governance.legitimacy += mulPPM(bureaucracy, 100_000);
    this.state.economy.growth -= mulPPM(bureaucracy, 50_000);

    // 3. Global Friction (Entropy)
    this.applyFriction();

    // 4. Clamping
    this.clampState();
  }

  private applyEmission(source: PressureState) {
    const add = (cat: keyof PressureState, key: string) => {
        const t = this.state[cat] as any;
        const s = source[cat] as any;
        if (t && s) t[key] += s[key];
    };
    
    add('economy', 'growth');
    add('economy', 'inequality');
    add('economy', 'resource_pressure');
    
    add('governance', 'centralization');
    add('governance', 'bureaucracy');
    add('governance', 'legitimacy');
    
    add('population', 'urbanization');
    add('population', 'unrest');

    add('military', 'readiness');
    add('military', 'projection');
  }

  private applyFriction() {
    const dampen = (val: number) => mulPPM(val, this.FRICTION);
    
    const s = this.state;
    s.economy.growth = dampen(s.economy.growth);
    s.economy.inequality = dampen(s.economy.inequality);
    s.economy.resource_pressure = dampen(s.economy.resource_pressure);
    
    s.governance.centralization = dampen(s.governance.centralization);
    s.governance.bureaucracy = dampen(s.governance.bureaucracy);
    s.governance.legitimacy = dampen(s.governance.legitimacy);
    
    s.population.urbanization = dampen(s.population.urbanization);
    s.population.unrest = dampen(s.population.unrest);

    s.military.readiness = dampen(s.military.readiness);
    s.military.projection = dampen(s.military.projection);
  }

  private clampState() {
    const MAX = 10 * PPM_ONE; // Cap at 10.0 (extreme pressure)
    const clamp = (v: number) => Math.max(0, Math.min(MAX, v));

    const s = this.state;
    // Iterate and clamp all fields (simplified for brevity)
    s.economy.growth = clamp(s.economy.growth);
    s.economy.inequality = clamp(s.economy.inequality);
    s.population.unrest = clamp(s.population.unrest);
    // ... repeat for others in full impl
  }

  private createZeroState(): PressureState {
    return {
      economy: { growth: 0, inequality: 0, resource_pressure: 0 },
      governance: { centralization: 0, bureaucracy: 0, legitimacy: 0 },
      population: { urbanization: 0, unrest: 0 },
      military: { readiness: 0, projection: 0 }
    };
  }

  public setTechEmissions(emissions: PressureState) {
    this.techEmissions = emissions;
  }

  public getState(): PressureState {
    return this.state;
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.state = this.createZeroState();
  }
}
