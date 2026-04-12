# Event Form Spec: Disaster (13)

## Purpose
To narrate a catastrophic event that destroys at least one settlement, generating a new `Event` card and updating the status of a `Settlement` card to "destroyed" (replacing it with a ruin).

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Environmental Catastrophe section)
- **Context**: Player's empire state, the chosen disaster type, severity, and targeted settlement.
- **Output**: A rich narrative describing the disaster's unfolding, its impact, how survivors adapt, and what remains as a testament to the loss. This populates the `Event` card description.

## Form Fields

### 1. Catastrophe Details
- **Disaster Type**
  - **Label**: Type of Disaster
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Earthquake, Flood, Volcanic Eruption, Hurricane/Tornado, Wildfire, Magical Cataclysm, Plague/Disease, Famine, Asteroid Impact.
- **Disaster Cause**
  - **Label**: What caused the disaster?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Was it natural, a magical experiment gone wrong, or the wrath of a god?
- **Severity (1d6)**
  - **Label**: Roll for Severity (1=weak, 6=most severe)
  - **Type**: Dice Roller (Button)
  - **Required**: Yes

### 2. Impact Assessment
- **Settlement(s) Destroyed**
  - **Label**: Select at least one settlement to be destroyed
  - **Type**: Multi-select Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all player-owned settlements)
- **Initial Impact**
  - **Label**: Describe the initial impact
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Describe the first moments of the disaster.
- **Population Effects**
  - **Label**: How were the people affected?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe casualties, refugees, and the social fallout.

### 3. Response & Aftermath
- **Leadership Response**
  - **Label**: How did your empire's leadership respond?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Detail emergency measures, rescue efforts, and long-term plans.
- **Recovery Efforts**
  - **Label**: Describe the recovery efforts
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: How are the survivors adapting? What new ways of living are emerging?
- **The Ruin**
  - **Label**: Describe what remains of the settlement
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: What does the ruin look like now? What is its new name (e.g., "The Ashen Vale")?