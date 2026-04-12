# Raw Extract: Google Gemini 2.pdf

- Source: `Google Gemini 2.pdf`
- Pages: 5

## Page 1

Technical Specification: Tectonic Voxel Engine (Three.js)
Version: 1.1 Target Platform: WebGL (Three.js) Core Concept: Spherical Voxel Planet with
Dynamic Plate Tectonics
1.0 System Overview
This system simulates a living planetary crust using a voxel-based coordinate system. Unlike
standard heightmap terrains, this engine models the movement of tectonic plates to
dynamically generate geological features (mountains, rifts, volcanic belts) and ecological
hotspots (resource veins, geothermal life).
1.1 Core Philosophy
Geology Drives Ecology: Life and resources are not placed randomly; they are procedural
byproducts of tectonic stress and heat.
Voxel Volumetrics: The world is not a thin skin; it is a volume of discrete units allowing for
caves, overhangs, and verticality.
2.0 Mathematical Model
2.1 Coordinate System: The Voxel Sphere
To avoid the "pole pinching" distortion of standard UV spheres, the engine shall use a Fibonacci
Sphere distribution or a Normalized Cube mapping for voxel placement.
Voxel Definition:V = { position: Vector3, type: Enum, state: Object }
Filtering: Only generate voxels within a specific radius band ( ) to
create a crust "shell" rather than a solid ball, optimizing memory.
2.2 Plate Generation (Organic Growth)
Standard Voronoi creates unnatural straight lines. To achieve organic, continental shapes, the
system shall use a Noise-Weighted Flood Fill.
1. Seed Points: Generate  quasi-random points (e.g., Fibonacci Lattice or Poisson Disk) on
the unit sphere surface to act as plate nuclei.
2. Density Field: Generate a static 3D Noise field (Simplex or Perlin) over the sphere. This
represents the "density" or "resistance" of the crust.
3. Weighted Expansion (Dijkstra): * Initialize a priority queue with all seeds.
R  <inner d<R  
outer
N

## Page 2

Expand outwards from seeds to neighbor voxels.
Cost Function: .
High-noise areas act as barriers, causing boundaries to wrap around them naturally,
creating jagged, realistic coastlines and plate borders.
4. Plate Object:
interface Plate {
    id: number;
    center: Vector3;
    color: Color;
    // The axis around which the plate rotates
    driftAxis: Vector3; 
    // Radians per tick
    velocity: number; 
}
3.0 Tectonic Kinematics Engine
The engine must calculate interaction vectors at the boundaries where Voxel  (Plate )
touches Voxel  (Plate ).
3.1 Boundary Detection
A voxel is flagged as IS_BOUNDARY if any of its 6 cardinal neighbors belong to a different
PlateID .
3.2 Interaction Vectors
For every boundary voxel, calculate the Stress Vector ( ):
Where  is the normal vector pointing from Plate 1's center to Plate 2's center.
3.3 Deformation Types
Based on the Stress Vector ( ), categorize the boundary:
Cost=1+(NoiseValue∗Weight)
A P 
1
B P 
2
S
S=  ⋅Vplate1
 −Nboundary
 ⋅Vplate2
 Nboundary
 Nboundary
S

## Page 3

Interaction Math Condition Resulting Voxel
Type
Feature
Convergent MOUNTAIN Uplift (Y-axis extrusion), High Stress.
Divergent MAGMA / LAVA Crust deletion, Mantle exposure, Heat
generation.
Transform FAULT Friction, lateral shear, high seismic risk.
4.0 The Volcanic Belt System
Volcanic activity is not random; it creates a distinct "ring" around plate edges.
4.1 Heat Propagation
Source: All Divergent boundaries (Rifts) and High-Stress Convergent boundaries
(Subduction zones) emit heat.
Decay: Heat attenuates by inverse square distance from the boundary voxel.
Visuals: Voxels above a specific heat threshold use an emissive shader (Magma).
4.2 Eruption Logic
If Stress > Critical_Limit, the engine triggers an "Eruption Event":
1. Spawn new voxels on top of existing boundary voxels.
2. Type: BASALT or OBSIDIAN.
3. Reset local stress (simulating energy release).
5.0 Resource & Ecology Distribution
In this model, scarcity is inverted. The dangerous zones are the most profitable.
5.1 The "Goldilocks" Danger Zone
Resources and Life utilize a Risk/Reward Probability Map derived from the Tectonic
Kinematics.
Algorithm:
1. Calculate DangerScore ( ) based on proximity to MAGMA or MOUNTAIN stress.
2. Calculate SustainabilityScore ( ) = Inverse of EruptionFrequency .
S>Threshold
S<−Threshold
∥S∥\appr
D
K

## Page 4

3. Spawn Zone: Target voxels where  (High Energy) AND  (Not immediately
destroyed). This creates rings of life adjacent to volcanoes, but not inside them.
5.2 Mineralization (Resource Veins)
Precious materials spawn where pressure is highest.
Spawn Logic:Probability = f(Stress).
Location: Inside MOUNTAIN voxels (Convergent boundaries).
Types:
Gold/Metals: Spawn deep in the uplifted column.
Crystals: Spawn on the surface of high-stress transform faults (piezoelectric logic).
5.3 Extremophile Biology
Life is abundant near volcanic heat (Geothermal dependency).
Spawn Logic:Probability = f(Heat).
Location:FAULT and RUST zones adjacent to MAGMA.
Biomes:
Vent Gardens: Tube worms/bioluminescent moss near lava.
Ash Groves: Trees that consume volcanic soil near subduction zones.
6.0 Rendering Architecture (Three.js)
To render 100k+ voxels on a sphere, standard meshes will fail. We must use Instancing.
6.1 InstancedMesh Strategy
Geometry: Single BoxGeometry (1,1,1).
Material:MeshStandardMaterial or a custom ShaderMaterial.
State Management:
Use InstancedMesh.setMatrixAt(index, matrix) to handle position (on sphere
surface) and scale (height of mountains).
Use InstancedMesh.setColorAt(index, color) to visualize biome types.
6.2 Optimization: Octree or Chunking
Divide the sphere into 6 faces (Cube-Sphere projection).
Only recalculate geometry updates for "Active Plates" (dirty flag pattern).
D>0.6 K>0.4

## Page 5

6.3 Shader Requirements
Magma Pulse: Shader uniform uTime to animate emissive intensity of MAGMA voxels.
Bloom/Post-Processing: Use UnrealBloomPass in Three.js. Magma voxels rely on
emission; without a bloom filter, they will just look flat red instead of glowing hot. This is
critical for the 'Volcanic Belt' visual.
7.0 Simulation Loop logic
1. Input: User rotates/drifts plates manually or automatic drift.
2. Physics Step:
Update Plate Vectors.
Calculate Stress at boundaries.
Apply Height Offsets (Mountains grow, Rifts widen).
3. Ecology Step:
Check for "Dead" voxels (cooled lava becomes rock).

