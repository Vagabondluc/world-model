# Event Form Spec: Revolution (16)

## Purpose
To handle a major political schism where half the player's empire breaks away, creating a new hostile `Faction` card and a corresponding `Event` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Political Transformation section)
- **Context**: Player's empire state, reasons for rebellion, and details of the new revolutionary faction.
- **Output**: A rich chronicle of the uprising, detailing its causes, leaders, and the division of territory and resources. This narrative populates the new `Event` card.

## Form Fields

### 1. Seeds of Rebellion
- **Rebellion Causes**
  - **Label**: What are the primary causes of the rebellion?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Excessive taxation," "Religious persecution," "Lack of political representation for outer territories."
- **Leader of the Revolution**
  - **Label**: Who emerged as the leader of the uprising?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Give a name and brief background for the revolutionary leader.

### 2. The New Faction
- **New Faction Name**
  - **Label**: Name the new revolutionary faction
  - **Type**: Text
  - **Required**: Yes
- **Faction Identity & Banner**
  - **Label**: Describe their identity and banner
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: What are their core beliefs? What symbols do they rally under?
- **Military Actions**
  - **Label**: Describe the initial military actions
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: How did the split occur militarily? Were there battles, or did garrisons simply switch allegiance?

### 3. Division of the Empire
- **Territory Division**
  - **Label**: How is the empire's territory divided?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Which settlements, regions, and resources now belong to the new faction? (Approximately half).
- **Resource Splitting**
  - **Label**: How are key resources and assets split?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Who controls the major mines, trade routes, and treasuries?
- **New Relationship**
  - **Label**: Relationship between the two factions
  - **Type**: Read-only Text
  - **Value**: Hostile
  - **Help Text**: Per the rules, the new faction is now treated as a hostile neighbor.