
import { HexData } from '../../types';

/**
 * Maps Hex Cells to Latitude Bands efficiently.
 * Used for Climate EBM (Energy Balance Model) coupling.
 */
export class HexBandMapper {
  private hexToBandIndex: Int32Array; // hexIndex -> bandIndex
  private bandToHexIndices: number[][]; // bandIndex -> [hexIndex, ...]
  
  constructor(hexes: HexData[], public readonly bandCount: number) {
    this.hexToBandIndex = new Int32Array(hexes.length);
    this.bandToHexIndices = Array.from({ length: bandCount }, () => []);

    // Assume hex.center[1] is Y coordinate on unit sphere (-1 to 1)
    // Map -1 (South Pole) -> 0
    // Map 1 (North Pole) -> bandCount - 1
    
    hexes.forEach((h, i) => {
       const y = h.center[1];
       // Normalize y from [-1, 1] to [0, 1]
       const normalizedY = (y + 1) / 2;
       
       let bandIdx = Math.floor(normalizedY * bandCount);
       // Clamp to valid range
       bandIdx = Math.max(0, Math.min(bandCount - 1, bandIdx));
       
       this.hexToBandIndex[i] = bandIdx;
       this.bandToHexIndices[bandIdx].push(i);
    });
  }

  public getBandForHex(hexIndex: number): number {
    return this.hexToBandIndex[hexIndex];
  }

  public getHexesForBand(bandIndex: number): number[] {
    return this.bandToHexIndices[bandIndex];
  }
  
  /**
   * Calculates the area weight of a band (approximate).
   * For EBM, polar bands have less area than equatorial bands.
   */
  public getBandAreaWeight(bandIndex: number): number {
    // This is proportional to the number of hexes falling into the band
    // for a uniform geodesic grid.
    return this.bandToHexIndices[bandIndex].length / this.hexToBandIndex.length;
  }
}
