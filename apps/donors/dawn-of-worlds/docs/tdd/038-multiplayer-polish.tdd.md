# TDD-038: Multiplayer Polish

**Epic:** Multiplayer Polish
**Spec:** `docs/specs/038-multiplayer-polish.md`

## 1. Handover Logic Tests

### `store/gameStore.test.ts`

- **Test:** `advanceTurn_ShouldShowHandover_WhenNextIsHuman`
    - **Setup:** Active Player: P1. Next Player: P2 (Human). Dispatch `TURN_END`.
    - **Expect:** `isHandoverActive` to be `true`.

- **Test:** `advanceTurn_ShouldSkipHandover_WhenNextIsAI`
    - **Setup:** Active Player: P1. Next Player: P2 (AI). Dispatch `TURN_END`.
    - **Expect:** `isHandoverActive` to be `false`. `activePlayerId` becomes P2.

## 2. Sync Logic Tests

### `hooks/useSyncChannel.test.ts` (Mocked)

- **Test:** `receiveEvent_ShouldAppend_WhenIdsSequential`
    - **Setup:** Client has event 100. Receives event 101.
    - **Expect:** Event 101 added to store.

- **Test:** `receiveEvent_ShouldRequestSync_WhenIdsGap`
    - **Setup:** Client has event 100. Receives event 105.
    - **Expect:** Client emits `REQUEST_FULL_SYNC`.

## 3. Replay Logic Tests

### `components/ReplayLog.test.tsx`

- **Test:** `filterEvents_ShouldOnlyShowImportantEvents`
    - **Setup:** List of events including `MOVE` (minor) and `CITY_FOUND` (major).
    - **Expect:** Filtered list returns only `CITY_FOUND`.
