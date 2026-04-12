import { Hydrator, GameState } from "../Hydrator";
import { Cell } from "../../../world-engine/core/types";
import { GridCoord } from "../../interaction/Coordinates";

describe("Hydrator", () => {
    const createCell = (id: number): Cell => ({
        id,
        position: [1, 0, 0],
        height: 0.5,
        temperature: 20,
        moisture: 0.8,
        biomeId: 'forest'
    });

    it("should transform projected cells into game tiles", () => {
        const cell1 = createCell(1);
        const cell2 = createCell(2);

        const projection = new Map<string | number, GridCoord>();
        projection.set(1, { q: 0, r: 0 });
        projection.set(2, { q: 1, r: -1 });

        const state: GameState = Hydrator.hydrate([cell1, cell2], projection);

        expect(state.tiles).toHaveLength(2);

        const tile1 = state.tiles.find(t => t.q === 0 && t.r === 0);
        expect(tile1).toBeDefined();
        expect(tile1?.biome).toBe('forest');
        expect(tile1?.height).toBe(0.5);

        const tile2 = state.tiles.find(t => t.q === 1 && t.r === -1);
        expect(tile2).toBeDefined();
    });

    it("should ignore cells that are not in the projection", () => {
        const cell1 = createCell(1);
        const cell2 = createCell(3); // Not in projection

        const projection = new Map<string | number, GridCoord>();
        projection.set(1, { q: 0, r: 0 });

        const state = Hydrator.hydrate([cell1, cell2], projection);

        expect(state.tiles).toHaveLength(1);
        expect(state.tiles[0].q).toBe(0);
    });
});
