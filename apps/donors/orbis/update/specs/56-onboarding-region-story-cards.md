# Region Story Cards Onboarding Guide

## Overview

Region Story Cards provides a focused view of narrative opportunities in specific geographic areas, showing pressure stacks, likely next events, and generating hooks for storytelling. It's your tool for discovering and creating location-specific narrative content.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what Region Story Cards does
- Learn to read pressure stacks and event predictions
- Generate story hooks for specific locations
- Use cards to find narrative opportunities

### 🟡 Intermediate (Ages 16-18)
- Understand the relationship between pressures and events
- Generate hooks for different story scopes (session vs. chapter)
- Pin important events to canon
- Use deterministic drill-down tables for analysis

### 🔴 Advanced (Ages 19-99)
- Master the pressure prediction system
- Create complex, multi-layered narrative hooks
- Understand the underlying story generation algorithms
- Integrate region cards with other narrative tools

---

## Step-by-Step Walkthrough

### Step 1: Opening Region Story Cards

1. From the Narrative Dashboard, click on **Region Story Cards** in the navigation menu
2. The cards interface will load with a world map
3. You'll see three main sections:
   - **Region Selector** (left): Choose areas to explore
   - **Story Cards** (center): Narrative opportunities and hooks
   - **Generation Tools** (right): Create and export hooks

### Step 2: Selecting a Region

**🟢 Beginner:**

Choose where to focus your story:
1. Click on the world map to select a region
2. See basic information about the area
3. Note any special features or landmarks
4. Confirm your region selection

**🟡 Intermediate:**

Region selection features:
- **Geographic Information**: Terrain, climate, resources
- **Population Data**: Species, settlements, factions
- **Historical Context**: Past events and their effects
- **Current Pressures**: Active tensions and conflicts
- **Narrative Potential**: Story opportunities in the region

**🔴 Advanced:**

Region analysis uses:
```ts
interface RegionStorySnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]
  riskFlags: string[]
}
```

### Step 3: Reading Pressure Stacks

**🟢 Beginner:**

Understand what's happening in the region:

| Pressure Type | What it Means | Example |
|---------------|-----------------|---------|
| Environmental | Natural challenges | Drought, disease, climate change |
| Political | Government and faction issues | Border disputes, succession crises |
| Economic | Resource and trade problems | Scarcity, market crashes |
| Social | Population tensions | Religious conflicts, class struggles |
| Military | War and defense needs | Invasions, arms races |

**🟡 Intermediate:**

Pressure analysis includes:
- **Pressure Intensity**: How severe each issue is
- **Pressure Duration**: How long the pressure has existed
- **Interaction Effects**: How pressures influence each other
- **Resolution Difficulty**: How hard it is to solve
- **Narrative Hooks**: Story opportunities from each pressure

**🔴 Advanced:**

Pressure system uses:
- Multi-factor analysis of regional conditions
- Historical pattern recognition
- Causal relationship mapping
- Predictive modeling of pressure evolution
- Cross-domain pressure interactions

### Step 4: Understanding Event Predictions

**🟢 Beginner:**

See what might happen next:
1. Look at the "Likely Next Events" section
2. Review each predicted event
3. Check probability and timing
4. Note which events interest you

**🟡 Intermediate:**

Event prediction details:
- **Event Probability**: How likely each event is to occur
- **Time to Event**: When events might happen
- **Event Triggers**: What might cause each event
- **Event Consequences**: What would happen if event occurs
- **Prevention Options**: How to stop or change events

**🔴 Advanced:**

Prediction system uses:
- Historical event patterns
- Current pressure analysis
- Causal chain modeling
- Probability calculations
- Scenario simulation

### Step 5: Generating Story Hooks

**🟢 Beginner:**

Create story ideas:
1. Click **"Generate Session Hooks"** for quick ideas
2. Or use **"Generate Chapter Hooks"** for longer stories
3. Review the generated hooks
4. Choose ones that interest you
5. Start writing your story

**🟡 Intermediate:**

Hook generation options:
- **Session Hooks**: Quick story ideas for one session
- **Chapter Hooks**: More complex ideas for chapters
- **Custom Hooks**: Generate hooks for specific themes
- **Hook Refinement**: Improve or modify generated ideas
- **Hook Export**: Save hooks for later use

**🔴 Advanced:**

Hook generation uses:
- Regional pressure analysis
- Historical event patterns
- Character and faction motivations
- Environmental factors
- Cultural and social elements

### Step 6: Using the Drill-Down Table

**🟢 Beginner:**

Get detailed information:
1. Click on any pressure or event
2. Look at the drill-down table
3. Read the detailed explanations
4. Use this information in your story

**🟡 Intermediate:**

Drill-down features:
- **Factor Breakdown**: What contributes to each value
- **Historical Data**: Past trends and patterns
- **Causal Chains**: How elements influence each other
- **Uncertainty Measures**: How confident we are in predictions
- **Source Attribution**: Where data comes from

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

1. **Region Story Cards** - Tool for location-based narrative opportunities
2. **Pressure Stack** - Collection of issues affecting a region
3. **Event Prediction** - Likely future events in an area
4. **Story Hook** - An idea or prompt for a story

### 🟡 Intermediate Concepts

1. **Pressure Intensity** - How severe regional issues are
2. **Event Probability** - How likely future events are to occur
3. **Hook Generation** - Creating story ideas from regional data
4. **Drill-Down Table** - Detailed analysis of regional factors

### 🔴 Advanced Concepts

1. **Deterministic Analysis** - Same data always produces same insights
2. **Multi-Factor Modeling** - Considering many variables together
3. **Causal Relationship Mapping** - Understanding how elements influence each other
4. **Predictive Modeling** - Using data to forecast future events

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Region Story Cards and understand the interface
- [ ] I can select a region and understand its information
- [ ] I can read and interpret pressure stacks
- [ ] I understand event predictions and their probabilities
- [ ] I can generate basic story hooks

### 🟡 Intermediate Checkpoints

- [ ] I understand the relationship between pressures and events
- [ ] I can generate hooks for different story scopes
- [ ] I can pin important events to canon
- [ ] I can use the drill-down table effectively
- [ ] I understand how to refine generated hooks

### 🔴 Advanced Checkpoints

- [ ] I understand the pressure prediction system
- [ ] I can create complex, multi-layered narrative hooks
- [ ] I understand the underlying story generation algorithms
- [ ] I can integrate region cards with other narrative tools
- [ ] I understand the technical implementation of the system

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Civilization: Settlements, Trade, and Behavior
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`52-onboarding-narrative-dashboard.md`](./52-onboarding-narrative-dashboard.md) - Narrative Dashboard

### Diagrams
- [`docs/onboard/diagrams/`](../onboard/diagrams/) - Various regional and geographic diagrams

---

## Reference to UI/UX Spec

For technical details about Region Story Cards, see:
- [`docs/ui-ux/25-region-story-cards-spec.md`](./25-region-story-cards-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Find Story Opportunities

1. Open Region Story Cards and explore the map
2. Look for regions with high pressure stacks
3. Check event predictions for dramatic potential
4. Generate hooks for the most interesting areas
5. Start developing stories from these hooks

### Task 2: Create a Chapter-Long Story

1. Select a region with multiple pressures
2. Generate chapter hooks for complexity
3. Use the drill-down table for details
4. Refine hooks to match your story needs
5. Pin key events to canon for consistency

### Task 3: Build a Regional Campaign

1. Map connected regions with related issues
2. Generate hooks for each region
3. Look for cross-regional story connections
4. Create a campaign outline from these hooks
5. Export hooks for future reference

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with regions that have clear pressures
- Use session hooks for quick story ideas
- Check event probabilities for dramatic tension
- Use the drill-down table for background details

### 🟡 Intermediate Tips
- Combine multiple pressures for complex stories
- Use chapter hooks for longer narratives
- Pin important events to maintain consistency
- Export hooks you like for future use

### 🔴 Advanced Tips
- Analyze pressure interactions for unique stories
- Create custom hooks for specific themes
- Use deterministic analysis for reproducible results
- Integrate region cards with other narrative tools

---

## Troubleshooting

### Issue: Region selection shows no data

**Solution:**
- Check if the region has been initialized
- Verify world state is current
- Try selecting a different region
- Refresh the dashboard

### Issue: Hook generation fails

**Solution:**
- Verify region has sufficient pressures
- Check internet connection for generation service
- Try different hook types
- Review error messages

### Issue: Drill-down table shows errors

**Solution:**
- Check if underlying data is available
- Verify confidence levels are adequate
- Review data sources
- Try refreshing the region

---

## Next Steps

After mastering Region Story Cards, explore:
- [`52-onboarding-narrative-dashboard.md`](./52-onboarding-narrative-dashboard.md) - Narrative Dashboard
- [`53-onboarding-event-forge.md`](./53-onboarding-event-forge.md) - Event Forge
- [`54-onboarding-species-studio.md`](./54-onboarding-species-studio.md) - Species & Race Studio
- [`55-onboarding-arc-composer.md`](./55-onboarding-arc-composer.md) - Arc Composer

---

## Glossary

| Term | Definition |
|------|------------|
| **Region Story Cards** | Tool for discovering location-based narrative opportunities |
| **Pressure Stack** | Collection of issues and tensions affecting a region |
| **Event Prediction** | Forecast of likely future events based on current conditions |
| **Story Hook** | An idea or prompt that inspires a narrative |
| **Pressure Intensity** | Measurement of how severe regional issues are |
| **Event Probability** | Likelihood that a predicted event will occur |
| **Hook Generation** | Process of creating story ideas from regional data |
| **Drill-Down Table** | Detailed analysis showing how regional values are calculated |
| **Deterministic Analysis** | Same data always produces the same insights |
| **Multi-Factor Modeling** | Analysis that considers many variables simultaneously |
| **Causal Relationship** | How one element influences or causes another |
| **Predictive Modeling** | Using current data to forecast future conditions |