# Event Form Spec: Feed the People (17)

## Purpose
To create a new food-producing `Settlement` card (farming town or fishing village).

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 17)
- **Context**: Player's faction and details of the new settlement.
- **Output**: A narrative describing the new settlement's establishment and its importance to the empire's food supply.

## Form Fields

### 1. Settlement Details
- **Settlement Name**
  - **Label**: Name of the new settlement
  - **Type**: Text
  - **Required**: Yes
- **Settlement Type**
  - **Label**: What type of settlement is it?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Farming Town, Fishing Village, Ranching Outpost, Orchard Grove.
- **Location Selection**
  - **Label**: Where is it located and why?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "In the fertile Greenriver Valley," "On the coast of the Azure Bay."

### 2. Production and Distribution
- **Production Methods**
  - **Label**: Describe the production methods
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Are there any special farming techniques or fishing methods?
- **Resource Management**
  - **Label**: How are the resources managed?
  - **Type**: Textarea
  - **Required**: No
- **Distribution Systems**
  - **Label**: How is the food distributed to the empire?
  - **Type**: Textarea
  - **Required**: No

### 3. Societal Impact
- **Population Impact**
  - **Label**: How does this affect the empire's population?
  - **Type**: Textarea
  - **Required**: No
- **Economic Effects**
  - **Label**: What are the economic effects?
  - **Type**: Textarea
  - **Required**: No
- **Social Changes**
  - **Label**: Does this lead to any social changes?
  - **Type**: Textarea
  - **Required**: No