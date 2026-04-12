
import { Cell } from '../core/types';
import { SphereGraph } from '../core/SphereGraph';

export class CivilizationEngine {

    /**
     * Place settlements on the globe based on suitability scores.
     * @param cells Map of all cells
     * @param graph Adjacency graph
     * @param count Number of settlements to attempt to place
     */
    public static placeSettlements(
        cells: Map<number, Cell>,
        graph: SphereGraph,
        count: number
    ): void {
        const candidates: { id: number, score: number }[] = [];

        // 1. Calculate Suitability
        for (const cell of cells.values()) {
            const score = this.calculateSuitability(cell, cells, graph);
            if (score > 0) {
                candidates.push({ id: cell.id, score });
            }
        }

        // 2. Sort by Score Descending
        candidates.sort((a, b) => b.score - a.score);

        // 3. Place Settlements with Spacing
        const placedIds: number[] = [];
        const MIN_DISTANCE = 3; // Minimum graph distance between settlements

        for (const candidate of candidates) {
            if (placedIds.length >= count) break;

            if (this.isFarEnough(candidate.id, placedIds, cells, MIN_DISTANCE)) {
                const cell = cells.get(candidate.id);
                if (cell) {
                    cell.settlementType = 'VILLAGE'; // Default to Village
                    // Top scoring could be CITIES?
                    if (candidate.score > 80) cell.settlementType = 'CITY';

                    placedIds.push(candidate.id);
                }
            }
        }
    }

    private static calculateSuitability(
        cell: Cell,
        allCells: Map<number, Cell>,
        graph: SphereGraph
    ): number {
        // Base suitability
        if (cell.height <= 0) return -100; // Ocean
        if (cell.height > 0.4) return -50; // High mountains
        if (cell.temperature < -5) return -20; // Too cold
        if (cell.temperature > 50) return -20; // Too hot

        let score = 0;

        // Biome Preferences
        const biome = cell.biomeId.toLowerCase();
        if (biome.includes('grassland')) score += 20;
        if (biome.includes('forest') && !biome.includes('rain')) score += 15;
        if (biome.includes('savanna')) score += 10;
        if (biome.includes('desert')) score -= 10;
        if (biome.includes('snow') || biome.includes('ice')) score -= 10;

        // Water Access (Rivers or Coast)
        if (cell.isRiver) score += 30; // Direct fresh water

        // Check neighbors for Coast (Ocean access) or Rivers
        const neighbors = graph.getNeighbors(cell.id);
        let hasCoast = false;

        for (const nId of neighbors) {
            const neighbor = allCells.get(nId);
            if (neighbor) {
                if (neighbor.height <= 0) hasCoast = true;
            }
        }

        if (hasCoast) score += 25; // Port potential

        // Flatness preference? (Simulated by height check above)

        return score;
    }

    private static isFarEnough(
        targetId: number,
        existingIds: number[],
        cells: Map<number, Cell>,
        _minDistance: number
    ): boolean {
        const target = cells.get(targetId);
        if (!target) return false;

        // Approximate spacing check
        // If we want roughly "3 cells away", that depends on cell density.
        // For simplicity:
        // 0.2 units squared is roughly 0.04
        const SAFE_RADIUS_SQ = 0.2 * 0.2;

        for (const existingId of existingIds) {
            const existing = cells.get(existingId);
            if (existing) {
                const dx = target.position[0] - existing.position[0];
                const dy = target.position[1] - existing.position[1];
                const dz = target.position[2] - existing.position[2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < SAFE_RADIUS_SQ) return false;
            }
        }

        return true;
    }
}
