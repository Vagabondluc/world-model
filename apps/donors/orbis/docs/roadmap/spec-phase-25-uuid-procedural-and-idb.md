
# Spec: UUID Determinism & Scalable Storage (Phase 25)

## 1. Objective
Enable infinite detail expansion without infinite storage costs. We achieve this by treating UUIDs not just as identifiers, but as **Genetic Seeds**. Additionally, we migrate the storage backend to **IndexedDB** to support large-scale worlds beyond the 5MB `localStorage` limit.

## 2. UUID as DNA (Procedural Expansion)

### 2.1 The Philosophy
Every entity (Hex, Settlement, NPC, Faction) has a unique ID. Instead of randomly generating their traits and saving them, we derive their traits mathematically from their ID.
> **Rule:** If you know the UUID and the World Context (Biome/Civ Type), you know everything about the entity.

### 2.2 The UuidHasher
We need a robust, fast way to turn a string UUID (e.g., `a1b2-c3d4...`) into a numeric seed for our `PseudoRandom` class.

```typescript
// Cypher logic (FNV-1a or MurmurHash3 simplified)
function uuidToSeed(uuid: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < uuid.length; i++) {
    h ^= uuid.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
```

### 2.3 Layered Derivation
1.  **Hex UUID**: Derived from `WorldSeed + GridCoordinate`.
2.  **Settlement UUID**: Derived from `HexUUID`.
3.  **District/Building UUID**: Derived from `SettlementUUID + Index`.
4.  **NPC UUID**: Derived from `BuildingUUID + Index`.

---

## 3. Procedural Systems

### 3.1 Name Generation (Linguistic Roots)
Names provide flavor and cultural context.
*   **Input**: `Seed` (from UUID), `Biome` (e.g., Desert vs. Tundra), `SettlementType`.
*   **Algorithm**: Markov Chain or Syllabic Constructor.
    *   *Tundra*: Hard consonants, short vowels (e.g., "Krim", "Vost").
    *   *Rainforest*: Vowel-heavy, flowing (e.g., "Aomara", "Eolo").
*   **Implementation**: `generateName(uuid: string, context: Context): string`.

### 3.2 Town Generation (Layouts)
When a user "Inspects" a City hex, we generate the town layout on the fly. We **do not** save this layout unless the user modifies it.
*   **Input**: `HexData` (Space available, water proximity) + `UUID`.
*   **Output**: List of `BuildingNode` (Type, Position, Rotation).
*   **Logic**:
    1.  Place "Anchor" (Town Hall / Castle) based on highest elevation/defense.
    2.  Grow Roads using L-System or Pathfinding towards water/neighbors.
    3.  Zone districts (Residential, Industrial, Sacred) along roads.

### 3.3 World Interactions
Events are derived from the intersection of `UUID` and `Time`.
*   **Function**: `getInteraction(uuid: string, year: number): Interaction | null`.
*   **Logic**: Hash `uuid + year`. If `hash % rarity == 0`, trigger event (e.g., "Harvest Festival", "Plague", "Merchant Arrival").

---

## 4. Storage Architecture (IndexedDB Migration)

### 4.1 Why IndexedDB?
*   **Capacity**: GBs vs 5MB.
*   **Async**: Non-blocking saves (critical for auto-save).
*   **Structured**: Key-Value stores allow partial loading.

### 4.2 Database Schema (`OrbisDB_v1`)

| Store Name | Key | Value | Description |
| :--- | :--- | :--- | :--- |
| `meta` | `project_id` | `ProjectMeta` | Lightweight headers for the Load UI (Name, Date, Thumbnail). |
| `world` | `project_id` | `TerrainConfig` + `Seed` | The "DNA" required to regenerate the base hex grid. |
| `deltas` | `project_id` | `Record<HexID, Delta>` | Sparse map of *changes only*. |
| `descriptions`| `project_id` | `Record<HexID, string>` | User-written journals (can get large). |

### 4.3 The "Hydration" Flow
1.  **Load Meta**: Fetch list of projects from `meta` store. Display in UI.
2.  **Load World**: User selects Project. Fetch `world` config.
3.  **Regenerate**: Run `generatePlanetHexes(config, seed)` to build the authoritative grid in RAM.
4.  **Apply Deltas**: Fetch `deltas` from IDB. Overlay them onto the generated grid.
5.  **Ready**: Simulation starts.

---

## 5. Serialization Strategy (The Delta Approach)

We maintain the "Delta" strategy but optimize it for binary/structured cloning.

### 5.1 What is saved?
*   User Terraforming (Height/Biome overrides).
*   Settlement State changes (e.g., User builds a specific building).
*   Journal entries.

### 5.2 What is NOT saved?
*   The Hex Mesh geometry.
*   The Voxel data (chunks are ephemeral).
*   Procedurally generated names/town layouts (unless modified).

### 5.3 Auto-Save Logic
*   **Trigger**: Every `N` actions or `T` minutes.
*   **Process**:
    1.  Identify dirty stores (did `deltas` change? did `meta` change?).
    2.  Open IDB Transaction (ReadWrite).
    3.  `store.put(key, data)`.
    4.  Commit.

---

## 6. API Contract

```typescript
interface StorageAdapter {
  init(): Promise<void>;
  listProjects(): Promise<ProjectMeta[]>;
  loadProject(id: string): Promise<ProjectData | null>;
  saveProject(data: ProjectData): Promise<void>;
  deleteProject(id: string): Promise<void>;
  exportProject(id: string): Promise<Blob>; // For downloading to file
  importProject(file: Blob): Promise<string>; // For uploading from file
}
```

## 7. Verification Plan
*   [ ] **TC-25-01**: `uuidToSeed` returns the same number for the same string across browser sessions.
*   [ ] **TC-25-02**: Generating a town for Hex A produces Layout X. Refreshing the page and regenerating produces Layout X again.
*   [ ] **TC-25-03**: Saving a project > 10MB (simulated heavy deltas) succeeds in IndexedDB.
*   [ ] **TC-25-04**: `localStorage` fallback handles error gracefully if IDB is disabled (optional/low prio).
