# Conflict Forecast Board Onboarding Guide

## Overview

The Conflict Forecast Board provides a predictive analysis of potential conflicts, showing flashpoints, triggers, and de-escalation opportunities. It helps you understand where conflicts might emerge, what might cause them, and how to prevent or resolve them.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what the Conflict Forecast Board shows
- Learn to read the flashpoint map and alerts
- Identify areas at risk of conflict
- Navigate to detailed views from the board

### 🟡 Intermediate (Ages 16-18)
- Understand trigger stacks and escalation patterns
- Interpret de-escalation levers and their effectiveness
- Use the consequence preview panel for intervention decisions
- Simulate de-escalation strategies

### 🔴 Advanced (Ages 19-99)
- Understand the underlying conflict prediction algorithms
- Interpret deterministic drill-down tables
- Use the board for hypothesis testing about conflict dynamics
- Understand the relationship between conflicts and system stability

---

## Step-by-Step Walkthrough

### Step 1: Opening the Board

1. From the main dashboard, click on **Conflict Forecast Board** in the navigation menu
2. The board will load with a map of potential conflict areas
3. You'll see three main sections:
   - **Flashpoint Map** (center): Geographic view of conflict risks
   - **Trigger Analysis** (left): Causes and escalation patterns
   - **Action Panel** (right): Commands and consequence previews

### Step 2: Reading the Flashpoint Map

**🟢 Beginner:**

The flashpoint map shows where conflicts might start:

| Color | Meaning | Example |
|-------|---------|---------|
| 🔴 Red | Critical risk | Conflict likely within 10 years |
| 🟠 Orange | High risk | Conflict likely within 50 years |
| 🟡 Yellow | Medium risk | Tensions increasing |
| 🟢 Green | Low risk | Stable relations |

**🟡 Intermediate:**

Flashpoint indicators include:
- **Risk level**: Color-coded by probability and timeline
- **Conflict type**: Border dispute, resource conflict, ideological
- **Parties involved**: Which factions might conflict
- **Warning indicators**: Specific triggers to watch

**🔴 Advanced:**

Flashpoint analysis is generated from:
```ts
interface ConflictForecastSnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Understanding Trigger Stacks

**🟢 Beginner:**

Triggers are events that might start conflicts:

- 🌾 **Resource Scarcity** - Not enough food or water
- 🗺️ **Border Disputes** - Arguments over territory
- 📉 **Economic Decline** - Trade problems or poverty
- ⚔️ **Military Buildup** - Arms races or troop movements

**🟡 Intermediate:**

Trigger stack analysis shows:
- **Primary triggers**: Main causes of potential conflict
- **Secondary triggers**: Contributing factors
- **Trigger probability**: How likely each trigger is
- **Timeline**: When triggers might activate
- **Interactions**: How triggers influence each other

**🔴 Advanced:**

Trigger modeling uses:
- Historical conflict patterns
- Resource stress analysis
- Political stability metrics
- Economic pressure indicators
- Social tension measurements

### Step 4: Analyzing De-escalation Levers

**🟢 Beginner:**

De-escalation levers are ways to prevent conflicts:

- 🤝 **Diplomacy** - Talks and agreements
- 📦 **Trade Incentives** - Economic benefits for peace
- 🌐 **Mediation** - Third-party help
- ⚖️ **Treaties** - Formal agreements

**🟡 Intermediate:**

De-escalation effectiveness includes:
- **Success probability**: How likely the lever is to work
- **Time to effect**: How long before results appear
- **Cost**: Resources needed to implement
- **Side effects**: Unintended consequences
- **Durability**: How long peace will last

**🔴 Advanced:**

De-escalation modeling uses:
- Game theory analysis
- Historical success rates
- Cost-benefit calculations
- System dynamics modeling
- Multi-agent simulation

### Step 5: Using the Consequence Preview Panel

**🟢 Beginner:**

Before intervening, see what might happen:
1. Click on a de-escalation option
2. The preview panel shows likely outcomes
3. Decide whether to proceed or cancel

**🟡 Intermediate:**

The preview panel shows:
- Conflict probability changes
- Economic impacts
- Political consequences
- Social effects
- Regional stability changes

**🔴 Advanced:**

Preview panel uses:
- Conflict probability modeling
- Economic impact assessment
- Political stability analysis
- Social tension metrics
- Regional security calculations

### Step 6: Committing War Arcs

**🟢 Beginner:**

Sometimes conflicts cannot be avoided:
1. Click **"Commit War Arc"** when conflict is inevitable
2. Review the projected conflict progression
3. Understand the likely outcomes
4. Plan for post-conflict recovery

**🟡 Intermediate:**

War arc planning includes:
- **Conflict duration**: How long the war might last
- **Participants**: Who will be involved
- **Resource cost**: Economic and human costs
- **Territorial changes**: Possible border changes
- **Aftermath**: Post-war stability

**🔴 Advanced:**

War arc modeling uses:
- Historical conflict patterns
- Military capability analysis
- Economic sustainability modeling
- Political will calculations
- Post-conflict recovery planning

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Flashpoint** - A location where conflict is likely to start
2. **Trigger** - An event that might cause a conflict
3. **De-escalation** - Actions to reduce tensions and prevent conflict
4. **War Arc** - The progression of a conflict from start to finish

### 🟡 Intermediate Concepts

1. **Conflict Probability** - The likelihood that a conflict will occur
2. **Escalation Pattern** - How conflicts grow and spread
3. **De-escalation Lever** - A specific action that can reduce tensions
4. **Regional Stability** - How peaceful an area is

### 🔴 Advanced Concepts

1. **Game Theory** - Mathematical analysis of strategic interactions
2. **System Dynamics** - How complex systems change over time
3. **Multi-Agent Simulation** - Modeling many independent decision-makers
4. **Conflict Modeling** - Detailed analysis of how conflicts emerge and evolve

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Conflict Forecast Board
- [ ] I can identify at least 3 potential conflict areas
- [ ] I understand what the color codes mean
- [ ] I can recognize common conflict triggers
- [ ] I know how to use de-escalation options

### 🟡 Intermediate Checkpoints

- [ ] I can interpret trigger stacks and escalation patterns
- [ ] I understand de-escalation effectiveness metrics
- [ ] I can use the consequence preview panel effectively
- [ ] I can explain the difference between trigger types
- [ ] I can identify the most effective de-escalation levers

### 🔴 Advanced Checkpoints

- [ ] I understand the conflict prediction algorithms
- [ ] I can explain how conflict probability is calculated
- [ ] I understand game theory applications to de-escalation
- [ ] I can use the board for hypothesis testing
- [ ] I understand the relationship between conflicts and system stability

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Civilization: Settlements, Trade, and Behavior
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/11-inspector-panel.md`](../onboard/11-inspector-panel.md) - Inspector Panel

### Diagrams
- [`docs/onboard/diagrams/`](../onboard/diagrams/) - Various conflict and society diagrams

---

## Reference to UI/UX Spec

For technical details about the Conflict Forecast Board, see:
- [`docs/ui-ux/22-conflict-forecast-board-spec.md`](./22-conflict-forecast-board-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Identify High-Risk Conflict Areas

1. Open Conflict Forecast Board
2. Look for red and orange areas on the map
3. Check trigger stacks for these areas
4. Note which factions are involved
5. Assess the urgency of intervention

### Task 2: Plan a De-escalation Strategy

1. Select a high-risk flashpoint
2. Review available de-escalation levers
3. Compare effectiveness and costs
4. Use "Queue De-escalation" to plan intervention
5. Review the consequence preview

### Task 3: Prepare for Inevitable Conflict

1. Identify conflicts that cannot be prevented
2. Click "Commit War Arc" to plan for conflict
3. Review projected outcomes and costs
4. Plan for post-conflict recovery
5. Prepare humanitarian interventions

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with the red areas - they need immediate attention
- Look for resource scarcity triggers - they're common causes
- Use diplomacy first - it's often the most effective lever
- Check multiple de-escalation options before choosing

### 🟡 Intermediate Tips
- Compare trigger probabilities to prioritize interventions
- Consider the time to effect when choosing de-escalation levers
- Watch for cascading effects when conflicts spread
- Plan for both success and failure of interventions

### 🔴 Advanced Tips
- Understand the deterministic nature of the simulation for reproducible experiments
- Use the drill-down table to understand exactly how probabilities are calculated
- Combine Conflict Forecast with other dashboards for comprehensive analysis
- Leverage game theory principles to optimize de-escalation strategies

---

## Troubleshooting

### Issue: Board shows "Loading..." indefinitely

**Solution:**
- Check if the conflict domain is initialized
- Verify world state is valid
- Try refreshing the board

### Issue: De-escalation simulation fails with error

**Solution:**
- Check if selected flashpoint is valid
- Verify conflict data is available
- Review error message for specific issue

### Issue: Conflict probabilities seem incorrect

**Solution:**
- Check confidence level - low confidence means uncertainty
- Verify tick number is current
- Review underlying metrics in drill-down table

---

## Next Steps

After mastering the Conflict Forecast Board, explore:
- [`48-onboarding-civilization-pulse.md`](./48-onboarding-civilization-pulse.md) - Civilization Pulse Dashboard
- [`49-onboarding-settlement-viability.md`](./49-onboarding-settlement-viability.md) - Settlement Viability Map
- [`50-onboarding-trade-supply.md`](./50-onboarding-trade-supply.md) - Trade & Supply Lanes

---

## Glossary

| Term | Definition |
|------|------------|
| **Flashpoint** | A geographic area where conflict is likely to emerge |
| **Trigger** | An event or condition that could initiate a conflict |
| **De-escalation** | Actions taken to reduce tensions and prevent conflict |
| **War Arc** | The complete progression of a conflict from beginning to end |
| **Conflict Probability** | The likelihood that a conflict will occur within a given timeframe |
| **Escalation Pattern** | The way conflicts typically grow and intensify over time |
| **De-escalation Lever** | A specific action or policy that can reduce conflict risk |
| **Regional Stability** | The degree of peace and security in a geographic area |
| **Game Theory** | Mathematical study of strategic decision-making |
| **Multi-Agent Simulation** | Computer modeling of many independent decision-makers |