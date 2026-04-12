import { Coordinates } from "../Coordinates";

describe("Coordinates", () => {
    describe("cartesianToLatLon", () => {
        const RADIUS = 10;

        it("should return (0,0) for point on X axis", () => {
            // (R, 0, 0) -> Lat 0, Lon 0
            const result = Coordinates.cartesianToLatLon(RADIUS, 0, 0, RADIUS);
            expect(result.lat).toBeCloseTo(0);
            expect(result.lon).toBeCloseTo(0);
        });

        it("should return (90, 0) for North Pole", () => {
            // (0, R, 0) -> Lat 90
            const result = Coordinates.cartesianToLatLon(0, RADIUS, 0, RADIUS);
            expect(result.lat).toBeCloseTo(90);
            // Longitude at pole is undefined/arbitrary, usually 0 or preserves previous
        });

        it("should return (-90, 0) for South Pole", () => {
            // (0, -R, 0) -> Lat -90
            const result = Coordinates.cartesianToLatLon(0, -RADIUS, 0, RADIUS);
            expect(result.lat).toBeCloseTo(-90);
        });

        it("should return (0, 180) or (0, -180) for back of sphere", () => {
            // (-R, 0, 0) -> Lat 0, Lon 180/-180
            const result = Coordinates.cartesianToLatLon(-RADIUS, 0, 0, RADIUS);
            expect(result.lat).toBeCloseTo(0);
            expect(Math.abs(result.lon)).toBeCloseTo(180);
        });
    });

    describe("latLonToGameGrid", () => {
        it("should map (0,0) to q=0, r=0", () => {
            const result = Coordinates.latLonToGameGrid(0, 0);
            expect(result.q).toBe(0);
            expect(result.r).toBe(0);
        });

        it("should map nearby points to same hex (discretization)", () => {
            // Small change within hexSize (default 1.0)
            const result = Coordinates.latLonToGameGrid(0.1, 0.1);
            expect(result.q).toBe(0);
            expect(result.r).toBe(0);
        });

        it("should map points to distinct hexes", () => {
            // Moving sufficiently in Lat (Y)
            // r = (2/3 * y) 
            // if y = 2, r ~ 1.33 -> 1
            const result = Coordinates.latLonToGameGrid(2, 0);
            expect(result.r).not.toBe(0);
        });
    });
});
