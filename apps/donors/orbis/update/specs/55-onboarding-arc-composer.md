# Arc Composer Onboarding Guide

## Overview

The Arc Composer manages canonical timeline beats with deterministic lock/fork semantics, allowing you to plan and structure story arcs across five phases: setup, escalation, catastrophe, recovery, and aftermath. It's your primary tool for crafting compelling narrative sequences with precise temporal control.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what Arc Composer does and how to structure stories
- Learn to create basic story beats
- Understand the five phases of a story arc
- Use the timeline view to organize events

### 🟡 Intermediate (Ages 16-18)
- Create complex story arcs with multiple beats
- Use canon locking to protect important story elements
- Understand timeline forking for alternate story paths
- Export story arcs for sharing or backup

### 🔴 Advanced (Ages 19-99)
- Master deterministic timeline management
- Use arc composer for complex, multi-threaded narratives
- Understand revision tracking and conflict resolution
- Integrate arcs with other narrative tools

---

## Step-by-Step Walkthrough

### Step 1: Opening Arc Composer

1. From the Narrative Dashboard, click on **Arc Composer** in the navigation menu
2. The composer will load with the timeline interface
3. You'll see three main sections:
   - **Timeline View** (center): Visual story progression
   - **Beat Editor** (left): Create and edit story beats
   - **Export Options** (right): Save and share your arcs

### Step 2: Understanding Story Phases

**🟢 Beginner:**

Every story has five phases:

| Phase | Purpose | Example |
|--------|---------|---------|
| Setup | Introduce characters and situation | "Peaceful village with hidden tensions" |
| Escalation | Build tension and conflict | "Disputes over resources intensify" |
| Catastrophe | The main crisis or climax | "Massive earthquake destroys village" |
| Recovery | Dealing with aftermath | "Survivors struggle to rebuild" |
| Aftermath | New normal or changed world | "New settlement forms from ruins" |

**🟡 Intermediate:**

Phase characteristics:
- **Setup**: Establishes status quo and introduces key elements
- **Escalation**: Raises stakes through increasing conflicts
- **Catastrophe**: The turning point or climax
- **Recovery**: Characters respond to the catastrophe
- **Aftermath**: Resolution and new equilibrium

**🔴 Advanced:**

Phase system uses:
```ts
type ArcComposerPhase = "setup" | "escalation" | "catastrophe" | "recovery" | "aftermath"

interface ArcComposerBeat {
  beatId: string
  tick: number
  phase: ArcComposerPhase
  title: string
  summary: string
  linkedActionIds: string[]
  canonLocked: boolean
}
```

### Step 3: Creating Story Beats

**🟢 Beginner:**

Create your first story beat:
1. Click **"Add Beat"** in the timeline
2. Choose a phase (start with "setup")
3. Enter a title (e.g., "The Village")
4. Write a brief summary
5. Place it on the timeline

**🟡 Intermediate:**

Advanced beat creation:
- **Linked Actions**: Connect to events, species, or regions
- **Timing Control**: Precise tick placement
- **Beat Dependencies**: Ensure proper story flow
- **Multiple Perspectives**: Different character viewpoints
- **Parallel Events**: Things happening simultaneously

**🔴 Advanced:**

Beat mechanics use:
- Deterministic tick-based timing
- Action linking for narrative consistency
- Canon locking for permanent story elements
- Revision tracking for all changes
- Cross-tool integration

### Step 4: Organizing the Timeline

**🟢 Beginner:**

Arrange your story:
1. Drag beats to reorder them
2. Make sure setup comes before escalation
3. Place catastrophe at the dramatic peak
4. End with recovery and aftermath

**🟡 Intermediate:**

Timeline organization features:
- **Visual Timeline**: See story flow at a glance
- **Tick Precision**: Exact timing for each beat
- **Phase Indicators**: Color-coded by story phase
- **Beat Connections**: Visual links between related beats
- **Duration Control**: Set time between beats

**🔴 Advanced:**

Timeline system uses:
```ts
interface ArcComposerTimeline {
  timelineId: string
  worldId: string
  beats: ArcComposerBeat[]
}
```

### Step 5: Using Canon Locking

**🟢 Beginner:**

Protect important story elements:
1. Select a beat you want to protect
2. Click **"Lock Beat"**
3. Confirm you want to lock it
4. Watch the lock icon appear

**🟡 Intermediate:**

Canon locking features:
- **Beat Protection**: Prevents accidental changes
- **Fork Requirement**: Changes need new timeline
- **Visual Indicators**: Clear lock icons
- **Batch Operations**: Lock multiple beats
- **Unlock Process**: Requires explicit confirmation

**🔴 Advanced:**

Canon locking mechanics:
- Immutable beats in-place
- Fork requirement for modifications
- Preservation of story integrity
- Deterministic conflict detection
- Revision tracking across forks

### Step 6: Managing Timeline Forks

**🟢 Beginner:**

Try different story directions:
1. Select a beat where you want to branch
2. Click **"Fork Timeline"**
3. Create alternate beats in the new timeline
4. Switch between timelines to compare

**🟡 Intermediate:**

Fork management includes:
- **Branch Points**: Clear indication where timelines diverge
- **Timeline Switching**: Easy navigation between versions
- **Merge Options**: Combine timelines when possible
- **Fork Metadata**: Track why forks were created
- **Comparison Tools**: See differences between timelines

**🔴 Advanced:**

Fork system uses:
- Parent-child timeline relationships
- Immutable parent preservation
- Deterministic fork operations
- Conflict resolution for merges
- Complete lineage tracking

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Arc Composer** - Tool for planning story arcs
2. **Story Beat** - Single event or scene in a story
3. **Story Phase** - One of five parts of story structure
4. **Timeline** - Chronological arrangement of story beats

### 🟡 Intermediate Concepts

1. **Canon Locking** - Protecting story elements from change
2. **Timeline Forking** - Creating alternate story paths
3. **Beat Linking** - Connecting story beats to other narrative elements
4. **Tick Precision** - Exact timing control for story events

### 🔴 Advanced Concepts

1. **Deterministic Timeline** - Same inputs always produce same story structure
2. **Revision Tracking** - Complete history of all story changes
3. **Conflict Resolution** - Handling competing story changes
4. **Timeline Lineage** - Parent-child relationships between story versions

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Arc Composer and understand the interface
- [ ] I can create basic story beats
- [ ] I understand the five story phases
- [ ] I can organize beats on the timeline
- [ ] I can create a complete story arc

### 🟡 Intermediate Checkpoints

- [ ] I can create complex story arcs with multiple beats
- [ ] I understand canon locking and when to use it
- [ ] I can create and manage timeline forks
- [ ] I can export story arcs
- [ ] I can link beats to other narrative elements

### 🔴 Advanced Checkpoints

- [ ] I understand deterministic timeline management
- [ ] I can create complex, multi-threaded narratives
- [ ] I understand revision tracking and conflict resolution
- [ ] I can integrate arcs with other narrative tools
- [ ] I understand the technical implementation of timeline management

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Civilization: Settlements, Trade, and Behavior
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`52-onboarding-narrative-dashboard.md`](./52-onboarding-narrative-dashboard.md) - Narrative Dashboard

### Diagrams
- [`docs/onboard/diagrams/`](../onboard/diagrams/) - Various narrative structure diagrams

---

## Reference to UI/UX Spec

For technical details about Arc Composer, see:
- [`docs/ui-ux/08-arc-composer-spec.md`](./08-arc-composer-spec.md) - Arc Composer Core
- [`docs/ui-ux/24-arc-composer-timeline-spec.md`](./24-arc-composer-timeline-spec.md) - Arc Composer Timeline

These specs include:
- TypeScript interfaces for the view contract
- Timeline model and canon rules
- Command definitions and lifecycle
- Validation and explainability requirements

---

## Common Tasks

### Task 1: Create a Basic Story Arc

1. Open Arc Composer and create a new timeline
2. Add beats for each story phase
3. Write titles and summaries for each beat
4. Arrange them in chronological order
5. Preview the complete arc

### Task 2: Plan a Complex Narrative

1. Create multiple beats for each phase
2. Link beats to events and characters
3. Use precise timing for dramatic effect
4. Lock key beats to protect story integrity
5. Create forks for alternative paths

### Task 3: Export and Share a Story

1. Finalize your story arc
2. Add world bible sections if needed
3. Use the export function
4. Save the arc packet
5. Share with others or backup for later

---

## Tips and Tricks

### 🟢 Beginner Tips
- Always start with setup phase
- Make sure escalation builds gradually
- Place catastrophe at the dramatic peak
- Allow enough time for recovery

### 🟡 Intermediate Tips
- Use beat linking for narrative consistency
- Lock important story moments
- Create forks to explore alternatives
- Export regularly to backup your work

### 🔴 Advanced Tips
- Master tick-based timing for precise control
- Use timeline forks for "what if" scenarios
- Integrate with other narrative tools
- Leverage deterministic properties for reproducible stories

---

## Troubleshooting

### Issue: Timeline shows invalid order

**Solution:**
- Check that beats follow chronological order
- Verify phases progress correctly
- Ensure tick numbers increase properly
- Review beat dependencies

### Issue: Cannot modify locked beat

**Solution:**
- Unlock the beat if you have permission
- Create a timeline fork instead
- Check if beat is canon-locked
- Verify your revision is current

### Issue: Export fails with error

**Solution:**
- Check all beats have required information
- Verify timeline is complete
- Review error message for specific issue
- Ensure proper world bible sections

---

## Next Steps

After mastering Arc Composer, explore:
- [`52-onboarding-narrative-dashboard.md`](./52-onboarding-narrative-dashboard.md) - Narrative Dashboard
- [`53-onboarding-event-forge.md`](./53-onboarding-event-forge.md) - Event Forge
- [`54-onboarding-species-studio.md`](./54-onboarding-species-studio.md) - Species & Race Studio
- [`56-onboarding-region-story-cards.md`](./56-onboarding-region-story-cards.md) - Region Story Cards

---

## Glossary

| Term | Definition |
|------|------------|
| **Arc Composer** | Tool for planning and structuring story arcs |
| **Story Beat** | Single event or scene in a narrative sequence |
| **Story Phase** | One of five parts of narrative structure (setup, escalation, catastrophe, recovery, aftermath) |
| **Timeline** | Chronological arrangement of story beats with precise timing |
| **Canon Locking** - Protecting story elements from accidental changes |
| **Timeline Forking** | Creating alternate versions of story history |
| **Beat Linking** | Connecting story beats to other narrative elements |
| **Tick Precision** | Exact timing control using simulation ticks |
| **Deterministic Timeline** | Same inputs always produce same story structure |
| **Revision Tracking** | Complete history of all changes to story arcs |
| **Timeline Lineage** | Parent-child relationships between different story versions |