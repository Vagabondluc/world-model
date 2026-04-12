/**
 * Spatial hash data structure for efficient cell lookups on a sphere surface.
 * Provides O(1) average lookup time for finding cells near a point.
 */

import { Vec3 } from '../types';
import { vec3 } from '../geometry/vec3';
import { HexCell } from '../overlay/hexGrid';

export interface SpatialHashConfig {
    /** Radius of the sphere */
    radius: number;
    /** Number of grid cells along latitude (polar angle) */
    latitudeDivisions: number;
    /** Number of grid cells along longitude (azimuthal angle) */
    longitudeDivisions: number;
}

export interface SpatialHashEntry {
    cell: HexCell;
    gridKey: string;
}

/**
 * Spatial hash for efficient cell lookups on sphere surface.
 * Uses latitude/longitude grid to partition the sphere into cells.
 */
export class SpatialHash {
    private readonly radius: number;
    private readonly latDivisions: number;
    private readonly lonDivisions: number;
    private readonly latStep: number;
    private readonly lonStep: number;

    // Map from grid key to list of cells in that grid cell
    private readonly grid: Map<string, HexCell[]> = new Map();

    // Map from cell ID to its current grid key for efficient removal
    private readonly cellToGridKey: Map<string, string> = new Map();

    // Track total number of cells
    private cellCount: number = 0;

    constructor(config: SpatialHashConfig) {
        this.radius = config.radius;
        this.latDivisions = config.latitudeDivisions;
        this.lonDivisions = config.longitudeDivisions;

        // Latitude ranges from -PI/2 to PI/2 (south pole to north pole)
        this.latStep = Math.PI / this.latDivisions;

        // Longitude ranges from -PI to PI
        this.lonStep = (2 * Math.PI) / this.lonDivisions;
    }

    /**
     * Convert a 3D position to latitude and longitude angles.
     * @param point 3D position on sphere surface
     * @returns [latitude, longitude] in radians
     */
    private pointToLatLon(point: Vec3): [number, number] {
        // Normalize to ensure we're on the sphere surface
        const normalized = vec3.normalize(point);

        // Latitude: angle from equatorial plane (-PI/2 to PI/2)
        const lat = Math.asin(normalized.y);

        // Longitude: angle in x-z plane (-PI to PI)
        const lon = Math.atan2(normalized.x, normalized.z);

        return [lat, lon];
    }

    /**
     * Convert latitude/longitude to grid cell indices.
     * @param lat Latitude in radians
     * @param lon Longitude in radians
     * @returns [latitude index, longitude index]
     */
    private latLonToGridIndex(lat: number, lon: number): [number, number] {
        // Map latitude from [-PI/2, PI/2] to [0, latDivisions - 1]
        let latIndex = Math.floor((lat + Math.PI / 2) / this.latStep);
        latIndex = Math.max(0, Math.min(this.latDivisions - 1, latIndex));

        // Map longitude from [-PI, PI] to [0, lonDivisions - 1]
        let lonIndex = Math.floor((lon + Math.PI) / this.lonStep);
        lonIndex = Math.max(0, Math.min(this.lonDivisions - 1, lonIndex));

        return [latIndex, lonIndex];
    }

    /**
     * Convert grid indices to a hash key.
     * @param latIndex Latitude grid index
     * @param lonIndex Longitude grid index
     * @returns Hash key string
     */
    private gridIndexToKey(latIndex: number, lonIndex: number): string {
        return `${latIndex},${lonIndex}`;
    }

    /**
     * Add a cell to the spatial hash.
     * @param cell The cell to add
     */
    addCell(cell: HexCell): void {
        const [lat, lon] = this.pointToLatLon(cell.center);
        const [latIndex, lonIndex] = this.latLonToGridIndex(lat, lon);
        const key = this.gridIndexToKey(latIndex, lonIndex);

        // Remove from previous grid cell if exists
        if (this.cellToGridKey.has(cell.id)) {
            this.removeCell(cell.id);
        }

        // Add to new grid cell
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key)!.push(cell);
        this.cellToGridKey.set(cell.id, key);
        this.cellCount++;
    }

    /**
     * Remove a cell from the spatial hash by ID.
     * @param cellId The ID of the cell to remove
     */
    removeCell(cellId: string): void {
        const key = this.cellToGridKey.get(cellId);
        if (!key) return;

        const cells = this.grid.get(key);
        if (!cells) return;

        // Find and remove the cell
        const index = cells.findIndex(c => c.id === cellId);
        if (index !== -1) {
            cells.splice(index, 1);
            this.cellToGridKey.delete(cellId);
            this.cellCount--;

            // Clean up empty grid cells
            if (cells.length === 0) {
                this.grid.delete(key);
            }
        }
    }

    /**
     * Add multiple cells to the spatial hash.
     * @param cells Array of cells to add
     */
    addCells(cells: HexCell[]): void {
        cells.forEach(cell => this.addCell(cell));
    }

    /**
     * Clear all cells from the spatial hash.
     */
    clear(): void {
        this.grid.clear();
        this.cellToGridKey.clear();
        this.cellCount = 0;
    }

    /**
     * Get the total number of cells in the spatial hash.
     */
    size(): number {
        return this.cellCount;
    }

    /**
     * Get all cells in a specific grid cell.
     * @param latIndex Latitude grid index
     * @param lonIndex Longitude grid index
     * @returns Array of cells in the grid cell, or empty array if none
     */
    getCellsInGridCell(latIndex: number, lonIndex: number): HexCell[] {
        const key = this.gridIndexToKey(latIndex, lonIndex);
        return this.grid.get(key) || [];
    }

    /**
     * Find the nearest cell to a given point.
     * Uses spatial hash to limit search to nearby grid cells.
     * @param point The 3D position to search from
     * @returns The nearest cell, or null if no cells exist
     */
    findNearestCell(point: Vec3): HexCell | null {
        if (this.cellCount === 0) return null;

        const [lat, lon] = this.pointToLatLon(point);
        const [centerLatIndex, centerLonIndex] = this.latLonToGridIndex(lat, lon);

        let nearest: HexCell | null = null;
        let minDist = Infinity;

        // Search in expanding rings of grid cells
        const maxSearchRadius = Math.max(this.latDivisions, this.lonDivisions) / 2;

        for (let radius = 0; radius <= maxSearchRadius; radius++) {
            const found = this.searchInRadius(centerLatIndex, centerLonIndex, radius, (cell) => {
                const dist = vec3.distance(cell.center, point);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = cell;
                }
            });

            // If we found cells in this ring and the distance is reasonable, we can stop
            // The reasonable distance threshold is based on expected cell size
            if (found && radius > 0) {
                // Estimate cell size based on sphere surface area and cell count
                const cellArea = (4 * Math.PI * this.radius * this.radius) / this.cellCount;
                const cellRadius = Math.sqrt(cellArea / Math.PI);

                // If we've searched beyond a reasonable radius, stop
                if (minDist < cellRadius * 2) {
                    break;
                }
            }
        }

        return nearest;
    }

    /**
     * Find all cells within a given radius of a point.
     * @param point The 3D position to search from
     * @param radius The search radius in world units
     * @returns Array of cells within the radius
     */
    findCellsInRadius(point: Vec3, radius: number): HexCell[] {
        if (this.cellCount === 0) return [];

        const [lat, lon] = this.pointToLatLon(point);
        const [centerLatIndex, centerLonIndex] = this.latLonToGridIndex(lat, lon);

        const result: HexCell[] = [];

        // Convert world radius to approximate grid cell radius
        const gridCellLat = this.latStep * this.radius;
        const gridCellLon = this.lonStep * this.radius;
        const gridRadius = Math.max(gridCellLat, gridCellLon);
        const searchGridRadius = Math.ceil(radius / gridRadius) + 1;

        this.searchInRadius(centerLatIndex, centerLonIndex, searchGridRadius, (cell) => {
            const dist = vec3.distance(cell.center, point);
            if (dist <= radius) {
                result.push(cell);
            }
        });

        return result;
    }

    /**
     * Search in grid cells within a given radius of a center grid cell.
     * @param centerLatIndex Center latitude grid index
     * @param centerLonIndex Center longitude grid index
     * @param radius Search radius in grid cells
     * @param callback Function to call for each cell found
     * @returns True if any cells were found, false otherwise
     */
    private searchInRadius(
        centerLatIndex: number,
        centerLonIndex: number,
        radius: number,
        callback: (cell: HexCell) => void
    ): boolean {
        let found = false;

        // Handle longitude wrap-around
        for (let latOffset = -radius; latOffset <= radius; latOffset++) {
            const latIndex = centerLatIndex + latOffset;

            // Skip if out of bounds
            if (latIndex < 0 || latIndex >= this.latDivisions) continue;

            for (let lonOffset = -radius; lonOffset <= radius; lonOffset++) {
                // Use Manhattan distance to stay within the radius
                if (Math.abs(latOffset) + Math.abs(lonOffset) > radius) continue;

                // Handle longitude wrap-around
                let lonIndex = (centerLonIndex + lonOffset) % this.lonDivisions;
                if (lonIndex < 0) lonIndex += this.lonDivisions;

                const cells = this.getCellsInGridCell(latIndex, lonIndex);

                for (const cell of cells) {
                    found = true;
                    callback(cell);
                }
            }
        }

        return found;
    }

    /**
     * Get statistics about the spatial hash distribution.
     * Useful for debugging and optimization.
     */
    getStats(): {
        totalCells: number;
        gridCellsUsed: number;
        avgCellsPerGridCell: number;
        maxCellsPerGridCell: number;
        emptyGridCells: number;
    } {
        let totalCells = 0;
        let maxCells = 0;
        let emptyCells = 0;

        for (const cells of this.grid.values()) {
            totalCells += cells.length;
            maxCells = Math.max(maxCells, cells.length);
            if (cells.length === 0) emptyCells++;
        }

        return {
            totalCells: this.cellCount,
            gridCellsUsed: this.grid.size,
            avgCellsPerGridCell: this.grid.size > 0 ? totalCells / this.grid.size : 0,
            maxCellsPerGridCell: maxCells,
            emptyGridCells: emptyCells
        };
    }
}

/**
 * Create a spatial hash with default configuration optimized for typical globe sizes.
 * @param radius Sphere radius
 * @param cellCount Approximate number of cells to store
 * @returns Configured SpatialHash instance
 */
export function createSpatialHash(radius: number, cellCount: number): SpatialHash {
    // Calculate optimal grid divisions based on cell count
    // Aim for ~10-20 cells per grid cell for good performance
    const targetCellsPerGridCell = 15;
    const totalGridCells = Math.max(1, Math.floor(cellCount / targetCellsPerGridCell));

    // Distribute grid cells between latitude and longitude
    // Latitude has half the range of longitude, so give it fewer divisions
    const latDivisions = Math.max(4, Math.floor(Math.sqrt(totalGridCells / 2)));
    const lonDivisions = Math.max(8, Math.floor(Math.sqrt(totalGridCells * 2)));

    return new SpatialHash({
        radius,
        latitudeDivisions: latDivisions,
        longitudeDivisions: lonDivisions
    });
}
