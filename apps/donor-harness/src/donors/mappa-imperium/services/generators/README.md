# Map Generation Services

This directory contains the procedural generation algorithms for the Mappa Imperium world map.

## Algorithms

### 1. Imperial Architect (`imperialGenerator.ts`)
**Purpose**: Competitive Multiplayer, Balanced Starts.
- **Topology**: Deterministic.
- **Layouts**: 
    - **Rhombus (4 Players)**: Split into equal quadrants.
    - **Hexagon (1-3, 5-6 Players)**: Radial symmetry with ring-based sectors.
- **Features**:
    - **Capitals**: Places player capitals at specific, geometrically fair coordinates defined in the `Shared Hex Map Spec`.
    - **Regions**: Automatically partitions the board into player territories.
- **Parameters**: `playerCount`, `tier` (size).

### 2. Wilderness Weaver (`perlinGenerator.ts`)
**Purpose**: Exploration, Organic Terrain, Solo Play.
- **Topology**: Perlin Noise (Gradient Noise).
- **Features**:
    - **Biomes**: Generates realistic biomes based on Elevation + Moisture noise maps.
    - **Locations**: Spawns Dungeons, Settlements, and Landmarks based on density settings.
    - **Naming**: Includes a basic naming engine for flavor text.
- **Parameters**: 
    - `seed`: Random seed.
    - `radius`: Map radius.
    - `locationDensity` (0.0 - 2.0): Multiplier for generic POI spawn rate.
    - `settlementDensity` (0.0 - 2.0): Multiplier for city/town/village hierarchy.
    - `waterLevel`: Threshold for ocean generation.

## Key Utilities
- `hexUtils.ts`: Hexagonal grid math (distance, pixel conversion).
- `perlinNoise.ts`: Lightweight 2D noise implementation.
