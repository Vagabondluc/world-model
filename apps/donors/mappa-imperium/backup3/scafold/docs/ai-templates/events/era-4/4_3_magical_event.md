# Event Form Spec: Magical Event (3)

## Purpose
To guide the player through the discovery of a magical phenomenon, relic, or location, resulting in a new `Resource` or `Location` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 3)
- **Context**: Player's faction details, regional geography, and all form inputs.
- **Output**: A rich narrative describing the magical discovery, its properties, and its impact, populating the `description` field of the new element card.

## Form Fields

### 1. Discovery Context
- **Discoverer Name**
  - **Label**: Who discovered this magical phenomenon?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Name a specific person or group from your faction.
- **Discovery Location**
  - **Label**: Where was it discovered?
  - **Type**: Text
  - **Required**: No
  - **Help Text**: Specify the location within your territory.
- **Discovery Circumstances**
  - **Label**: What circumstances led to the discovery?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Following strange lights during a storm," "Investigating missing caravans."

### 2. Magical Phenomenon Details
- **Magical Type**
  - **Label**: Type of magical discovery
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Ancient Artifact, Natural Phenomenon, Power Source, Portal/Gateway, Magical Creature, Enchanted Location.
- **Physical Description**
  - **Label**: Physical appearance (if any)
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "A crystalline orb that pulses with inner light," "Floating stones that hum with energy."

### 3. Faction Integration
- **Factional Impact**
  - **Label**: How does this relate to your faction's culture/theme?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Our mountain-dwellers have always sensed earth magic," "This confirms our legends about star-touched metals."
- **Immediate Response**
  - **Label**: Your faction's immediate response
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Established a guard post," "Began careful study," "Restricted access to prevent misuse."