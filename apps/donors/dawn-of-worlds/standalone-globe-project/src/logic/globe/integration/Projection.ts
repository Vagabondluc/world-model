import { LatLon, GridCoord, Coordinates } from "../interaction/Coordinates";

export interface CellData {
    id: string;
    position: LatLon; // We assume preprocessing converted 3D to LatLon if needed, or we accept LatLon
}

export class Projection {
    /**
     * Projects a set of globe cells onto a local 2D hex grid centered at a specific point.
     * Handles wrapping around the 180th meridian (International Date Line) to ensure
     * the resulting grid is contiguous.
     * 
     * @param center The geographic center of the selection (will map to q=0, r=0)
     * @param cells The list of cells to project
     * @param hexSize The size of the hex grid cells in degrees (approx)
     */
    static projectGlobeToGrid(center: LatLon, cells: CellData[], hexSize: number = 1.0): Map<string, GridCoord> {
        const result = new Map<string, GridCoord>();

        cells.forEach(cell => {
            // Normalize longitude relative to center to handle dateline crossing
            let lonDiff = cell.position.lon - center.lon;

            // Wrap around 180 degrees
            if (lonDiff > 180) lonDiff -= 360;
            if (lonDiff < -180) lonDiff += 360;

            // Constuct a "virtual" position adjacent to center
            // const virtualLon = center.lon + lonDiff;

            // Map relative to center's projected 0,0
            // We use the relative Lat/Lon to project
            // Ideally, we project the *difference* and add to (0,0)

            const relativeLat = cell.position.lat - center.lat;
            const relativeLon = lonDiff;

            // Use the standard projection on these relative coordinates
            // Note: This matches latLonToGameGrid if center is (0,0)
            const projected = Coordinates.latLonToGameGrid(relativeLat, relativeLon, hexSize);

            result.set(cell.id, projected);
        });

        return result;
    }
}
