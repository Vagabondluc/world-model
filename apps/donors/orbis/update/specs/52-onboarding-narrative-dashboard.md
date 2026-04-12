# Narrative Dashboard Onboarding Guide

## Overview

The Narrative Dashboard is a story-first orchestration layer over the simulation, designed for TTRPG DMs and novelists. It provides high-level narrative actions, consequence previews, and supports canon-safe timeline planning for creating compelling stories.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what the Narrative Dashboard offers for storytelling
- Learn to navigate between different narrative tools
- Identify basic story elements in your world
- Use the dashboard to create simple narrative events

### 🟡 Intermediate (Ages 16-18)
- Understand the relationship between sandbox and canon modes
- Use consequence previews effectively
- Plan narrative arcs across multiple tools
- Manage story continuity and consistency

### 🔴 Advanced (Ages 19-99)
- Understand the underlying narrative action system
- Use the dashboard for complex, multi-threaded storytelling
- Leverage deterministic narrative planning
- Integrate narrative tools with simulation systems

---

## Step-by-Step Walkthrough

### Step 1: Opening the Narrative Dashboard

1. From the main dashboard, click on **Narrative Dashboard** in the navigation menu
2. The dashboard will load with a story-centric interface
3. You'll see access to multiple narrative tools:
   - **Story Director** - Central narrative control
   - **Event Forge** - Create world events
   - **Species Studio** - Design new species
   - **Arc Composer** - Plan story arcs
   - **Region Story Cards** - Generate story hooks

### Step 2: Understanding Sandbox vs. Canon Mode

**🟢 Beginner:**

Two modes for working with stories:

| Mode | Purpose | When to Use |
|-------|---------|-------------|
| Sandbox | Experiment safely | When trying out ideas |
| Canon | Save to timeline | When ready to commit |

**🟡 Intermediate:**

Key differences between modes:
- **Sandbox**: Changes are reversible, no commitment required
- **Canon**: Changes become permanent part of world history
- **Preview**: Always available to see consequences before acting
- **Confirmation**: Canon mode requires explicit confirmation

**🔴 Advanced:**

Mode mechanics are governed by:
```ts
type NarrativeUxImpactLevel = "low" | "medium" | "high" | "critical"

interface NarrativeUxActionDef {
  actionId: string
  label: string
  viewId: NarrativeUxViewId
  requiresConfirmation: boolean
  impactLevel: NarrativeUxImpactLevel
  payloadSchemaId: string
}
```

### Step 3: Using the Story Director

**🟢 Beginner:**

The Story Director helps you:
- See what's happening in your world
- Find interesting story opportunities
- Keep track of ongoing narratives
- Jump to specific narrative tools

**🟡 Intermediate:**

Story Director features include:
- **World Overview**: Current state of all major story elements
- **Active Threads**: Ongoing narratives and their status
- **Story Opportunities**: Suggestions for new story directions
- **Timeline View**: Chronological view of story events

**🔴 Advanced:**

Story Director uses:
- Narrative state tracking across all domains
- Causal relationship mapping
- Thematic analysis
- Character/faction relationship tracking
- Plot convergence detection

### Step 4: Previewing Narrative Consequences

**🟢 Beginner:**

Before making story changes:
1. Choose an action you want to take
2. Look at the preview panel
3. See what might happen
4. Decide whether to proceed

**🟡 Intermediate:**

Consequence previews show:
- **Direct Effects**: Immediate results of your action
- **Cascade Effects**: Secondary consequences
- **Long-Tail Effects**: Distant future impacts
- **Confidence Level**: How certain we are about predictions

**🔴 Advanced:**

Preview system uses:
```ts
interface NarrativeUxConsequencePreview {
  directEffects: string[]
  cascadeEffects: string[]
  longTailEffects: string[]
  confidence: "low" | "medium" | "high"
  riskFlags: string[]
}
```

### Step 5: Managing Canon Safety

**🟢 Beginner:**

Keep your story consistent:
- Use preview before committing to canon
- Check for conflicts with existing story
- Make backup saves before big changes
- Use confirmation phrases carefully

**🟡 Intermediate:**

Canon safety features include:
- **Conflict Detection**: Warns about contradictions
- **Checkpoint System**: Save points for recovery
- **Revision Tracking**: History of all changes
- **Fork Support**: Create alternate timelines

**🔴 Advanced:**

Canon management uses:
- Deterministic conflict resolution
- Atomic transaction semantics
- Revision conflict detection
- Timeline fork mechanics
- Canon lock enforcement

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Narrative Dashboard** - Central hub for storytelling tools
2. **Sandbox Mode** - Safe place to experiment with story ideas
3. **Canon Mode** - Permanent changes to world history
4. **Story Director** - Overview and control of all narrative elements

### 🟡 Intermediate Concepts

1. **Consequence Preview** - Prediction of what will happen from story actions
2. **Narrative Impact** - How much a change affects the world
3. **Canon Safety** - Rules that prevent story contradictions
4. **Timeline Planning** - Organizing events in chronological order

### 🔴 Advanced Concepts

1. **Deterministic Narrative** - Same inputs always produce same story outcomes
2. **Atomic Transactions** - Changes that either fully succeed or fully fail
3. **Revision Tracking** - Complete history of all narrative changes
4. **Timeline Forking** - Creating alternate versions of story history

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Narrative Dashboard
- [ ] I understand the difference between sandbox and canon mode
- [ ] I can navigate to all narrative tools
- [ ] I can use the consequence preview
- [ ] I know how to keep my story consistent

### 🟡 Intermediate Checkpoints

- [ ] I understand narrative impact levels
- [ ] I can use the Story Director effectively
- [ ] I can interpret consequence previews
- [ ] I understand canon safety features
- [ ] I can plan multi-tool narrative arcs

### 🔴 Advanced Checkpoints

- [ ] I understand the narrative action system
- [ ] I can manage complex story continuity
- [ ] I understand deterministic narrative planning
- [ ] I can use timeline forking effectively
- [ ] I can integrate narrative with simulation systems

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Civilization: Settlements, Trade, and Behavior
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/11-inspector-panel.md`](../onboard/11-inspector-panel.md) - Inspector Panel

### Diagrams
- [`docs/onboard/diagrams/`](../onboard/diagrams/) - Various narrative and storytelling diagrams

---

## Reference to UI/UX Spec

For technical details about the Narrative Dashboard, see:
- [`docs/ui-ux/05-narrative-dashboard-spec.md`](./05-narrative-dashboard-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Start a New Story

1. Open Narrative Dashboard
2. Switch to Sandbox mode
3. Use Story Director to identify interesting elements
4. Create an initial event or character
5. Preview consequences before proceeding

### Task 2: Plan a Story Arc

1. Use Arc Composer to outline major plot points
2. Create related events in Event Forge
3. Design new species or factions if needed
4. Use Region Story Cards for location details
5. Preview the entire arc before committing

### Task 3: Maintain Story Consistency

1. Regularly check Story Director for conflicts
2. Use consequence preview for major changes
3. Keep checkpoints before risky actions
4. Verify character motivations remain consistent
5. Use canon mode only when ready

---

## Tips and Tricks

### 🟢 Beginner Tips
- Always start in Sandbox mode to experiment
- Use the consequence preview before making changes
- Save checkpoints before major story developments
- Keep notes on character motivations and goals

### 🟡 Intermediate Tips
- Plan story arcs across multiple tools
- Use the Story Director to find narrative opportunities
- Check for conflicts before committing to canon
- Leverage the revision history to track changes

### 🔴 Advanced Tips
- Use deterministic planning for reproducible story outcomes
- Create timeline forks to explore alternative story paths
- Integrate simulation events for realistic world responses
- Use the full narrative tool suite for complex storytelling

---

## Troubleshooting

### Issue: Dashboard shows "Loading..." indefinitely

**Solution:**
- Check if the narrative domain is initialized
- Verify world state is valid
- Try refreshing the dashboard

### Issue: Canon commit fails with error

**Solution:**
- Check for conflicts with existing story
- Verify you have the required checkpoints
- Review error message for specific issue

### Issue: Consequence preview seems inaccurate

**Solution:**
- Check confidence level - low confidence means uncertainty
- Verify tick number is current
- Review underlying assumptions in the preview

---

## Next Steps

After mastering the Narrative Dashboard, explore:
- [`53-onboarding-event-forge.md`](./53-onboarding-event-forge.md) - Event Forge
- [`54-onboarding-species-studio.md`](./54-onboarding-species-studio.md) - Species & Race Studio
- [`55-onboarding-arc-composer.md`](./55-onboarding-arc-composer.md) - Arc Composer
- [`56-onboarding-region-story-cards.md`](./56-onboarding-region-story-cards.md) - Region Story Cards

---

## Glossary

| Term | Definition |
|------|------------|
| **Narrative Dashboard** | Central hub for all storytelling tools in Orbis |
| **Sandbox Mode** | Safe experimental environment for trying story ideas |
| **Canon Mode** | Permanent changes that become part of world history |
| **Story Director** | Overview and control center for narrative elements |
| **Consequence Preview** | Prediction of effects from narrative actions |
| **Narrative Impact** | The magnitude of change a story action creates |
| **Canon Safety** | Rules and systems that prevent story contradictions |
| **Timeline Planning** | Organizing story events in chronological order |
| **Deterministic** | Same inputs always produce same outputs |
| **Revision Tracking** | Complete history of all changes to the narrative |