# 🔒 86: Information Narrative Engine (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `RealPPM` ([`Spec 80`](./80-impact-propagation-engine.md)): Objective ground truth.
    - `InfoSource` ([`Registry 02`](./02-registry-reason-codes.md)): Media/Auth credibility data.
- **Outputs**:
    - `PerceivedPPM`: The value used by NPC agents for decision utility.
    - `TruthDiscoveryEvent`: Triggered when misinformation is exposed.
- **Parameters**:
    - `TRUST_DECAY`: -5,000 PPM per tick.

## 2. Mathematical Kernels

### 2.1 Perception Update Rule
The "Simulated Public" updates their belief based on exposure and source credibility.
```text
PerceivedNext = PerceivedPrev + mulPPM(ClaimDelta, CredibilityPPM) - CorrectionPPM
```

### 2.2 Truth Discovery (The Correction)
Discovery triggers if the gap between real and perceived reality becomes too violent.
```text
Gap = abs(RealPPM - PerceivedPPM)
if (Gap > (TrustPPM + CredibilityPPM) / 2):
  Trigger Correction (Perception snaps back 50%)
```

## 3. Determinism & Flow
- **Evaluation Order**: Step 6 of the `CivTick` sequence.
- **Audience Stability**: Perceptions are stored per `FactionId`. Unorganized public uses the `StateAverage`.
- **Tie-Breaking**: If multiple sources claim conflicting deltas, the one with highest `CredibilityPPM` wins.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `NARRATIVE_TRACE`
- **Primary Drivers**:
    - `MEDIA_DISTORTION`: The impact of low-credibility high-reach sources.
    - `TRUTH_COLLAPSE`: When divergence causes a total breakdown in trust.

## 5. Failure Modes & Bounds
- **Saturated Result**: If `DivergencePPM > 800,000`, the civilization enters a `PostTruth` state (StabilityNeed set to max).
- **Invalid Source**: Emit `ERR_AUTH_VIOLATION` if a source without a registered `NamespaceId` attempts a claim.

## Hardening Addendum (2026-02-12)
- `SpecTier`: `Brainstorm Draft`
- `Status`: `Promotion Candidate after canonical header rewrite`
- `CanonicalizationTarget`: `docs/specs/* (TBD)`
- `DeterminismNote`: `Use fixed-point/PPM conventions from runtime determinism canon before promotion.`

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm draft.

Expected:
- deterministic output for identical inputs and evaluation order.
- explicit tie-break and clamp behavior is documented before promotion.
