# Event Forge Onboarding Guide

## Overview

The Event Forge provides deterministic, preview-first authoring of forced events for both sandbox experimentation and canon storytelling. With support for at least 24 event types across six families (Environmental, Biological, Political, Economic, Cultural/Religious, and Infrastructure), it's your primary tool for creating dramatic moments in your world.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what Event Forge does and when to use it
- Learn to create basic events like disasters or conflicts
- Use the preview system to see event consequences
- Apply events in sandbox mode safely

### 🟡 Intermediate (Ages 16-18)
- Understand all six event families and their effects
- Chain multiple events together for complex scenarios
- Use intensity and duration parameters effectively
- Transition events from sandbox to canon mode

### 🔴 Advanced (Ages 19-99)
- Master the deterministic event system
- Create complex event chains with precise timing
- Understand the revision and conflict system
- Use Event Forge for sophisticated narrative control

---

## Step-by-Step Walkthrough

### Step 1: Opening Event Forge

1. From the Narrative Dashboard, click on **Event Forge** in the navigation menu
2. The Event Forge will load with the event creation interface
3. You'll see three main sections:
   - **Event Catalog** (left): Available event types by family
   - **Event Configuration** (center): Parameters and targeting
   - **Preview Panel** (right): Consequence analysis

### Step 2: Choosing an Event Type

**🟢 Beginner:**

Event Forge offers six families of events:

| Family | Examples | When to Use |
|---------|-----------|--------------|
| Environmental | Meteor strike, volcanic eruption | Natural disasters |
| Biological | Plague, invasive species | Disease and ecological change |
| Political | Civil war, border incident | Conflict and political change |
| Economic | Trade collapse, currency shock | Financial crises |
| Cultural/Religious | Religious schism, cultural renaissance | Social and belief changes |
| Infrastructure | Dam failure, grid blackout | Technology and structure problems |

**🟡 Intermediate:**

Each event family has specific characteristics:
- **Environmental**: Affects geography, climate, and habitats
- **Biological**: Impacts species, populations, and ecosystems
- **Political**: Changes factions, governments, and borders
- **Economic**: Alters trade, resources, and wealth
- **Cultural**: Transforms beliefs, arts, and social norms
- **Infrastructure**: Affects buildings, transportation, and utilities

**🔴 Advanced:**

Event selection is governed by:
```ts
interface EventForgeCommand {
  commandId: string
  eventType: EventForgeEventType
  intensityPPM: number
  durationTicks: number
  target: EventForgeTargetRegion
  applyAtTick?: number
  chainAfterCommandId?: string
  canonMode: boolean
}
```

### Step 3: Configuring Event Parameters

**🟢 Beginner:**

Basic event parameters:
- **Intensity**: How strong the event is (0-1,000,000 PPM)
- **Duration**: How long the event lasts (in ticks)
- **Target**: Where the event will occur
- **Timing**: When the event should happen

**🟡 Intermediate:**

Advanced parameter considerations:
- **Intensity scaling**: Higher PPM = more dramatic effects
- **Duration planning**: Longer events have more lasting impact
- **Target precision**: Center point vs. regional area
- **Chaining**: Linking events for complex scenarios
- **Timing control**: Immediate vs. scheduled events

**🔴 Advanced:**

Parameter mechanics:
- **PPM (Parts Per Million)**: Standardized intensity measurement
- **Tick-based duration**: Precise temporal control
- **Geographic targeting**: Center cell and radius options
- **Event chaining**: Acyclic dependency graphs
- **Canon vs. Sandbox**: Different validation rules

### Step 4: Targeting Events

**🟢 Beginner:**

Choose where events happen:
1. Click on the world map to select a location
2. Adjust the radius if needed
3. See which regions will be affected
4. Confirm your target selection

**🟡 Intermediate:**

Targeting options include:
- **Point targeting**: Specific cell or location
- **Area targeting**: Circular region with radius
- **Multi-region**: Multiple connected areas
- **Global events**: World-wide phenomena
- **Chain targeting**: Events that follow previous ones

**🔴 Advanced:**

Targeting system uses:
```ts
interface EventForgeTargetRegion {
  regionId: string
  centerCellId?: number
  radiusCells?: number
}
```

### Step 5: Previewing Event Consequences

**🟢 Beginner:**

See what will happen before committing:
1. Click **"Preview Event"**
2. Review the impact analysis
3. Check for warnings or risks
4. Decide whether to apply the event

**🟡 Intermediate:**

Preview details include:
- **Casualties**: Expected population impact (in PPM range)
- **Biome Damage**: Environmental effects (in PPM range)
- **Migration Pressure**: Population displacement (in PPM range)
- **Recovery Time**: How long to return to normal
- **Risk Flags**: Special warnings or concerns

**🔴 Advanced:**

Preview system uses:
```ts
interface EventForgePreview {
  expectedCasualtiesBandPPM: [number, number]
  expectedBiomeDamageBandPPM: [number, number]
  expectedMigrationPressureBandPPM: [number, number]
  expectedRecoveryTicksBand: [number, number]
  riskFlags: string[]
}
```

### Step 6: Applying Events

**🟢 Beginner:**

Apply your event:
1. Choose **Sandbox** or **Canon** mode
2. Click **"Queue Event"** or **"Commit Event Canon"**
3. Wait for the event to process
4. Watch the effects unfold in the world

**🟡 Intermediate:**

Application considerations:
- **Sandbox mode**: Safe experimentation, reversible
- **Canon mode**: Permanent change, requires confirmation
- **Event timing**: Immediate vs. scheduled application
- **Chain execution**: Sequential event processing
- **Revision tracking**: History of all applied events

**🔴 Advanced:**

Application system uses:
- Deterministic event processing
- Revision conflict detection
- Canon lock enforcement
- Event queue management
- Rollback capabilities in sandbox

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Event Forge** - Tool for creating dramatic events in your world
2. **Event Family** - Category of similar events (environmental, political, etc.)
3. **Intensity** - How strong or severe an event is
4. **Sandbox Mode** - Safe place to test events without permanent effects

### 🟡 Intermediate Concepts

1. **Event Chaining** - Linking events so one triggers another
2. **PPM (Parts Per Million)** - Standardized measurement for event intensity
3. **Target Region** - The geographic area affected by an event
4. **Preview System** - Shows consequences before applying events

### 🔴 Advanced Concepts

1. **Deterministic Events** - Same parameters always produce same results
2. **Revision Tracking** - Complete history of all event changes
3. **Canon Lock** - Prevents changes to committed story elements
4. **Event Queue** - System for managing scheduled or chained events

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Event Forge and understand the interface
- [ ] I can create a basic event like a flood or drought
- [ ] I understand the difference between sandbox and canon mode
- [ ] I can use the preview system before applying events
- [ ] I can target events to specific locations

### 🟡 Intermediate Checkpoints

- [ ] I understand all six event families and their effects
- [ ] I can chain multiple events together
- [ ] I can adjust intensity and duration parameters effectively
- [ ] I understand how to transition events to canon mode
- [ ] I can interpret preview consequences

### 🔴 Advanced Checkpoints

- [ ] I understand the deterministic event system
- [ ] I can create complex event chains with precise timing
- [ ] I understand the revision and conflict system
- [ ] I can use Event Forge for sophisticated narrative control
- [ ] I understand the technical implementation of events

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Civilization: Settlements, Trade, and Behavior
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`52-onboarding-narrative-dashboard.md`](./52-onboarding-narrative-dashboard.md) - Narrative Dashboard

### Diagrams
- [`docs/onboard/diagrams/`](../onboard/diagrams/) - Various event and disaster diagrams

---

## Reference to UI/UX Spec

For technical details about Event Forge, see:
- [`docs/ui-ux/06-event-forge-spec.md`](./06-event-forge-spec.md) - Event Forge v1
- [`docs/ui-ux/23-event-forge-v2-spec.md`](./23-event-forge-v2-spec.md) - Event Forge v2

These specs include:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Create a Natural Disaster

1. Open Event Forge and select Environmental family
2. Choose "meteor_strike" or "volcanic_eruption"
3. Set intensity (try 100,000 PPM for a moderate event)
4. Target a specific region on the map
5. Preview consequences before applying

### Task 2: Chain Multiple Events

1. Create an initial event (e.g., drought)
2. Note the command ID
3. Create a follow-up event (e.g., plague)
4. Set it to chain after the first event
5. Preview the combined effects

### Task 3: Apply an Event to Canon

1. Create and preview an event in sandbox
2. Verify the consequences are what you want
3. Switch to canon mode
4. Use "COMMIT_CANON" confirmation phrase
5. Apply the event permanently

---

## Tips and Tricks

### 🟢 Beginner Tips
- Always preview events before applying them
- Start with lower intensity events to understand effects
- Use sandbox mode for experimentation
- Target unpopulated areas first to test

### 🟡 Intermediate Tips
- Chain events to create complex scenarios
- Adjust duration for long-term vs. immediate effects
- Consider the recovery time when setting intensity
- Use risk flags to avoid unintended consequences

### 🔴 Advanced Tips
- Master PPM calculations for precise control
- Use event timing for narrative pacing
- Create event libraries for recurring scenarios
- Leverage the deterministic system for reproducible stories

---

## Troubleshooting

### Issue: Event creation fails with validation error

**Solution:**
- Check intensity is within 0-1,000,000 PPM range
- Verify duration is at least 1 tick
- Ensure target region is valid
- Review error message for specific issue

### Issue: Event preview seems inaccurate

**Solution:**
- Check confidence level in preview
- Verify world state is current
- Review underlying assumptions
- Try different intensity levels

### Issue: Canon commit rejected

**Solution:**
- Verify you have the required checkpoints
- Check for revision conflicts
- Ensure proper confirmation phrase
- Review reason code for specific issue

---

## Next Steps

After mastering Event Forge, explore:
- [`52-onboarding-narrative-dashboard.md`](./52-onboarding-narrative-dashboard.md) - Narrative Dashboard
- [`54-onboarding-species-studio.md`](./54-onboarding-species-studio.md) - Species & Race Studio
- [`55-onboarding-arc-composer.md`](./55-onboarding-arc-composer.md) - Arc Composer
- [`56-onboarding-region-story-cards.md`](./56-onboarding-region-story-cards.md) - Region Story Cards

---

## Glossary

| Term | Definition |
|------|------------|
| **Event Forge** | Tool for creating and applying dramatic events to the world |
| **Event Family** | Category of similar events (environmental, biological, etc.) |
| **PPM (Parts Per Million)** | Standardized measurement for event intensity and effects |
| **Event Chaining** | Linking events so one triggers another in sequence |
| **Sandbox Mode** | Safe experimental environment for testing events |
| **Canon Mode** | Permanent application of events to world history |
| **Preview System** | Shows predicted consequences before applying events |
| **Deterministic** | Same parameters always produce same results |
| **Revision Tracking** | Complete history of all event changes |
| **Canon Lock** | Prevents changes to committed story elements |