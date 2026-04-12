# Addendum: Cylindrical Hex Grid Projection

**Parent Spec**: [046-smooth-sphere-geometry.md](046-smooth-sphere-geometry.md)  
**Status**: Proposed  
**Date**: 2026-02-01

---

## Problem Statement

The current Fibonacci sphere hex grid implementation produces **non-adjacent hexes** with visible gaps. This is fundamentally broken because:

1. Fibonacci sphere distributes points evenly, but does not define adjacency relationships.
2. Drawing circles around each point creates overlapping or gapped geometry.
3. True spherical hex tiling requires exactly 12 pentagons (Goldberg polyhedron), which adds complexity.

---

## Proposed Solution: Cylindrical Projection

Instead of attempting true spherical hex tiling, use a **2D hex grid wrapped around the sphere** like a texture map.

### Core Concept

```
┌──────────────────────────────────────┐
│          NORTH POLE (Compressed)     │ ← Hexes converge
├──────────────────────────────────────┤
│                                      │
│     Standard hex grid (flat map)     │ ← Perfect hexes
│                                      │
├──────────────────────────────────────┤
│          SOUTH POLE (Compressed)     │ ← Hexes converge
└──────────────────────────────────────┘
         ↓ Wrap around sphere ↓
              🌍 Globe
```

### Advantages

| Aspect | Fibonacci (Current) | Cylindrical (Proposed) |
|--------|---------------------|------------------------|
| Adjacency | Broken | Perfect |
| Gaps | Yes | No |
| Pentagon handling | None | Not needed |
| Implementation | Complex | Simple |
| Pole appearance | Random | Natural compression |

---

## Data Structures

### CylindricalHexGridConfig

```typescript
interface CylindricalHexGridConfig {
    /** Number of hex columns around equator (longitude) */
    gridWidth: number;
    
    /** Number of hex rows from pole to pole (latitude) */
    gridHeight: number;
    
    /** Sphere radius */
    radius: number;
    
    /** Seed for procedural generation */
    seed?: number;
    
    /** Generator type (for biome assignment) */
    generatorType?: GeneratorType;
}
```

### HexCell (Updated)

```typescript
interface HexCell {
    id: string;
    
    /** Grid coordinates (column, row) */
    gridPos: { col: number; row: number };
    
    /** 3D position on sphere surface */
    center: Vec3;
    
    /** 6 vertices projected onto sphere (or less at poles) */
    vertices: Vec3[];
    
    /** IDs of adjacent cells */
    neighbors: string[];
    
    /** Biome assignment */
    biome: BiomeType;
    
    /** Climate data */
    biomeData?: {
        height: number;
        temperature: number;
        moisture: number;
    };
}
```

---

## Algorithm

### 1. Generate 2D Hex Grid

Standard offset coordinates (odd-q or odd-r):

```typescript
function generate2DHexGrid(width: number, height: number): GridCell[][] {
    const grid: GridCell[][] = [];
    
    for (let row = 0; row < height; row++) {
        grid[row] = [];
        for (let col = 0; col < width; col++) {
            grid[row][col] = {
                col,
                row,
                // Offset for odd columns
                offset: col % 2 === 1 ? 0.5 : 0
            };
        }
    }
    
    return grid;
}
```

### 2. Map to Lat/Lon

Convert grid position to spherical coordinates:

```typescript
function gridToLatLon(col: number, row: number, config: CylindricalHexGridConfig): LatLon {
    // Longitude: 0 to 360 degrees
    const lon = (col / config.gridWidth) * 360;
    
    // Latitude: -90 to +90 degrees
    // Row 0 = North Pole (+90), Row max = South Pole (-90)
    const lat = 90 - (row / (config.gridHeight - 1)) * 180;
    
    return { lat, lon };
}
```

### 3. Project to Sphere

Convert lat/lon to 3D Cartesian coordinates:

```typescript
function latLonToCartesian(lat: number, lon: number, radius: number): Vec3 {
    const latRad = lat * Math.PI / 180;
    const lonRad = lon * Math.PI / 180;
    
    return {
        x: radius * Math.cos(latRad) * Math.cos(lonRad),
        y: radius * Math.sin(latRad),
        z: radius * Math.cos(latRad) * Math.sin(lonRad)
    };
}
```

### 4. Handle Pole Deformation

At poles, hexes naturally compress. No special handling required beyond:

- **Visual**: Hexes near poles appear thinner (stretched vertically)
- **Gameplay**: Pole cells may have fewer effective neighbors

```typescript
function calculatePoleCompression(lat: number): number {
    // At equator (lat=0): compression = 1.0 (no compression)
    // At poles (lat=±90): compression → 0 (full compression)
    return Math.cos(lat * Math.PI / 180);
}
```

### 5. Build Adjacency

For offset hex grids, neighbors are well-defined:

```typescript
function getNeighbors(col: number, row: number, width: number, height: number): string[] {
    const isOddCol = col % 2 === 1;
    const neighbors: string[] = [];
    
    // Offset coordinates neighbor directions
    const directions = isOddCol
        ? [[-1, 0], [1, 0], [-1, 1], [0, 1], [-1, -1], [0, -1]]  // Odd column
        : [[-1, 0], [1, 0], [0, 1], [1, 1], [0, -1], [1, -1]];   // Even column
    
    for (const [dc, dr] of directions) {
        let nc = col + dc;
        const nr = row + dr;
        
        // Wrap longitude (column)
        if (nc < 0) nc = width - 1;
        if (nc >= width) nc = 0;
        
        // Clamp latitude (row) - no wrap at poles
        if (nr >= 0 && nr < height) {
            neighbors.push(`cell-${nc}-${nr}`);
        }
    }
    
    return neighbors;
}
```

---

## API Changes

### generateHexGrid (Updated)

```typescript
function generateHexGrid(config: CylindricalHexGridConfig): HexCell[] {
    const cells: HexCell[] = [];
    
    for (let row = 0; row < config.gridHeight; row++) {
        for (let col = 0; col < config.gridWidth; col++) {
            const { lat, lon } = gridToLatLon(col, row, config);
            const center = latLonToCartesian(lat, lon, config.radius);
            const vertices = calculateHexVertices(col, row, config);
            const neighbors = getNeighbors(col, row, config.gridWidth, config.gridHeight);
            
            cells.push({
                id: `cell-${col}-${row}`,
                gridPos: { col, row },
                center,
                vertices,
                neighbors,
                biome: BiomeType.OCEAN, // Default, set by generator
                biomeData: undefined
            });
        }
    }
    
    // Apply biomes
    if (config.generatorType === GeneratorType.SIMPLEX) {
        applyProceduralBiomes(cells, config.seed);
    } else {
        applyMockBiomes(cells);
    }
    
    return cells;
}
```

---

## Pole Cap Strategy

At the poles (row 0 and row = height-1), all longitude values collapse to a single point. Instead of generating `gridWidth` degenerate cells, generate **single pole cap cells**:

```typescript
const NORTH_POLE_ID = 'cell-pole-north';
const SOUTH_POLE_ID = 'cell-pole-south';
```

### Pole Cap Properties

| Property | North Pole | South Pole |
|----------|------------|------------|
| ID | `cell-pole-north` | `cell-pole-south` |
| Center | `(0, +radius, 0)` | `(0, -radius, 0)` |
| Neighbors | All cells in row 1 | All cells in row `height-2` |
| Vertices | Ring of points at row 1 latitude | Ring of points at row `height-2` latitude |
| Biome | Typically `ARCTIC` | Typically `ARCTIC` |

### Pole-Adjacent Cell Neighbors

Cells in row 1 (adjacent to north pole):
- **1 neighbor**: `cell-pole-north`
- **2 neighbors**: Left/right in same row (with longitude wrap)
- **3 neighbors**: Cells in row 2 (standard hex adjacency)
- **Total**: 6 neighbors ✓

---

## Vertex Calculation

### calculateHexVertices

Generate 6 vertices around a cell center, projected onto the sphere:

```typescript
function calculateHexVertices(
    col: number,
    row: number,
    config: CylindricalHexGridConfig
): Vec3[] {
    const { lat, lon } = gridToLatLon(col, row, config);
    const vertices: Vec3[] = [];
    
    // Hex vertex angular offsets (pointy-top orientation)
    const hexAngles = [30, 90, 150, 210, 270, 330]; // degrees
    
    // Calculate hex size based on grid density
    const latStep = 180 / config.gridHeight;
    const lonStep = 360 / config.gridWidth;
    
    // Hex radius in degrees (half the step size, adjusted for aspect)
    const hexRadiusLat = latStep * 0.5;
    const hexRadiusLon = lonStep * 0.5 / Math.max(0.1, Math.cos(lat * Math.PI / 180));
    
    for (const angle of hexAngles) {
        const rad = angle * Math.PI / 180;
        
        // Offset in lat/lon space
        const dLat = hexRadiusLat * Math.sin(rad);
        const dLon = hexRadiusLon * Math.cos(rad);
        
        // Clamp latitude to valid range
        const vLat = Math.max(-89.9, Math.min(89.9, lat + dLat));
        const vLon = (lon + dLon + 360) % 360;
        
        // Project to 3D
        vertices.push(latLonToCartesian(vLat, vLon, config.radius));
    }
    
    return vertices;
}
```

### Pole Cap Vertices

Pole caps use a special vertex ring:

```typescript
function calculatePoleCapVertices(
    isNorth: boolean,
    config: CylindricalHexGridConfig
): Vec3[] {
    const vertices: Vec3[] = [];
    const adjacentRow = isNorth ? 1 : config.gridHeight - 2;
    const { lat } = gridToLatLon(0, adjacentRow, config);
    
    // Create vertices at each column position along the adjacent row's latitude
    for (let col = 0; col < config.gridWidth; col++) {
        const lon = (col / config.gridWidth) * 360;
        vertices.push(latLonToCartesian(lat, lon, config.radius));
    }
    
    return vertices;
}
```

---

## Normalized Area

Cells near the poles have smaller surface area due to spherical geometry. The `normalizedArea` property provides a 0-1 scale factor.

### HexCell (Updated)

```typescript
interface HexCell {
    id: string;
    gridPos: { col: number; row: number };
    center: Vec3;
    vertices: Vec3[];
    neighbors: string[];
    biome: BiomeType;
    biomeData?: { height: number; temperature: number; moisture: number; };
    
    /** Area relative to equator cell (0-1). Equator = 1.0, Poles → 0 */
    normalizedArea: number;
    
    /** True if this is a pole cap cell */
    isPoleCap?: boolean;
}
```

### Area Calculation

```typescript
function calculateNormalizedArea(lat: number): number {
    // Surface area of spherical zone is proportional to cos(latitude)
    // Normalized so equator (lat=0) = 1.0
    return Math.abs(Math.cos(lat * Math.PI / 180));
}
```

### Usage Example

```typescript
const cell = cells.find(c => c.id === 'cell-18-9'); // Equator
console.log(cell.normalizedArea); // ~1.0

const polarCell = cells.find(c => c.id === 'cell-18-1'); // Near pole
console.log(polarCell.normalizedArea); // ~0.17

const poleCap = cells.find(c => c.id === 'cell-pole-north');
console.log(poleCap.normalizedArea); // ~0.0 (special case)
```

---

## Default Configuration

```typescript
const DEFAULT_CONFIG: CylindricalHexGridConfig = {
    gridWidth: 36,   // 36 hexes around equator (10° each)
    gridHeight: 18,  // 18 rows pole-to-pole (10° each)
    radius: 1.0,
    seed: Date.now(),
    generatorType: GeneratorType.SIMPLEX
};
```

This produces:
- **Total cells**: 2 (pole caps) + 36 × 16 (regular rows) = **578 cells**
- Rows 1-16 are regular hex rows
- Row 0 → North pole cap
- Row 17 → South pole cap

---

## Migration

### Breaking Changes

- `cellCount` parameter replaced by `gridWidth` and `gridHeight`
- Cell IDs change from `cell-{index}` to `cell-{col}-{row}` (or `cell-pole-north`/`cell-pole-south`)
- `isPentagon` property removed (replaced by `isPoleCap`)
- New `normalizedArea` property added

### Migration Path

```typescript
// Old
const cells = generateHexGrid({ cellCount: 100, radius: 1.0 });

// New
const cells = generateHexGrid({ gridWidth: 36, gridHeight: 18, radius: 1.0 });
```

---

## Known Limitations

1. **Non-uniform cell area**: Cells near poles are smaller. Use `normalizedArea` for gameplay balancing.
2. **Pole caps are irregular**: They are not hexagons but N-gons where N = gridWidth.
3. **Texture mapping artifacts**: If applying textures, UV coordinates will stretch near poles.
