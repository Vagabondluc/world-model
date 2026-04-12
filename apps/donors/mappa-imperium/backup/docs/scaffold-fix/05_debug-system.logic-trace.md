
FILE: docs/scaffold-fix/05_debug-system.logic-trace.md
SUBSYSTEM: Debug System & State Seeding

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/debug/UnifiedDebugSystem.tsx
FUNCTION / COMPONENT: UnifiedDebugSystem
INPUTS: players, onPrepopulateEra, onUnlockAllEras...
PRECONDITIONS: isOpen is true
TRANSITION: Renders `GameToolsTab` passing props down.
OUTPUT / NEXT STEP: UI Display.
DEPENDENCIES: Props passed from App.tsx
STATUS: MATCH
NOTES: Component receives necessary actions to manipulate state.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/debug/tabs/GameToolsTab.tsx
FUNCTION / COMPONENT: GameToolsTab
INPUTS: onPrepopulateEra, onUnlockAllEras...
PRECONDITIONS: None
TRANSITION:
1. Renders Era buttons (1-6).
2. `onClick` calls `onPrepopulateEra(era, selectedPlayerNumber)`.
OUTPUT / NEXT STEP: Triggers store action.
DEPENDENCIES: Props
STATUS: MATCH
NOTES: UI for seeding logic exists.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/stores/gameStore.ts
FUNCTION / COMPONENT: prepopulateEra
INPUTS: eraId, playerNumber
PRECONDITIONS: None
TRANSITION:
1. Selects players to update.
2. Iterates `prepopulationData`.
3. Adds new elements (with new UUIDs).
4. Updates existing elements via matching logic.
5. Updates player state (e.g., deityCount).
OUTPUT / NEXT STEP: State updated with seed data.
DEPENDENCIES: src/data/prepopulationData.ts
STATUS: MATCH
NOTES: Full seeding logic implemented in store, restoring "Backfill" capability.

PARITY SUMMARY TABLE:
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
UI Access | DebugModal | UnifiedDebugSystem | MATCH | Accessed via toggle.
Seeding Logic | Context Method | `gameStore.prepopulateEra` | MATCH | Logic moved to store action.
Data Source | Hardcoded/Unknown | `prepopulationData.ts` | MATCH | Structured data source used.

-------------------------
NEGATIVE PARITY SECTION
-------------------------
OBSERVED DIVERSION 1
Scaffold behavior: The debug system (`DebugModal`) acted as a "Game State Manipulator," providing direct controls to force-seed eras and backfill data for testing.
Src behavior: The `UnifiedDebugSystem` acts as a "System Diagnostic Tool," focusing on environment capabilities (file access, network) rather than game state manipulation.
Evidence in files: docs/logic_difference_report.md Section 5 ("Debug System Logic") & Section 7.5.
Impact: Developers cannot easily "Prepopulate" the game to Era 4 or 5 for testing. The game often starts empty, and UI components crash because they expect previous eras to be completed.
Classification: Regression

OBSERVED DIVERSION 2
Scaffold behavior: Debug actions were integrated into the main game context.
Src behavior: Debug actions are isolated in a separate feature folder.
Evidence in files: docs/logic_difference_report.md Section 7.5.
Impact: Loss of the "Backfill" capability breaks the testing workflow for later eras.
Classification: Divergent

OBSERVED DIVERSION 3
Scaffold behavior: Debugging was "State-First" (fix the data).
Src behavior: Debugging is "Environment-First" (check the platform).
Evidence in files: docs/logic_difference_report.md Section 5.
Impact: While useful for deployment diagnostics, the removal of state tools makes gameplay verification significantly harder.
Classification: Divergent
