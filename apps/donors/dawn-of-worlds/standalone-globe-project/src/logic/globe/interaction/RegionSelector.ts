import { Cell } from "../../world-engine/core/types";

export interface RegionStats {
    biomeCounts: Record<string, number>;
    averageElevation: number;
    averageTemperature: number;
    averageMoisture: number;
    totalCells: number;
    waterPercentage: number;
    landPercentage: number;
}

export interface ValidationResult {
    isValid: boolean;
    reason?: string;
}

export class RegionSelector {
    /**
     * Calculates aggregate statistics for a selected region of cells.
     */
    static getRegionStats(selectedCellIds: (string | number)[], worldData: Cell[]): RegionStats {
        const selectedCells = worldData.filter(cell =>
            selectedCellIds.includes(cell.id) || selectedCellIds.includes(cell.id.toString())
        );

        const totalCells = selectedCells.length;
        if (totalCells === 0) {
            return {
                biomeCounts: {},
                averageElevation: 0,
                averageTemperature: 0,
                averageMoisture: 0,
                totalCells: 0,
                waterPercentage: 0,
                landPercentage: 0
            };
        }

        const biomeCounts: Record<string, number> = {};
        let totalElevation = 0;
        let totalTemperature = 0;
        let totalMoisture = 0;
        let waterCount = 0;

        for (const cell of selectedCells) {
            // Biome Counts
            biomeCounts[cell.biomeId] = (biomeCounts[cell.biomeId] || 0) + 1;

            // Averages
            totalElevation += cell.height;
            totalTemperature += cell.temperature;
            totalMoisture += cell.moisture;

            // Water/Land calculation (assuming biomeIds like 'ocean', 'deep_ocean' are water)
            if (['ocean', 'deep_ocean'].includes(cell.biomeId)) {
                waterCount++;
            }
        }

        return {
            biomeCounts,
            averageElevation: totalElevation / totalCells,
            averageTemperature: totalTemperature / totalCells,
            averageMoisture: totalMoisture / totalCells,
            totalCells,
            waterPercentage: waterCount / totalCells,
            landPercentage: (totalCells - waterCount) / totalCells
        };
    }

    /**
     * Validates if a selection is allowed based on game rules (e.g. max radius/size).
     * Note: This simple check uses cell count as a proxy for radius in this context, 
     * or could be expanded if radius information is explicit.
     */
    static validateSelection(selectedCellIds: (string | number)[], maxCells: number): ValidationResult {
        if (selectedCellIds.length > maxCells) {
            return { isValid: false, reason: "Too Large" };
        }
        return { isValid: true };
    }
}
