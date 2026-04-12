# Critique: SPEC-LAYERS-SIDEBAR.md & SPEC-SYMMETRY.md (Updated)

**Date:** 2026-03-10  
**Reviewer:** Agent  
**Status:** PRE-IMPLEMENTATION REVIEW  
**Overall Assessment:** SPEC-LAYERS-SIDEBAR solid but underestimated; SPEC-SYMMETRY improvements successful

---

## 1. SPEC-LAYERS-SIDEBAR.md Critique

### Executive Summary

**Strengths:**
- ✅ Comprehensive UI/UX design with ASCII mockups
- ✅ Clear phase breakdown (12-16h Phase 1, realistic)
- ✅ Good integration with CompositionConfig model
- ✅ Acceptance tests well-defined (L1-L24)
- ✅ Context menu and keyboard shortcuts planned

**Critical Issues:** 4 HIGH, 2 MEDIUM  
**Blocking Phase 1:** 2 items (performance assumptions, undo/redo scope)  
**Deferred incorrectly:** 1 item (rename should be Phase 1, not Phase 2)

**Recommendation:** Approve with clarifications; rebalance Phase 1 scope.

---

### Issue 1.1: Phase 1 Scope Underestimated (Rename Missing)
**Severity:** 🔴 HIGH  
**Category:** Specification  
**Affects:** Phase 1 UX

**Problem:**
Spec defers "rename layer" to Phase 2, but:
- L1-L12 acceptance tests assume Phase 1 works
- Users cannot organize their work without renaming (UX regression)
- "Layer 1", "Layer 2", "Layer 3" is confusing after 10+ operations
- Rename is simple: double-click → text editable → press Enter

**Evidence:**
- Phase 2 section: "Layer rename (double-click or right-click)"
- Phase 1 scope: "Layer name display (static in Phase 1)"
- But L12 test: "Export includes layers in metadata" — implies metadata includes name
- Users need names to understand composition

**Impact:**
- Phase 1 feels incomplete (can't organize without names)
- L12 test assumes name persistence (contradicts "static")
- Scope creep risk: Phase 1 becomes 16-18h if overlooked

**Recommendation:**
**Move rename to Phase 1. Estimated effort: +2 hours (+20% Phase 1 scope)**

```
Phase 1 Additions:
+ Double-click layer name to edit (text input highlight)
+ Press Enter to confirm, Escape to cancel
+ Name persists in state and export JSON
+ Default names still "Layer 1", "Layer 2" if not renamed
```

**Revised Phase 1 Estimate:** 12-16h → **14-18h**  
**Updated Phase 2:** 10-12h → **8-10h** (remove rename, add only blending + undo)

---

### Issue 1.2: Undo/Redo Deferred but Tests Assume It
**Severity:** 🔴 HIGH  
**Category:** Testing/Architecture  
**Affects:** Phase 1-2 boundary

**Problem:**
L1-L12 tests don't explicitly test undo, but test L7 (drag reorder) is easily broken if no undo:

```
Test L7: Keyboard shortcuts ↑↓ move selected layer
  ... (step 3)
  If user makes mistake and no undo, repair requires:
  - Manual re-reordering (tedious)
  - Or restart (lose work)
```

Also problematic: L15 test is "Undo/redo reverses layer operations" but depends on Phase 1 foundation:
- Phase 1 doesn't store operation history
- Phase 2 must retrofit undo architecture
- Risk: Undo in Phase 2 doesn't match Phase 1 behavior

**Evidence:**
- Phase 1 removes "History (Phase 2)" from data model
- But users will want undo very quickly
- Test assumes undoStack exists in Phase 2, but Phase 1 doesn't create it

**Impact:**
- Phase 1 layers feel unstable (no safety net)
- Phase 2 must add undoStack to state (retroactive architecture change)
- Risk of undo not working correctly with Phase 1 operations

**Recommendation:**
**Add undoStack to Phase 1 state model (non-rendering):**

```typescript
// Phase 1: Add to LayersState (no UI, but functional)
interface LayersState {
  layers: LayerItem[];
  selectedLayerId: LayerId | null;
  sidebarOpen: boolean;
  sidebarWidth: number;
  
  // Phase 1: Create undoStack structure (no UI undo buttons yet)
  undoStack: LayerOperation[];    // Track all operations
  redoStack: LayerOperation[];    // Prepare for Phase 2
}

// Every layer operation appends to undoStack:
function reorderLayer(fromIndex, toIndex) {
  const before = [...layers];
  // perform reorder
  const after = [...layers];
  
  undoStack.push({
    type: "reorder",
    before,
    after,
    timestamp: now()
  });
  redoStack = [];  // Clear redo on new operation
}
```

**Phase 1 Change:**
- Create undoStack infrastructure (non-visual)
- Track all operations internally
- Phase 2: Add undo/redo buttons + UI
- **Effort impact:** +3h (Phase 1 becomes 17-21h)

**Alternative (if undo too expensive):**
- Phase 1: No undo at all
- Phase 2: Add undo from scratch (higher risk of bugs)
- **Not recommended; undo foundation is cheap now**

---

### Issue 1.3: SVG Blending Mode Rendering Incomplete
**Severity:** 🟠 MEDIUM  
**Category:** Implementation  
**Affects:** Phase 2

**Problem:**
Section 5.1 mentions blending modes but doesn't explain rendering:

```
"Blending Mode:
  - Standard CSS blend modes: Normal, Multiply, Screen, Overlay, etc.
  - SVG feBlend for rendering"
```

But how exactly?
- CSS `mix-blend-mode` property in SVG? (Works in modern browsers)
- Or SVG `<feBlend>` filter element? (More complex)
- Which blend modes map to which SVG primitives?
- Performance: 10 layers × 8 blend modes = 80 combinations. Test performance?

**Evidence:**
- Section 5.1 lists blend modes but no implementation detail
- Types define `blendMode: BlendMode` but no rendering algorithm
- No test for blend mode performance

**Impact:**
- Phase 2 dev will guess on implementation (CSS vs. SVG filter)
- Performance regression risk (SVG filters slow on large compositions)
- Compatibility issues (old browsers may not support blend modes)

**Recommendation:**
**Document rendering approach before Phase 2:**

```
Blending Implementation Choice:

Option A: CSS mix-blend-mode (Recommended for Phase 2)
  - Apply to SVG <g> element: style="mix-blend-mode:multiply"
  - Works in Chromium, Firefox, Safari (IE/Edge legacy may fail)
  - Simple, performant, browser-native
  - Trade-off: Limited to CSS-supported modes

Option B: SVG <feBlend> filter
  - Create <defs><filter><feBlend mode="multiply"/></filter></defs>
  - Apply to layer: filter="url(#blend-multiply-0)"
  - More complex, slower, but precise control
  - Trade-off: More verbose SVG, slower rendering

Recommendation for Phase 2: Start with Option A (CSS mix-blend-mode)
  - Test performance with 50 layers + blend modes
  - If slow, optimize to Option B with caching
  - Fallback: Normal blend mode in unsupported browsers
```

**Action Item:** Clarify blending approach in Phase 2 planning.

---

### Issue 1.4: Layer Content Type Restrictive
**Severity:** 🟡 MEDIUM  
**Category:** Design  
**Affects:** Phase 2+

**Problem:**
LayerContent type limits to 4 options:
```typescript
type LayerContent = 
  | { type: "blank" }
  | { type: "asset"; assetId: string }
  | { type: "procedural"; seed: string }
  | { type: "group"; children: LayerId[] };
```

But Phase 1 only supports "blank". Phase 2 adds "asset". When does "procedural" come in?

Also missing:
- "text" layer (add text to composition)
- "shape" layer (pre-drawn shapes: circle, square, star)
- "image" layer (raster import)
- "effects" layer (pure effect, no content)

**Evidence:**
- Add Layer button Section 3.1 lists: "Blank Layer, Asset from Library, Procedural Generator, Clone Selected"
- But LayerContent only supports first 3
- "Clone Selected" not in LayerContent (implies special handling)
- No text/shape/image types defined

**Impact:**
- Spec is prescriptive about layer types, but phase plan unclear
- Phase 2 may need to add text/shape types, expanding scope
- Clone operation special-cased (not a layer type)

**Recommendation:**
**Clarify layer type roadmap:**

```
Phase 1: LayerContent types needed
  - blank (empty, user will fill)
  - [Note: asset & procedural deferred to Phase Y+]

Phase Y+: Asset library integration adds
  - asset (selectable from 10K game-icons.net)
  - procedural (generate new base with symmetry)

Phase 3 (Optional): Advanced types
  - text (add text overlay)
  - shape (pre-made shapes)
  - image (raster import, PNG export)
  - effects (filter-only, no content)

For Phase 1: Simplify LayerContent to only "blank"
  Then extend as phases add features
```

**Update Type Definition:**
```typescript
// Phase 1: Simple model
type LayerContent = { type: "blank" };

// Phase 2: Add asset support
type LayerContent = 
  | { type: "blank" }
  | { type: "asset"; assetId: string };

// Phase 3+: Expand as needed
type LayerContent = 
  | { type: "blank" }
  | { type: "asset"; assetId: string }
  | { type: "text"; content: string; font: string }
  | { type: "shape"; shape: "circle" | "square" | "star"; ... };
```

---

### Issue 1.5: L11-L12 Tests Ambiguous on Layer Metadata
**Severity:** 🟡 MEDIUM  
**Category:** Testing  
**Affects:** Phase 1

**Problem:**
Test L11 & L12 assume export/import of layers:

```
L11: Export includes layers in metadata
  Expected: exportJSON.composition.layers has both layers

L12: Import restores layer state
  Expected: Sidebar shows both layers; canvas renders both
```

But SPEC-ICON-BOUNDARIES defines ExportPayload without layers detail:

```typescript
interface ExportPayload {
  faction: { id, name, domain };
  state: { seed, seedHistory, locked };
  selection: { colorOwnerByChannel, colorPresetKey };
  composition: CompositionConfig;
  artifacts: { svg, png?, dataUrl };
}
```

Question: Where do layers live in export?
- Option A: `composition.layers` (seems right)
- Option B: `state.layers` (state is not composition)
- Option C: Separate `layers` root field

Also: What happens to layer content on export?
- Option A: Store SVG data in layer? (huge payload)
- Option B: Store only layer metadata (name, opacity, blend mode)
- Option C: Store assetId (if asset), seed (if procedural), skip "blank"

**Evidence:**
- ExportPayload in SPEC-ICON-BOUNDARIES is vague
- L11-L12 assume layers exportable, but mechanism unclear
- No discussion of payload size impact

**Impact:**
- Export JSON could be huge if full SVG stored per layer
- Unclear what "restore layer state" means (render? metadata only?)
- Integration point with SPEC-ICON-BOUNDARIES not defined

**Recommendation:**
**Clarify layer export/import in ExportPayload:**

```typescript
// In ICON-BOUNDARIES, composition field extended:
interface CompositionConfig {
  mode: "overlay-center" | ...;
  layers: LayerMetadata[];  // ← Metadata only, not full SVG
  revisionId: string;
  compositionVersion: string;
  updatedAt: string;
}

interface LayerMetadata {
  layerId: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  
  // Content reference (not full content)
  contentType: "blank" | "asset" | "procedural";
  contentRef?: {
    assetId?: string;      // For asset type
    seed?: string;         // For procedural type
  };
  
  // Position/transform (Phase 2+)
  transform?: { x, y, scale, rotation };
}

// On export: Strip full color data, keep only metadata
// On import: Re-render layers from metadata + base symbol
```

**Action Item:** Align layers export format with SPEC-ICON-BOUNDARIES before Phase 1.

---

### Issue 1.6: Performance Constraints Unclear
**Severity:** 🟡 MEDIUM  
**Category:** Non-Functional Requirements  
**Affects:** Phase 1 acceptance criteria

**Problem:**
Section 12.3 notes:
```
- 50 layers max supported (warn at 40+)
- Render time per layer: <10ms (optimize if slower)
```

But:
- Where is the 50-layer limit enforced? (UI? Backend?)
- What warning UI at 40+ (red banner? Modal?)
- Is 10ms per layer measured? (How: profiling? Benchmark?)
- What if 10ms violated in practice? (Fallback? Cache?)

Also missing: memory constraints
- 50 layers × 1000 path points per layer = 50K paths
- SVG DOM size: potentially 5-10MB (uncompressed)
- Browser rendering: will it freeze?

**Evidence:**
- No performance test defined (no L-test covers render latency)
- No profiling plan
- No memory estimate

**Impact:**
- Phase 1 ships with unknown performance ceiling
- Users hit 50 layers, performance degrades, no UI feedback
- Phase 2 optimization becomes emergency (tech debt)

**Recommendation:**
**Add performance testing to Phase 1 exit criteria:**

```
Phase 1 Exit Criteria Addition:
- [ ] Render 50 layers with <500ms total paint time
  Measurement: Chrome DevTools Performance profiler
  Machine: Baseline (modern laptop, 2021+)
  
- [ ] SVG DOM size <10MB for 50 layers
  Measurement: Elements inspector DOM size
  Action if exceeded: Optimize path simplification, enable layer culling
  
- [ ] Layer operations (add/delete/reorder) complete in <100ms
  Measurement: setTimeout before/after operation
  Action if slow: Profile and optimize hot paths
  
- [ ] No memory leaks on add/delete 100 operations
  Measurement: Chrome DevTools Memory profiler (heap snapshot)
  Action if leak detected: Audit event listener cleanup
```

**Also add L-test:**
```
L25 [Phase 1]: Render 50 layers performs within <500ms
  Input: Programmatically create 50 layers
  Expected: Canvas renders all 50; total paint time <500ms
  Verification: Profiler confirms <500ms
  Type: performance
```

---

## 2. SPEC-SYMMETRY.md (Improved) Critique

### Executive Summary (Post-Improvement)

**Current Status:** ✅ Improvements successful, no new issues

**What's Better:**
- ✅ Section 3.3 clarifies composition + symmetry orthogonality
- ✅ Section 5.2 detailed SVG rendering with examples
- ✅ Section 4.5 clearly defers domain-suggest to Phase 3
- ✅ Section 9 tests tagged with phases (Phase 1: 8 tests, Phase 3: 2 tests)
- ✅ Summary updated to reflect Phase 3 UI enhancements

**Remaining Minor Issues:** 1 MEDIUM, 1 LOW

---

### Issue 2.1: Radial Rendering Still Underspec'd (Ray Drawing)
**Severity:** 🟡 MEDIUM  
**Category:** Implementation  
**Affects:** Phase 1-2

**Problem:**
Section 5.2 pseudo-code for `applyRadialFill()` mentions rays:

```typescript
// Optional: Draw connecting rays from center to each copy
const raysGroup = createRaysGroup(centerX, centerY, foldCount, bbox);
svg.appendChild(raysGroup);
```

But `createRaysGroup()` is not defined. Questions:
- Do radial symmetries include rays by default? (Yes? No?)
- If optional, where's the toggle? (UI setting?)
- What color are rays? (Domain color? Reduced opacity?)
- Do rays appear for all radial modes (radial-4, radial-6, radial-8, etc.)?

**Evidence:**
- Section 5.2 mentions "Optional: Draw connecting rays"
- No implementation for `createRaysGroup`
- Section 2.4 description vague: "rays from center" (but not visible in all examples)

**Impact:**
- dev implementing radial-6 won't know if rays are required
- Visual inconsistency: some radials with rays, others without
- Phase 2 may need to add ray toggle (scope unknown)

**Recommendation:**
**Clarify ray behavior before Phase 1 rendering:**

```
Radial Symmetry Ray Behavior:

Option A: Rays included by default (recommended)
  - All radial-N modes include rays from center to edge
  - Rays color: domain color at 30% opacity
  - Rays width: 1-2px SVG stroke
  - Rays drawn first (behind symbol)
  
  Visual example (radial-6):
    * Hexagon center point
    * 6 rays radiating outward at 60° increments
    * 6 symbol copies positioned at ray endpoints
  
  Code:
    function createRaysGroup(cx, cy, foldCount, bbox) {
      const rays = [];
      const radius = Math.hypot(bbox.width, bbox.height) / 2 + 20;
      const angleStep = 360 / foldCount;
      
      for (let i = 0; i < foldCount; i++) {
        const angle = i * angleStep;
        const x2 = cx + radius * Math.cos(angle * Math.PI / 180);
        const y2 = cy + radius * Math.sin(angle * Math.PI / 180);
        rays.push(
          <line x1={cx} y1={cy} x2={x2} y2={y2} 
                stroke={domainColor} 
                strokeOpacity="0.3" 
                strokeWidth="1"/>
        );
      }
      return <g id="rays">{rays}</g>;
    }

Option B: Rays optional (Phase 2 feature)
  - Phase 1: No rays for any radial mode
  - Phase 2: Add "Show Rays" toggle in UI
  - Trade-off: Phase 1 radial looks less "mandala-like"

Recommendation: Option A (rays by default)
  - More visually cohesive
  - Simpler Phase 1 (no toggle)
  - Phase 2 can add "Hide Rays" option
```

**Action Item:** Add ray generation implementation to Section 5.2 before Phase 1.

---

### Issue 2.2: Composition Definition Still Vague in ICON-BOUNDARIES
**Severity:** 🟢 LOW  
**Category:** Cross-spec clarity  
**Affects:** Phase Y+

**Problem:**
SPEC-SYMMETRY Section 3.3 defines how symmetry + composition interact:
```
Symmetry applied to base symbol ONLY
Composition layers remain asymmetric
```

But SPEC-ICON-BOUNDARIES still doesn't define "composition modes" precisely:
```
mode: "overlay-center" | "overlay-top" | ...
```

What are these modes? How do they affect rendering?
- overlay-center: layer centered on base
- overlay-top: layer aligned to top
- etc.

Missing: visual examples, layer positioning logic, interaction with scales/transforms

**Evidence:**
- ICON-BOUNDARIES defines composition as TBD
- SYMMETRY says composition is orthogonal to symmetry
- But exact composition behavior unknown

**Impact:**
- Phase Y+ (composition + assets) has incomplete spec
- unclear how positioning modes interact with layer transforms
- Non-blocking for Phase 1 (composition not implemented)

**Recommendation:**
**Non-urgent, but should be clarified for Phase Y+ planning:**
- Create SPEC-COMPOSITION.md (detailed positioning modes)
- Or expand ICON-BOUNDARIES composition section
- Deferred to after Phase 1-2 (low priority)

---

## 3. Cross-Spec Integration Issues

### Issue 3.1: Layers Sidebar × Symmetry Interaction Unclear
**Severity:** 🟠 MEDIUM  
**Category:** Integration  
**Affects:** Phase Y+ (composition + assets)

**Problem:**
How do Layers Sidebar + Symmetry work together?

Scenario 1: User has 3 layers (base, accent, glow)
```
1. User applies base with rot-8 symmetry
   → Base layer renders 8 copies rotationally

2. User adds accent layer
   → Accent appears as single layer (asymmetric)
   
3. User wants accent to also be symmetric
   → Can they apply symmetry per-layer?
```

Current spec says: Symmetry applies to BASE ONLY.
But Layers Sidebar doesn't mention per-layer symmetry controls.

**Evidence:**
- SPEC-SYMMETRY: "Symmetry applied to base symbol only"
- SPEC-LAYERS-SIDEBAR: No mention of per-layer symmetry toggle
- Unclear: Can accent layer be symmetrized independently?

**Impact:**
- Phase Y+ composition + assets may need per-layer symmetry
- Layers Sidebar might need symmetry control per layer (scope expansion)
- Risk of misalignment between two systems

**Recommendation:**
**Document layer × symmetry relationship:**

```
Design Decision (Non-binding for Phase 1, clarify for Phase Y+):

Option A: Base layer only gets symmetry (current spec)
  - Symmetry toggle is symbol-level, not layer-level
  - All layers compose on top of symmetrized base
  - Simpler, clearer mental model
  - Trade-off: Can't individually symmetrize accents

Option B: Per-layer symmetry (advanced, Phase 3+)
  - Add symmetry dropdown to each layer properties
  - Each layer can have its own symmetry
  - More expressive but complex
  - Trade-off: Many symmetry combinations (UX confusion)

For Phase 1: Not applicable (no multi-layer composition)
For Phase Y+: Recommend Option A (base-only symmetry)
  - If users want symmetric accent, they can add it as separate base + asymmetric accent
```

**Action Item:** Clarify for Phase Y+ planning docs.

---

## 4. Phase Integration & Timeline

### Phase 1 Work Estimate Conflict

**Current Execution Plan (from prior docs):**
```
Phase 1 (78h): State (14h) + Reducer (18h) + UI (16h) + Composition (14h) + Export (16h)
```

**New Specs Added:**
```
+ SPEC-SYMMETRY Phase 1: 10-12h (rendering 7 symmetries)
+ SPEC-LAYERS-SIDEBAR Phase 1: 12-16h (baseline)
  - Issue: Rename should be +2h (actual: 14-18h)
  - Issue: Undo infrastructure should be +3h (actual: 17-21h)
  - Revised estimate: 17-21h (up from 12-16h)
```

**Total Phase 1 New Features:**
```
Symmetry:        10-12h
Layers Sidebar:  17-21h (revised)
─────────────────────────
Total:          27-33h (new)

Existing Phase 1 scope (78h):
  - State (14h): Covers symmetry + layer state combined? Or separate?
  - Reducer (18h): Includes layer actions (add/delete/reorder)?
  - UI (16h): How much is layers sidebar vs. other UI?
  - Composition (14h): Still deferred? Or overlaps with layers?
  - Export (16h): Includes layer metadata?
```

**Concern:** Overlap or double-counting?
- Are symmetry + layers included in the original 78h?
- Or completely incremental?
- If incremental, Phase 1 becomes 78h + 27-33h = 105-111h (not credible for 4 weeks)

**Recommendation:**
**Clarify relationship to execution plan:**

```
Questions for Phase 1 Planning:
1. Are SPEC-SYMMETRY and SPEC-LAYERS-SIDEBAR part of original Phase 1 work?
   - If YES: Execution plan needs rebalancing (78h is no longer sufficient)
   - If NO: They're bonus features, Phase 1 extends beyond 78h

2. If Phase 1 = 78h total, how does it break down:
   - Core state machine (seed + color ownership): 14h?
   - Symmetry rendering (7 symmetries): 10-12h?
   - Layers sidebar (core CRUD): 14-18h?
   - Export/import (JSON schema): 10h?
   - Testing (C1-C20 + L1-L12): 15h?
   Total: 63-70h (fits in 78h)

3. Alternative: Phase 1 is non-composition baseline (no layers)
   - SPEC-SYMMETRY alone: Phase 1.5 (weeks 4-5)
   - SPEC-LAYERS-SIDEBAR: Phase 2 (weeks 6-7)
   - Composition integration: Phase Y+

Recommend: Explicit breakdown in revised execution plan
```

---

## 5. Risk Assessment

### Projects by Severity

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| **Layers Phase 1 underestimated** | HIGH | HIGH | ✅ Revise to 17-21h (was 12-16h) |
| **Undo/redo scope creep Phase 2** | MEDIUM | MEDIUM | ✅ Add undoStack to Phase 1 state |
| **Blending mode perf regression** | MEDIUM | MEDIUM | ✅ Clarify rendering approach (CSS vs. SVG) |
| **Layer content types too prescriptive** | LOW | LOW | ✅ Simplify Phase 1 to "blank" only |
| **Layers × Symmetry interaction unclear** | MEDIUM | LOW | ✅ Document for Phase Y+ planning |
| **Execution plan overlap unclear** | HIGH | HIGH | ✅ Reconcile 78h with new specs (blocker) |

---

## 6. Detailed Issues Summary

### SPEC-LAYERS-SIDEBAR.md

| # | Issue | Severity | Status | Action |
|---|-------|----------|--------|--------|
| 1.1 | Rename deferred to Phase 2 | 🔴 HIGH | CRITICAL | Move to Phase 1, +2h estimate |
| 1.2 | Undo/redo deferred but tests assume | 🔴 HIGH | BLOCKING | Add undoStack to Phase 1, +3h |
| 1.3 | Blending mode rendering undefined | 🟠 MEDIUM | PLANNING | Clarify CSS vs. SVG before Phase 2 |
| 1.4 | Layer content types too restrictive | 🟡 MEDIUM | PLANNING | Simplify Phase 1 model |
| 1.5 | Layer export/import ambiguous | 🟡 MEDIUM | CLARIFY | Align with ICON-BOUNDARIES ExportPayload |
| 1.6 | Performance constraints not tested | 🟡 MEDIUM | TEST | Add perf tests L25+ to Phase 1 |

### SPEC-SYMMETRY.md

| # | Issue | Severity | Status | Action |
|---|-------|----------|--------|--------|
| 2.1 | Radial ray drawing underspec'd | 🟡 MEDIUM | IMPLEMENT | Add createRaysGroup algorithm |
| 2.2 | Composition modes still vague | 🟢 LOW | DEFER | Phase Y+ planning task |

### Cross-Spec

| # | Issue | Severity | Status | Action |
|---|-------|----------|--------|--------|
| 3.1 | Layers × Symmetry unclear | 🟠 MEDIUM | CLARIFY | Document for Phase Y+ |
| 4.1 | Execution plan overlap | 🔴 HIGH | BLOCKING | Reconcile 78h estimate |

---

## 7. VERDICT & RECOMMENDATIONS

### SPEC-LAYERS-SIDEBAR.md

**Status:** ⚠️ **APPROVE WITH REVISIONS (Critical Issues Block Phase 1 Start)**

**Must Fix Before Phase 1:**
- [ ] Move rename to Phase 1, revise estimate 12-16h → 14-18h (**Issue 1.1**)
- [ ] Add undoStack to Phase 1 state, revise estimate → 17-21h (**Issue 1.2**)
- [ ] Define layer export/import format with ICON-BOUNDARIES (**Issue 1.5**)

**Must Clarify Before Phase 2:**
- [ ] Blending mode rendering approach (CSS mix-blend-mode vs. SVG feBlend) (**Issue 1.3**)

**Nice-to-Have Before Phase 1:**
- [ ] Add performance testing acceptance criteria (L25+) (**Issue 1.6**)
- [ ] Simplify Phase 1 LayerContent to only "blank" (**Issue 1.4**)

**Effort to Fix:** 3-4 hours (revise scope + meet timeline)  
**Current Estimate:** 17-21h Phase 1 (up from 12-16h)  
**Phase 1 Success Probability:** 75% (after fixes)

---

### SPEC-SYMMETRY.md (Improved)

**Status:** ✅ **APPROVE (Improvements Solid, Minor Clarifications)**

**Must Clarify Before Phase 1:**
- [ ] Radial ray generation algorithm (CSS vs. SVG path) (**Issue 2.1**)

**After Phase 1-2:**
- [ ] Composition modes detailed spec (Phase Y+ planning) (**Issue 2.2**)

**Effort to Fix:** 1 hour (add ray algorithm)  
**Current Estimate:** 10-12h Phase 1 (no change)  
**Phase 1 Success Probability:** 90% (after clarification)

---

### Integration & Execution Plan

**Status:** 🔴 **BLOCKING — Requires Reconciliation**

**Conflict:** Original execution plan (78h Phase 1) vs. new specs (minimum 100+h Phase 1 if all included)

**Decision Needed:**
1. Are SPEC-SYMMETRY + SPEC-LAYERS-SIDEBAR part of Phase 1 compliance?
   - If YES: Rebalance 78h into breakdown (state, reducer, UI, Sym, Layers, export)
   - If NO: Phase 1 core only; Symmetry/Layers are Phase 2+ features

2. Timeline impact:
   - Option A: Phase 1 baseline (seed + color owner, no symmetry/layers): ~40h
   - Option B: Phase 1 full (includes symmetry + layers): ~110-120h (6-week project)

**Recommendation:**
- **Clarify scope with user immediately** (blocking Phase 1 kickoff)
- **Reconcile execution plan with new specs** (1-2 hour meeting)
- **Revise timeline or descope features** accordingly

---

## 8. Summary Table

### Critical Issues Blocking Implementation

**SPEC-LAYERS-SIDEBAR:**
1. **Issue 1.1 (Rename)** — Move to Phase 1 (+2h)
2. **Issue 1.2 (Undo)** — Add to Phase 1 state (+3h)
3. **Issue 1.5 (Export)** — Align with ICON-BOUNDARIES
4. **Issue 4.1 (Execution Plan)** — Reconcile 78h vs. new specs

**SPEC-SYMMETRY:**
1. **Issue 2.1 (Rays)** — Add algorithm (+1h)

**Total Revision Effort:** ~5-6 hours
**Total Phase 1 Impact:** Original 78h ± new scope allocation

---

## 9. Next Steps

**Immediate (Before Phase 1 Kickoff):**
1. User clarifies: Are SYMMETRY + LAYERS part of Phase 1?
2. Agent revises execution plan & timeline
3. Resolve Issue 4.1 (scope reconciliation)
4. Update SPEC-LAYERS-SIDEBAR per Issues 1.1, 1.2, 1.5
5. Update SPEC-SYMMETRY per Issue 2.1

**Phase 1 Planning (Week 1):**
1. Spike Phase (9h) validates assumptions
2. Phase 0 (weeks 2-3) builds keywords.json
3. Phase 1 (weeks 4-5) implements core + symmetry + layers (TBD breakdown)

**Phase 1 Testing:**
1. Acceptance tests C1-C20 (symmetry)
2. Acceptance tests L1-L12 (layers) + L25-L26 (perf)

---

*Generated: 2026-03-10*  
*Status: REVISION NEEDED (5-6h work)*  
*Blocking: YES — Resolve before Phase 1 start*
