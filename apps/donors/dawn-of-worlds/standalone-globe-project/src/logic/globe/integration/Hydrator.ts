import { Cell } from "../../world-engine/core/types";
import { GridCoord } from "../interaction/Coordinates";

export interface GameTile {
    q: number;
    r: number;
    biome: string;
    height: number;
    temperature: number;
    moisture: number;
}

export interface GameState {
    tiles: GameTile[];
}

export class Hydrator {
    /**
     * Hydrates a game state from raw globe cells and their projected coordinates.
     * 
     * @param cells The raw data cells from WorldEngine
     * @param projection A map of Cell ID -> Grid Coordinate
     */
    static hydrate(cells: Cell[], projection: Map<string | number, GridCoord>): GameState {
        const tiles: GameTile[] = [];

        for (const cell of cells) {
            const coord = projection.get(cell.id);
            if (!coord) continue;

            const tile: GameTile = {
                q: coord.q,
                r: coord.r,
                biome: cell.biomeId,
                height: cell.height,
                temperature: cell.temperature,
                moisture: cell.moisture
            };

            tiles.push(tile);
        }

        return { tiles };
    }
}
