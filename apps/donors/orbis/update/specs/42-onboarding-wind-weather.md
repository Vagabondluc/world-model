# Wind & Weather Viewer Onboarding Guide

## Overview

The Wind & Weather Viewer provides detailed information about wind patterns, weather systems, and seasonal variations on your planet. It helps you understand how atmospheric circulation affects climate and life.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what the Wind & Weather Viewer shows
- Learn to read wind vector arrows
- Identify storm lanes and weather patterns
- Understand seasonal weather changes

### 🟡 Intermediate (Ages 16-18)
- Understand wind patterns and atmospheric circulation
- Interpret seasonal overlays
- Project drought corridors
- Use the viewer for weather analysis

### 🔴 Advanced (Ages 19-99)
- Understand the wind field snapshot system
- Interpret complex weather systems
- Use the viewer for climate modeling
- Understand the relationship between wind and other domains

---

## Step-by-Step Walkthrough

### Step 1: Opening the Wind & Weather Viewer

1. From the main dashboard, click on **Wind & Weather Viewer** in the navigation menu
2. The viewer will load with a snapshot of current wind and weather conditions
3. You'll see three main sections:
   - **Wind Map** (top): Vector field showing wind direction and speed
   - **Weather Patterns** (middle): Storm lanes and seasonal overlays
   - **Action Panel** (bottom): Commands and projections

### Step 2: Reading Wind Vectors

**🟢 Beginner:**

Wind vectors show wind direction and speed:

| Arrow Direction | Meaning | Typical Speed |
|-----------------|---------|---------------|
| → Eastward | Wind blowing east | 5-20 m/s |
| ← Westward | Wind blowing west | 5-20 m/s |
| ↑ Northward | Wind blowing north | 5-20 m/s |
| ↓ Southward | Wind blowing south | 5-20 m/s |

**🟡 Intermediate:**

Each wind vector shows:
- Direction (arrow points where wind is going)
- Speed (arrow length and color)
- Altitude (which layer of atmosphere)
- Time (current or historical)

**🔴 Advanced:**

Wind vectors are computed from:
- Pressure gradients
- Coriolis effect
- Friction with surface
- Thermal gradients

### Step 3: Understanding Storm Lanes

**🟢 Beginner:**

Storm lanes show where storms typically form and travel:

```
Storm Lane:  ───────────────────────────────────►
             (formation)  (intensification)  (dissipation)
```

**🟡 Intermediate:**

Storm lanes show:
- Formation zones (where storms start)
- Travel paths (where storms go)
- Dissipation zones (where storms end)
- Seasonal variations (how lanes change by season)

**🔴 Advanced:**

Storm lanes are determined by:
- Temperature gradients
- Jet stream positions
- Ocean temperature patterns
- Topographic effects

### Step 4: Using Seasonal Overlays

**🟢 Beginner:**

See how weather changes by season:
1. Click **"Toggle Season"**
2. Choose a season (Spring, Summer, Fall, Winter)
3. View wind patterns for that season
4. Compare to other seasons

**🟡 Intermediate:**

Seasonal overlays show:
- Average wind patterns
- Typical storm tracks
- Temperature anomalies
- Precipitation patterns

**🔴 Advanced:**

Seasonal variations are computed from:
- Historical data over many years
- Statistical averages
- Climate oscillation patterns
- Orbital parameters

### Step 5: Inspecting Cell Wind

**🟢 Beginner:**

See wind at a specific location:
1. Click on any hex on the map
2. View wind details in the inspector panel
3. See direction, speed, and altitude
4. Compare to surrounding cells

**🟡 Intermediate:**

Cell wind inspection shows:
- Wind vector components (u, v, w)
- Speed and direction
- Altitude profile
- Time series data

**🔴 Advanced:**

Cell wind data includes:
- Full 3D wind vector
- Turbulence metrics
- Shear calculations
- Vertical velocity

### Step 6: Projecting Drought Corridors

**🟢 Beginner:**

See where drought might occur:
1. Click **"Project Drought Corridor"**
2. Choose a time horizon (10, 50, 100 years)
3. View projected drought areas
4. Compare to current conditions

**🟡 Intermediate:**

Drought projection options:
- Time horizon (10, 50, 100, 500 years)
- Scenario selection (baseline, dry, wet)
- Confidence level adjustment
- Export results

**🔴 Advanced:**

Drought projections use:
- Precipitation models
- Evaporation calculations
- Soil moisture tracking
- Vegetation feedback

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Wind Vector** - An arrow showing wind direction and speed
2. **Storm Lane** - The path storms typically follow
3. **Seasonal Overlay** - Weather patterns for a specific season
4. **Drought** - A long period with little or no rain

### 🟡 Intermediate Concepts

1. **Atmospheric Circulation** - Large-scale movement of air
2. **Jet Stream** - Fast-flowing air currents in the upper atmosphere
3. **Pressure Gradient** - Difference in air pressure that causes wind
4. **Coriolis Effect** - How Earth's rotation affects moving air

### 🔴 Advanced Concepts

1. **Wind Field Snapshot** - Complete wind state at one tick
2. **Turbulence** - Chaotic, irregular air motion
3. **Wind Shear** - Change in wind speed or direction with height
4. **Vertical Velocity** - Upward or downward motion of air

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Wind & Weather Viewer
- [ ] I can read wind vector arrows
- [ ] I understand what a storm lane is
- [ ] I can toggle between seasons
- [ ] I can inspect wind at a specific location

### 🟡 Intermediate Checkpoints

- [ ] I can interpret wind speed from vector length
- [ ] I understand how storm lanes form
- [ ] I can compare seasonal patterns
- [ ] I can project drought corridors
- [ ] I can identify areas at risk for drought

### 🔴 Advanced Checkpoints

- [ ] I understand the wind field snapshot system
- [ ] I can explain atmospheric circulation patterns
- [ ] I understand how drought projections work
- [ ] I can use the viewer for climate modeling
- [ ] I understand the relationship between wind and other domains

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/02-planetary-physics.md`](../onboard/02-planetary-physics.md) - Climate, Carbon Cycle, and Geology
- [`docs/onboard/03-biology.md`](../onboard/03-biology.md) - Species, Evolution, and Ecosystems

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/08-view-modes.md`](../onboard/08-view-modes.md) - View Modes

### Diagrams
- [`docs/onboard/diagrams/03-climate-system.svg`](../onboard/diagrams/03-climate-system.svg) - Climate System

---

## Reference to UI/UX Spec

For technical details about the Wind & Weather Viewer, see:
- [`docs/ui-ux/13-wind-weather-viewer-spec.md`](./13-wind-weather-viewer-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Check Wind Patterns

1. Open Wind & Weather Viewer
2. Look at wind vector arrows
3. Identify prevailing wind direction
4. Note areas of high and low wind speed
5. Compare to seasonal patterns

### Task 2: Track Storm Lanes

1. Identify storm lanes on the map
2. Toggle between seasons to see changes
3. Note formation and dissipation zones
4. Project how lanes might change over time
5. Consider impacts on settlements

### Task 3: Assess Drought Risk

1. Click "Project Drought Corridor"
2. Choose time horizon and scenario
3. View projected drought areas
4. Compare to current conditions
5. Identify areas at highest risk

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with the wind map - it gives you the big picture
- Remember that wind blows from high to low pressure
- Use seasonal overlays to understand weather patterns
- Project drought corridors to see future problems

### 🟡 Intermediate Tips
- Pay attention to jet stream positions
- Consider how topography affects wind patterns
- Use multiple scenarios for drought projections
- Compare wind patterns to temperature and precipitation

### 🔴 Advanced Tips
- Understand the Coriolis effect when analyzing wind
- Consider atmospheric pressure when interpreting wind patterns
- Use the viewer for climate modeling experiments
- Combine with other dashboards for comprehensive analysis

---

## Troubleshooting

### Issue: Wind vectors show "Loading..."

**Solution:**
- Check if the simulation is running
- Verify wind field is computed
- Try refreshing the viewer

### Issue: Storm lanes are not visible

**Solution:**
- Check if storms have formed in the simulation
- Verify seasonal overlay is active
- Adjust visualization settings

### Issue: Drought projection fails

**Solution:**
- Check if precipitation data is available
- Verify soil moisture is tracked
- Review error message for specific issue

---

## Next Steps

After mastering the Wind & Weather Viewer, explore:
- [`40-onboarding-planet-pulse.md`](./40-onboarding-planet-pulse.md) - Planet Pulse Dashboard
- [`41-onboarding-atmosphere-console.md`](./41-onboarding-atmosphere-console.md) - Atmosphere Console
- [`43-onboarding-ocean-currents.md`](./43-onboarding-ocean-currents.md) - Ocean Currents Viewer

---

## Glossary

| Term | Definition |
|------|------------|
| **Wind Vector** - An arrow showing wind direction and speed |
| **Storm Lane** - The path storms typically follow |
| **Atmospheric Circulation** - Large-scale movement of air |
| **Jet Stream** - Fast-flowing air currents in the upper atmosphere |
| **Pressure Gradient** - Difference in air pressure that causes wind |
| **Coriolis Effect** - How Earth's rotation affects moving air |
| **Drought** - A long period with little or no rain |
| **Wind Shear** - Change in wind speed or direction with height |
