# Invasive Species & Disease Watch Onboarding Guide

## Overview

The Invasive Species & Disease Watch provides detailed information about biological threats on your planet. It helps you track invasive species spread, disease outbreaks, and their impacts on native ecosystems.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what Invasive Species & Disease Watch shows
- Learn to read spread maps
- Identify vulnerable species
- Understand quarantine policies
- Track ETA bands for threats

### 🟡 Intermediate (Ages 16-18)
- Understand host vulnerability matrices
- Interpret spread path projections
- Trigger response events
- Inspect spread pathways

### 🔴 Advanced (Ages 19-99)
- Understand biohazard snapshot system
- Interpret complex invasion dynamics
- Use watch for biosecurity planning
- Understand relationship between biological threats and other domains

---

## Step-by-Step Walkthrough

### Step 1: Opening the Invasive Species & Disease Watch

1. From the main dashboard, click on **Invasive Species & Disease Watch** in the navigation menu
2. The watch will load with a snapshot of current biological threats
3. You'll see three main sections:
   - **Threat Map** (top): Spread of invasive species and diseases
   - **Vulnerability Analysis** (middle): Species at risk
   - **Action Panel** (bottom): Commands and response tools

### Step 2: Reading Spread Maps

**🟢 Beginner:**

The spread map shows where threats are located and moving:

| Color | Meaning | Example |
|-------|---------|---------|
| 🔴 Red | Active outbreak/invasion | Spreading rapidly |
| 🟠 Orange | Emerging threat | Starting to spread |
| 🟡 Yellow | Contained threat | Under control |
| 🟢 Green | Clear area | No threats detected |

**🟡 Intermediate:**

Each threat area shows:
- Threat type (invasive species, disease, parasite)
- Spread rate (how fast it's moving)
- Containment status
- Affected species count

**🔴 Advanced:**

Spread is computed from:
- Infection/invasion models
- Species distribution data
- Environmental suitability
- Transport pathways

### Step 3: Understanding Host Vulnerability

**🟢 Beginner:**

Host vulnerability shows which species are at risk:

```
Vulnerable Species: 🦌🦌🦌🦌
                 (These species need protection)
```

**🟡 Intermediate:**

Vulnerability factors include:
- Natural immunity
- Population density
- Habitat overlap with threat
- Life history traits

**🔴 Advanced:**

Vulnerability is calculated using:
- Species-threat interaction models
- Immunological data
- Population genetics
- Historical exposure records

### Step 4: Tracking ETA Bands

**🟢 Beginner:**

ETA bands show when threats might reach new areas:

```
Current Threat ────────► ETA Band 1 ────────► ETA Band 2
    (Here)              (1 year away)          (2 years away)
```

**🟡 Intermediate:**

ETA bands show:
- Time to arrival
- Confidence intervals
- Affected areas
- Uncertainty factors

**🔴 Advanced:**

ETA projections use:
- Spread rate models
- Environmental resistance
- Transport network analysis
- Monte Carlo simulations

### Step 5: Inspecting Spread Paths

**🟢 Beginner:**

See how threats are spreading:
1. Click on any threat area
2. Click **"Inspect Spread Path"**
3. View pathway details in the inspector panel
4. Understand how threat is moving

**🟡 Intermediate:**

Spread path inspection shows:
- Origin point
- Current locations
- Transport mechanisms
- Environmental barriers
- Future projections

**🔴 Advanced:**

Spread path data includes:
- Vector analysis (how threat moves)
- Habitat connectivity
- Climate suitability
- Human activity factors

### Step 6: Queueing Quarantine Policies

**🟢 Beginner:**

Protect areas from threats:
1. Click on a threat area
2. Click **"Queue Quarantine Policy"**
3. Choose quarantine level (light, medium, strict)
4. Preview the expected outcome
5. Commit the policy

**🟡 Intermediate:**

Quarantine options:
- Travel restrictions
- Trade embargoes
- Monitoring protocols
- Treatment programs
- Vaccination campaigns

**🔴 Advanced:**

Quarantine policies use:
- Epidemiological models
- Economic impact analysis
- Compliance tracking
- Effectiveness metrics

### Step 7: Triggering Response Events

**🟢 Beginner:**

Take action against threats:
1. Click on a threat area
2. Click **"Trigger Response Event"**
3. Choose response type (containment, treatment, eradication)
4. Set response parameters
5. Execute the response

**🟡 Intermediate:**

Response event types:
- Containment barriers
- Treatment deployment
- Eradication programs
- Public education campaigns
- Research initiatives

**🔴 Advanced:**

Response events use:
- Resource optimization models
- Multi-objective planning
- Cost-benefit analysis
- Uncertainty quantification

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Invasive Species** - Organism that spreads to new areas and causes harm
2. **Disease** - Condition that harms living organisms
3. **Quarantine** - Restricting movement to prevent spread
4. **Vulnerability** - How likely a species is to be harmed

### 🟡 Intermediate Concepts

1. **Spread Rate** - How fast a threat moves to new areas
2. **Host Range** - Which species can be affected
3. **Containment** - Keeping a threat in a limited area
4. **Vector** - How a threat spreads (wind, water, animals)

### 🔴 Advanced Concepts

1. **Biohazard Snapshot** - Complete biological threat state at one tick
2. **Epidemiological Model** - Mathematical model of disease spread
3. **Transport Network** - How things move between locations
4. **Compliance Tracking** - Monitoring if rules are followed

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Invasive Species & Disease Watch
- [ ] I can read the spread map
- [ ] I understand what vulnerability means
- [ ] I can identify vulnerable species
- [ ] I can queue a quarantine policy

### 🟡 Intermediate Checkpoints

- [ ] I can interpret ETA bands
- [ ] I understand host vulnerability factors
- [ ] I can inspect spread paths
- [ ] I can trigger response events
- [ ] I can explain quarantine effectiveness

### 🔴 Advanced Checkpoints

- [ ] I understand biohazard snapshot system
- [ ] I can explain how spread models work
- [ ] I understand epidemiological modeling
- [ ] I can use the watch for biosecurity planning
- [ ] I understand the relationship between biological threats and other domains

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/03-biology.md`](../onboard/03-biology.md) - Species, Evolution, and Ecosystems
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Settlements, Trade, and Behavior

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/11-inspector-panel.md`](../onboard/11-inspector-panel.md) - Inspector Panel

### Diagrams
- [`docs/onboard/diagrams/05-trophic-energy.svg`](../onboard/diagrams/05-trophic-energy.svg) - Trophic Energy

---

## Reference to UI/UX Spec

For technical details about the Invasive Species & Disease Watch, see:
- [`docs/ui-ux/18-invasive-disease-watch-spec.md`](./18-invasive-disease-watch-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Monitor Threat Spread

1. Open the Invasive Species & Disease Watch
2. Look at the spread map
3. Identify active threats (red areas)
4. Note spread direction and speed
5. Track ETA bands for future spread

### Task 2: Protect Vulnerable Species

1. Click on vulnerable species
2. Assess vulnerability factors
3. Queue appropriate quarantine policies
4. Monitor policy effectiveness
5. Adjust policies as needed

### Task 3: Respond to Outbreaks

1. Identify an active threat area
2. Click "Trigger Response Event"
3. Choose appropriate response type
4. Set response parameters
5. Monitor response effectiveness

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with the spread map - it gives you the big picture
- Pay attention to red areas - they need immediate action
- Use ETA bands to plan ahead for arriving threats
- Quarantine early to prevent spread

### 🟡 Intermediate Tips
- Consider multiple vulnerability factors when assessing risk
- Use spread path inspection to understand how threats move
- Combine different response types for best results
- Monitor quarantine compliance and effectiveness

### 🔴 Advanced Tips
- Understand epidemiological models when predicting spread
- Consider transport networks when planning containment
- Use the watch for comprehensive biosecurity planning
- Combine with other dashboards for ecosystem analysis

---

## Troubleshooting

### Issue: Spread map shows "Loading..."

**Solution:**
- Check if the simulation is running
- Verify threat data is computed
- Try refreshing the watch

### Issue: ETA bands are not visible

**Solution:**
- Check if spread rate is calculated
- Verify projection models are initialized
- Adjust visualization settings

### Issue: Quarantine policy fails

**Solution:**
- Verify threat area is selected
- Check if policy parameters are valid
- Review error message for specific issue

---

## Next Steps

After mastering the Invasive Species & Disease Watch, explore:
- [`44-onboarding-biome-stability.md`](./44-onboarding-biome-stability.md) - Biome Stability Atlas
- [`45-onboarding-species-viewer.md`](./45-onboarding-species-viewer.md) - Species Viewer
- [`46-onboarding-food-web.md`](./46-onboarding-food-web.md) - Food Web Dashboard

---

## Glossary

| Term | Definition |
|------|------------|
| **Invasive Species** - Organism that spreads to new areas and causes harm |
| **Disease** - Condition that harms living organisms |
| **Quarantine** - Restricting movement to prevent spread |
| **Vulnerability** - How likely a species is to be harmed |
| **Spread Rate** - How fast a threat moves to new areas |
| **Host Range** - Which species can be affected |
| **Containment** - Keeping a threat in a limited area |
| **Vector** - How a threat spreads (wind, water, animals) |
| **Biohazard Snapshot** - Complete biological threat state at one tick |
| **Epidemiological Model** - Mathematical model of disease spread |
| **Transport Network** - How things move between locations |
| **Compliance Tracking** - Monitoring if rules are followed |
