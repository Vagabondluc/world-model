# Event Form Spec: Overthrown (4)

## Purpose
To process a rebellion in one of the player's settlements, creating a new independent `Faction` card and updating the original `Settlement` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 4)
- **Context**: Details of the settlement, the overthrown rulers, and the new revolutionary government.
- **Output**: A historical chronicle of the rebellion, its causes, and the transformation of the city. This can be used for a new `Event` card.

## Form Fields

### 1. The Rebellion
- **Rebellious Settlement**
  - **Label**: Which settlement has rebelled?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with player's settlements)
- **Overthrown Rulers**
  - **Label**: Who was the ruling class that was overthrown?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Governor's Council," "The Merchant's Guild."
- **Rebellion Spark**
  - **Label**: What was the initial spark for the rebellion?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Describe the event that triggered the uprising.

### 2. The New Order
- **Revolutionary Leaders**
  - **Label**: Name the key revolutionary leaders
  - **Type**: Text
  - **Required**: Yes
- **New Faction Name & Banner**
  - **Label**: New Faction Name & Banner
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: What do the revolutionaries call themselves now?
- **New Governing Structure**
  - **Label**: Describe the new governing structure
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "A council of workers," "A military junta," "A democratic assembly."

### 3. City's Transformation
- **New Settlement Name**
  - **Label**: New name for the settlement
  - **Type**: Text
  - **Required**: No
  - **Help Text**: Often, liberated cities take a new name.
- **Changed Laws/Customs**
  - **Label**: What laws or customs have changed?
  - **Type**: Textarea
  - **Required**: No
- **Wider Impact**
  - **Label**: How does this affect the rest of your empire?
  - **Type**: Textarea
  - **Required**: No