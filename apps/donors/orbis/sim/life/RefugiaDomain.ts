
import { DomainId, MathPPM, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { mulPPM, clampPPM01, PPM_ONE } from '../../core/math';

/**
 * RefugiaDomain
 * Identifies "Refugia" - pockets of habitability that persist during global crises 
 * (Ice Ages, Radiation Storms). These serve as reservoirs for recolonization.
 * Follows spec ID: 51-refugia-colonization-solver-contract.
 */
export class RefugiaDomain implements ISimDomain {
  public readonly id = DomainId.REFUGIA_COLONIZATION;

  // State
  private globalRefugiaScore: MathPPM = 0; // 0..1 Aggregate habitability stability

  // Inputs
  private meanTempK: number = 288.15;
  private radStress01: MathPPM = 0;
  private biosphereCapacity: MathPPM = 0;

  public step(): void {
    // 1. Calculate Environmental Stability
    // Ideally this evaluates spatial variance. For the global simulation (v1), 
    // we approximate based on how close conditions are to "optimal" vs "critical".
    
    // Temp Stability: Penalize extremes (< 250K or > 320K)
    const tempDev = Math.abs(this.meanTempK - 288.15);
    const tempScore = Math.max(0, PPM_ONE - Math.floor((tempDev / 40) * PPM_ONE));

    // Radiation Shielding
    const radScore = PPM_ONE - this.radStress01;

    // Capacity floor (must support *some* life)
    const capScore = Math.min(PPM_ONE, this.biosphereCapacity * 2); 

    // Refugia Score is the bottleneck of these factors
    // If any single factor is critical, refugia are scarce.
    this.globalRefugiaScore = mulPPM(tempScore, mulPPM(radScore, capScore));
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.step();
  }

  public setInputs(tempK: number, radStress: number, bioCap: number) {
    this.meanTempK = tempK;
    this.radStress01 = Math.floor(radStress * PPM_ONE);
    this.biosphereCapacity = Math.floor(bioCap * PPM_ONE);
  }

  /**
   * Returns a 0-1 score indicating how robust the planet's safe harbors are.
   * Low score = Mass Extinction risk.
   */
  public getRefugiaScore(): number {
    return this.globalRefugiaScore / PPM_ONE;
  }
}
