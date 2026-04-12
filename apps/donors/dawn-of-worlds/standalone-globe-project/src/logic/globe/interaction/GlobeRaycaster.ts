import * as THREE from 'three';
import { HexCell } from '../overlay/hexGrid';
import { SpatialHash } from '../rendering/spatialHash';
import { vec3 } from '../geometry/vec3';

export class GlobeRaycaster {
    private raycaster: THREE.Raycaster;
    private spatialHash: SpatialHash | null = null;
    private cells: HexCell[] = [];

    constructor() {
        this.raycaster = new THREE.Raycaster();
    }

    setCells(cells: HexCell[]): void {
        this.cells = cells;
        // Re-create spatial hash
        // We import createSpatialHash internally or just use manual lookup for now, 
        // but integrating spatialHash here is better.
        // Assuming SpatialHash interface is available.
        // For simplicity and dependency reasons, we might just inject it, 
        // but let's stick to being a wrapper.
    }

    setSpatialHash(spatialHash: SpatialHash): void {
        this.spatialHash = spatialHash;
    }

    /**
     * Get the cell at the given normalized device coordinates (-1 to +1)
     */
    getCellAt(mouse: THREE.Vector2, camera: THREE.Camera, sphereMesh: THREE.Object3D): HexCell | null {
        this.raycaster.setFromCamera(mouse, camera);

        const intersects = this.raycaster.intersectObject(sphereMesh);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            return this.findClosestCell(point);
        }

        return null;
    }

    private findClosestCell(point: THREE.Vector3): HexCell | null {
        if (this.spatialHash) {
            return this.spatialHash.findNearestCell({ x: point.x, y: point.y, z: point.z });
        }

        // Fallback: Linear search (slow)
        let closest: HexCell | null = null;
        let minDist = Infinity;
        const p = { x: point.x, y: point.y, z: point.z };

        for (const cell of this.cells) {
            const dist = vec3.distance(cell.center, p);
            if (dist < minDist) {
                minDist = dist;
                closest = cell;
            }
        }
        return closest;
    }
}
