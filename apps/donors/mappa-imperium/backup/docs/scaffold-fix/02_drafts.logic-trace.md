
FILE: docs/scaffold-fix/02_drafts.logic-trace.md
SUBSYSTEM: Era I Geography Drafting

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/stores/gameStore.ts
FUNCTION / COMPONENT: GameStoreState
INPUTS: None
PRECONDITIONS: None
TRANSITION: Defines `eraDrafts: Record<number, { [eraId: number]: any }>`
OUTPUT / NEXT STEP: Storage for draft data.
DEPENDENCIES: None
STATUS: MATCH
NOTES: Store slice exists as requested in Fix 02.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/stores/gameStore.ts
FUNCTION / COMPONENT: updateDraft
INPUTS: eraId, draftData
PRECONDITIONS: currentPlayer exists
TRANSITION: Updates `eraDrafts[playerId][eraId]` with shallow merge.
OUTPUT / NEXT STEP: State updated.
DEPENDENCIES: state.currentPlayer
STATUS: MATCH
NOTES: Action implementation matches logic requirements.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/hooks/useEraCreationState.ts
FUNCTION / COMPONENT: useEraCreationState
INPUTS: useGameStore
PRECONDITIONS: None
TRANSITION: 
1. Selects `eraDrafts` and `currentPlayer` from store.
2. Memoizes `state` by merging `defaultState` with `eraDrafts[playerId][1]`.
3. `setState` callback calls `updateDraft(1, updates)`.
OUTPUT / NEXT STEP: Component uses persisted store data instead of local state.
DEPENDENCIES: useGameStore
STATUS: MATCH
NOTES: Hook completely refactored to use store drafts.

PARITY SUMMARY TABLE:
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Draft Storage | Context (`playersState`) | `gameStore.ts` (`eraDrafts`) | MATCH | Functionally identical multi-player persistence.
State Access | Context Hook | `useEraCreationState.ts` | MATCH | Adapter hook bridges UI to global store.
Persistence | Memory (Global) | SessionStorage (Global) | IMPROVED | Drafts now survive page reloads via store persistence.

-------------------------
NEGATIVE PARITY SECTION
-------------------------
OBSERVED DIVERSION 1
Scaffold behavior: The `EraCreationContext` maintained a `playersState` map (`Record<number, EraCreationState>`), tracking draft geography selections for *all* players concurrently in memory.
Src behavior: The `useEraCreationState` hook uses local component `useState`. Draft state is ephemeral and bound to the mounted component instance.
Evidence in files: docs/logic_difference_report.md Section 2 ("Era I: Geography Drafting Logic") & Section 7.2.
Impact: Switching from Player 1 to Player 2 unmounts Player 1's view, immediately destroying their unsaved draft work.
Classification: Regression

OBSERVED DIVERSION 2
Scaffold behavior: Seamless transition between player contexts allowed multi-tasking (drafting for P1, checking P2, returning to P1).
Src behavior: Player switching triggers a full component reset.
Evidence in files: docs/logic_difference_report.md Section 7.2 ("Era Creation Component Logic Broke Workflow").
Impact: Users are forced to complete and save a task entirely before looking at another player's screen, reducing usability.
Classification: Regression

OBSERVED DIVERSION 3
Scaffold behavior: Data structure for drafts was implicit in the Context provider.
Src behavior: Data structure for drafts is missing from the global store schema in `gameStore.ts` (prior to fix), relying entirely on transient React state.
Evidence in files: docs/logic_difference_report.md Section 7.7 (Remediation Plan).
Impact: No persistence for "Work in Progress" data across any boundary (tab switch, player switch, reload).
Classification: Missing Logic
