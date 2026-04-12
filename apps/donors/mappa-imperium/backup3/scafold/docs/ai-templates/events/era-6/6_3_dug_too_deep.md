# Event Form Spec: Dug Too Deep (3)

## Purpose
To process the emergence of an underground monster that destroys or claims a settlement, creating a new `Faction` (monster) card and updating a `Settlement` card's status.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Supernatural Upheaval section)
- **Context**: Details of the settlement, the monster, and the event.
- **Output**: A narrative describing the disastrous discovery and the nature of the new monster threat.

## Form Fields

### 1. The Discovery
- **Excavation Site**
  - **Label**: Which settlement was destroyed or claimed?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with player's settlements)
- **Reason for Digging**
  - **Label**: Why were they digging there?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Mining for rare minerals," "Expanding the city's under-levels."

### 2. The Monster
- **Monster Name**
  - **Label**: Name the monster that has risen
  - **Type**: Text
  - **Required**: Yes
- **Monster Type**
  - **Label**: What kind of monster is it?
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Ancient Wyrm, Subterranean Horror, Elemental Lord, Undead Titan, Colony of Monstrosities.
- **Description**
  - **Label**: Describe the monster
  - **Type**: Textarea
  - **Required**: Yes

### 3. The Aftermath
- **Settlement's Fate**
  - **Label**: What happened to the settlement?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Utterly Destroyed (becomes a ruin), Claimed as Lair (ownership transfers to monster).
- **Empire's Response**
  - **Label**: How is your empire responding to this new threat?
  - **Type**: Textarea
  - **Required**: No