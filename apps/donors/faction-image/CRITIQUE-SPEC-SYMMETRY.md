# Critique: SPEC-SYMMETRY.md

**Date:** 2026-03-10  
**Reviewer:** Agent  
**Status:** PRE-IMPLEMENTATION REVIEW  
**Overall Assessment:** SOLID SPEC WITH CRITICAL GAPS — Ready to start Phase 1 with clarifications

---

## Executive Summary

**Strengths:**
- ✅ Comprehensive taxonomy (25+ symmetries well-organized)
- ✅ Phased approach realistic (7 → 14 → 25+)
- ✅ Determinism contracts clear
- ✅ Domain affinity model sound
- ✅ Tests defined (C33-C42 matrix)
- ✅ UI placement sensible

**Critical Issues:** 5 HIGH, 3 MEDIUM  
**Blocking Phase 1:** 2 items (composition definition, rendering algorithm detail)  
**Deferred to Phase 2:** 3 items (compatibility matrix full spec, advanced UI grouping)

**Recommendation:** Approve Phase 1 scope with clarifications on composition + rendering.

---

## 1. CRITICAL ISSUES (Block Phase 1 Start)

### Issue 1.1: Composition Interaction with Symmetry UNDEFINED
**Severity:** 🔴 HIGH  
**Category:** Architecture  
**Affects:** Phase 1, Phase Y+

**Problem:**
The spec ignores **how composition interacts with symmetry**.

Current open questions:
- Is symmetry applied to the **whole composition** or **per-layer**?
- If user has 2 layers (base + accent) and applies rot-8, does:
  - Option A: Each layer rotated 8x independently, then composited?
  - Option B: Layers composited first, then whole composition rotated 8x?
  - Option C: Base gets rot-8, accent stays asymmetric?

- What happens to layer opacity in radial-8? (8 copies × 5 layers = 40 SVG groups?)
- Can users decompose a composed symbol back to editable layers after symmetry?

**Evidence:**
- SPEC-ICON-BOUNDARIES.md defines composition modes but doesn't mention symmetry
- SPEC-SYMMETRY.md mentions composition as "orthogonal state" but gives no details
- Execution plan lists "composition" as separate 14h work unit from symmetry

**Impact:**
- If answered wrong, Phase 1 implementation could deadlock Phase Y+ asset integration
- If composition is per-layer, state model becomes exponentially complex
- If whole-composition, limits composition options (e.g., radial-8 with 5 layers × 8 = unreadable)

**Recommendation:**
**MUST clarify before Phase 1 starts.** Suggest answer:

> **Symmetry + Composition Model (Proposed)**
>
> Symmetry is applied to the **complete generated base symbol** BEFORE composition layers are added.
>
> Flow:
> 1. Generate base symbol (procedural)
> 2. Apply symmetry (rot-8, etc.)
> 3. Add composition layers on top (accent overlays, directional elements)
> 4. Composition layers NOT symmetrized (stay asymmetric for variation)
>
> This keeps state simple: symmetry ∈ {core symbol}, composition ∈ {optional overlay}.
>
> Storage:
> ```json
> {
>   "state": {
>     "seed": "s3-Zva2",
>     "symmetry": "rot-8",          // Applied to base only
>     "composition": {
>       "mode": "overlay-top-right",
>       "layers": [
>         { "assetId": "star-5", "opacity": 0.5 }
>       ]
>     }
>   }
> }
> ```

**Action:** Add 1 section to SPEC-SYMMETRY.md clarifying this model before Phase 1.

---

### Issue 1.2: Rendering Algorithm UNDERSPECIFIED
**Severity:** 🔴 HIGH  
**Category:** Implementation  
**Affects:** Phase 1

**Problem:**
Section 5.1 pseudo-code is incomplete. Real questions:

1. **SVG Merge Logic**: How to merge 8 rotated copies?
   - Are they grouped? `<g transform="rotate(0)">...</g>` × 8?
   - What's the bounding box? (8 copies may not fit in 100×100)
   - Do copies overlap? (For radial, center is shared; for rot-4, they don't touch)

2. **Center Point Assumption**: Where is rotation center?
   - SVG default: top-left (0,0)?
   - Or content center (calculated from bounding box)?
   - For radial-6, rays emanate from center; if off-center, looks wrong.

3. **Mirror Axis Position**: For vertical mirror, where is the axis?
   - X=50 (center)? X=10 (offset)? User configurable?
   - If user has off-center design, mirror axis choice matters.

4. **Radial "Rays" Unclear**: Does radial-8 include connecting rays?
   - Example shows: "8 copies radiate from center"
   - But is there also a line/ray connecting to center? Or just 8 copies?
   - Visual difference: Compass vs. 8 rotated symbols stacked.

5. **Performance Unknown**: Merging 16 SVG copies (radial-16) is 16× the path data.
   - Will this slow rendering? Ship it anyway (Phase 1)?
   - Should Phase 1 cap at radial-8?

**Evidence:**
- Pseudo-code in 5.1 calls `mergeCopiesAtCenter(copies)` with no implementation detail.
- Radial example is ASCII art; no SVG DOM structure shown.
- No mention of bounding box recalculation.

**Impact:**
- Dev implementing Phase 1 may build it wrong first time.
- If center point wrong, rot-8 + radial-8 look visually broken.
- Composition layer placement assumes bounding box is known.

**Recommendation:**
**ADD to SPEC-SYMMETRY.md before Phase 1:**

> **5.2 SVG Rendering Detail (New Section)**
>
> **Bounding box & center point:**
> ```
> - Calculate content bounding box: bbox = { x, y, width, height }
> - Rotation center point: (bbox.x + bbox.width/2, bbox.y + bbox.height/2)
> - For all transforms, use this center (not SVG default 0,0)
> ```
>
> **Mirror axis:**
> ```
> - Vertical (mirror-v): Axis at bbox.x + bbox.width/2
> - Horizontal (mirror-h): Axis at bbox.y + bbox.height/2
> - Reflection: Use SVG <transform matrix> or scaleX(-1) + reposition
> ```
>
> **Copy merging (rotation + radial):**
> ```
> 1. Clone base SVG path N times (where N = foldCount)
> 2. Wrap each clone in <g transform="rotate(angle, cx, cy)">
> 3. Container <SVG> must have viewBox large enough for all copies
> 4. viewBox = "0 0 {2×width} {2×height}" to avoid clipping
> ```
>
> **Radial rays (optional, Phase 2+):**
> ```
> - For radial-* (Phase 2+), draw connecting lines from center to each copy
> - Lines use domain color at reduced opacity (0.3)
> - Optional setting: "Show Rays" toggle in Phase 3
> ```

**Action:** Add detailed rendering section before Phase 1 implementation.

---

### Issue 1.3: Composition Definition Still Deferred (But Blocks Phase 1 UI)
**Severity:** 🟠 MEDIUM  
**Category:** Specification  
**Affects:** Phase 1 UI

**Problem:**
SPEC-ICON-BOUNDARIES.md defines composition modes as:
```
mode: "overlay-center" | "overlay-top" | ...
```

But Phase 1 spec for symmetry doesn't mention: **Should composition UI appear in Phase 1, or is it Phase Y+ only?**

Current execution plan says composition = 14h in Phase 1.5. But if composition isn't built, symmetry testing is incomplete (can't test C37 properly without composition in place).

**Evidence:**
- SPEC-ICON-BOUNDARIES lists composition modes but no detailed interaction model
- SPEC-SYMMETRY has footnote: "composition undefined" in section 3.1
- Execution plan Phase 1.4: "Composition (14h)" — but no spec details

**Impact:**
- Phase 1 dev doesn't know if they should build composition UI or skip for Phase 2
- Testing C35 (mirror-vh + 4 quadrants) may require composition to be visible
- Scope creep risk: "Composition" could mean 5 hours or 14 hours depending on definition

**Recommendation:**
**Clarify before Phase 1:** Is composition part of Phase 1, or defer to Phase Y+?

**Option A (Recommended):** Deferred
> Composition (layering, overlay modes) defers to Phase Y+ (asset integration).
> Phase 1 focuses on single-symbol symmetry only.
> Remove composition from Phase 1 scope; reduces 14h overhead from Phase 1.5.

**Option B:** Keep in Phase 1
> Specify exactly what composition UI includes in Phase 1:
> - Mode selector dropdown? (3h)
> - Layer opacity slider? (but which layer settings?)
> - Or just internal support (no UI until Phase Y+)?

**Action:** Clarify composition scope before Phase 1 kickoff.

---

## 2. MEDIUM ISSUES (Can Resolve in Phase 1 Planning)

### Issue 2.1: Compatibility Matrix Incomplete
**Severity:** 🟡 MEDIUM  
**Category:** Specification  
**Affects:** Phase 2

**Problem:**
Section 5.2 shows a compatibility matrix (⚠ = "Works but may look odd") but doesn't define:
- What exactly does "odd" mean? (Visual distortion? Rotation mismatch?)
- When to warn vs. when to forbid? (Block selection? Suggest alternative?)
- Which combos are actually incompatible (should block) vs. just suboptimal?

**Evidence:**
- Triangle + rot-8 marked ⚠, but could rot-8 work if base has circular elements?
- Radial-6 + Square marked ⚠, but diagonal squares (rotate 45°) might actually harmonize.
- No testing strategy for "harmony" — how do we validate the matrix empirically?

**Impact:**
- Warning system (Section 4.5) undefined: When does UI show ⚠?
- Phasing ambiguous: Matrix validation seems like Phase 2 work, but spec doesn't commit.

**Recommendation:**
- **Phase 1:** Skip detailed matrix validation. Allow all combos, no warnings.
- **Phase 2:** Spike on real rendering (generate 5 test cases per combo, get user feedback).
- **Phase 3:** Deploy full matrix with learned "odd" rules from Phase 2 feedback.

**Action:** Defer matrix to Phase 2; update phase breakdown.

---

### Issue 2.2: Domain Presets Underspec'd for Phase 1
**Severity:** 🟡 MEDIUM  
**Category:** UI/UX  
**Affects:** Phase 1

**Problem:**
Section 2.6 defines domain presets as "Phase 3 addition." But execution plan Phase 1.3 "UI contract (16h)" likely includes domain-suggest dropdown.

Two conflicting statements:
- Spec says domain presets are Phase 3 UI polish
- Execution plan implies Phase 1 includes domain auto-suggest

**Evidence:**
- SPEC-SYMMETRY Section 4.4 shows domain-aware dropdown as "MVP"
- But Section 2.6 explicitly says "divine-preset (Phase 3)"
- Execution plan phase 1.3 (UI contract) is only 16h; full domain UI might not fit

**Impact:**
- Ambiguity on Phase 1 scope: Does it include domain-suggest dropdown or just symmetry picker?
- Risk of feature creep or scope underestimate.

**Recommendation:**
**Phase 1 MVP (Recommended):**
- Symmetry dropdown with all 7 options
- When domain changes, symmetry selection updates (via store)
- No separate "domain preset" buttons; just dropdown update

**Phase 3 Polish:**
- Add domain preset buttons as visual shortcuts
- Add "Recommended" label highlighting
- Group dropdown by category

Update Section 4 to clarify "Phase 1: Flat dropdown, plain list" vs. "Phase 3: Grouped + presets."

**Action:** Clarify Phase 1 UI scope in execution plan update.

---

### Issue 2.3: Test C38-C41 TIMING Ambiguous
**Severity:** 🟡 MEDIUM  
**Category:** Testing  
**Affects:** Phase 1-2

**Problem:**
Tests C38-C41 are listed without explicit phase assignment:

- C38 (seed + symmetry determinism): Phase 1 or Phase 2?
- C39 (revisionId changes on symmetry): Phase 1 or deferred?
- C40 (domain-suggest accuracy): Phase 1 or Phase 3?
- C41 (compatibility warning): Phase 1 (no warning) or Phase 2 (warning added)?

Answer affects Phase 1 exit criteria and Phase 2 work.

**Evidence:**
- Test matrix (Section 9) lists but doesn't assign phases
- Execution plan C1-C20 vs. C21-C24 vs. C25-C32 split unclear how to map C33-C42

**Impact:**
- Phase 1 could be under-tested or over-tested
- Risk of "bug found in Phase 2 that should've been caught in Phase 1"

**Recommendation:**
**Assign explicitly:**
- C33-C35: Phase 1 (basic rendering of 7 symmetries)
- C36-C37: Phase 1 (rot-4, rot-8, radial-8 rendering)
- C38-C39: **Phase 1** (seed-locked regenerate must work, revisionId proof)
- C40: Phase 3 (domain-suggest = Phase 3; Phase 1 just changes dropdown)
- C41: Phase 2 (compatibility warning not in Phase 1)
- C42: Phase 1 (export payload structure, straightforward)

Update Section 9 test matrix with phase labels.

**Action:** Add phase labels to all C33-C42 tests.

---

## 3. LOWER-PRIORITY ISSUES (Nice to Have, Phase 2+)

### Issue 3.1: Accessibility (ARIA) Deferred
**Severity:** 🟢 LOW  
**Category:** UX  
**Notes:** Mentioned in Section 12 as "Phase 2 future enhancement"

**Assessment:** Reasonable to defer. Phase 1 should include basic labels; full ARIA tree in Phase 2.

### Issue 3.2: Performance Benchmarking Unplanned
**Severity:** 🟢 LOW  
**Category:** Engineering  
**Notes:** Section 12 mentions "Does 16-way radial bog down rendering?"

**Assessment:** Phase 1 benchmark; if radial-16 is slow, cap Phase 1 at radial-8, defer -12/-16 to Phase 2.

### Issue 3.3: Pentagonal (5-fold) Symmetry Not in MVP
**Severity:** 🟢 LOW  
**Category:** Completeness  
**Notes:** Nature domain may want rot-5 or radial-5

**Assessment:** Nature domain can use radial-6 in Phase 1; add rot-5 in Phase 2 if user feedback requests it.

---

## 4. POSITIVE ASPECTS (What's Good)

### 4.1 Determinism Contracts Clear
```
✅ "Same input = Same output on same version"
```
This is crisp and testable. C38-C39 verify it. Good foundation.

### 4.2 State Model Integrates Well with Seed System
The SymmetryConfig + SymmetryWithSeed types align with existing SeedHistoryEntry pattern.
Exporting symmetryId in JSON payload is the right call.

### 4.3 Domain Affinity Logic Sound
Mapping domains → symmetry choices (Divine → radial-6, Order → quad-mirror) is intuitive and defensible.
Table in 2.6 is clear.

### 4.4 Phased Rollout Credible
- Phase 1: 7 symmetries, 10-12h (realistic, MVP achievable)
- Phase 2: +7 more, focus on rotation variants (logical next step)
- Phase 3: Hybrids + UI polish (lowest priority, nice-to-have)

Effort estimates seem reasonable for Phase 1 (10-12h for new rendering code + UI).

### 4.5 Acceptance Tests Well-Defined for Phase 1
C33-C37 are concrete, testable, implementable.
Each test has clear input → expected output → verification strategy.

---

## 5. RISK ASSESSMENT

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| **Composition interaction breaks Phase 1** | HIGH | HIGH | ✅ Clarify before start (Issue 1.1) |
| **Rendering algorithm wrong (center point off)** | MEDIUM | HIGH | ✅ Add detailed SVG specs (Issue 1.2) |
| **Phase 1 scope creep (composition included)** | MEDIUM | MEDIUM | ✅ Clarify UI scope (Issue 2.2) |
| **Radial-16 too slow** | LOW | MEDIUM | ✅ Phase 1 benchmark, defer if slow |
| **Domain-suggest not ready Phase 1** | MEDIUM | LOW | ✅ Defer to Phase 3, Phase 1 = manual picker |
| **Missing C38-C39 in Phase 1 tests** | MEDIUM | MEDIUM | ✅ Assign test phases (Issue 2.3) |

---

## 6. ALIGNMENT WITH EXISTING SPECS

### SPEC-ICON-BOUNDARIES.md
- ✅ Symmetry integrates cleanly; treats as state property like seed
- ✅ Color ownership model independent (orthogonal)
- ⚠️ Composition definition still vague in both specs (see Issue 1.1)

### SPEC-ICON-IMPLEMENTATION-RECALIBRATED.md
- ✅ Symmetry Phase 1 (7 options, MVP) aligns with asset library timing
- ✅ Phase Y+ can layer symmetry on asset library (SVG recolor post-symmetry)
- ✅ Export payload in this spec should include SPEC-SYMMETRY's symmetryId field

### Execution Plan (130h total)
- ✅ Phase 1 (78h):
  - 1.1 State (14h) — includes SymmetryConfig state
  - 1.2 Reducer (18h) — includes symmetry action dispatch
  - 1.3 UI (16h) — includes symmetry dropdown
  - 1.4 Composition (14h) — AMBIGUOUS, see Issue 1.3
  - 1.5 Export (16h) — includes symmetry in JSON
- ⚠️ Composition 14h + Symmetry ~10-12h = ~24-26h, BUT execution plan allocates:
  - UI: 16h (tight if composition + symmetry both included)
  - Recommend: Defer composition to Phase Y+, reduce UI estimate to 12h

---

## 7. OPEN QUESTIONS REQUIRING USER INPUT

1. **Composition + Symmetry interaction model:** How should these combine? (Issue 1.1)
   - Base symbol gets symmetry, composition layers stay asymmetric? (Recommended)
   - Or per-layer symmetry? Or whole-composition symmetry?

2. **Composition scope in Phase 1:** Include UI or defer to Phase Y+? (Issue 1.3)
   - If included: Reduce other Phase 1 work (execution plan needs rebalancing)
   - If deferred: Easier Phase 1, stronger Phase Y+ integration

3. **Domain presets in Phase 1 or Phase 3?** (Issue 2.2)
   - Phase 1 MVP: Just flat symmetry dropdown (no preset buttons)
   - Phase 3: Add domain preset buttons for quick access

4. **Compatibility matrix validation:** When to warn vs. forbid? (Issue 2.1)
   - Phase 1: No warnings, allow everything
   - Phase 2: Research which combos are actually "odd"
   - Phase 3: Deploy full matrix with warnings

---

## 8. SUMMARY OF CHANGES NEEDED

### BEFORE Phase 1 Starts (BLOCKING)
- [ ] Add Section 5.2: Detailed SVG rendering (center point, bounding box, axis logic)
- [ ] Clarify Issue 1.1: Composition + Symmetry interaction model
- [ ] Clarify Issue 1.3: Is composition in Phase 1 or deferred?
- [ ] Add phase labels to all tests (C33-C42)

### Between Phase 1 & Phase 2 (PLANNING)
- [ ] Clarify Issue 2.2: Domain presets Phase 1 vs. Phase 3
- [ ] Plan Issue 2.1: Compatibility matrix research for Phase 2

### Phase 2+ (LOW PRIORITY)
- [ ] Implement compatibility matrix warnings
- [ ] Add domain preset UI
- [ ] Benchmark radial-16; defer if slow

---

## 9. RECOMMENDATION

**VERDICT:** ✅ **APPROVE FOR PHASE 1 WITH CLARIFICATIONS**

This spec is solid and comprehensive. However, **2 critical gaps block implementation:**

1. ⚠️ **Composition interaction** (Issue 1.1) — Must clarify before any code
2. ⚠️ **SVG rendering detail** (Issue 1.2) — Must add before dev starts

**Path Forward:**
1. User clarifies Issues 1.1 & 1.3 (30 min discussion)
2. Agent adds Section 5.2 rendering detail (1h revision)
3. Agent updates phase labels on tests C33-C42 (30 min)
4. **APPROVED.** Phase 1 execution can begin

**Effort to fix:** 2 hours revision work.  
**Phase 1 timeline impact:** 0 hours (clarifications precede coding).  
**Phase 1 success probability:** 85% → 95% post-clarification.

---

## APPENDIX: Detailed Feedback by Section

### Section 1 (Overview)
✅ Clear, concise, goals well-defined

### Section 2 (Taxonomy)
✅ Outstanding. 25+ options well-organized, descriptions precise.
One note: Pentagonal (rot-5, radial-5) missing for nature domain; add to Phase 2.

### Section 3 (State Model)
✅ Types are clean. 
⚠️ Missing: How symmetry interacts with composition (Issue 1.1)

### Section 4 (UI/UX)
⚠️ Option 1 vs. Option 2 dropdown layouts both plausible.
⚠️ Recommend Option 1 (flat) for Phase 1; upgrade to Option 2 (grouped) Phase 3.
🟠 Section 4.5 (domain-suggest) claims Phase 1 but should be Phase 3 (Issue 2.2)

### Section 5 (Rendering)
🔴 **5.1 pseudo-code too vague.** Need SVG DOM structure (Issue 1.2)
🔴 **5.2 missing entirely.** Critical for implementation.
⚠️ 5.3 compatibility matrix reasonable for Phase 2 (not Phase 1)

### Section 6 (Seed & Determinism)
✅ Contracts clear, export/import detail good.

### Section 7 (State Machine)
✅ Transitions well-defined.

### Section 8 (Phase Breakdown)
✅ Phasing credible. 
⚠️ Hours allocation assumes no composition UI in Phase 1 (see Issue 1.3)

### Section 9 (Acceptance Tests)
✅ Tests concrete and testable.
⚠️ Missing phase labels (Issue 2.3)

### Section 10 (Type Definitions)
✅ Clean, match existing TypeScript patterns.

### Section 11 (Dependencies & Integration)
✅ Good dependency tracking.

### Section 12 (Open Questions)
✅ Honest acknowledgment of future enhancements.

---

## FINAL THOUGHTS

This is a **well-researched, comprehensive spec**. The 25+ symmetry taxonomy is impressive and defensible. The phasing strategy is realistic. The type system is mature.

The gaps are **manageable clarifications**, not fundamental flaws. With the issues above resolved, this spec is immediately executable.

**Estimated Phase 1 success with these clarifications in place: 90%+**

Proceed with confidence after addressing Issues 1.1, 1.2, 1.3, and 2.3.
