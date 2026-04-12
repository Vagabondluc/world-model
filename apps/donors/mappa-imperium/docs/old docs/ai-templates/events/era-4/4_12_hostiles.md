# Event Form Spec: Hostiles (12)

## Purpose
To create a new hostile `Faction` card, with its type and race determined by dice rolls.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 12)
- **Context**: Player's faction, the rolled hostile type and race, and all form inputs.
- **Output**: A narrative describing the new hostile group, their motivations, and the nature of the threat they pose. This populates the `description` of the new `Faction` card.

## Form Fields

### 1. First Contact
- **Contact Method**
  - **Label**: How was contact made?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Border patrol ambushed," "Trading caravan reported strange encounters."
- **Base Location**
  - **Label**: Where are they based?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Dense forest beyond eastern border."

### 2. Hostile Force Details
- **Hostile Type (from 1d6 roll)**
  - **Label**: Type of hostile force (Neighbor Table)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Hive or Swarm, Tribe or Clan, Minor Kingdom, Magic User, Cult/Order/Lair, Legendary Monster.
- **Race (if applicable, from 2d6 roll)**
  - **Label**: Race (Race Table)
  - **Type**: Dropdown
  - **Required**: Conditional (if type requires a race roll)
  - **Options**: Demonkind, Seafolk, Smallfolk, Reptilian, Dwarves, Humans, Elves, Greenskins, Animalfolk, Giantkind.
- **Name and Leadership**
  - **Label**: Name and leadership
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Bloodclaw Tribe led by Chieftain Grimfang."

### 3. Threat Assessment
- **Military Capability**
  - **Label**: Military capability
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Nuisance - Raids and skirmishes, Moderate - Organized attacks, Serious - Sustained campaign, Existential - Threat to survival.
- **Motivation**
  - **Label**: Why are they hostile?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Your expansion encroached on their territory."
- **Tactics**
  - **Label**: Observed tactics and behavior
  - **Type**: Textarea
  - **Required**: No

### 4. Strategic Response
- **Immediate Threat**
  - **Label**: Immediate threat to specific settlements
  - **Type**: Text
  - **Required**: No
- **Defensive Plan**
  - **Label**: Your faction's defensive strategy
  - **Type**: Textarea
  - **Required**: No
- **New Settlement (if needed)**
  - **Label**: New settlement needed? (roll Settlement Table)
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Food, Mining, Industry, Trade, Military, Religion.
  - **Help Text**: If the threat requires a new defensive settlement, roll and select its purpose.