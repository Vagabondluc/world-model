
FILE: docs/scaffold-fix/07_player-switch.logic-trace.md
SUBSYSTEM: Player Switching & Concurrency

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/stores/gameStore.ts
FUNCTION / COMPONENT: GameStoreState
INPUTS: None
PRECONDITIONS: None
TRANSITION: Defines `playerUiStates: Record<number, EraUIState>`.
OUTPUT / NEXT STEP: Concurrent state storage per player.
DEPENDENCIES: None
STATUS: MATCH
NOTES: Restores the "Map" architecture of the Scaffold Context.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/stores/gameStore.ts
FUNCTION / COMPONENT: updateEraUiState
INPUTS: newState
PRECONDITIONS: currentPlayer exists
TRANSITION: 
1. Identifies `currentPlayer.playerNumber`.
2. Merges `newState` into `state.playerUiStates[playerId]`.
OUTPUT / NEXT STEP: Updates specific player's UI state without affecting others.
DEPENDENCIES: state.currentPlayer
STATUS: MATCH
NOTES: Logic ensures isolation of player states.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/era-interfaces/EraCreationContent.tsx
FUNCTION / COMPONENT: EraCreationContent
INPUTS: useGameStore
PRECONDITIONS: None
TRANSITION:
1. Reads `currentPlayer`.
2. Derives `eraUiState` from `playerUiStates[currentPlayer.playerNumber]`.
OUTPUT / NEXT STEP: Renders view based on *current* player's persisted UI state.
DEPENDENCIES: useGameStore
STATUS: MATCH
NOTES: Switching players changes `currentPlayer`, which immediately switches the `eraUiState` being read, restoring the previous player's context.

PARITY SUMMARY TABLE:
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
State Structure | Context Map | Store Map (`playerUiStates`) | MATCH | Functional parity restored.
Switch Logic | Context Update | Store Selection | MATCH | Changing player ID automatically selects correct state slice.
Persistence | Memory (Global) | SessionStorage (Global) | IMPROVED | Player states now survive reload.

-------------------------
NEGATIVE PARITY SECTION
-------------------------
OBSERVED DIVERSION 1
Scaffold behavior: `EraCreationContext` used a map to hold state for all players concurrently. Switching players just changed the pointer; the data remained in memory.
Src behavior: Store uses a single `currentPlayer` reference. Switching players updates this reference, often triggering a component reset/remount.
Evidence in files: docs/logic_difference_report.md Section 7.1 & 7.7.
Impact: "Reset vs. Swap." Switching players wipes transient data for the previous player instead of preserving it in the background.
Classification: Regression

OBSERVED DIVERSION 2
Scaffold behavior: Multi-player concurrency (Player A works while Player B works).
Src behavior: Single-player focus (Only Active Player exists).
Evidence in files: docs/logic_difference_report.md Section 7.1.
Impact: The application behaves like a single-player game where you "become" different people, rather than a tool managing a multi-player session state.
Classification: Divergent

OBSERVED DIVERSION 3
Scaffold behavior: Context maintained `playerUiStates` dictionary.
Src behavior: Initial Src implementation lacked the `playerUiStates` dictionary in the global store, relying on local state instead.
Evidence in files: docs/logic_difference_report.md Section 7.7 (Remediation Plan).
Impact: Loss of granular progress tracking per player within an Era step.
Classification: Missing Logic
