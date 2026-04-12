# Map Generation TDD Specification

**Version:** 1.0.0  
**Last Updated:** 2026-01-28  
**Reference Implementations:** 
- [`src/services/generators/mapGenerator.ts`](../../src/services/generators/mapGenerator.ts)
- [`src/services/generators/imperialGenerator.ts`](../../src/services/generators/imperialGenerator.ts)
- [`src/services/generators/perlinGenerator.ts`](../../src/services/generators/perlinGenerator.ts)
- [`src/services/generators/perlinNoise.ts`](../../src/services/generators/perlinNoise.ts)

---

## Test Suite Overview

This test suite defines comprehensive test specifications for map generation algorithms used in the Mappa Imperium project. The map generation system includes two primary algorithms: Imperial (symmetric, competitive) and Wilderness (organic, procedural), both using Perlin noise for terrain generation.

### Key Functions Under Test

| Function | Purpose |
|----------|---------|
| `generateMap()` | Main entry point for map generation |
| `generateImperialMap()` | Generate symmetric hexagonal/rhombus maps |
| `generatePerlinMap()` | Generate organic Perlin-based maps |
| `PerlinNoise.noise()` | 2D Perlin noise generation |
| `PerlinNoise.octaveNoise()` | Multi-octave noise for natural terrain |
| `PerlinNoise.seed()` | Seed initialization for reproducibility |
| `getBiome()` | Map elevation/moisture to biome types |
| `stringToSeed()` | Convert string seeds to numeric values |

---

## Test Cases

### 1. PerlinNoise Class

#### Test 1.1: Constructor with default seed
- **Input:** `new PerlinNoise()`
- **Expected Output:** PerlinNoise instance initialized with random seed
- **Edge Cases:** None
- **Description:** Default constructor should create a valid instance

#### Test 1.2: Constructor with explicit seed
- **Input:** `new PerlinNoise(12345)`
- **Expected Output:** PerlinNoise instance initialized with seed 12345
- **Edge Cases:** None
- **Description:** Explicit seed should be used for initialization

#### Test 1.3: Seed initialization
- **Input:** `noise.seed(54321)`
- **Expected Output:** Permutation array should be re-initialized with new seed
- **Edge Cases:** None
- **Description:** Reseeding should produce different noise values

#### Test 1.4: Seed reproducibility
- **Input:** Same seed used twice
- **Expected Output:** Same noise values for same coordinates
- **Edge Cases:** None
- **Description:** Same seed should produce identical results

#### Test 1.5: Noise range
- **Input:** `noise.noise(0, 0)`
- **Expected Output:** Value between -1 and 1
- **Edge Cases:** None
- **Description:** Noise output should be in valid range

#### Test 1.6: Noise at origin
- **Input:** `noise.noise(0, 0)`
- **Expected Output:** Consistent value for given seed
- **Edge Cases:** None
- **Description:** Origin noise should be deterministic

#### Test 1.7: Noise at integer coordinates
- **Input:** `noise.noise(1, 0)`, `noise.noise(0, 1)`, `noise.noise(1, 1)`
- **Expected Output:** Values at integer coordinates
- **Edge Cases:** Integer coordinate boundaries
- **Description:** Integer coordinates should produce valid noise

#### Test 1.8: Noise at fractional coordinates
- **Input:** `noise.noise(0.5, 0.5)`, `noise.noise(1.3, 2.7)`
- **Expected Output:** Interpolated values
- **Edge Cases:** Fractional coordinates
- **Description:** Fractional coordinates should produce interpolated noise

#### Test 1.9: Negative coordinates
- **Input:** `noise.noise(-1, -1)`, `noise.noise(-5.5, 3.2)`
- **Expected Output:** Valid noise values
- **Edge Cases:** Negative coordinate values
- **Description:** Negative coordinates should work correctly

#### Test 1.10: Large coordinates
- **Input:** `noise.noise(1000, 1000)`, `noise.noise(10000.5, 5000.7)`
- **Expected Output:** Valid noise values
- **Edge Cases:** Large coordinate values
- **Description:** Large coordinates should produce valid noise

#### Test 1.11: Octave noise basic
- **Input:** `noise.octaveNoise(0, 0, 4, 0.5)`
- **Expected Output:** Value between -1 and 1
- **Edge Cases:** None
- **Description:** Octave noise should produce valid output

#### Test 1.12: Octave noise octaves
- **Input:** `noise.octaveNoise(0, 0, 1, 0.5)`, `noise.octaveNoise(0, 0, 8, 0.5)`
- **Expected Output:** Different complexity levels
- **Edge Cases:** Different octave counts
- **Description:** More octaves should produce more detail

#### Test 1.13: Octave noise persistence
- **Input:** `noise.octaveNoise(0, 0, 4, 0.1)`, `noise.octaveNoise(0, 0, 4, 0.9)`
- **Expected Output:** Different roughness levels
- **Edge Cases:** Different persistence values
- **Description:** Higher persistence should produce more variation

#### Test 1.14: Octave noise zero octaves
- **Input:** `noise.octaveNoise(0, 0, 0, 0.5)`
- **Expected Output:** Should handle gracefully
- **Edge Cases:** Zero boundary value
- **Description:** Zero octaves should be handled

#### Test 1.15: Octave noise reproducibility
- **Input:** Same parameters used twice
- **Expected Output:** Identical results
- **Edge Cases:** None
- **Description:** Octave noise should be deterministic

---

### 2. Perlin Noise - Reproducibility

#### Test 2.1: Same seed, same result
- **Input:** Two PerlinNoise instances with seed 12345
- **Expected Output:** Identical noise values for all coordinates
- **Edge Cases:** None
- **Description:** Same seed should produce identical noise

#### Test 2.2: Different seeds, different results
- **Input:** PerlinNoise instances with seeds 12345 and 54321
- **Expected Output:** Different noise values for same coordinates
- **Edge Cases:** None
- **Description:** Different seeds should produce different noise

#### Test 2.3: Seed persistence
- **Input:** Generate noise, reseed, generate again
- **Expected Output:** New seed produces new values, old seed still reproducible
- **Edge Cases:** None
- **Description:** Reseeding should not affect reproducibility of old seeds

#### Test 2.4: String seed conversion
- **Input:** `stringToSeed("test-seed-123")`
- **Expected Output:** Consistent numeric value
- **Edge Cases:** None
- **Description:** String seeds should convert consistently

#### Test 2.5: Empty string seed
- **Input:** `stringToSeed("")`
- **Expected Output:** Consistent numeric value (likely 0)
- **Edge Cases:** Empty string
- **Description:** Empty string should produce consistent seed

#### Test 2.6: Long string seed
- **Input:** `stringToSeed("a".repeat(1000))`
- **Expected Output:** Consistent numeric value
- **Edge Cases:** Long strings
- **Description:** Long strings should produce valid seeds

#### Test 2.7: Special characters in seed
- **Input:** `stringToSeed("test@#$%^&*()")`
- **Expected Output:** Consistent numeric value
- **Edge Cases:** Special characters
- **Description:** Special characters should be handled

---

### 3. Biome Mapping

#### Test 3.1: Ocean biome (low elevation)
- **Input:** `elevation = 0.2`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'ocean'`
- **Edge Cases:** None
- **Description:** Elevation below water level should be ocean

#### Test 3.2: Coastal biome (just above water)
- **Input:** `elevation = 0.32`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'coastal'`
- **Edge Cases:** Boundary value
- **Description:** Just above water level should be coastal

#### Test 3.3: Mountain biome (high elevation)
- **Input:** `elevation = 0.7`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'mountain'`
- **Edge Cases:** None
- **Description:** High elevation should be mountain

#### Test 3.4: Hill biome (medium-high elevation)
- **Input:** `elevation = 0.5`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'hill'`
- **Edge Cases:** None
- **Description:** Medium-high elevation should be hill

#### Test 3.5: Jungle biome (high moisture, medium elevation)
- **Input:** `elevation = 0.3`, `moisture = 0.6`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'jungle'`
- **Edge Cases:** None
- **Description:** High moisture should produce jungle

#### Test 3.6: Swamp biome (high moisture, low elevation)
- **Input:** `elevation = 0.35`, `moisture = 0.6`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'swamp'`
- **Edge Cases:** None
- **Description:** High moisture at low elevation should be swamp

#### Test 3.7: Forest biome (medium moisture)
- **Input:** `elevation = 0.35`, `moisture = 0.3`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'forest'`
- **Edge Cases:** None
- **Description:** Medium moisture should produce forest

#### Test 3.8: Grassland biome (low moisture)
- **Input:** `elevation = 0.35`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'grassland'`
- **Edge Cases:** None
- **Description:** Low moisture should produce grassland

#### Test 3.9: Desert biome (negative moisture)
- **Input:** `elevation = 0.35`, `moisture = -0.5`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'desert'`
- **Edge Cases:** Negative moisture values
- **Description:** Negative moisture should produce desert

#### Test 3.10: Underdark theme - underwater
- **Input:** `elevation = 0.2`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'underdark'`
- **Expected Output:** `'underwater'`
- **Edge Cases:** Different theme
- **Description:** Underdark theme should map differently

#### Test 3.11: Underdark theme - volcanic
- **Input:** `elevation = 0.4`, `moisture = -0.5`, `waterLevel = 0.3`, `theme = 'underdark'`
- **Expected Output:** `'volcanic'`
- **Edge Cases:** Different theme
- **Description:** Underdark theme should have volcanic areas

#### Test 3.12: Boundary - exact water level
- **Input:** `elevation = 0.3`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'ocean'`
- **Edge Cases:** Exact boundary
- **Description:** Elevation at water level should be ocean

#### Test 3.13: Boundary - exact mountain threshold
- **Input:** `elevation = 0.65`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'mountain'`
- **Edge Cases:** Exact boundary
- **Description:** Elevation at mountain threshold should be mountain

#### Test 3.14: Extreme elevation (1.0)
- **Input:** `elevation = 1.0`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'mountain'`
- **Edge Cases:** Maximum elevation
- **Description:** Maximum elevation should be mountain

#### Test 3.15: Extreme elevation (-1.0)
- **Input:** `elevation = -1.0`, `moisture = 0`, `waterLevel = 0.3`, `theme = 'surface'`
- **Expected Output:** `'ocean'`
- **Edge Cases:** Minimum elevation
- **Description:** Minimum elevation should be ocean

---

### 4. Imperial Map Generation

#### Test 4.1: 4-player rhombus map
- **Input:** `playerCount = 4`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Rhombus-shaped map with 4 equal quadrants
- **Edge Cases:** None
- **Description:** 4-player should produce rhombus with 4 regions

#### Test 4.2: 6-player hexagonal map
- **Input:** `playerCount = 6`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Hexagonal map with 6 equal sectors
- **Edge Cases:** None
- **Description:** 6-player should produce hexagon with 6 regions

#### Test 4.3: 3-player map
- **Input:** `playerCount = 3`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Hexagonal map with 3 equal sectors
- **Edge Cases:** None
- **Description:** 3-player should produce 3 regions

#### Test 4.4: 2-player map
- **Input:** `playerCount = 2`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Hexagonal map with 2 equal sectors
- **Edge Cases:** None
- **Description:** 2-player should produce 2 regions

#### Test 4.5: 1-player map
- **Input:** `playerCount = 1`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Hexagonal map with 1 region
- **Edge Cases:** None
- **Description:** 1-player should produce single region

#### Test 4.6: 5-player map
- **Input:** `playerCount = 5`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Hexagonal map with 5 regions (one neutral sector)
- **Edge Cases:** Odd player count
- **Description:** 5-player should have neutral area

#### Test 4.7: Small tier
- **Input:** `playerCount = 4`, `tier = 'small'`, `seed = 'test-seed'`
- **Expected Output:** Smaller rhombus map (n=6)
- **Edge Cases:** Small size
- **Description:** Small tier should produce smaller map

#### Test 4.8: Large tier
- **Input:** `playerCount = 4`, `tier = 'large'`, `seed = 'test-seed'`
- **Expected Output:** Larger rhombus map (n=10)
- **Edge Cases:** Large size
- **Description:** Large tier should produce larger map

#### Test 4.9: Region count matches player count
- **Input:** `playerCount = 4`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Exactly 4 regions
- **Edge Cases:** None
- **Description:** Region count should match player count

#### Test 4.10: Region hex count equality (4-player)
- **Input:** `playerCount = 4`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** All 4 regions have equal or nearly equal hex counts
- **Edge Cases:** None
- **Description:** 4-player regions should be equal size

#### Test 4.11: Region hex count equality (6-player)
- **Input:** `playerCount = 6`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** All 6 regions have equal or nearly equal hex counts
- **Edge Cases:** None
- **Description:** 6-player regions should be equal size

#### Test 4.12: Center hex handling
- **Input:** `playerCount = 6`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Center hex (0,0,0) assigned to a region
- **Edge Cases:** Center hex
- **Description:** Center hex should be assigned to a region

#### Test 4.13: All hexes assigned to regions
- **Input:** `playerCount = 4`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** Every hex belongs to exactly one region
- **Edge Cases:** None
- **Description:** No hex should be unassigned

#### Test 4.14: Reproducibility
- **Input:** Same parameters used twice
- **Expected Output:** Identical map structure
- **Edge Cases:** None
- **Description:** Same seed should produce identical map

#### Test 4.15: Default biome assignment
- **Input:** `playerCount = 4`, `tier = 'standard'`, `seed = 'test-seed'`
- **Expected Output:** All hexes assigned 'grassland' biome
- **Edge Cases:** None
- **Description:** Imperial maps should use default biome

---

### 5. Perlin Map Generation

#### Test 5.1: Basic map generation
- **Input:** `radius = 8`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Valid map with hexes and biomes
- **Edge Cases:** None
- **Description:** Basic parameters should produce valid map

#### Test 5.2: Hexagonal shape
- **Input:** `radius = 5`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Hexagonal arrangement of hexes
- **Edge Cases:** None
- **Description:** Map should be hexagonal in shape

#### Test 5.3: Hex count matches radius
- **Input:** `radius = 5`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Correct number of hexes for radius 5
- **Edge Cases:** None
- **Description:** Hex count should match formula

#### Test 5.4: Biome distribution
- **Input:** `radius = 10`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Variety of biomes present
- **Edge Cases:** None
- **Description:** Map should have biome variety

#### Test 5.5: Water level affects ocean count
- **Input:** `waterLevel = 0.5` vs `waterLevel = 0.2`
- **Expected Output:** Higher water level = more ocean hexes
- **Edge Cases:** Different water levels
- **Description:** Water level should affect biome distribution

#### Test 5.6: Moisture offset affects biome distribution
- **Input:** `moistureOffset = 0.5` vs `moistureOffset = -0.5`
- **Expected Output:** Different biome distributions
- **Edge Cases:** Different moisture offsets
- **Description:** Moisture offset should affect biomes

#### Test 5.7: Scale affects biome clustering
- **Input:** `scale = 10` vs `scale = 50`
- **Expected Output:** Different biome clustering patterns
- **Edge Cases:** Different scales
- **Description:** Scale should affect biome size

#### Test 5.8: Region generation
- **Input:** `numRegions = 3`, `radius = 10`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** 3 regions created
- **Edge Cases:** None
- **Description:** Should create specified number of regions

#### Test 5.9: Region hex assignment
- **Input:** `numRegions = 3`, `radius = 10`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Every hex assigned to closest region
- **Edge Cases:** None
- **Description:** Hexes should be assigned to nearest region center

#### Test 5.10: Region centers are valid hexes
- **Input:** `numRegions = 3`, `radius = 10`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Region centers are valid hex coordinates
- **Edge Cases:** None
- **Description:** Region centers should be on map

#### Test 5.11: Reproducibility
- **Input:** Same parameters used twice
- **Expected Output:** Identical map structure
- **Edge Cases:** None
- **Description:** Same seed should produce identical map

#### Test 5.12: Different seeds produce different maps
- **Input:** Different seeds with same parameters
- **Expected Output:** Different map structures
- **Edge Cases:** None
- **Description:** Different seeds should produce different maps

#### Test 5.13: Underdark theme
- **Input:** `theme = 'underdark'`, `radius = 10`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Underdark-specific biomes
- **Edge Cases:** Different theme
- **Description:** Underdark theme should use different biomes

#### Test 5.14: Zero radius
- **Input:** `radius = 0`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Map with only center hex
- **Edge Cases:** Zero boundary value
- **Description:** Zero radius should produce minimal map

#### Test 5.15: Large radius
- **Input:** `radius = 50`, `scale = 30`, `waterLevel = 0.3`, `seed = 'test-seed'`
- **Expected Output:** Large valid map
- **Edge Cases:** Large radius
- **Description:** Large radius should produce large map

---

### 6. Map Generator Main Entry

#### Test 6.1: Wilderness algorithm selection
- **Input:** `algorithm = 'wilderness'`, `seed = 'test-seed'`, `params = {...}`
- **Expected Output:** Perlin-based map
- **Edge Cases:** None
- **Description:** Wilderness algorithm should use Perlin generation

#### Test 6.2: Imperial algorithm selection
- **Input:** `algorithm = 'imperial'`, `seed = 'test-seed'`, `params = {...}`
- **Expected Output:** Imperial map
- **Edge Cases:** None
- **Description:** Imperial algorithm should use imperial generation

#### Test 6.3: Default parameter handling
- **Input:** Missing optional parameters
- **Expected Output:** Use default values
- **Edge Cases:** Missing parameters
- **Description:** Missing params should use defaults

#### Test 6.4: Return structure
- **Input:** Valid parameters
- **Expected Output:** Object with `hexBiomes`, `regions`, `locations`
- **Edge Cases:** None
- **Description:** Should return correct structure

#### Test 6.5: HexBiomes format
- **Input:** Valid parameters
- **Expected Output:** `hexBiomes` is Record<string, BiomeType>
- **Edge Cases:** None
- **Description:** hexBiomes should have correct format

#### Test 6.6: Regions format
- **Input:** Valid parameters
- **Expected Output:** `regions` is array of region objects
- **Edge Cases:** None
- **Description:** regions should have correct format

#### Test 6.7: Locations format
- **Input:** Valid parameters
- **Expected Output:** `locations` is array
- **Edge Cases:** None
- **Description:** locations should have correct format

#### Test 6.8: Invalid seed format handling
- **Input:** `seed = 12345` (numeric instead of string), `seed = null`, `seed = undefined`
- **Expected Output:** Should handle gracefully (convert to string or use default)
- **Edge Cases:** Invalid seed types
- **Description:** Should handle various seed input formats

---

### 7. Performance and Memory Tests

#### Test 7.1: Small map generation performance
- **Input:** `radius = 5` (91 hexes)
- **Expected Output:** Complete within 50ms
- **Edge Cases:** Small map
- **Description:** Small maps should generate very quickly

#### Test 7.2: Medium map generation performance
- **Input:** `radius = 10` (331 hexes)
- **Expected Output:** Complete within 200ms
- **Edge Cases:** Medium map
- **Description:** Medium maps should generate quickly

#### Test 7.3: Large map generation performance
- **Input:** `radius = 20` (1261 hexes)
- **Expected Output:** Complete within 1 second
- **Edge Cases:** Large map
- **Description:** Large maps should generate within acceptable time

#### Test 7.4: Extra large map generation performance
- **Input:** `radius = 50` (7651 hexes)
- **Expected Output:** Complete within 5 seconds
- **Edge Cases:** Extra large map
- **Description:** Extra large maps should still be usable

#### Test 7.5: Perlin noise generation performance
- **Input:** Generate noise for 10,000 coordinates
- **Expected Output:** Complete within 500ms
- **Edge Cases:** Bulk noise generation
- **Description:** Perlin noise should be performant

#### Test 7.6: Octave noise generation performance
- **Input:** Generate octave noise (4 octaves) for 10,000 coordinates
- **Expected Output:** Complete within 2 seconds
- **Edge Cases:** Bulk octave noise
- **Description:** Octave noise should be performant

#### Test 7.7: Memory usage - single map generation
- **Input:** Generate map with radius 20
- **Expected Output:** Memory usage should be within expected bounds (no leaks)
- **Edge Cases:** None
- **Description:** Single map generation should not leak memory

#### Test 7.8: Memory usage - sequential map generation
- **Input:** Generate 100 maps sequentially with radius 10
- **Expected Output:** Memory should not grow unbounded (garbage collection working)
- **Edge Cases:** Sequential operations
- **Description:** Sequential generation should not cause memory leaks

#### Test 7.9: Memory usage - concurrent map generation
- **Input:** Generate 10 maps concurrently with radius 10
- **Expected Output:** Memory should stay within safe bounds
- **Edge Cases:** Concurrent operations
- **Description:** Concurrent generation should not cause memory issues

#### Test 7.10: Biome mapping performance
- **Input:** Map biomes for 10,000 hexes
- **Expected Output:** Complete within 100ms
- **Edge Cases:** Bulk biome mapping
- **Description:** Biome mapping should be very fast

---

### 8. Stress Tests for Large Maps

#### Test 8.1: Maximum radius map
- **Input:** `radius = 100` (30,301 hexes)
- **Expected Output:** Valid map generated, complete within 30 seconds
- **Edge Cases:** Maximum practical size
- **Description:** Should handle maximum practical map size

#### Test 8.2: Stress test - rapid sequential generation
- **Input:** Generate 50 maps with radius 20 sequentially
- **Expected Output:** All maps generated successfully, no memory leaks
- **Edge Cases:** Rapid sequential operations
- **Description:** Should handle rapid sequential generation

#### Test 8.3: Stress test - concurrent generation
- **Input:** Generate 20 maps with radius 15 concurrently
- **Expected Output:** All maps generated successfully
- **Edge Cases:** Concurrent operations
- **Description:** Should handle concurrent generation

#### Test 8.4: Stress test - large imperial map
- **Input:** `playerCount = 6`, `tier = 'large'` (n=10)
- **Expected Output:** Valid map with equal regions
- **Edge Cases:** Large imperial map
- **Description:** Should handle large imperial maps

#### Test 8.5: Stress test - many regions
- **Input:** `numRegions = 20`, `radius = 30`
- **Expected Output:** Valid map with 20 regions
- **Edge Cases:** Many regions
- **Description:** Should handle many regions

#### Test 8.6: Stress test - extreme octave count
- **Input:** `octaves = 16`, `radius = 20`
- **Expected Output:** Valid map with high detail
- **Edge Cases:** Extreme octave count
- **Description:** Should handle extreme octave counts

#### Test 8.7: Stress test - memory under load
- **Input:** Generate maps with increasing radius (5, 10, 20, 40, 80) sequentially
- **Expected Output:** Memory should grow linearly with map size, not exponentially
- **Edge Cases:** Increasing load
- **Description:** Memory should scale appropriately

#### Test 8.8: Stress test - long-running generation
- **Input:** Generate maps continuously for 5 minutes
- **Expected Output:** No memory leaks, stable performance
- **Edge Cases:** Long-running operation
- **Description:** Should handle long-running operations

#### Test 8.9: Stress test - invalid input handling
- **Input:** Generate maps with invalid parameters (negative radius, zero radius, extreme values)
- **Expected Output:** Should handle gracefully or fail with clear error
- **Edge Cases:** Invalid inputs
- **Description:** Should handle invalid inputs under stress

#### Test 8.10: Stress test - seed collision
- **Input:** Generate 10,000 maps with random seeds, check for duplicates
- **Expected Output:** No duplicate maps (extremely unlikely)
- **Edge Cases:** Many random seeds
- **Description:** Random seeds should produce unique maps

---

## Test Categories

### Unit Tests
- Perlin noise generation tests
- Biome mapping tests
- Coordinate conversion tests
- Seed conversion tests

### Integration Tests
- Full map generation with specific parameters
- Reproducibility across multiple runs
- Region assignment validation
- Biome distribution validation

### Property-Based Tests
- **Reproducibility:** Same seed always produces same map
- **Biome coverage:** All biomes can be generated with appropriate parameters
- **Region coverage:** All hexes are assigned to regions
- **Hex count:** Hex count matches expected formula for given radius

---

## Mock Requirements

No mocks are required for map generation as it uses pure functions and deterministic algorithms.

---

## Test Data

### Sample World Settings
```typescript
const wildernessSettings: WorldSettings = {
  algorithm: 'wilderness',
  seed: 'test-seed-123',
  params: {
    radius: 10,
    scale: 30,
    waterLevel: 0.3,
    moistureOffset: 0,
    numRegions: 3,
    theme: 'surface'
  }
};

const imperialSettings: WorldSettings = {
  algorithm: 'imperial',
  seed: 'test-seed-456',
  params: {
    playerCount: 4,
    tier: 'standard'
  }
};
```

### Sample Perlin Settings
```typescript
const perlinSettings: PerlinGenerationSettings = {
  radius: 8,
  scale: 30,
  waterLevel: 0.3,
  moistureOffset: 0,
  seed: 'test-seed',
  numRegions: 3,
  theme: 'surface'
};
```

### Sample Imperial Settings
```typescript
const imperialSettings: ImperialSettings = {
  playerCount: 4,
  tier: 'standard',
  seed: 'test-seed'
};
```

### Test Seeds
```typescript
const testSeeds = [
  'test-seed-1',
  'test-seed-2',
  'test-seed-3',
  '',
  'a'.repeat(100),
  'special@#$%chars'
];
```

---

## Coverage Goals

| Metric | Target | Notes |
|--------|--------|-------|
| Line Coverage | 95%+ | All major code paths |
| Branch Coverage | 90%+ | All conditional branches |
| Function Coverage | 100% | All exported functions |
| Statement Coverage | 95%+ | All statements |

---

## Implementation Notes

### Testing Framework
- Use **Vitest** for unit tests
- Use **property-based testing** (via fast-check or similar) for reproducibility tests

### Precision Handling
- Use `toBeCloseTo()` for floating-point comparisons
- Define tolerance thresholds for biome boundary comparisons
- Test boundary cases where biome decisions change

### Test Organization
```typescript
// Example test structure
describe('PerlinNoise', () => {
  describe('constructor', () => {
    it('should initialize with default seed', () => {
      // test implementation
    });
  });
  
  describe('noise generation', () => {
    it('should produce values in valid range', () => {
      // test implementation
    });
  });
  
  describe('reproducibility', () => {
    it('should produce same values for same seed', () => {
      // test implementation
    });
  });
});

describe('generateImperialMap', () => {
  describe('4-player maps', () => {
    it('should create rhombus with 4 equal quadrants', () => {
      // test implementation
    });
  });
  
  describe('region assignment', () => {
    it('should assign all hexes to regions', () => {
      // test implementation
    });
  });
});
```

### Performance Considerations
- Large map generation tests should be marked as slow
- Consider caching generated maps for repeated tests
- Use smaller radii for quick unit tests

---

## Related Documentation

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [hex_utils_tdd_spec.md](./hex_utils_tdd_spec.md:1) - Test-driven documentation for hex utility functions
- [world_creation_wizard_spec.md](./world_creation_wizard_spec.md:1) - World creation wizard that uses map generation
- [unified_map_renderer_spec.md](./unified_map_renderer_spec.md:1) - Map renderer that displays generated maps
- [wireframes/world_creation_wizard_wireframe.md](./wireframes/world_creation_wizard_wireframe.md:1) - Wireframe mockup for world creation wizard
