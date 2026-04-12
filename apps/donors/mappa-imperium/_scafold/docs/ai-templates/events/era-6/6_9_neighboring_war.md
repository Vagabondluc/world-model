# Event Form Spec: Neighboring War (9)

## Purpose
To initiate a conflict between two non-player factions, creating a `War` card and an `Event` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/Z_battle-chronicle-prompt.md`
- **Context**: Details of the two warring factions and the cause of the conflict.
- **Output**: A battle chronicle from an observer's perspective.

## Form Fields

### 1. The Combatants
- **Attacker**
  - **Label**: Select the attacking faction
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all non-player factions)
- **Defender**
  - **Label**: Select the defending faction
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all non-player factions)

### 2. The Conflict
- **Cause of War**
  - **Label**: What is the cause of the war?
  - **Type**: Textarea
  - **Required**: No
- **Battle Location**
  - **Label**: Where is the main battle taking place?
  - **Type**: Text
  - **Required**: No

### 3. Resolution
- **Battle Outcome (1d6 roll)**
  - **Label**: Roll on the War! Table (pg 16)
  - **Type**: Dice Roller + Display
  - **Required**: Yes
  - **Help Text**: The outcome will determine the narrative.