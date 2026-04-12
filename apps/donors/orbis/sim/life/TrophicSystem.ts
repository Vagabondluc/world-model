
import { DomainId, MathPPM, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { mulPPM, clampPPM01, PPM_ONE } from '../../core/math';
import { TrophicLevel } from '../../core/species/types';

/**
 * TrophicEnergyDomain
 * Manages the flow of energy from GPP (Gross Primary Productivity) through the food web.
 * Follows spec ID: 12-trophic-energy.
 */
export class TrophicEnergyDomain implements ISimDomain {
  public readonly id = DomainId.TROPHIC_ENERGY;

  // Energy Budgets per Level (PPM relative to planetary max GPP)
  private energyLevels: number[] = [0, 0, 0, 0, 0];
  
  // Transfer Efficiency (10% Rule)
  private readonly TRANSFER_EFFICIENCY = 100_000; // 0.1

  // Inputs
  private globalGPP_PPM: MathPPM = 0; // From Biosphere Capacity
  private radiationStress01: MathPPM = 0;

  public step(): void {
    // 1. Level 0 (Producers): Receives GPP
    // Magnetosphere Interaction: Radiation reduces producer efficiency (Spec 12.11)
    const radPenalty = mulPPM(this.globalGPP_PPM, this.radiationStress01);
    this.energyLevels[TrophicLevel.Producer] = Math.max(0, this.globalGPP_PPM - radPenalty);

    // 2. Trophic Transfer (10% Rule)
    // Level 1: Primary Consumers (Herbivores)
    this.energyLevels[TrophicLevel.PrimaryConsumer] = mulPPM(
      this.energyLevels[TrophicLevel.Producer], 
      this.TRANSFER_EFFICIENCY
    );

    // Level 2: Secondary Consumers (Carnivores)
    this.energyLevels[TrophicLevel.SecondaryConsumer] = mulPPM(
      this.energyLevels[TrophicLevel.PrimaryConsumer], 
      this.TRANSFER_EFFICIENCY
    );

    // Level 3: Apex Predators
    this.energyLevels[TrophicLevel.Apex] = mulPPM(
      this.energyLevels[TrophicLevel.SecondaryConsumer], 
      this.TRANSFER_EFFICIENCY
    );

    // Level 4: Decomposers (Recycling)
    // Receive waste from all levels. Simplified to 10% of total flow for v1.
    let wasteStream = 0;
    for (let i = 0; i < 4; i++) {
        wasteStream += mulPPM(this.energyLevels[i], 50_000); // 5% mortality/waste
    }
    this.energyLevels[TrophicLevel.Decomposer] = wasteStream;
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.energyLevels = [0, 0, 0, 0, 0];
    this.step();
  }

  public setInputs(gppPPM: number, radStressPPM: number) {
    this.globalGPP_PPM = gppPPM;
    this.radiationStress01 = radStressPPM;
  }

  public getEnergyAtLevel(level: TrophicLevel): number {
    return this.energyLevels[level] / PPM_ONE;
  }
}
