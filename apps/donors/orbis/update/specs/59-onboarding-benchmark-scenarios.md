# Benchmark Scenarios Panel Onboarding Guide

## Overview

The Benchmark Scenarios Panel provides standardized test scenarios for validating simulation performance and accuracy. It helps you understand how your world performs under controlled conditions and ensures consistent behavior across different simulation configurations.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what benchmark scenarios are and why they're used
- Learn to run basic benchmark tests
- Read scenario pass/fail results
- Identify when simulation performance is good or bad

### 🟡 Intermediate (Ages 16-18)
- Understand regression differences between builds
- Use the last passing build as a reference point
- Interpret detailed benchmark results
- Mark release gates for quality control

### 🔴 Advanced (Ages 19-99)
- Master the benchmark scenario system
- Create custom benchmark scenarios
- Understand performance profiling and optimization
- Use benchmark data for simulation validation

---

## Step-by-Step Walkthrough

### Step 1: Opening Benchmark Scenarios Panel

1. From the main dashboard, click on **Benchmark Scenarios Panel** in the navigation menu
2. The panel will load with benchmark options
3. You'll see three main sections:
   - **Scenario Library** (left): Available test scenarios
   - **Execution Results** (center): Pass/fail status and details
   - **Comparison Tools** (right): Build comparisons and gates

### Step 2: Understanding Benchmark Scenarios

**🟢 Beginner:**

Scenarios test different aspects of the simulation:

| Scenario Type | What it Tests | Example |
|---------------|----------------|---------|
| Performance | How fast simulation runs | "10,000 tick speed test" |
| Stability | Long-term behavior | "1,000 year stability test" |
| Stress | Extreme conditions | "Maximum population stress test" |
| Accuracy | Correctness of results | "Scientific validation suite" |

**🟡 Intermediate:**

Scenario characteristics:
- **Test Duration**: How long the scenario runs
- **Resource Usage**: CPU and memory consumption
- **Success Criteria**: What determines pass/fail status
- **Expected Results**: Baseline values for comparison
- **Complexity Level**: Difficulty of the test

**🔴 Advanced:**

Scenario system uses:
```ts
interface BenchmarkScenarioStatusSnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Running Benchmark Tests

**🟢 Beginner:**

Execute a benchmark test:
1. Select a scenario from the library
2. Click **"Run Benchmark Pack"**
3. Wait for the test to complete
4. Check the pass/fail result
5. Review any performance metrics shown

**🟡 Intermediate:**

Execution details include:
- **Performance Metrics**: Ticks per second, memory usage
- **Regression Analysis**: Comparison with previous builds
- **Statistical Significance**: Whether differences matter
- **Confidence Intervals**: Uncertainty in measurements
- **Resource Profiles**: System usage over time

**🔴 Advanced:**

Execution system uses:
- Precise timing measurements
- Resource usage tracking
- Statistical analysis of results
- Regression detection algorithms
- Performance profiling tools

### Step 4: Analyzing Regression Differences

**🟢 Beginner:**

Compare with previous results:
1. Look at the "Regression Diffs" section
2. Find changes from the last passing build
3. See if performance got better or worse
4. Note any new failures that appeared
5. Understand what the changes mean

**🟡 Intermediate:**

Regression analysis features:
- **Performance Changes**: Speed improvements or degradations
- **Accuracy Differences**: Result correctness variations
- **Stability Variations**: Long-term behavior changes
- **Resource Impact**: Efficiency changes
- **Quality Metrics**: Overall improvement indicators

**🔴 Advanced:**

Regression detection uses:
- Statistical comparison algorithms
- Significance testing
- Trend analysis over multiple builds
- Performance impact modeling
- Quality assessment frameworks

### Step 5: Using Release Gates

**🟢 Beginner:**

Control quality with gates:
1. Look at the "Last Passing Build" marker
2. Check if current build meets criteria
3. Use **"Mark Release Gate"** to approve
4. Block releases that don't meet standards
5. Document gate decisions

**🟡 Intermediate:**

Gate management includes:
- **Gate Criteria**: Specific requirements for release
- **Automated Checks**: Validations that run automatically
- **Manual Reviews**: Human verification steps
- **Gate History**: Record of past decisions
- **Rollback Options**: What to do if gates fail

**🔴 Advanced:**

Gate system uses:
- Quality assurance frameworks
- Automated testing pipelines
- Review and approval processes
- Release management workflows
- Rollback and recovery procedures

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Benchmark Scenario** - Standardized test for simulation validation
2. **Pass/Fail Result** - Whether a test meets its success criteria
3. **Regression** - When a new version performs worse than a previous one
4. **Release Gate** - Quality checkpoint that must be passed for release

### 🟡 Intermediate Concepts

1. **Performance Metrics** - Measurements of simulation speed and efficiency
2. **Statistical Significance** - Whether performance differences are meaningful
3. **Regression Analysis** - Comparison of performance between versions
4. **Quality Assurance** - Processes that ensure simulation reliability

### 🔴 Advanced Concepts

1. **Performance Profiling** - Detailed analysis of simulation behavior
2. **Statistical Comparison** - Mathematical methods for comparing results
3. **Automated Testing Pipeline** - System that runs tests automatically
4. **Release Management** - Process of controlling when versions are released

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Benchmark Scenarios Panel and understand the interface
- [ ] I understand what benchmark scenarios are and why they're used
- [ ] I can run basic benchmark tests
- [ ] I can read scenario pass/fail results
- [ ] I know when simulation performance is good or bad

### 🟡 Intermediate Checkpoints

- [ ] I understand regression differences between builds
- [ ] I can use the last passing build as a reference point
- [ ] I can interpret detailed benchmark results
- [ ] I can mark release gates for quality control
- [ ] I understand statistical significance of performance changes

### 🔴 Advanced Checkpoints

- [ ] I understand the benchmark scenario system
- [ ] I can create custom benchmark scenarios
- [ ] I understand performance profiling and optimization
- [ ] I can use benchmark data for simulation validation
- [ ] I understand the technical implementation of the benchmark system

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

For technical details about Benchmark Scenarios Panel, see:
- [`docs/ui-ux/28-benchmark-scenarios-panel-spec.md`](./28-benchmark-scenarios-panel-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Run a Performance Benchmark

1. Open Benchmark Scenarios Panel
2. Select a performance test scenario
3. Run the benchmark and wait for completion
4. Review the ticks per second metric
5. Compare with previous results if available

### Task 2: Check for Regressions

1. Select the "Last Passing Build" as baseline
2. Run the same scenarios on current build
3. Look at the regression differences
4. Identify any performance degradations
5. Document findings for the team

### Task 3: Set a Release Gate

1. Define criteria for the next release
2. Configure automated checks
3. Run full benchmark suite
4. Review all results against criteria
5. Mark the gate as passed or failed

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with simple performance benchmarks
- Always compare with the last passing build
- Use regression diffs to spot problems quickly
- Don't release if any critical benchmarks fail

### 🟡 Intermediate Tips
- Monitor statistical significance, not just raw numbers
- Use automated gates to ensure consistency
- Keep detailed records of all benchmark results
- Profile resource usage to find optimization opportunities

### 🔴 Advanced Tips
- Create custom scenarios for your specific use cases
- Use statistical analysis for deep insights
- Integrate benchmarking into your development workflow
- Correlate performance changes with code modifications

---

## Troubleshooting

### Issue: Benchmark execution fails

**Solution:**
- Check if the scenario is compatible with your world
- Verify sufficient system resources are available
- Review error logs for specific failure reasons
- Try running a simpler scenario first

### Issue: Regression analysis shows no data

**Solution:**
- Ensure you have selected a baseline build
- Check if benchmark history is available
- Verify both builds ran the same scenarios
- Review data collection settings

### Issue: Release gate validation fails

**Solution:**
- Review gate criteria for correctness
- Check if all automated tests passed
- Verify manual review steps were completed
- Adjust criteria if they're too strict

---

## Next Steps

After mastering Benchmark Scenarios Panel, explore:
- [`57-onboarding-solver-validity.md`](./57-onboarding-solver-validity.md) - Solver Validity Monitor
- [`58-onboarding-determinism-replay.md`](./58-onboarding-determinism-replay.md) - Determinism & Replay Integrity
- [`60-onboarding-parameter-provenance.md`](./60-onboarding-parameter-provenance.md) - Parameter Provenance Explorer
- [`61-onboarding-tag-explorer.md`](./61-onboarding-tag-explorer.md) - Tag Explorer
- [`62-onboarding-world-compare.md`](./62-onboarding-world-compare.md) - World Compare (A/B)

---

## Glossary

| Term | Definition |
|------|------------|
| **Benchmark Scenario** | Standardized test for validating simulation performance |
| **Pass/Fail Result** | Whether a benchmark meets its predefined success criteria |
| **Regression** | When a new version performs worse than a previous version |
| **Release Gate** | Quality checkpoint that must be passed for a version to be released |
| **Performance Metrics** | Measurements of simulation speed and resource usage |
| **Statistical Significance** | Whether performance differences are meaningful or just random variation |
| **Regression Analysis** | Process of comparing performance between different versions |
| **Quality Assurance** | Systematic process of ensuring simulation reliability |
| **Performance Profiling** | Detailed analysis of simulation behavior and resource usage |
| **Automated Testing Pipeline** | System that automatically runs tests and validates results |
| **Release Management** | Process of controlling when and how versions are released |