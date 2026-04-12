
import { FieldState, TypedArray } from './FieldState';
import { HexBandMapper } from './HexBandMapper';

/**
 * Standardized projection logic between different field bases.
 */
export class FieldProjection {
    
    /**
     * Downsample: Aggregates Cell data into Bands (e.g. Mean Albedo per Latitude).
     */
    static projectCellToBand(
        cellField: FieldState<TypedArray>, 
        mapper: HexBandMapper, 
        aggregator: 'MEAN' | 'SUM' = 'MEAN'
    ): Float32Array {
        const bandCount = mapper.bandCount;
        const comp = cellField.def.components;
        const bands = new Float32Array(bandCount * comp);
        const counts = new Uint32Array(bandCount); // Used for MEAN calculation
        
        for (let i = 0; i < cellField.count; i++) {
            const bandIdx = mapper.getBandForHex(i);
            
            for (let c = 0; c < comp; c++) {
                const val = cellField.get(i, c);
                bands[bandIdx * comp + c] += val;
            }
            counts[bandIdx]++;
        }

        if (aggregator === 'MEAN') {
            for (let b = 0; b < bandCount; b++) {
                if (counts[b] > 0) {
                     for (let c = 0; c < comp; c++) {
                        bands[b * comp + c] /= counts[b];
                     }
                }
            }
        }
        
        return bands;
    }

    /**
     * Upsample: Projects Band data onto Cells (e.g. Temperature per Hex).
     * Currently implements NEAREST band assignment (Step function).
     * Future v2: Linear interpolation between band centers.
     */
    static projectBandToCell(
        bandData: TypedArray, 
        mapper: HexBandMapper,
        cellCount: number,
        components: number = 1
    ): Float32Array {
        const cells = new Float32Array(cellCount * components);
        
        for (let i = 0; i < cellCount; i++) {
            const bandIdx = mapper.getBandForHex(i);
            for (let c = 0; c < components; c++) {
                cells[i * components + c] = bandData[bandIdx * components + c];
            }
        }
        
        return cells;
    }
}
