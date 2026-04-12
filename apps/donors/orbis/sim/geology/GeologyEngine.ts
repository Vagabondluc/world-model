
import { HexData } from '../../types';
import { mulPPM, divPPM, sqrtPPM, clampPPM01, PPM_ONE } from '../../core/math';
import { LithologyClass, GEO_CONSTANTS } from './types';
import { HexGeometry } from '../../services/terrain/topology';

export class GeologyEngine {
  
  /**
   * Performs a single deterministic erosion step using Stream Power Law in fixed-point math.
   * Spec: update/specs/26-erosion-sediment.md
   */
  public static performErosionStep(
    hexes: HexData[], 
    grid: HexGeometry[],
    dtYears: number
  ): void {
    // 1. Conversion: Float State -> Fixed Point State
    const elevationsPPM = new Int32Array(hexes.length);
    const flowsPPM = new Int32Array(hexes.length);
    const slopesPPM = new Int32Array(hexes.length);
    
    // Pre-pass: Load state
    for (let i = 0; i < hexes.length; i++) {
      const h = hexes[i];
      // Map -1.0..1.0 to 0..1,000,000
      elevationsPPM[i] = Math.floor((h.biomeData.height + 1.0) * 500_000);
      flowsPPM[i] = Math.floor(Math.min(h.flowAccumulation, 1000) * 1000); // Scale flow for PPM math
    }

    // 2. Calculate Slopes (PPM)
    for (let i = 0; i < hexes.length; i++) {
      const h = hexes[i];
      if (!h.downstreamId) {
        slopesPPM[i] = 0;
        continue;
      }
      
      const downstreamIdx = parseInt(h.downstreamId.split('-')[1]);
      const diff = elevationsPPM[i] - elevationsPPM[downstreamIdx];
      // Approx slope: diff / 1.0 (assuming unit distance for v1 grid)
      slopesPPM[i] = Math.max(0, diff); 
    }

    // 3. Apply Incision (Stream Power Law)
    // incision = K * moisture * Flow^0.5 * Slope^1.0 * dt
    const K_DT = Math.floor(GEO_CONSTANTS.K_RIVER_PPM * (dtYears / 1000)); // Scale by timestep
    
    for (let i = 0; i < hexes.length; i++) {
      const h = hexes[i];
      
      // Skip ocean
      if (h.biomeData.height <= 0.1) continue; // Using 0.1 float as sea level proxy for now

      const slope = slopesPPM[i];
      if (slope < GEO_CONSTANTS.SLOPE_THRESHOLD_PPM) continue;

      const flow = flowsPPM[i];
      const moisture = Math.floor(h.biomeData.moisture * PPM_ONE);
      
      // Stream Power = Slope * sqrt(Flow)
      // We scale flow down before sqrt to keep numbers manageable in PPM
      const streamPower = mulPPM(slope, sqrtPPM(flow));
      
      // Lithology check
      // For v1, we assume Sedimentary everywhere unless Volcanic
      let lithology = LithologyClass.SEDIMENTARY;
      // Simple heuristic for hardness
      if (h.biomeData.height > 0.8) lithology = LithologyClass.METAMORPHIC;
      
      const threshold = GEO_CONSTANTS.SHEAR_THRESHOLDS[lithology];
      
      if (streamPower > threshold) {
        const excess = streamPower - threshold;
        const erosionAmount = mulPPM(mulPPM(K_DT, moisture), excess);
        
        // Apply
        elevationsPPM[i] -= erosionAmount;
      }
    }

    // 4. Hillslope Diffusion (Smoothing)
    // diff = K_diff * (AvgNeighbor - Elev)
    const K_DIFF_DT = Math.floor(GEO_CONSTANTS.K_DIFF_PPM * (dtYears / 1000));
    const diffusedElevations = new Int32Array(elevationsPPM);

    for (let i = 0; i < hexes.length; i++) {
      if (hexes[i].biomeData.height <= 0.1) continue;

      const geo = grid[i];
      let neighborSum = 0;
      let count = 0;
      
      for (const nid of geo.neighborIndices) {
        neighborSum += elevationsPPM[nid];
        count++;
      }
      
      if (count > 0) {
        const avg = Math.floor(neighborSum / count);
        const diff = avg - elevationsPPM[i];
        // Apply fraction of difference
        const change = mulPPM(diff, K_DIFF_DT);
        diffusedElevations[i] += change;
      }
    }

    // 5. Write Back (Fixed -> Float)
    for (let i = 0; i < hexes.length; i++) {
      // Map 0..1,000,000 back to -1.0..1.0
      // val = (ppm / 500_000) - 1.0
      const newHeight = (diffusedElevations[i] / 500_000) - 1.0;
      hexes[i].biomeData.height = Math.max(-1.0, Math.min(1.0, newHeight));
    }
  }
}
