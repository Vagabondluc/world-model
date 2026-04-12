# Shared Hex Map – Player Board Specification

## 1. Purpose

Design a **shared hexagonal world map** for a multiplayer game where players each control a territorial region. The system must support **1 to 6 players**, maximize **shared borders between players**, and remain **geometrically coherent and symmetric**.

This spec focuses only on **map topology and geometry**, not rules, UI, or rendering.

---

## 2. Core Constraints

### 2.1 Hex Geometry

* **Hex type**: Regular hexagons (flat-top or pointy-top is an implementation choice; topology must be orientation-agnostic).
* **Hex scale**: Each hex represents **24 miles edge-to-edge** (center-to-center distance is implementation-defined).
* **Adjacency**: Each hex has up to **6 neighbors**.

### 2.2 Design Goals

* Maximize **player-to-player shared borders**.
* Avoid isolated player regions.
* Preserve **symmetry and fairness**.
* Boards must scale cleanly from **1 to 6 players** without redesigning the entire system.

---

## 3. Terminology

* **Hex**: One map cell (24 miles wide).
* **Region**: A contiguous set of hexes controlled by one player.
* **Shared Border**: One or more edges where hexes of two different players touch.
* **Board Shape**: The global silhouette of all hexes combined.

---

## 4. Board Topology by Player Count

### 4.1 1 Player – Solo Board

**Shape**: Compact hexagon

```
   ⬡ ⬡ ⬡
 ⬡ ⬡ ⬡ ⬡
   ⬡ ⬡ ⬡
```

* Single contiguous region.
* No shared borders.
* Acts as baseline topology.

---

### 4.2 2 Players – Bipolar Split

**Shape**: Elongated hex or rhombus

```
 P1 ⬡ ⬡ P2
 P1 ⬡ ⬡ P2
 P1 ⬡ ⬡ P2
```

* Players share a **long central border**.
* Symmetric east–west or north–south split.
* Maximum direct confrontation.

**Shared borders**: 3–4 hex edges minimum.

---

### 4.3 3 Players – Triangular Ring

**Shape**: Tri-hex radial layout

```
    P1
 P3  ⬡  P2
    ⬡
```

Expanded version (practical):

* Three wedge-shaped regions.
* Each player borders **both others**.
* Central neutral or contested hex optional.

**Shared borders**:

* P1–P2
* P2–P3
* P3–P1

Perfect cyclic balance.

---

### 4.4 4 Players – Quad Diamond

**Shape**: Diamond / square-like hex cluster

```
   P1  P2
   ⬡ ⬡
   ⬡ ⬡
   P4  P3
```

* Each player borders **two neighbors**.
* No diagonal-only adjacency.
* Avoids isolated corners.

**Shared borders**:

* P1–P2, P1–P4
* P2–P3
* P3–P4

Optional center hex to increase interaction density.

---

### 4.5 5 Players – Pentagon Ring

**Shape**: Ring around a center

```
    P1
 P5   ⬡   P2
    P4  P3
```

* Five regions arranged in a **cycle**.
* Each player borders exactly **two others**.
* Optional central neutral zone to prevent map fragmentation.

**Shared borders**:

* P1–P2–P3–P4–P5–P1

No player is isolated; symmetry preserved.

---

### 4.6 6 Players – Hex Flower (Optimal)

**Shape**: Full hex ring

```
    P1
 P6   ⬡   P2
 P5   ⬡   P3
    P4
```

* One player per side of a central hex or cluster.
* Each player borders **two neighbors**, optionally three if regions expand inward.
* Highest symmetry achievable.

**Shared borders**:

* Cyclic adjacency: each player shares borders with exactly two others.

This is the **most stable and scalable topology**.

---

## 5. Scaling Regions (Hex Count per Player)

To increase map size without breaking topology:

* Expand regions **radially outward** from their core.
* Preserve border edges between neighboring players.
* Avoid inward growth that removes shared borders unless explicitly designed.

Recommended:

* Keep **at least 2–3 shared hex edges** between neighboring players at all sizes.

---

## 6. Deterministic Generation Rules

To allow procedural generation:

1. Choose player count (1–6).
2. Select base topology template (above).
3. Assign axial/cube coordinates to region seeds.
4. Grow regions using constrained flood-fill:

   * Cannot overtake another player's border.
   * Must preserve minimum shared edges.
5. Optional: insert neutral or contested hexes at region junctions.

---

## 7. Non-Goals (Explicitly Out of Scope)

* Rendering (2D / 3D)
* Fog of war
* Terrain types
* Rules, combat, or movement
* Networking or sync

---

## 8. Design Rationale (Summary)

* **Hex rings and wedges** maximize shared borders.
* Cyclic adjacency prevents kingmaking and isolation.
* Symmetry ensures fairness.
* All layouts can be expressed in axial or cube hex coordinates.

---

## 9. Extension Hooks (Optional)

* Central neutral zone
* Variable hex scale (still 24 miles logical width)
* Asymmetric scenarios using the same topology

---

---

## 10. Board Sizes and Hex Counts

Each configuration supports three canonical sizes. Counts are **per player**, excluding optional neutral hexes.

### 10.1 Size Tiers

| Size     | Hexes / Player | Intended Use                      |
| -------- | -------------- | --------------------------------- |
| Small    | 7              | Fast games, demos, tight conflict |
| Standard | 19             | Default play, strategic depth     |
| Large    | 37             | Long campaigns, logistics play    |

All sizes preserve the same **adjacency graph**; only region depth increases.

---

## 11. Coordinate System

### 11.1 Axial Coordinates (q, r)

We use **axial hex coordinates**:

* q = column axis
* r = diagonal axis

Cube coordinates (x, y, z) are derived as:

* x = q
* z = r
* y = −x − z

This spec provides **axial coordinates** only.

---

## 12. Seed Coordinates by Player Count

These are **region seed hexes**. Regions grow outward from these points.

### 12.1 1 Player

| Player | q | r |
| ------ | - | - |
| P1     | 0 | 0 |

---

### 12.2 2 Players

| Player | q  | r |
| ------ | -- | - |
| P1     | -2 | 0 |
| P2     | 2  | 0 |

Shared border forms along q = 0.

---

### 12.3 3 Players

| Player | q  | r  |
| ------ | -- | -- |
| P1     | 0  | -2 |
| P2     | 2  | 0  |
| P3     | -2 | 2  |

Optional neutral hex at (0,0).

---

### 12.4 4 Players

| Player | q  | r  |
| ------ | -- | -- |
| P1     | -2 | -1 |
| P2     | 2  | -1 |
| P3     | 2  | 1  |
| P4     | -2 | 1  |

---

### 12.5 5 Players

| Player | q  | r  |
| ------ | -- | -- |
| P1     | 0  | -3 |
| P2     | 3  | -1 |
| P3     | 2  | 2  |
| P4     | -2 | 3  |
| P5     | -3 | 0  |

Optional neutral cluster around (0,0).

---

### 12.6 6 Players

| Player | q  | r  |
| ------ | -- | -- |
| P1     | 0  | -3 |
| P2     | 3  | -2 |
| P3     | 3  | 2  |
| P4     | 0  | 3  |
| P5     | -3 | 2  |
| P6     | -3 | -2 |

---

## 13. ASCII Reference Boards (Standard Size)

Legend: `A–F = player regions`, `· = neutral`

### 13.1 2 Players (Standard)

```
  A A A · B B B
 A A A · B B B
  A A A · B B B
```

---

### 13.2 3 Players (Standard)

```
    A A
  C C · B B
    C · B
```

---

### 13.3 4 Players (Standard)

```
    A A B B
    A · · B
    D · · C
    D D C C
```

---

### 13.4 5 Players (Standard)

```
      A A
   E E · B B
      · ·
   D D · C C
```

---

### 13.5 6 Players (Standard)

```
      A A
   F F · B B
   F · · · B
   E · · · C
   E E · C C
```

---

## 14. Procedural Generation Specification

### 14.1 Inputs

* Player count (1–6)
* Board size tier (small / standard / large)
* Seed (optional, for reproducibility)

---

### 14.2 Generation Steps

1. Load topology template for player count.
2. Place region seeds at fixed axial coordinates.
3. Determine target hex count per player (by size tier).
4. For each player, perform constrained flood-fill:

   * Prefer outward growth from seed.
   * Never overwrite another player’s hex.
   * Maintain at least **2 shared edges** with each neighbor.
5. Fill remaining gaps with neutral hexes (optional).
6. Validate:

   * All regions contiguous.
   * All required adjacencies present.

---

### 14.3 Validation Rules

* No isolated region.
* No player with fewer than required neighbors.
* Total hex count matches expected sum.

---

## 15. Rules-Facing Abstractions

### 15.1 Region

A **Region** is the full contiguous set of hexes controlled by a player.

Attributes:

* Owner
* Hex list
* Neighboring regions

---

### 15.2 Front

A **Front** is a continuous chain of shared edges between two regions.

Attributes:

* Player A / Player B
* Length (number of shared edges)
* Hex pairs

Fronts are the primary unit for:

* Conflict
* Trade
* Diplomacy

---

### 15.3 Contested Border

A **Contested Border** is a front segment flagged as unstable.

Attributes:

* Front reference
* Intensity / pressure value
* Temporary control state

---

### 15.4 Neutral Zone (Optional)

Neutral hexes:

* Do not belong to any region
* Act as buffers or objectives
* Common at 3-, 5-, and 6-player junctions

---

## 16. Guarantees Provided by This Spec

* Deterministic topology per player count
* Maximum coherent shared borders
* Scalable map sizes without redesign
* Rules-friendly abstractions

---

**Status**: Expanded – geometry, generation, and rules abstraction locked

---

# Expansion Pack — Counts, Coordinates, References, Generation, Rules Layer

## 10. Size Tiers and Exact Hex Counts

This section defines **exact, deterministic hex counts** for each supported player count and size tier.

### 10.1 Notation

* **Axial coordinates**: `(q, r)`
* **Cube coordinates**: `(x, y, z)` with `x=q`, `z=r`, `y=-x-z`
* **Hex distance**: `dist((q1,r1),(q2,r2)) = max(|dx|,|dy|,|dz|)` in cube

### 10.2 Canonical Board Families

We use two board families:

**Family A — Hexagon board (radius k)**

* Board = all hexes with `dist((q,r),(0,0)) ≤ k`
* **Total hexes**: `N = 1 + 3k(k+1)`
* Perfect symmetry for **1,2,3,5,6 players**.

**Family B — Rhombus board (size n)**

* Board = all axial hexes with `q ∈ [0..n-1]` and `r ∈ [0..n-1]`
* **Total hexes**: `N = n²`
* Best for **4 players** (true equal quarters).

### 10.3 Size Tiers (by player count)

#### 1 Player (Hexagon board)

| Tier     |  k | Total hexes |
| -------- | -: | ----------: |
| Small    |  2 |          19 |
| Standard |  3 |          37 |
| Large    |  4 |          61 |

#### 2 Players (Hexagon board split into 3 sectors each + 1 center)

Each player gets **exactly 3 of 6 sectors**; the **center hex** can be neutral/contested/assigned by rule.

Per-player hexes (excluding center): `Hp = 3 * k(k+1)/2`

| Tier     |  k | Total hexes | Per player (excl. center) | Center              |
| -------- | -: | ----------: | ------------------------: | ------------------- |
| Small    |  2 |          19 |                         9 | 1 neutral/contested |
| Standard |  3 |          37 |                        18 | 1 neutral/contested |
| Large    |  4 |          61 |                        30 | 1 neutral/contested |

#### 3 Players (Hexagon board split into 2 sectors each + 1 center)

Each player gets **exactly 2 of 6 sectors**; the **center hex** can be neutral/contested/assigned by rule.

Per-player hexes (excluding center): `Hp = k(k+1)`

| Tier     |  k | Total hexes | Per player (excl. center) | Center              |
| -------- | -: | ----------: | ------------------------: | ------------------- |
| Small    |  2 |          19 |                         6 | 1 neutral/contested |
| Standard |  3 |          37 |                        12 | 1 neutral/contested |
| Large    |  4 |          61 |                        20 | 1 neutral/contested |

#### 4 Players (Rhombus board split into equal quarters)

Choose even `n` so each quarter has equal area.

Per-player hexes: `Hp = n² / 4`

| Tier     |  n | Total hexes | Per player |
| -------- | -: | ----------: | ---------: |
| Small    |  6 |          36 |          9 |
| Standard |  8 |          64 |         16 |
| Large    | 10 |         100 |         25 |

#### 5 Players (Hexagon board + neutral remainder)

Hexagon totals are not divisible by 5. We enforce equal player sizes and keep the remainder as **Neutral/Contested**.

| Tier     |  k | Total hexes | Per player | Neutral/Contested |
| -------- | -: | ----------: | ---------: | ----------------: |
| Small    |  4 |          61 |         12 |                 1 |
| Standard |  5 |          91 |         18 |                 1 |
| Large    |  6 |         127 |         25 |                 2 |

#### 6 Players (Hexagon board split into 1 sector each + 1 center)

Each player gets **exactly 1 of 6 sectors**; the **center hex** can be neutral/contested/assigned by rule.

Per-player hexes (excluding center): `Hp = k(k+1)/2`

| Tier     |  k | Total hexes | Per player (excl. center) | Center              |
| -------- | -: | ----------: | ------------------------: | ------------------- |
| Small    |  4 |          61 |                        10 | 1 neutral/contested |
| Standard |  5 |          91 |                        15 | 1 neutral/contested |
| Large    |  6 |         127 |                        21 | 1 neutral/contested |

---

## 11. Axial/Cube Coordinate Tables

### 11.1 Directions (Axial)

Using the pointy-top axial neighbor directions:

* `D0 = ( +1,  0)`
* `D1 = ( +1, -1)`
* `D2 = (  0, -1)`
* `D3 = ( -1,  0)`
* `D4 = ( -1, +1)`
* `D5 = (  0, +1)`

Cube conversion:

* `cube(q,r) = (x=q, y=-q-r, z=r)`

### 11.2 Ring Seeds for Hexagon Boards (radius k)

* `S0 = ( k,  0)`
* `S1 = ( k, -k)`
* `S2 = ( 0, -k)`
* `S3 = (-k,  0)`
* `S4 = (-k,  k)`
* `S5 = ( 0,  k)`

#### 6 Players (one sector each)

| Player | Axial seed (q,r) | Cube seed (x,y,z) |
| ------ | ---------------- | ----------------- |
| P1     | ( k,  0)         | ( k, -k,  0)      |
| P2     | ( k, -k)         | ( k,  0, -k)      |
| P3     | ( 0, -k)         | ( 0,  k, -k)      |
| P4     | (-k,  0)         | (-k,  k,  0)      |
| P5     | (-k,  k)         | (-k,  0,  k)      |
| P6     | ( 0,  k)         | ( 0, -k,  k)      |

#### 3 Players (two adjacent sectors each)

| Player | Axial seed | Cube seed    |
| ------ | ---------- | ------------ |
| P1     | ( k,  0)   | ( k, -k,  0) |
| P2     | ( 0, -k)   | ( 0,  k, -k) |
| P3     | (-k,  k)   | (-k,  0,  k) |

#### 2 Players (three sectors each)

| Player | Axial seed | Cube seed    |
| ------ | ---------- | ------------ |
| P1     | ( 0, -k)   | ( 0,  k, -k) |
| P2     | ( 0,  k)   | ( 0, -k,  k) |

#### 5 Players (equal sizes + neutral remainder)

Use 5 seeds on the ring (omit `S5` by default).

| Player | Axial seed | Cube seed    |
| ------ | ---------- | ------------ |
| P1     | ( k,  0)   | ( k, -k,  0) |
| P2     | ( k, -k)   | ( k,  0, -k) |
| P3     | ( 0, -k)   | ( 0,  k, -k) |
| P4     | (-k,  0)   | (-k,  k,  0) |
| P5     | (-k,  k)   | (-k,  0,  k) |

### 11.3 Seeds for 4 Players (Rhombus size n)

For rhombus `q,r ∈ [0..n-1]` and even `n`:

* `h = n/2`
* Q1 seed = `(h/2, h/2)`
* Q2 seed = `(h + h/2, h/2)`
* Q3 seed = `(h + h/2, h + h/2)`
* Q4 seed = `(h/2, h + h/2)`

Example n=8 → seeds: (2,2), (6,2), (6,6), (2,6)

---

## 12. Reference Boards (ASCII)

These are **schematics** to communicate intent; authoritative geometry is the coordinate sets.

### 12.1 Hexagon silhouette (radius k=2)

```
      · · ·
    · · · ·
  · · · · ·
    · · · ·
      · · ·
```

### 12.2 6 Players — sector concept

```
           P1
      P6        P2

      P5        P3
           P4
```

### 12.3 4 Players (n=6) — quadrant concept

```
Q1 Q1 Q2 Q2 Q2 Q2
 Q1 Q1 Q2 Q2 Q2
  Q1 Q1 Q2 Q2
   Q4 Q4 Q3
    Q4 Q3 Q3
     Q4 Q3
```

---

## 13. Procedural Generation Spec (Inputs → Guaranteed Topology)

### 13.1 Inputs

* `player_count ∈ {1..6}`
* `tier ∈ {small, standard, large}`
* `board_family` (derived): `hex(k)` or `rhombus(n)`
* `center_rule ∈ {neutral, contested, assigned_to_lowest_id}`
* `neutral_selection ∈ {closest_to_center, frontier_between_all}` (5P only; also valid for center)

### 13.2 Outputs

* `board_hexes: Set<Axial(q,r)>`
* `owner: Map<Axial(q,r) -> {P1..P6, Neutral}>`
* `shared_borders: Map<(A,B) -> int border_edges>`

### 13.3 Step A — Build board silhouette

**If player_count == 4**:

* Lookup `n` by tier.
* Generate all hexes `q,r ∈ [0..n-1]`.

**Else**:

* Lookup `k` by tier.
* Generate all hexes with `dist((q,r),(0,0)) ≤ k`.

### 13.4 Step B — Seed placement

Use §11 tables.

### 13.5 Step C — Ownership assignment

**1,2,3,6 players on hex boards (sector partition)**

* Partition the hex board into **6 sectors** around `(0,0)`.
* Assign sectors:

  * 6P: 1 sector each
  * 3P: 2 adjacent sectors each
  * 2P: 3 adjacent sectors each
  * 1P: all sectors
* Apply `center_rule` to `(0,0)`.

**4 players on rhombus (quadrants)**

* Quadrant by `(q < n/2)` and `(r < n/2)`.

**5 players on hex boards (quota BFS + neutral remainder)**

1. Set per-player quota and neutral remainder from §10.3.
2. Run multi-source BFS from seeds.
3. When a player reaches quota, it stops claiming.
4. Choose neutral hexes using `neutral_selection`:

   * `closest_to_center`: smallest `dist(to (0,0))`
   * `frontier_between_all`: hexes touching ≥2 different players (maximizes shared borders)

### 13.6 Step D — Shared border computation

For each adjacent pair `(a,b)`:

* If `owner[a] != owner[b]` and neither is unassigned:

  * increment `shared_borders[(min(owner[a],owner[b]), max(...))]`.

---

## 14. SVG Reference Output (Parametric)

### 14.1 SVG Contract

Generate SVG from axial coordinates:

* input: `board_hexes`, `owner`, `hex_size_px`, `orientation`
* output: `<polygon>` per hex + outlines

Required layers:

1. Hex fills (by owner)
2. Hex outlines
3. Optional debug text `(q,r)`

### 14.2 Minimal SVG Example (placeholder)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <text x="16" y="32" font-family="monospace" font-size="14">
    Render hex polygons from axial coords; color by owner.
  </text>
</svg>
```

---

## 15. Rules-Facing Abstraction Layer

### 15.1 Concepts

* **Region(player)**: all hexes owned by that player.
* **Front(A,B)**: maximal contiguous chain of border edges where A touches B.
* **Contested Zone**: any Neutral hex, plus any hex adjacent to ≥2 different players.
* **Front Strength(A,B)**: number of border edges between A and B.

### 15.2 Guarantees

* 2P: one main continuous A↔B border (sector boundary)
* 3P: every player borders the other two
* 6P: cyclic neighbors (each borders exactly two)
* 4P: quadrant neighbors, no isolated corner
* 5P: every player has ≥2 neighbors; neutral remainder can be chosen to prevent isolation

---

**Status**: Expanded – exact counts + seed tables + deterministic generation + rules abstraction.

Here’s a **deterministic sector classifier** for axial coords `(q, r)` (pointy-top axial), mapping every hex to a wedge **0–5** around the origin. No BFS, no angles, no floats.

## Conventions

* Axial `(q,r)` → cube `(x,y,z)`:

  * `x = q`
  * `z = r`
  * `y = -x - z = -q - r`

* The center `(0,0)` is special.

We’ll classify by which of the three cube axes is **most negative** (i.e., farthest “toward” that axis), then split ties by a stable rule. This yields 6 sectors that align with the 6 directions.

## Sector IDs (meaning)

Let directions in axial be:

* `D0 = (+1,  0)`
* `D1 = (+1, -1)`
* `D2 = ( 0, -1)`
* `D3 = (-1,  0)`
* `D4 = (-1, +1)`
* `D5 = ( 0, +1)`

Sector `s` is the wedge centered on `Ds` (60° wedge).

## Classifier (exact rules)

### 1) Center

If `(q,r) == (0,0)` → return `CENTER` (handle by `center_rule`).

### 2) Compute cube and the “negativity scores”

```
x = q
z = r
y = -x - z
```

We look at `(-x, -y, -z)` (how negative each axis is). Larger means “more in that direction”.

Define:

```
nx = -x
ny = -y
nz = -z
```

### 3) Primary wedge by argmax of (nx, ny, nz)

Let `m = max(nx, ny, nz)`.

* If `nx` is strictly greatest → you’re in the half-plane toward **-x**, i.e. between directions `D3` and `D4`.
* If `ny` strictly greatest → toward **-y**, between `D5` and `D0`.
* If `nz` strictly greatest → toward **-z**, between `D1` and `D2`.

### 4) Split each half-plane into its two adjacent sectors (tie-free, deterministic)

Use the **sign** of the corresponding axial components to decide which side of that half-plane you’re on:

#### Case A: `nx` is greatest (toward -x)

This is the “west” side (x is most negative).

* If `z >= y`  → sector **4** (toward `D4 = (-1,+1)`)
* Else         → sector **3** (toward `D3 = (-1,0)`)

(Recall `y = -x - z`)

#### Case B: `ny` is greatest (toward -y)

This is the “southeast” side (y is most negative).

* If `x >= z` → sector **0** (toward `D0 = (+1,0)`)
* Else        → sector **5** (toward `D5 = (0,+1)`)

#### Case C: `nz` is greatest (toward -z)

This is the “northwest” side (z is most negative).

* If `y >= x` → sector **2** (toward `D2 = (0,-1)`)
* Else        → sector **1** (toward `D1 = (+1,-1)`)

### 5) What about exact ties in the primary argmax?

On the three ray boundaries you can have ties (e.g., `nx == ny > nz`). We resolve them deterministically to keep wedges closed and non-overlapping.

Use this priority order when `m` is tied:

1. Prefer `ny` if tied (assign to Case B)
2. Else prefer `nz` if tied (Case C)
3. Else `nx` (Case A)

That makes the partition stable.

---

## Full classifier as compact pseudocode

```
sector(q,r):
  if q==0 and r==0: return CENTER

  x=q; z=r; y=-x-z
  nx=-x; ny=-y; nz=-z

  m=max(nx,ny,nz)

  // primary selection with tie priority: ny > nz > nx
  if ny==m and ny>=nz and ny>=nx:
      // Case B (toward -y)
      if x >= z: return 0
      else:      return 5

  else if nz==m and nz>=nx:
      // Case C (toward -z)
      if y >= x: return 2
      else:      return 1

  else:
      // Case A (toward -x)
      if z >= y: return 4
      else:      return 3
```

This is **pure integer math**.

---

## How to use this for 2/3/6 players (no BFS)

Let `s = sector(q,r)`.

* **6 players**: owner = `P(s)` (each gets one sector), center by rule.
* **3 players**: each gets **two adjacent sectors**:

  * `P1`: sectors `{0,1}`
  * `P2`: sectors `{2,3}`
  * `P3`: sectors `{4,5}`
    (or rotate as you like)
* **2 players**: each gets **three adjacent sectors**:

  * `P1`: `{0,1,2}`
  * `P2`: `{3,4,5}`
    (or rotate)

Because the wedges are radial, shared borders are guaranteed and continuous.

---

## Sanity checks (a few points)

* `(1,0)` → x=1 z=0 y=-1 → ny=1 is max, x>=z → sector 0 ✅ (east)
* `(1,-1)` → x=1 z=-1 y=0 → nz=1 max, y>=x? 0>=1 false → sector 1 ✅ (NE)
* `(0,-1)` → x=0 z=-1 y=1 → nz=1 max, y>=x? 1>=0 true → sector 2 ✅ (NW)
* `(-1,0)` → x=-1 z=0 y=1 → nx=1 max, z>=y? 0>=1 false → sector 3 ✅ (west)
* `(-1,1)` → x=-1 z=1 y=0 → nx=1 max, z>=y? 1>=0 true → sector 4 ✅ (SW)
* `(0,1)` → x=0 z=1 y=-1 → ny=1 max, x>=z? 0>=1 false → sector 5 ✅ (SE)

If you want, I can also give you the **exact boundary behavior** (which sectors “own” the three rays) in a tiny table so you can match it to visuals perfectly.

Here’s the **exact boundary behavior** (the 3 “rays” from the origin) for that classifier — i.e., which sector owns the line when a hex lies *exactly* on a wedge boundary.

## The 3 boundary rays (in axial coords)

In cube terms, boundaries happen when **two negativity scores tie for max**, which corresponds to these axial lines:

### Ray A: `r = 0`  (the q-axis)

Points: `(t, 0)` and `(-t, 0)`

### Ray B: `q = 0`  (the r-axis)

Points: `(0, t)` and `(0, -t)`

### Ray C: `q + r = 0`

Points: `(t, -t)` and `(-t, t)`

These are the 3 straight lines that form the 6 sector edges.

---

## Ownership of the boundary rays (tie resolution)

Recall tie priority: **ny > nz > nx** (i.e., if two are tied for max, prefer the case using `ny`, else `nz`, else `nx`).

### 1) Boundary `r = 0`

For any `(q,0)`, we have `z=0`, `y=-q`.

* For `q > 0` (east side): points lie on the boundary between sectors **0** and **1**, and the classifier assigns them to **sector 0**.
* For `q < 0` (west side): boundary between sectors **3** and **4**, assigned to **sector 3**.

**Rule summary**

* `r=0, q>0 → sector 0`
* `r=0, q<0 → sector 3`

### 2) Boundary `q = 0`

For `(0,r)`, we have `x=0`, `y=-r`.

* For `r > 0` (SE side): boundary between sectors **5** and **4**, assigned to **sector 5**.
* For `r < 0` (NW side): boundary between sectors **2** and **1**, assigned to **sector 2**.

**Rule summary**

* `q=0, r>0 → sector 5`
* `q=0, r<0 → sector 2`

### 3) Boundary `q + r = 0`  (i.e., `r = -q`)

For `(q,-q)`, we have `y = 0`.

* For `q > 0` (NE side): boundary between sectors **1** and **0**, assigned to **sector 0** *or* **1**?
  With the classifier given: it resolves to **Case C** (nz max) then split → **sector 1** for `(q,-q)` with `q>0`.
  (You can verify `(1,-1)` → sector 1.)
* For `q < 0` (SW side): boundary between sectors **4** and **5**, assigned to **sector 4**.
  (Verify `(-1,1)` → sector 4.)

**Rule summary**

* `q+r=0, q>0 → sector 1`
* `q+r=0, q<0 → sector 4`

---

## One compact boundary table

| Boundary line | Positive direction | Owned sector | Negative direction | Owned sector |
| ------------- | -----------------: | -----------: | -----------------: | -----------: |
| `r = 0`       |       `(t,0), t>0` |        **0** |      `(-t,0), t>0` |        **3** |
| `q = 0`       |       `(0,t), t>0` |        **5** |      `(0,-t), t>0` |        **2** |
| `q + r = 0`   |      `(t,-t), t>0` |        **1** |      `(-t,t), t>0` |        **4** |

---

## Why this matters (practical)

This gives you a **fully closed partition**: every hex is owned by exactly one sector, including boundary cases, with stable behavior across all radii.

If you want a different "feel" (e.g., make `r=0` belong to sector 1 instead of 0), you only change the **tie priority** or the **split inequalities** — but then we should regenerate the boundary table to match.

---

## Related Documentation

This specification is part of the Mappa Imperium documentation ecosystem. The following documents provide complementary information:

### Coordinate System & Utilities
- [`hex_utils_tdd_spec.md`](../hex_utils_tdd_spec.md) - Test specifications for hex coordinate transformation utilities (axial ↔ cube conversion, distance calculations, neighbor lookups)

### Map Generation
- [`map_generation_tdd_spec.md`](../map_generation_tdd_spec.md) - Test specifications for procedural map generation algorithms (Perlin noise, biome mapping, terrain assignment)

### Rendering & Visualization
- [`hex_tile_renderer_spec.md`](../hex_tile_renderer_spec.md) - Single hex tile rendering with SVG and tile modes
- [`unified_map_renderer_spec.md`](../unified_map_renderer_spec.md) - Map viewport management and layer composition

### Multiplayer & Networking
- [`backend/connection/webrtc.md`](../backend/connection/webrtc.md) - WebRTC mesh networking and event-sourced state synchronization for multiplayer sessions
- [`conflict_resolution_tdd_spec.md`](../conflict_resolution_tdd_spec.md) - Multi-player conflict resolution tests and state synchronization guarantees

### UI Components
- [`world_creation_wizard_spec.md`](../world_creation_wizard_spec.md) - Step-by-step world generation interface that uses this spec's topology templates

### Documentation Index
- [`INDEX.md`](../INDEX.md) - Master documentation index with cross-reference matrix and navigation guide
