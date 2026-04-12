# 🔒 BAKED TEXTURE SPEC v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/19-biome-stability.md`, `docs/23-voxel-projection.md`, `docs/54-field-representation-projection-contract.md`, `docs/61-multi-axial-world-generation.md`, `docs/62-specialized-biomes.md`]
- `Owns`: [`BakedTextureBundle`, `BakedTextureHeader`, `BakingInputs`]
- `Writes`: `[]`

---

(Per-Hex Canonical Texture Format • Deterministic Baking • Seam-Safe)

---

## 0️⃣ Purpose

Define canonical per-hex baked texture format for:

* Efficient rendering at multiple LOD levels
* Deterministic texture generation from authority data
* Seam-safe boundaries between adjacent hexes
* Compact storage and fast loading

**Projection-Only Rule:** Baked textures are derived render assets. They must not mutate authoritative simulation state.

---

## 1️⃣ Texture Architecture

### 1.1 Baked Texture Bundle

```typescript
interface BakedTextureBundle {
  header: BakedTextureHeader;
  biomeIndex: Uint8Array;
  elevationDelta: Uint16Array;
  soilDepth: Uint16Array;
  moisture: Uint8Array;
  waterMask: Uint8Array;
  materialClass?: Uint8Array;
}
```

### 1.2 Header Schema

```typescript
interface BakedTextureHeader {
  specVersion: string;       // e.g. "1.0.0"
  encodingVersion: uint16;   // e.g. 1
  generatorVersion: string;  // build id or semantic version
  worldSeed: uint64;
  hexId: string;
  rasterSize: uint16;        // e.g. 64
  subDivN: uint8;            // sub-hex factor
  timestampUtc: AbsTime;     // canonical time type
}
```

---

## 2️⃣ Raster Specifications

### 2.1 Raster Dimensions

**Canonical Size:** `64×64` pixels per texture

**Layout:**
```
+-------------------+
|                   |
|                   |
|   64×64 pixels   |
|                   |
|                   |
+-------------------+
```

**Pixel Coordinate System:**
- Origin: Top-left `(0, 0)`
- X: Left to right (0 to 63)
- Y: Top to bottom (0 to 63)
- UV Mapping: `(u, v) = (x/64, y/64)`

### 2.2 Raster Fields

| Field | Type | Range | Description |
|-------|--------|--------|-------------|
| `biomeIndex` | `Uint8` | 0-255, 255 = invalid |
| `elevationDelta` | `Uint16` | Float16 packed, meters, NaN = invalid |
| `soilDepth` | `Uint16` | Float16 packed, meters, NaN = invalid |
| `moisture` | `Uint8` | 0-255, normalized 0-1, 255 = invalid |
| `waterMask` | `Uint8` | 0 or 1, water presence |
| `materialClass` | `Uint8` | 0-255, 255 = invalid |

---

## 3️⃣ Data Encoding

### 3.1 Float16 Packing

For `elevationDelta` and `soilDepth`:

```typescript
function float16ToUint16(value: number): number {
  // IEEE 754 half-precision conversion
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);
  view.setFloat16(0, value);
  return view.getUint16(0);
}

function uint16ToFloat16(value: number): number {
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);
  view.setUint16(0, value);
  return view.getFloat16(0);
}
```

**Range:** `-65504` to `+65504` meters (approximately)
**Precision:** ~0.001 meters (1mm)
**Special Values:**
- `0x7C00` to `0x7FFF`: NaN (invalid)
- `0x8000`: Negative infinity
- `0x7FFF`: Positive infinity

### 3.2 Normalized Values

**Moisture:**
```typescript
// Input: 0.0 to 1.0 normalized
// Output: 0 to 255 Uint8
moistureUint8 = Math.floor(moisture * 255);
```

**Biome Index:**
```typescript
// Input: BiomeId enum
// Output: 0-255 Uint8
biomeUint8 = biomeId;  // Direct mapping, assuming < 256 biomes
```

---

## 4️⃣ Deterministic Baking Pipeline

### 4.1 Baking Inputs

```typescript
interface BakingInputs {
  hexAuthority: HexAuthority;
  climate: ClimateInputs;
  stratum: StratumId;
  plane: PlaneId;
  rasterSize: uint16;
  seed: uint64;
}
```

### 4.2 Baking Algorithm

```typescript
function bakeTextureBundle(
  inputs: BakingInputs
): BakedTextureBundle {
  
  const size = inputs.rasterSize;
  const totalPixels = size * size;
  
  // Initialize arrays
  const biomeIndex = new Uint8Array(totalPixels);
  const elevationDelta = new Uint16Array(totalPixels);
  const soilDepth = new Uint16Array(totalPixels);
  const moisture = new Uint8Array(totalPixels);
  const waterMask = new Uint8Array(totalPixels);
  
  // Generate per-pixel values
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      
      // Get local position (0-1)
      const u = x / size;
      const v = y / size;
      
      // Sample local context
      const localContext = sampleLocalContext(
        inputs.hexAuthority,
        u, v
      );
      
      // Generate biome
      biomeIndex[y * size + x] = generateBiomePixel(
        localContext,
        inputs.seed,
        x, y
      );
      
      // Generate elevation delta
      elevationDelta[y * size + x] = float16ToUint16(
        generateElevationDelta(localContext, inputs.seed, x, y)
      );
      
      // Generate soil depth
      soilDepth[y * size + x] = float16ToUint16(
        generateSoilDepth(localContext, inputs.seed, x, y)
      );
      
      // Generate moisture
      moisture[y * size + x] = Math.floor(
        generateMoisture(localContext, inputs.seed, x, y) * 255
      );
      
      // Generate water mask
      waterMask[y * size + x] = generateWaterMask(
        localContext,
        inputs.seed,
        x, y
      ) ? 1 : 0;
    }
  }
  
  return {
    header: {
      specVersion: "1.0.0",
      encodingVersion: 1,
      generatorVersion: "1.0.0",
      worldSeed: inputs.seed,
      hexId: inputs.hexAuthority.id,
      rasterSize: size,
      subDivN: 0,
      timestampUtc: nowAbsTime()
    },
    biomeIndex,
    elevationDelta,
    soilDepth,
    moisture,
    waterMask
  };
}
```

---

## 5️⃣ Seam-Safe Boundaries

### 5.1 Edge Key Sampling

To ensure seamless boundaries with adjacent hexes:

```typescript
function sampleLocalContext(
  hexAuthority: HexAuthority,
  u: number,
  v: number
): LocalContext {
  
  // Determine if pixel is on edge
  const onEdge = u < 0.05 || u > 0.95 ||
                v < 0.05 || v > 0.95;
  
  if (onEdge) {
    // Sample from adjacent hex
    const edgeKey = computeEdgeKey(
      hexAuthority.id,
      u, v
    );
    const adjacentContext = sampleAdjacentHex(edgeKey);
    
    // Blend contexts for smooth transition
    return blendContexts(
      hexAuthority,
      adjacentContext,
      u, v
    );
  }
  
  // Interior pixel: use local hex only
  return sampleLocalHex(hexAuthority, u, v);
}
```

### 5.2 Edge Key Computation

```typescript
function computeEdgeKey(
  hexId: string,
  u: number,
  v: number
): string {
  
  // Determine which edge
  let edge: "north" | "south" | "northeast" | "southwest" |
               "northwest" | "southeast";
  
  if (v < 0.05) edge = "north";
  else if (v > 0.95) edge = "south";
  else if (u < 0.05) edge = "northwest";
  else if (u > 0.95) edge = "southeast";
  else if (u < 0.5 && v < 0.5) edge = "northeast";
  else edge = "southwest";
  
  return `${hexId}:${edge}`;
}
```

### 5.3 Context Blending

```typescript
function blendContexts(
  local: HexAuthority,
  adjacent: HexAuthority,
  u: number,
  v: number
): LocalContext {
  
  // Compute blend weight based on distance from edge
  const edgeDistance = Math.min(
    u, 1 - u, v, 1 - v
  );
  const blendWeight = Math.min(edgeDistance / 0.05, 1.0);
  
  // Linear interpolation between contexts
  return {
    biome: blendBiome(local.biome, adjacent.biome, blendWeight),
    elevation: blendElevation(
      local.elevation,
      adjacent.elevation,
      blendWeight
    ),
    moisture: blendMoisture(
      local.moisture,
      adjacent.moisture,
      blendWeight
    ),
    // ... other fields
  };
}
```

---

## 6️⃣ Texture Usage

### 6.1 Shader Sampling

```glsl
// Fragment shader
uniform sampler2D u_biomeTexture;
uniform sampler2D u_elevationTexture;
uniform sampler2D u_soilDepthTexture;
uniform sampler2D u_moistureTexture;
uniform sampler2D u_waterMaskTexture;

varying vec2 v_uv;

void main() {
  // Sample textures at UV
  float biomeIndex = texture2D(u_biomeTexture, v_uv).r;
  float elevationDelta = texture2D(u_elevationTexture, v_uv).r;
  float soilDepth = texture2D(u_soilDepthTexture, v_uv).r;
  float moisture = texture2D(u_moistureTexture, v_uv).r / 255.0;
  float waterMask = texture2D(u_waterMaskTexture, v_uv).r;
  
  // Use values for rendering
  // ...
}
```

### 6.2 Mipmapping

**Mipmap Levels:**
- Level 0: 64×64 (full resolution)
- Level 1: 32×32
- Level 2: 16×16
- Level 3: 8×8
- Level 4: 4×4
- Level 5: 2×2
- Level 6: 1×1

**Mipmap Generation:**
```typescript
function generateMipmaps(
  texture: Uint8Array,
  size: number
): Uint8Array[] {
  
  const mipmaps = [];
  let currentSize = size;
  let currentTexture = texture;
  
  while (currentSize > 1) {
    const nextSize = Math.floor(currentSize / 2);
    const nextTexture = new Uint8Array(nextSize * nextSize);
    
    // Downsample by averaging 2×2 blocks
    for (let y = 0; y < nextSize; y++) {
      for (let x = 0; x < nextSize; x++) {
        const srcX = x * 2;
        const srcY = y * 2;
        
        // Average 4 pixels
        const sum =
          currentTexture[srcY * currentSize + srcX] +
          currentTexture[srcY * currentSize + srcX + 1] +
          currentTexture[(srcY + 1) * currentSize + srcX] +
          currentTexture[(srcY + 1) * currentSize + srcX + 1];
        
        nextTexture[y * nextSize + x] = Math.floor(sum / 4);
      }
    }
    
    mipmaps.push(nextTexture);
    currentTexture = nextTexture;
    currentSize = nextSize;
  }
  
  return mipmaps;
}
```

---

## 7️⃣ Storage and Loading

### 7.1 Binary Format

**File Layout:**
```
[Header: Fixed Size]
[BiomeIndex: rasterSize * rasterSize bytes]
[ElevationDelta: rasterSize * rasterSize * 2 bytes]
[SoilDepth: rasterSize * rasterSize * 2 bytes]
[Moisture: rasterSize * rasterSize bytes]
[WaterMask: rasterSize * rasterSize bytes]
[MaterialClass: rasterSize * rasterSize bytes (optional)]
```

**Total Size (64×64):**
- Header: ~100 bytes
- BiomeIndex: 4,096 bytes
- ElevationDelta: 8,192 bytes
- SoilDepth: 8,192 bytes
- Moisture: 4,096 bytes
- WaterMask: 4,096 bytes
- **Total:** ~28,872 bytes per hex (~28 KB)

### 7.2 Compression

**Recommended Compression:** LZ4 or Zstandard

**Compression Strategy:**
```typescript
function compressBundle(
  bundle: BakedTextureBundle
): Uint8Array {
  
  // Serialize to binary
  const binary = serializeBundle(bundle);
  
  // Compress
  const compressed = compressLZ4(binary);
  
  return compressed;
}
```

**Expected Compression Ratio:** 2:1 to 5:1 depending on entropy

---

## 8️⃣ Integration with Existing Specs

### 8.1 Biome System Integration

**Input:** [`docs/19-biome-stability.md`](docs/19-biome-stability.md) and [`docs/62-specialized-biomes.md`](docs/62-specialized-biomes.md)

**Usage:**
```typescript
// Get biome for pixel
const biome = determineBiome(climate, stratum, plane);
biomeIndex[pixelIndex] = biome.id;
```

### 8.2 Voxel Projection Integration

**Input:** [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md)

**Usage:**
```typescript
// Sample elevation delta
const elevationDeltaMeters = uint16ToFloat16(
  elevationDelta[pixelIndex]
);

// Sample soil depth
const soilDepthMeters = uint16ToFloat16(
  soilDepth[pixelIndex]
);

// Use for voxel generation
const voxelMaterial = generateVoxelMaterial(
  biome,
  elevationDeltaMeters,
  soilDepthMeters
);
```

### 8.3 Multi-Axial Integration

**Input:** [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md)

**Usage:**
```typescript
// Apply stratum transform
const stratumTransform = getStratumTransform(stratumId);

// Apply plane transform
const planeTransform = getPlaneTransform(planeId);

// Bake with transforms
const bundle = bakeTextureBundle({
  hexAuthority,
  climate,
  stratum: stratumId,
  plane: planeId,
  rasterSize: 64,
  seed: worldSeed
});
```

---

## 9️⃣ Determinism Requirements

### 9.1 Deterministic Baking

Baking must be deterministic:

* Same inputs → identical byte-for-byte output
* No random number generation
* Deterministic noise sampling
* Stable across multiple runs

### 9.2 Seed-Based Generation

```typescript
function generateBiomePixel(
  context: LocalContext,
  seed: uint64,
  x: number,
  y: number
): BiomeId {
  
  // Derive per-pixel seed
  const pixelSeed = hashCombine(seed, x, y);
  
  // Use deterministic noise
  const noiseValue = deterministicNoise(pixelSeed);
  
  // Map to biome
  return mapNoiseToBiome(noiseValue, context);
}
```

### 9.3 Seam Determinism

Edge sampling must be deterministic:

* Same edge key → identical sample from adjacent hex
* Consistent edge key computation
* Symmetric blending (A→B = B→A)

---

## 🔟 Acceptance Criteria

### 10.1 Must-Have

- [x] **AC-1001**: Baked textures are deterministic from inputs
- [x] **AC-1002**: Edge seams are continuous between adjacent hexes
- [x] **AC-1003**: Float16 encoding/decoding is lossless within range
- [x] **AC-1004**: Texture size is configurable (default 64×64)
- [x] **AC-1005**: All raster fields are properly packed/unpacked
- [x] **AC-1006**: Mipmaps are correctly generated
- [x] **AC-1007**: Binary format is parsable and serializable

### 10.2 Should-Have

- [ ] **AC-1011**: Texture compression reduces size by at least 2:1
- [ ] **AC-1012**: Texture loading is lazy (on-demand)
- [ ] **AC-1013**: Texture caching reduces redundant bakes
- [ ] **AC-1014**: Texture invalidation on hex authority change

### 10.3 Could-Have

- [ ] **AC-1021**: Adaptive texture size based on hex complexity
- [ ] **AC-1022**: Delta encoding for texture updates (incremental)
- [ ] **AC-1023**: GPU texture streaming for large worlds

---

## 1️⃣1️⃣ Cross-Doc Dependencies

- [`docs/19-biome-stability.md`](docs/19-biome-stability.md) - Biome classification
- [`docs/62-specialized-biomes.md`](docs/62-specialized-biomes.md) - Specialized biome variants
- [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) - Voxel material generation
- [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md) - Stratum and plane transforms
- [`docs/54-field-representation-projection-contract.md`](docs/54-field-representation-projection-contract.md) - Data contract patterns

---

## 1️⃣2️⃣ Version History

| Version | Date | Changes |
|---------|--------|---------|
| 1.0 | 2026-02-12 | Initial frozen spec - Baked texture format and baking pipeline |

---

**Document Version:** 1.0  
**Status:** 🔒 FROZEN  
**Generated:** 2026-02-12

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
