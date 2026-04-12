import { RegionSelector } from "../RegionSelector";
import { Cell } from "../../../world-engine/core/types";

describe("RegionSelector", () => {

    // Helper to create mock cells
    const createMockCell = (id: number, biomeId: string, height: number = 0, temp: number = 20, moisture: number = 0.5): Cell => ({
        id,
        biomeId,
        height,
        temperature: temp,
        moisture,
        position: [0, 0, 0] // Dummy position
    });

    describe("getRegionStats", () => {
        it("should calculate correct biome counts and percentages", () => {
            const worldData: Cell[] = [
                createMockCell(1, "ocean"),
                createMockCell(2, "ocean"),
                createMockCell(3, "grassland"),
                createMockCell(4, "forest")
            ];

            const selectedIds = [1, 2, 3, 4];
            const stats = RegionSelector.getRegionStats(selectedIds, worldData);

            expect(stats.totalCells).toBe(4);
            expect(stats.biomeCounts["ocean"]).toBe(2);
            expect(stats.biomeCounts["grassland"]).toBe(1);
            expect(stats.waterPercentage).toBe(0.5); // 2/4
            expect(stats.landPercentage).toBe(0.5); // 2/4
        });

        it("should calculate averages correctly", () => {
            const worldData: Cell[] = [
                createMockCell(1, "grassland", 10, 20, 0.5),
                createMockCell(2, "grassland", 20, 30, 0.5)
            ];

            const selectedIds = [1, 2];
            const stats = RegionSelector.getRegionStats(selectedIds, worldData);

            expect(stats.averageElevation).toBe(15);
            expect(stats.averageTemperature).toBe(25);
        });

        it("should handle mixed string/number IDs", () => {
            const worldData: Cell[] = [
                createMockCell(1, "ocean"),
                createMockCell(2, "grassland")
            ];

            const selectedIds = ["1", 2]; // Mixed types
            const stats = RegionSelector.getRegionStats(selectedIds, worldData);

            expect(stats.totalCells).toBe(2);
        });

        it("should return zeros for empty selection", () => {
            const worldData: Cell[] = [createMockCell(1, "ocean")];
            const stats = RegionSelector.getRegionStats([], worldData);

            expect(stats.totalCells).toBe(0);
        });
    });

    describe("validateSelection", () => {
        it("should pass if selection count is within limit", () => {
            const result = RegionSelector.validateSelection([1, 2, 3], 5);
            expect(result.isValid).toBe(true);
        });

        it("should fail if selection count exceeds limit", () => {
            const result = RegionSelector.validateSelection([1, 2, 3, 4, 5, 6], 5);
            expect(result.isValid).toBe(false);
            expect(result.reason).toBe("Too Large");
        });
    });
});
