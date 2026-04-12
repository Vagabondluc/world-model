# Event Form Spec: Bandits/Pirates (8)

## Purpose
To define a new hostile `Faction` of raiders, detailing their methods, location, and impact on the player's faction.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 8)
- **Context**: Player's faction details, regional geography, existing trade routes, and all form inputs.
- **Output**: A rich narrative describing the raider group, their motivations, and their effect on the region, populating the `description` field of the new `Faction` card.

## Form Fields

### 1. Threat Identification
- **Raider Type**
  - **Label**: Type of raiders
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Land-based Bandits, Sea Pirates, River Pirates, Highway Bandits, Military Deserters, Tribal Raiders.
- **First Reported Attack**
  - **Label**: First reported attack
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe the initial incident that brought this threat to light.
- **Attack Pattern**
  - **Label**: Pattern of attacks observed
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe their tactics and timing (e.g., "Always strike during the new moon").

### 2. Raider Characteristics
- **Group Size**
  - **Label**: Estimated group size
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Small Band (5-15), Medium Group (16-40), Large Force (41-100), Massive Army (100+).
- **Equipment and Tactics**
  - **Label**: Equipment and tactics
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe their arms, armor, and fighting style.
- **Leader or Symbol**
  - **Label**: Known leader or symbol
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Give the group a name, a leader, or a distinctive symbol (e.g., "The Crimson Eagle Raiders").

### 3. Strategic Impact
- **Primary Targets**
  - **Label**: Primary targets
  - **Type**: Checkboxes
  - **Required**: No
  - **Options**: Merchant Caravans, Remote Villages, Trade Routes, Military Supplies, Noble Travelers.
- **Suspected Base**
  - **Label**: Suspected base location
  - **Type**: Text
  - **Required**: No
  - **Help Text**: Where do you believe their hideout is? (e.g., "Hidden cove on the eastern coast").
- **Economic Impact**
  - **Label**: Economic impact on your faction
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: How are these raids affecting your economy? (e.g., "Trade revenue down 30%").
- **Planned Response**
  - **Label**: Your faction's planned response
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: What will your faction do about this threat? (e.g., "Increase patrols, hire mercenaries").