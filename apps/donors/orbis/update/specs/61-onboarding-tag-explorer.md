# Tag Explorer Onboarding Guide

## Overview

The Tag Explorer provides a comprehensive view of all tags used throughout the Orbis system, showing their propagation, intensity over time, and overlap warnings. It helps you understand how tags are used, where they come from, and how they affect your world.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what tags are and how they're used in Orbis
- Learn to read active tags and intensity timelines
- Identify when tags overlap or conflict
- Use basic tag exploration and inspection

### 🟡 Intermediate (Ages 16-18)
- Understand tag propagation patterns and relationships
- Compare different tag sets and their impacts
- Open registry owners to understand tag origins
- Use overlap warnings to prevent conflicts

### 🔴 Advanced (Ages 19-99)
- Master the tag system architecture and taxonomy
- Understand tag intensity evolution and lifecycle
- Use tag data for advanced world analysis
- Integrate tag information with other diagnostic tools

---

## Step-by-Step Walkthrough

### Step 1: Opening Tag Explorer

1. From the main dashboard, click on **Tag Explorer** in the navigation menu
2. The explorer will load with tag system information
3. You'll see three main sections:
   - **Active Tags** (top): Currently used tags and their status
   - **Intensity Timelines** (middle): Historical intensity of tag usage
   - **Overlap Analysis** (bottom): Conflicts and warnings

### Step 2: Understanding Active Tags

**🟢 Beginner:**

Active tags show what's currently being used:

| Tag Category | Examples | What They Represent |
|---------------|----------|---------------------|
| Species | "mammal", "aquatic", "avian" | Types of creatures |
| Terrain | "mountain", "plains", "forest" | Landscape features |
| Climate | "temperate", "arid", "tropical" | Weather patterns |
| Resources | "iron", "wood", "food" | Available materials |
| Political | "democracy", "monarchy", "tribal" | Government types |

**🟡 Intermediate:**

Tag details include:
- **Usage Count**: How many times the tag is applied
- **Intensity Level**: Current strength or prevalence (0-100%)
- **Confidence Score**: Reliability of tag assignments (0-100%)
- **Last Applied**: When the tag was most recently used
- **Domain Association**: Which simulation domains use this tag

**🔴 Advanced:**

Tag system uses:
```ts
interface TagPropagationSnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Analyzing Intensity Timelines

**🟢 Beginner:**

See how tag usage changes:
1. Select a tag from the active list
2. Look at its intensity timeline
3. Find peaks and valleys in usage
4. Note any sudden changes or trends
5. Understand what the timeline means

**🟡 Intermediate:**

Timeline analysis features:
- **Historical View**: Long-term pattern of tag intensity
- **Trend Indicators**: Whether usage is increasing or decreasing
- **Event Correlation**: How world events affect tag usage
- **Seasonal Patterns**: Regular cycles in tag intensity
- **Anomaly Detection**: Unusual spikes or drops in usage

**🔴 Advanced:**

Timeline system uses:
- Time-series analysis algorithms
- Statistical trend detection
- Correlation analysis with world events
- Seasonal decomposition methods
- Anomaly detection techniques

### Step 4: Understanding Overlap Warnings

**🟢 Beginner:**

Identify potential conflicts:
1. Look for tags marked with warning icons
2. Read what the overlap warning means
3. See which other tags are conflicting
4. Understand the potential problems
5. Follow suggested resolution steps

**🟡 Intermediate:**

Overlap analysis includes:
- **Conflict Type**: Nature of the overlap (hierarchical, semantic, etc.)
- **Severity Level**: How serious the conflict is
- **Resolution Options**: Ways to fix the overlap
- **Impact Assessment**: What the conflict means for the world
- **Prevention Measures**: How to avoid future conflicts

**🔴 Advanced:**

Overlap detection uses:
- Hierarchical relationship analysis
- Semantic similarity detection
- Usage pattern correlation
- Conflict resolution algorithms
- Prevention strategy optimization

### Step 5: Comparing Tag Sets

**🟢 Beginner:**

Compare different tag configurations:
1. Select multiple tags to compare
2. Click **"Compare Tag Sets"**
3. See the differences highlighted
4. Read analysis of the comparison
5. Understand how the sets differ

**🟡 Intermediate:**

Comparison features:
- **Set Composition**: What tags are included in each set
- **Coverage Analysis**: How completely tags describe the world
- **Redundancy Detection**: Overlapping or unnecessary tags
- **Gap Identification**: Missing tags that should be added
- **Efficiency Metrics**: How well the tag set performs

**🔴 Advanced:**

Comparison system uses:
- Set theory analysis
- Coverage calculation algorithms
- Redundancy optimization techniques
- Gap analysis methods
- Performance benchmarking

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Tag** - Label or category used to classify and organize world elements
2. **Tag Intensity** - How strongly or prevalently a tag is being used
3. **Overlap Warning** - Alert when tags conflict or create confusion
4. **Tag Set** - Collection of tags used together for a purpose

### 🟡 Intermediate Concepts

1. **Tag Propagation** - How tags spread through the system over time
2. **Confidence Score** - How reliable the tag assignments are (0-100%)
3. **Semantic Similarity** - How closely related tags are in meaning
4. **Coverage Analysis** - How completely tags describe world elements

### 🔴 Advanced Concepts

1. **Tag Taxonomy** - Hierarchical organization of all tags
2. **Time-Series Analysis** - Statistical methods for analyzing tag usage over time
3. **Set Theory** - Mathematical analysis of tag collections
4. **Anomaly Detection** - Identifying unusual patterns in tag usage

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Tag Explorer and understand the interface
- [ ] I understand what tags are and how they're used in Orbis
- [ ] I can read active tags and intensity timelines
- [ ] I can identify when tags overlap or conflict
- [ ] I know how to use basic tag exploration and inspection

### 🟡 Intermediate Checkpoints

- [ ] I understand tag propagation patterns and relationships
- [ ] I can compare different tag sets and their impacts
- [ ] I can open registry owners to understand tag origins
- [ ] I can use overlap warnings to prevent conflicts
- [ ] I understand seasonal patterns in tag usage

### 🔴 Advanced Checkpoints

- [ ] I understand the tag system architecture and taxonomy
- [ ] I understand tag intensity evolution and lifecycle
- [ ] I can use tag data for advanced world analysis
- [ ] I can integrate tag information with other diagnostic tools
- [ ] I understand the technical implementation of the tag system

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

For technical details about Tag Explorer, see:
- [`docs/ui-ux/30-tag-explorer-spec.md`](./30-tag-explorer-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Explore Tag Usage

1. Open Tag Explorer and browse active tags
2. Select a tag category to explore
3. Check intensity timelines for usage patterns
4. Look for any overlap warnings
5. Document findings about tag behavior

### Task 2: Resolve Tag Conflicts

1. Find tags with overlap warnings
2. Use the comparison tool to understand conflicts
3. Check which domains are affected by each tag
4. Follow recommended resolution steps
5. Verify the conflicts are resolved

### Task 3: Optimize Tag Set

1. Analyze current tag coverage
2. Identify redundant or unnecessary tags
3. Find gaps where tags are missing
4. Create a more efficient tag set
5. Apply the optimized set to improve performance

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start by exploring tag categories to understand the system
- Pay attention to overlap warnings - they indicate problems
- Use intensity timelines to understand how tags evolve
- Compare tag sets to find better organizations

### 🟡 Intermediate Tips
- Monitor tag confidence scores to ensure reliability
- Use seasonal patterns to predict tag usage
- Check semantic relationships to avoid confusion
- Optimize tag sets for better performance

### 🔴 Advanced Tips
- Understand the tag taxonomy for efficient navigation
- Use time-series analysis for deep insights
- Apply set theory principles for optimal tag organization
- Integrate tag data with other diagnostic tools

---

## Troubleshooting

### Issue: Tag Explorer shows "Loading..." indefinitely

**Solution:**
- Check if the tag system is initialized
- Verify world state is valid
- Try refreshing the explorer
- Check if tag data exists

### Issue: Overlap warnings seem incorrect

**Solution:**
- Verify semantic relationships between tags
- Check hierarchical tag organization
- Review conflict detection algorithms
- Update tag definitions if needed

### Issue: Tag comparison shows no results

**Solution:**
- Ensure you've selected tags to compare
- Check if tags have sufficient usage data
- Verify comparison filters aren't too restrictive
- Try a broader comparison

---

## Next Steps

After mastering Tag Explorer, explore:
- [`57-onboarding-solver-validity.md`](./57-onboarding-solver-validity.md) - Solver Validity Monitor
- [`58-onboarding-determinism-replay.md`](./58-onboarding-determinism-replay.md) - Determinism & Replay Integrity
- [`59-onboarding-benchmark-scenarios.md`](./59-onboarding-benchmark-scenarios.md) - Benchmark Scenarios Panel
- [`60-onboarding-parameter-provenance.md`](./60-onboarding-parameter-provenance.md) - Parameter Provenance Explorer
- [`62-onboarding-world-compare.md`](./62-onboarding-world-compare.md) - World Compare (A/B)

---

## Glossary

| Term | Definition |
|------|------------|
| **Tag** | Label or category used to classify and organize world elements |
| **Tag Intensity** | How strongly or prevalently a tag is being used (0-100%) |
| **Overlap Warning** | Alert when tags conflict or create classification confusion |
| **Tag Set** | Collection of tags used together for a specific purpose |
| **Tag Propagation** | How tags spread through the system over time |
| **Confidence Score** | How reliable the tag assignments are (0-100%) |
| **Semantic Similarity** | How closely related tags are in meaning |
| **Coverage Analysis** | How completely tags describe world elements |
| **Tag Taxonomy** | Hierarchical organization and classification of all tags |
| **Time-Series Analysis** | Statistical methods for analyzing tag usage over time |
| **Set Theory** | Mathematical analysis of tag collections and their properties |
| **Anomaly Detection** | Identifying unusual patterns in tag usage |