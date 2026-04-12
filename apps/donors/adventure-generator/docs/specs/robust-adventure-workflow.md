
# SPEC: Robust Adventure Workflow & Contextual Navigation

**Version:** 1.0
**Focus:** Arcane Library, Compendium Integration, and Navigation History
**Goal:** Ensure artifacts generated during adventure creation (Hooks, NPCs, Locations) are persistently saved to the Compendium and possess "breadcrumbs" allowing users to return to their creation context.

---

# 1. Data Architecture: Source Tracking

To enable "Go back to the edit screen where they were created," every `CompendiumEntry` and `SavedMonster` needs metadata about its origin.

### 1.1 Schema Update (`schemas/common.ts`)

We will introduce an `OriginContext` schema:

```typescript
export const OriginContextSchema = z.object({
    type: z.enum(['generator', 'manual', 'import']),
    sourceId: z.string().optional(), // ID of the parent adventure/hook
    generatorStep: z.string().optional(), // e.g., 'hooks', 'outline'
    historyStateId: z.string().optional(), // ID in HistoryStore to restore state
});

export type OriginContext = z.infer<typeof OriginContextSchema>;
```

This field (`origin`) will be added to `CompendiumEntrySchema` and `SavedMonsterSchema`.

---

# 2. Feature: Arcane Library Persistence

The "Arcane Library" method generates 5 hooks based on a random matrix. Currently, these are ephemeral.

### 2.1 Hook Reification
*   **UI Change:** Update `SimpleHookCard` and `DetailedHookCard`.
*   **New Action:** "Save to Compendium".
*   **Behavior:**
    1.  Creates a `LoreEntry` in the Compendium.
    2.  Category: `adventure-hook`.
    3.  Tags: `['arcane-library', 'hook', ...derivedTags]`.
    4.  Content: The generated premise, origin, and stakes.
    5.  **Critical:** Sets `origin` with `historyStateId` pointing to the current generation session.

### 2.2 Outline Entity Reification
When developing an outline (Step 3):
*   **Current Behavior:** Entities are only fully committed when the user clicks "Save Adventure" at the end, or generated piecemeal.
*   **New Behavior:**
    1.  When `generateOutline` completes, immediately create "Draft" Compendium entries for every named NPC, Location, and Faction.
    2.  Link them all to the parent Adventure ID using the Link Registry contract in `docs/specs/persistence.md`.
    3.  Tag them as `['draft', 'adventure-assets']`.
    4.  This ensures that if the user navigates away, the entities exist.

---

# 3. Feature: Contextual Back Navigation

The "Back" button in `DetailViewLayout` is currently a generic router back. It needs to be state-aware.

### 3.1 The "Return to Workshop" Flow
When viewing an entity (e.g., an NPC) in `NpcDetailView`:

1.  Check `entry.origin`.
2.  If `origin.type === 'generator'` and `origin.historyStateId` exists:
    *   Render a specific button: **"Return to Adventure Generator"**.
3.  **On Click:**
    *   Lookup the state in `HistoryStore` using `historyStateId`.
    *   Hydrate `AdventureDataStore` and `WorkflowStore` with that snapshot.
    *   Route the user to the correct Generator Step (e.g., 'outline').

---

# 4. Workflow Refinements

### 4.1 Generator "Autosave" to History
*   Every successful generation (Hooks generated, Outline generated) must explicitly push a snapshot to `HistoryStore`.
*   The ID of this snapshot is the key used in Section 3.1.

### 4.2 Orphan Management
*   Since we are creating draft entities more aggressively, we need a cleanup utility in `SettingsManager` to "Delete Unused Drafts" (entities tagged 'draft' that were never finalized).


## Addendum: Multi-Step Pipeline Integration

- Pipeline: Outline Structure -> Generate Dependencies (NPCs, locations, encounters, items) -> Stitch Scenes -> GM Rewrite -> Review and Revise.
- Use the Link Registry and RedirectMap contracts defined in `docs/specs/persistence.md` for all sub-entities and their parent adventure stage.
- Regeneration must preserve IDs or provide a RedirectMap for downstream references.
