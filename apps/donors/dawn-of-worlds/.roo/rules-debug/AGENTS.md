# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Debug Mode Specific Rules

- **Event-sourced architecture**: State is derived from events via `deriveWorld()` and `derivePlayerState()`. Debug by inspecting events array, not derived state.
- **Zustand persistence**: State uses Zustand with custom IndexedDB storage adapter (`store/storageAdapter.ts`). Check `isHydrated` flag before accessing store.
- **Logic verification**: Run `tsx scripts/verify-logic.ts` to verify action validation, AP calculation, and dependency chains.

## Non-Obvious Debugging Patterns

- **Derived state debugging**: `worldCache` and `playerCache` are derived from events - breakpoints in `deriveWorld()` or `derivePlayerState()` reveal state derivation issues.
- **Event log inspection**: Events are compacted after 500 events (`SNAPSHOT_THRESHOLD`). Check `revokedEventIds` Set for revoked events.
- **Hex coordinate debugging**: Uses axial coordinates (q, r) - see `logic/geometry.ts` for conversion functions.

## Gotchas

- Initial AP is 0 until `POWER_ROLL` event occurs (new economy system) - AP calculations will fail if this event is missing.
- Turn order cycles through `players` array; when index wraps to 0, a new round starts.
- `GAME_SESSION` type in `types.ts` is canonical type definition - schema.ts uses Zod for validation.
- Importmap dependencies are loaded via esm.sh CDN - check browser console for CDN loading errors.
