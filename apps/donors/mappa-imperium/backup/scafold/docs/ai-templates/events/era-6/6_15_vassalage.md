# Event Form Spec: Vassalage (15)

## Purpose
To merge a neighboring faction into the player's empire, creating a new "united empire" name and banner, and updating the neighbor's `Faction` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Political Transformation section)
- **Context**: Details of both factions and the terms of the vassalage.
- **Output**: A narrative describing the political union and its implications for both peoples.

## Form Fields

### 1. The Union
- **Neighbor Faction**
  - **Label**: Which neighboring faction has joined your empire?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all neighboring factions)
- **Reason for Vassalage**
  - **Label**: Why did they join you?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "For protection against a common enemy," "Economic necessity," "Political marriage."

### 2. The United Empire
- **New Empire Name**
  - **Label**: Give your new united empire a name
  - **Type**: Text
  - **Required**: Yes
- **New Alliance Banner**
  - **Label**: Describe the new alliance banner
  - **Type**: Textarea
  - **Required**: No
- **Terms of Union**
  - **Label**: What are the terms of this union?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Does the vassal retain autonomy? Do they pay tribute?