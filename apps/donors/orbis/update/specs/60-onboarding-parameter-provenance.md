# Parameter Provenance Explorer Onboarding Guide

## Overview

The Parameter Provenance Explorer tracks the complete history and lineage of all simulation parameters. It helps you understand why parameters have their current values, who changed them, and how those changes affect your world.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what parameter provenance means
- Learn to read source badges and change history
- Identify when and why parameters were modified
- Use basic provenance tracking

### 🟡 Intermediate (Ages 16-18)
- Understand confidence markers in parameter values
- Compare different versions of parameter sets
- Export audit packets for documentation
- Trace parameter lineages across changes

### 🔴 Advanced (Ages 19-99)
- Master the parameter provenance system
- Understand the relationship between parameters and simulation behavior
- Use provenance data for advanced debugging
- Integrate provenance tracking with other diagnostic tools

---

## Step-by-Step Walkthrough

### Step 1: Opening Parameter Provenance Explorer

1. From the main dashboard, click on **Parameter Provenance Explorer** in the navigation menu
2. The explorer will load with parameter history information
3. You'll see three main sections:
   - **Source Badges** (top): Origin of current parameter values
   - **Change History** (middle): Timeline of all modifications
   - **Confidence Markers** (bottom): Reliability indicators

### Step 2: Reading Source Badges

**🟢 Beginner:**

Source badges show where parameters came from:

| Badge | Meaning | Example |
|--------|-----------|---------|
| 🏛️️ Default | Original simulation value | "Base climate model" |
| ✏️ User Set | Manually changed by user | "Custom sea level" |
- 🔬 Calculated | Derived from other parameters | "Computed temperature" |
| 🔄 Imported | From another world or scenario | "Migrated population" |

**🟡 Intermediate:**

Badge details include:
- **Source Type**: Category of origin (default, calculated, imported, etc.)
- **Author Information**: Who made the change
- **Timestamp**: When the change was made
- **Change Reason**: Why the modification occurred
- **Confidence Level**: How certain we are about the source

**🔴 Advanced:**

Source system uses:
```ts
interface ParameterProvenanceSnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Analyzing Change History

**🟢 Beginner:**

Track parameter modifications:
1. Look at the "Change History" section
2. Find a parameter you're interested in
3. See all the values it had over time
4. Read who changed each value and why
5. Understand how changes affected the world

**🟡 Intermediate:**

History analysis features:
- **Chronological Timeline**: Time-ordered list of all changes
- **Value Transitions**: How parameters moved from one value to another
- **Causal Links**: How one change influenced others
- **Rollback Points**: Previous values that can be restored
- **Impact Assessment**: What each change meant for the simulation

**🔴 Advanced:**

History system uses:
- Immutable change logging
- Causal relationship tracking
- Branch point identification
- Rollback capability with integrity checks
- Cross-parameter dependency analysis

### Step 4: Using Confidence Markers

**🟢 Beginner:**

Check reliability:
1. Look at the "Confidence Markers" section
2. Find the confidence level for each parameter
3. Check if confidence is high, medium, or low
4. Note any warnings about uncertainty
5. Understand what confidence means for your work

**🟡 Intermediate:**

Confidence indicators include:
- **Confidence Percentage**: Numerical certainty (0-100%)
- **Uncertainty Range**: Margin of error in values
- **Stability Indicator**: How stable the parameter has been
- **Validation Status**: Whether the value passes checks
- **Trend Analysis**: Whether confidence is improving or declining

**🔴 Advanced:**

Confidence calculation uses:
- Statistical variance analysis
- Historical stability assessment
- Validation result aggregation
- Uncertainty propagation modeling
- Predictive confidence estimation

### Step 5: Comparing Parameter Versions

**🟢 Beginner:**

Compare different parameter sets:
1. Select two points in the change history
2. Click **"Compare Versions"**
3. See the differences highlighted
4. Read what changed between the versions
5. Understand why the changes were made

**🟡 Intermediate:**

Comparison features:
- **Side-by-Side View**: Direct comparison of two versions
- **Difference Highlighting**: Visual markers for changes
- **Impact Analysis**: What the differences mean
- **Causal Chains**: How changes relate to each other
- **Merge Options**: Ways to combine versions

**🔴 Advanced:**

Comparison system uses:
- Structured diff algorithms
- Impact propagation analysis
- Dependency graph comparison
- Conflict resolution strategies
- Merge optimization techniques

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Parameter Provenance** - History and origin of simulation parameters
2. **Source Badge** - Indicator showing where a parameter value came from
3. **Change History** - Complete record of all parameter modifications
4. **Confidence Marker** - Indicator of how certain we are about a parameter value

### 🟡 Intermediate Concepts

1. **Confidence Percentage** - Numerical measure of certainty (0-100%)
2. **Causal Links** - How one parameter change influences another
3. **Rollback Point** - Previous value that can be restored
4. **Impact Assessment** - Analysis of what parameter changes mean for the simulation

### 🔴 Advanced Concepts

1. **Immutable Change Logging** - System that permanently records all modifications
2. **Causal Relationship Tracking** - Mapping how parameters influence each other
3. **Cross-Parameter Dependency Analysis** - Understanding relationships between parameters
4. **Uncertainty Propagation** - How uncertainty in one parameter affects others

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Parameter Provenance Explorer and understand the interface
- [ ] I understand what parameter provenance means
- [ ] I can read source badges and change history
- [ ] I can identify when and why parameters were modified
- [ ] I know how to use basic provenance tracking

### 🟡 Intermediate Checkpoints

- [ ] I understand confidence markers in parameter values
- [ ] I can compare different versions of parameter sets
- [ ] I can export audit packets for documentation
- [ ] I can trace parameter lineages across changes
- [ ] I understand uncertainty ranges in parameter values

### 🔴 Advanced Checkpoints

- [ ] I understand the parameter provenance system
- [ ] I understand the relationship between parameters and simulation behavior
- [ ] I can use provenance data for advanced debugging
- [ ] I can integrate provenance tracking with other diagnostic tools
- [ ] I understand the technical implementation of the provenance system

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

For technical details about Parameter Provenance Explorer, see:
- [`docs/ui-ux/29-parameter-provenance-explorer-spec.md`](./29-parameter-provenance-explorer-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Track a Parameter's History

1. Open Parameter Provenance Explorer
2. Search for the parameter you want to track
3. Review its complete change history
4. Identify all sources and reasons for changes
5. Document findings for future reference

### Task 2: Compare Two Configurations

1. Select two points in time to compare
2. Use the version comparison tool
3. Analyze the differences highlighted
4. Understand the impact of each change
5. Decide which configuration works better

### Task 3: Export an Audit Packet

1. Select parameters to include in the export
2. Choose what level of detail to export
3. Click **"Export Audit Packet"**
4. Save the packet for documentation or sharing
5. Use the exported data for analysis

---

## Tips and Tricks

### 🟢 Beginner Tips
- Always check source badges to understand parameter origins
- Use change history to find when problems started
- Pay attention to confidence levels - low confidence means uncertainty
- Export audit packets before making major changes

### 🟡 Intermediate Tips
- Compare versions to understand parameter evolution
- Use rollback points to quickly revert problematic changes
- Monitor confidence trends to identify stability issues
- Correlate parameter changes with world events

### 🔴 Advanced Tips
- Understand causal relationships between parameters
- Use uncertainty propagation analysis for risk assessment
- Create custom audit exports for specific analysis needs
- Integrate provenance data with other diagnostic tools

---

## Troubleshooting

### Issue: Provenance data seems incomplete

**Solution:**
- Check if parameter tracking is enabled
- Verify sufficient history exists
- Review data collection settings
- Try running simulation to generate history

### Issue: Confidence markers seem incorrect

**Solution:**
- Check if enough validation data exists
- Verify statistical calculations are working
- Review uncertainty sources
- Refresh the provenance explorer

### Issue: Version comparison shows no differences

**Solution:**
- Ensure you're comparing different points in time
- Check if parameters actually changed between versions
- Verify comparison filters aren't hiding differences
- Try selecting different comparison points

---

## Next Steps

After mastering Parameter Provenance Explorer, explore:
- [`57-onboarding-solver-validity.md`](./57-onboarding-solver-validity.md) - Solver Validity Monitor
- [`58-onboarding-determinism-replay.md`](./58-onboarding-determinism-replay.md) - Determinism & Replay Integrity
- [`59-onboarding-benchmark-scenarios.md`](./59-onboarding-benchmark-scenarios.md) - Benchmark Scenarios Panel
- [`61-onboarding-tag-explorer.md`](./61-onboarding-tag-explorer.md) - Tag Explorer
- [`62-onboarding-world-compare.md`](./62-onboarding-world-compare.md) - World Compare (A/B)

---

## Glossary

| Term | Definition |
|------|------------|
| **Parameter Provenance** | Complete history and origin tracking for simulation parameters |
| **Source Badge** | Visual indicator showing where a parameter value originated |
| **Change History** | Complete chronological record of all parameter modifications |
| **Confidence Marker** | Indicator of how certain we are about a parameter value |
| **Confidence Percentage** | Numerical measure of certainty (0-100%) |
| **Causal Links** | Relationships where one parameter change influences another |
| **Rollback Point** | Previous parameter value that can be restored |
| **Impact Assessment** | Analysis of what parameter changes mean for the simulation |
| **Immutable Change Logging** | System that permanently records all parameter modifications |
| **Causal Relationship Tracking** | Mapping how parameters influence each other over time |
| **Cross-Parameter Dependency Analysis** | Understanding relationships between different parameters |
| **Uncertainty Propagation** | How uncertainty in one parameter affects related parameters |
| **Audit Packet** | Exported package containing parameter provenance information |