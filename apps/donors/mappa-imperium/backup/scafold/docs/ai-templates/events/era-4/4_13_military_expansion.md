# Event Form Spec: Military Expansion (13)

## Purpose
To create a new military-focused `Settlement` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 13)
- **Context**: Player's faction, the reason for expansion, and all form inputs.
- **Output**: A narrative describing the new military installation, its strategic purpose, and its impact on the region. This populates the `description` of the new `Settlement` card.

## Form Fields

### 1. Strategic Context
- **Threat/Reason**
  - **Label**: What threat necessitates this expansion?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Increasing bandit activity," "Hostile neighbor mobilizing forces."
- **Commander**
  - **Label**: Military commander overseeing project
  - **Type**: Text
  - **Required**: No
- **Urgency**
  - **Label**: Urgency level of construction
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Planned - Long-term strategy, Response - Recent threat, Emergency - Immediate danger, Expansionist - Projecting power.

### 2. Fortification Details
- **Installation Type**
  - **Label**: Type of military installation
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Major Fortress, Border Fort, Watchtower, Military Barracks, Military Academy, Naval Base, Town Garrison.
- **Location**
  - **Label**: Strategic location chosen
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "High hill overlooking three valleys."
- **Defensive Features**
  - **Label**: Distinctive defensive features
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Thick walls with murder holes," "Underground tunnel network."

### 3. Military Organization
- **Garrison**
  - **Label**: Size and composition of garrison
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "200 professional soldiers," "Elite cavalry unit of 50 riders."
- **Specialization**
  - **Label**: Specialized military focus
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Cavalry Training, Archery Excellence, Siege Warfare, Naval Operations, Military Intelligence, Logistics, Military Engineering.
- **Regional Impact**
  - **Label**: Regional security impact
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Trade routes now secure," "Deterrent against neighbor aggression."