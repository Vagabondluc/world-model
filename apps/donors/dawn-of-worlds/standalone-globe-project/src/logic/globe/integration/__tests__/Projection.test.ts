import { Projection } from "../Projection";
import { LatLon } from "../../interaction/Coordinates";

describe("Projection", () => {
    // Helper
    const createCell = (id: string, lat: number, lon: number) => ({
        id,
        position: { lat, lon }
    });

    describe("projectGlobeToGrid", () => {
        it("should map center to (0,0)", () => {
            const center: LatLon = { lat: 0, lon: 0 };
            const cells = [createCell("c1", 0, 0)];

            const result = Projection.projectGlobeToGrid(center, cells);

            expect(result.get("c1")).toEqual({ q: 0, r: 0 });
        });

        it("should maintain adjacency for nearby cells", () => {
            // Hex size approx 1.0 deg for test
            // A cell at (lat 1, lon 0.5) roughly corresponds to neighbor
            const center: LatLon = { lat: 0, lon: 0 };
            const cells = [
                createCell("center", 0, 0),
                createCell("north", 1.5, 0) // Roughly +y -> +r
            ];

            const result = Projection.projectGlobeToGrid(center, cells);

            const c = result.get("center")!;
            const n = result.get("north")!;

            // Should be distinct
            expect(n).not.toEqual(c);
            // Should be relatively close (q=0, r=1 ideally)
            expect(n.r).toBe(1);
        });

        it("should handle dateline crossing seamlessly", () => {
            const center: LatLon = { lat: 0, lon: 179 }; // Near dateline
            const cells = [
                createCell("east", 0, 179),
                createCell("west", 0, -179) // Across the line (diff +2 degrees)
            ];

            const result = Projection.projectGlobeToGrid(center, cells);

            const e = result.get("east")!;
            const w = result.get("west")!;

            // East should be (0,0)
            expect(e).toEqual({ q: 0, r: 0 });

            // West should be roughly +2 deg longitude -> +x -> +q (approx)
            // Normalized lon diff is +2.
            // Coordinates.latLonToGameGrid(0, 2) -> q approx 2/sqrt(3) * 2 -> 1.15 -> 1
            expect(w.q).toBeGreaterThan(0);
            // Crucially, it should NOT be super far negative (like -179 would imply)
            expect(Math.abs(w.q)).toBeLessThan(5);
        });
    });
});
