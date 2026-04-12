# World Compare (A/B) Onboarding Guide

## Overview

The World Compare (A/B) tool allows you to compare two different world states side-by-side, analyze their differences, and make informed decisions about which version to keep. It's essential for understanding how changes affect your world and for validating simulation modifications.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what World Compare (A/B) does and when to use it
- Learn to select and compare different world states
- Read side-by-side deltas and understand differences
- Use basic comparison and overlay features

### 🟡 Intermediate (Ages 16-18)
- Use the map diff slider effectively
- Understand commit recommendations and branch choices
- Export comparison results for documentation
- Apply overlays to visualize specific changes

### 🔴 Advanced (Ages 19-99)
- Master the world comparison system architecture
- Use comparison data for advanced analysis
- Understand statistical significance of world differences
- Integrate comparison results with other diagnostic tools

---

## Step-by-Step Walkthrough

### Step 1: Opening World Compare (A/B)

1. From the main dashboard, click on **World Compare (A/B)** in the navigation menu
2. The compare tool will load with world selection interface
3. You'll see three main sections:
   - **World Selection** (top): Choose which worlds to compare
   - **Side-by-Side Deltas** (middle): Detailed differences
   - **Comparison Tools** (bottom): Analysis and actions

### Step 2: Selecting Worlds to Compare

**🟢 Beginner:**

Choose what to compare:
1. Click **"Select Baseline"** to choose the first world
2. Click **"Select Overlay"** to choose the second world
3. Verify your selections in the summary
4. Add descriptive names if helpful
5. Click **"Start Comparison"** to begin

**🟡 Intermediate:**

Selection options include:
- **Current World**: Compare with a previous state
- **Saved Worlds**: Choose from saved world states
- **Checkpoint Worlds**: Use specific save points
- **Branch Points**: Compare different decision branches
- **Import Options**: Load worlds from files

**🔴 Advanced:**

Selection system uses:
```ts
interface WorldComparisonSnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Reading Side-by-Side Deltas

**🟢 Beginner:**

Understand the differences:
1. Look at the side-by-side comparison view
2. See what's the same and what's different
3. Read the summary of major changes
4. Check specific parameter values that changed
5. Understand what the differences mean

**🟡 Intermediate:**

Delta analysis includes:
- **Parameter Changes**: Specific values that differ
- **State Differences**: Overall world state variations
- **Impact Assessment**: What changes mean for simulation
- **Causal Links**: How one change caused another
- **Statistical Summary**: Quantified differences

**🔴 Advanced:**

Delta system uses:
- Structured diff algorithms
- Change impact modeling
- Causal relationship analysis
- Statistical significance testing
- Multi-domain correlation analysis

### Step 4: Using the Map Diff Slider

**🟢 Beginner:**

Visualize changes on the map:
1. Find the map diff slider control
2. Slide to see changes over time
3. Click on highlighted areas to see details
4. Watch how specific regions changed
5. Understand spatial patterns in differences

**🟡 Intermediate:**

Slider features include:
- **Temporal Control**: Move through different time points
- **Layer Toggle**: Show/hide different types of changes
- **Region Focus**: Zoom into specific areas
- **Change Intensity**: Color coding for magnitude of changes
- **Animation Options**: Play through changes automatically

**🔴 Advanced:**

Slider system uses:
- Time-series interpolation
- Geographic information systems
- Change intensity calculations
- Spatial pattern recognition
- Animation and visualization algorithms

### Step 5: Understanding Commit Recommendations

**🟢 Beginner:**

Get advice on which world to keep:
1. Look at the "Commit Recommendation" section
2. Read the suggested choice (A, B, or merge)
3. Check the reasoning for the recommendation
4. See what would happen with each choice
5. Follow the recommendation or make your own choice

**🟡 Intermediate:**

Recommendation analysis includes:
- **Objective Metrics**: Quantified comparison of worlds
- **Risk Assessment**: Potential problems with each choice
- **Opportunity Analysis**: Benefits of each option
- **Long-term Projections**: Future implications of choices
- **Confidence Levels**: How certain we are about recommendations

**🔴 Advanced:**

Recommendation system uses:
- Multi-criteria decision analysis
- Risk modeling and assessment
- Opportunity calculation algorithms
- Long-term impact projection
- Confidence interval mathematics

---

## Key Concepts

### 🟢 Beginner Concepts

1. **World Compare (A/B)** - Tool for comparing two different world states
2. **Baseline** - The reference world used for comparison
3. **Overlay** - The world being compared against the baseline
4. **Delta** - The differences between two world states

### 🟡 Intermediate Concepts

1. **Side-by-Side Comparison** - Direct visual comparison of two worlds
2. **Map Diff Slider** - Interactive tool for visualizing geographic differences
3. **Statistical Significance** - Whether differences between worlds are meaningful
4. **Commit Recommendation** - Suggested choice of which world to keep

### 🔴 Advanced Concepts

1. **Structured Diff Algorithm** - Systematic method for comparing world states
2. **Multi-Criteria Decision Analysis** - Evaluation using multiple factors
3. **Change Impact Modeling** - Analysis of how differences affect the simulation
4. **Time-Series Interpolation** - Estimating intermediate states between comparison points

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open World Compare (A/B) and understand the interface
- [ ] I understand what World Compare (A/B) does and when to use it
- [ ] I can select and compare different world states
- [ ] I can read side-by-side deltas and understand differences
- [ ] I know how to use basic comparison and overlay features

### 🟡 Intermediate Checkpoints

- [ ] I can use the map diff slider effectively
- [ ] I understand commit recommendations and branch choices
- [ ] I can export comparison results for documentation
- [ ] I can apply overlays to visualize specific changes
- [ ] I understand statistical significance of world differences

### 🔴 Advanced Checkpoints

- [ ] I understand the world comparison system architecture
- [ ] I can use comparison data for advanced analysis
- [ ] I understand statistical significance of world differences
- [ ] I can integrate comparison results with other diagnostic tools
- [ ] I understand the technical implementation of the comparison system

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

For technical details about World Compare (A/B), see:
- [`docs/ui-ux/31-world-compare-ab-spec.md`](./31-world-compare-ab-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Compare Current with Previous World

1. Open World Compare (A/B)
2. Select current world as baseline
3. Choose a previous world state as overlay
4. Review the side-by-side deltas
5. Understand what changed over time

### Task 2: Compare Two Different Scenarios

1. Select two different world states
2. Use the map diff slider to explore differences
3. Focus on regions with the biggest changes
4. Check the commit recommendations
5. Decide which version represents the better outcome

### Task 3: Validate a World Change

1. Compare a world before and after a major change
2. Verify the change achieved its intended effect
3. Check for any unintended side effects
4. Document the comparison results
5. Use findings to improve future changes

---

## Tips and Tricks

### 🟢 Beginner Tips
- Always clearly identify which world is your baseline
- Use the side-by-side view to understand all differences
- Pay attention to commit recommendations
- Export comparison results before making decisions

### 🟡 Intermediate Tips
- Use the map diff slider to focus on specific regions
- Check statistical significance to understand if differences matter
- Look for causal links between changes
- Consider long-term implications of your choices

### 🔴 Advanced Tips
- Use structured analysis for deep insights
- Apply statistical tests to validate differences
- Consider multiple criteria when making decisions
- Integrate comparison data with other diagnostic tools

---

## Troubleshooting

### Issue: Comparison shows no differences

**Solution:**
- Ensure you're comparing different world states
- Check if comparison filters are hiding differences
- Verify both worlds loaded successfully
- Try selecting different comparison points

### Issue: Map diff slider not working

**Solution:**
- Check if both worlds have geographic data
- Verify map rendering is enabled
- Refresh the comparison view
- Review error logs for specific issues

### Issue: Commit recommendation seems wrong

**Solution:**
- Review all comparison criteria
- Check if weights match your priorities
- Verify statistical calculations are correct
- Consider manual override if needed

---

## Next Steps

After mastering World Compare (A/B), explore:
- [`57-onboarding-solver-validity.md`](./57-onboarding-solver-validity.md) - Solver Validity Monitor
- [`58-onboarding-determinism-replay.md`](./58-onboarding-determinism-replay.md) - Determinism & Replay Integrity
- [`59-onboarding-benchmark-scenarios.md`](./59-onboarding-benchmark-scenarios.md) - Benchmark Scenarios Panel
- [`60-onboarding-parameter-provenance.md`](./60-onboarding-parameter-provenance.md) - Parameter Provenance Explorer
- [`61-onboarding-tag-explorer.md`](./61-onboarding-tag-explorer.md) - Tag Explorer

---

## Glossary

| Term | Definition |
|------|------------|
| **World Compare (A/B)** | Tool for comparing two different world states side-by-side |
| **Baseline** | The reference world used as the standard for comparison |
| **Overlay** | The world being compared against the baseline |
| **Delta** | The differences between two world states |
| **Side-by-Side Comparison** | Direct visual comparison of two worlds |
| **Map Diff Slider** | Interactive tool for visualizing geographic differences |
| **Statistical Significance** | Whether differences between worlds are meaningful |
| **Commit Recommendation** | Suggested choice of which world state to keep |
| **Structured Diff Algorithm** | Systematic method for comparing world states |
| **Multi-Criteria Decision Analysis** | Evaluation using multiple factors and objectives |
| **Change Impact Modeling** | Analysis of how differences affect the simulation |
| **Time-Series Interpolation** | Estimating intermediate states between comparison points |