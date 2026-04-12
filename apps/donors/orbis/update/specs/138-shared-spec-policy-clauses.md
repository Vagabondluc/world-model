# 🔒 SHARED SPEC POLICY CLAUSES v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`, `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`]
- `Owns`: [`SharedUnitPolicyClauseV1`, `SharedReasonCodeIntegrationClauseV1`, `SharedComplianceVectorMinimumV1`]
- `Writes`: `[]`

## Purpose
Provide canonical reusable clause text for unit policy, reason-code integration, and minimum compliance-vector structure so contract specs do not drift by copy-paste.

## SharedUnitPolicyClauseV1
Use this exact clause text in contract specs:

`See shared policy in docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md (SharedUnitPolicyClauseV1); numeric authority follows docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md.`

## SharedReasonCodeIntegrationClauseV1
Use this exact clause text in contract specs:

`See shared policy in docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md (SharedReasonCodeIntegrationClauseV1); reason-code authority follows docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md.`

## SharedComplianceVectorMinimumV1
Minimum required shape for `## Compliance Vector (v1)`:
- Input:
  - deterministic fixture input under canonical bounds
- Expected:
  - deterministic output for identical input and evaluation order
  - no out-of-range values
  - reason-code behavior defined when non-`ok` or threshold pathways exist

## Compliance Vector (v1)
Input:
- one contract spec references this file for unit and reason-code clauses.

Expected:
- referenced clause text is canonical and unchanged across consuming specs.
- compliance vector structure remains deterministic and bounded.

## Promotion Notes
- No predecessor; new canonical contract utility anchor.

