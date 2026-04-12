# 060 - AI Pressure System TDD Plan (v2)

## Overview
This document outlines the test cases required to verify the [Semantic Pressure Ecosystem](../specs/060-ai-personality-system.md).
Target File: `logic/ai/__tests__/pressure.test.ts`

## 1. Tag Lifecycle Tests
**Goal**: Verify tags are created, persist, accumulate value, and expire correctly.

- [ ] **Creation**: Should create a `SemanticTag` from a template (e.g., `VENGEFUL`).
- [ ] **Intensity Initialization**: Should set initial intensity based on event magnitude.
- [ ] **Decay**: Should reduce intensity over time if `urgency` is low.
- [ ] **Growth**: Should increase intensity/urgency if the tag has `ESCALATING` property.
- [ ] **Satisfaction (Threshold)**: Should mark tag as `SATISFIED` when `accumulatedValue` >= `requirement`.
- [ ] **Satisfaction (Symbolic)**: Should satisfy symbolic tags via specific event triggers irrespective of value.
- [ ] **Obsolescence**: Should mark tag as `OBSOLETE` when `accumulatedLoss` > (`intensity` * `tolerance`).

## 2. Prioritization Engine Tests
**Goal**: Verify the AI correctly focuses on the most critical tags.

- [ ] **Formula**: Verify `Priority = Intensity * Urgency * ScopeModifier`.
- [ ] **Filtering**: Should return only the top N tags.
- [ ] **Cultural Bias**: Should adjust priority based on `familyWeights` (e.g., Warlord prioritizes `GRUDGE` over `SHAME`).
- [ ] **Stability (Momentum)**: Should bias priority towards tags present in the previous frame to prevent "flickering" strategies.

## 3. Store Selection Tests
**Goal**: Verify the AI picks the right strategy to solve the problem.

- [ ] **Filtering**: Should only consider Stores that reduce the active Tag families.
- [ ] **Cost Check**: Should reject Stores the AI cannot afford (resources or political capital).
- [ ] **Risk Tolerance**: 
    -   Stable AI (Low Urgency) REJECTS High Risk stores.
    -   Desperate AI (High Urgency) ACCEPTS High Risk stores.
- [ ] **Scoring**: Should rank Stores based on Effectiveness, Cost, Culture, and Risk.
- [ ] **Fallback**: Should default to "Wait/Observe" if no valid Store is found.

## 4. Obsolescence & Learning (Memory) Tests
**Goal**: Verify "Give Up" logic and subsequent behavioral changes.

- [ ] **Cost Accumulation**: Should track costs incurred by executing Stores.
- [ ] **Trigger**: Should trigger obsolescence when costs exceed threshold.
- [ ] **Memory Creation**: Should convert obsolete Tag into a `Memory` record.
- [ ] **Behavioral Aversion (The Learning Test)**: 
    -   Verify that after `VENGEFUL` becomes `OBSOLETE` due to failed Military Raids...
    -   ...the AI significantly penalizes **Military Stores** for future `VENGEFUL` tags against that target.
    -   (i.e., "We learned war doesn't work against them.")

## 5. Serialization Tests
**Goal**: Verify save/load stability.

- [ ] **Round Trip**: `toJSON` -> `fromJSON` should restore exact Tag state (id, intensity, accumulatedLoss).
- [ ] **Reference Integrity**: Should reconnect Source Entity IDs correctly.

## 6. Integration Scenarios (The strict "User Stories")

- [ ] **Scenario: The Failed War**:
    1.  Create `VENGEFUL` tag.
    2.  Execute `MILITARY_RAID` store (Cost 100).
    3.  Raid fails (add Cost 100, no Tag reduction).
    4.  Repeat until Cost > Tolerance.
    5.  Verify Tag becomes `OBSOLETE`.

- [ ] **Scenario: The Cultural Victory**:
    1.  Create `SHAME` tag (Uncultured).
    2.  Civ is "Theocrat" (High Symbolism pref).
    3.  Verify AI prefers `BUILD_MONUMENT` store over `MILITARY_PARADE`.
    4.  Verify Tag satisfaction.

## 7. Emergent Complexity Tests (The "Drama" Engine)
**Goal**: Verify how tags conflict and interact under pressure.

- [ ] **Resource Starvation**: Ensure Low Priority tags (e.g. `AMBITION`) are **starved** (skipped) if High Priority tags (e.g. `FEAR`) consume all resources.
- [ ] **Desperation Curve**: Verify AI switches from Safe Stores (Sanctions) to Risky Stores (Terror/War) as Tag Urgency scales up.
- [ ] **Memory Bias**: Verify that an `OBSOLETE` tag specifically penalizes the *Store Type* that failed (e.g. failed Raid -> hates Raids), not just the goal.
