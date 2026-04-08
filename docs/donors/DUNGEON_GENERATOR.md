# Dungeon Generator — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Dungeon Generator |
| Internal ID | `dungeon-generator` (provisional) |
| Class | **empty fragment** |
| Adapter ID | none — not registered |
| Manifest | not yet created |
| Source Root | `to be merged/dungeon generator/zai2/` |
| Source Kind | Next.js app (only `.next/dev/` build artifacts survive) |
| Canonical Lane | dungeon-topology (candidate, no material to assess) |
| Phase 7 Methodology | see below — canonical extraction not currently possible |
| Adapter Status | **unregistered** — extraction blocked by missing source |

## What Survives

The `zai2/` folder contains only:
- `.next/dev/` — a single dev-mode Next.js build artifact directory
- `next-env.d.ts` — generated Next.js TypeScript environment declaration
- `node_modules/` — installed dependencies

The dev build reveals:
- A single application route: `/`
- A single API route: `/api`
- Module references to `src/app/page.tsx` and `src/app/layout.tsx` (which are not present — only compiled output)
- No named routes, no data types, no stores, no schemas

The application was a Next.js (App Router) project, but the source files (`src/`) were not included when this folder was placed in `to be merged/`. Only the transient build cache survives.

## Canonical Contribution Assessment

**Currently: none.** There is no source material to examine for semantic content.

The donor name ("Dungeon Generator") provides the following intent signal:
- The application was likely concerned with procedural or semi-procedural dungeon generation
- It used Next.js App Router with at least one API route (suggesting server-side generation logic)
- It may share domain vocabulary with Mythforge's `LocationAttachment` (dungeon spatial type) and Watabou City Generator (procedural spatial layout)

These signals are insufficient to drive canonical promotion. They can only inform the open questions list.

## Provisional Concept Candidates

If source material were recovered, these would be the expected canonical contribution candidates:

| Concept | Provisional Canonical Target | Based On |
|---|---|---|
| DungeonRoom / Chamber | `LocationAttachment` extension (dungeon type) or new `DungeonAttachment` | name-only inference |
| Encounter structure | `EntityRecord` attachment or new `EncounterAttachment` | name-only inference |
| Procedural generation params | extension on `WorldRecord` | name-only inference |

All labeled `basis: name-inference` — zero weight for conformance decisions.

## What Cannot Be Extracted

Everything. No source is present.

## UI Characterization Methodology

**Cannot characterize** with current material.

If source is recovered in the future:
- Source-present path: use **intent reconstruction** (treat recovered source as a fragment and reconstruct workflow intent)
- Source-absent path: if the original application can be located and run, switch to **behavioral capture**

Pre-registered waiver:
- **DG-W01**: Source files (`src/`) are missing. All characterization is blocked. Canonical promotion requires either source recovery or an explicit decision to authoritatively design the dungeon-topology lane from scratch (designed intent authoring without any donor material). Neither path is available until a deliberate decision is made.

## Registration Steps Required

This donor cannot be registered until one of the following occurs:

1. **Source recovery** — the original `src/` directory from the Next.js project is located and placed into `to be merged/dungeon generator/zai2/src/`
2. **Designed replacement** — the dungeon-topology canonical lane is designed from scratch (no donor material required), in which case Dungeon Generator is reclassified as a named intent signal only and the lane doc references it as inspiring context

Until then, this spec is a placeholder.

## Relation to Other Donors

- **Mythforge** already defines `dungeon` as one of the spatial types inside `LocationAttachment`. Any Dungeon Generator canonical concept must be additive on top of that, not a replacement.
- **Watabou City** contributes procedural spatial layout for cities. A dungeon-topology canonical lane would extend a similar pattern into underground/enclosed space.

## Open Questions

- Do the missing `src/` files exist anywhere else in the workspace (e.g., under `external/`, another `to be merged/` subfolder, or the broader repository)?
- Was `zai2` an iteration name? Is there a `zai1/` or `zai3/` elsewhere with more complete source?
- Is the API route (`/api`) indicative of a server-side generation service? If so, the generation logic may have been in `src/app/api/route.ts`.
- Should the dungeon-topology canonical lane be designed from scratch rather than waiting for source recovery?
