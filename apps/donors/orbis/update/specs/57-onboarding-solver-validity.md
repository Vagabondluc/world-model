# Solver Validity Monitor Onboarding Guide

## Overview

The Solver Validity Monitor provides a focused view of solver health and validity across all simulation domains. It helps you identify when solvers are failing, why they're failing, and what impacts these failures have on your world simulation.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what Solver Validity Monitor shows
- Learn to read validity counters and health bars
- Identify when solvers are having problems
- Navigate to specific domains to investigate issues

### 🟡 Intermediate (Ages 16-18)
- Understand domain health indicators and confidence levels
- Use the first-failure trace to diagnose problems
- Interpret deterministic drill-down tables
- Export validity reports for analysis

### 🔴 Advanced (Ages 19-99)
- Master the solver validity system architecture
- Understand the relationship between solver failures and world stability
- Use validity monitoring for advanced debugging
- Integrate validity data with other diagnostic tools

---

## Step-by-Step Walkthrough

### Step 1: Opening Solver Validity Monitor

1. From the main dashboard, click on **Solver Validity Monitor** in the navigation menu
2. The monitor will load with solver health information
3. You'll see three main sections:
   - **Validity Counters** (top): Overall solver status
   - **Domain Health Bars** (middle): Health indicators by domain
   - **Failure Analysis** (bottom): Detailed failure information

### Step 2: Reading Validity Counters

**🟢 Beginner:**

The counters show solver status at a glance:

| Counter | What it Shows | Normal Range |
|----------|------------------|--------------|
| Total Solvers | How many solvers exist | Varies by world |
| Valid Solvers | How many are working correctly | Should be most of them |
| Failed Solvers | How many have problems | Should be 0 or low |
| Warnings | How many have minor issues | Depends on complexity |

**🟡 Intermediate:**

Counter details include:
- **Success Rate**: Percentage of solvers working correctly
- **Failure Trends**: How failures are changing over time
- **Critical Failures**: Solvers that must work for simulation to continue
- **Recovery Status**: How failed solvers are recovering
- **Impact Assessment**: What failures mean for the world

**🔴 Advanced:**

Counter system uses:
```ts
interface SolverValiditySnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Understanding Domain Health Bars

**🟢 Beginner:**

Health bars show how each domain is doing:

| Domain | What it Monitors | Good Color | Warning Color | Bad Color |
|---------|-------------------|-------------|--------------|------------|
| Climate | Weather and atmosphere | Green | Yellow | Red |
| Biology | Species and ecosystems | Green | Yellow | Red |
| Civilization | Settlements and factions | Green | Yellow | Red |
| Geology | Terrain and resources | Green | Yellow | Red |
| Hydrology | Water and oceans | Green | Yellow | Red |

**🟡 Intermediate:**

Health bar details:
- **Health Percentage**: Numerical health value (0-100%)
- **Confidence Level**: How certain we are about the health reading
- **Trend Indicator**: If health is improving or declining
- **Dependency Mapping**: How domain health affects others
- **Recovery Projections**: When health might improve

**🔴 Advanced:**

Health calculation uses:
- Multi-factor health assessment
- Historical trend analysis
- Cross-domain dependency mapping
- Confidence interval calculations
- Predictive modeling for recovery

### Step 4: Using the First-Failure Trace

**🟢 Beginner:**

Find the source of problems:
1. Look at the "First-Failure Trace" section
2. Find the first solver that failed
3. Read what error occurred
4. See when the failure started
5. Follow the suggested next steps

**🟡 Intermediate:**

Failure trace features:
- **Failure Cascade**: How one failure caused others
- **Root Cause Analysis**: Why the failure occurred
- **Impact Propagation**: How the failure spread
- **Recovery Path**: Steps to fix the failure
- **Prevention Measures**: How to avoid similar failures

**🔴 Advanced:**

Trace analysis uses:
- Causal chain analysis
- Dependency graph traversal
- Impact radius calculation
- Recovery time estimation
- Prevention strategy generation

### Step 5: Using the Drill-Down Table

**🟢 Beginner:**

Get detailed information:
1. Click on any domain health bar
2. Look at the drill-down table
3. Read the detailed explanations
4. Use this information to understand problems

**🟡 Intermediate:**

Drill-down features:
- **Factor Breakdown**: What contributes to health values
- **Historical Data**: Past health and failure patterns
- **Solver Metrics**: Performance indicators for each solver
- **Error Classification**: Types and frequencies of errors
- **Recovery Tracking**: How problems are being resolved

**🔴 Advanced:**

Drill-down system uses:
- Deterministic data analysis
- Multi-layer information architecture
- Source tracking and provenance
- Confidence interval calculations
- Cross-reference validation

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Solver Validity Monitor** - Tool for checking solver health
2. **Validity Counter** - Numbers showing how many solvers are working
3. **Domain Health Bar** - Visual indicator of each domain's status
4. **First-Failure Trace** - Record of the initial problem that caused failures

### 🟡 Intermediate Concepts

1. **Success Rate** - Percentage of solvers working correctly
2. **Confidence Level** - How certain we are about health readings
3. **Failure Cascade** - How one solver failure causes others to fail
4. **Root Cause Analysis** - Finding the fundamental reason for failures

### 🔴 Advanced Concepts

1. **Deterministic Analysis** - Same data always produces same health assessments
2. **Multi-Factor Health Assessment** - Considering many variables for health
3. **Dependency Graph Traversal** - Mapping how solvers depend on each other
4. **Recovery Time Estimation** - Predicting how long fixes will take

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Solver Validity Monitor and understand the interface
- [ ] I can read and interpret validity counters
- [ ] I understand what domain health bars show
- [ ] I can identify when solvers are having problems
- [ ] I know how to use the first-failure trace

### 🟡 Intermediate Checkpoints

- [ ] I understand domain health indicators and confidence levels
- [ ] I can use the first-failure trace to diagnose problems
- [ ] I can interpret deterministic drill-down tables
- [ ] I understand how failures cascade between domains
- [ ] I can export validity reports

### 🔴 Advanced Checkpoints

- [ ] I understand the solver validity system architecture
- [ ] I understand the relationship between solver failures and world stability
- [ ] I can use validity monitoring for advanced debugging
- [ ] I can integrate validity data with other diagnostic tools
- [ ] I understand the technical implementation of the monitoring system

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

For technical details about Solver Validity Monitor, see:
- [`docs/ui-ux/26-solver-validity-monitor-spec.md`](./26-solver-validity-monitor-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Check Overall Solver Health

1. Open Solver Validity Monitor
2. Look at the validity counters
3. Check if any solvers are failed
4. Review domain health bars
5. Investigate any domains showing problems

### Task 2: Diagnose a Solver Failure

1. Identify a failed solver from the counters
2. Use the first-failure trace to find the root cause
3. Check the drill-down table for detailed information
4. Look at the impact on other domains
5. Follow recommended recovery steps

### Task 3: Monitor Solver Recovery

1. After fixing a problem, watch the health bars
2. Monitor the validity counters for improvement
3. Check confidence levels as recovery progresses
4. Export validity reports for documentation
5. Verify all solvers return to normal operation

---

## Tips and Tricks

### 🟢 Beginner Tips
- Check validity counters first for overall status
- Pay attention to red health bars - they need immediate attention
- Use the first-failure trace to find where problems start
- Watch for cascading failures between domains

### 🟡 Intermediate Tips
- Monitor trends in success rates over time
- Use confidence levels to understand uncertainty
- Check dependency relationships between domains
- Export reports for long-term analysis

### 🔴 Advanced Tips
- Understand the deterministic nature of the monitoring system
- Use drill-down data for deep technical analysis
- Correlate solver failures with world events
- Integrate validity data with other diagnostic tools

---

## Troubleshooting

### Issue: Monitor shows "Loading..." indefinitely

**Solution:**
- Check if the solver system is initialized
- Verify world state is valid
- Try refreshing the monitor

### Issue: Validity counters seem incorrect

**Solution:**
- Check confidence level - low confidence means uncertainty
- Verify tick number is current
- Review underlying metrics in drill-down table

### Issue: Health bars not updating

**Solution:**
- Check if solver monitoring is active
- Verify data refresh rate
- Review error logs for update failures
- Try refreshing the monitor

---

## Next Steps

After mastering Solver Validity Monitor, explore:
- [`58-onboarding-determinism-replay.md`](./58-onboarding-determinism-replay.md) - Determinism & Replay Integrity
- [`59-onboarding-benchmark-scenarios.md`](./59-onboarding-benchmark-scenarios.md) - Benchmark Scenarios Panel
- [`60-onboarding-parameter-provenance.md`](./60-onboarding-parameter-provenance.md) - Parameter Provenance Explorer
- [`61-onboarding-tag-explorer.md`](./61-onboarding-tag-explorer.md) - Tag Explorer
- [`62-onboarding-world-compare.md`](./62-onboarding-world-compare.md) - World Compare (A/B)

---

## Glossary

| Term | Definition |
|------|------------|
| **Solver Validity Monitor** | Tool for checking the health and status of all simulation solvers |
| **Validity Counter** | Numerical display of how many solvers are working, failed, or warning |
| **Domain Health Bar** | Visual indicator showing the status of each simulation domain |
| **First-Failure Trace** | Record of the initial problem that triggered a cascade of failures |
| **Success Rate** | Percentage of solvers that are working correctly |
| **Confidence Level** | How certain we are about health and validity readings |
| **Failure Cascade** - When one solver failure causes other solvers to fail |
| **Root Cause Analysis** | Process of finding the fundamental reason for solver failures |
| **Deterministic Analysis** | Same data always produces the same health assessments |
| **Multi-Factor Health Assessment** | Evaluation using many different variables and indicators |
| **Dependency Graph Traversal** | Mapping how solvers depend on each other for proper operation |
| **Recovery Time Estimation** | Predicting how long it will take to fix solver problems |