
import { WorldConfig, WorldState, Cell } from "./core/types";
import { SphereGraph } from "./core/SphereGraph";
import { TectonicEngine } from "./geosphere/TectonicEngine";
import { generateIcosphere } from "../globe/geometry/icosphere";
import { BiomeEngine } from "./biosphere/BiomeEngine";
import { HydraulicErosion } from "./geosphere/HydraulicErosion";
import { CivilizationEngine } from "./anthroposphere/CivilizationEngine";
import { SphereNoiseGenerator, NoiseConfig } from "../globe/generation/noiseGenerator";
import { HistoryEventType } from "./history/types";
import { RegionMap } from "./geosphere/RegionMap";
import { CultureMap } from "./anthroposphere/CultureMap";
import { BiomeType } from "../globe/rendering/BiomeColors";

export class WorldEngine {
    private state: WorldState;
    private graph: SphereGraph | null = null;
    private tectonicEngine: TectonicEngine | null = null;
    private noiseGenerator: SphereNoiseGenerator | null = null;

    constructor(config: WorldConfig) {
        this.state = {
            config,
            cells: new Map(),
            plates: [],
            regions: [],
            era: 0,
            isComplete: false
        };
    }

    public initialize(): void {
        console.log("Initializing World Engine with seed:", this.state.config.seed);

        // Step 1: Initialize Sphere Geometry
        const mesh = generateIcosphere({
            radius: this.state.config.radius,
            subdivisions: this.state.config.subdivisions ?? 3,
            cellCount: this.state.config.cellCount
        });

        this.graph = new SphereGraph(mesh);

        // Step 2: Initialize Noise Generator
        const seed = this.hashString(this.state.config.seed);
        this.noiseGenerator = new SphereNoiseGenerator(seed);

        // Step 3: Initialize Cells
        this.initializeCells();

        // Step 4: Initialize Tectonic Plates
        this.tectonicEngine = new TectonicEngine(this.state.config);
        this.tectonicEngine.generatePlates(this.graph);

        // Step 5: Apply initial plate effects to terrain
        this.applyInitialPlateEffects();

        // Finalize state
        this.state.isComplete = true;
        this.runAnthroposphere();

        console.log("World Engine initialization complete.");
    }

    private initializeCells(): void {
        if (!this.graph) return;

        const cellCount = this.graph.getCellCount();
        const mesh = this.graph.mesh;

        const noiseConfig: NoiseConfig = {
            scale: this.state.config.noiseScale ?? 2.0,
            octaves: this.state.config.noiseOctaves ?? 4,
            persistence: 0.5,
            lacunarity: 2.0,
            seed: this.hashString(this.state.config.seed)
        };

        for (let i = 0; i < cellCount; i++) {
            const vertex = mesh.vertices[i];
            const position: [number, number, number] = [vertex.x, vertex.y, vertex.z];

            // Calculate initial height using noise (base terrain)
            const noise = this.noiseGenerator!.getNoise(vertex, noiseConfig);
            const height = (noise - 0.5) * 0.3; // Initial small variations

            // Calculate temperature based on latitude (y-axis on unit sphere)
            const latitude = Math.asin(vertex.y / this.state.config.radius) * (180 / Math.PI);
            const temperature = this.calculateTemperature(latitude, height);

            // Calculate moisture using noise
            const moistureNoise = this.noiseGenerator!.getNoise(
                { x: vertex.x * 1.5, y: vertex.y * 1.5, z: vertex.z * 1.5 },
                { ...noiseConfig, scale: 1.5 }
            );
            const moisture = moistureNoise;

            const cell: Cell = {
                id: i,
                position,
                height,
                temperature,
                moisture,
                isPentagon: this.graph.getNeighbors(i).length === 5,
                biomeId: this.determineBiome(temperature, moisture, height)
            };

            this.state.cells.set(i, cell);
        }
    }

    private calculateTemperature(latitude: number, height: number): number {
        // Base temperature decreases with latitude (equator = 30°C, poles = -20°C)
        const baseTemp = 30 - Math.abs(latitude) * 0.55;
        // Use BiomeEngine for height adjustment (lapse rate)
        return BiomeEngine.applyLapseRate(baseTemp, height);
    }

    private determineBiome(temperature: number, moisture: number, height: number): BiomeType {
        return BiomeEngine.determineBiome(temperature, moisture, height);
    }

    private applyInitialPlateEffects(): void {
        if (!this.tectonicEngine || !this.graph) return;

        const plates = this.tectonicEngine.getPlates();
        this.state.plates = plates;

        // Apply plate type influence to cell heights
        const cellOwner = new Map<number, number>();
        plates.forEach(p => p.cells.forEach(c => cellOwner.set(c, p.id)));

        for (const [cellId, cell] of this.state.cells) {
            const plateId = cellOwner.get(cellId);
            if (plateId !== undefined) {
                const plate = plates[plateId];
                // Continental plates tend to be higher
                if (plate.type === 0) { // OCEANIC
                    cell.height -= 0.2; // Oceanic plates are lower
                } else { // CONTINENTAL
                    cell.height += 0.1; // Continental plates are higher
                }
            }
        }
    }

    public runStep(): void {
        this.state.era++;
        console.log(`Running world step ${this.state.era}...`);

        // Run Geosphere (tectonic processes)
        this.runGeosphere();

        // Run Erosion
        this.runErosion();

        // Update biomes based on new terrain
        this.updateBiomes();

        console.log(`Step ${this.state.era} complete.`);
    }


    private runGeosphere(): void {
        if (!this.tectonicEngine || !this.graph) return;

        // Move plates
        this.tectonicEngine.movePlates(this.graph);

        // Resolve collisions and determine boundary interactions
        const interactions = this.tectonicEngine.resolveBoundaries(this.graph);

        // Apply boundary effects (mountain formation, subduction, etc.)
        this.tectonicEngine.applyBoundaryEffects(interactions, this.state.cells, this.graph);

        // Run Hydraulic Erosion (Simulate a few thousand droplets per Era/Step)
        HydraulicErosion.erode(this.state.cells, this.graph, 5000);

        // Update Regions (Macroscopic Geography)
        this.state.regions = RegionMap.findRegions(this.state.cells, this.graph);

        // Assign Cultures (Deterministic based on Seed)
        CultureMap.assignCultures(this.state.regions, this.state.config.seed);

        // Player Culture Override
        if (this.state.config.playerCulture) {
            // Find a nice starting region. RegionMap guarantees height > 0, so even 'ocean' biome here means 'coastal land'
            const bestRegion = this.state.regions
                .filter(r => r.biome !== BiomeType.DEEP_OCEAN && r.biome !== BiomeType.SNOW)
                .sort((a, b) => b.area - a.area)[0]; // Largest region

            if (bestRegion) {
                console.log(`Applying Player Culture Override: ${this.state.config.playerCulture} to Region ${bestRegion.id}`);
                // Cast string to NameStyle (assuming valid input from UI)
                bestRegion.cultureId = this.state.config.playerCulture as any;
            }
        }

        console.log(`Region Analysis: Found ${this.state.regions.length} distinct regions.`);

        // Emit Erosion Events? (e.g. Major Rivers)
        // Find a region with high moisture/flux for narrative flavor
        const wetRegion = this.state.regions.find(r =>
            (r.biome === BiomeType.FOREST || r.biome === BiomeType.RAINFOREST || r.biome === BiomeType.TROPICAL_FOREST)
        );
        if (wetRegion) {
            this.emitHistoryEvent(HistoryEventType.RIVER_CARVED, { id: this.state.era, regionName: wetRegion.id }, wetRegion.id, wetRegion.cultureId);
        } else {
            this.emitHistoryEvent(HistoryEventType.RIVER_CARVED, { id: this.state.era });
        }

        // Update state with new plate data
        this.state.plates = this.tectonicEngine.getPlates();

        // Emit Tectonic Event
        this.emitHistoryEvent(HistoryEventType.TECTONICS_FORMED, { id: this.state.era });
    }

    private runAnthroposphere(): void {
        if (!this.state.isComplete || !this.graph) return;

        // Place settlements
        // Attempt to place ~50 settlements for now
        CivilizationEngine.placeSettlements(this.state.cells, this.graph, 50);

        // Emit Civilization Events
        // Ideally we'd know WHICH cities founded, but for now just a summary or loop found cities
        let count = 0;
        for (const cell of this.state.cells.values()) {
            if (cell.settlementType === 'CITY' || cell.settlementType === 'VILLAGE') {
                // Sample event for first few
                if (count < 3) {
                    const region = this.state.regions.find(r => r.cells.includes(cell.id));
                    this.emitHistoryEvent(HistoryEventType.SETTLEMENT_FOUNDED, {
                        id: cell.id,
                        era: this.state.era, // Added timestamp
                        type: cell.settlementType,
                        location: cell.position
                    }, region?.id, region?.cultureId);
                }
                count++;
            }
        }
    }

    private emitHistoryEvent(type: string, data: any, regionId?: string, cultureId?: string): void {
        if (this.state.config.onHistoryEvent) {
            this.state.config.onHistoryEvent({ type, data, regionId, cultureId });
        }
    }

    private runErosion(): void {
        // Simplified erosion: smooth heights slightly
        const newHeights = new Map<number, number>();

        for (const [cellId, cell] of this.state.cells) {
            const neighbors = this.graph!.getNeighbors(cellId);
            let totalHeight = cell.height;
            let count = 1;

            for (const neighborId of neighbors) {
                const neighbor = this.state.cells.get(neighborId);
                if (neighbor) {
                    totalHeight += neighbor.height;
                    count++;
                }
            }

            // Apply slight smoothing
            const avgHeight = totalHeight / count;
            const erosionRate = 0.05;
            newHeights.set(cellId, cell.height * (1 - erosionRate) + avgHeight * erosionRate);
        }

        // Apply new heights
        for (const [cellId, newHeight] of newHeights) {
            const cell = this.state.cells.get(cellId);
            if (cell) {
                cell.height = newHeight;
            }
        }
    }

    private updateBiomes(): void {
        for (const cell of this.state.cells.values()) {
            const latitude = Math.asin(cell.position[1] / this.state.config.radius) * (180 / Math.PI);
            cell.temperature = this.calculateTemperature(latitude, cell.height);
            cell.biomeId = this.determineBiome(cell.temperature, cell.moisture, cell.height);
        }
    }

    public getWorldState(): WorldState {
        return this.state;
    }

    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}
