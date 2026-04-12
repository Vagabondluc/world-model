
import { DomainId, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { TrunkId, TrophicLevel } from '../../core/species/types';
import { BestiarySystem } from './BestiarySystem';
import { PopulationDynamics } from './PopulationDynamics';
import { SimTracer } from '../history/EventTracer';
import { BiomeType } from '../../types';

/**
 * AdaptiveRadiation
 * Monitors ecological success (Niche Filling) and triggers Speciation events.
 * Follows spec ID: 15-adaptive-radiation.
 */
export class AdaptiveRadiation implements ISimDomain {
  public readonly id = DomainId.EVOLUTION_BRANCHING;

  // Dependencies
  private bestiary: BestiarySystem;
  private population: PopulationDynamics;

  // State
  private lastSpeciationTime: AbsTime = 0n;
  private nextSpeciationCheck: AbsTime = 0n;

  // Configuration
  private readonly SPECIATION_INTERVAL_US = 50n * 365n * 24n * 3600n * 1_000_000n; // ~50 years

  constructor(bestiary: BestiarySystem, pop: PopulationDynamics) {
    this.bestiary = bestiary;
    this.population = pop;
  }

  public step(): void {
    // This domain runs on a slow tick (EVOLUTION_BRANCHING), managed by Scheduler.
    // However, we double check interval logic here if needed.
    
    // 1. Identify Thriving Trunks
    // A trunk is thriving if it has > 20% of Carrying Capacity (density > 200,000 PPM)
    const populations = this.population.getPopulations();
    
    for (const pop of populations) {
        if (pop.densityPPM > 200_000) {
            this.attemptSpeciation(pop.id, pop.trophicLevel);
        }
    }
  }

  private attemptSpeciation(trunk: TrunkId, level: TrophicLevel) {
    // Simple V1 Logic:
    // If this trunk exists, and we haven't flooded the bestiary, create a new variant.
    // In a real system, we'd check "Niche Gap". Here we simulate it by probability.
    
    const rng = Math.random(); // Deterministic RNG should be injected, using Math for prototype simplicity
    if (rng > 0.1) return; // 10% chance per check per thriving trunk

    // Pick a random biome context (Placeholder: ideally we know WHERE it is thriving)
    const biomes = [BiomeType.GRASSLAND, BiomeType.TROPICAL_RAIN_FOREST, BiomeType.TEMPERATE_DECIDUOUS_FOREST, BiomeType.OCEAN];
    const biome = biomes[Math.floor(Math.random() * biomes.length)];

    const tNow = BigInt(Date.now()); // Placeholder for sim time
    
    const newSpecies = this.bestiary.createFromTrunk(trunk, biome, level, tNow, Math.random() * 10000);

    SimTracer.trace({
        time: tNow, // In real integration, pass scheduler time
        domain: this.id,
        title: "New Species Discovered",
        message: `Adaptive radiation in the ${trunk} lineage has produced a new species: ${newSpecies.name} (${newSpecies.preferredBiome}).`,
        severity: 'info'
    });
  }

  public regenerateTo(tNowUs: AbsTime): void {
    // Reset internal timers
    this.lastSpeciationTime = tNowUs;
  }
}
