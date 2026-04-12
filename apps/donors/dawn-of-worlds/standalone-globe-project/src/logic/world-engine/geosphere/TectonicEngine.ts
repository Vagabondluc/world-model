
import { WorldConfig, Cell } from "../core/types";
import { SphereGraph } from "../core/SphereGraph";

export enum PlateType {
    OCEANIC,
    CONTINENTAL
}

export enum BoundaryType {
    CONVERGENT, // Plates moving toward each other
    DIVERGENT,  // Plates moving away from each other
    TRANSFORM,  // Plates sliding past each other
    NONE        // No boundary
}

export interface Vector2 {
    x: number;
    y: number;
}

export interface Plate {
    id: number;
    color: string; // for visualization
    type: PlateType;
    center: [number, number, number];
    velocity: Vector2; // Direction of movement relative to surface
    speed: number; // Magnitude of velocity
    cells: Set<number>;
}

export interface BoundaryInteraction {
    cellId: number;
    plate1Id: number;
    plate2Id: number;
    type: BoundaryType;
    pressure: number; // 0-1, higher means more compression
}

export class TectonicEngine {
    private plates: Plate[] = [];
    private cellOwner: Map<number, number> = new Map();
    private boundaryCells: Set<number> = new Set();

    constructor(private config: WorldConfig) { }

    public generatePlates(graph: SphereGraph): void {
        console.log(`Generating ${this.config.plateCount} tectonic plates...`);

        // 1. Pick random cell centers for plates
        const cellCount = graph.getCellCount();
        const centers: number[] = [];
        for (let i = 0; i < this.config.plateCount; i++) {
            centers.push(Math.floor(Math.random() * cellCount));
        }

        // 2. Flood fill (Voronoi)
        // BFS from all centers simultaneously to assign ownership
        const queue: number[] = [...centers];

        // Initialize plates with proper center positions
        this.plates = centers.map((centerId, index) => {
            const vertex = graph.mesh.vertices[centerId];
            return {
                id: index,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                type: Math.random() > 0.6 ? PlateType.CONTINENTAL : PlateType.OCEANIC,
                center: [vertex.x, vertex.y, vertex.z],
                velocity: { x: (Math.random() - 0.5), y: (Math.random() - 0.5) },
                speed: 0.01 + Math.random() * 0.02, // Random speed between 0.01 and 0.03
                cells: new Set([centerId])
            };
        });

        const ownership = new Map<number, number>(); // cellId -> plateId
        centers.forEach((c, i) => ownership.set(c, i));

        // OPTIMIZED BFS: Use index pointer instead of shift() to avoid O(N^2)
        let queueIndex = 0;

        while (queueIndex < queue.length) {
            const currentCell = queue[queueIndex++]; // O(1)
            const ownerPlateId = ownership.get(currentCell)!;

            const neighbors = graph.getNeighbors(currentCell);
            for (const neighbor of neighbors) {
                if (!ownership.has(neighbor)) {
                    ownership.set(neighbor, ownerPlateId);
                    this.plates[ownerPlateId].cells.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        // Cache cell ownership for faster lookups
        this.cellOwner = ownership;

        console.log("Plate generation complete.");
    }

    /**
     * Move plates based on their velocity vectors
     * This is a simplified movement model - in reality, plate movement is much more complex
     */
    public movePlates(_graph: SphereGraph): void {
        console.log("Moving tectonic plates...");

        // For each plate, update the center position based on velocity
        for (const plate of this.plates) {
            // Convert 2D velocity to 3D movement on sphere surface
            // This is a simplified approximation
            const speed = plate.speed;
            const dx = plate.velocity.x * speed;
            const dy = plate.velocity.y * speed;

            // Update center position (simplified - actual movement would be more complex)
            plate.center[0] += dx;
            plate.center[1] += dy;

            // Normalize to keep on sphere surface
            const length = Math.sqrt(
                plate.center[0] ** 2 + plate.center[1] ** 2 + plate.center[2] ** 2
            );
            if (length > 0) {
                plate.center[0] = (plate.center[0] / length) * this.config.radius;
                plate.center[1] = (plate.center[1] / length) * this.config.radius;
                plate.center[2] = (plate.center[2] / length) * this.config.radius;
            }
        }

        console.log("Plate movement complete.");
    }

    /**
     * Resolve plate boundaries and determine interaction types
     * Returns a map of cell IDs to boundary interactions
     */
    public resolveBoundaries(graph: SphereGraph): Map<number, BoundaryInteraction> {
        console.log("Resolving plate boundaries...");

        const interactions = new Map<number, BoundaryInteraction>();
        this.boundaryCells.clear();

        // Rebuild cell owner map in case plates have changed
        this.rebuildCellOwnerMap();

        const cellCount = graph.getCellCount();

        for (let i = 0; i < cellCount; i++) {
            const myPlateId = this.cellOwner.get(i);
            if (myPlateId === undefined) continue;

            const neighbors = graph.getNeighbors(i);
            for (const n of neighbors) {
                const neighborPlateId = this.cellOwner.get(n);
                if (neighborPlateId !== undefined && neighborPlateId !== myPlateId) {
                    // This is a boundary cell
                    this.boundaryCells.add(i);

                    // Determine interaction type
                    const p1 = this.plates[myPlateId];
                    const p2 = this.plates[neighborPlateId];

                    // Calculate relative velocity
                    const relativeVx = p1.velocity.x - p2.velocity.x;
                    const relativeVy = p1.velocity.y - p2.velocity.y;

                    // Calculate dot product to determine if converging or diverging
                    // Get direction from p1 center to p2 center
                    const dirX = p2.center[0] - p1.center[0];
                    const dirY = p2.center[1] - p1.center[1];

                    const dotProduct = relativeVx * dirX + relativeVy * dirY;

                    // console.log(`Boundary Check: Cell ${i} P1(${myPlateId}) P2(${neighborPlateId}) Dot=${dotProduct.toFixed(2)} RelV=(${relativeVx},${relativeVy}) Dir=(${dirX},${dirY})`);

                    let boundaryType: BoundaryType;
                    let pressure = 0;

                    if (Math.abs(dotProduct) < 0.1) {
                        // Mostly perpendicular movement - transform boundary
                        boundaryType = BoundaryType.TRANSFORM;
                        pressure = 0.3;
                    } else if (dotProduct > 0) {
                        // Relative velocity (V1-V2) aligned with separation (P2-P1) means V1 catches up to V2 or V1 moves R and V2 moves L
                        // Wait, let's re-verify:
                        // P1(0) V(1), P2(10) V(-1) -> Rel(2) Dir(10) -> Dot(20) > 0.
                        // DISTANCE DECREASING. CONVERGENT.

                        // Moving toward each other - convergent boundary
                        boundaryType = BoundaryType.CONVERGENT;
                        // Calculate pressure based on relative speed and plate types
                        const relativeSpeed = Math.sqrt(relativeVx ** 2 + relativeVy ** 2);
                        pressure = Math.min(1.0, relativeSpeed * 20);

                        // Continental-Continental convergence creates more pressure
                        if (p1.type === PlateType.CONTINENTAL && p2.type === PlateType.CONTINENTAL) {
                            pressure *= 1.5;
                        }
                    } else {
                        // Moving away from each other - divergent boundary
                        boundaryType = BoundaryType.DIVERGENT;
                        pressure = 0.1;
                    }

                    interactions.set(i, {
                        cellId: i,
                        plate1Id: myPlateId,
                        plate2Id: neighborPlateId,
                        type: boundaryType,
                        pressure
                    });
                }
            }
        }

        console.log(`Found ${this.boundaryCells.size} boundary cells.`);
        return interactions;
    }

    /**
     * Apply boundary effects to cell heights
     * This includes mountain formation, subduction zones, and rift valleys
     */
    public applyBoundaryEffects(
        interactions: Map<number, BoundaryInteraction>,
        cells: Map<number, Cell>,
        graph: SphereGraph
    ): void {
        console.log("Applying boundary effects...");

        for (const [cellId, interaction] of interactions) {
            const cell = cells.get(cellId);
            if (!cell) continue;

            const p1 = this.plates[interaction.plate1Id];
            const p2 = this.plates[interaction.plate2Id];

            switch (interaction.type) {
                case BoundaryType.CONVERGENT:
                    // Convergent boundaries create mountains or subduction zones
                    if (p1.type === PlateType.CONTINENTAL && p2.type === PlateType.CONTINENTAL) {
                        // Continental-Continental: Mountain formation
                        cell.height += interaction.pressure * 0.15;
                    } else if (p1.type === PlateType.OCEANIC && p2.type === PlateType.CONTINENTAL) {
                        // Oceanic-Continental: Subduction, volcanic activity
                        cell.height += interaction.pressure * 0.05;
                        // Create volcanic arc (simplified) - affect nearby cells
                        const neighborIds = graph.getNeighbors(cellId);
                        for (const neighborId of neighborIds) {
                            const neighbor = cells.get(neighborId);
                            if (neighbor) {
                                neighbor.height += interaction.pressure * 0.02;
                            }
                        }
                    } else if (p1.type === PlateType.CONTINENTAL && p2.type === PlateType.OCEANIC) {
                        // Continental-Oceanic: Subduction
                        cell.height += interaction.pressure * 0.05;
                    } else {
                        // Oceanic-Oceanic: Island arc formation
                        cell.height += interaction.pressure * 0.08;
                    }
                    break;

                case BoundaryType.DIVERGENT:
                    // Divergent boundaries create rift valleys and new crust
                    cell.height -= interaction.pressure * 0.03;
                    break;

                case BoundaryType.TRANSFORM:
                    // Transform boundaries create fault lines, minimal height change
                    cell.height += (Math.random() - 0.5) * 0.01;
                    break;
            }

            // Clamp height to reasonable bounds
            cell.height = Math.max(-0.9, Math.min(0.9, cell.height));
        }

        console.log("Boundary effects applied.");
    }

    private rebuildCellOwnerMap(): void {
        this.cellOwner.clear();
        for (const plate of this.plates) {
            for (const cellId of plate.cells) {
                this.cellOwner.set(cellId, plate.id);
            }
        }
    }

    public getBoundaryCells(): Set<number> {
        return this.boundaryCells;
    }

    public getPlates(): Plate[] {
        return this.plates;
    }

    public getPlateForCell(cellId: number): Plate | undefined {
        const plateId = this.cellOwner.get(cellId);
        if (plateId !== undefined) {
            return this.plates[plateId];
        }
        return undefined;
    }
}
