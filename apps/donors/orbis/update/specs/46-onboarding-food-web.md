# Food Web / Trophic Dashboard Onboarding Guide

## Overview

The Food Web / Trophic Dashboard provides detailed information about how energy flows through ecosystems on your planet. It helps you understand predator-prey relationships, energy transfer, and ecosystem stability.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what Food Web Dashboard shows
- Learn to read trophic pyramids
- Identify energy bottlenecks
- Understand how energy flows through ecosystems

### 🟡 Intermediate (Ages 16-18)
- Understand trophic networks and energy flow
- Interpret cascade risk indicators
- Simulate ecological shocks
- Create ecology hooks for storytelling

### 🔴 Advanced (Ages 19-99)
- Understand trophic network snapshot system
- Interpret complex ecosystem dynamics
- Use dashboard for ecosystem management
- Understand relationship between food webs and other domains

---

## Step-by-Step Walkthrough

### Step 1: Opening the Food Web Dashboard

1. From the main dashboard, click on **Food Web / Trophic Dashboard** in the navigation menu
2. The dashboard will load with a snapshot of current trophic relationships
3. You'll see three main sections:
   - **Trophic Pyramid** (top): Energy levels in the ecosystem
   - **Network View** (middle): Species connections and energy flow
   - **Action Panel** (bottom): Commands and tools

### Step 2: Reading the Trophic Pyramid

**🟢 Beginner:**

The trophic pyramid shows how energy moves through ecosystem:

```
        Apex Predators (Lions, Eagles)
            ▲
    Secondary Consumers (Wolves, Foxes)
            ▲
   Primary Consumers (Rabbits, Deer)
            ▲
     Producers (Plants, Algae)
            ■
```

**🟢 Beginner:**

The pyramid shows:
- Energy levels (producers, primary consumers, secondary consumers, apex predators)
- Energy amount (decreases at each level)
- Species at each level
- Total ecosystem energy

**🟡 Intermediate:**

Each trophic level shows:
- Total biomass at that level
- Number of species
- Energy transfer efficiency
- Stability indicators

**🔴 Advanced:**

Trophic levels are computed from:
- Species consumption data
- Energy transfer efficiency
- Population dynamics
- Metabolic scaling laws

### Step 3: Understanding Network View

**🟢 Beginner:**

The network view shows who eats whom:

```
Plants ──► Rabbits ──► Wolves ──► (Nothing eats wolves)
  ▲         ▲           ▲
  |         |           |
Algae ──► Fish ──► Bears ──► (Nothing eats bears)
```

**🟡 Intermediate:**

Network view shows:
- Species connections (who eats whom)
- Connection strength (how much energy flows)
- Alternative food sources
- Critical dependencies

**🔴 Advanced:**

Network is computed from:
- Species diet data
- Consumption rates
- Energy transfer efficiency
- Biomass flow models

### Step 4: Identifying Energy Bottlenecks

**🟢 Beginner:**

Energy bottlenecks show where energy gets stuck:

```
Plants ──► Rabbits ──► Wolves
  ▲         ▲           ▲
  |         |           |
  └───────┘           (Not enough rabbits for wolves)
```

**🟡 Intermediate:**

Bottleneck indicators include:
- Low transfer efficiency
- Limited food sources
- Population imbalances
- Ecosystem stress

**🔴 Advanced:**

Bottlenecks are identified by:
- Energy flow analysis
- Population ratio calculations
- Stability metrics
- Sensitivity testing

### Step 5: Understanding Cascade Risk

**🟢 Beginner:**

Cascade risk shows what happens if one species disappears:

```
If wolves disappear:
Rabbits increase ──► Plants decrease ──► Ecosystem changes
```

**🟡 Intermediate:**

Cascade risk shows:
- Which species depend on each other
- How changes spread through ecosystem
- Potential collapse points
- Recovery time estimates

**🔴 Advanced:**

Cascade risk is computed using:
- Network centrality measures
- Dependency analysis
- Stability modeling
- Shock simulation

### Step 6: Inspecting Trophic Edges

**🟢 Beginner:**

See the relationship between two species:
1. Click on any connection in the network view
2. View trophic edge details in the inspector panel
3. See who eats whom and how much energy
4. Understand the importance of this connection

**🟡 Intermediate:**

Trophic edge inspection shows:
- Predator and prey species
- Consumption rate
- Energy transfer efficiency
- Seasonal variations
- Alternative prey/predators

**🔴 Advanced:**

Trophic edge data includes:
- Biomass flow rates
- Metabolic efficiency
- Population impact
- Network centrality measures

### Step 7: Simulating Ecological Shocks

**🟢 Beginner:**

See what happens when something changes:
1. Click **"Simulate Shock"**
2. Choose a shock type (species removal, climate change, etc.)
3. Set shock parameters
4. View ecosystem response

**🟡 Intermediate:**

Shock simulation options:
- Species removal (extinction)
- Population change (disease, hunting)
- Climate impact (temperature change)
- Habitat change (deforestation)

**🔴 Advanced:**

Shock simulations use:
- Network propagation models
- Population dynamics
- Energy flow calculations
- Stability analysis

### Step 8: Creating Ecology Hooks

**🟢 Beginner:**

Create interesting stories about ecosystems:
1. Click **"Create Ecology Hook"**
2. Choose a hook type (predator-prey, competition, etc.)
3. Set up the scenario
4. Generate narrative elements

**🟡 Intermediate:**

Ecology hook types:
- Predator-prey relationships
- Competition for resources
- Symbiotic relationships
- Keystone species impacts
- Trophic cascades

**🔴 Advanced:**

Ecology hooks provide:
- Narrative templates
- Scientific backing
- Educational content
- Story integration points

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Food Web** - Who eats whom in an ecosystem
2. **Trophic Level** - Position in the food chain
3. **Producer** - Organism that makes its own food (plants)
4. **Consumer** - Organism that eats other organisms
5. **Energy Transfer** - How energy moves between trophic levels

### 🟡 Intermediate Concepts

1. **Biomass** - Total mass of living organisms
2. **Energy Efficiency** - How much energy passes between levels
3. **Cascade** - When effects spread through ecosystem
4. **Keystone Species** - Species that has large impact on ecosystem

### 🔴 Advanced Concepts

1. **Trophic Network Snapshot** - Complete food web state at one tick
2. **Network Centrality** - How important a species is in the food web
3. **Stability Metrics** - How resistant ecosystem is to change
4. **Shock Propagation** - How disturbances spread through ecosystem

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Food Web Dashboard
- [ ] I can read the trophic pyramid
- [ ] I understand who eats whom
- [ ] I can identify energy bottlenecks
- [ ] I can simulate a simple shock

### 🟡 Intermediate Checkpoints

- [ ] I can interpret energy transfer efficiency
- [ ] I understand cascade risk
- [ ] I can inspect trophic edges
- [ ] I can create ecology hooks
- [ ] I can explain ecosystem stability

### 🔴 Advanced Checkpoints

- [ ] I understand trophic network snapshot system
- [ ] I can explain how cascade risk is calculated
- [ ] I understand network centrality measures
- [ ] I can use the dashboard for ecosystem management
- [ ] I understand the relationship between food webs and other domains

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/03-biology.md`](../onboard/03-biology.md) - Species, Evolution, and Ecosystems
- [`docs/onboard/02-planetary-physics.md`](../onboard/02-planetary-physics.md) - Climate, Carbon Cycle, and Geology

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/11-inspector-panel.md`](../onboard/11-inspector-panel.md) - Inspector Panel

### Diagrams
- [`docs/onboard/diagrams/05-trophic-energy.svg`](../onboard/diagrams/05-trophic-energy.svg) - Trophic Energy

---

## Reference to UI/UX Spec

For technical details about the Food Web / Trophic Dashboard, see:
- [`docs/ui-ux/17-food-web-dashboard-spec.md`](./17-food-web-dashboard-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Analyze Energy Flow

1. Open the Food Web Dashboard
2. Look at the trophic pyramid
3. Identify energy levels and biomass
4. Note energy transfer efficiency
5. Find potential bottlenecks

### Task 2: Identify Keystone Species

1. Look at the network view
2. Find species with many connections
3. Check cascade risk if they disappear
4. Identify which species are most important
5. Consider protection strategies

### Task 3: Simulate Species Removal

1. Click "Simulate Shock"
2. Choose species removal
3. Select a species to remove
4. View ecosystem response
5. Analyze cascade effects

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with the trophic pyramid - it gives you the big picture
- Follow the energy flow from bottom to top
- Look for bottlenecks - they show ecosystem problems
- Use shock simulations to understand ecosystem fragility

### 🟡 Intermediate Tips
- Pay attention to energy transfer efficiency - most energy is lost
- Consider cascade risk when assessing species importance
- Use trophic edge inspection for detailed relationships
- Create ecology hooks for engaging stories

### 🔴 Advanced Tips
- Understand network centrality when identifying keystone species
- Consider stability metrics when assessing ecosystem health
- Use the dashboard for ecosystem management experiments
- Combine with other dashboards for comprehensive analysis

---

## Troubleshooting

### Issue: Trophic pyramid shows "Loading..."

**Solution:**
- Check if the simulation is running
- Verify species data is computed
- Try refreshing the dashboard

### Issue: Network view is not visible

**Solution:**
- Check if species relationships are defined
- Verify network overlay is active
- Adjust visualization settings

### Issue: Shock simulation fails

**Solution:**
- Verify species are selected
- Check if ecosystem model is initialized
- Review error message for specific issue

---

## Next Steps

After mastering the Food Web / Trophic Dashboard, explore:
- [`44-onboarding-biome-stability.md`](./44-onboarding-biome-stability.md) - Biome Stability Atlas
- [`45-onboarding-species-viewer.md`](./45-onboarding-species-viewer.md) - Species Viewer
- [`47-onboarding-invasive-disease.md`](./47-onboarding-invasive-disease.md) - Invasive & Disease Watch

---

## Glossary

| Term | Definition |
|------|------------|
| **Food Web** - Who eats whom in an ecosystem |
| **Trophic Level** - Position in the food chain |
| **Producer** - Organism that makes its own food (plants) |
| **Consumer** - Organism that eats other organisms |
| **Energy Transfer** - How energy moves between trophic levels |
| **Biomass** - Total mass of living organisms |
| **Energy Efficiency** - How much energy passes between levels |
| **Cascade** - When effects spread through ecosystem |
| **Keystone Species** - Species that has large impact on ecosystem |
| **Network Centrality** - How important a species is in the food web |
| **Stability Metrics** - How resistant ecosystem is to change |
| **Shock Propagation** - How disturbances spread through ecosystem |
