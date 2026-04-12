# Event Form Spec: The King is Dead (3)

## Purpose
To handle a major political upheaval in the player's faction, resulting in its dissolution into at least three new successor `Faction` cards.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 3)
- **Context**: Details of the deceased ruler, player's faction, and the inputs for each new claimant faction.
- **Output**: A rich historical chronicle detailing the succession crisis, the key players, and the immediate aftermath. This narrative can be used as a new `Event` card.

## Form Fields

### 1. The Fallen Ruler
- **Deceased Ruler Name**
  - **Label**: Name of the fallen leader
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: The name of the king, queen, or leader whose death triggered the crisis.
- **Cause of Death**
  - **Label**: Cause of Death
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Natural Causes, Killed in Battle, Assassination, Accident, Disease, Mysterious Circumstances.
- **Succession Crisis**
  - **Label**: Why is there no clear heir?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Explain the political situation (e.g., "Died without children," "Disputed will," "Heir was illegitimate").

### 2. The Claimants (Repeatable Section, minimum 3)
- **Faction Name**
  - **Label**: New Faction Name
  - **Type**: Text
  - **Required**: Yes
- **Leader Name**
  - **Label**: Leader of this faction
  - **Type**: Text
  - **Required**: Yes
- **Claim to Power**
  - **Label**: What is their claim to the throne?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Claims to be a secret child," "Backed by the military," "Supported by the merchant guilds."
- **Power Base**
  - **Label**: Power Base (Settlements/Resources)
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Which parts of the old empire support them?
- **Vision for the Empire**
  - **Label**: Vision for the empire
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: What is their goal or political ideology?

### 3. Aftermath
- **Prime Faction Switch**
  - **Label**: Switch your Prime Faction?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with the new claimant factions created above)
  - **Help Text**: You may choose one of the successor states to become your new Prime Faction.
- **Immediate Changes**
  - **Label**: Describe immediate changes
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: How did this crisis immediately affect administration, trade, and military loyalty?