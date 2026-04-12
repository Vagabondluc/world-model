
import { DomainId, MathPPM, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { mulPPM, clampPPM01, PPM_ONE } from '../../core/math';
import { TrunkId, TrophicLevel } from '../../core/species/types';

interface TrunkPopulation {
  id: TrunkId;
  densityPPM: MathPPM; // % of Carrying Capacity
  trophicLevel: TrophicLevel;
}

/**
 * PopulationDynamics
 * Simulates density changes of major lineage trunks based on energy availability 
 * and predator-prey interactions.
 * Follows spec ID: 52-population-dynamics-predator-prey-stability.
 */
export class PopulationDynamics implements ISimDomain {
  public readonly id = DomainId.POP_DYNAMICS;

  // State: Populations of active trunks
  private populations = new Map<TrunkId, TrunkPopulation>();

  // Inputs
  private activeTrunks: TrunkId[] = [];
  private energyAtLevel: number[] = [0, 0, 0, 0, 0]; // From TrophicSystem
  private refugiaScore: number = 1.0;

  // Constants
  private readonly GROWTH_RATE = 50_000; // 0.05 per tick
  private readonly MORTALITY_RATE = 10_000; // 0.01 per tick
  private readonly PREDATION_PRESSURE = 20_000; // 0.02 per tick

  public step(): void {
    // 1. Sync Active Trunks
    this.syncTrunks();

    // 2. Update Density per Trunk
    for (const [id, pop] of this.populations) {
      const level = pop.trophicLevel;
      
      // A. Energy Constraint (Carrying Capacity K)
      // The TrophicSystem gives us raw energy. 
      // If Energy is high, K is high. If Energy is 0, K is 0.
      const energyPPM = Math.floor(this.energyAtLevel[level] * PPM_ONE);
      
      // Logistic Growth: dN = r * N * (1 - N/K)
      // Simplified: If N < Energy, grow. If N > Energy, starve.
      
      let delta = 0;
      
      if (pop.densityPPM < energyPPM) {
        // Growth Phase
        // Growth scales with Refugia (harder to grow in bad times)
        const growth = mulPPM(this.GROWTH_RATE, Math.floor(this.refugiaScore * PPM_ONE));
        delta = mulPPM(pop.densityPPM, growth);
        // Add a base trickle to prevent total 0 lock (colonization)
        if (pop.densityPPM < 1000) delta += 1000; 
      } else {
        // Starvation Phase (Overpopulation)
        const starvation = mulPPM(pop.densityPPM, this.MORTALITY_RATE * 5);
        delta = -starvation;
      }

      // B. Predation Logic (Top-Down Control)
      // If this is a Producer, and there are PrimaryConsumers, reduce density.
      if (level === TrophicLevel.Producer) {
        const herbivores = this.getAggregateDensityAt(TrophicLevel.PrimaryConsumer);
        if (herbivores > 0) {
           const eaten = mulPPM(herbivores, this.PREDATION_PRESSURE);
           delta -= eaten;
        }
      } else if (level === TrophicLevel.PrimaryConsumer) {
        const carnivores = this.getAggregateDensityAt(TrophicLevel.SecondaryConsumer);
        if (carnivores > 0) {
            const eaten = mulPPM(carnivores, this.PREDATION_PRESSURE);
            delta -= eaten;
        }
      }

      // Apply
      pop.densityPPM = clampPPM01(pop.densityPPM + delta);
    }
  }

  private syncTrunks() {
    // Ensure all active trunks have a population entry
    for (const trunk of this.activeTrunks) {
      if (!this.populations.has(trunk)) {
        this.populations.set(trunk, {
          id: trunk,
          densityPPM: 1000, // Start small (0.1%)
          trophicLevel: this.mapTrunkToLevel(trunk)
        });
      }
    }
    
    // Remove inactive
    for (const id of this.populations.keys()) {
        if (!this.activeTrunks.includes(id)) {
            this.populations.delete(id);
        }
    }
  }

  private mapTrunkToLevel(trunk: TrunkId): TrophicLevel {
    switch (trunk) {
      case TrunkId.Eukarya_Archaeplastida: return TrophicLevel.Producer;
      case TrunkId.Eukarya_Opisthokonta: return TrophicLevel.PrimaryConsumer; // Broad simplification
      case TrunkId.Bacteria: return TrophicLevel.Decomposer;
      default: return TrophicLevel.PrimaryConsumer; 
    }
  }

  private getAggregateDensityAt(level: TrophicLevel): MathPPM {
    let sum = 0;
    for (const pop of this.populations.values()) {
        if (pop.trophicLevel === level) sum += pop.densityPPM;
    }
    return sum;
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.populations.clear();
  }

  public setInputs(trunks: TrunkId[], energyLevels: number[], refugia: number) {
    this.activeTrunks = trunks;
    this.energyAtLevel = energyLevels;
    this.refugiaScore = refugia;
  }

  public getPopulations(): TrunkPopulation[] {
    return Array.from(this.populations.values());
  }
}
