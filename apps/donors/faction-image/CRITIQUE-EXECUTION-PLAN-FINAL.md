# Critique: 100% Compliance Execution Plan (Revised)

## Executive Summary
**This is a well-structured plan with clear phases, effort estimates, and dependencies.**

- ✅ Proper phase separation (core → hardening → extension)
- ✅ Determinism/legacy correctly deferred to Phase 2
- ✅ Acceptance matrix C1-C32 explicitly defined
- ✅ Realistic timeline (130h = 4 weeks solo, 2.5 weeks with 2 devs)
- ⚠️ Some hour estimates are suspect (UI contract 16h is light)
- ⚠️ Test matrix split between phases unclear (C21-C23 timing)
- ⚠️ Asset extension rationale unclear (C25-C32 assumptions)
- ❌ Import validation scope ambiguous (Phase 1 vs Phase 2)

---

## 1. Strengths (What Works)

### 1.1 Proper Phase Separation
✅ **Phase 1:** Core compliance without premature locking
```
- State authority unification (14h) ← fundamental
- Color reducer (18h) ← foundational
- UI contract (16h) ← user-facing
- Composition ownership (14h) ← state modeling
- Export schema v1.0.0 (16h) ← contract definition
Total: 78h
Gate: C1-C20 (excluding determinism tests)
```

✅ **Phase 2:** Hardening after code stabilization
```
- Determinism pinning (18h) ← freeze outputs
- Legacy import (10h) ← backward compat
- CI policy (6h) ← automation
Total: 34h
Gate: All C1-C24
```

This is **correct timing.** Don't pin determinism until Phase 1 code is stable.

### 1.2 Explicit Acceptance Matrix
✅ **C1-C24 fully listed** (finally!)
```
C1–C8:   Color ownership transitions (8 tests)
C9–C12:  Seed action semantics (4 tests)
C13–C15: Composition parity (3 tests)
C16:     Symbol registry integrity (1 test)
C17:     Rename doesn't mutate seed (1 test)
C18–C19: Lock semantics (2 tests)
C20:     Domain curation constraints (1 test)
C21–C22: Deterministic outputs (2 tests)
C23:     Schema-version import (1 test)
C24:     Preset apply respects locks (1 test)
────────────────────────────────
Total: 24 acceptance criterion
```

✅ **C25-C32 also listed** (asset extension tests)
```
C25–C26: Export stores lineage + metadata
C27:     Batch export preserves identity
C28–C32: Round-trip, index uniqueness, error handling, ownership preservation, determinism
```

This clarity is **excellent.** No more guessing.

### 1.3 Realistic Timeline
✅ **130 hours total is credible**
- State unification: 14h (realistic for restructuring + tests)
- Color reducer: 18h (complex but bounded)
- UI: 16h (light, see below)
- Composition: 14h (state + metadata)
- Export: 16h (schema + validation)
- Determinism: 18h (fixture creation + version pinning)
- Legacy: 10h (migration logic + error handling)
- CI: 6h (policy + gates)

**1 dev = 4 weeks @ 7-8h/day is achievable.**
**2 devs = 2.5 weeks (some phases parallelizable).**

### 1.4 Dependencies Clearly Stated
✅ **Each step shows what blocks it:**
```
State authority (1): no dependencies
Color reducer (2): partial on (1)
UI (3): depends on (2)
Composition (4): depends on (1)
Export (5): depends on (1), (4)
Determinism (6): depends on Phase 1 complete
Legacy (7): depends on (5)
CI (8): depends on (6), (7)
```

This prevents rework and parallelization mistakes.

---

## 2. Issues (Details to Resolve)

### 2.1 UI Contract (16h) Seems Light
**The requirement spans:**
```
- Owner affordances per channel (domain/preset/manual indicators)
- Explicit action controls (Generate, Regenerate Same, Randomize, Lock)
- Live selected-variant updates without selection loss
- Composition behavior explicit and reversible
```

**16 hours breakdown might be:**
- Owner affordances UI: 4h
- Action controls UI: 4h
- Selected-variant persistence: 4h
- Composition reversibility: 4h
= 16h total

**Reality check:** Is this:
- 16h of **implementation** (code + tests)?
- 16h of **design** (wireframes + interaction specs)?
- 16h of **design + implementation**?

**If implementation:** 16h is tight. Typical UI component work is 20-30h for 3-4 features.

**If design + implementation:** Could be right, but unusual split.

**Recommendation:** Clarify whether 16h includes:
- Component development (Svelte/React)?
- State management integration?
- Manual QA of affordances?
- Unit tests for state changes?

If any are excluded, add hours.

### 2.2 Test Matrix Timing is Ambiguous
**Phase 1 gate says:**
```
Phase 1 gate: C1–C20 passing (determinism/legacy tests excluded until Phase 2).
```

**But the test matrix lists:**
```
C21–C22: deterministic composition revision and deterministic output.
C23: schema-version import behavior.
C24: preset apply respects manual channel locks.
```

**Questions:**
1. **Are C21-C22 (deterministic outputs) in Phase 1 or Phase 2?**
   - If Phase 1: How can they be deterministic without frozen code?
   - If Phase 2: Why exclude them from Phase 1?
   - Answer probably: **C21-C22 are Phase 2 only; test that "same input on same version yields same output"**

2. **Is C23 (schema-version import) in Phase 1 or Phase 2?**
   - C23 says "import behavior" but legacy import handling is Phase 2
   - Probably means: **Phase 1 validates schema on export; Phase 2 validates on import**
   - Or: **Phase 1 imports current schema; Phase 2 handles legacy**

3. **Is C24 (preset apply locks) in Phase 1 or Phase 2?**
   - Seems like Phase 1 (color reducer responsibility)
   - Should be Phase 1

**Recommendation:** Clarify:
```
Phase 1 tests (C1-C20):
  C1–C8:   Color ownership ✅
  C9–C12:  Seed actions ✅
  C13–C15: Composition (preview/export, not determinism) ✅
  C16:     Symbol registry ✅
  C17:     Rename semantics ✅
  C18–C19: Lock on generate ✅
  C20:     Domain constraints ✅

Phase 2 tests (C21-C24):
  C21–C22: Deterministic outputs (frozen code) ✅
  C23:     Import validation (legacy handling) ✅
  C24:     Preset locks (Phase 1 or 2?) ⚠️
```

### 2.3 Export Schema Validation Scope
**The plan says (step 5):**
```
Export schema v1.0.0 (16h)
  Emit normative payload shape.
  Validate schema on export path.
```

**But says:**
```
Legacy import handling (10h)
  Add import migration behavior.
  Add unsupported-major schema errors.
```

**Ambiguity:** Does "validate schema on export path" in Phase 1 include:
- ✅ Validating output JSON matches schema v1.0.0?
- ✅ Erroring if required fields missing?
- ❌ Handling import of legacy/unsupported schemas? (This is Phase 2)

**Questions:**
1. Does Phase 1 have ANY import logic, or only export?
2. Can Phase 1 export without import validation?
3. Or is C23 "schema-version import behavior" a Phase 1 test of "rejects unknown schema"?

**Recommendation:** Clarify:
```
Phase 1 (Export schema v1.0.0):
  - Emit correct JSON shape
  - Validate on export (throw error if payload invalid)
  - Phase 1 does NOT import

Phase 2 (Legacy import handling):
  - Accept legacy v0.x imports (if they exist)
  - Synthesize missing seedHistory
  - Reject unsupported major versions (>1.x)
  - Add C23 test in Phase 2
```

### 2.4 Color Reducer (18h) Might Be Tight
**Requirements:**
```
- Route all color actions through reducer/service
- Enforce per-channel ownership + sticky manual
- Support preset modes: unlocked/all
```

**Candidate actions that need reducer handling:**
```
selectDomain(domain) → owned by domain
selectPreset(presetId, mode: "unlocked" | "all") → owned by preset
  - If "all": applies to all channels
  - If "unlocked": skips manual channels
manualEdit(channel, color) → owned by manual (sticky)
resetToDomain(channel) → revert channel to domain ownership
resetToPreset(channel, presetId) → revert channel to preset ownership
randomize(seed) → new seed, regenerate
lock(symbolId) → prevent randomize
unlock(symbolId) → allow randomize
```

**Is 18h realistic?**
- Reducer implementation: 6h
- Tests for each action: 8h
- Service integration: 3h
- State persistence: 1h
= 18h (tight but doable)

**Recommendation:** Acceptable, but monitor in Phase 1 for scope creep.

### 2.5 Composition Ownership (14h) Needs Clarification
**Requirements:**
```
- Persist composition config with revision metadata.
- Ensure preview/export parity.
```

**Questions:**
1. **What is "composition" in this context?**
   - Overlaying multiple icons?
   - Combining base + accent?
   - Procedural layering?

2. **What goes in "composition config"?**
   ```
   {
     mode: "overlay-center" | "overlay-top" | ...,
     layers: [{ iconId, domain, opacity }, ...],
     revisionId: hash(config),
     compositionVersion: "1.0.0",
     updatedAt: timestamp
   }
   ```

3. **What is "revision metadata"?**
   - Hash of config?
   - Version string?
   - Timestamp?

4. **How does composition relate to seed/asset library?**
   - Does changing composition require re-seed?
   - Or is composition orthogonal to seed?

**Assumption from spec:** Composition is **orthogonal to seed.**
- Seed = which symbol to generate
- Composition = how to layer multiple symbols

**Recommendation:** Expand SPEC-ICON-BOUNDARIES or state explicitly:
```
Composition state is separate from seed/color state.
Changing composition does NOT require regenerate.
Revisionid = hash(compositionMode + layers)
Preview shows composed result.
Export includes both seed artifacts AND composed artifact.
```

---

## 3. Phase Y+ Issues (Asset Integration)

### 3.1 "Seed Lineage in Library Metadata" is Confusing
**The plan says:**
```
Define how state-machine outputs are consumed by asset library 
indexing/batch export.
Ensure seed lineage and composition revision are preserved in 
library metadata.
```

**Problem:** Asset library is **game-icons.net SVG thumbnails.** There's no seed in those.

**Possible interpretations:**
1. **Interpretation A:** When user selects an asset + applies composition
   - SVG export includes metadata about which asset + composition
   - Later import reads this metadata
   - "seed lineage preserved" means: asset ID chain preserved

2. **Interpretation B:** When user exports a symbol to asset library
   - If symbol was procedurally generated (has seed), export the seed
   - If symbol is asset-based, export the asset ID
   - Library stores both types

3. **Interpretation C:** Some symbols will have procedural variants
   - Base symbol = asset library pick
   - Variant = procedurally generated from base + seed
   - Preserve seed lineage through variant generation

**Recommendation:** Clarify what "seed lineage in library metadata" means:
```
Phase Y+ Asset Library Integration:
  When exporting symbol to library:
    If procedurally generated: include full seedHistory
    If asset-based: include assetId
    Always include: compositionRevisionId
    Always include: faction metadata

  When importing from library:
    Preserve original seedHistory/assetId
    Preserve compositionRevisionId
    Do NOT lose ownership information
```

### 3.2 C25-C32 Might Require More Than 18h
**C25-C32 tests are:**
```
C25: Asset export stores seedRevision + full seedHistory
C26: Asset export stores composition.revisionId + compositionVersion
C27: Batch export of N variants preserves selected variant identity
C28: Re-import from asset library round-trips state without drift
C29: Asset index uniqueness uses stable key
C30: Schema mismatch in asset ingest yields explicit error
C31: Mixed-owner colors survive asset save/load
C32: Deterministic regeneration from asset record
```

**These are integration tests**, not unit tests. They require:
- Asset pipeline orchestration (new)
- Batch export logic (new)
- Import round-trip validation (new)
- Index uniqueness verification (new)
- Schema migration for asset context (new)

**18h might cover:**
- Asset pipeline hookup: 10h
- New tests C25-C32: 8h

**But Phase Y+ also references:**
```
Ensure seed lineage and composition revision are preserved in 
library metadata.
```

This implies writing asset metadata storage/retrieval logic, which isn't in the 10h + 8h = 18h.

**Recommendation:** Expand Phase Y+ estimate:
```
Phase Y+ (Asset Library Integration): 25-30h
  Phase Y.1: Asset pipeline (define output formats): 8h
  Phase Y.2: Batch export + metadata storage: 6h
  Phase Y.3: Import + round-trip validation: 6h
  Phase Y.4: Extension tests C25-C32: 8h
  Phase Y.5: Index uniqueness + stability: 4h
```

---

## 4. Implementation Rules (Good, Minor Refinement)

✅ **Rules are sound:**
```
Determinism fixtures created only in Phase 2 after freeze ✓
Legacy import migration is Phase 2 only ✓
No hidden composition side-effects; explicit state ✓
No dark-mode authority in MVP ✓
New actions require new test row ✓
```

**Recommend adding:**
```
No breaking schema changes in Phase 1-2 (Phase Y+ can define v1.1.0)
All acceptance tests must be CI-gated (no manual-only tests)
Refactoring must not change observable output (use snapshot testing)
```

---

## 5. Outstanding Clarifications Needed

Before starting Phase 1, clarify:

| Item | Phase 1 or 2? | Scope | Impact |
|------|---|---|---|
| **C21-C22 deterministic tests** | Phase 2 | After code freeze | 4h |
| **C23 import validation** | Phase 2 | Legacy handling | 2h |
| **C24 preset locks** | Phase 1 | Color reducer | 1h |
| **Import validation** | Phase 1 or 2 | Export only? Full import? | 5-10h |
| **Composition definition** | Doc clarification | What is composition? | 0h |
| **Phase Y+ scope** | Expand to 25-30h | Asset pipeline complete | +7-12h |

---

## 6. Revised Estimate (With Clarifications)

**If clarifications go as suggested:**

| Phase | Original | Clarified | Delta |
|-------|----------|-----------|-------|
| Phase 1 | 78h | 80-85h | +2-7h (C24 in Phase 1, import deferred) |
| Phase 2 | 34h | 38-42h | +4-8h (C21-C23 added, expanded import) |
| Phase Y+ | 18h | 25-30h | +7-12h (asset pipeline complete) |
| **TOTAL** | **130h** | **143-157h** | **+13-27h** |

**Impact on timeline:**
- 1 dev: 4 weeks → 4.5-5 weeks
- 2 devs: 2.5 weeks → 3-3.5 weeks

Still reasonable. No deal-breaker.

---

## 7. Recommendations for Execution

### Before Phase 1 Starts
1. ✅ Define C1-C24 in executable test format (code skeletons)
2. ✅ Clarify timing of C21-C24 (which phase)
3. ✅ Clarify scope of export vs. import validation in Phase 1
4. ✅ Expand SPEC-ICON-BOUNDARIES or add doc on "Composition" definition
5. ✅ Revise Phase Y+ estimate to 25-30h with breakdown

### During Phase 1
- Weekly: Check if color reducer (18h) stays on track or needs adjustment
- Weekly: Verify UI contract (16h) isn't ballooning
- End of Phase 1: Acceptance gate C1-C20 + code freeze

### Phase 2
- Lock determinism fixtures right at start
- Implement legacy migration only if Phase 1 exports exist
- Add C21-C24 tests as final acceptance gate

### Phase Y+ (Asset Library)
- Assume Phase 1-2 fully complete
- Start with asset pipeline protocol (what gets exported/imported)
- Implement C25-C32 as integration tests, not unit tests

---

## Summary

| Aspect | Rating | Status |
|--------|--------|--------|
| **Phase separation** | ⭐⭐⭐⭐⭐ | Excellent |
| **Effort estimates** | ⭐⭐⭐⭐ | Good, some tight (16h UI, 18h color) |
| **Timeline clarity** | ⭐⭐⭐⭐ | Good (130h = 4 weeks credible) |
| **Acceptance matrix** | ⭐⭐⭐⭐⭐ | Excellent (C1-C32 defined) |
| **Test timing clarity** | ⭐⭐⭐ | Ambiguous (C21-C24 phase unclear) |
| **Scope clarity** | ⭐⭐⭐ | Partial (composition, asset metadata need docs) |
| **Phase Y+ scope** | ⭐⭐⭐ | Underestimated (18h → 25-30h) |
| **Ready to execute** | ⭐⭐⭐⭐ | Yes, with above clarifications |

**Verdict:** **This is a solid, executable plan.** Implement with the clarifications above, and you have a realistic 4-week (1 dev) or 2.5-3 week (2 devs) path to Phase 1 completion.
