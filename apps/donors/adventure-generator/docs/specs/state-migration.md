# SPEC: State Migration to Zustand

**Version:** 0.2.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

## 1. Motivation
Currently, state is fragmented across `index.tsx` (`useState` for campaign config, active view, bestiary, location manager) and `AdventureContext.tsx` (`useReducer` for generation workflow). This causes:
*   **Prop Drilling**: Passing state setters deep into components.
*   **Unnecessary Renders**: Updating one part of `LocationManagerState` re-renders the entire app root.
*   **Complex Async Logic**: Chaining `useAsyncOperation` with context dispatchers is brittle.

## 2. Proposed Topology (Zustand Stores)

We will split the monolithic state into functional stores:

### `useCampaignStore`
*   **Responsibility**: Long-lived session data.
*   **Slices**:
    *   `config`: CampaignConfiguration (Theme, world info, ruleset)
    *   `view`: Active View routing
    *   `bestiary`: Saved monsters

### `useLocationStore`
*   **Responsibility**: World map data.
*   **Slices**:
    *   `locations`: Map<string, ManagedLocation> (Normalized by ID)
    *   `regions`: Map<string, Region>
    *   `viewSettings`: Hex grid settings (zoom, filters)
*   **Actions**: `panCamera`, `setZoom`, `addLocation`

### `useGeneratorStore` (replaces AdventureContext)
*   **Responsibility**: Ephemeral generation state.
*   **Slices**:
    *   `workflow`: Current step (hooks/outline), loading states.
    *   `data`: Current generated content (not yet saved to campaign).
    *   `history`: Undo/Redo stack for generation.

## 3. Migration Order
1.  **Phase 1 (Root State)**: Move `campaignConfig`, `activeView`, and `bestiary` from `index.tsx` to `useCampaignStore`.
2.  **Phase 2 (Location Manager)**: Refactor `LocationManager.tsx` to use `useLocationStore`.
3.  **Phase 3 (Generator)**: Replace `AdventureProvider` with `useGeneratorStore`.

## 4. Rules
*   **No Context**: Zustand stores should not be wrapped in React Context.
*   **Selectors**: Components MUST use selectors to subscribe only to data they need.
*   **Actions**: All state mutations must be defined as actions within the store, not in components.

## Addendum: Multi-Step Pipeline Integration

- Migration pipeline: Snapshot -> Transform -> Backfill Links -> Validate -> Commit.
- Backfill step must create redirects for renamed or merged entities.
- Validation must include link integrity checks using the Link Registry contract in `docs/specs/persistence.md`.

## 5. Data Migration and Versioning Strategy

### 5.1 Versioning Rules
- Every persisted snapshot must include a `schemaVersion` integer.
- Stores should export and import versioned payloads (e.g., `SessionStateV2`).
- New migrations must increment `schemaVersion` and register a migration step.

### 5.2 Migration Pipeline
Use a deterministic pipeline for upgrades:
1. **Snapshot** existing persisted data.
2. **Transform** data using version-specific migration functions.
3. **Backfill Links** for renamed/merged entities (see pipeline addendum).
4. **Validate** with Zod/Pydantic schemas.
5. **Commit** only if validation succeeds; otherwise, abort and keep snapshot.

### 5.3 Backward Compatibility
- Support reading up to 1 major version behind.
- If migration fails, notify the user and keep the prior session intact.
- Provide a “safe mode” import that loads only validated subsets.

### 5.4 Migration Registry
- Maintain a registry mapping `schemaVersion -> migrate(data)`.
- Each migration must be idempotent and pure (no side effects).
- Log migration steps and outcomes for diagnostics.
