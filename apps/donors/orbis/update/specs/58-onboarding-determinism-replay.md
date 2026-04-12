# Determinism & Replay Integrity Onboarding Guide

## Overview

The Determinism & Replay Integrity tool verifies that your world simulation produces consistent, reproducible results. It helps you understand why the same inputs might produce different outputs, and ensures the scientific validity of your simulations.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what determinism means for simulations
- Learn to read digest parity indicators
- Identify when replay results don't match
- Use basic replay integrity checks

### 🟡 Intermediate (Ages 16-18)
- Understand mismatch timelines and their causes
- Use replay confidence metrics effectively
- Export replay packets for analysis
- Rerun seed checks for validation

### 🔴 Advanced (Ages 19-99)
- Master the determinism validation system
- Understand the relationship between determinism and scientific validity
- Use replay integrity for advanced debugging
- Integrate determinism checks with other diagnostic tools

---

## Step-by-Step Walkthrough

### Step 1: Opening Determinism & Replay Integrity

1. From the main dashboard, click on **Determinism & Replay Integrity** in the navigation menu
2. The integrity checker will load with determinism information
3. You'll see three main sections:
   - **Digest Parity** (top): Overall consistency status
   - **Mismatch Timeline** (middle): History of inconsistencies
   - **Replay Confidence** (bottom): Reliability metrics

### Step 2: Understanding Digest Parity

**🟢 Beginner:**

Digest parity shows if your simulation is consistent:

| Status | Meaning | When to Expect |
|---------|-----------|----------------|
| ✅ Matched | Current state matches expected | Normal operation |
| ⚠️ Diverged | Small differences detected | Investigate soon |
| ❌ Mismatched | Major differences found | Immediate attention needed |

**🟡 Intermediate:**

Parity details include:
- **Parity Percentage**: How closely current matches expected (0-100%)
- **Divergence Type**: What kind of difference occurred
- **First Mismatch**: When the inconsistency first appeared
- **Impact Assessment**: What the mismatch means for the world
- **Recovery Options**: How to restore consistency

**🔴 Advanced:**

Parity system uses:
```ts
interface ReplayIntegritySnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Analyzing Mismatch Timelines

**🟢 Beginner:**

Find when problems started:
1. Look at the "Mismatch Timeline" section
2. Find the first marked inconsistency
3. Read what changed at that point
4. See how the problem progressed
5. Check if the problem is ongoing

**🟡 Intermediate:**

Timeline analysis features:
- **Chronological View**: Time-ordered list of mismatches
- **Severity Indicators**: How bad each mismatch was
- **Causal Chains**: How mismatches relate to each other
- **Recovery Points**: When consistency was restored
- **Pattern Recognition**: Repeating types of mismatches

**🔴 Advanced:**

Timeline analysis uses:
- Deterministic state comparison
- Causal relationship mapping
- Pattern recognition algorithms
- Impact propagation modeling
- Recovery path optimization

### Step 4: Using Replay Confidence Metrics

**🟢 Beginner:**

Check reliability:
1. Look at the "Replay Confidence" section
2. Find the confidence percentage
3. Check if confidence is high, medium, or low
4. Note any warnings about reliability
5. Understand what confidence means for your work

**🟡 Intermediate:**

Confidence metrics include:
- **Confidence Level**: Overall reliability rating (0-100%)
- **Uncertainty Range**: Margin of error in measurements
- **Trend Analysis**: Whether confidence is improving or declining
- **Domain Breakdown**: Confidence by simulation domain
- **Statistical Significance**: Whether differences are meaningful

**🔴 Advanced:**

Confidence calculation uses:
- Statistical variance analysis
- Confidence interval mathematics
- Significance testing
- Domain-specific reliability modeling
- Historical trend analysis

### Step 5: Exporting Replay Packets

**🟢 Beginner:**

Save integrity information:
1. Click **"Export Replay Packet"**
2. Choose what to include in the export
3. Select a location to save the file
4. Wait for the export to complete
5. Use the packet for documentation or sharing

**🟡 Intermediate:**

Export options include:
- **Complete History**: All mismatches and recoveries
- **Summary Only**: Just the key findings
- **Domain Specific**: Focus on particular simulation areas
- **Statistical Data**: Raw numbers for analysis
- **Visualization Ready**: Formatted for charts and graphs

**🔴 Advanced:**

Export system uses:
- Structured data formatting
- Metadata preservation
- Compression for large datasets
- Version tracking
- Cross-platform compatibility

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Determinism** - Same inputs always produce same outputs
2. **Replay Integrity** - Consistency of simulation results over time
3. **Digest Parity** - Whether current state matches expected state
4. **Mismatch Timeline** - History of when and how results differed

### 🟡 Intermediate Concepts

1. **Parity Percentage** - Numerical measure of consistency (0-100%)
2. **Confidence Level** - How certain we are about simulation consistency
3. **Causal Chain** - How one inconsistency leads to another
4. **Statistical Significance** - Whether differences are meaningful or random

### 🔴 Advanced Concepts

1. **Deterministic State Comparison** - Technical process of checking consistency
2. **Confidence Interval Mathematics** - Statistical methods for measuring uncertainty
3. **Pattern Recognition** - Identifying recurring types of inconsistencies
4. **Recovery Path Optimization** - Finding the best way to restore consistency

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Determinism & Replay Integrity and understand the interface
- [ ] I understand what determinism means for simulations
- [ ] I can read and interpret digest parity indicators
- [ ] I can identify when replay results don't match
- [ ] I know how to use basic replay integrity checks

### 🟡 Intermediate Checkpoints

- [ ] I understand mismatch timelines and their causes
- [ ] I can use replay confidence metrics effectively
- [ ] I can export replay packets for analysis
- [ ] I can rerun seed checks for validation
- [ ] I understand statistical significance of differences

### 🔴 Advanced Checkpoints

- [ ] I understand the determinism validation system
- [ ] I understand the relationship between determinism and scientific validity
- [ ] I can use replay integrity for advanced debugging
- [ ] I can integrate determinism checks with other diagnostic tools
- [ ] I understand the technical implementation of the integrity system

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview

### Dashboard Onboarding
- [`docs/onboard/11-inspector-panel.md`](../onboard/11-inspector-panel.md) - Inspector Panel
- [`docs/onboard/12-advanced-features.md`](../onboard/12-advanced-features.md) - Advanced Features

### Diagrams
- [`docs/onboard/diagrams/`](../onboard/diagrams/) - Various technical and system diagrams

---

## Reference to UI/UX Spec

For technical details about Determinism & Replay Integrity, see:
- [`docs/ui-ux/27-determinism-replay-integrity-spec.md`](./27-determinism-replay-integrity-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Check Simulation Consistency

1. Open Determinism & Replay Integrity
2. Look at the digest parity status
3. Check if the simulation is consistent
4. Investigate any mismatches found
5. Review confidence levels for reliability

### Task 2: Investigate a Mismatch

1. Find a mismatch in the timeline
2. Use the drill-down table for details
3. Identify the root cause of the inconsistency
4. Check how the mismatch affected other parts of the simulation
5. Determine if recovery is needed

### Task 3: Validate with Seed Rerun

1. Note the current world state
2. Use "Rerun Seed Check" to repeat the simulation
3. Compare the new results with original
4. Verify if the inconsistency is reproducible
5. Document findings for future reference

---

## Tips and Tricks

### 🟢 Beginner Tips
- Always check digest parity first for overall status
- Pay attention to confidence levels - low confidence means uncertainty
- Use the timeline to find when problems first appeared
- Export replay packets before making major changes

### 🟡 Intermediate Tips
- Monitor parity percentages over time for trends
- Use statistical significance to understand if differences matter
- Check causal chains to find root causes
- Correlate mismatches with world events

### 🔴 Advanced Tips
- Understand the deterministic nature of the validation system
- Use confidence intervals for precise uncertainty measurement
- Apply statistical analysis for deep insights
- Integrate integrity data with other diagnostic tools

---

## Troubleshooting

### Issue: Integrity check shows "Loading..." indefinitely

**Solution:**
- Check if the determinism system is initialized
- Verify world state is valid
- Try refreshing the integrity checker

### Issue: Parity percentage seems incorrect

**Solution:**
- Check confidence level - low confidence means uncertainty
- Verify tick number is current
- Review underlying calculations in drill-down table

### Issue: Timeline shows no data

**Solution:**
- Check if enough simulation history exists
- Verify data collection is active
- Try running a simulation to generate history
- Review error logs for collection issues

---

## Next Steps

After mastering Determinism & Replay Integrity, explore:
- [`57-onboarding-solver-validity.md`](./57-onboarding-solver-validity.md) - Solver Validity Monitor
- [`59-onboarding-benchmark-scenarios.md`](./59-onboarding-benchmark-scenarios.md) - Benchmark Scenarios Panel
- [`60-onboarding-parameter-provenance.md`](./60-onboarding-parameter-provenance.md) - Parameter Provenance Explorer
- [`61-onboarding-tag-explorer.md`](./61-onboarding-tag-explorer.md) - Tag Explorer
- [`62-onboarding-world-compare.md`](./62-onboarding-world-compare.md) - World Compare (A/B)

---

## Glossary

| Term | Definition |
|------|------------|
| **Determinism** | Property that same inputs always produce same outputs |
| **Replay Integrity** | Consistency of simulation results when repeated |
| **Digest Parity** | Whether current simulation state matches expected state |
| **Mismatch Timeline** | Chronological record of simulation inconsistencies |
| **Parity Percentage** | Numerical measure of consistency (0-100%) |
| **Confidence Level** | How certain we are about simulation consistency |
| **Causal Chain** | Sequence where one inconsistency causes another |
| **Statistical Significance** | Whether differences are meaningful or just random variation |
| **Deterministic State Comparison** | Technical process of checking simulation consistency |
| **Confidence Interval** | Mathematical range of uncertainty in measurements |
| **Pattern Recognition** | Identifying recurring types of inconsistencies |
| **Recovery Path** | Steps needed to restore simulation consistency |
| **Seed Rerun** | Repeating simulation with same starting conditions |