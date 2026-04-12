
# SPEC-007-01: Data Models & Persistence

## 1. Persistence Strategy
Due to the potential size of the `EventLog` (especially with text-heavy narratives from SPEC-008), `localStorage` (5MB synchronous limit) is insufficient.

**Strategy:** Use **IndexedDB** (via a lightweight wrapper like `idb-keyval`).
*   **Asynchronous:** I/O operations will not block the React render loop.
*   **Hydration Guard:** The store must implement an `isHydrated` flag. The UI must show a "Summoning World..." splash screen until this flag is true to prevent UI flickering or state loss.
*   **Capacity:** Effectively unlimited for text data.
*   **Schema:** Key-Value pair where the key is `dawn_save_v1_{sessionId}`.

## 2. Configuration Objects

### 2.1 GameSessionConfig
The configuration object serves as the "seed" for the `GameState`.

```typescript
interface GameSessionConfig {
  // Metadata
  id: string;             // UUID v4
  createdAt: number;      // Unix Timestamp (ms)
  lastPlayed: number;     // Unix Timestamp (ms)
  version: string;        // e.g., "0.5.0"
  
  // World Identity
  worldName: string;      // Max 32 chars
  mapSize: 'SMALL' | 'STANDARD' | 'GRAND';
  initialAge: 1 | 2 | 3;
  
  // Roster
  players: PlayerConfig[];

  // House Rules (Feature Flags)
  rules: {
    strictAP: boolean;    // Enforce AP limits hard?
    draftMode: boolean;   // Allow undo in first round?
    legacyMode: boolean;  // Use old ruleset?
  };
}
```

### 2.2 PlayerConfig
Defines the actors in the system.

```typescript
interface PlayerConfig {
  id: string;             // "P1", "P2"... or UUID
  name: string;           // Display Name (Max 12 chars)
  color: string;          // Hex Code (#RRGGBB)
  isHuman: boolean;       // Future-proofing for AI
  secret?: string;        // Optional PIN for hotseat privacy
  stats?: {               // Persistent stats (Optional)
    wins: number;
    actionsTaken: number;
  };
}
```

## 3. Map Size Definitions
The `mapSize` enum maps to concrete grid dimensions used by the renderer.

| Size Enum | Columns | Rows | Total Hexes | CSS Class |
| :--- | :--- | :--- | :--- | :--- |
| `SMALL` | 20 | 15 | 300 | `hex-grid-sm` |
| `STANDARD` | 30 | 20 | 600 | `hex-grid-md` |
| `GRAND` | 40 | 30 | 1200 | `hex-grid-lg` |

## 4. State Migration Strategy
When loading from storage:
1.  **Read JSON** asynchronously from IndexedDB.
2.  **Validate Version:** If `save.version` < `current.version`, run migration pipeline.
3.  **Hydrate Sets:** Convert arrays back to `Set` objects (e.g., `revokedEventIds`).
4.  **Sanity Check:** Ensure `activePlayerId` exists in `players` array.
