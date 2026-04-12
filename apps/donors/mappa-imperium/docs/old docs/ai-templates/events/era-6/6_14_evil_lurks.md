# Event Form Spec: Evil Lurks (14)

## Purpose
To place a new hostile `Faction` on the map at the site of an existing ruin.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Social Upheaval section)
- **Context**: The chosen ruin and the details of the new sinister faction.
- **Output**: A narrative describing the new evil force and how it has corrupted the chosen ruin.

## Form Fields

### 1. The Location
- **Ruin Selection**
  - **Label**: Select an existing ruin
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all ruin locations on the map)
  - **Help Text**: If no ruins exist, you will place this faction in an empty place on the map.

### 2. The Evil Force
- **Faction Type**
  - **Label**: What sinister force has claimed the ruin?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Cult, Tribe, Mad Mage, Hive, Monster.
- **Faction Name**
  - **Label**: Name of the new evil faction
  - **Type**: Text
  - **Required**: Yes
- **Description**
  - **Label**: Describe this new threat
  - **Type**: Textarea
  - **Required**: No

### 3. The Impact
- **Immediate Actions**
  - **Label**: What are their first actions?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Began abducting locals," "Corrupting the surrounding land."
- **Your Response**
  - **Label**: How does your empire plan to respond?
  - **Type**: Textarea
  - **Required**: No