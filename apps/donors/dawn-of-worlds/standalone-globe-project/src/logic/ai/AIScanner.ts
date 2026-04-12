
import { GameState } from '../../types';
import { Cell } from '../world-engine/core/types';

export interface ScanResult {
    myTerritory: number[];
    frontier: number[]; // Unoccupied neighbors
    threats: number[]; // Enemy neighbors
}

export class AIScanner {
    static scan(state: GameState, playerId: string, explicitAdjacencies?: Map<number, number[]>): ScanResult {
        // 1. Extract World Data
        // Ideally, state.world would be typed as WorldState
        const world = (state as any).world;
        const cells = world?.cells as Map<number, Cell>;

        if (!cells) {
            return { myTerritory: [], frontier: [], threats: [] };
        }

        // 2. Find My Territory
        const myTerritory: number[] = [];
        for (const cell of cells.values()) {
            if (cell.ownerId === playerId) {
                myTerritory.push(cell.id);
            }
        }

        // 3. Resolve Adjacencies
        const adjacencies = explicitAdjacencies || new Map<number, number[]>();

        // 4. Find Frontier & Threats
        const frontier = new Set<number>();
        const threats = new Set<number>();

        for (const myCellId of myTerritory) {
            const neighbors = adjacencies.get(myCellId) || [];

            for (const nId of neighbors) {
                const neighbor = cells.get(nId);
                if (!neighbor) continue;

                if (!neighbor.ownerId) {
                    // Unoccupied -> Frontier
                    frontier.add(nId);
                } else if (neighbor.ownerId !== playerId) {
                    // Occupied by someone else -> Threat
                    // Store CELL IDs of threats, not player IDs, to be consistent with return type number[]
                    threats.add(nId);
                }
            }
        }

        return {
            myTerritory,
            frontier: Array.from(frontier),
            threats: Array.from(threats)
        };
    }

    // specific method to find expansion targets
    static findFrontier(
        ownedCells: number[],
        allCells: Map<number, Cell>,
        adjacencies: Map<number, number[]>
    ): number[] {
        const frontier = new Set<number>();

        for (const cellId of ownedCells) {
            const neighbors = adjacencies.get(cellId) || [];
            for (const nId of neighbors) {
                const neighbor = allCells.get(nId);
                if (neighbor && !neighbor.ownerId) {
                    frontier.add(nId);
                }
            }
        }

        return Array.from(frontier);
    }
}
