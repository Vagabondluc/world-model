# SPEC: UUID Integration for Entity Stability & AI Context

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Motivation
The application manages numerous interconnected entities (Locations, NPCs, Factions, Scenes, etc.). For data integrity, relational mapping, and especially for providing clear context to the AI, each entity must have a stable, globally unique identifier. The current `generateId()` function produces IDs based on timestamps and random numbers, which are sufficient for local operations but are not standard UUIDs and are not leveraged in AI prompts.

This specification outlines the transition to using standard UUIDs for all entities and integrating these UUIDs into the AI context generation pipeline. This ensures that when the AI is asked to develop or reference an entity, it knows *exactly* which one is being referred to, preventing ambiguity and enabling more complex, consistent narrative generation.

## 2. Core Changes

1.  **Standardize ID Generation**: All new entities will be assigned a standard Version 4 UUID using `crypto.randomUUID()`.
2.  **Enrich AI Context**: All AI prompts that reference existing game entities will now include the entity's UUID alongside its name and summary.

## 3. Affected Systems & Files

This change has a broad but shallow impact across the codebase, primarily affecting ID generation and AI context serialization.

### 3.1. ID Generation (`utils/helpers.ts`)
-   **File**: `utils/helpers.ts`
-   **Change**: The `generateId()` function will be updated to use the browser's native `crypto.randomUUID()` method.
-   **Impact**: All systems that call `generateId()` will now create UUIDs. This includes:
    -   `utils/outlineHelpers.ts`: When creating new entities from an AI-generated outline.
    -   `stores/compendiumStore.ts`: When creating new `LoreEntry` items.
    -   `stores/encounterStore.ts`: When adding new `Combatant`s.
    -   `stores/locationStore.ts`: When creating a new `WorldMap`, `ManagedLocation`, or `Region`.
    -   `utils/jobGenerator.ts`: When creating a new `JobPost`.
    -   `hooks/useMonsterCreator.ts`: When creating a new AI-generated `SavedMonster`.

### 3.2. AI Context Serialization (`utils/workflowHelpers.ts`)
-   **File**: `utils/workflowHelpers.ts`
-   **Change**: The `serializeAdventureBlueprint` function will be modified to include the UUID of each entity in the context string it generates for the AI.
-   **Impact**: When the AI is tasked with developing a scene, location, NPC, or faction, the prompt will now contain stable identifiers for all related entities, improving consistency.

### 3.3. Schemas (`schemas/*.ts`)
-   **Files**: All schema files using `IdSchema`.
-   **Change**: No code change required. The `IdSchema` is defined as `z.string().min(1)`, which is fully compatible with the UUID string format.
-   **Impact**: This confirms that our data validation layer already supports this change.

## 4. Example: AI Context Enhancement

This demonstrates how the context provided to the AI for developing a scene will be improved.

**Before:**
```
--- CURRENT ADVENTURE BLUEPRINT ---
**Adventure Hook:** "The Sunken Temple"

**Key Locations**
- The Rusty Anchor: A dockside tavern...

**Key NPCs**
- Kaelen 'Silver-Tongue': A charismatic rogue...

**Adventure Scenes**
- The Whispering Tavern: Extract information from the terrified survivor...
  - **Generated Details Summary:** A detailed description for this item has been generated.
-------------------------------------
```

**After:**
```
--- CURRENT ADVENTURE BLUEPRINT ---
**Adventure Hook:** "The Sunken Temple"

**Key Locations**
- The Rusty Anchor (ID: 1a7b3c8e-...): A dockside tavern...

**Key NPCs**
- Kaelen 'Silver-Tongue' (ID: 9f2d5e6a-...): A charismatic rogue...

**Adventure Scenes**
- The Whispering Tavern (ID: c4b8a1f7-...): Extract information from the terrified survivor...
  - **Generated Details Summary:** A detailed description for this item has been generated.
-------------------------------------
```

This simple change allows the AI to understand that "Kaelen" in Scene 1 is the same entity as "Kaelen" in Scene 5, preventing narrative drift and enabling it to build upon previously established facts with greater accuracy.

## Addendum: Multi-Step Pipeline Integration

- Add an Assign IDs stage before any link creation in generators.
- On regeneration, produce a RedirectMap (see `docs/specs/persistence.md`) so links can be repaired automatically.
- Link Registry entries must only accept UUID-backed entities (per `docs/specs/persistence.md`).
