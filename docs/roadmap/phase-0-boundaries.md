---
title: Phase 0 — Boundaries & Workspace Freeze
phase: 0
status: in-progress
owners:
  - world-model/core
contacts:
  - TBD
created: 2026-04-02
tags:
  - roadmap
  - boundaries
  - canonical
---

TL;DR

Phase 0 freezes ownership, app scope, adapter contracts, and repository layout so subsequent phases implement against a stable, auditable surface.

# Phase 0: Boundaries and Workspace Freeze

## Objective

Lock the shape of the work so later phases cannot drift into donor-specific rework or ambiguous ownership.

## Dependencies

- `world-model` workspace exists
- canonical contracts already exist
- promotion layer already exists
- adapter copy policy already exists

## Subphases

### 0.1 Canonical ownership freeze

Deliverables:

- statement that `world-model` is the only canonical truth surface
- statement that donor repos are immutable source material
- statement that adapter snapshots are the only donor source the final app may read

Acceptance:

- no roadmap item depends on runtime donor imports
- no app-local overlay is mislabeled canonical

### 0.2 Final app scope freeze

Deliverables:

- final app lives in `apps/unified-app`
- three interaction depths are defined:
  - `Guided`
  - `Studio`
  - `Architect`
- shell layout is fixed:
  - left nav
  - top context bar
  - center workspace
  - right inspector
  - optional bottom drawer

Acceptance:

- no alternate top-level app shell is introduced
- mode names and responsibilities are recorded in the roadmap

### 0.3 Adapter boundary freeze

Deliverables:

- each donor has a manifest
- each donor has a source snapshot
- each donor has mapping, fixture, and test folders
- each donor has a concept family list

Acceptance:

- no donor can be used without a manifest
- no copied file is untraceable

### 0.4 Repository layout freeze

Deliverables:

- final app hierarchy documented
- canonical crate hierarchy documented
- docs hierarchy documented
- tooling hierarchy documented

Acceptance:

- all new work can be placed into a named folder without ambiguity

## Harness

- canonical contract validation
- repository layout assertion
- direct-import regression check
- manifest parsing check

## Exit Criteria

- ownership is frozen
- app scope is frozen
- adapter scope is frozen
- no hidden dependency on donor repos remains in the plan

## Failure Cases

- donor repo is referenced at runtime
- UI state is treated as canonical by mistake
- adapter snapshot folder is missing or unstructured
- final app shell is not uniquely defined
