# Architectural Decision Records (ADR)

**Version:** 0.2.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

## DEC-070: Off-Thread Procedural Math
**Date:** 2024-06-16  
**Status:** Approved  
**Context:** Heavy noise and coordinate math can cause UI jank.  
**Decision:** Use Web Workers for intensive calculations.  
**Rationale:** Preserve frame rate during large map operations.  
**Alternatives Considered:** Main-thread throttling; precomputed tiles only.  
**Consequences:** Introduces async boundaries for math utilities.

## DEC-071: Bestiary List Virtualization
**Date:** 2024-06-16  
**Status:** Approved  
**Context:** Large monster collections degrade scroll performance.  
**Decision:** Implement windowed rendering for monster lists.  
**Rationale:** Reduce DOM nodes and render cost.  
**Alternatives Considered:** Pagination; server-side filtering only.  
**Consequences:** Requires item height consistency and virtualization wrappers.

## DEC-072: Cached Layer Compositing
**Date:** 2024-06-16  
**Status:** Approved  
**Context:** Redrawing thousands of hex paths every frame is expensive.  
**Decision:** Use offscreen canvases to cache static biome layers.  
**Rationale:** Avoid recomputation during pan/zoom.  
**Alternatives Considered:** Lower resolution rendering; reduce layer count.  
**Consequences:** Requires cache invalidation strategy.

## DEC-073: Persistent NPC Memory
**Date:** 2024-06-17  
**Status:** Approved  
**Context:** NPC chat loses context between sessions.  
**Decision:** Implement a `memorySummary` field for Major NPCs, updated post-chat.  
**Rationale:** Preserve continuity with compact summaries.  
**Alternatives Considered:** Full message history persistence; external RAG.  
**Consequences:** Requires schema updates and summary refresh logic.

## DEC-074: Chain-of-Thought for Encounters
**Date:** TBD  
**Status:** Approved  
**Context:** AI-generated encounters can feel shallow.  
**Decision:** Update prompts to request internal reasoning before output.  
**Rationale:** Improve coherence and tactical structure.  
**Alternatives Considered:** More explicit output schema only.  
**Consequences:** Ensure hidden reasoning is not exposed to users.

## DEC-075: World-State Grounding
**Date:** TBD  
**Status:** In Progress  
**Context:** AI needs access to relevant lore for the current location.  
**Decision:** Implement RAG-style context injection for compendium entries.  
**Rationale:** Improve accuracy and continuity.  
**Alternatives Considered:** Manual context selection only.  
**Consequences:** Requires consistent indexing and prompt budgeting.

## DEC-076: Relational "Echoes"
**Date:** TBD  
**Status:** In Progress  
**Context:** Multi-plane campaigns require consistency across layers.  
**Decision:** Automated location propagation across parallel map layers.  
**Rationale:** Reduce duplication and drift.  
**Alternatives Considered:** Manual sync; one-way template import.  
**Consequences:** Requires conflict resolution for propagated edits.

## DEC-077: Faction Clock Automation
**Date:** TBD  
**Status:** Complete  
**Context:** Faction progress is often forgotten by GMs.  
**Decision:** Integrate encounter outcomes with automatically advancing clocks.  
**Rationale:** Maintain narrative momentum and visible stakes.  
**Alternatives Considered:** Manual clock updates only.  
**Consequences:** Requires schema extensions and UI components.

## DEC-078: CR Solver Optimization
**Date:** TBD  
**Status:** Complete  
**Context:** Precise CR balancing is difficult manually.  
**Decision:** Build an iterative stat optimizer to nudge monster stats toward target CR.  
**Rationale:** Provide consistent difficulty tuning.  
**Alternatives Considered:** Manual calculators; static presets.  
**Consequences:** Adds complex tuning logic and UI controls.

## DEC-079: Diegetic UI Transitions
**Date:** TBD  
**Status:** Approved  
**Context:** Navigation between views feels sterile.  
**Decision:** Use CSS backdrop-filters and view transitions for immersion.  
**Rationale:** Improve visual continuity and theme.  
**Alternatives Considered:** Minimal transitions only.  
**Consequences:** Requires cross-browser compatibility checks.

## DEC-080: Theme-Aware Assets
**Date:** TBD  
**Status:** Approved  
**Context:** Theming should affect visual assets.  
**Decision:** Implement dynamic SVG filters to vary asset rendering styles.  
**Rationale:** Maintain aesthetic cohesion across themes.  
**Alternatives Considered:** Separate asset sets per theme.  
**Consequences:** Requires filter definitions and testing.

## DEC-081: Global Command Palette
**Date:** TBD  
**Status:** Approved  
**Context:** Users need fast navigation and action access.  
**Decision:** Implement a Ctrl+K style searchable action/entity picker.  
**Rationale:** Increase productivity and discoverability.  
**Alternatives Considered:** Menu expansion only.  
**Consequences:** Requires indexing and keyboard handling.

## DEC-082: Generator State Machines
**Date:** TBD  
**Status:** Approved  
**Context:** Workflow transitions are implicit and brittle.  
**Decision:** Refactor `workflowStore.ts` to use a formal state-transition model.  
**Rationale:** Enforce valid transitions and simplify debugging.  
**Alternatives Considered:** Ad-hoc guards only.  
**Consequences:** Requires migration of existing logic.

## DEC-083: Snapshot-Based Undo/Redo
**Date:** TBD  
**Status:** Approved  
**Context:** Users need reversible edits.  
**Decision:** Implement a history stack for session state.  
**Rationale:** Provide safe experimentation.  
**Alternatives Considered:** Command-based undo only.  
**Consequences:** Requires snapshot storage and memory constraints.

## DEC-084: Zod-Based Migration Layer
**Date:** TBD  
**Status:** Approved  
**Context:** Legacy session data must survive schema changes.  
**Decision:** Create a utility to transform legacy session schemas during hydration.  
**Rationale:** Preserve user data across versions.  
**Alternatives Considered:** Hard breaks with manual migration.  
**Consequences:** Requires migration registry and tests.
