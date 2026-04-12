# Symmetry System Specification (SPEC-SYMMETRY.md)

**Status:** DESIGN PHASE  
**Version:** 1.0  
**Date:** 2026-03-10  
**Scope:** Expansion of symmetry options for Sacred Sigil Generator from 3 to 25+ options

---

## 1. Overview

### Purpose
Symmetry is a core aesthetic property of sacred symbols and procedural sigils. The current system offers minimal choices (none + 2 others). This spec expands symmetry to 25+ distinct modes, grouped by mathematical type, with domain-aware auto-suggestions and strict determinism contracts.

### Goals
- ✅ Provide 25+ symmetry modes to cover sacred symbol archetypes
- ✅ Auto-suggest appropriate symmetry per domain (Divine → 6-fold, Order → quad-mirror, etc.)
- ✅ Maintain determinism: `seed + symmetry + other_params → deterministic_output`
- ✅ Make symmetry choices persist through export/import
- ✅ Allow users to re-generate with different symmetry while preserving seed history
- ✅ Warn on incompatible symmetry + base_shape combinations

---

## 2. Symmetry Taxonomy

### 2.1 Category A: No Symmetry
```
none
  ID: "none"
  Mathematical: Zero symmetry
  Description: Fully asymmetric, random placement
  Typical domain: Chaos, Shadow (partial)
  Fold count: 1 (identity only)
  Mirror count: 0
```

### 2.2 Category B: Mirror Symmetries (Bilateral)
```
vertical
  ID: "mirror-v"
  Mathematical: Reflection across Y-axis (vertical line)
  Description: Left-right mirror (most recognizable)
  Typical domains: Divine, Order, Shadow
  Fold count: 1
  Mirror count: 1
  
horizontal
  ID: "mirror-h"
  Mathematical: Reflection across X-axis (horizontal line)
  Description: Top-bottom mirror
  Typical domains: Order, Nature
  Fold count: 1
  Mirror count: 1
  
both
  ID: "mirror-vh"
  Mathematical: Vertical + Horizontal reflections (4 quadrant mirror)
  Description: Creates 4 identical mirrored quadrants
  Typical domains: Order, Divine
  Fold count: 2 (180° rotation implied)
  Mirror count: 2
  Alternative name: "quad-mirror" (reserved for Phase 3 hybrid)
  
diagonal
  ID: "mirror-diag"
  Mathematical: Reflection across X=Y diagonal
  Description: Top-left to bottom-right mirror
  Typical domains: None (rare in sacred symbols)
  Fold count: 1
  Mirror count: 1
  
diagonal-alt
  ID: "mirror-diag-alt"
  Mathematical: Reflection across X=-Y diagonal
  Description: Top-right to bottom-left mirror
  Typical domains: None (rare in sacred symbols)
  Fold count: 1
  Mirror count: 1
```

### 2.3 Category C: Pure Rotational Symmetries
```
rotate-180
  ID: "rot-2"
  Mathematical: 2-fold rotational (180° increments)
  Description: Point symmetry; opposite halves identical
  Typical domains: Shadow (yin-yang style), Nature
  Fold count: 2
  Mirror count: 0
  
rotate-120
  ID: "rot-3"
  Mathematical: 3-fold rotational (120° increments)
  Description: Triangular, triquetra style
  Typical domains: Celestial, Chaos
  Fold count: 3
  Mirror count: 0
  
rotate-90
  ID: "rot-4"
  Mathematical: 4-fold rotational (90° increments)
  Description: Cardinal directions; very formal
  Typical domains: Divine, Order
  Fold count: 4
  Mirror count: 0
  
rotate-60
  ID: "rot-6"
  Mathematical: 6-fold rotational (60° increments)
  Description: Hexagonal, snowflake-like, natural feel
  Typical domains: Divine, Nature
  Fold count: 6
  Mirror count: 0
  
rotate-45
  ID: "rot-8"
  Mathematical: 8-fold rotational (45° increments)
  Description: Octagonal, star pattern, mandala center
  Typical domains: Divine, Celestial
  Fold count: 8
  Mirror count: 0
```

### 2.4 Category D: Radial Complete (Rotation + Full Ray Symmetry)
```
radial-4
  ID: "radial-4"
  Mathematical: 4 complete rays from center (+ points, N/S/E/W)
  Description: Plus sign topology, directional
  Typical domains: Order, Divine
  Fold count: 4
  Mirror count: 4 (implied from radial structure)
  
radial-6
  ID: "radial-6"
  Mathematical: 6 complete rays from center (snowflake topology)
  Description: Hexagonal arrangement, very sacred geometry
  Typical domains: Divine, Nature
  Fold count: 6
  Mirror count: 6
  
radial-8
  ID: "radial-8"
  Mathematical: 8 complete rays from center + 8 45° intermediate rays
  Description: Full octagonal mandala, maximum structure
  Typical domains: Divine, Celestial
  Fold count: 8
  Mirror count: 8
  
radial-12
  ID: "radial-12"
  Mathematical: 12 complete rays from center (zodiac wheel)
  Description: Clock face, astrological, very ornate
  Typical domains: Celestial
  Fold count: 12
  Mirror count: 12
  
radial-16
  ID: "radial-16"
  Mathematical: 16 complete rays from center (compass rose)
  Description: Maximum symmetry, compass topology
  Typical domains: Order, Celestial
  Fold count: 16
  Mirror count: 16
```

### 2.5 Category E: Hybrid Mirrors + Rotation (Phase 3)
```
quad-mirror
  ID: "hybrid-quad"
  Mathematical: 2-fold rotation + vertical + horizontal mirrors
  Description: Creates 4 quadrants (may differ from rotate-90)
  Typical domains: Order
  Fold count: 4
  Mirror count: 2
  
hex-mirror
  ID: "hybrid-hex"
  Mathematical: 3-fold rotation + 3 mirror lines at 60° angles
  Description: Hexagonal symmetry with reflection, Star of David topology
  Typical domains: Divine
  Fold count: 6
  Mirror count: 3
  
tri-mirror
  ID: "hybrid-tri"
  Mathematical: 3-fold rotation + 3 mirror lines at 60° angles (alternate)
  Description: Triquetra topology, trinity theme
  Typical domains: Divine, Celestial
  Fold count: 6
  Mirror count: 3
  
oct-mirror
  ID: "hybrid-oct"
  Mathematical: 4-fold rotation + 4 mirror lines at 45° + 8 secondary mirrors
  Description: Full octagonal, most complex symmetric form
  Typical domains: Divine, Order
  Fold count: 8
  Mirror count: 8
```

### 2.6 Category F: Domain-Aware Presets (Phase 3)
```
These are NOT new symmetries; they are UI suggestions that map domain → optimal symmetry choice.

divine-preset
  → Recommended: radial-6 (hexagon, natural perfection)
  → Acceptable: radial-8, hex-mirror, quad-mirror
  → Avoid: none, rotate-180
  
order-preset
  → Recommended: quad-mirror (rigid 4-way structure)
  → Acceptable: radial-4, rot-4, rot-8
  → Avoid: none, rotate-120
  
chaos-preset
  → Recommended: rotate-180 or none (minimal, unpredictable)
  → Acceptable: rot-3, rot-6
  → Avoid: radial-12, oct-mirror (too formal)
  
nature-preset
  → Recommended: radial-5 or pentagonal (organic, flower-like) [Phase 3 addition]
  → Acceptable: rot-6, radial-6
  → Avoid: quad-mirror, oct-mirror (too rigid)
  
shadow-preset
  → Recommended: mirror-v only (single dividing line, two halves)
  → Acceptable: rotate-180
  → Avoid: radial-*, full mirrors
  
celestial-preset
  → Recommended: radial-12 (zodiac wheel, 12 constellations)
  → Acceptable: radial-8, radial-6
  → Avoid: none, single mirrors
  
mandala-preset
  → Recommended: oct-mirror or radial-8 (full ornamental)
  → This is a preset UI choice that auto-selects oct-mirror + full layer count
  → Override to other symmetry allowed
```

---

## 3. State Model

### 3.1 Symmetry State Structure
```typescript
interface SymmetryConfig {
  // Core selection
  symmetryId: string;         // "rot-8", "radial-6", "mirror-v", etc.
  displayName: string;        // "8-Fold Rotational" for UI
  
  // Mathematical properties (computed, read-only)
  foldCount: number;          // How many rotational folds
  mirrorCount: number;        // How many reflection axes
  category: "none" | "mirror" | "rotational" | "radial" | "hybrid";
  
  // User choice metadata
  selectedAt: string;         // ISO timestamp
  selectedBy: "user" | "domain_suggest" | "preset";
  
  // Revision tracking (for determinism)
  revisionId: string;         // hash(symmetryId + version)
  symmetryVersion: "1.0.0";   // Schema version
}

interface SymmetryConfig + Seed Context:
{
  ...SymmetryConfig,
  seedAtTime: string;         // Seed when this symmetry was applied
  seedHistory: SeedHistoryEntry[];  // Full seed lineage
  regenerateReason: "manual_symmetry_change" | "domain_change" | null
}
```

### 3.2 Symmetry State Authority
Symmetry is **part of generation lineage**, like seed.

**Authority chain:**
```
User selects domain → Auto-suggest symmetry
User manually picks symmetry → Override suggestion
User adjusts seed by regenerating → Symmetry unchanged (locked)
User changes domain with locked seed → Regenerate with new seed + symmetry
User explicitly changes symmetry → Regenerate symbol with same seed + new symmetry
```

**Key rule:** Symmetry is NOT independently mutated. It changes through explicit user action:
1. Domain selection (triggers suggestion)
2. Manual symmetry choice in dropdown
3. Preset selection

### 3.3 Symmetry + Composition Interaction Model
**CRITICAL: Symmetry is applied to BASE SYMBOL ONLY. Composition layers are NOT symmetrized.**

**Flow:**
```
1. Generate base procedural symbol (asymmetric)
2. Apply user-selected symmetry (rot-8, radial-6, etc.)
   → Produces symmetrized base icon
3. Add composition layers on top (OPTIONAL, Phase Y+)
   → Accent overlays, directional elements
   → Layers remain asymmetric for visual variation
4. Compose all layers into single SVG
5. Export with metadata
```

**Why this model?**
- Keeps state simple: symmetry ∈ {core symbol}, composition ∈ {optional overlay}
- Prevents exponential complexity (rot-8 × 5 layers = 40+ SVG groups)
- Allows base to be highly symmetric while accents add asymmetric detail (visual richness)
- Composition deferred to Phase Y+; Phase 1 focuses on single-symbol symmetry

**State representation:**
```json
{
  "state": {
    "seed": "s3-Zva2",
    "symmetry": {
      "symmetryId": "rot-8",
      "appliedToBase": true
    },
    "composition": {
      "mode": "overlay-top-right",
      "layers": [
        { "assetId": "star-5", "opacity": 0.5, "symetrized": false }
      ]
    }
  }
}
```

**Composition + Symmetry Orthogonality:**
- Changing composition mode DOES NOT require base symbol regenerate
- Changing base symmetry DOES NOT affect composition layers (they redraw on demand)
- User can adjust composition independently of symmetry (state decoupled in reducer)

---

## 4. UI/UX Specification

### 4.1 Symmetry Control Placement
**Location:** Left panel, after "Complexity" slider, before "Color Preset"

```
┌─────────────────────────────┐
│ Configuration               │
├─────────────────────────────┤
│ [Seed] [s3-Zva2] [↻]      │
│ Domain: [Divine dropdown]  │
│ Complexity: ▓▓▓▓░ 3 Med... │
│                             │
│ Symmetry: [Suggested icon]  │  ← NEW CONTROL
│   [Dropdown ▼]              │
│   Preview: [icon ⬤⬤⬤]     │
│                             │
│ Color Preset: [Divine ▼]   │
│ [Primary] [Secondary]      │
└─────────────────────────────┘
```

### 4.2 Dropdown Structure & Hierarchy

**Option 1: Flat List (MVP)**
```
Symmetry: [▼ Dropdown]
├─ None (Asymmetric)
├─ ─────────── Mirror
├─ Vertical (Left-Right)
├─ Horizontal (Top-Bottom)
├─ Both (4-Way Mirrors)
├─ Diagonal (TL-BR)
├─ Diagonal Alt (TR-BL)
├─ ─────────── Rotation
├─ 2-Fold (180°)
├─ 3-Fold (120°)
├─ 4-Fold (90°, Cardinal)
├─ 6-Fold (60°, Hexagon)
├─ 8-Fold (45°, Octagon)
├─ ─────────── Radial
├─ Radial 4-Way (+)
├─ Radial 6-Way (Snowflake)
├─ Radial 8-Way (Full Mandala)
├─ Radial 12-Way (Zodiac)
├─ Radial 16-Way (Compass)
├─ ─────────── Presets
├─ Divine (Hexagonal)
├─ Order (4-Way Mirror)
├─ Chaos (Minimal)
└─ Mandala (Full 8-Fold)
```

**Option 2: Grouped (Advanced)**
```
Symmetry: [▼ Dropdown]
├─ None
├─ [Mirror]
│  ├─ Vertical
│  ├─ Horizontal
│  ├─ Both
│  └─ Diagonal options
├─ [Rotation Only]
│  ├─ 2-Fold
│  ├─ 3-Fold
│  ├─ 4-Fold
│  ├─ 6-Fold
│  └─ 8-Fold
├─ [Radial Complete]
│  ├─ 4-Way
│  ├─ 6-Way
│  ├─ 8-Way
│  ├─ 12-Way
│  └─ 16-Way
└─ [Sacred Presets]
   ├─ Divine Suggestion
   ├─ Order Suggestion
   ├─ Chaos Suggestion
   ├─ Mandala (Full)
   └─ Custom...
```

**Recommendation:** Start with Option 1 (flat, ~20 items). Add grouping in Phase 2 if list gets unwieldy.

### 4.3 Visual Indicators in Dropdown

Each option shows:
1. **Name** (e.g., "8-Fold Rotational")
2. **Icon** (visual representation)
3. **Fold/Mirror count** (e.g., "8 points")
4. **Domain affinity** (e.g., "✓ Divine" or "○ N/A")

```
Dropdown item example:
┌────────────────────────────────────────┐
│ ✻ 8-Fold (45°)                         │
│ Full octagonal, 8 mirror lines         │
│ Domains: Divine ✓ Celestial ✓ Order ○ │
└────────────────────────────────────────┘
```

### 4.4 Visual Preview of Symmetry

**In preview panel**, show symmetry visually:

Option A: Icon grid showing how symmetry folds
```text
For "quad-mirror" (V+H):
┌────┬────┐
│ S  │ S' │  (S = generated; S' = mirrored)
├────┼────┤
│ S" │ S"'│  (S" = inverted; S"' = double-inverted)
└────┴────┘

For "8-fold":
     ① 
  ④  ↓  ②
  ↓  ↓  ↓
③ ← ↓ → ⑤
  ↑  ↑  ↑
  ⑥  ↑  ⑦
        ⑧
(8 copies radiate from center)
```

Option B: Small compass/radial indicator
```
8-fold:  ⊛ (8-point star, filled center)
6-fold:  ✻ (snowflake)
4-fold:  ✦ (4-point diamond)
2-fold:  ◈ (2 opposite points, yin-yang style)
V-mirror: ⬅→ (left-right arrows)
None:    ⊚ (no indicator, empty circle)
```

**Recommendation:** Option B (small icons) in dropdown. Option A as expandable detail in advanced settings.

### 4.5 Domain-Aware Auto-Suggest (Phase 3, Not Phase 1)

**Phase 1 MVP:** Symmetry dropdown is just a flat list of 7 options. No domain-aware highlighting.

**Phase 3 Enhancement:** When user selects domain, UI updates Symmetry dropdown with visual suggestions:

```
User clicks: Domain: [Other] → [Divine ▼]

UI updates Symmetry control (Phase 3 only):
┌──────────────────────────────────────┐
│ Symmetry: [✻ Divine Suggested]       │
│           (Hexagonal, 6-Fold)        │
│                                      │
│ [v] Show all ___________            │
│    Vertical (Not recommended)       │
│    8-Fold (Recommended Also)        │
│    radial-6 DEFAULT ✓               │
│    ... (show 5 best fits)            │
└──────────────────────────────────────┘
```

**Phase 3 auto-suggest behavior:**
- Expand "Show all" to reveal all 20+ options
- Highlight 1 PRIMARY recommendation (top of list)
- Show 2-3 SECONDARY recommendations
- Gray out incompatible options (e.g., "none" for Divine)

**Phase 1 Behavior:**
- Symmetry dropdown is always flat, 7 options only
- No domain suggestions in UI
- Domain selection still updates internal store (reducer handles it)
- User must manually pick symmetry from flat list

---

## 5. Rendering & Generation Contract

### 5.1 Symmetry Generation Algorithm
```typescript
function generateSymbolWithSymmetry(
  seed: string,
  symmetryId: string,
  baseShape: string,
  complexity: number,
  colorConfig: ColorConfig
): SVGString {
  // Step 1: Generate base asymmetric symbol
  baseSymbol = generateAsymmetricSymbol(seed, baseShape, complexity);
  
  // Step 2: Determine fold/reflection count
  const symmetry = getSymmetryDefinition(symmetryId);
  
  // Step 3: Apply symmetry transformation
  switch (symmetry.category) {
    case "none":
      return baseSymbol; // No transformation
      
    case "mirror":
      return applyMirror(baseSymbol, symmetry.axis);
      
    case "rotational":
      return applyRotation(baseSymbol, symmetry.foldCount);
      
    case "radial":
      return applyRadialFill(baseSymbol, symmetry.foldCount);
      
    case "hybrid":
      return applyRotationThenMirror(baseSymbol, symmetry);
  }
}
```

### 5.2 SVG Rendering Detail
**CRITICAL: This section defines exact SVG DOM structure to avoid center-point errors.**

**Step 1: Calculate content bounding box**
```typescript
function getBoundingBox(svgElement: SVGElement): BBox {
  // Get the actual content bounds (not the <svg> viewBox)
  const bbox = svgElement.getBBox();
  return {
    x: bbox.x,
    y: bbox.y,
    width: bbox.width,
    height: bbox.height,
    centerX: bbox.x + bbox.width / 2,
    centerY: bbox.y + bbox.height / 2
  };
}
```

**Step 2: Apply mirror symmetry**
```typescript
function applyMirror(baseSvg: SVGString, axis: "v" | "h"): SVGString {
  // Parse SVG
  const svg = parseSVG(baseSvg);
  const bbox = getBoundingBox(svg);
  
  // Clone all paths/shapes inside <g id="content">
  const baseGroup = svg.querySelector("g#content");
  const mirrorGroup = baseGroup.cloneNode(true);
  mirrorGroup.id = "content-mirror";
  
  // Apply reflection transformation
  if (axis === "v") {
    // Vertical mirror: flip across Y-axis at center
    mirrorGroup.setAttribute(
      "transform",
      `translate(${bbox.centerX}, 0) scale(-1, 1) translate(-${bbox.centerX}, 0)`
    );
  } else if (axis === "h") {
    // Horizontal mirror: flip across X-axis at center
    mirrorGroup.setAttribute(
      "transform",
      `translate(0, ${bbox.centerY}) scale(1, -1) translate(0, -${bbox.centerY})`
    );
  }
  
  // Update viewBox to contain both original and mirror
  // (default viewBox for single mirror is same as original)
  
  // Append mirror group
  svg.appendChild(mirrorGroup);
  return svg.outerHTML;
}
```

**Step 3: Apply rotation symmetry**
```typescript
function applyRotation(baseSvg: SVGString, foldCount: number): SVGString {
  const svg = parseSVG(baseSvg);
  const bbox = getBoundingBox(svg);
  const centerX = bbox.centerX;
  const centerY = bbox.centerY;
  
  // Get original content group
  const baseGroup = svg.querySelector("g#content");
  
  // Create N copies, each rotated around center
  const angleIncrement = 360 / foldCount;
  
  for (let i = 1; i < foldCount; i++) {
    const angle = i * angleIncrement;
    const rotatedGroup = baseGroup.cloneNode(true);
    rotatedGroup.id = `content-rot-${i}`;
    
    // Transform: translate to center, rotate, translate back
    rotatedGroup.setAttribute(
      "transform",
      `translate(${centerX}, ${centerY}) rotate(${angle}) translate(-${centerX}, -${centerY})`
    );
    
    svg.appendChild(rotatedGroup);
  }
  
  // Update viewBox if needed (for fully rotated shapes, might need larger bounds)
  // For most cases, original viewBox works since copies all fit in original bounds
  
  return svg.outerHTML;
}
```

**Step 4: Apply radial symmetry**
```typescript
function applyRadialFill(baseSvg: SVGString, foldCount: number): SVGString {
  const svg = parseSVG(baseSvg);
  const bbox = getBoundingBox(svg);
  const centerX = bbox.centerX;
  const centerY = bbox.centerY;
  
  // Create N copies positioned radially around center
  const angleIncrement = 360 / foldCount;
  const baseGroup = svg.querySelector("g#content");
  
  // Draw connecting rays from center to each copy (default behavior)
  const raysGroup = createRaysGroup(centerX, centerY, foldCount, bbox, domainColor);
  svg.appendChild(raysGroup);
  
  // Position each copy at a radial position
  for (let i = 0; i < foldCount; i++) {
    const angle = i * angleIncrement;
    const radialGroup = baseGroup.cloneNode(true);
    radialGroup.id = `content-radial-${i}`;
    
    // For radial, place copy at angle (rotated), not just at center
    radialGroup.setAttribute(
      "transform",
      `translate(${centerX}, ${centerY}) rotate(${angle}) translate(-${centerX}, -${centerY})`
    );
    
    svg.appendChild(radialGroup);
  }
  
  // Update viewBox to be larger (radial layout needs more space)
  const newViewBox = expandViewBox(svg.getAttribute("viewBox"), 1.5);
  svg.setAttribute("viewBox", newViewBox);
  
  return svg.outerHTML;
}

function createRaysGroup(
  centerX: number,
  centerY: number,
  foldCount: number,
  bbox: BBox,
  domainColor: string
): SVGElement {
  // Create rays from center to each radial position
  const raysGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  raysGroup.id = "rays";
  
  // Calculate radius: distance from center to corner of bounding box + margin
  const halfWidth = bbox.width / 2;
  const halfHeight = bbox.height / 2;
  const radius = Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight) + 10;
  
  const angleStep = 360 / foldCount;
  
  for (let i = 0; i < foldCount; i++) {
    const angle = i * angleStep;
    const radians = (angle * Math.PI) / 180;
    
    // Calculate ray endpoint
    const x2 = centerX + radius * Math.cos(radians);
    const y2 = centerY + radius * Math.sin(radians);
    
    // Create line element
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(centerX));
    line.setAttribute("y1", String(centerY));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.setAttribute("stroke", domainColor);
    line.setAttribute("stroke-opacity", "0.3");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-linecap", "round");
    
    raysGroup.appendChild(line);
  }
  
  return raysGroup;
}
```

**Ray Behavior Details:**
- Rays drawn by default (not optional in Phase 1)
- Color: domain color at 30% opacity
- Width: 1px stroke, rounded caps
- Radius: calculated from bounding box + 10px margin
- Rendered behind symbol copies (rays group appended first)

**SVG DOM Structure (Example: rot-4)**
```xml
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Original content at 0° -->
  <g id="content">
    <path d="M100,50 L120,80 L100,100 Z" fill="#ff0000"/>
  </g>
  
  <!-- Copy 1: rotated 90° -->
  <g id="content-rot-1" transform="translate(100, 100) rotate(90) translate(-100, -100)">
    <path d="M100,50 L120,80 L100,100 Z" fill="#ff0000"/>
  </g>
  
  <!-- Copy 2: rotated 180° -->
  <g id="content-rot-2" transform="translate(100, 100) rotate(180) translate(-100, -100)">
    <path d="M100,50 L120,80 L100,100 Z" fill="#ff0000"/>
  </g>
  
  <!-- Copy 3: rotated 270° -->
  <g id="content-rot-3" transform="translate(100, 100) rotate(270) translate(-100, -100)">
    <path d="M100,50 L120,80 L100,100 Z" fill="#ff0000"/>
  </g>
</svg>
```

**SVG DOM Structure (Example: mirror-vh)**
```xml
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Original (top-left) -->
  <g id="content">
    <path d="M100,50 L120,80 L100,100 Z" fill="#ff0000"/>
  </g>
  
  <!-- Vertical mirror (top-right) -->
  <g id="content-mirror" transform="translate(100, 0) scale(-1, 1) translate(-100, 0)">
    <path d="M100,50 L120,80 L100,100 Z" fill="#ff0000"/>
  </g>
  
  <!-- Horizontal mirror (bottom-left) -->
  <g id="content-mirror-h" transform="translate(0, 100) scale(1, -1) translate(0, -100)">
    <path d="M100,50 L120,80 L100,100 Z" fill="#ff0000"/>
  </g>
  
  <!-- Diagonal mirror (bottom-right) -->
  <g id="content-mirror-vh" transform="translate(100, 100) scale(-1, -1) translate(-100, -100)">
    <path d="M100,50 L120,80 L100,100 Z" fill="#ff0000"/>
  </g>
</svg>
```

**Key Implementation Rules:**
1. Center point = bbox.centerX, bbox.centerY (calculated from actual content, not viewBox)
2. All transforms use this center: `translate(cx, cy) transform translate(-cx, -cy)`
3. Clone all in baseGroup including paths, circles, text (not just <path>)
4. Update viewBox only if layout exceeds original bounds (e.g., radial layouts)
5. Append cloned groups in order; SVG renders back-to-front (last appended = top)

**Performance Notes:**
- rot-8 = 8 copies per symbol (acceptable)
- radial-16 = 16 copies (may be slow; benchmark in Phase 1, defer if &gt;500ms)
- radial-16 + 5 composition layers = 80 total groups (definitely Phase 2+ work)

### 5.3 Symmetry + Base Shape Compatibility

**Note:** Compatibility matrix validation deferred to Phase 2. Phase 1 allows all combinations without warnings.

**Compatibility matrix (Phase 2+ reference):**

| Symmetry | Circle | Square | Triangle | Star | Hexagon |
|----------|--------|--------|----------|------|---------|
| none | ✓ | ✓ | ✓ | ✓ | ✓ |
| mirror-v | ✓ | ✓ | ✓ | ✓ | ✓ |
| mirror-h | ✓ | ✓ | ✓ | ✓ | ✓ |
| mirror-vh | ✓ | ✓ | ⚠ | ✓ | ✓ |
| rot-2 | ✓ | ✓ | ⚠ | ✓ | ⚠ |
| rot-3 | ✓ | ⚠ | ✓ | ⚠ | ⚠ |
| rot-4 | ✓ | ✓ | ⚠ | ✓ | ⚠ |
| rot-6 | ✓ | ⚠ | ⚠ | ⚠ | ✓ |
| rot-8 | ✓ | ✓ | ⚠ | ✓ | ⚠ |
| radial-4 | ✓ | ✓ | ⚠ | ✓ | ⚠ |
| radial-6 | ✓ | ⚠ | ⚠ | ⚠ | ✓ |
| radial-8 | ✓ | ✓ | ⚠ | ✓ | ⚠ |

**Legend:**
- ✓ = Good fit, symmetry matches shape naturally
- ⚠ = Works but may look odd (audit in Phase 2)
- ✗ = Incompatible (defer blocking to Phase 2 if needed)

**Phase 1:** No warnings shown. All combos allowed.
**Phase 2:** Research which combos actually need warnings (empirical testing).
**Phase 3 (Optional):** If warnings justified, show:
```
⚠ Warning: Triangle + 8-Fold Rotation may not align naturally.
   Suggestion: Use 3-Fold or 6-Fold rotation instead.
   [Use Anyway] [Choose Suggested] [Cancel]
```

---

## 6. Seed & Determinism Contract

### 6.1 Determinism Rule
**Same input = Same output on same generator version**

```
If:
  seed = "s3-Zva2"
  symmetryId = "rot-8"
  baseShape = "circle"
  complexity = 5
  colorConfig = {domain: "divine", ...}
  generatorVersion = "1.0.0"

Then:
  SVG output at time T1 === SVG output at time T2
  (byte-identical, deterministic)
```

### 6.2 Symmetry Change = New Generation
```
User action: Switch symmetry from "rot-4" to "rot-8" (with locked seed)

System behavior:
  - Seed is locked, stays "s3-Zva2"
  - Symmetry changes → Trigger REGENERATE
  - New symbol generated with rot-8 applied
  - seedHistory untouched (same seed)
  - revisionId CHANGES (new symmetry = new revision)
  - Export includes regenerateReason: "manual_symmetry_change"
```

### 6.3 Export/Import Contract

**Exported JSON includes symmetry metadata:**
```json
{
  "faction": {...},
  "state": {
    "seed": "s3-Zva2",
    "seedHistory": [{"seed": "s3-Zva2", "reason": "manual_create", ...}],
    "symmetry": {
      "symmetryId": "rot-8",
      "foldCount": 8,
      "mirrorCount": 0,
      "revisionId": "rot-8-v1-2026-03-10",
      "selectedAt": "2026-03-10T15:30:00Z",
      "selectedBy": "user"
    },
    "compositionVersion": 1,
    "artifacts": {
      "svg": "<svg>...</svg>",
      "revisionId": "full-export-hash"
    }
  }
}
```

**Import validation:**
```typescript
function importSymbolWithSymmetry(payload: ExportPayload) {
  // Validate symmetryId exists
  if (!isValidSymmetryId(payload.state.symmetry.symmetryId)) {
    throw new Error(`Unsupported symmetry: ${payload.state.symmetry.symmetryId}`);
  }
  
  // Recompute revisionId and verify match
  const computedRevisionId = computeSymmetryRevisionId(payload.state.symmetry);
  if (computedRevisionId !== payload.state.symmetry.revisionId) {
    console.warn("Symmetry revision mismatch; recomputing...");
  }
  
  // Restore state
  return {
    seed: payload.state.seed,
    symmetry: payload.state.symmetry,
    ...other
  };
}
```

---

## 7. State Machine & User Actions

### 7.1 Symmetry Transitions

**Valid state transitions:**

```
[No Symbol Selected]
    ↓ GenerateIcon(domain, symmetry)
[Symbol + Symmetry]

[Symbol + Symmetry locked]
    ↓ ChangeSymmetry(newSymmetryId)
[Symbol + NEW Symmetry] (regenerated)

[Symbol + Symmetry]
    ↓ ChangeDomain(newDomain)
[Symbol + Domain-suggested Symmetry] (regenerated, new seed)

[Symbol + Symmetry]
    ↓ ChangeDomainKeepSeed(newDomain)
[Symbol + Same Symmetry, New Seed] (regenerated)

[Symbol with locked seed]
    ↓ ChangeSymmetry
[Symbol + NEW Symmetry, Same Seed] (regenerated, same seed lineage)
```

### 7.2 Symmetry in UI Action Controls

**Regenerate Same (locked seed):**
```
User clicks: [Regenerate Same]

Effect:
  - Seed unchanged: "s3-Zva2"
  - Symmetry unchanged: "rot-8"
  - All other random parameters re-seed internally
  - Same-looking symbol with slight variations (if complexity > 1)
```

**Change Symmetry (keep seed):**
```
User selects new symmetry from dropdown: "rot-8" → "radial-6"

Effect:
  - Seed locked: "s3-Zva2"
  - Symmetry changed: "rot-8" → "radial-6"
  - Symbol regenerated with new symmetry applied to same seed core
  - seedHistory unchanged
  - symmetryHistory incremented (implicit)
```

**Randomize (new seed + suggested symmetry):**
```
User clicks: [Randomize]

Effect:
  - Seed regenerated: "s3-Zva2" → "xK-9dL7"
  - Symmetry resets to domain suggestion (if domain locked)
  - New symbol generated
  - seedHistory appended with "randomize"
```

---

## 8. Phase Breakdown

### Phase 1: MVP (Core symmetries, 10-12 hours)
**Goal:** Implement 7 symmetry options with deterministic rendering

**Scope:**
- ✅ State structure (SymmetryConfig type)
- ✅ Dropdown UI (flat list, 7 options, no domain highlighting)
- ✅ Rendering (mirror-v, mirror-h, mirror-vh, rot-4, rot-8, radial-6, radial-8)
  - Center-point calculation and SVG bounding box handling
  - Transform logic for mirrors and rotations
- ✅ Determinism (same seed + symmetry = same output)
- ✅ Export/import (symmetry in JSON payload)
- ✅ Tests: C33-C37 (basic symmetry behavior, determinism, export)
- ❌ Domain auto-suggest UI highlighting (defer to Phase 3)
- ❌ Composition UI (defer to Phase Y+)
- ❌ Compatibility warnings (defer to Phase 2)

**Options delivered:**
```
- none
- mirror-v (vertical)
- mirror-h (horizontal)
- mirror-vh (both, quad-mirror)
- rot-4 (4-fold, 90°)
- rot-8 (8-fold, 45°)
- radial-8 (8-way complete radial)
```

**Exit criteria:**
- [ ] All 7 symmetries render correctly (visual inspection + unit tests)
- [ ] Center point calculated correctly (no transformed content off-center)
- [ ] Seed-locked regenerate with new symmetry works
- [ ] Export/import preserves symmetry JSON
- [ ] C33-C37 tests passing (rendering + determinism)
- [ ] C38-C39 tests passing (seed-locked change, revisionId)
- [ ] C42 test passing (export schema validation)

### Phase 2: Extended Symmetries (12-15 hours)
**Goal:** Add rotation-only and additional radial options

**New options:**
```
+ rot-2 (2-fold, 180°)
+ rot-3 (3-fold, 120°)
+ rot-6 (6-fold, 60°)
+ radial-4 (4-way)
+ radial-6 (6-way)
+ radial-12 (12-way)
+ radial-16 (16-way compass)
```

**Changes:**
- [ ] Expand dropdown (now 14-15 items)
- [ ] Add compatibility matrix (symmetry + base_shape)
- [ ] Add warnings for incompatible combos
- [ ] Extend domain presets (add more suggestions)
- [ ] Update rendering for new fold counts
- [ ] Tests: C38-C39 (compatibility, revision ID on symmetry change)

**Exit criteria:**
- [ ] All 14 new options render
- [ ] Compatibility warnings work
- [ ] No visual artifacts on incompatible combos
- [ ] C38-C39 tests passing

### Phase 3: Domain-Aware UI + Hybrid Symmetries (8-10 hours)
**Goal:** Add domain-aware UI polish + hybrid symmetries

**New options:**
```
+ quad-mirror (hybrid)
+ hex-mirror (hybrid)
+ tri-mirror (hybrid)
+ oct-mirror (hybrid)
+ Domain-aware dropdown grouping (visual highlights)
+ Domain preset buttons (as UI shortcuts)
+ radial-5 (pentagonal, for nature domain)
```

**UI changes:**
- [ ] Add domain-suggest visual highlighting when domain changes
- [ ] Group dropdown items into categories (Mirror, Rotation, Radial, Hybrid)
- [ ] Show recommended icon/label when domain-suggested symmetry is active
- [ ] Add domain preset buttons alongside dropdown ("Divine", "Order", "Chaos", etc.)
- [ ] Add expandable advanced settings
- [ ] Implement visual symmetry preview (grid or radial diagram)

**Tests:** C40-C42 (domain affinity, auto-suggestion accuracy)

**Exit criteria:**
- [ ] All hybrid symmetries render correctly
- [ ] Domain-aware highlighting works (blue highlight on recommended)
- [ ] Domain buttons work as shortcuts
- [ ] Visual preview shows symmetry clearly
- [ ] C40-C42 tests passing

---

## 9. Acceptance Test Matrix (C33-C42)

### Core Tests (Phase 1)
```
✅ Phase 1 Core Tests:

C33 [Phase 1]: symmetry=none generates asymmetric symbol
  Input: seed, domain, symmetry="none"
  Expected: No mirror/rotation applied, unique per rng
  Type: unit
  Run: Phase 1 exit gate
  
C34 [Phase 1]: symmetry=mirror-v preserves left-right mirror
  Input: seed, baseShape=circle, symmetry="mirror-v"
  Expected: Left half mirrors to right half exactly
  Verification: Generate(seed, sym) × 2 = same; SVG LHS == flipped(RHS)
  Type: rendering
  Run: Phase 1 exit gate
  
C35 [Phase 1]: symmetry=mirror-vh preserves both V+H mirrors
  Input: seed, symmetry="mirror-vh"
  Expected: 4 quadrants, each reflected/inverted appropriately
  Verification: 4-fold symmetry in SVG element positions
  Type: rendering
  Run: Phase 1 exit gate
  
C36 [Phase 1]: symmetry=rot-4 rotates at 90° increments
  Input: seed, symmetry="rot-4"
  Expected: 4 copies rotated 0°, 90°, 180°, 270°
  Verification: SVG transform rotate attributes on 4 groups
  Type: rendering
  Run: Phase 1 exit gate
  
C37 [Phase 1]: symmetry=rot-8 + radial-8 differ visually
  Input: same seed, compare rot-8 vs radial-8
  Expected: rot-8 overlaid at center; radial-8 copies positioned radially
  Verification: SVG DOM structure differs; visual inspect
  Type: integration
  Run: Phase 1 exit gate
  
C38 [Phase 1]: changing symmetry with locked seed regenerates deterministically
  Setup: Generate(seed1, sym="rot-4"), lock seed
  Action: Change symmetry to "rot-8"
  Expected: New symbol with rot-8, same seed1 in history, revisionId changes
  Verification: seedHistory["seed1"] ∈ regenerated.seedHistory, revisionId ≠ original
  Type: integration
  Run: Phase 1 exit gate
  
C39 [Phase 1]: symmetry affects revisionId
  Input: same seed, same domain, different symmetry
  Expected: revisionId(sym1) ≠ revisionId(sym2)
  Verification: hash(symmetryId + seed + domain + version) differs
  Type: unit
  Run: Phase 1 exit gate
  
C42 [Phase 1]: export includes symmetry config in metadata
  Setup: Generate symbol with symmetry="rot-8"
  Action: Export JSON
  Expected: exportJSON.state.symmetry.symmetryId == "rot-8"
  Verification: Schema validation passes, revisionId computable
  Type: integration
  Run: Phase 1 exit gate
```

### Domain Affinity Tests (Phase 2+)
```
⏳ Phase 2 Tests:

C40 [Phase 2]: domain-suggested symmetry matches sacred theme
  Note: Requires domain-suggest UI (Phase 3)
  Input: domain="divine"
  Expected: Auto-suggest = "radial-6" (hexagonal)
  Verification: domainSuggestion["divine"] == "radial-6"
  Type: unit
  Run: Phase 3 exit gate (not Phase 1)
  
C41 [Phase 2]: incompatible symmetry + base_shape does not block (Phase 1)
  Note: Phase 1 allows all combos; Phase 2 research only
  Phase 2 action: Empirically test which combos look bad
  Phase 3: If warnings justified, show "⚠ Warning: May look odd"
  Type: research → optional Phase 3 UI
  Run: Phase 2 analysis, Phase 3 conditional
```

---

## 10. Type Definitions

```typescript
type SymmetryId = 
  | "none"
  | "mirror-v" | "mirror-h" | "mirror-vh" | "mirror-diag" | "mirror-diag-alt"
  | "rot-2" | "rot-3" | "rot-4" | "rot-6" | "rot-8"
  | "radial-4" | "radial-6" | "radial-8" | "radial-12" | "radial-16"
  | "hybrid-quad" | "hybrid-hex" | "hybrid-tri" | "hybrid-oct";

type SymmetryCategory = "none" | "mirror" | "rotational" | "radial" | "hybrid";

interface SymmetryDefinition {
  symmetryId: SymmetryId;
  displayName: string;
  description: string;
  category: SymmetryCategory;
  foldCount: number;
  mirrorCount: number;
  typicalDomains: string[];
  icon: string; // Unicode or SVG ref
  phase: 1 | 2 | 3; // When implemented
}

interface SymmetryConfig {
  symmetryId: SymmetryId;
  displayName: string;
  foldCount: number;
  mirrorCount: number;
  category: SymmetryCategory;
  selectedAt: string; // ISO timestamp
  selectedBy: "user" | "domain_suggest" | "preset";
  revisionId: string; // hash(symmetryId + version)
  symmetryVersion: "1.0.0";
}

interface SymmetryWithSeed extends SymmetryConfig {
  seedAtTime: string;
  seedHistory: SeedHistoryEntry[];
  regenerateReason?: "manual_symmetry_change" | "domain_change" | null;
}

interface DomainSymmetryAffinities {
  divine: SymmetryId;      // Primary
  order: SymmetryId;
  chaos: SymmetryId;
  nature: SymmetryId;
  shadow: SymmetryId;
  celestial: SymmetryId;
  // ... + secondary/acceptable lists
}
```

---

## 11. Dependencies & Integration

### 11.1 Depends On
- ✅ Seed system (SPEC-ICON-BOUNDARIES Phase 1)
- ✅ Color ownership (SPEC-ICON-BOUNDARIES Phase 1)
- ✅ State machine (SPEC-ICON-BOUNDARIES Phase 1)
- ✅ Export/import contract (SPEC-ICON-BOUNDARIES Phase 1)

### 11.2 Required For Phase Y+
- ✅ Asset library integration (SPEC-ICON-IMPLEMENTATION-RECALIBRATED)
- ✅ Composition modes (can leverage symmetry system for layering)

### 11.3 Blocks
- None; symmetry is additive, doesn't block other features

---

## 12. Open Questions / Future Enhancements

1. **Pentagonal/5-fold symmetry:** Nature domain may need radial-5 (star, flower)
   - Phase 3 addition: rot-5, radial-5
   
2. **Aperiodic symmetries:** Penrose tilings, quasi-crystals?
   - Phase 4+: Advanced, out of scope for MVP
   
3. **User-defined custom symmetries:** Advanced mode?
   - Phase 4+: Allow user to define rotation + mirror combo
   
4. **Symmetry animation:** Show how symmetry "folds"?
   - Phase 3+: GIF/WebP preview of symmetry application
   
5. **Accessibility:** How to describe symmetry for visually impaired users?
   - Phase 2: Add ARIA labels for each symmetry type
   
6. **Performance:** Does 16-way radial + 10 layers bog down rendering?
   - Phase 1: Benchmark; Phase 2: Optimize if needed

---

## Summary

This spec defines a comprehensive symmetry system with:
- ✅ 25+ distinct symmetry modes (phases 1-3)
- ✅ Domain-aware auto-suggestions (Phase 3 UI enhancement)
- ✅ Strict determinism contracts
- ✅ Export/import persistence
- ✅ User-friendly UI with visual feedback
- ✅ Phased compatibility validation
- ✅ Realistic phased rollout

**MVP (Phase 1):** 7 core symmetries, flat dropdown, determinism, C33-C39 + C42 tests  
**Extended (Phase 2):** +7 options, compatibility research, +4 radial/rotation variants  
**Polish (Phase 3):** +4 hybrid modes, domain-aware UI highlighting, domain preset buttons, C40 tests

**Critical Dependencies Resolved:**
- ✅ Composition interaction: Symmetry applies to base only; composition layers remain asymmetric (Phase Y+)
- ✅ SVG rendering: Center-point, bounding box, and transform logic fully specified
- ✅ Phase scope: Domain presets deferred to Phase 3; composition deferred to Phase Y+
- ✅ Test assignments: All C33-C42 tagged with phase (1, 2, or 3)

Ready to implement Phase 1.
