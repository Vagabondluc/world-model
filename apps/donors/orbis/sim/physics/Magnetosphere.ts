
import { DomainId, MathPPM, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { mulPPM, clampPPM01 } from '../../core/math';
import { Registry } from '../../core/registry/ParameterRegistry';
import { MagnetosphereSchema } from './MagnetosphereParams';
import { MagnetosphereState } from '../../core/schemas/planetary';

/**
 * MagnetosphereDomain
 * Implements the planetary magnetic field stability and reversal simulation.
 * Follows spec ID: 02-magnetosphere.
 */
export class MagnetosphereDomain implements ISimDomain {
  public readonly id = DomainId.PLANET_PHYSICS;

  // State (Authoritative)
  private healthPPM: MathPPM = 1_000_000;
  private polarity: number = 1;
  private phasePPM: MathPPM = 0;
  private lastFlipTimeUs: AbsTime = 0n;

  // External Forcing (Sampled from other domains or global state)
  private coreHeat01: MathPPM = 1_000_000;
  private rotation01: MathPPM = 1_000_000;
  private tectonicHeatFlux01: MathPPM = 1_000_000;

  constructor() {
    Registry.registerDomain(MagnetosphereSchema);
  }

  public step(): void {
    // Fetch Parameters from Registry
    const kDynamo = Registry.get(this.id, 'kDynamo');
    const kDecay = Registry.get(this.id, 'kDecay');
    const kInstability = Registry.get(this.id, 'kInstability');
    const baseFlipRate = Registry.get(this.id, 'baseFlipRate');
    const flipChaos = Registry.get(this.id, 'flipChaos');

    // 1. Update Magnetosphere Health
    // dHealth = +kDynamo * coreHeat01 * rotation01 - kDecay - kInstability * (1 - tectonicHeatFlux01)
    const gain = mulPPM(kDynamo, mulPPM(this.coreHeat01, this.rotation01));
    const instability = mulPPM(kInstability, (1_000_000 - this.tectonicHeatFlux01));
    
    const delta = gain - kDecay - instability;
    this.healthPPM = clampPPM01(this.healthPPM + delta);

    // 2. Polarity Reversal Oscillator
    // flipRate = baseFlipRate * (1 + flipChaos * (1 - health01))
    const chaosFactor = mulPPM(flipChaos, (1_000_000 - this.healthPPM));
    const flipRate = mulPPM(baseFlipRate, (1_000_000 + chaosFactor));

    this.phasePPM += flipRate;
    if (this.phasePPM >= 1_000_000) {
      this.phasePPM %= 1_000_000;
      this.polarity *= -1;
      // In a real scheduler context, we would get the time from the step context
      // For now, we update it lazily or via regenerateTo
    }
  }

  public regenerateTo(tNowUs: AbsTime): void {
    // For v1, we perform a naive reset. 
    // v2 will use RNG to jump state deterministically.
    this.healthPPM = 1_000_000;
    this.phasePPM = 0;
    this.polarity = 1;
    this.lastFlipTimeUs = 0n;
  }

  // Accessors for derived views
  public getHealth(): number { return this.healthPPM / 1_000_000; }
  public getPolarity(): number { return this.polarity; }
  public getRadiationStress(): number {
    // stressFactor = 1 / sqrt(max(0.01, health01))
    // radiationStress01 = clamp01( baseStress * stressFactor )
    // We'll implement simplified version until sqrtPPM usage is refined for B-field scaling
    return clampPPM01(1_000_000 - this.healthPPM) / 1_000_000;
  }

  /**
   * Returns Zod-compliant state snapshot for UI stores
   */
  public getSchemaState(): MagnetosphereState {
    return {
      health01: this.healthPPM / 1_000_000,
      polarity: this.polarity === 1 ? 1 : -1,
      phase01: this.phasePPM / 1_000_000,
      lastFlipTimeMs: this.lastFlipTimeUs // Schema expects AbsTime
    };
  }
}
