# Settlement Viability Map Onboarding Guide

## Overview

The Settlement Viability Map provides a visual analysis of where civilizations can thrive, showing resource availability, environmental suitability, and potential settlement locations. It helps you understand where populations can grow and where new settlements might be established.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what the Settlement Viability Map shows
- Learn to read the suitability heatmap
- Identify good locations for new settlements
- Navigate to detailed views from the map

### 🟡 Intermediate (Ages 16-18)
- Understand resource availability indicators
- Interpret suitability scores and confidence levels
- Use the consequence preview panel for settlement decisions
- Compare multiple potential settlement sites

### 🔴 Advanced (Ages 19-99)
- Understand the underlying settlement viability algorithms
- Interpret deterministic drill-down tables
- Use the map for hypothesis testing about settlement patterns
- Understand the relationship between viability and environmental factors

---

## Step-by-Step Walkthrough

### Step 1: Opening the Map

1. From the main dashboard, click on **Settlement Viability Map** in the navigation menu
2. The map will load with a color-coded overlay showing settlement suitability
3. You'll see three main sections:
   - **Suitability Heatmap** (center): Color-coded map showing viability
   - **Resource Analysis** (left): Available resources by region
   - **Action Panel** (right): Commands and consequence previews

### Step 2: Reading the Suitability Heatmap

**🟢 Beginner:**

The heatmap uses colors to show how good an area is for settlements:

| Color | Meaning | Example |
|-------|---------|---------|
| 🟢 Green | Excellent | Fertile river valley with water |
| 🟡 Yellow | Good | Hills with some resources |
| 🟠 Orange | Marginal | Dry plains with limited water |
| 🔴 Red | Poor | Desert or extreme cold |

**🟡 Intermediate:**

Each color represents a suitability score:
- **90-100% (Dark Green)**: Ideal conditions, abundant resources
- **70-89% (Light Green)**: Very good conditions, minor limitations
- **50-69% (Yellow)**: Acceptable conditions, some challenges
- **30-49% (Orange)**: Difficult conditions, significant challenges
- **0-29% (Red)**: Unsuitable for permanent settlement

**🔴 Advanced:**

Suitability scores are calculated from:
```ts
interface SettlementViabilitySnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Understanding Resource Slices

**🟢 Beginner:**

Resource slices show what's available in different areas:

- 💧 **Water** - Rivers, lakes, groundwater
- 🌾 **Food** - Farmland, hunting grounds, fishing
- 🪨 **Materials** - Stone, wood, metal ores
- 🛡️ **Defense** - Natural barriers, strategic positions

**🟡 Intermediate:**

Resource analysis includes:
- Quantity (abundant, sufficient, limited, scarce)
- Accessibility (easy, moderate, difficult, inaccessible)
- Renewability (renewable, finite, depleting)
- Quality (excellent, good, fair, poor)

**🔴 Advanced:**

Resource calculations use:
- Geological surveys for minerals
- Hydrological modeling for water
- Soil analysis for agriculture
- Topographical analysis for defense
- Climate modeling for growing seasons

### Step 4: Identifying Relocation Candidates

**🟢 Beginner:**

Look for areas where people might move:
1. Green areas near existing settlements
2. Yellow areas with special resources
3. Places with good water access
4. Areas away from hazards

**🟡 Intermediate:**

Relocation candidates are evaluated by:
- Current population pressure
- Resource availability
- Distance from existing settlements
- Environmental risks
- Transportation access

**🔴 Advanced:**

Relocation modeling uses:
- Population growth projections
- Resource depletion models
- Migration pattern analysis
- Cost-benefit calculations
- Environmental carrying capacity

### Step 5: Using the Consequence Preview Panel

**🟢 Beginner:**

Before establishing a settlement, see what might happen:
1. Click on a potential settlement location
2. The preview panel shows likely outcomes
3. Decide whether to proceed or cancel

**🟡 Intermediate:**

The preview panel shows:
- Resource consumption rates
- Environmental impact
- Economic potential
- Social factors
- Time to self-sufficiency

**🔴 Advanced:**

Preview panel uses:
- Resource flow modeling
- Environmental impact assessment
- Economic projection models
- Social stability calculations
- Long-term sustainability analysis

### Step 6: Comparing Settlement Sites

**🟢 Beginner:**

Compare different locations:
1. Click **"Compare Sites"**
2. Select multiple locations on the map
3. Review the comparison table
4. Choose the best option

**🟡 Intermediate:**

Comparison factors include:
- Resource availability
- Environmental risks
- Distance to markets
- Defense considerations
- Growth potential

**🔴 Advanced:**

Site comparison uses:
- Multi-criteria decision analysis
- Weighted scoring algorithms
- Sensitivity analysis
- Risk assessment models
- Scenario testing

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Suitability** - How good an area is for settlement
2. **Resources** - Things people need to live (water, food, materials)
3. **Heatmap** - A map using colors to show values
4. **Relocation** - Moving people to a new place

### 🟡 Intermediate Concepts

1. **Carrying Capacity** - How many people an area can support
2. **Resource Accessibility** - How easy it is to get resources
3. **Environmental Impact** - How settlement affects nature
4. **Self-Sufficiency** - When a settlement can support itself

### 🔴 Advanced Concepts

1. **Deterministic Modeling** - Same inputs always produce same outputs
2. **Multi-Criteria Analysis** - Evaluating options using multiple factors
3. **Resource Flow Modeling** - Tracking how resources move and are used
4. **Sustainability Analysis** - Long-term viability assessment

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Settlement Viability Map
- [ ] I can identify at least 3 high-suitability areas
- [ ] I understand what the color codes mean
- [ ] I can find areas with good water resources
- [ ] I know how to compare two potential settlement sites

### 🟡 Intermediate Checkpoints

- [ ] I can interpret suitability scores and confidence levels
- [ ] I understand resource accessibility indicators
- [ ] I can use the consequence preview panel effectively
- [ ] I can explain the difference between resource types
- [ ] I can identify top factors affecting settlement viability

### 🔴 Advanced Checkpoints

- [ ] I understand the settlement viability algorithms
- [ ] I can explain how carrying capacity is calculated
- [ ] I understand deterministic site comparison
- [ ] I can use the map for hypothesis testing
- [ ] I understand the relationship to environmental factors

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Civilization: Settlements, Trade, and Behavior
- [`docs/onboard/02-planetary-physics.md`](../onboard/02-planetary-physics.md) - Climate, Carbon Cycle, and Geology

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/09-terraform-tools.md`](../onboard/09-terraform-tools.md) - Terraform Tools

### Diagrams
- [`docs/onboard/diagrams/03-climate-system.svg`](../onboard/diagrams/03-climate-system.svg) - Climate System
- [`docs/onboard/diagrams/04-carbon-cycle.svg`](../onboard/diagrams/04-carbon-cycle.svg) - Carbon Cycle

---

## Reference to UI/UX Spec

For technical details about the Settlement Viability Map, see:
- [`docs/ui-ux/20-settlement-viability-map-spec.md`](./20-settlement-viability-map-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Find a Good Settlement Location

1. Open Settlement Viability Map
2. Look for green areas on the heatmap
3. Check resource availability in those areas
4. Use "Inspect Site" to get detailed information
5. Select the best location

### Task 2: Compare Multiple Settlement Sites

1. Identify 3-4 potential locations
2. Click "Compare Sites"
3. Select each location on the map
4. Review the comparison table
5. Choose the most suitable option

### Task 3: Plan a Settlement Relocation

1. Find an area with population pressure
2. Identify nearby suitable locations
3. Use "Queue Settlement Shift" to plan the move
4. Review the consequence preview
5. Commit or cancel based on the analysis

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with the green areas - they're the most suitable
- Always check water availability first
- Look for areas with multiple resource types
- Consider distance to existing settlements

### 🟡 Intermediate Tips
- Pay attention to confidence levels in suitability scores
- Compare resource accessibility, not just availability
- Use the consequence preview to avoid environmental damage
- Consider seasonal variations in resources

### 🔴 Advanced Tips
- Understand the deterministic nature of the modeling for reproducible experiments
- Use the drill-down table to understand exactly how scores are calculated
- Combine Settlement Viability with other dashboards for comprehensive analysis
- Leverage historical settlement patterns to predict future success

---

## Troubleshooting

### Issue: Map shows "Loading..." indefinitely

**Solution:**
- Check if the settlement domain is initialized
- Verify world state is valid
- Try refreshing the map

### Issue: Site inspection fails with error

**Solution:**
- Check if the location is within the valid map area
- Verify resource data is available
- Review error message for specific issue

### Issue: Suitability scores seem incorrect

**Solution:**
- Check confidence level - low confidence means uncertainty
- Verify tick number is current
- Review underlying metrics in drill-down table

---

## Next Steps

After mastering the Settlement Viability Map, explore:
- [`48-onboarding-civilization-pulse.md`](./48-onboarding-civilization-pulse.md) - Civilization Pulse Dashboard
- [`50-onboarding-trade-supply.md`](./50-onboarding-trade-supply.md) - Trade & Supply Lanes
- [`51-onboarding-conflict-forecast.md`](./51-onboarding-conflict-forecast.md) - Conflict Forecast Board

---

## Glossary

| Term | Definition |
|------|------------|
| **Suitability** | A measure of how appropriate an area is for settlement |
| **Heatmap** | A map using colors to represent different values |
| **Carrying Capacity** | The maximum population an area can sustainably support |
| **Resource Accessibility** | How easily resources can be obtained and used |
| **Environmental Impact** | The effect of human activity on natural systems |
| **Self-Sufficiency** | When a settlement can meet its own needs without external help |
| **Relocation** | Moving a population from one area to another |
| **Resource Slice** | A view of specific resource availability in an area |
| **Deterministic** | Same inputs always produce same outputs |
| **Viability** | The ability to survive and thrive successfully |