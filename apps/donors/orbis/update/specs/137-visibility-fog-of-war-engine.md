# 137 Visibility & Fog of War Engine

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/135-typescript-simulation-architecture.md`, `docs/brainstorm/113-canonical-key-registry.md`]
- `Owns`: [`visibility grid`, `fow rendering policy`]
- `Writes`: [`visibility updates`, `shroud data`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/137-visibility-fog-of-war-engine.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a high-performance system for managing unit vision and world discovery on large maps using bitmasking and layered canvases.

## 1. Data Structure: Visibility Grid
- **Global Discovery**: A 1D `Uint8Array` stores discovery bits per tile.
  - `Bit 0`: Discovered (Shroud removed).
  - `Bit 1`: Currently Visible (Fog removed).
- **Faction Isolation**: Each faction owns its own Visibility Grid in the Sim-Worker.

## 2. Reveal Algorithm
- **Unit Vision**: Units have a `vision_radius` component.
- **Offscreen Mask**:
  1. Draw a white circle (vision radius) onto an offscreen "Reveal Canvas."
  2. Map the canvas pixels back to the Visibility Grid `Bit 1`.
  3. UI thread uses `globalCompositeOperation = 'destination-out'` to erase fog on the display layer.

## 3. Shroud and Fog Rendering
- **Bit 0 (Shroud)**: Never seen. UI renders as pure black.
- **Bit 1 (Fog)**: Previously seen but currently out of sight. UI renders as "Grey Fog" (desaturated/dimmed map).
- **Active Sight**: Both bits set. UI renders full color/animation.
- **Persistence**: Information on revealed but non-visible tiles is "stale" (shows last known state of cities/terrain, but hides active enemy units).

## 4. Deterministic Visibility (AI)
- AI decision-making must only use information from tiles where `Bit 1` is active for its faction.
- Hidden units (e.g., in forests or underwater) require `detection_radius` checks against the visibility bits.

## 5. Performance Targets
- **Update Frequency**: Vision grid updated every 5 ticks or upon unit movement > 1 tile.
- **Latency**: Fog erasure on UI thread must be < 2ms to prevent stutter during scrolling.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
