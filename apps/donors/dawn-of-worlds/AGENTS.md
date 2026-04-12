# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Critical Architecture Rules

- **Event-sourced architecture**: State is derived from events via `deriveWorld()` and `derivePlayerState()`. Never mutate state directly - always dispatch events.
- **Importmap dependencies**: All external dependencies are loaded via esm.sh CDN in `index.html`. Do not add npm dependencies that require bundling.
- **Zustand persistence**: State uses Zustand with custom IndexedDB storage adapter (`store/storageAdapter.ts`). The store auto-compacts event log after 500 events.

## Todo Lifecycle (MANDATORY)

- `todo.md` is the source of truth for development sprints.
- For ANY code change: (1) Read `todo.md`, (2) Identify first unchecked item, (3) Implement, (4) Update `todo.md` in same response changing `- [ ]` to `- [x]`.
- When all tasks complete: archive to `docs/todo-archive.md` with timestamp header, then clear `todo.md` with placeholder.

## Commands

- `npm run dev` - Start Vite dev server (port 3000)
- `npm run build` - Production build
- `npm run tauri:dev` - Run Tauri desktop app in dev mode
- `npm run tauri:build` - Build Tauri desktop app
- `tsx scripts/verify-logic.ts` - Run logic verification suite

## Non-Obvious Conventions

- **Path alias**: `@/*` maps to project root (configured in tsconfig.json and vite.config.ts)
- **Hex coordinate system**: Uses axial coordinates (q, r) - see `logic/geometry.ts` for conversion functions
- **Age-specific actions**: Actions validate against current age (1-3) - see `logic/actions/age1.ts`, `age2.ts`, `age3.ts`
- **Event revocation**: Events can be revoked via `EVENT_REVOKE` - revoked IDs tracked in `revokedEventIds` Set
- **Custom storage**: Zustand persist middleware uses `customStorage` adapter wrapping idb-keyval for IndexedDB

## Gotchas

- Initial AP is 0 until `POWER_ROLL` event occurs (new economy system)
- `worldCache` and `playerCache` are derived from events, not stored directly
- Turn order cycles through `players` array; when index wraps to 0, a new round starts
- `GAME_SESSION` type in `types.ts` is the canonical type definition - schema.ts uses Zod for validation
