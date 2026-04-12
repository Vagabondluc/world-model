# Dungeon Generator — Folder Identity Correction

> **IMPORTANT:** The folder `to be merged/dungeon generator/` is NOT a separate "Dungeon Generator" donor. It contains the full D&D Adventure Generator application (`package.json: "name": "dnd-adventure-generator"`). This document exists to prevent future mis-characterization of the folder.

## What This Folder Actually Is

The folder `to be merged/dungeon generator/` is the source tree for the **D&D Adventure Generator** — a React 19 + Tauri desktop application with a Python/FastAPI RAG sidecar backend. Its `package.json` name is `dnd-adventure-generator`. It was placed in a folder named `dungeon generator` during collection, but the application is the same donor tracked under the ID `adventure-generator`.

The folder name is a **documentation hazard**. All canonical extraction work should reference and update `ADVENTURE_GENERATOR.md`.

**Canonical donor spec:** [ADVENTURE_GENERATOR.md](ADVENTURE_GENERATOR.md)

## Previous Misidentification History

| Date | Error | Correction |
|---|---|---|
| Prior session | Folder appeared to contain only `.next/dev/` build artifacts + `node_modules/` | Earlier scan may have caught an earlier state; folder now contains full source |
| Prior session | Classified as "empty fragment", class `empty fragment`, lane `dungeon-topology` | Class is `real app`; lane is `workflow / adventure-authoring / location-spatial / npc / faction / encounter` |
| Prior session | Listed provisional concept candidates based on name inference only | All candidates superseded by actual Zod schemas in the full source |

## What Happened

When this folder was first scanned, only a `.next/` build artifact directory and `node_modules/` were visible. This led to the incorrect classification of this folder as a dead/empty Next.js project fragment.

The folder subsequently (or on re-scan with correct path) revealed the full application source tree. The application's technology stack differs from what the `.next/` artifacts initially implied — it is a **Vite + React 19 + Tauri** project (not a Next.js project; the `.next/` directory was stale build artefact from an earlier scaffold).

## Dungeon-Topology Lane Status

The candidate lane `dungeon-topology` (originally proposed in this document under name-based inference) **has no separate donor**. The dungeon-relevant content in this folder belongs to the Adventure Generator's `DelveSchema` / `DelveRoomSchema` / `DelveThemeEnum` family, which is documented in `ADVENTURE_GENERATOR.md` under "Specified / Typed but NOT Implemented (WIP Surface)".

If a `DungeonAttachment` canonical type is needed in world-model, it should be derived from the Adventure Generator's WIP delve system — not from a separate donor. Register that decision as an ADR in `docs/adr/`.

## Folder Rename Recommendation

The folder `to be merged/dungeon generator/` should be renamed to `to be merged/adventure-generator/` to eliminate the name mismatch. This is an operational change outside the world-model scope; it should be tracked on the `to be merged/` collection side.
