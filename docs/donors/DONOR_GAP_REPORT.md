# Donor Gap Report

**Status:** Remediation In Progress  
**Scope:** `to be merged/` inventory vs. Phase 0-8 planning, adapter inventory, promoted schema, and donor classification docs

## Executive Summary

The donor inventory in `world-model` is now broader than the original three-donor plan. The current doc set now distinguishes:

- registered donors: Mythforge, Orbis, Adventure Generator
- unregistered real apps: Mappa Imperium, Dawn of Worlds, Sacred Sigil Generator, Watabou City
- clean-room app donors: Watabou City
- scaffold-copy donor group: Encounter Balancer Scaffold (`apocalypse/`, `character-creator/`, `deity creator/`, `genesis/`)

The inventory is now explicit about the fact that the four scaffold folders are one donor group with four physical roots, not four separate donors.

The older Orbis source-reference error has been corrected in the docs and adapter inventory. `mechanical-sycophant` is not treated as a donor in the current inventory.

This report tracks donor inventory and classification gaps. UI rehost fidelity gaps are tracked separately in `docs/donors/DONOR_UI_REHOST_GAP_ANALYSIS.md`. That report records the current problem that donor routes are integrated into a shared `world-model` shell but do not yet reproduce the original donor UIs.

## Inventory Summary

| Folder / Group | Status | Notes |
|---|---|---|
| `mythforge/` | registered donor | trunk / identity / schema-binding / spatial stack |
| `true orbis/Orbis Spec 2.0/` | registered donor source | simulation / planetary / event attachments |
| `to be merged/dungeon generator/` | registered donor source | Adventure Generator; folder name mismatch documented |
| `to be merged/mappa imperium/` | unregistered real app | world-era / hex-spatial / collaborative-session |
| `to be merged/world-builder-ui/` | unregistered real app | Dawn of Worlds |
| `to be merged/faction-image/` | unregistered real app | Sacred Sigil Generator |
| `to be merged/watabou-city-clean-room/2nd/` | clean-room app donor | procedural city layout |
| `to be merged/apocalypse/` + `character-creator/` + `deity creator/` + `genesis/` | scaffold-copy group | one identical encounter balancer app |

## Remaining Gap Areas

### 1. Adapter inventory alignment

The adapter source-root documentation needs to stay aligned with the corrected source paths:

- Orbis must point to `to be merged/true orbis/Orbis Spec 2.0/`
- Adventure Generator must point to `to be merged/dungeon generator/`
- `mechanical-sycophant` must remain excluded from donor inventory language

### 2. Donor classification completeness

The donor index now includes the scaffold-copy group as a single line item, but the broader planning docs still need to reflect that donor inventory expansion consistently.

### 3. Canonical schema gaps

The inventory still implies open schema work for:

- biome and spatial vocabulary reconciliation
- simulation domain coverage
- location attachment expansion
- encounter scaffold classification

These remain phase-level work, not donor inventory work.

### 4. Intent clarification for the scaffold group

The four identical scaffold folders need a decision:

- intentional duplicate product families
- accidental duplication
- or temporary collection artifacts

Until that is decided, they should remain a single donor group in docs and not be split into separate donor entries.

## Current Corrections Already Applied

- Added `docs/donors/ENCOUNTER_BALANCER_SCAFFOLD.md`
- Updated `docs/donors/INDEX.md`
- Updated `docs/roadmap/support/ADAPTER_INVENTORY.md`
- Kept `mechanical-sycophant` out of donor classification language

## Priority Follow-Up

1. Keep the donor index exhaustive and grouped by real donor identity
2. Keep adapter source roots aligned with the actual workspace paths
3. Avoid reintroducing stale donor labels in future docs
4. Resolve the scaffold-copy intent before any canonical-lane promotion
