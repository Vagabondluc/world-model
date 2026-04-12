
import { DomainId, MathPPM, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { mulPPM, divPPM, lerpPPM, clampPPM01, sinPPM32, cosPPM32, powIntPPM, PPM_ONE } from '../../core/math';

/**
 * EnergyBalanceModel (EBM)
 * Implements a 1D Latitude Band climate solver.
 * Follows spec ID: 49-climate-solver-contract-ebm.
 */
export class EnergyBalanceModel implements ISimDomain {
  public readonly id = DomainId.CLIMATE;

  private readonly BAND_COUNT = 18; // 10 degree bands
  private temperaturesMK: Int32Array; // milliKelvin
  private iceFractionsPPM: Int32Array;
  private albedosPPM: Int32Array;
  private precipBandsPPM: Int32Array; // Zonal precipitation

  // Parameters (PPM-scaled)
  private sigmaTildePPM: MathPPM = 620_000; // Effective emissivity (0.62)
  private diffusionDPPM: MathPPM = 600_000; // Zonal heat diffusion
  private alphaIcePPM: MathPPM = 600_000;  // Albedo of ice
  private alphaWaterPPM: MathPPM = 300_000;// Albedo of open water
  private T_ice_mK: number = 263_150;      // -10 C
  private T_warm_mK: number = 283_150;     // +10 C
  
  private solarStrengthPPM: MathPPM = 1_000_000; // Baseline solar constant
  private axialTiltPPM: MathPPM = 410_000;       // ~23.5 degrees (in radians approx)
  private seasonPhasePPM: MathPPM = 0;           // 0..2*PI representing orbit position

  // Coupling Inputs
  private globalEvaporationPPM: MathPPM = 500_000; // From Hydrology

  constructor() {
    this.temperaturesMK = new Int32Array(this.BAND_COUNT).fill(288_150); // 15 C
    this.iceFractionsPPM = new Int32Array(this.BAND_COUNT);
    this.albedosPPM = new Int32Array(this.BAND_COUNT).fill(this.alphaWaterPPM);
    this.precipBandsPPM = new Int32Array(this.BAND_COUNT).fill(500_000);
  }

  public step(): void {
    const nextTemps = new Int32Array(this.BAND_COUNT);

    // Calculate Solar Declination: delta = -tilt * cos(yearPhase)
    // We align 0 phase with Northern Winter (Solstice) for simplicity
    const declinationPPM = -mulPPM(this.axialTiltPPM, cosPPM32(this.seasonPhasePPM));

    for (let i = 0; i < this.BAND_COUNT; i++) {
      const latRadPPM = this.getBandLatitudePPM(i);
      
      // 1. Calculate Insolation (Seasonal)
      // Effective Angle = |lat - declination|
      // We need to map band index 0..17 to latitude -PI/2 .. PI/2
      // 0 = South Pole, 17 = North Pole
      
      // FIX: Ensure this calculation results in an integer for PPM operations
      const rawLat = Math.floor((i / (this.BAND_COUNT - 1)) * 3_141_592 - 1_570_796); // -PI/2 to PI/2 in PPM
      
      // Calculate angular distance to subsolar point
      let angleToSun = Math.abs(rawLat - declinationPPM);
      // Clamp for night side
      if (angleToSun > 1_570_796) angleToSun = 1_570_796; // > 90 deg is dark
      
      const insolation = mulPPM(this.solarStrengthPPM, cosPPM32(angleToSun));
      
      // 2. Albedo & Ice Feedback
      this.updateIceAndAlbedo(i);
      const absorbed = mulPPM(insolation, PPM_ONE - this.albedosPPM[i]);

      // 3. Outgoing Radiation (Stefan-Boltzmann approximation)
      // P_out = sigma * T^4. Approximated via reference linearization.
      const T = this.temperaturesMK[i];
      const T0 = 288_150;
      const flux0 = 235_000; // Typical Earth outgoing flux proxy in PPM
      const sensitivity = 2_000; // ~2 units per degree
      // T, T0, sensitivity are ints, division by 1000 keeps it int
      const outgoing = flux0 + Math.floor((T - T0) * sensitivity / 1_000);

      // 4. Diffusion (Zonal Mixing)
      let mixing = 0;
      if (i > 0) mixing += mulPPM(this.diffusionDPPM, this.temperaturesMK[i-1] - T);
      if (i < this.BAND_COUNT - 1) mixing += mulPPM(this.diffusionDPPM, this.temperaturesMK[i+1] - T);

      // 5. Update
      // Thermal inertia: Oceans change temp slower. Ice changes faster.
      // Simple proxy: constant dt for now.
      const dtPPM = 10_000; // Integration step
      nextTemps[i] = T + mulPPM(dtPPM, absorbed - outgoing + mixing);

      // 6. Precipitation Generation (Zonal Circulation)
      this.updatePrecipitation(i, latRadPPM, T);
    }

    this.temperaturesMK = nextTemps;
  }

  private updateIceAndAlbedo(i: number): void {
    const T = this.temperaturesMK[i];
    if (T <= this.T_ice_mK) {
      this.iceFractionsPPM[i] = PPM_ONE;
    } else if (T >= this.T_warm_mK) {
      this.iceFractionsPPM[i] = 0;
    } else {
      this.iceFractionsPPM[i] = divPPM(this.T_warm_mK - T, this.T_warm_mK - this.T_ice_mK);
    }
    this.albedosPPM[i] = lerpPPM(this.alphaWaterPPM, this.alphaIcePPM, this.iceFractionsPPM[i]);
  }

  private updatePrecipitation(i: number, latPPM: number, tempMK: number): void {
    // 3-Cell Model Approximation
    const lat = latPPM / PPM_ONE; // 0..1.57
    let zonalBase = 0;

    if (lat < 0.5) { 
        // Hadley (0 - 30)
        zonalBase = 1.0 - (lat * 2.0); 
        zonalBase = Math.max(0.1, zonalBase);
    } else if (lat < 1.0) {
        // Ferrel (30 - 60)
        zonalBase = 0.1 + (lat - 0.5) * 1.6;
    } else {
        // Polar (60 - 90)
        zonalBase = Math.max(0.05, 0.9 - (lat - 1.0) * 1.8);
    }

    const tempC = (tempMK / 1000) - 273.15;
    const tempFactor = Math.pow(1.07, (tempC - 15)); 
    const moistureAvailability = this.globalEvaporationPPM / 500_000; 

    const precip = zonalBase * tempFactor * moistureAvailability;
    
    this.precipBandsPPM[i] = clampPPM01(Math.floor(precip * PPM_ONE));
  }

  private getBandLatitudePPM(i: number): MathPPM {
    // 0 = equator, PI/2 = pole (absolute for precip calc)
    const step = 1_570_796 / this.BAND_COUNT;
    return Math.floor(Math.abs(i - (this.BAND_COUNT / 2)) * step);
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.temperaturesMK.fill(288_150);
    this.precipBandsPPM.fill(500_000);
    for (let i = 0; i < 100; i++) this.step();
  }

  public getTemperature(bandIdx: number): number { return this.temperaturesMK[bandIdx] / 1000 - 273.15; }
  public getIceFraction(bandIdx: number): number { return this.iceFractionsPPM[bandIdx] / PPM_ONE; }
  
  public getPrecipitationPPM(bandIdx: number): number { 
      return this.precipBandsPPM[bandIdx]; 
  }
  
  public getBandIndex(lat: number): number {
      // Map lat -1..1 (South to North) to 0..BAND_COUNT-1
      const normalizedLat = Math.max(-1, Math.min(1, lat));
      return Math.floor(((normalizedLat + 1) / 2) * (this.BAND_COUNT - 0.001));
  }

  /**
   * Helper to get temperature for any arbitrary latitude -1..1
   */
  public getTemperatureAtLat(lat: number): number {
    const idx = this.getBandIndex(lat);
    return this.getTemperature(idx);
  }

  public setMeanEvaporation(evapPPM: number) {
      this.globalEvaporationPPM = Math.floor(evapPPM);
  }
  
  public setSeason(phasePPM: number) {
      this.seasonPhasePPM = Math.floor(phasePPM);
  }
  
  public setAxialTilt(degrees: number) {
      // Convert degrees to radians PPM
      this.axialTiltPPM = Math.floor(degrees * (Math.PI / 180) * PPM_ONE);
  }
}
