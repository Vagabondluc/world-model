# Event Form Spec: Neighbor Development (5.2)

## Purpose
To evolve all minor factions in a player's home region with detailed narratives, based on a series of dice rolls. This may result in updating existing `Faction` cards or creating new `Event`, `Settlement`, or `Monster` cards.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_2_minor-faction-narrative-prompt.md`
- **Context**: The specific neighbor faction being developed, its type, the rolled development event, and its history.
- **Output**: A rich narrative describing the faction's growth and change, which can be used to update the faction's description or create a new event card.

## Form Fields (Repeatable for each minor faction)

### 1. Faction Selection
- **Neighbor to Develop**
  - **Label**: Select Neighbor Faction
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all minor factions in the player's home region)
- **Faction Type**
  - **Label**: Faction Type
  - **Type**: Read-only Text
  - **Auto-filled**: Displays the type (e.g., "Tribe," "Hive," "Cult").

### 2. Development Roll
- **Development Event (from 1d6 roll)**
  - **Label**: Rolled Development Event
  - **Type**: Dice Roller + Display
  - **Required**: Yes
  - **Help Text**: Roll 1d6 and consult the appropriate table on page 13 of the rulebook. The system will show the outcome.

### 3. Narrative Context
- **Development Trigger**
  - **Label**: What might have caused this development?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Provide context for the AI (e.g., "New leadership," "Recent conflict," "Resource discovery").
- **Impact on Your Faction**
  - **Label**: How does this affect your relationship with them?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Does this make them a bigger threat, a better ally, or a new competitor?