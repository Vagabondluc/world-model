# 🔒 UI/AI REASON CODE REGISTRY v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`]
- `Owns`: [`UiAiReasonCodeV1`, `UiAiReasonCodeEntry`]
- `Writes`: `[]`
- `Baseline`: `v1-implementation` (`LockedOn: 2026-02-12`)

---
## 🔒 Implementation Baseline Lock
This file is frozen as part of the **v1 implementation baseline**.

Lock rules:
1. No semantic changes without explicit version bump (`v2+`).
2. Additive clarifications are allowed only if they do not change behavior.
3. Any non-additive change requires updating baseline status in project reports.

---

## 0️⃣ Purpose
Provide stable numeric reason codes for:
- UI command preview/commit
- revision conflicts
- deterministic decision explain traces

These codes are append-only and must not be repurposed.

## 1️⃣ Registry Types

```ts
type UiAiReasonCodeV1 = uint32

interface UiAiReasonCodeEntry {
  code: UiAiReasonCodeV1
  key: string
  category: "preview" | "commit" | "conflict" | "decision" | "diagnostic"
  message: string
}
```

## 2️⃣ Locked Ranges
- `610000-610099`: preview lifecycle
- `610100-610199`: commit lifecycle
- `610200-610299`: revision/conflict lifecycle
- `610300-610399`: decision/utility lifecycle
- `610400-610499`: UI diagnostics

## 3️⃣ Canonical Codes (v1)

### Preview
- `610001` `PREVIEW_REQUIRED`
- `610002` `PREVIEW_GENERATED`
- `610003` `PREVIEW_STALE_REVISION`

### Commit
- `610101` `COMMIT_ACCEPTED`
- `610102` `COMMIT_REJECTED_VALIDATION`
- `610103` `COMMIT_REJECTED_CANON_LOCK`
- `610104` `COMMIT_REJECTED_MISSING_CHECKPOINT`

### Conflict
- `610201` `REVISION_CONFLICT_DETECTED`
- `610202` `REVISION_CONFLICT_FORK_REQUIRED`
- `610203` `REVISION_CONFLICT_REJECTED`

### Decision/Utility
- `610301` `UTILITY_SCORE_CLAMPED`
- `610302` `UTILITY_INPUT_INVALID`
- `610303` `UTILITY_TIEBREAKER_HASH_USED`
- `610304` `ACTION_SELECTED`

### Diagnostic
- `610401` `UNIT_POLICY_VIOLATION`
- `610402` `FORECAST_PROVENANCE_MISSING`
- `610403` `HIGH_IMPACT_PREVIEW_BYPASS_BLOCKED`

## 4️⃣ Rules
1. UI and AI contracts must return numeric codes, not free-text keys.
2. Text messages are localization/display-only; code is authoritative.
3. New codes may be appended; existing codes are immutable.
