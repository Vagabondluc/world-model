
# SPEC: Compendium & Knowledge Graph (Phase 22)

*(Associated Decisions: DEC-014, DEC-015, DEC-020)*

## 1. Overview
This phase transforms the static Compendium into a dynamic, interconnected Knowledge Graph. It introduces visualization tools (Graph, Timeline) and a utility to automatically link text references to entity data, creating a "wiki-like" experience.

## 2. Feature Specifications

### 2.1. Force-Directed Knowledge Graph (DEC-014)
**Goal:** Visualize connections between entities.

*   **Helpers:** `utils/graphHelpers.ts` to transform `CompendiumEntry[]` into `{ nodes, links }`.
*   **Renderer:** `components/compendium/visual/GraphRenderer.tsx` using HTML5 Canvas or SVG for dependency-free rendering (avoiding heavy D3/Three.js if possible, or using a lightweight ESM-compatible library).
*   **Interactions:** Click node to open Detail View; Drag to rearrange (optional).

### 2.2. Cross-Linking Engine (DEC-015)
**Goal:** Auto-link entity names in text descriptions.

*   **Logic:** `utils/textLinker.ts`.
    *   Builds a regex or trie from all `compendiumEntries.titles`.
    *   Scans text content (e.g., Lore, Location Notes).
    *   Replaces matches with a link token.
*   **UI:** `components/common/CompendiumLink.tsx`.
    *   Renders a styled span that onClick triggers `openDetail(id)`.

### 2.3. Timeline Viewer (DEC-014)
**Goal:** Visualize events chronologically.

*   **Data:** Extract entities with `date` tags or specific temporal metadata.
*   **UI:** `components/compendium/visual/TimelineView.tsx`.
    *   Horizontal scroll container.
    *   Group items by Era/Year.

### 2.4. Navigation History (DEC-015)
**Goal:** Allow "Back" and "Forward" navigation when jumping between entities.

*   **Store:** Add `historyStack` and `historyIndex` to `CompendiumStore`.
*   **Actions:** `pushEntry(id)`, `goBack()`, `goForward()`.

## 3. Data Models

### Graph Data
```typescript
interface GraphNode {
  id: string;
  label: string;
  type: 'npc' | 'location' | 'faction' | 'lore';
  val: number; // Size/Importance
}

interface GraphLink {
  source: string;
  target: string;
  relationship?: string; // Align with LinkType in `docs/specs/persistence.md`
}
```

## 4. Implementation Plan (Atomic Tasks)
See `docs/todo.md` Phase 22 for the breakdown.

## Addendum: Multi-Step Pipeline Integration

- Use the Link Registry and PipelineState contracts defined in `docs/specs/persistence.md`.
- Snapshot pipeline state into the graph per stage (outline, dependencies, stitch, GM rewrite).
- Expose dependency status per node (pending, in-progress, blocked, complete) for UI progress.
- Use regeneration RedirectMap (see `docs/specs/persistence.md`) to keep stable link continuity after replacements.
