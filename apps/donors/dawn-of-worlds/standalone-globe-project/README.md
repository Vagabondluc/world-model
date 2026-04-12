# Standalone Globe Project

A 3D procedural world generation and visualization system that renders an interactive icosphere globe with hexagonal cell overlays. Built with modern web technologies, this project demonstrates advanced procedural generation techniques for creating realistic planetary surfaces with diverse biomes.

## Features

- **Procedural World Generation**: Generate unique, random worlds using configurable seed values
- **Icosphere Rendering**: High-quality 3D globe rendering using Three.js with adjustable subdivision levels
- **Hexagonal Grid Overlay**: Visual hex grid system covering the entire sphere surface
- **13 Biome Types**: Diverse biome classification based on Whittaker diagram:
  - Arctic
  - Coastal
  - Desert
  - Forest
  - Grassland
  - Hills
  - Jungle
  - Mountain
  - Swamp
  - Urban
  - Volcanic
  - Ocean
  - Lake
- **Noise-Based Generation**: Uses OpenSimplex Noise for natural-looking terrain features
- **Multi-Layer Climate System**: Height, temperature, and moisture-based biome determination
- **Latitude-Based Temperature**: Realistic temperature gradients from equator to poles
- **Interactive Controls**: Mouse-based orbit, zoom, and pan controls
- **Configurable Parameters**: Adjust globe radius, subdivisions, cell count, and more

## Tech Stack

- **React 18.2.0** - UI component library
- **TypeScript 5.2.2** - Type-safe JavaScript
- **Three.js 0.160.0** - 3D graphics rendering engine
- **Vite 5.0.8** - Fast build tool and dev server
- **OpenSimplex Noise 2.5.0** - Procedural noise generation
- **OGL 1.0.11** - Lightweight WebGL alternative

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd standalone-globe-project

# Install dependencies
npm install
```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:4180`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
standalone-globe-project/
├── src/
│   ├── components/
│   │   └── globe/
│   │       └── GlobeRenderer.tsx    # React component wrapper for globe rendering
│   ├── logic/
│   │   ├── globe/
│   │   │   ├── generation/
│   │   │   │   ├── biomeMapper.ts   # Biome classification logic
│   │   │   │   └── noiseGenerator.ts # Noise generation utilities
│   │   │   ├── geometry/
│   │   │   │   ├── icosphere.ts     # Icosphere mesh generation
│   │   │   │   ├── vec3.ts          # 3D vector operations
│   │   │   │   └── __tests__/
│   │   │   │       └── icosphere.test.ts
│   │   │   ├── overlay/
│   │   │   │   └── hexGrid.ts       # Hex grid generation on sphere
│   │   │   ├── rendering/
│   │   │   │   ├── cellMesher.ts    # Cell mesh generation
│   │   │   │   ├── hexOverlay.ts    # Hex overlay rendering
│   │   │   │   └── threeRenderer.ts # Three.js renderer implementation
│   │   │   ├── index.ts             # Module exports
│   │   │   └── types.ts             # Type definitions
│   │   └── world-engine/             # Advanced world generation engine
│   │       ├── WorldEngine.ts
│   │       ├── test_engine.ts
│   │       ├── core/
│   │       │   ├── SphereGraph.ts
│   │       │   └── types.ts
│   │       └── geosphere/
│   │           └── TectonicEngine.ts
│   ├── index.css                    # Global styles
│   └── main.tsx                     # Application entry point
├── docs/
│   ├── references/
│   │   └── guide_to_mapping/        # World mapping documentation
│   └── specs/                       # Technical specifications
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # Node TypeScript configuration
└── vite.config.ts                   # Vite build configuration
```

## Development Notes

### Biome Generation System

The biome system uses a multi-factor approach:

1. **Height (Elevation)**: Generated using OpenSimplex Noise with configurable octaves
2. **Temperature**: Combination of noise and latitude-based gradients
3. **Moisture**: Separate noise layer for humidity distribution

Biomes are determined using a simplified Whittaker classification:
- **Water biomes**: Below sea level threshold
- **Coastal biomes**: Transition zone near sea level
- **Mountain biomes**: Above mountain level threshold
- **Land biomes**: Based on temperature and moisture combinations

### Configuration Options

The [`GlobeRenderer`](src/components/globe/GlobeRenderer.tsx:20) component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `radius` | `number` | `1.0` | Globe radius |
| `subdivisions` | `number` | `3` | Icosphere subdivision level (higher = more detailed) |
| `cellCount` | `number` | `100` | Approximate number of hex cells |
| `showHexGrid` | `boolean` | `true` | Show/hide hex overlay |
| `generatorType` | `GeneratorType` | `SIMPLEX` | Biome generation method |
| `seed` | `number` | `12345` | Random seed for reproducible worlds |

### Hex Grid Generation

The hex grid uses Fibonacci sphere distribution for even point placement across the sphere surface. Each cell includes:
- Center position (3D coordinates)
- Vertex positions for hexagon/pentagon shape
- Neighbor references
- Biome classification
- Environmental data (height, temperature, moisture)

### Testing

Run the icosphere tests:

```bash
# Tests are located in src/logic/globe/geometry/__tests__/
# Use your preferred test runner
```

## Future Roadmap / TODO

- [ ] Add interactive cell selection and inspection
- [ ] Implement camera presets (equator view, pole view, etc.)
- [ ] Add biome color customization options
- [ ] Implement river and lake generation
- [ ] Add cloud/atmosphere layer
- [ ] Implement day/night cycle
- [ ] Add export functionality (JSON, image, etc.)
- [ ] Implement tectonic plate simulation
- [ ] Add vegetation and tree rendering
- [ ] Implement water level adjustment
- [ ] Add biome statistics and distribution charts
- [ ] Implement world history/time simulation
- [ ] Add preset world templates (Earth-like, Mars-like, etc.)
- [ ] Implement multiplayer/world sharing features
- [ ] Add audio effects (ocean waves, wind, etc.)
- [ ] Optimize performance for larger cell counts
- [ ] Add VR/AR support

## License

Private project - All rights reserved

## Contributing

This is a standalone project. For questions or suggestions, please contact the development team.
