# Event Form Spec: Mobilize (12)

## Purpose
To create a new fort or military settlement as a `Settlement` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Military Conflicts section)
- **Context**: Player's faction, reason for mobilization, and details of the new settlement.
- **Output**: A narrative describing the new military installation and its strategic importance in these trying times.

## Form Fields

### 1. Mobilization Context
- **Reason for Mobilization**
  - **Label**: Why is your empire mobilizing?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "To defend against a new threat," "To consolidate power in a rebellious region."
- **Settlement Name**
  - **Label**: Name of the new fort/settlement
  - **Type**: Text
  - **Required**: Yes
- **Location**
  - **Label**: Where is it being built?
  - **Type**: Text
  - **Required**: Yes

### 2. Military Details
- **Settlement Type**
  - **Label**: Type of military settlement
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Border Fort, Supply Depot, Training Camp, Naval Base, Fortified Garrison Town.
- **Description**
  - **Label**: Describe the new installation
  - **Type**: Textarea
  - **Required**: No