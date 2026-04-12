# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Ask Mode Specific Rules

- **Event-sourced architecture**: State is derived from events via `deriveWorld()` and `derivePlayerState()`. Explain state changes in terms of events dispatched.
- **Importmap dependencies**: All external dependencies are loaded via esm.sh CDN in `index.html`. No npm dependencies requiring bundling are used.
- **Zustand persistence**: State uses Zustand with custom IndexedDB storage adapter (`store/storageAdapter.ts`). The store auto-compacts event log after 500 events.

## Non-Obvious Documentation Context

- **Path alias**: `@/*` maps to project root (configured in tsconfig.json and vite.config.ts).
- **Hex coordinate system**: Uses axial coordinates (q, r) - see `logic/geometry.ts` for conversion functions.
- **Age-specific actions**: Actions validate against current age (1-3) - see `logic/actions/age1.ts`, `age2.ts`, `age3.ts`.
- **Event revocation**: Events can be revoked via `EVENT_REVOKE` - revoked IDs tracked in `revokedEventIds` Set.
- **Custom storage**: Zustand persist middleware uses `customStorage` adapter wrapping idb-keyval for IndexedDB.

## Gotchas

- Initial AP is 0 until `POWER_ROLL` event occurs (new economy system).
- `worldCache` and `playerCache` are derived from events, not stored directly.
- Turn order cycles through `players` array; when index wraps to 0, a new round starts.
- `GAME_SESSION` type in `types.ts` is canonical type definition - schema.ts uses Zod for validation.
