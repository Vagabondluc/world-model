# Atmosphere Console Onboarding Guide

## Overview

The Atmosphere Console provides detailed information about your planet's atmospheric composition and conditions. It helps you understand whether the atmosphere can support life and how it affects climate.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what the Atmosphere Console shows
- Learn to read gas composition bars
- Identify breathable atmospheres
- Understand how CO₂ affects climate

### 🟡 Intermediate (Ages 16-18)
- Understand gas compatibility matrices
- Interpret breathable indicators
- Project CO₂ pathways
- Use the atmosphere console for species filtering

### 🔴 Advanced (Ages 19-99)
- Understand the atmospheric state snapshot system
- Interpret gas composition trends
- Use the console for climate modeling
- Understand the relationship between atmosphere and other domains

---

## Step-by-Step Walkthrough

### Step 1: Opening the Atmosphere Console

1. From the main dashboard, click on **Atmosphere Console** in the navigation menu
2. The console will load with a snapshot of current atmospheric conditions
3. You'll see three main sections:
   - **Gas Composition** (top): Bars showing each gas percentage
   - **Breathability** (middle): Species compatibility matrix
   - **Action Panel** (bottom): Commands and projections

### Step 2: Reading Gas Composition Bars

**🟢 Beginner:**

Gas composition bars show what gases are in the atmosphere:

| Gas | What It Does | Typical Range |
|-----|--------------|---------------|
| Nitrogen (N₂) | Makes up most of Earth's air | 70-80% |
| Oxygen (O₂) | Needed for breathing | 15-25% |
| Carbon Dioxide (CO₂) | Greenhouse gas | 0.01-1% |
| Argon (Ar) | Inert gas | 0.5-1% |

**🟡 Intermediate:**

Each gas bar shows:
- Gas name and chemical formula
- Current percentage
- Historical range (min/max)
- Trend indicator (↑ ↓ →)

**🔴 Advanced:**

Gas composition is tracked by:
- Partial pressure for each gas
- Total atmospheric pressure
- Altitude profiles
- Seasonal variations

### Step 3: Understanding Breathability

**🟢 Beginner:**

The breathability indicator tells you if species can breathe:

| Indicator | Meaning |
|-----------|---------|
| ✅ Perfect | Species can breathe easily |
| ⚠️ Marginal | Species can breathe but with difficulty |
| ❌ Toxic | Species cannot breathe |

**🟡 Intermediate:**

Breathability is determined by:
- Oxygen percentage (too little or too much is bad)
- CO₂ percentage (too much is toxic)
- Other toxic gases
- Total pressure

**🔴 Advanced:**

Breathability calculations use:
- Species-specific tolerance ranges
- Partial pressure thresholds
- Toxicity models for each gas
- Combined gas effects

### Step 4: Using the Compatibility Matrix

**🟢 Beginner:**

The compatibility matrix shows which species can breathe:

```
Species        | Breathable | Marginal | Toxic
---------------|------------|----------|-------
Humans         | ✅         |          |
Fish           |            | ✅       |
Alien Species  |            |          | ❌
```

**🟡 Intermediate:**

The matrix shows:
- All known species types
- Breathability status for each
- Click to see detailed requirements
- Filter by breathability level

**🔴 Advanced:**

Compatibility is computed from:
- Species metabolic requirements
- Gas tolerance ranges
- Pressure adaptation
- Temperature interactions

### Step 5: Projecting CO₂ Pathways

**🟢 Beginner:**

See how CO₂ might change:
1. Click **"Project CO₂ Path"**
2. Choose a time horizon (10, 50, 100 years)
3. View the projected CO₂ level
4. Compare to current level

**🟡 Intermediate:**

Projection options:
- Scenario selection (baseline, reduced emissions, increased emissions)
- Time horizon (10, 50, 100, 500 years)
- Confidence level adjustment
- Export results

**🔴 Advanced:**

CO₂ projections use:
- Carbon cycle models
- Emission scenarios
- Ocean uptake calculations
- Vegetation feedback

### Step 6: Filtering Species by Breathability

**🟢 Beginner:**

Find species that can breathe:
1. Click **"Filter Species by Breathability"**
2. Choose a breathability level (Perfect, Marginal, Toxic)
3. View matching species
4. Click species for details

**🟡 Intermediate:**

Filter options:
- Breathability level (Perfect, Marginal, Toxic)
- Species type (aquatic, terrestrial, aerial)
- Temperature tolerance
- Pressure tolerance

**🔴 Advanced:**

Species filtering uses:
- Species database queries
- Multi-criteria filtering
- Tolerance range matching
- Environmental constraints

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Gas Composition** - What gases are in the atmosphere and how much of each
2. **Breathability** - Whether a species can breathe the atmosphere
3. **CO₂** - Carbon dioxide, a greenhouse gas that affects climate
4. **Percentage** - Parts per hundred, used to measure gas amounts

### 🟡 Intermediate Concepts

1. **Partial Pressure** - The pressure contributed by one gas in a mixture
2. **Tolerance Range** - The range of conditions a species can tolerate
3. **Projection** - A prediction of future atmospheric conditions
4. **Compatibility Matrix** - A table showing which species can breathe

### 🔴 Advanced Concepts

1. **Atmospheric State Snapshot** - Complete atmospheric state at one tick
2. **Carbon Cycle** - How CO₂ moves between atmosphere, ocean, land, and life
3. **Toxicity Model** - Mathematical model of how gases affect organisms
4. **Gas Interactions** - How different gases affect each other

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Atmosphere Console
- [ ] I can identify at least 3 gases in the atmosphere
- [ ] I understand what breathability means
- [ ] I can project CO₂ pathways
- [ ] I can filter species by breathability

### 🟡 Intermediate Checkpoints

- [ ] I can interpret gas composition trends
- [ ] I understand partial pressure
- [ ] I can use the compatibility matrix
- [ ] I can explain how CO₂ affects climate
- [ ] I can identify toxic gases

### 🔴 Advanced Checkpoints

- [ ] I understand the atmospheric state snapshot system
- [ ] I can explain breathability calculations
- [ ] I understand carbon cycle models
- [ ] I can use the console for climate modeling
- [ ] I understand gas interactions

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/02-planetary-physics.md`](../onboard/02-planetary-physics.md) - Climate, Carbon Cycle, and Geology
- [`docs/onboard/03-biology.md`](../onboard/03-biology.md) - Species, Evolution, and Ecosystems

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/08-view-modes.md`](../onboard/08-view-modes.md) - View Modes

### Diagrams
- [`docs/onboard/diagrams/04-carbon-cycle.svg`](../onboard/diagrams/04-carbon-cycle.svg) - Carbon Cycle

---

## Reference to UI/UX Spec

For technical details about the Atmosphere Console, see:
- [`docs/ui-ux/12-atmosphere-console-spec.md`](./12-atmosphere-console-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Check if Atmosphere is Breathable

1. Open Atmosphere Console
2. Look at breathability indicator
3. Check gas composition bars
4. Review compatibility matrix
5. Identify which species can breathe

### Task 2: Project Future CO₂ Levels

1. Note current CO₂ level
2. Click "Project CO₂ Path"
3. Choose time horizon and scenario
4. View projected CO₂ level
5. Compare to current and historical levels

### Task 3: Find Species for Your Atmosphere

1. Click "Filter Species by Breathability"
2. Choose "Perfect" or "Marginal"
3. View matching species
4. Click species for detailed requirements
5. Consider adding species to your world

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with the breathability indicator - it gives you the big picture
- Remember that too much CO₂ is bad for climate
- Use the compatibility matrix to find suitable species
- Project CO₂ pathways to see future problems

### 🟡 Intermediate Tips
- Pay attention to partial pressure, not just percentage
- Consider temperature when evaluating breathability
- Use multiple scenarios for CO₂ projections
- Filter species by multiple criteria

### 🔴 Advanced Tips
- Understand the carbon cycle when projecting CO₂
- Consider gas interactions when evaluating toxicity
- Use the console for climate modeling experiments
- Combine with other dashboards for comprehensive analysis

---

## Troubleshooting

### Issue: Breathability shows "Unknown"

**Solution:**
- Check if species data is loaded
- Verify gas composition is complete
- Review species requirements

### Issue: CO₂ projection fails

**Solution:**
- Check if carbon cycle is initialized
- Verify emission scenarios are available
- Review error message for specific issue

### Issue: Species filter returns no results

**Solution:**
- Try relaxing filter criteria
- Check if species database is loaded
- Verify breathability thresholds

---

## Next Steps

After mastering the Atmosphere Console, explore:
- [`40-onboarding-planet-pulse.md`](./40-onboarding-planet-pulse.md) - Planet Pulse Dashboard
- [`42-onboarding-wind-weather.md`](./42-onboarding-wind-weather.md) - Wind & Weather Viewer
- [`43-onboarding-ocean-currents.md`](./43-onboarding-ocean-currents.md) - Ocean Currents Viewer

---

## Glossary

| Term | Definition |
|------|------------|
| **Gas Composition** - The mixture of gases in the atmosphere |
| **Breathability** - Whether a species can breathe the atmosphere |
| **Partial Pressure** - The pressure contributed by one gas in a mixture |
| **Tolerance Range** - The range of conditions a species can tolerate |
| **CO₂** - Carbon dioxide, a greenhouse gas |
| **Projection** - A prediction of future atmospheric conditions |
| **Compatibility Matrix** - A table showing which species can breathe |
| **Toxicity Model** - Mathematical model of how gases affect organisms |
