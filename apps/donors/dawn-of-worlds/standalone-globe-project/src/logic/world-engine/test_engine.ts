
import { generateIcosphere } from "../globe/geometry/icosphere";
import { SphereGraph } from "./core/SphereGraph";
import { TectonicEngine } from "./geosphere/TectonicEngine";
import { WorldConfig } from "./core/types";

const config: WorldConfig = {
    seed: "test-seed",
    radius: 100,
    axialTilt: 23.5,
    plateCount: 10
};

console.log("Starting World Engine Test...");

// 1. Generate Mesh
console.log("Generating Icosphere...");
const mesh = generateIcosphere({ radius: 100, subdivisions: 2 });
console.log(`Mesh generated: ${mesh.vertices.length} vertices, ${mesh.faces.length} faces.`);

// 2. Build Graph
console.log("Building SphereGraph...");
const graph = new SphereGraph(mesh);
console.log(`Graph built with ${graph.getCellCount()} cells.`);

// 3. Run Tectonics
console.log("Initializing TectonicEngine...");
const tectonic = new TectonicEngine(config);
tectonic.generatePlates(graph);
tectonic.resolveBoundaries(graph);

console.log("Test Complete.");
