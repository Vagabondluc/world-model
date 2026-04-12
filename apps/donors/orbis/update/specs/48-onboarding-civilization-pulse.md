# Civilization Pulse Dashboard Onboarding Guide

## Overview

The Civilization Pulse Dashboard provides a focused view of civilization health, faction dynamics, and social stability across your world. It helps you understand how societies are developing, what tensions exist, and where conflicts might emerge.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what the Civilization Pulse Dashboard shows
- Learn to read faction scorecards and status indicators
- Identify unrest warnings and risk flags
- Navigate to detailed views from the dashboard

### 🟡 Intermediate (Ages 16-18)
- Understand faction relationships and power dynamics
- Interpret unrest forecasts and confidence levels
- Use the consequence preview panel for policy changes
- Simulate policy shifts and understand their impacts

### 🔴 Advanced (Ages 19-99)
- Understand the underlying civilization snapshot system
- Interpret deterministic drill-down tables
- Use the dashboard for hypothesis testing about societal evolution
- Understand the relationship between civilization pulse and domain authority

---

## Step-by-Step Walkthrough

### Step 1: Opening the Dashboard

1. From the main dashboard, click on **Civilization Pulse** in the navigation menu
2. The dashboard will load with a snapshot of the current civilization state
3. You'll see three main sections:
   - **Faction Overview** (top): Faction scorecards and status badges
   - **Unrest Analysis** (middle): Trend lines and forecasts
   - **Action Panel** (bottom): Commands and consequence previews

### Step 2: Reading Faction Scorecards

**🟢 Beginner:**

Faction scorecards tell you about different groups in your world:

| Element | Meaning | Example |
|---------|---------|---------|
| Faction Name | The group identifier | "River Valley Collective" |
| Power Level | Relative influence | "High (78%)" |
| Stability Index | How stable the faction is | "Stable (85%)" |
| Growth Trend | Population/economic trend | "↑ Growing" |

**🟡 Intermediate:**

Each faction scorecard shows:
- Faction name and identifier
- Power level with percentage
- Stability index with trend indicator
- Resource access indicators
- Alliance relationships

**🔴 Advanced:**

Faction data is derived from civilization snapshots:
```ts
interface CivilizationProfileSnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Understanding Unrest Forecasts

**🟢 Beginner:**

Unrest warnings tell you about potential problems:

- ⚠️ "Resource Scarcity Tension" - Not enough resources for population
- 🗳️ "Political Instability Rising" - Government losing authority
- ⚔️ "Border Dispute Escalating" - Territorial conflicts increasing

**🟡 Intermediate:**

Unrest forecasts are prioritized by severity:
1. **Critical** - Immediate action required (conflict imminent)
2. **High** - Action recommended within 50 years
3. **Medium** - Monitor closely
4. **Low** - Informational only

**🔴 Advanced:**

Unrest forecasts are computed from:
- Resource distribution metrics
- Population density and growth
- Historical conflict patterns
- Environmental stress factors
- Political stability indicators

### Step 4: Analyzing Doctrine Badges

**🟢 Beginner:**

Doctrine badges show what factions believe:

| Badge | Meaning | Example |
|-------|---------|---------|
| 🌱 Expansionist | Wants to grow territory | "Manifest Destiny" |
| 🛡️ Isolationist | Prefers to stay separate | "Fortress Mentality" |
| 🤝 Diplomatic | Seeks peaceful relations | "Trade First Policy" |
| ⚔️ Militaristic | Values military strength | "Warrior Culture" |

**🟡 Intermediate:**

Doctrine badges indicate:
- Core values and beliefs
- Preferred conflict resolution methods
- Trade and diplomacy preferences
- Resource acquisition strategies

**🔴 Advanced:**

Doctrine badges are computed from:
- Historical decision patterns
- Resource allocation priorities
- Response to external threats
- Cultural evolution metrics
- Environmental adaptation strategies

### Step 5: Using the Consequence Preview Panel

**🟢 Beginner:**

Before making policy changes, see what might happen:
1. Click on a policy option
2. The preview panel shows likely outcomes
3. Decide whether to proceed or cancel

**🟡 Intermediate:**

The preview panel shows:
- Primary effects (what directly changes)
- Secondary effects (what happens because of the primary)
- Faction reactions (who supports/opposes)
- Time to effect (how long before changes appear)

**🔴 Advanced:**

Preview panel uses:
- Deterministic simulation for short-term effects
- Probabilistic models for long-term projections
- Faction behavior models
- Resource constraint analysis
- Historical pattern matching

### Step 6: Simulating Policy Shifts

**🟢 Beginner:**

Test different policies:
1. Click **"Simulate Policy Shift"**
2. Choose a policy from the options
3. Review the preview
4. Commit or cancel the change

**🟡 Intermediate:**

Policy options include:
- Economic policies (trade, taxation, resource allocation)
- Social policies (education, healthcare, welfare)
- Diplomatic policies (alliances, treaties, sanctions)
- Military policies (defense, offense, recruitment)

**🔴 Advanced:**

Policy simulation uses:
- Multi-agent modeling of faction behavior
- Resource flow analysis
- Economic impact modeling
- Social stability calculations
- Long-term consequence projection

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Faction** - A group of people with shared interests and identity
2. **Power Level** - How much influence a faction has in the world
3. **Stability** - How resistant a faction is to internal conflict
4. **Unrest** - The likelihood of conflict or disruption

### 🟡 Intermediate Concepts

1. **Doctrine** - A set of beliefs that guide faction decisions
2. **Policy Shift** - A change in how resources are allocated or rules are enforced
3. **Consequence Preview** - A prediction of what will happen if you make a change
4. **Confidence Level** - How sure we are about a prediction

### 🔴 Advanced Concepts

1. **Civilization Snapshot** - A complete state of all civilizations at a specific tick
2. **Deterministic Drill-Down** - A detailed view showing exactly how values are calculated
3. **Multi-Agent Modeling** - Simulating many independent decision-makers
4. **Resource Flow Analysis** - Tracking how resources move between factions

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Civilization Pulse Dashboard
- [ ] I can identify at least 3 factions and their power levels
- [ ] I understand what an unrest warning means
- [ ] I can simulate a policy change
- [ ] I know how to navigate to the Conflict Forecast Board

### 🟡 Intermediate Checkpoints

- [ ] I can interpret faction relationships and alliances
- [ ] I understand confidence levels in forecasts
- [ ] I can use the consequence preview panel effectively
- [ ] I can explain the difference between doctrines
- [ ] I can identify top pressures on civilization stability

### 🔴 Advanced Checkpoints

- [ ] I understand the civilization snapshot system
- [ ] I can explain how faction power is calculated
- [ ] I understand deterministic policy simulation
- [ ] I can use the dashboard for hypothesis testing
- [ ] I understand the relationship to domain authority

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Civilization: Settlements, Trade, and Behavior
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/11-inspector-panel.md`](../onboard/11-inspector-panel.md) - Inspector Panel

### Diagrams
- [`docs/onboard/diagrams/`](../onboard/diagrams/) - Various civilization and society diagrams

---

## Reference to UI/UX Spec

For technical details about the Civilization Pulse Dashboard, see:
- [`docs/ui-ux/19-civilization-pulse-spec.md`](./19-civilization-pulse-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Check Civilization Health

1. Open Civilization Pulse Dashboard
2. Look at faction stability indicators (green = stable, yellow = caution, red = critical)
3. Review unrest warnings for potential conflicts
4. Check power distribution between factions
5. Decide if intervention is needed

### Task 2: Simulate a Policy Change

1. Identify a problem (e.g., resource scarcity)
2. Click "Simulate Policy Shift"
3. Choose an appropriate policy option
4. Review the consequence preview
5. Commit or cancel based on predicted outcomes

### Task 3: Investigate Faction Relationships

1. Click on a faction card to see details
2. Review alliance and enemy relationships
3. Check trade flows and resource dependencies
4. Look for potential conflict points
5. Navigate to Conflict Forecast Board for deeper analysis

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with faction stability - it's the best indicator of overall health
- Pay attention to power imbalances - they often lead to conflict
- Use policy simulation before making real changes
- Take notes on faction behaviors and patterns

### 🟡 Intermediate Tips
- Compare doctrine badges to understand faction motivations
- Use the consequence preview to avoid unintended consequences
- Watch for cascading effects when one faction changes
- Track how environmental changes affect civilization stability

### 🔴 Advanced Tips
- Understand the deterministic nature of the simulation for reproducible experiments
- Use the drill-down table to understand exactly how values are calculated
- Combine Civilization Pulse with other dashboards for comprehensive analysis
- Leverage historical patterns to predict future conflicts

---

## Troubleshooting

### Issue: Dashboard shows "Loading..." indefinitely

**Solution:**
- Check if the civilization domain is initialized
- Verify world state is valid
- Try refreshing the dashboard

### Issue: Policy simulation fails with error

**Solution:**
- Check if required factions are initialized
- Verify resource availability
- Review error message for specific issue

### Issue: Faction power levels seem incorrect

**Solution:**
- Check confidence level - low confidence means uncertainty
- Verify tick number is current
- Review underlying metrics in drill-down table

---

## Next Steps

After mastering the Civilization Pulse Dashboard, explore:
- [`49-onboarding-settlement-viability.md`](./49-onboarding-settlement-viability.md) - Settlement Viability Map
- [`50-onboarding-trade-supply.md`](./50-onboarding-trade-supply.md) - Trade & Supply Lanes
- [`51-onboarding-conflict-forecast.md`](./51-onboarding-conflict-forecast.md) - Conflict Forecast Board

---

## Glossary

| Term | Definition |
|------|------------|
| **Faction** | A group of people with shared interests, identity, and goals |
| **Power Level** | The relative influence a faction has in decision-making |
| **Stability Index** | A measure of how resistant a faction is to internal conflict |
| **Doctrine** | A set of beliefs and principles that guide faction decisions |
| **Unrest Forecast** | A prediction of potential conflicts or disruptions |
| **Policy Shift** | A change in rules, resource allocation, or priorities |
| **Consequence Preview** | A prediction of what will happen if a change is made |
| **Confidence Level** | How certain we are about a prediction or value |
| **Deterministic** | Same inputs always produce same outputs |
| **Snapshot** | A complete state of the world at a specific tick |