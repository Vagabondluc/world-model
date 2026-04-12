
import { Cell, Region } from "../core/types";
import { SphereGraph } from "../core/SphereGraph";
import { BiomeType } from "../../globe/rendering/BiomeColors";

export class RegionMap {

    public static findRegions(cells: Map<number, Cell>, graph: SphereGraph): Region[] {
        const visited = new Set<number>();
        const regions: Region[] = [];
        let regionIndex = 0;

        for (const [id, cell] of cells) {
            // Skip water (height <= 0) and already visited cells
            if (cell.height <= 0 || visited.has(id)) {
                continue;
            }

            // Start a new region
            const regionCells: number[] = [];
            const queue: number[] = [id];
            visited.add(id);
            regionCells.push(id);

            // BFS Flood Fill
            let queueIndex = 0;
            while (queueIndex < queue.length) {
                const currentId = queue[queueIndex];
                queueIndex++;

                const neighbors = graph.getNeighbors(currentId);
                for (const neighborId of neighbors) {
                    const neighborCell = cells.get(neighborId);

                    // IF neighbor exists AND is land AND not visited
                    if (neighborCell && neighborCell.height > 0 && !visited.has(neighborId)) {
                        visited.add(neighborId);
                        queue.push(neighborId);
                        regionCells.push(neighborId);
                    }
                }
            }

            // Create the Region Object
            if (regionCells.length > 0) {
                const region = this.createRegion(`R_${regionIndex}`, regionCells, cells);
                regions.push(region);
                regionIndex++;
            }
        }

        return regions;
    }

    private static createRegion(id: string, cellIds: number[], allCells: Map<number, Cell>): Region {
        let sumX = 0, sumY = 0, sumZ = 0;
        const biomeCounts = new Map<BiomeType, number>();

        for (const cellId of cellIds) {
            const cell = allCells.get(cellId)!;

            // Accumulate Position for Center
            sumX += cell.position[0];
            sumY += cell.position[1];
            sumZ += cell.position[2];

            // Count Biomes
            const biome = cell.biomeId || BiomeType.OCEAN;
            biomeCounts.set(biome, (biomeCounts.get(biome) || 0) + 1);
        }

        // Calculate Average Center
        const count = cellIds.length;
        const center: [number, number, number] = [sumX / count, sumY / count, sumZ / count];

        // Find Dominant Biome
        let dominantBiome: BiomeType = BiomeType.OCEAN;
        let maxCount = 0;
        for (const [biome, c] of biomeCounts) {
            if (c > maxCount) {
                maxCount = c;
                dominantBiome = biome;
            }
        }

        return {
            id,
            center,
            cells: cellIds,
            biome: dominantBiome,
            area: count
        };
    }
}
