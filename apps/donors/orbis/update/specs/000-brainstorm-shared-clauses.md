# 000 Brainstorm Shared Clauses

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`shared unit policy clause`, `shared reason-code clause`, `shared dependency baseline`]
- `Writes`: [`reusable authoring clauses for brainstorm specs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/000-brainstorm-shared-clauses.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Provide reusable, DRY clause text for brainstorm contracts so repeated policy language stays consistent.

## Shared Unit Policy Clause
- Numeric fields should use canonical units from `docs/brainstorm/113-canonical-key-registry.md`.
- Prefer explicit suffixes in names (`PPM`, `cm`, `mK`, `ticks`).

## Shared Reason-Code Clause
- Failure, threshold, and conflict outcomes should map to stable reason codes in `docs/brainstorm/114-threshold-and-reasoncode-registry.md`.

## Shared Dependency Baseline
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]

## Usage Rule
- Reuse these clauses by reference in brainstorm files; only add file-specific deltas locally.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
