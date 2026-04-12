
# SPEC: Quick Delve 3.0 (Concept-First Workflow) (DEC-050)

## 1. Overview
Refactor the Quick Delve generator to mirror the "Arcane Library" workflow (Convergent Design). Instead of generating a full dungeon immediately from a theme, the system will first generate **3 distinct thematic concepts**. The user selects one, establishing a "sub-theme" that guides the procedural generation of the specific rooms.

## 2. Workflow Stages

### Stage 1: Input & Concept Generation
*   **Inputs:** Theme (Crypt, Ruin, etc.), Party Level.
*   **Process:** Procedural engine generates 3 "Delve Concepts".
*   **Output UI:** 3 Cards.
    *   *Example:* "The Weeping Sepulcher" (Tags: Water, Sorrow) vs "The Iron-Bound Tomb" (Tags: Constructs, Fire).

### Stage 2: The Delve Hub (Skeleton)
*   **Process:** Upon selecting a concept, generating the *structure* (5 rooms) but not the full text yet.
*   **UI:** A vertical visual chain (linear graph) of 5 nodes.
*   **Nodes:** Guardian -> Puzzle -> Trick -> Climax -> Reward.
*   **Actions:** Reorder nodes (drag/drop), Click node to enter "Room Builder".

### Stage 3: Room Builder (The Shell)
*   **UI:** Uses the standard `GeneratorShell` (Left/Center/Right/Bottom).
*   **Center (Procedural):** Generates room content based on the specific **Concept Tags** chosen in Stage 1.
*   **Right (AI):** Optional narrative enhancement.

## 3. Data Architecture

### 3.1 New Interfaces
```typescript
export interface DelveConcept {
    id: string;
    title: string;
    theme: DelveTheme;
    description: string;
    tags: string[]; // Specific sub-themes (e.g. "fire", "necrotic")
    visuals: string; // Short visual prompt
}
```

### 3.2 Store Updates
`AdventureDataStore`'s `activeDelve` needs to track the current view state:
```typescript
type DelveViewState = 'setup' | 'concepts' | 'hub' | 'room-editor';
```

## 4. Implementation Plan
1.  **Concept Generator:** Implement `utils/delve/conceptGenerator.ts` to produce variations based on base themes.
2.  **Store Update:** Refactor `useAdventureDataStore` to handle the multi-stage creation flow.
3.  **UI Components:**
    *   `DelveConceptSelector`: Displays the 3 cards.
    *   `DelveHub`: Displays the linear node graph.
    *   `DelveWizard`: Updated orchestrator.


## Addendum: Multi-Step Pipeline Integration

- Pipeline: Delve Outline -> Room and Encounter Gen -> Populate NPCs and Items -> Stitch Scenes -> GM Output.
- Add versioned step IDs so saved pipelines remain compatible across revisions.
- Preserve Link Registry references and RedirectMap when regenerating a single room or encounter (per `docs/specs/persistence.md`).
