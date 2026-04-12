# Event Form Spec: Piety (6)

## Purpose
To create a large temple or cathedral as a new `Settlement` or `Location` card, signifying the rise of a prominent religion.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Social Upheaval section)
- **Context**: The chosen deity, details of the new temple, and the nature of the religious movement.
- **Output**: A narrative describing the rise of the religion and the construction of its great temple.

## Form Fields

### 1. The Faith
- **Deity**
  - **Label**: Select the deity gaining prominence
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with existing deities, plus "Create New Deity")
- **Reason for Prominence**
  - **Label**: Why has this religion gained prominence now?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "A charismatic new leader," "Miracles attributed to the deity," "A response to recent disasters."

### 2. The Temple
- **Temple Name**
  - **Label**: Name of the Cathedral/Temple
  - **Type**: Text
  - **Required**: Yes
- **Location**
  - **Label**: Where is the temple located?
  - **Type**: Text
  - **Required**: Yes
- **Description**
  - **Label**: Describe the temple
  - **Type**: Textarea
  - **Required**: No

### 3. The Impact
- **Political Influence**
  - **Label**: How does this new religious prominence affect politics?
  - **Type**: Textarea
  - **Required**: No
- **Social Changes**
  - **Label**: What social changes has it brought about?
  - **Type**: Textarea
  - **Required**: No