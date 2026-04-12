# Event Form Spec: Refugees (7)

## Purpose
To create a new small `Settlement` (village) or expand the capital to accommodate an influx of refugees.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Social Upheaval section)
- **Context**: The origin of the refugees and the player's response.
- **Output**: A narrative describing the refugee crisis and the founding of the new community.

## Form Fields

### 1. The Refugees
- **Origin**
  - **Label**: Where are the refugees fleeing from?
  - **Type**: Text
  - **Required**: Yes
- **Reason for Fleeing**
  - **Label**: Why are they fleeing?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: War, Monster Attack, Natural Disaster, Magical Cataclysm, Famine, Persecution.
- **Description**
  - **Label**: Describe the refugee group
  - **Type**: Textarea
  - **Required**: No

### 2. Your Response
- **Action Taken**
  - **Label**: How does your empire accommodate them?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Place a new small village, Expand the capital city.
- **New Village Name**
  - **Label**: Name of the new village (if applicable)
  - **Type**: Text
  - **Required**: Conditional
- **Location**
  - **Label**: Location of the new village (if applicable)
  - **Type**: Text
  - **Required**: Conditional

### 3. The Impact
- **Impact on Capital**
  - **Label**: How does this influx affect your empire?
  - **Type**: Textarea
  - **Required**: No
- **Integration Challenges**
  - **Label**: What are the challenges of integrating the new population?
  - **Type**: Textarea
  - **Required**: No