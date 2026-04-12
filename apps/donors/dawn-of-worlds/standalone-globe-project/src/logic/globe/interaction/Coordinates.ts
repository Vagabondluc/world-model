/**
 * Handles coordinate system transformations for the Globe.
 */

export interface LatLon {
    lat: number;
    lon: number;
}

export interface GridCoord {
    q: number;
    r: number;
}

export class Coordinates {
    /**
     * Converts a 3D Cartesian point (x, y, z) on a sphere to Latitude/Longitude.
     * Assumes Y is up.
     * @param x 
     * @param y 
     * @param z 
     * @param radius 
     * @returns {lat, lon} in degrees
     */
    static cartesianToLatLon(x: number, y: number, z: number, radius: number): LatLon {
        // Safety check for zero radius
        if (radius === 0) return { lat: 0, lon: 0 };

        // Calculate Latitude
        // phi = asin(y / R)
        const latRad = Math.asin(y / radius);
        const lat = latRad * (180 / Math.PI);

        // Calculate Longitude
        // theta = atan2(z, x) or atan2(-z, x) depending on coordinate system winding
        // Standard geometric: atan2(z, x)
        const lonRad = Math.atan2(z, x);
        const lon = lonRad * (180 / Math.PI);

        return { lat, lon };
    }

    /**
     * Converts Latitude/Longitude to a Hexagon Grid coordinate (Axial q, r).
     * This is a simplified projection for mapping a spherical point to a Logic Grid.
     * ideally, the Grid is wrapping, but for local selection we can project to a plane.
     * 
     * @param lat Latitude in degrees
     * @param lon Longitude in degrees
     * @param hexSize Size of the hex cells in degrees (approximate) or arbitrary units
     */
    static latLonToGameGrid(lat: number, lon: number, hexSize: number = 1.0): GridCoord {
        // We can treat Lat/Lon as a rectangular grid for local approximation,
        // then convert that rectangular point to Hex Axial coords.

        // Rectangular to Hex conversion (Pointy Top HEX)
        // x = sqrt(3) * q + sqrt(3)/2 * r
        // y = 3/2 * r
        // Inverting this:
        // q = (sqrt(3)/3 * x - 1/3 * y) / size
        // r = (2/3 * y) / size

        // We map Lon -> x, Lat -> y
        // Normalize lon to avoid issues at dateline if needed, but simple for now.

        const x = lon;
        const y = lat;

        const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / hexSize;
        const r = (2 / 3 * y) / hexSize;

        return {
            q: Math.round(q),
            r: Math.round(r)
        };
    }
}
