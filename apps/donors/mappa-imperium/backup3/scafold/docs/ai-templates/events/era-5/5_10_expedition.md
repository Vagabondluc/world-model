# Event Form Spec: Expedition (10)

## Purpose
To establish a new distant outpost, creating a `Settlement` card with a "Military" or "Trade" purpose.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 10)
- **Context**: Details of the expedition, its objectives, and the new settlement.
- **Output**: A narrative chronicle of the venture, including its challenges and discoveries. This populates the `description` of the new `Settlement` card.

## Form Fields

### 1. The Expedition
- **Commander's Name**
  - **Label**: Name of the Expedition's Commander
  - **Type**: Text
  - **Required**: Yes
- **Expedition Composition**
  - **Label**: Describe the fleet or caravan
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "A fleet of three warships and two supply vessels."
- **Mission Objectives**
  - **Label**: What are the primary objectives?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Establish a military foothold, Secure a new trade route, Discover new resources, Colonize new lands.
- **Journey Challenges**
  - **Label**: Describe any challenges during the journey
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Survived a massive storm," "Fought off pirates."

### 2. The New Outpost
- **Outpost Name**
  - **Label**: Name of the new outpost
  - **Type**: Text
  - **Required**: Yes
- **Location**
  - **Label**: Where is the outpost located?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Describe its location, preferably in another player's home region or unclaimed territory.
- **Outpost Type**
  - **Label**: What type of outpost is it?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Coastal Fort, Frontier Outpost, Trading Post, Exploration Base.
- **Indigenous Contacts**
  - **Label**: Were any indigenous peoples contacted?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe the nature of the first contact.
- **Supply Lines**
  - **Label**: How are supply lines maintained?
  - **Type**: Textarea
  - **Required**: No