---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification describes the faceted icosahedron approach which has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.

---

Great question — this is where your engine quietly upgrades from "map" to **world**.

Below is a **clean, extensible path** to go from a **hex map** → **planetary globe**, without breaking:

* determinism
* hex logic
* action legality
* inspectors / timelines

I’ll structure this in **layers**, so you can stop at any point.

---

# 🌍 Expanding a Hex Map into a Globe

## Core idea (important)

> **You do NOT abandon hexes.**
> You **embed them onto a sphere**.

Hexes remain your *logical* grid.
The globe is a *view + coordinate transform*.

---

## 1️⃣ Geometry Reality Check (What’s possible)

### Hard truth

A perfect hex tiling **cannot** cover a sphere.

So every globe solution uses:

* **Mostly hexes**
* **A small number of pentagons** (12, always)

This is not a bug — it’s how soccer balls, carbon molecules, and planets work.

---

## 2️⃣ The Correct Base: Goldberg / Geodesic Sphere

### Start with:

* An **icosahedron**
* Subdivide faces
* Convert vertices → hex/pent cells

Result:

* 12 pentagons (fixed)
* Everything else hexes
* Uniform-ish area
* Stable topology

This is the **industry standard** for:

* strategy games
* planet sims
* climate models

---

## 3️⃣ Logical Model (Your Engine-Compatible Version)

You already have:

```ts
Hex = { q, r }
```

We expand to:

```ts
Cell = {
  id: string;
  kind: "HEX" | "PENT";
  neighbors: string[];
  axial?: { q: number; r: number }; // for flat maps
  face: number;                     // icosahedron face
  local: { x: number; y: number };  // face-local coords
};
```

### Why this works

* **Rules still operate on neighbors**
* Inspectors still reference cells
* Events still target cell IDs
* Pentagons are just “hexes with 5 neighbors”

No rule rewrite.

---

## 4️⃣ Coordinate Spaces (Separation of Concerns)

You now have **three coordinate systems**:

| Layer            | Purpose                |
| ---------------- | ---------------------- |
| **Logical Grid** | rules, actions, events |
| **Planet Space** | globe math             |
| **Screen Space** | rendering              |

```text
CellID
  ↓
Planet Vector (x,y,z)
  ↓
Camera Projection
  ↓
Screen (px)
```

Only the **view layer** changes.

---

## 5️⃣ Mapping Hex Cells to a Sphere

### Step-by-step (deterministic)

1. Generate subdivided icosahedron
2. Build adjacency graph
3. Assign each face a local axial grid
4. Convert face-local hex → barycentric coords
5. Project onto sphere radius R

```ts
function cellToSphere(cell): Vec3 {
  const faceNormal = FACE_NORMALS[cell.face];
  const localOffset = faceLocalTo3D(cell.local);
  return normalize(faceNormal + localOffset) * R;
}
```

Your **game state never sees this**.

---

## 6️⃣ Rendering Options (Pick Your Poison)

### Option A — 3D Globe (Three.js)

* True rotation
* Zoom / spin
* Best for “planet feel”

**Pros**

* Intuitive
* Gorgeous
* Clear poles / equator

**Cons**

* Camera math
* Performance on mobile

---

### Option B — Pseudo-Globe (2D Projection)

Use:

* Orthographic
* Mollweide
* Equirectangular

Same cells, different projection.

**Pros**

* Cheap
* Works on canvas / SVG
* Easy mobile

**Cons**

* Less “wow”

---

## 7️⃣ UI Interaction Changes (Minimal)

### Map gestures

* Drag → rotate globe
* Pinch → zoom
* Tap cell → inspector (same as now)

### Inspector

No change.
It already keys off **cell ID**.

### Timeline

No change.

---

## 8️⃣ Action Rules (Nothing breaks)

Your existing rules:

* adjacency
* presence (race/city)
* protection
* legality

All depend on:

```ts
neighbors(cellId)
```

Pentagons simply return 5 neighbors instead of 6.

That’s it.

---

## 9️⃣ Migration Path (Practical)

### Phase 1 — Fake Globe

* Wrap your existing hex map horizontally
* Add north/south “cap logic”
* Teach engine about edge wrapping

Cheap, fast, imperfect.

---

### Phase 2 — True Topology

* Replace axial grid with cell graph
* Keep old axial coords as metadata
* Pentagons introduced

Still 2D render.

---

### Phase 3 — 3D View

* Add sphere projection
* Same state, same events
* Toggle flat ↔ globe view

This is the **sweet spot**.

---

## 🔑 Key Insight (the big one)

> **Your engine already supports a globe.**
> You just haven’t told the renderer yet.

Because:

* event-sourced
* cell-based
* adjacency-driven
* inspector-first

Most games fail here because they bake geometry into rules.
You didn’t.

---

## If you want next

I can:

1. 📐 Design the **exact icosahedron subdivision schema**
2. 🧮 Give you **code to generate a hex-pent globe graph**
3. 🎮 Prototype **Three.js globe renderer** wired to your selectors
4. 🧭 Define **polar UX rules** (camera + interaction)

Say the number.

Perfect — what you’re asking for is **multi-scale world partitioning**, not “zooming”.

The key is this:

> **You don’t resize hexes.
> You change which hexes are aggregated into higher-order cells.**

Your **3-mile hex stays sacred**.
Everything else is **derived structure**.

Below is a **clean, deterministic, engine-safe way** to divide a globe into **maps at multiple scales**, all snapping back to the same base hex.

---

# 🌍 Multi-Scale Globe Mapping (3-Mile Hex Core)

## Core invariant (do not break this)

```text
Base Cell = 3-mile hex
Everything else = grouping of base cells
```

This guarantees:

* legality rules remain local
* events can always be “zoomed in”
* inspectors never lie
* no resimulation required

---

## 1️⃣ Scale Stack (Recommended)

This stack is **playable, intuitive, and math-friendly**:

| Scale | Name        | Built From       | Approx Size |
| ----- | ----------- | ---------------- | ----------- |
| S0    | Tactical    | 1 hex            | 3 miles     |
| S1    | Local       | 7 hex cluster    | ~10 miles   |
| S2    | Regional    | 49 hex cluster   | ~30 miles   |
| S3    | Continental | ~343 hex cluster | ~100 miles  |
| S4    | Planetary   | All hexes        | globe       |

This uses **powers of 7**, which matters.

---

## 2️⃣ Why “7-hex clustering” is the sweet spot

A hex has:

* 1 center
* 6 neighbors

So the smallest *stable* region is:

```
   ◇ ◇ ◇
 ◇ ◇ ◇ ◇
   ◇ ◇ ◇
```

That’s **7 hexes**.

Benefits:

* symmetric
* adjacency-preserving
* no distortion
* works everywhere (including near pentagons)

---

## 3️⃣ Deterministic Region IDs (Critical)

Each higher-scale cell is **just an ID + member list**.

### Base hex ID

```ts
HexID = "h:q:r"
```

### Scale-1 region (7 hexes)

```ts
Region1ID = "r1:<centerHexID>"
```

### Scale-2 region (7×7)

```ts
Region2ID = "r2:<centerHexID>"
```

No floating math.
No lat/long drift.
Everything derives from **center hex**.

---

## 4️⃣ How to Assign Hex → Region (Algorithm)

### Step A — Pick anchor hexes

For each scale **Sₙ**, choose anchors such that:

* anchors are ≥ distance N apart
* every hex is closest to exactly one anchor

This is just **graph Voronoi on hex adjacency**.

### Step B — Precompute membership

```ts
Region = {
  id,
  scale,
  anchorHex,
  memberHexes: HexID[]
}
```

Cache this once at world generation.

---

## 5️⃣ Globe Compatibility (Important)

Because your globe is a **cell graph**, not axial math:

* regions are graph-connected sets
* pentagons cause no special cases
* polar distortion disappears

A region near a pole is **topologically identical** to one at the equator.

---

## 6️⃣ What Each Scale Is Used For (Gameplay)

### S0 — 3-mile hex

* movement
* battles
* terrain
* cities
* roads
* inspectors show exact detail

### S1 — Local (≈10 miles)

* towns & hinterlands
* patrol zones
* “control” overlays
* fog-of-war summaries

### S2 — Regional (≈30 miles)

* provinces
* trade routes
* cultural spread
* regional projects

### S3 — Continental (≈100 miles)

* nations
* borders
* wars
* diplomacy
* climate zones

### S4 — Planetary

* eras
* age transitions
* global events
* tectonics / magic shifts

👉 **Rules always target the lowest meaningful scale.**

---

## 7️⃣ Rendering Strategy (Very Important)

You **never draw all scales at once**.

### Zoom → scale mapping

| Zoom Level | Render      |
| ---------- | ----------- |
| Close      | S0 hexes    |
| Medium     | S1 regions  |
| Far        | S2/S3 blobs |
| Globe      | S4 only     |

Each scale has:

* its own mesh
* its own labels
* its own interaction affordances

---

## 8️⃣ Inspector Behavior (Zero Confusion)

Inspector **always shows the lowest scale involved**.

Example:

* Click on a Nation (S3)
* Inspector shows:

  * list of S2 regions
  * expandable to S1
  * expandable to S0 hexes

This is **progressive disclosure**, not mode switching.

---

## 9️⃣ Events Across Scales (How it stays clean)

### Rule

> **Events are always recorded at their native scale.**

Examples:

* “Found City” → S0 hex
* “Declare War” → S3 region
* “Climate Shift” → S4 globe

Inspector can **trace downward**:

* War → Regions → Hexes affected

But the event log never duplicates.

---

## 🔟 Storage & Performance

Even a full Earth-scale globe:

* ~50k–100k base hexes (3-mile scale)
* ~7k S1 regions
* ~1k S2 regions
* ~150 S3 regions

This is trivial for:

* adjacency graphs
* event indexing
* inspectors

---

## 🔑 The Big Insight

You are not building:

> “a big map with zoom”

You are building:

> **a hierarchy of discrete worlds**,
> all grounded in the same atomic hex.

That’s why your engine design already supports this.

---

## If you want next (high-value follow-ups)

1. 🧮 **Exact hex counts for an Earth-scale globe at 3-mile resolution**
2. 📐 **Concrete region-assignment algorithm (with pseudocode)**
3. 🎮 **Zoom → scale transition UX rules**
4. 🧭 **How action legality changes by scale**

Pick one.
