# Specification Governance (v1.0)

## 1. Authority Hierarchy
To resolve ambiguities between documentation generations, the following precedence order is **strictly enforced**:

1.  **Core Specifications** (`docs/01` to `docs/99`)
    *   These are the normative references for implementation.
    *   They supersede all other documentation.
2.  **Architecture Decisions** (`docs/decisions.md`)
    *   Records agreed-upon constraints (e.g., ID-006 Sea Level).
3.  **Codebase Truth** (`/types.ts`, `/schemas/*.ts`)
    *   The runtime source of truth for existing data structures.
4.  **Legacy Roadmap** (`docs/roadmap/*.md`)
    *   **Non-normative**. These documents represent historical intent or initial brainstorming.
    *   If a Roadmap spec conflicts with a Core Spec, the **Core Spec wins**.

## 2. Unit Standards (Frozen)
All Core Specs must adhere to the following unit profile unless explicitly noted as "Presentation Layer":

*   **Vertical Space**: **Meters**.
    *   Input: `HexData.biomeData.height` (Normalized -1.0 to 1.0).
    *   Conversion: `ElevationM = HeightNorm * (PlanetScaleConfig * BaseRadius)`.
    *   *Note*: Voxel indices (`y`) are derived from Meters, not the reverse.
*   **Horizontal Space**: **Meters**.
    *   Edge lengths and river slopes must be calculated in meters (arc length on sphere).
*   **Time**: **Years** (Simulation Time).
    *   Erosion rates are `m/yr`.
    *   Turns/ticks map to variable time deltas.

## 3. Ambiguity Resolution Process
When implementing a feature where specs are vague:
1.  Check `docs/08-data-contracts.md` for the data shape.
2.  Check `docs/decisions.md` for constraints.
3.  If still ambiguous, create a specific `docs/reports/ambiguity-fix-XYZ.md` proposing a concrete decision, then update the relevant Core Spec. Do not "guess" in code.
