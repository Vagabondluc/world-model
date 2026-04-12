
import { SphereGraph } from '../core/SphereGraph';
import { Cell } from '../core/types';

export class HydraulicErosion {
    /**
     * Run hydraulic erosion simulation
     * @param cells Map of cells
     * @param graph Adjacency graph
     * @param iterations Number of droplets to spawn
     */
    public static erode(
        cells: Map<number, Cell>,
        graph: SphereGraph,
        iterations: number = 20000
    ): void {
        const cellIds = Array.from(cells.keys());

        // Reset flux
        for (const cell of cells.values()) {
            cell.flux = 0;
            cell.isRiver = false;
        }

        for (let i = 0; i < iterations; i++) {
            // Spawn droplet at random location
            const startId = cellIds[Math.floor(Math.random() * cellIds.length)];
            this.simulateDroplet(cells, graph, startId);
        }

        // Determine Rivers based on flux
        this.determineRivers(cells);
    }

    private static simulateDroplet(
        cells: Map<number, Cell>,
        graph: SphereGraph,
        startId: number
    ): void {
        let currentId = startId;
        let sediment = 0;
        let water = 1.0;
        let speed = 1.0;

        const MAX_LIFETIME = 30;
        const SEDIMENT_CAPACITY_FACTOR = 4.0; // How much sediment water can carry
        const EROSION_RATE = 0.3; // How fast it erodes soil
        const DEPOSITION_RATE = 0.3; // How fast it drops sediment
        const EVAPORATION_RATE = 0.02;

        for (let step = 0; step < MAX_LIFETIME; step++) {
            const currentCell = cells.get(currentId);
            if (!currentCell) break;

            // Track Flux: Accumulate water volume passing through
            currentCell.flux = (currentCell.flux || 0) + water;

            // Find lowest neighbor (simple gradient for now)
            const neighbors = graph.getNeighbors(currentId);
            let lowestId = currentId;
            let minHeight = currentCell.height;

            for (const nId of neighbors) {
                const nCell = cells.get(nId);
                if (nCell && nCell.height < minHeight) {
                    minHeight = nCell.height;
                    lowestId = nId;
                }
            }

            if (lowestId === currentId) {
                // Trap/Pit: Deposit all sediment and evaporate
                currentCell.height += sediment;
                sediment = 0;
                break;
            }

            // Move
            const nextCell = cells.get(lowestId)!;
            const heightDiff = currentCell.height - nextCell.height;

            // Calculate Capacity
            const capacity = Math.max(0.01, heightDiff * speed * water * SEDIMENT_CAPACITY_FACTOR);

            // Erode or Deposit
            if (sediment > capacity) {
                // Deposit excess
                const amount = (sediment - capacity) * DEPOSITION_RATE;
                currentCell.height += amount;
                sediment -= amount;
            } else {
                // Erode
                const amount = Math.min((capacity - sediment) * EROSION_RATE, heightDiff);
                currentCell.height -= amount;
                sediment += amount;
            }

            // Update Physics
            speed = Math.sqrt(speed * speed + heightDiff * 4); // Gravity accelerates
            water *= (1 - EVAPORATION_RATE);

            if (water < 0.01) break;

            // Move to next
            currentId = lowestId;
        }
        if (sediment > 0) {
            const finalCell = cells.get(currentId);
            if (finalCell) {
                // console.log(`Droplet ended. Depositing ${sediment} in cell ${currentId}. Prev height: ${finalCell.height}`);
                finalCell.height += sediment;
            }
        }
    }

    private static determineRivers(cells: Map<number, Cell>): void {
        let maxFlux = 0;
        const fluxValues: number[] = [];

        // Collect stats
        for (const cell of cells.values()) {
            if (cell.flux && cell.flux > 0) {
                maxFlux = Math.max(maxFlux, cell.flux);
                fluxValues.push(cell.flux);
            }
        }

        if (maxFlux === 0) return;

        // Determine threshold for top flow
        // Sort descending
        fluxValues.sort((a, b) => b - a);

        // Define River Threshold (Top 2-3% of wet cells)
        const thresholdIndex = Math.floor(fluxValues.length * 0.03);
        const riverThreshold = fluxValues[thresholdIndex] || maxFlux * 0.5;

        // Assign River status
        for (const cell of cells.values()) {
            if (cell.flux && cell.flux >= riverThreshold && cell.height > 0) {
                cell.isRiver = true;
            }
        }
    }
}
