import { DomainId, MathPPM, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { mulPPM, clampPPM01, PPM_ONE } from '../../core/math';

/**
 * BiosphereCapacityDomain
 * Implements the life envelope model.
 * Follows spec ID: 05-biosphere-capacity.
 */
export class BiosphereCapacityDomain implements ISimDomain {
  public readonly id = DomainId.BIOSPHERE_CAPACITY;

  private capacityPPM: MathPPM = 0;
  private recoveryRate: MathPPM = 10_000; // 0.01 per 1k steps

  // Inputs
  private meanTempK: number = 288_150;
  private precipitation01: MathPPM = 500_000;
  private radiationStress01: MathPPM = 0;
  private atmosphereDensity01: MathPPM = 1_000_000;
  private oceanCoverage01: MathPPM = 700_000;

  public step(): void {
    // 1. Temperature Fitness
    // Optimal 288K +/- 20K
    const T = this.meanTempK / 1000;
    let tempFitness = Math.max(0, 1_000_000 - Math.floor(Math.abs(T - 288.15) * 1_000_000 / 40));
    if (T < 240 || T > 330) tempFitness = 0;

    // 2. Precipitation Fitness
    let precipFitness = this.precipitation01;
    if (precipFitness < 100_000) precipFitness = Math.floor(precipFitness * 0.5);

    // 3. Radiation Fitness
    let radiationFitness = 1_000_000 - this.radiationStress01;
    if (this.radiationStress01 > 800_000) radiationFitness = 0;

    // 4. Atmosphere Fitness
    let atmFitness = this.atmosphereDensity01;
    if (this.atmosphereDensity01 < 100_000) atmFitness = 0;

    // 5. Ocean Modifier
    const oceanBonus = Math.min(PPM_ONE, Math.floor(this.oceanCoverage01 * 0.5) + 500_000);

    // 6. Multiplicative Combine
    const targetCapacity = mulPPM(tempFitness, 
      mulPPM(precipFitness, 
        mulPPM(radiationFitness, 
          mulPPM(atmFitness, oceanBonus)
        )
      )
    );

    // 7. Time Evolution (dB/dt)
    const delta = mulPPM(targetCapacity - this.capacityPPM, this.recoveryRate);
    this.capacityPPM = clampPPM01(this.capacityPPM + delta);
  }

  public regenerateTo(tNowUs: AbsTime): void {
    // Run few steps to settle
    for (let i = 0; i < 100; i++) this.step();
  }

  public getCapacity(): number { return this.capacityPPM / 1_000_000; }

  public setInputs(tempK: number, precip: number, rad: number, atm: number, ocean: number) {
    this.meanTempK = Math.floor(tempK * 1000);
    this.precipitation01 = Math.floor(precip * 1_000_000);
    this.radiationStress01 = Math.floor(rad * 1_000_000);
    this.atmosphereDensity01 = Math.floor(atm * 1_000_000);
    this.oceanCoverage01 = Math.floor(ocean * 1_000_000);
  }
}
