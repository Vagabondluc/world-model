
# Architecture Decision Log

## ID-001: Unit Standardization
**Status**: ACCEPTED  
**Date**: 2024-05-20  

## ID-002: Geomorphological Noise Stacking
**Status**: ACCEPTED (Phase 1 Implemented)

## ID-003: Deterministic Plate Tectonics
**Status**: ACCEPTED (Phase 1 Implemented)

## ID-004: Whittaker Matrix Normalization
**Status**: ACCEPTED

## ID-005: Vertical Override Priority
**Status**: ACCEPTED

## ID-006: Voxel Coordinate Expansion
**Status**: ACCEPTED
**Context**: Ocean cells were perceived as "one block deep" because the Sea Level baseline was anchored at y=0.
**Decision**: Anchored Sea Level at y=32. This creates 32 blocks of vertical "room" for submarine depth below the waterline while keeping the floor at bedrock (y=0).
- **Result**: Oceans now have measurable depth and submarine relief.

## ID-007: IndexedDB Storage Backend
**Status**: ACCEPTED
**Context**: `localStorage` has a hard 5MB limit. As the simulation grows to track historical events, settlement layouts, and more detailed terraforming deltas, we will exceed this quota.
**Decision**: Migrate persistence layer to **IndexedDB** using a lightweight wrapper (e.g., `idb-keyval` or custom promise wrapper).
- **Strategy**: Store heavy binary/JSON blobs in IDB; keep lightweight metadata (Project List) in `localStorage` for fast initial render if necessary, or move all to IDB.
- **Result**: Storage limit increases to ~80% of disk space. Asynchronous I/O prevents UI freezing during saves.
