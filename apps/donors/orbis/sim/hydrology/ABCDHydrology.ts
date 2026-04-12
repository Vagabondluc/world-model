
import { DomainId, MathPPM, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { mulPPM, divPPM, clampPPM01, powPPM, PPM_ONE } from '../../core/math';
import { HexData } from '../../types';
import { HexGeometry } from '../../services/terrain/topology';
import { Mouth, Basin } from './types';
import { EnergyBalanceModel } from '../climate/EnergyBalanceModel';

/**
 * ABCDHydrology
 * Implements the ABCD 2-bucket model for soil and groundwater.
 * Follows spec ID: 50-hydrology-solver-contract.
 */
export class ABCDHydrology implements ISimDomain {
  public readonly id = DomainId.HYDROLOGY;

  // Parameters (PPM)
  private param_a: MathPPM = 950_000; // Runoff/Evap curve parameter
  private param_b: MathPPM = 500_000; // Soil saturation threshold
  private param_c: MathPPM = 200_000; // Groundwater recharge ratio
  private param_d: MathPPM = 50_000;  // Baseflow discharge rate

  // Global Averages (for coupling)
  private meanRunoffPPM: MathPPM = 0;
  private meanEvapPPM: MathPPM = 500_000; // Default

  // Artifacts
  public mouths: Mouth[] = [];
  public basins: Basin[] = [];

  public step(): void {
    // In a real implementation, this would iterate over all hexes.
    // For the global domain controller, we simulate the 'Idealized Basin'.
  }

  /**
   * Calculates the ABCD transform for a specific cell.
   * Spec 8.1 / 8.2
   */
  public calculateCellFlow(precipPPM: MathPPM, soilPrevPPM: MathPPM, groundPrevPPM: MathPPM) {
    // 1. Soil Moisture Bucket (W)
    const W = precipPPM + soilPrevPPM;
    
    // Actual Evapotranspiration (Y)
    // Simplified model: Evap = W * (1 - a)
    const evap = mulPPM(W, PPM_ONE - this.param_a); 
    const Y = Math.max(0, W - evap); // Available for runoff/recharge
    
    const surfaceRunoff = mulPPM(Y, PPM_ONE - this.param_c);
    const recharge = mulPPM(Y, this.param_c);
    
    const soilNext = Math.min(this.param_b, Math.max(0, W - evap - surfaceRunoff - recharge));

    // 2. Groundwater Bucket (G)
    const baseflow = mulPPM(groundPrevPPM, this.param_d);
    const groundNext = groundPrevPPM + recharge - baseflow;

    return {
      runoff: surfaceRunoff + baseflow,
      soil: soilNext,
      groundwater: groundNext,
      evap
    };
  }

  /**
   * Main Solver Pipeline:
   * 1. Detect Mouths
   * 2. Assign Basins
   * 3. Route Flow
   * 4. Accumulate Flow (ABCD)
   */
  public processHydrology(hexes: HexData[], grid: HexGeometry[], seaLevel: number, climate?: EnergyBalanceModel): void {
    const elevationsPPM = new Int32Array(hexes.length);
    const precipPPM = new Int32Array(hexes.length);
    
    // Init PPM buffers
    hexes.forEach((h, i) => {
        elevationsPPM[i] = Math.floor((h.biomeData.height + 1.0) * 500_000);
        
        if (climate) {
            // Get Precipitation from Climate Band
            // Map hex Y (-1..1) to band index
            const bandIdx = climate.getBandIndex(h.center[1]);
            precipPPM[i] = climate.getPrecipitationPPM(bandIdx);
        } else {
            // Fallback to static moisture
            precipPPM[i] = Math.floor(h.biomeData.moisture * PPM_ONE);
        }
    });

    const seaLevelPPM = Math.floor((seaLevel + 1.0) * 500_000);

    // 1. Detect Mouths
    this.detectMouths(hexes, grid, elevationsPPM, seaLevelPPM);

    // 2. Assign Basins (Distance Field from Mouths)
    this.assignBasins(hexes, grid, elevationsPPM, seaLevelPPM);

    // 3. Flow Routing (Steepest Descent + Basin Guidance)
    this.routeFlow(hexes, grid, elevationsPPM, seaLevelPPM);

    // 4. Flow Accumulation (ABCD Model)
    this.accumulateFlow(hexes, precipPPM);
  }

  private detectMouths(hexes: HexData[], grid: HexGeometry[], elevs: Int32Array, seaLevel: number) {
    this.mouths = [];
    let mouthIdCounter = 1;

    hexes.forEach((h, i) => {
        // Must be Land
        if (elevs[i] <= seaLevel) return;

        // Must neighbor Ocean
        const geo = grid[i];
        let hasOceanNeighbor = false;
        for (const nid of geo.neighborIndices) {
            if (elevs[nid] <= seaLevel) {
                hasOceanNeighbor = true;
                break;
            }
        }

        if (hasOceanNeighbor) {
            // Found a Mouth Candidate
            // Spec 5.2: "Mostly water" check could go here, omitting for v1 speed
            this.mouths.push({
                mouthId: mouthIdCounter++,
                cellId: h.id,
                basinId: mouthIdCounter, // Init basin ID = mouth ID
                strengthPPM: PPM_ONE // Placeholder
            });
            h.mouthId = mouthIdCounter - 1;
            h.basinId = mouthIdCounter; // Self-assigned
        } else {
            h.mouthId = undefined;
            h.basinId = undefined;
        }
    });
  }

  private assignBasins(hexes: HexData[], grid: HexGeometry[], elevs: Int32Array, seaLevel: number) {
    // Multi-source BFS from Mouths to fill basins
    // Valid moves: Only uphill or flat (inverse flow)
    // Spec 6: Mountain barriers split basins
    
    const queue: number[] = [];
    const hexMap = new Map<string, number>(); // id -> index
    hexes.forEach((h, i) => hexMap.set(h.id, i));

    this.mouths.forEach(m => {
        const idx = hexMap.get(m.cellId);
        if (idx !== undefined) queue.push(idx);
    });

    while (queue.length > 0) {
        const currIdx = queue.shift()!;
        const currHex = hexes[currIdx];
        const currBasin = currHex.basinId;
        if (!currBasin) continue;

        const geo = grid[currIdx];
        for (const nid of geo.neighborIndices) {
            const neighbor = hexes[nid];
            
            // Skip if ocean or already assigned
            if (elevs[nid] <= seaLevel || neighbor.basinId !== undefined) continue;

            // Mountain Barrier Logic (Spec 6.1)
            // If slope is extremely steep uphill, it might be a divide.
            // For v1, we just flood fill freely, relying on later downhill routing to refine.
            
            neighbor.basinId = currBasin;
            queue.push(nid);
        }
    }
  }

  private routeFlow(hexes: HexData[], grid: HexGeometry[], elevs: Int32Array, seaLevel: number) {
    hexes.forEach((h, i) => {
        if (elevs[i] <= seaLevel) {
            h.downstreamId = undefined;
            return;
        }

        const geo = grid[i];
        let steepestDrop = -Infinity;
        let targetIdx = -1;

        for (const nid of geo.neighborIndices) {
            const drop = elevs[i] - elevs[nid];
            // Must flow downhill
            if (drop > 0 && drop > steepestDrop) {
                steepestDrop = drop;
                targetIdx = nid;
            }
        }

        if (targetIdx !== -1) {
            h.downstreamId = hexes[targetIdx].id;
        } else {
            // Local minimum (Pit/Lake)
            // Spec 7.2: Mouth guidance could help escape, but for v1 we leave it as sink
            h.downstreamId = undefined;
        }
    });
  }

  private accumulateFlow(hexes: HexData[], precipPPM: Int32Array) {
    // 1. Calculate Local Runoff (ABCD)
    const runoffs = new Int32Array(hexes.length);
    let totalRunoff = 0;
    let totalEvap = 0;
    let landCount = 0;

    hexes.forEach((h, i) => {
        // Init soil/ground state if missing
        const soilPrev = Math.floor((h.soilMoisture || 0) * PPM_ONE);
        const groundPrev = Math.floor((h.groundwater || 0) * PPM_ONE);

        const res = this.calculateCellFlow(precipPPM[i], soilPrev, groundPrev);
        
        // Update State
        h.soilMoisture = res.soil / PPM_ONE;
        h.groundwater = res.groundwater / PPM_ONE;
        
        // Use updated soil moisture to drive biome moisture visual
        // We blend it with precip to represent water availability
        const availableWater = (res.soil + precipPPM[i]) / (2 * PPM_ONE);
        h.biomeData.moisture = availableWater;
        
        runoffs[i] = res.runoff;
        
        if (h.biomeData.height > 0) { // Approx sea level check
            totalRunoff += res.runoff;
            totalEvap += res.evap;
            landCount++;
        }
    });

    this.meanRunoffPPM = landCount > 0 ? Math.floor(totalRunoff / landCount) : 0;
    this.meanEvapPPM = landCount > 0 ? Math.floor(totalEvap / landCount) : 500_000;

    // 2. Accumulate Downstream (Topological Sort)
    // Sort by elevation descending (highest first)
    const sortedIndices = hexes.map((_, i) => i).sort((a, b) => 
        hexes[b].biomeData.height - hexes[a].biomeData.height
    );

    // Reset flow
    const accumulated = new Int32Array(runoffs); // Start with local runoff

    // Propagate
    const hexMap = new Map<string, number>();
    hexes.forEach((h, i) => hexMap.set(h.id, i));

    sortedIndices.forEach(idx => {
        const h = hexes[idx];
        h.flowAccumulation = accumulated[idx] / PPM_ONE; // Store as float for rendering

        if (h.downstreamId) {
            const downstreamIdx = hexMap.get(h.downstreamId);
            if (downstreamIdx !== undefined) {
                accumulated[downstreamIdx] += accumulated[idx];
            }
        }
    });
  }

  public regenerateTo(tNowUs: AbsTime): void {
    // Reset and stabilize
  }

  public getMeanRunoff(): number {
    return this.meanRunoffPPM / 1_000_000;
  }
  
  public getMeanEvaporation(): number {
    return this.meanEvapPPM / 1_000_000;
  }
  
  public setMeanEvaporation(evap: number) {
      this.meanEvapPPM = Math.floor(evap * 1_000_000);
  }
}
