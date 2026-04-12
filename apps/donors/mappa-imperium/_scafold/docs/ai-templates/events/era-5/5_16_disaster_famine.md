# Event Form Spec: Disaster/Famine (16)

## Purpose
To process a catastrophic event, resulting in a settlement being replaced by a ruin. This creates an `Event` card and updates a `Settlement` card's status.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 16)
- **Context**: Player's faction, the type of disaster, and the affected settlement.
- **Output**: A chronicle of the catastrophe, detailing its cause, impact, and the empire's response.

## Form Fields

### 1. The Catastrophe
- **Disaster Type**
  - **Label**: What kind of disaster struck?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Natural Disaster (Flood, Earthquake, etc.), Magical Anomaly, Famine, Disease/Plague.
- **Cause**
  - **Label**: What was the cause?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "A failed magical experiment," "Years of drought."
- **Settlement Destroyed**
  - **Label**: Which settlement was destroyed?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with player's settlements)

### 2. Impact and Response
- **Initial Impact**
  - **Label**: Describe the initial impact
  - **Type**: Textarea
  - **Required**: No
- **Leadership Response**
  - **Label**: How did the leadership respond?
  - **Type**: Textarea
  - **Required**: No
- **Population Effects**
  - **Label**: Describe the effects on the population
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Mention casualties, refugees, etc.

### 3. Aftermath
- **Recovery Efforts**
  - **Label**: Describe the recovery efforts
  - **Type**: Textarea
  - **Required**: No
- **Social Changes**
  - **Label**: What are the long-term social changes?
  - **Type**: Textarea
  - **Required**: No