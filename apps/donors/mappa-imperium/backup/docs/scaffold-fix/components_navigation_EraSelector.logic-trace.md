FILE: src/components/navigation/EraSelector.tsx
SUBSYSTEM: Navigation

LOGIC TRACE ENTRIES
--------------------------------

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/navigation/EraSelector.tsx
FUNCTION / COMPONENT: EraSelector
INPUTS:
- useGameStore (currentEraId, viewedEraId, selectEra, isEraNavigationUnlocked)
- eras (data const)
PRECONDITIONS:
- None
TRANSITION:
1. Defines `getEraStatus(eraId)` logic:
    - If same as viewed -> 'current'.
    - If unlocked via debug -> 'completed' (if past) or 'available'.
    - If > currentEraId -> 'locked'.
    - If == currentEraId -> 'available'.
    - Else -> 'completed'.
2. Maps over `eras` array.
3. Renders `EraButton` for each era with calculated status.
OUTPUT / NEXT STEP:
- Renders row of Era buttons.
DEPENDENCIES:
- useGameStore
- EraButton
- data/eras
STATUS: MATCH
NOTES:
- Logic for `getEraStatus` is identical to Scaffold implementation.

PARITY SUMMARY TABLE
--------------------------------
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Status Logic | `EraSelector.tsx` internal | `EraSelector.tsx` internal | MATCH | Identical logic.
Rendering | Map over `eras` | Map over `eras` | MATCH | Identical rendering.
Interaction | `onEraSelect` prop | `selectEra` store action | ADAPTED | Switched from prop callback to store action.
