# Active Migration Tasks

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Mandatory Pre-Work Checks
Before starting any task, ensure you have reviewed:
- `agent.md` - Verify role, environment constraints, and current runtime rules.
- `docs/decisions.md` - Understand the approved architecture and constraints for the task.
- `docs/import.md` - Verify any new dependencies are already approved or need a new entry.

## Status Legend
- **[Untouched]** Task is defined but work has not started.
- **[In Progress]** Actively being worked on.
- **[Blocked]** Cannot proceed due to external dependency or missing spec.
- **[Bug]** Implementation failed verification; needs rework.
- **[Done]** Verified by `verifyTodo.js` and ready for archival.

## Task List

**Format:** `- [ ] {TASK-ID} [STATUS] (DECISION-ID) Description`

### Phase 1: Foundation (Schema & Store Scaffolding)

- [x] {T-001} [Done] (DEC-002) Create `utils/zodHelpers.ts` with initial empty export.
- [x] {T-002} [Done] (DEC-002) Implement `zodToGeminiJson` primitive type converter (string, number, boolean).
- [x] {T-003} [Done] (DEC-002) Implement `zodToGeminiJson` complex type converter (arrays, nested objects).
- [x] {T-004} [Done] (DEC-002) Create `schemas/location.ts` and define base `LocationSchema`.
- [x] {T-005} [Done] (DEC-002) Create `schemas/npc.ts` and define base `NpcSchema`.
- [x] {T-006} [Done] (DEC-002) Update `aiService.ts` `generateStructuredContent` signature to accept `z.ZodSchema`.
- [x] {T-007} [Done] (DEC-002) Refactor `aiService.ts` to use `safeParse` on AI responses.
- [x] {T-008} [Done] (DEC-001) Create `stores/campaignStore.ts` with initial Zustand scaffold.
- [x] {T-009} [Done] (DEC-001) define `CampaignState` interface in `campaignStore.ts`.
- [x] {T-010} [Done] (DEC-001) Migrate `campaignConfig` state to `campaignStore`.
- [x] {T-011} [Done] (DEC-001) Migrate `campaignConfig` state to `campaignStore`.
- [x] {T-012} [Done] (DEC-001) Create `stores/locationStore.ts` scaffold.
- [x] {T-013} [Done] (DEC-001) Define `LocationState` interface (locations map, regions map) in `locationStore.ts`.
- [x] {T-014} [Done] (DEC-002) Create `schemas/index.ts` registry exporting all schemas and inferred types.

### Phase 2: Migration Integration (UI & Forms)

- [x] {T-015} [Done] (DEC-001) Refactor `AppContent` in `index.tsx` to use `useCampaignStore` for view routing and session management.
- [x] {T-016} [Done] (DEC-001) Refactor `Sidebar.tsx` to read/write to `useCampaignStore`.
- [x] {T-017} [Done] (DEC-001) Refactor `CampaignManager.tsx` to use `useCampaignStore`.
- [x] {T-018} [Done] (DEC-001) Refactor `LocationManager.tsx` to use `useLocationStore`.
- [x] {T-019} [Done] (DEC-001) Implement `addLocation` action in `locationStore` and use in `LocationManager`.
- [x] {T-021} [Done] (DEC-001) Create `compendiumStore.ts` and refactor `CompendiumManager` to use it.
- [x] {T-020} [Done] (DEC-004) Implement custom `useZodForm` hook.
- [x] {T-034} [Done] (DEC-004) Refactor `LocationForm.tsx` to use `useZodForm` and `ManagedLocationSchema`.
- [x] {T-035} [Done] (DEC-004) Refactor `RegionPanel.tsx` to use `useZodForm` and `RegionSchema`.
- [x] {T-036} [Done] (DEC-004) Refactor `LoreForm.tsx` to use `useZodForm` and `LoreEntrySchema`.

### Phase 3: Generator Store Replacement

- [x] {T-022} [Done] (DEC-002) Define `GeneratorSchema` for full generator state and generation parameters.
- [x] {T-023} [Done] (DEC-001) Scaffold `useGeneratorStore` to manage ephemeral generation state.
- [x] {T-024} [Done] (DEC-002) Update `aiService.ts` to support generator store requests.
- [x] {T-025} [Done] (DEC-001) Replace `AdventureContext` with `useGeneratorStore` in all generator components.

### Phase 4: Extended Schema Coverage

- [x] {T-026} [Done] (DEC-002) Create `FactionSchema` (hierarchy, goals, relations).
- [x] {T-027} [Done] (DEC-002) Create `SceneSchema` (encounters, links, summary).
- [x] {T-028} [Done] (DEC-002) Create `MonsterSchema` (statblocks, derived fields).
- [x] {T-029} [Done] (DEC-002) Create `AdventureOutlineSchema` (composite of Scenes, NPCs, Locations).
- [x] {T-030} [Done] (DEC-002) Create `LoreSchema` (historical entries, cross-refs).

### Phase 5: Persistence Layer

- [x] {T-031} [Done] (DEC-003) Draft `docs/specs/persistence.md` for IndexedDB/localStorage strategy.
- [x] {T-032} [Done] (DEC-003) Set up Dexie DB in `services/db.ts` with Zod validation on I/O.
- [x] {T-033} [Done] (DEC-003) Implement `load()` and `save()` persistence adapters in all stores.

### Phase 6: Location Manager UX Overhaul (Unified Toolbar)

- [x] {T-037} [Done] (DEC-001) Define `InteractionMode` type ('inspect' | 'biome_paint' | 'region_draft' | 'location_place') in `types` and add to `LocationStore`.
- [x] {T-038} [Done] (DEC-001) Create `components/location/LocationToolbar.tsx` with mode switching buttons that update the store.
- [x] {T-039} [Done] (DEC-001) Create `components/location/LocationContextMenu.tsx` container that conditionally renders tool options based on active mode.
- [x] {T-040} [Done] (DEC-001) Refactor `HexGrid.tsx` to use `interactionMode` for click/drag behavior instead of multiple boolean props.
- [x] {T-041} [Done] (DEC-001) Move Biome painting controls into `LocationContextMenu` and connect to store.
- [x] {T-042} [Done] (DEC-001) Move Region drafting controls (Finish/Cancel) into `LocationContextMenu` and connect to store.
- [x] {T-043} [Done] (DEC-001) Implement 'Location Place' mode behavior in `HexGrid` and `LocationManager`.
- [x] {T-044} [Done] (DEC-001) Clean up `LocationManager.tsx` by removing legacy header buttons and integrating new Toolbar/Context components.
# Section Zero: Core Directives
1.  **Immutability:** You must not alter or delete the rules in this "Section Zero".
2.  **Atomicity:** Every task must be atomic, actionable, and represent a single, verifiable change.
3.  **Decomposition:** Large requests will be broken down into multiple tasks, steps, or diff lines, organized into sub-phases and phases. This `todo.md` is often refilled from a specification document in `/docs/specs/`.

# Active Migration Tasks

## Mandatory Pre-Work Checks
Before starting any task, ensure you have reviewed:
- `agent.md` - Verify role, environment constraints, and current runtime rules.
- `docs/decisions.md` - Understand the approved architecture and constraints for the task.
- `docs/import.md` - Verify any new dependencies are already approved or need a new entry.

## Status Legend
- **[Untouched]** Task is defined but work has not started.
- **[In Progress]** Actively being worked on.
- **[Blocked]** Cannot proceed due to external dependency or missing spec.
- **[Bug]** Implementation failed verification; needs rework.
- **[Done]** Verified by `verifyTodo.js` and ready for archival.

## Task List

**Format:** `- [ ] {TASK-ID} [STATUS] (DECISION-ID) Description`

### Phase 7: SRD Monster Data Cleanup
This phase addresses data quality issues in SRD monster files per DEC-005. Work is broken into batches of ~10 files to manage commit size. Each task involves:
1. Adding flavorful, non-mechanical `description` text.
2. Adding a `roleplayingAndTactics` entry.
3. Correcting any formatting errors or missing actions.

- [x] {T-056} [Done] (DEC-005) Cleanup SRD Monster Batch 1 of 11 (Giant Scorpion to Gibbering Mouther).
- [x] {T-057} [Done] (DEC-005) Cleanup SRD Monster Batch 2 of 11 (Glabrezu to Green Hag).
- [x] {T-058} [Done] (DEC-005) Cleanup SRD Monster Batch 3 of 11 (Grick to Hell Hound).
- [x] {T-059} [Done] (DEC-005) Cleanup SRD Monster Batch 4 of 11 (Hezrou to Ice Devil).
- [x] {T-060} [Done] (DEC-005) Cleanup SRD Monster Batch 5 of 11 (Ice Mephit to Knight).
- [x] {T-061} [Done] (DEC-005) Cleanup SRD Monster Batch 6 of 11 (Kobold to Mage).
- [x] {T-062} [Done] (DEC-005) Cleanup SRD Monster Batch 7 of 11 (Magma Mephit to Minotaur).
- [x] {T-063} [Done] (DEC-005) Cleanup SRD Monster Batch 8 of 11 (Mule to Ogre).
- [x] {T-064} [Done] (DEC-005) Cleanup SRD Monster Batch 9 of 11 (Oni to Priest).
- [x] {T-065} [Done] (DEC-005) Cleanup SRD Monster Batch 10 of 11 (Pseudodragon to Sahuagin).
- [x] {T-066} [Done] (DEC-005) Cleanup SRD Monster Batch 11 of 11 (Salamander to Zombie).

### Phase 8: UI/UX Polish

- [x] {T-055} [Done] (DEC-006) Implement D&D-style rendering for monster stat blocks.

### Phase 18: Monster Generator Refinement (Target-Seeking Math)
- [x] {T-150} [Done] (DEC-011) Create `utils/diceHelpers.ts` with utilities to parse dice strings, calculate averages, and "nudge" dice counts to meet a target average.
- [x] {T-151} [Done] (DEC-011) Refactor `utils/monsterAssembler.ts` to implement target-seeking math: use the CR table's target DPR to scale the damage dice of generated powers dynamically.
- [x] {T-152} [Done] (DEC-011) Refactor `utils/monsterAssembler.ts` to strictly format damage strings (e.g., "Hit: 7 (2d6) fire damage") so the `CRCalculator` regex can parse them correctly.
- [x] {T-153} [Done] (DEC-011) Update `components/monster/MonsterResult.tsx` to refine the visual layout of the CR audit and remove redundant information.

### Phase 19: Interactive Mapping Enhancements (HexGrid 2.0)
- [x] {T-160} [Done] (DEC-012) Implement `HexGridLayers` to separate background, grid lines, fog of war, and entity tokens into distinct rendering layers.
- [x] {T-161} [Done] (DEC-012) Implement "Fog of War" mechanics in `LocationStore` with painting tools to reveal/hide hexes.
- [x] {T-162} [Done] (DEC-012) Create `DistanceCalculator` utility to measure hex distance and travel time based on biome movement costs.
- [x] {T-163} [Done] (DEC-012) Create `utils/biomePatterns.ts` to generate biome textures for the hex grid renderer.
- [x] {T-164} [Done] (DEC-012) Implement Drag-and-Drop logic for placing assets (images/tokens) onto the canvas from the desktop.

### Phase 20: AI & Narrative Depth
- [x] {T-170} [Done] (DEC-013) Create `ChatInterface` component for "Chat with NPC" simulation, connecting to the AI service with specific NPC context.
- [x] {T-171} [Done] (DEC-013) Integrate Gemini Image Generation (if available via API config) to generate portraits for NPCs and locations.
- [x] {T-172} [Done] (DEC-013) Implement "What Happens Next?" Oracle button in Scene view that generates 3 potential consequences based on current context.
- [x] {T-173} [Done] (DEC-013) Create `ReadAloudGenerator` service to create sensory-rich "boxed text" for scenes and locations.

### Phase 21: Encounter & Session Management
- [x] {T-180} [Done] (DEC-014) Create `useEncounterStore` to manage initiative tracking, HP, and conditions for active encounters.
- [x] {T-181} [Done] (DEC-014) Build `InitiativeTracker` UI with drag-and-drop reordering and turn management.
- [x] {T-182} [Done] (DEC-011) Implement EncounterBalancer UI that calculates difficulty (Easy/Medium/Hard/Deadly) based on party level and selected monsters.
- [x] {T-183} [Done] (DEC-014) Create `LootGenerator` service that generates treasure based on CR and creature type.
- [x] {T-184} [Done] (DEC-014) Implement `DiceRoller` overlay with 3D or 2D physics-based rolling.

### Phase 22: Compendium & Knowledge Graph
*(Ref: docs/specs/spec-compendium-graph.md)*

#### Sub-phase: Knowledge Graph (Visualization)
- [x] {T-190} [Done] (DEC-014) Create `utils/graphHelpers.ts`: Transform `CompendiumEntry[]` array into Node/Link structure compatible with force-directed graph logic.
- [x] {T-191} [Done] (DEC-014) Create `components/compendium/visual/GraphRenderer.tsx`: Wrapper component using Canvas API to render nodes and edges interactively (zoom/pan).
- [x] {T-192} [Done] (DEC-014) Integrate `GraphRenderer` into `RelationshipMap.tsx` to visualize store data, replacing the placeholder text.

#### Sub-phase: Cross-Linking (Navigation)
- [x] {T-193} [Done] (DEC-015) Create `utils/textLinker.ts`: Utility to scan text for Entity names and return a tokenized array with link metadata.
- [x] {T-194} [Done] (DEC-015) Create `components/common/CompendiumLink.tsx`: Clickable span component that triggers an entity lookup action.
- [x] {T-195} [Done] (DEC-015) Update `LoreCard.tsx` and `LoreDetailPanel.tsx` to use `textLinker` for parsing their content.

#### Sub-phase: Entity Drawer 2.0 & History
- [x] {T-196} [Done] (DEC-015) Update `CompendiumStore` to add `navigationStack` (array of IDs) and `historyIndex` state.
- [x] {T-197} [Done] (DEC-015) Create `components/common/HistoryControls.tsx`: Back/Forward buttons for navigation.
- [x] {T-198} [Done] (DEC-015) Update `EntityDrawer` (or Detail Panels) to display the item at the top of `navigationStack` instead of a single selected item.

#### Sub-phase: Timeline & Search
- [x] {T-199} [Done] (DEC-014) Create `utils/timelineHelpers.ts`: Utility to parse dates/eras from entity tags and sort them chronologically.
- [x] {T-200} [Done] (DEC-014) Create `components/compendium/visual/TimelineView.tsx`: Horizontal scroll component rendering sorted entities.
- [x] {T-201} [Done] (DEC-020) Refactor `CompendiumSearch.tsx` to support filtering by Tag Grammar categories (e.g., "Fire", "Fey").

### Phase 30: Tavern - Narrative AI Hub (DEC-023)
*(Ref: docs/specs/tavern.md)*

#### Sub-phase: Core Scaffolding
- [x] {T-300} [Done] (DEC-023) Create `stores/tavernStore.ts` with initial state (`activePanel`, `aiLoading`).
- [x] {T-301} [Done] (DEC-023) Create `components/tavern/TavernView.tsx` as the main container with tabbed navigation.
- [x] {T-302} [Done] (DEC-023) Add "Tavern" to `ActiveView` type and integrate `TavernView` into `index.tsx` routing.
- [x] {T-303} [Done] (DEC-023) Add "Tavern" nav item to `SidebarNav.tsx`.

#### Sub-phase: Job Board Panel
- [x] {T-304} [Done] (DEC-023) Create `components/tavern/JobBoardPanel.tsx` UI with inputs for setting, theme, etc.
- [x] {T-305} [Done] (DEC-023) Implement AI service call in `tavernStore` to generate structured `JobPost` data.
- [x] {T-306} [Done] (DEC-023) Render generated job posts in the `JobBoardPanel`.

#### Sub-phase: NPC Chat Simulator
- [x] {T-307} [Done] (DEC-023) Create `components/tavern/NpcChatPanel.tsx` UI with NPC selector and chat history display.
- [x] {T-308} [Done] (DEC-023) Update `tavernStore` to manage `chatHistory` per NPC.
- [x] {T-309} [Done] (DEC-023) Implement AI service call in `tavernStore` for streaming NPC chat responses.

#### Sub-phase: Oracle Panel
- [x] {T-310} [Done] (DEC-023) Create `components/tavern/OraclePanel.tsx` UI with textarea for player action input.
- [x] {T-311} [Done] (DEC-023) Implement AI service call in `tavernStore` to generate 3 structured outcomes.
- [x] {T-312} [Done] (DEC-023) Render the 3 outcomes in the `OraclePanel`.

#### Sub-phase: Read-Aloud Text Generator
- [x] {T-313} [Done] (DEC-023) Create `components/tavern/ReadAloudPanel.tsx` UI with inputs for context, length, and tone.
- [x] {T-314} [Done] (DEC-023) Implement AI service call in `tavernStore` to generate boxed text.

#### Sub-phase: Portrait & Scene Studio
- [x] {T-315} [Done] (DEC-023) Create `components/tavern/PortraitStudio.tsx` with inputs for style and entity selection.
- [x] {T-316} [Done] (DEC-023) Implement `generateImage` call in `tavernStore` for NPC portraits.
- [x] {T-317} [Done] (DEC-023) Create `components/tavern/SceneGenerator.tsx` with inputs for location type, time, weather.
- [x] {T-318} [Done] (DEC-023) Implement `generateImage` call in `tavernStore` for scene illustrations.

### Phase 31: Procedural Job Engine (DEC-024)
- [x] {T-320} [Done] (DEC-024) Create `types/jobGenerator.ts` with interfaces for Archetypes, Packs, and Context.
- [x] {T-321} [Done] (DEC-024) Create `data/jobData.ts` containing `JOB_ARCHETYPES`, `COMPLICATION_PACKS`, and `REWARD_PACKS`.
- [x] {T-322} [Done] (DEC-024) Implement `utils/jobGenerator.ts` logic for template selection, interpolation, and difficulty scaling.
- [x] {T-323} [Done] (DEC-024) Update `tavernStore.ts` to add `generateProceduralJobs` action and expose it to the UI.
- [x] {T-324} [Done] (DEC-024) Update `components/tavern/JobBoardPanel.tsx` to include a "Post Notices (Procedural)" button.

### Phase 32: Procedural Job Engine v2 (Amplified)
- [x] {T-325} [Done] (DEC-024) Update `docs/specs/spec-procedural-jobs.md` with the full amplified v2 content.
- [x] {T-326} [Done] (DEC-024) Update `types/jobGenerator.ts` with expanded interfaces from the v2 spec.
- [x] {T-327} [Done] (DEC-024) Update `data/jobData.ts` with amplified archetypes and new ENEMY_TABLE.
- [x] {T-328} [Done] (DEC-024) Update `utils/jobGenerator.ts` to use expanded context and new difficulty model.
