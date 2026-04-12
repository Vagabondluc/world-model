# Edit Propagation Policy (v1)

## Purpose
Define how local derived edits are persisted and optionally promoted to authoritative state.

## Core Rule
No automatic propagation from derived levels (L6-L8) to authoritative levels (L0-L5).

## Lifecycle States
- `ephemeral`
- `persistent_local`
- `candidate_authority`
- `accepted_authority`

## Workflow
1. Capture local edit as delta.
2. Validate against policy constraints.
3. Store as `persistent_local` or mark `candidate_authority`.
4. Review/approve candidate.
5. Apply authority patch at L5 if approved.
6. Re-bake semantic textures and invalidate dependent caches.

## Validation Gates
- Bounds and units are valid.
- Change budget is within allowed threshold.
- No invalid seam impact on neighbor borders.
- Deterministic replay of resulting bake succeeds.

## Conflict Resolution
- If local deltas conflict with accepted authority update:
  - keep authority as source of truth
  - rebase or discard conflicting local deltas
  - record resolution event in audit log

## Audit Requirements
Every promoted change must log:
- actor
- timestamp
- affected hex IDs
- policy decision
- deterministic test status
