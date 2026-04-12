
import { DomainId, MathPPM, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { mulPPM, divPPM, expPPM, powPPM, clampPPM01, PPM_ONE } from '../../core/math';
import { CarbonState } from '../../core/schemas/carbon';

/**
 * CarbonCycleDomain
 * Implements a scalar atmospheric carbon driver.
 * Follows spec ID: 04-carbon-cycle.
 */
export class CarbonCycleDomain implements ISimDomain {
  public readonly id = DomainId.CLIMATE;

  // State (Quantized CO2)
  private co2Q: number = 32768; // Start at ~0.5

  // Parameters
  private readonly kOutgas: MathPPM = 12_000;  // 0.012 per year
  private readonly kWeath: MathPPM = 10_000;   // 0.010 per year
  
  // Environment Inputs (Placeholders for coupling)
  private volcanismIndex01: MathPPM = 500_000;
  private meanRunoff01: MathPPM = 500_000;
  private meanTempK: number = 288_150; // 15 C
  private iceGate: MathPPM = 1_000_000; // 1.0 = IceFree
  private landGate: MathPPM = 300_000;  // 0.3 = 30% land

  public step(): void {
    const co2 = divPPM(this.co2Q, 65535);

    // 1. Source: Volcanic Outgassing
    const source = mulPPM(this.kOutgas, this.volcanismIndex01);

    // 2. Sink: Silicate Weathering (Walker Feedback)
    // tempFactor = exp_PPM( (4600 * (T - 288150)) / (T * 288) )
    const T = this.meanTempK;
    const numerator = 4600 * (T - 288150);
    const denominator = Math.floor(T * 288 / 1000);
    const tempArg = denominator !== 0 ? Math.floor(numerator / denominator) : 0;
    const tempFactor = expPPM(tempArg);
    
    // runoffFactor = meanRunoff01 ^ 0.3
    const runoffFactor = powPPM(this.meanRunoff01, 300_000);
    
    const sink = mulPPM(this.kWeath, 
      mulPPM(co2, 
        mulPPM(runoffFactor, 
          mulPPM(tempFactor, 
            mulPPM(this.landGate, this.iceGate)
          )
        )
      )
    );

    // 3. Integration
    const nextCO2 = clampPPM01(co2 + source - sink);
    this.co2Q = Math.round(nextCO2 * 65535 / 1_000_000);
  }

  public regenerateTo(tNowUs: AbsTime): void {
    // Reset to stable baseline
    this.co2Q = 32768;
    // Fast-forward 500 steps to settle
    for (let i = 0; i < 500; i++) this.step();
  }

  public getCO2(): number { return this.co2Q / 65535; }
  
  // Setters for coupling
  public setInputs(volc: number, runoff: number, tempK: number, ice: number, land: number) {
    this.volcanismIndex01 = Math.floor(volc * 1_000_000);
    this.meanRunoff01 = Math.floor(runoff * 1_000_000);
    this.meanTempK = Math.floor(tempK * 1000);
    this.iceGate = Math.floor(ice * 1_000_000);
    this.landGate = Math.floor(land * 1_000_000);
  }

  public getSchemaState(): CarbonState {
    return {
      co2Q: this.co2Q
    };
  }
}
