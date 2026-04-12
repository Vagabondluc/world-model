FILE: src/components/navigation/NavigationHeader.tsx
SUBSYSTEM: Navigation

LOGIC TRACE ENTRIES
--------------------------------

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/navigation/NavigationHeader.tsx
FUNCTION / COMPONENT: NavigationHeader
INPUTS:
- useGameStore (view, changeView, isDebugMode, etc.)
- calculateCurrentYearForPlayer (util)
PRECONDITIONS:
- None
TRANSITION:
1. Calculates `currentYearDisplay` using memoized utility.
2. Renders Title ("Mappa Imperium") and Year Badge.
3. Renders Navigation Toggle (Rulebook / Element Manager).
4. Renders `PlayerStatus`.
5. Renders "Export" dropdown menu (toggleable local state).
    - Export Save Game
    - Publish Feed
6. Renders Settings button (toggles `SettingsModal`).
7. Renders Debug button (if `isDebugMode` is true).
8. If `view === 'eras'`, renders `EraSelector`.
9. Renders transition progress bar at bottom.
OUTPUT / NEXT STEP:
- Header UI.
DEPENDENCIES:
- useGameStore
- EraSelector, PlayerStatus
- timelineCalculator
STATUS: MATCH
NOTES:
- Direct port of Scaffold functionality.
- Replaced `handleExport` / `handleExportChronicleFeed` context calls with store actions.

PARITY SUMMARY TABLE
--------------------------------
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Structure | `NavigationHeader.tsx` | `NavigationHeader.tsx` | MATCH | Identical layout and features.
State Access | `useGame()` | `useGameStore()` | ADAPTED | Switched to Zustand.
Export Menu | Local state + context handlers | Local state + store actions | MATCH | Logic preserved.
