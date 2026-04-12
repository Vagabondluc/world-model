# 🔒 RUNTIME LOD CHUNKING & PERFORMANCE v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Chunk Scheduler • LOD Transitions • Performance Architecture)

---

## 0️⃣ Purpose

Define the runtime chunk/LOD scheduler and performance architecture for:

* Efficient rendering at multiple scales
* Deterministic LOD transitions
* Chunk loading/unloading based on camera position
* Performance monitoring and optimization

**Core Goals:**

* Maintain target frame rate (e.g., 60 FPS)
* Minimize memory usage
* Ensure smooth LOD transitions
* Support deterministic behavior

## 0.1 Shared Performance Budget Constants (Locked v1)

These constants are authoritative across runtime and render adapters:

```ts
interface RuntimeBudgetConstantsV1 {
  maxFrameCostMs: number           // 16.6
  timeoutBudgetMs: number          // 5000
  fallbackTrigger: "on_timeout_or_budget_violation"
  maxDiceCount: number             // 20
}
```

Required values:
- `maxFrameCostMs = 16.6`
- `timeoutBudgetMs = 5000`
- `fallbackTrigger = on_timeout_or_budget_violation`
- `maxDiceCount = 20`

Cross-spec linkage:
- `docs/specs/70-governance-benchmarks/137-simulation-validation-gate-chain.md`
- `docs/specs/40-actions-gameplay/101-render-adapter-layer.md`

---

## 1️⃣ LOD System Architecture

### 1.1 LOD Levels

| LOD | Name | Authority | Typical Size | Chunk Size | Target Distance |
|-----|--------|-----------|---------------|-------------|-----------------|
| L0 | Planet | Yes | Earth/global | N/A | Infinite (overview) |
| L1 | Continent | Yes | Plate scale | N/A | Infinite (overview) |
| L2 | Region | Yes | Hundreds of km | N/A | Infinite (overview) |
| L3 | World Hex | Yes | ~40 km | N/A | Infinite (overview) |
| L4 | Regional Hex | Yes | ~10 km | 64×64 hexes | > 1000 km |
| L5 | Local Hex | Yes | ~3 miles (~5 km) | 32×32 hexes | > 500 km |
| L6 | Sub-Hex/Patch | No (Derived) | 100-500 m | 16×16 patches | > 100 km |
| L7 | Voxel Surface/Column | No (Derived) | 1-5 m | 8×8 voxel columns | > 50 km |
| L8 | 5-ft Grid | No (Derived) | Combat projection | 4×4 grid cells | > 10 km |

### 1.2 Chunk Hierarchy

```typescript
interface RuntimeChunk {
  // Identification
  id: string;
  lodLevel: number;
  position: Vec3;
  
  // Content
  authority: AuthorityData | null;
  derived: DerivedData | null;
  
  // State
  isLoaded: boolean;
  isLoading: boolean;
  isDirty: boolean;
  
  // Performance
  lastAccessTime: number;
  accessCount: number;
}
```

### 1.3 Chunk Manager

```typescript
interface ChunkManager {
  // Chunk storage
  chunks: Map<string, RuntimeChunk>;
  
  // Active chunks
  activeChunks: Set<string>;
  loadingChunks: Set<string>;
  unloadingChunks: Set<string>;
  
  // Configuration
  maxLoadedChunks: number;
  chunkLoadDistance: number;
  chunkUnloadDistance: number;
  
  // Performance
  targetFrameTime: number;      // Milliseconds (e.g., 16.67 for 60 FPS)
  currentFrameTime: number;
}
```

---

## 2️⃣ Chunk Loading Strategy

### 2.1 Load Distance Calculation

```typescript
function calculateLoadDistance(
  lodLevel: number,
  cameraPosition: Vec3
): number {
  
  // Distance thresholds per LOD level
  const DISTANCES = {
    0: Infinity,     // L0 - Always loaded
    1: Infinity,     // L1 - Always loaded
    2: Infinity,     // L2 - Always loaded
    3: Infinity,     // L3 - Always loaded
    4: 1000000,     // L4 - 1000 km
    5: 500000,      // L5 - 500 km
    6: 100000,      // L6 - 100 km
    7: 50000,       // L7 - 50 km
    8: 10000        // L8 - 10 km
  };
  
  return DISTANCES[lodLevel];
}
```

### 2.2 Chunk Loading Algorithm

```typescript
function updateChunks(
  manager: ChunkManager,
  cameraPosition: Vec3
): void {
  
  // Step 1: Determine chunks to load
  const chunksToLoad = findChunksToLoad(manager, cameraPosition);
  
  // Step 2: Determine chunks to unload
  const chunksToUnload = findChunksToUnload(manager, cameraPosition);
  
  // Step 3: Prioritize loading
  const prioritizedLoads = prioritizeChunkLoads(chunksToLoad, cameraPosition);
  
  // Step 4: Load chunks (async)
  for (const chunkId of prioritizedLoads) {
    loadChunkAsync(chunkId);
  }
  
  // Step 5: Unload chunks
  for (const chunkId of chunksToUnload) {
    unloadChunk(chunkId);
  }
}
```

### 2.3 Chunk Load Prioritization

```typescript
function prioritizeChunkLoads(
  chunkIds: string[],
  cameraPosition: Vec3
): string[] {
  
  // Sort by distance to camera
  const sorted = [...chunkIds].sort((a, b) => {
    const distA = distance(cameraPosition, getChunkPosition(a));
    const distB = distance(cameraPosition, getChunkPosition(b));
    return distA - distB;
  });
  
  // Prioritize visible chunks
  const visible = sorted.filter(id => isChunkVisible(id, cameraPosition));
  const notVisible = sorted.filter(id => !isChunkVisible(id, cameraPosition));
  
  // Load visible chunks first
  return [...visible, ...notVisible];
}
```

---

## 3️⃣ LOD Transitions

### 3.1 LOD Selection

```typescript
function selectLOD(
  position: Vec3,
  cameraPosition: Vec3,
  lodLevels: number[]
): number {
  
  // Calculate distance to camera
  const distance = distance(position, cameraPosition);
  
  // Find appropriate LOD level
  for (let i = lodLevels.length - 1; i >= 0; i--) {
    const loadDistance = calculateLoadDistance(lodLevels[i], cameraPosition);
    
    if (distance <= loadDistance) {
      return lodLevels[i];
    }
  }
  
  // Fallback to lowest LOD
  return lodLevels[lodLevels.length - 1];
}
```

### 3.2 LOD Transition Smoothing

**Goal:** Prevent visual popping when LOD changes

**Technique 1: Dithering**
```typescript
function applyLODDithering(
  currentLOD: number,
  targetLOD: number,
  transitionProgress: number  // 0.0 to 1.0
): void {
  
  // Calculate blend factor
  const blendFactor = transitionProgress;
  
  // Blend between LOD levels
  blendLODLevels(currentLOD, targetLOD, blendFactor);
}
```

**Technique 2: Cross-fade**
```typescript
function applyLODCrossFade(
  chunkA: RuntimeChunk,
  chunkB: RuntimeChunk,
  transitionProgress: number
): void {
  
  // Calculate fade factors
  const fadeA = 1.0 - transitionProgress;
  const fadeB = transitionProgress;
  
  // Apply fade to chunk opacity
  chunkA.opacity = fadeA;
  chunkB.opacity = fadeB;
}
```

### 3.3 LOD Transition Timing

```typescript
interface LODTransition {
  fromLOD: number;
  toLOD: number;
  startTime: number;
  duration: number;  // Milliseconds
  isComplete: boolean;
}

function updateLODTransitions(
  transitions: LODTransition[],
  currentTime: number
): void {
  
  for (const transition of transitions) {
    if (transition.isComplete) continue;
    
    const elapsed = currentTime - transition.startTime;
    transition.progress = Math.min(elapsed / transition.duration, 1.0);
    
    if (elapsed >= transition.duration) {
      transition.isComplete = true;
      finalizeLODTransition(transition);
    }
  }
}
```

---

## 4️⃣ Performance Monitoring

### 4.1 Frame Time Tracking

```typescript
interface PerformanceMetrics {
  // Frame timing
  currentFrameTime: number;
  averageFrameTime: number;
  targetFrameTime: number;
  
  // FPS
  currentFPS: number;
  averageFPS: number;
  targetFPS: number;
  
  // Memory
  loadedChunks: number;
  totalMemory: number;
  availableMemory: number;
  
  // LOD distribution
  lodDistribution: Map<number, number>;  // LOD -> count
}
```

### 4.2 Adaptive LOD

**Goal:** Adjust LOD levels based on performance

```typescript
function adjustLODBasedOnPerformance(
  metrics: PerformanceMetrics
): void {
  
  // Check if below target FPS
  if (metrics.averageFPS < metrics.targetFPS * 0.9) {
    // Increase LOD distance (use lower detail)
    increaseLODDistance();
  }
  // Check if above target FPS
  else if (metrics.averageFPS > metrics.targetFPS * 1.1) {
    // Decrease LOD distance (use higher detail)
    decreaseLODDistance();
  }
}
```

### 4.3 Chunk Memory Management

```typescript
function manageChunkMemory(
  manager: ChunkManager,
  maxMemory: number
): void {
  
  // Calculate current memory usage
  const currentMemory = calculateMemoryUsage(manager.chunks);
  
  // If over budget, unload least recently used chunks
  if (currentMemory > maxMemory) {
    const chunksToUnload = selectLeastRecentlyUsed(
      manager.chunks,
      manager.activeChunks
    );
    
    for (const chunkId of chunksToUnload) {
      unloadChunk(chunkId);
    }
  }
}
```

---

## 5️⃣ Deterministic Chunking

### 5.1 Deterministic Chunk Loading

**Requirements:**
- Same camera position → identical loaded chunks
- No random number generation in chunk selection
- Stable chunk boundaries

### 5.2 Deterministic Chunk Unloading

**Requirements:**
- Same camera position → identical unloaded chunks
- Deterministic LRU (Least Recently Used) selection
- No random selection

### 5.3 Deterministic LOD Selection

**Requirements:**
- Same position → identical LOD level
- No random LOD selection
- Stable LOD transitions

---

## 6️⃣ Integration with Existing Specs

### 6.1 Multi-Scale LOD Integration

**Input:** [`docs/24-performance-lod.md`](docs/24-performance-lod.md)

**Usage:**
```typescript
// Use LOD levels from performance spec
const LOD_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Calculate load distances
const loadDistances = LOD_LEVELS.map(lod =>
  calculateLoadDistance(lod, cameraPosition)
);
```

### 6.2 Voxel Projection Integration

**Input:** [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md)

**Usage:**
```typescript
// L7 voxel columns are derived from L5 authority
if (lodLevel === 7) {
  const voxelColumn = generateVoxelColumn(
    getAuthorityForPosition(position),
    position
  );
  
  return voxelColumn;
}
```

### 6.3 Baked Texture Integration

**Input:** [`docs/63-baked-texture-spec.md`](docs/63-baked-texture-spec.md)

**Usage:**
```typescript
// Load baked textures for chunks
function loadChunkTextures(
  chunkId: string
): TextureBundle[] {
  
  const textureIds = getTextureIdsForChunk(chunkId);
  const bundles = textureIds.map(id =>
    loadTextureBundle(id)
  );
  
  return bundles;
}
```

---

## 7️⃣ Data Contracts

### 7.1 Chunk State

```typescript
interface ChunkState {
  // Active chunks
  activeChunkIds: string[];
  loadingChunkIds: string[];
  unloadingChunkIds: string[];
  
  // LOD state
  currentLOD: number;
  targetLOD: number;
  lodTransitions: LODTransition[];
  
  // Performance
  frameTimeHistory: number[];  // Last 60 frames
  memoryUsage: number;
}
```

### 7.2 Chunk Configuration

```typescript
interface ChunkConfig {
  // Chunk sizes
  chunkSizes: Map<number, Vec2>;  // LOD -> (width, height)
  
  // Load distances
  loadDistances: Map<number, number>;  // LOD -> meters
  
  // Performance targets
  targetFPS: number;              // Default: 60
  minFPS: number;                // Minimum acceptable FPS
  maxMemory: number;             // Maximum memory in bytes
  
  // Loading behavior
  maxConcurrentLoads: number;    // Default: 4
  loadPriority: "distance" | "visibility" | "importance";
  
  // LOD transitions
  transitionDuration: number;      // Milliseconds
  transitionType: "dither" | "crossfade" | "cut";
}
```

---

## 8️⃣ API Contracts

### 8.1 Chunk Operations

```typescript
interface ChunkAPI {
  // Load chunk
  loadChunk(chunkId: string): Promise<RuntimeChunk>;
  
  // Unload chunk
  unloadChunk(chunkId: string): void;
  
  // Get chunk
  getChunk(chunkId: string): RuntimeChunk | null;
  
  // Update chunks
  updateChunks(cameraPosition: Vec3): void;
  
  // Get active chunks
  getActiveChunks(): RuntimeChunk[];
  
  // Get performance metrics
  getPerformanceMetrics(): PerformanceMetrics;
  
  // Adjust LOD
  adjustLOD(performance: PerformanceMetrics): void;
}
```

---

## 9️⃣ Performance Optimization

### 9.1 Culling

**Frustum Culling:**
```typescript
function isChunkInFrustum(
  chunk: RuntimeChunk,
  camera: Camera
): boolean {
  
  // Check if chunk bounding box intersects frustum
  return frustum.intersects(chunk.boundingBox);
}
```

**Occlusion Culling:**
```typescript
function isChunkOccluded(
  chunk: RuntimeChunk,
  camera: Camera,
  terrainData: TerrainData
): boolean {
  
  // Check if chunk is occluded by terrain
  return terrainData.isOccluded(chunk.position, camera.position);
}
```

### 9.2 Instance Rendering

**Goal:** Render multiple instances of the same geometry

```typescript
interface InstancedRenderData {
  geometry: BufferGeometry;
  material: Material;
  instances: InstanceData[];
}

interface InstanceData {
  position: Vec3;
  scale: Vec3;
  rotation: Quaternion;
  color: Color;
}
```

### 9.3 Level of Detail (LOD) Models

**Goal:** Use different geometry detail levels

```typescript
interface LODModel {
  lod0: BufferGeometry;  // Highest detail
  lod1: BufferGeometry;  // Medium detail
  lod2: BufferGeometry;  // Low detail
  lod3: BufferGeometry;  // Lowest detail
  
  lodDistances: [number, number, number, number];  // Switch distances
}
```

---

## 🔟 Acceptance Criteria

### 10.1 Must-Have

- [x] **AC-1401**: Chunks are loaded based on camera distance
- [x] **AC-1402**: LOD transitions are smooth (dithering or crossfade)
- [x] **AC-1403**: Chunk loading is prioritized by distance and visibility
- [x] **AC-1404**: Performance metrics track frame time and memory usage
- [x] **AC-1405**: Adaptive LOD adjusts based on performance
- [x] **AC-1406**: Chunk unloading uses LRU (Least Recently Used)
- [x] **AC-1407**: Chunking is deterministic (same camera → same chunks)

### 10.2 Should-Have

- [ ] **AC-1411**: Frustum culling reduces rendered chunks
- [ ] **AC-1412**: Occlusion culling reduces rendered chunks
- [ ] **AC-1413**: Instance rendering reduces draw calls
- [ ] **AC-1414**: LOD models reduce geometry complexity
- [ ] **AC-1415**: Async chunk loading with progress indication

### 10.3 Could-Have

- [ ] **AC-1421**: Predictive chunk loading (load chunks before visible)
- [ ] **AC-1422**: Chunk streaming for large worlds
- [ ] **AC-1423**: Dynamic chunk size based on performance
- [ ] **AC-1424**: Multi-threaded chunk loading

---

## 1️⃣1️⃣ Cross-Doc Dependencies

- [`docs/24-performance-lod.md`](docs/24-performance-lod.md) - LOD levels and performance targets
- [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) - Voxel column generation
- [`docs/63-baked-texture-spec.md`](docs/63-baked-texture-spec.md) - Texture loading

---

## 1️⃣2️⃣ Version History

| Version | Date | Changes |
|---------|--------|---------|
| 1.0 | 2026-02-12 | Initial frozen spec - Runtime LOD chunking and performance |

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
