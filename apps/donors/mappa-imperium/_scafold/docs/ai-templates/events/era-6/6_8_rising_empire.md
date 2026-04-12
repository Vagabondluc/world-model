# Event Form Spec: Rising Empire (8)

## Purpose
To expand the empire during the Age of Collapse by adding a new `Settlement` or enhancing an existing one.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md`
- **Context**: Player's faction and the details of the expansion.
- **Output**: A narrative describing the empire's surprising growth and the new development.

## Form Fields

### 1. Expansion Type
- **Action**
  - **Label**: How is your empire thriving?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Roll & draw a new settlement, Expand an existing settlement.

### 2. New Settlement Details (if chosen)
- **Settlement Purpose (from 1d6 roll)**
  - **Label**: New Settlement's Purpose
  - **Type**: Dropdown
  - **Required**: Conditional
  - **Options**: Food, Mining, Industry, Trade, Military, Religion.
- **Settlement Name**
  - **Label**: New Settlement Name
  - **Type**: Text
  - **Required**: Conditional
- **Location**
  - **Label**: Location of new settlement
  - **Type**: Text
  - **Required**: Conditional

### 3. Expansion Details (if chosen)
- **Settlement to Expand**
  - **Label**: Which settlement will be expanded?
  - **Type**: Dropdown
  - **Required**: Conditional
  - **Options**: (Populated with player's settlements)
- **Expansion Type**
  - **Label**: How is it being expanded?
  - **Type**: Dropdown
  - **Required**: Conditional
  - **Options**: New Farmland, Outer Walls, New District, Port Expansion.
- **Description**
  - **Label**: Describe the expansion
  - **Type**: Textarea
  - **Required**: Conditional