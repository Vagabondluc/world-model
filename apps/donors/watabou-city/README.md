<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Watabou City Generator with Complete Addenda Implementation (A1, A2, A3, A4)

This project implements a procedurally generated city generator with comprehensive features based on four Product-Contract Addenda: A1 (Global Tessellation Scaffold), A2 (River System Semantics), A3 (Local Structure and Perimeter Quality), and A4 (Functional Plausibility). The generator creates realistic city layouts with proper scaffolding, river systems, perimeter quality, fortifications, road networks, building placement, and district organization.

View your app in AI Studio: https://ai.studio/apps/671d4fc2-0f98-45be-92ac-171d8b9db396

## Features

### Complete Addenda Implementation

The system implements four comprehensive addenda with a total of 92 rules organized by priority:

#### A1: Global Tessellation Scaffold (21 rules)
- **Scaffold Integrity**: Full domain coverage and topology availability
- **Seed Distribution**: Central-peripheral density with selective relaxation
- **Scaffold-Driven Dependencies**: Wall extraction, gate placement, and routing
- **Constraint Priority**: Deterministic retry and conformance checks

#### A2: River System Semantics (24 rules)
- **River Topology**: Deterministic generation with continuous centerlines
- **Hydro-Aware Placement**: Boundary, road, district, and building awareness
- **Crossing Resolution**: Road-river intersections with bridge connectivity
- **Constraint Priority**: Hydro constraint precedence and retry policies

#### A3: Local Structure and Perimeter Quality (13 rules)
- **Wall Geometry**: North wall smoothness and tower spacing
- **Vegetation Management**: Clip buffers and perimeter flow
- **Rural Integration**: Farmland egress alignment and density balance
- **Constraint Priority**: Addendum precedence and conformance checks

#### A4: Functional Plausibility (34 rules)

#### P0 Hard Correctness Constraints
- **Building-Wall Collision Masking**: Ensures no buildings intersect walls or towers
- **Interior Wall Clear Zone**: Maintains clear areas inside walls
- **Road-Wall Intersection Gate Resolution**: Places gates at road-wall intersections
- **River-Wall Intersection Resolution**: Handles river crossings with appropriate structures
- **Bridge Validity**: Enforces bridge count limits and connectivity
- **Geometry-First Layer Integrity**: Resolves collisions in geometry phase
- **Wall Thickness Scaling**: Computes wall dimensions based on world scale
- **Tower Radius Proportionality**: Derives tower dimensions from walls
- **Tower Rhythm and Spacing**: Ensures proper tower placement

#### P1 Structural Plausibility Constraints
- **Street Hierarchy**: Creates arterial, collector, and local road tiers
- **Blocks as First-Class Geometry**: Generates explicit block polygons
- **Parcel Frontage Alignment**: Aligns buildings with streets
- **Density Gradient**: Implements center-out density patterns
- **Public Squares**: Generates structured open spaces
- **Riverbank Setback**: Maintains proper distances from rivers
- **Quay and Embankment Semantics**: Creates waterfront structures
- **Bridgeheads**: Generates nodes at bridge endpoints
- **Gate Count by Perimeter**: Calculates gates based on access demand
- **Gate Typology**: Supports different gate types
- **Wall Alignment**: Scores wall paths based on terrain

#### P2 Readability and Outskirts Semantics
- **External Route Continuation**: Connects gates to external network
- **Farmland Access Placement**: Clusters farmland near access points
- **Gate Suburbs**: Generates suburban developments
- **District Polygons and Naming**: Creates named districts
- **Label Placement**: Positions labels without collisions
- **Landmark Anchoring**: Places landmarks at significant points
- **Tessellation Control**: Manages debug overlay visibility
- **Road Negative-Space Readability**: Ensures visual clarity
- **District-Based Building Typology**: Varies building styles by district
- **Symbol Weight Consistency**: Maintains visual hierarchy

#### P3 Controls, Diagnostics, and Testing
- **Deterministic Seed Replay**: Ensures reproducible generation
- **Constraint Violation Overlay**: Highlights violations for debugging
- **Auto-Fix Passes**: Automatically resolves common issues
- **Property-Based Tests**: Validates invariants across inputs

### Core Architecture

- **Modular Design**: Components organized by domain (boundary, roads, buildings, etc.)
- **Test-Driven Development**: All features implemented with comprehensive tests
- **Configuration-Driven**: All aspects configurable through JSON
- **Performance Optimized**: Efficient algorithms for large-scale generation
- **Extensible**: Plugin architecture for custom features

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/watabou-city-clean-room.git
   cd watabou-city-clean-room/2nd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local to add your GEMINI_API_KEY
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Basic Usage Examples

#### Generate a Default City
```typescript
import { generateCity } from './src/pipeline/generateCity';

// Generate a city with default configuration
const city = generateCity(12345, 'release');

// Render the city
const renderer = new CityRenderer();
const svg = renderer.render(city);
```

#### Generate a City with Custom Configuration
```typescript
import { loadConfiguration } from './src/config/loader';

// Load custom configuration
const config = loadConfiguration('configs/fortified-city.json');

// Generate city with custom configuration
const city = generateCityWithConfig(12345, 'release', config);
```

#### Enable Debug Features
```typescript
// Generate city with violation overlay
const city = generateCity(12345, 'debug');

// Create violation overlay
const violationOverlay = new ViolationOverlay();
const violations = violationOverlay.generateViolationOverlay(city);

// Render with violations
const renderer = new DebugRenderer();
const svg = renderer.renderWithViolations(city, violations);
```

## Documentation

### TDD Implementation Plans
- [A1 TDD Implementation Plan](TDD_IMPLEMENTATION_PLAN_A1.md) - Global Tessellation Scaffold
- [A2 TDD Implementation Plan](TDD_IMPLEMENTATION_PLAN_A2.md) - River System Semantics
- [A3 TDD Implementation Plan](TDD_IMPLEMENTATION_PLAN_A3.md) - Local Structure and Perimeter Quality
- [A4 TDD Implementation Plan](TDD_IMPLEMENTATION_PLAN.md) - Functional Plausibility

### Architecture Documentation
- [A1 Scaffold Architecture](docs/architecture/A1-scaffold-architecture.md) - Global Tessellation Scaffold
- [A2 River Architecture](docs/architecture/A2-river-architecture.md) - River System Semantics
- [A3 Local Structure Architecture](docs/architecture/A3-local-structure-architecture.md) - Local Structure and Perimeter Quality
- [A4 Functional Plausibility Architecture](docs/architecture/A4-functional-plausibility.md) - Functional Plausibility

### API Documentation
- [A1 Scaffold API](docs/api/A1-scaffold-classes.md) - Global Tessellation Scaffold classes
- [A2 River API](docs/api/A2-river-classes.md) - River System classes
- [A3 Local Structure API](docs/api/A3-local-structure-classes.md) - Local Structure classes
- [P0 Classes](docs/api/P0-classes.md) - Hard correctness constraints
- [P1 Classes](docs/api/P1-classes.md) - Structural plausibility constraints
- [P2 Classes](docs/api/P2-classes.md) - Readability and outskirts semantics
- [P3 Classes](docs/api/P3-classes.md) - Controls, diagnostics, and testing

### Configuration Documentation
- [Unified Configuration](docs/configuration/unified-configuration.md)
  - All configuration parameters from A1, A2, A3, A4
  - Default values and valid ranges
  - Example configurations

### Testing Documentation
- [Unified Testing](docs/testing/unified-testing.md)
  - Testing strategy for all addenda
  - Test results summary
  - Adding new tests

### Product Contracts
- [Product-Contract Addendum A1](docs/normative/11-product-contract-addendum-a1.md) - Global Tessellation Scaffold
- [Product-Contract Addendum A2](docs/normative/12-product-contract-addendum-a2-rivers.md) - River System Semantics
- [Product-Contract Addendum A3](docs/normative/13-product-contract-addendum-a3-local-structure.md) - Local Structure and Perimeter Quality
- [Product-Contract Addendum A4](docs/normative/14-product-contract-addendum-a4-functional-plausibility.md) - Functional Plausibility

## Development

### Project Structure
```
src/
├── domain/           # Core domain logic
│   ├── boundary/     # Wall, gate, and tower logic
│   ├── roads/        # Road network generation
│   ├── buildings/     # Building placement and alignment
│   ├── districts/     # District generation
│   ├── structures/    # Bridges, squares, and features
│   ├── diagnostics/   # Validation and debugging
│   └── seed/         # Deterministic generation
├── adapters/         # External system integration
├── pipeline/         # Generation pipeline
└── svg-elements/     # SVG rendering components

tests/
├── conformance/      # Rule compliance tests
├── unit/            # Component unit tests
└── propertyTestGenerator.ts # Property-based test generation

docs/
├── architecture/     # System architecture
├── api/            # API documentation
├── configuration/   # Configuration guide
├── testing/        # Testing documentation
└── normative/      # Product contracts
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests by priority
npm run test:p0    # Hard correctness constraints
npm run test:p1    # Structural plausibility constraints
npm run test:p2    # Readability and outskirts semantics
npm run test:p3    # Controls, diagnostics, and testing

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Configuration

### Basic Configuration
```json
{
  "forbiddenMask": {
    "buildingSetback": 5.0,
    "towerBuffer": 3.0
  },
  "wallScaler": {
    "wallThicknessRatio": 0.02,
    "minStreetWidthRatio": 0.8,
    "maxStreetWidthRatio": 2.0
  },
  "deterministicGenerator": {
    "deterministicSeed": 12345
  }
}
```

### Advanced Configuration
See the [Configuration Documentation](docs/configuration/A4-configuration.md) for complete configuration options.

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Run the test suite
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add comprehensive tests for new features
- Update documentation for API changes

### Adding New Rules

1. Define rule in product contract
2. Create implementation class
3. Write comprehensive tests
4. Add configuration options
5. Update documentation

## Performance

### Benchmarks
- Small City (radius 500): <1s generation time
- Medium City (radius 1000): <3s generation time
- Large City (radius 2000): <10s generation time

### Optimization Tips
- Use appropriate configuration for your use case
- Enable debug features only during development
- Consider performance impact of strict validation

## Troubleshooting

### Common Issues

1. **Generation Failures**: Check configuration validity
2. **Performance Issues**: Reduce city size or disable validation
3. **Visual Artifacts**: Verify symbol weight configuration
4. **Test Failures**: Ensure all dependencies are installed

### Getting Help

- Check the [Testing Documentation](docs/testing/A4-testing.md) for test issues
- Review the [Configuration Documentation](docs/configuration/A4-configuration.md) for configuration problems
- Consult the [API Documentation](docs/api/) for implementation guidance
- Open an issue on GitHub for bug reports

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on the Watabou city generator concept
- Implements Product-Contract Addendum A4 specification
- Uses Turf.js for geometric operations
- Built with TypeScript and modern web technologies