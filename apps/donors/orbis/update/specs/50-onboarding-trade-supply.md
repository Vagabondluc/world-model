# Trade & Supply Lanes Onboarding Guide

## Overview

The Trade & Supply Lanes dashboard provides a visual network of how resources, goods, and people move between settlements. It helps you understand economic connections, identify critical supply routes, and anticipate disruptions to trade networks.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what the Trade & Supply Lanes dashboard shows
- Learn to read the route graph and connections
- Identify important trade routes and chokepoints
- Navigate to detailed views from the network

### 🟡 Intermediate (Ages 16-18)
- Understand trade flow patterns and volumes
- Interpret chokepoint alerts and disruption impacts
- Use the consequence preview panel for trade decisions
- Simulate route failures and their consequences

### 🔴 Advanced (Ages 19-99)
- Understand the underlying trade network algorithms
- Interpret deterministic drill-down tables
- Use the dashboard for hypothesis testing about economic systems
- Understand the relationship between trade and civilization stability

---

## Step-by-Step Walkthrough

### Step 1: Opening the Dashboard

1. From the main dashboard, click on **Trade & Supply Lanes** in the navigation menu
2. The network view will load with connections between settlements
3. You'll see three main sections:
   - **Route Graph** (center): Visual network of trade connections
   - **Flow Analysis** (left): Trade volumes and patterns
   - **Action Panel** (right): Commands and consequence previews

### Step 2: Reading the Route Graph

**🟢 Beginner:**

The route graph shows how settlements are connected:

| Element | Meaning | Example |
|---------|---------|---------|
| Nodes | Settlements or cities | Circles with settlement names |
| Lines | Trade routes | Lines connecting settlements |
| Line Thickness | Trade volume | Thicker = more trade |
| Line Color | Route health | Green = healthy, Red = disrupted |

**🟡 Intermediate:**

Route graph elements include:
- **Node size**: Economic power of settlement
- **Line thickness**: Volume of trade
- **Line color**: Route status (green/yellow/red)
- **Animated flow**: Direction of primary trade
- **Warning icons**: Chokepoints or disruptions

**🔴 Advanced:**

Route graph is generated from:
```ts
interface TradeNetworkSnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]      // Status badges
  riskFlags: string[]          // Risk indicators
}
```

### Step 3: Understanding Chokepoint Alerts

**🟢 Beginner:**

Chokepoint alerts warn you about vulnerable routes:

- ⚠️ **Mountain Pass** - Single route through mountains
- 🌉 **Bridge Critical** - Only one bridge crossing
- 🚢 **Port Dependency** - Only one port for region
- 🛣️ **Single Road** - Only one road connection

**🟡 Intermediate:**

Chokepoint severity levels:
1. **Critical** - Failure would isolate settlements
2. **High** - Failure would severely impact trade
3. **Medium** - Failure would reduce efficiency
4. **Low** - Failure would cause minor inconvenience

**🔴 Advanced:**

Chokepoint analysis uses:
- Network topology analysis
- Redundancy assessment
- Single point of failure identification
- Impact modeling
- Historical disruption patterns

### Step 4: Analyzing Disruption Impact

**🟢 Beginner:**

See what happens when trade is disrupted:
1. Click on a route in the graph
2. Look at the impact panel
3. See which settlements are affected
4. Understand what goods are affected

**🟡 Intermediate:**

Disruption impact includes:
- **Direct impact**: Settlements immediately affected
- **Secondary impact**: Cascading effects through network
- **Resource shortages**: What goods become unavailable
- **Economic loss**: Reduction in trade value
- **Time to recovery**: How long to restore trade

**🔴 Advanced:**

Disruption modeling uses:
- Network flow algorithms
- Dependency analysis
- Economic impact modeling
- Resource substitution analysis
- Recovery time estimation

### Step 5: Using the Consequence Preview Panel

**🟢 Beginner:**

Before making trade changes, see what might happen:
1. Click on a trade action
2. The preview panel shows likely outcomes
3. Decide whether to proceed or cancel

**🟡 Intermediate:**

The preview panel shows:
- Trade flow changes
- Economic impacts
- Settlement responses
- Resource availability changes
- Time to effect

**🔴 Advanced:**

Preview panel uses:
- Economic modeling
- Network flow analysis
- Supply chain simulation
- Market response modeling
- Long-term impact assessment

### Step 6: Simulating Route Failures

**🟢 Beginner:**

Test what happens if a route fails:
1. Click **"Simulate Route Failure"**
2. Select a route on the graph
3. Review the impact analysis
4. See how settlements adapt

**🟡 Intermediate:**

Failure scenarios include:
- Natural disasters blocking routes
- Conflicts closing borders
- Infrastructure breakdowns
- Resource depletion
- Political changes

**🔴 Advanced:**

Failure simulation uses:
- Monte Carlo methods for uncertainty
- Network resilience analysis
- Alternative routing algorithms
- Economic adaptation modeling
- System dynamics simulation

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Trade Route** - A path connecting settlements for exchanging goods
2. **Chokepoint** - A critical point where many routes pass through
3. **Supply Chain** - The network that moves resources from source to user
4. **Disruption** - An event that interrupts normal trade patterns

### 🟡 Intermediate Concepts

1. **Trade Volume** - The amount of goods moving between settlements
2. **Network Resilience** - How well the trade network handles disruptions
3. **Economic Impact** - The financial effect of trade changes
4. **Resource Dependency** - How much a settlement relies on imported goods

### 🔴 Advanced Concepts

1. **Network Flow Algorithms** - Mathematical methods for analyzing movement through networks
2. **System Dynamics** - How complex systems change over time
3. **Monte Carlo Simulation** - Using random sampling to model uncertainty
4. **Supply Chain Modeling** - Detailed analysis of how resources move and transform

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open the Trade & Supply Lanes dashboard
- [ ] I can identify at least 3 major trade routes
- [ ] I understand what a chokepoint alert means
- [ ] I can see which settlements are connected
- [ ] I know how to simulate a route failure

### 🟡 Intermediate Checkpoints

- [ ] I can interpret trade volumes from line thickness
- [ ] I understand chokepoint severity levels
- [ ] I can use the consequence preview panel effectively
- [ ] I can explain the difference between direct and secondary impacts
- [ ] I can identify critical resources in the trade network

### 🔴 Advanced Checkpoints

- [ ] I understand the trade network algorithms
- [ ] I can explain how economic impact is calculated
- [ ] I understand network resilience analysis
- [ ] I can use the dashboard for hypothesis testing
- [ ] I understand the relationship between trade and stability

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/04-civilization.md`](../onboard/04-civilization.md) - Civilization: Settlements, Trade, and Behavior
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`docs/onboard/11-inspector-panel.md`](../onboard/11-inspector-panel.md) - Inspector Panel

### Diagrams
- [`docs/onboard/diagrams/`](../onboard/diagrams/) - Various trade and economic diagrams

---

## Reference to UI/UX Spec

For technical details about the Trade & Supply Lanes dashboard, see:
- [`docs/ui-ux/21-trade-supply-lanes-spec.md`](./21-trade-supply-lanes-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Command definitions and rules
- Validation and explainability requirements
- Acceptance criteria
- Reason code bindings

---

## Common Tasks

### Task 1: Identify Critical Trade Routes

1. Open Trade & Supply Lanes dashboard
2. Look for thick lines (high volume)
3. Check for chokepoint alerts
4. Identify routes with many connections
5. Note which settlements depend on these routes

### Task 2: Analyze a Route Disruption

1. Click on a major trade route
2. Select "Simulate Route Failure"
3. Review the impact analysis
4. Note affected settlements and resources
5. Check for alternative routes

### Task 3: Plan a New Trade Connection

1. Find settlements with poor trade access
2. Identify potential new routes
3. Use "Queue Trade Event" to plan the connection
4. Review the consequence preview
5. Commit or cancel based on the analysis

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with the thickest lines - they're the most important routes
- Pay attention to red lines - they indicate problems
- Look for settlements with few connections
- Check chokepoint alerts first

### 🟡 Intermediate Tips
- Compare trade volumes to settlement sizes
- Watch for cascading effects when routes fail
- Use the consequence preview before making changes
- Consider seasonal variations in trade

### 🔴 Advanced Tips
- Understand the deterministic nature of the simulation for reproducible experiments
- Use the drill-down table to understand exactly how values are calculated
- Combine Trade & Supply Lanes with other dashboards for comprehensive analysis
- Leverage network analysis techniques to optimize trade patterns

---

## Troubleshooting

### Issue: Dashboard shows "Loading..." indefinitely

**Solution:**
- Check if the trade domain is initialized
- Verify world state is valid
- Try refreshing the dashboard

### Issue: Route simulation fails with error

**Solution:**
- Check if selected route is valid
- Verify trade data is available
- Review error message for specific issue

### Issue: Trade volumes seem incorrect

**Solution:**
- Check confidence level - low confidence means uncertainty
- Verify tick number is current
- Review underlying metrics in drill-down table

---

## Next Steps

After mastering the Trade & Supply Lanes dashboard, explore:
- [`48-onboarding-civilization-pulse.md`](./48-onboarding-civilization-pulse.md) - Civilization Pulse Dashboard
- [`49-onboarding-settlement-viability.md`](./49-onboarding-settlement-viability.md) - Settlement Viability Map
- [`51-onboarding-conflict-forecast.md`](./51-onboarding-conflict-forecast.md) - Conflict Forecast Board

---

## Glossary

| Term | Definition |
|------|------------|
| **Trade Route** | A path connecting settlements for exchanging goods and resources |
| **Chokepoint** | A critical point where failure would disrupt multiple trade routes |
| **Supply Chain** | The network that moves resources from producers to consumers |
| **Network Resilience** | The ability of a trade network to withstand and recover from disruptions |
| **Trade Volume** | The quantity of goods moving between settlements |
| **Disruption Impact** | The effect of interrupting normal trade patterns |
| **Route Graph** | A visual representation of trade connections between settlements |
| **Economic Impact** | The financial effect of changes to trade patterns |
| **Deterministic** | Same inputs always produce same outputs |
| **Resource Dependency** | How much a settlement relies on imported goods and resources |