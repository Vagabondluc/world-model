# Event Form Spec: Monster Awakens (18)

## Purpose
To create a new legendary monster as a `Faction` card, detailing its emergence and impact.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 18)
- **Context**: Player's faction, regional geography, and all form inputs.
- **Output**: A narrative describing the legendary monster, its awakening, and the new reality it imposes on the region. This populates the `description` of the new `Faction` card.

## Form Fields

### 1. Awakening Context
- **Trigger**
  - **Label**: What disturbed the monster's slumber?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Mining operation broke into an ancient chamber."
- **First Witness**
  - **Label**: Who first witnessed the awakening?
  - **Type**: Text
  - **Required**: No
- **Location of Emergence**
  - **Label**: Where has it emerged?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Ancient volcanic crater," "Depths of the Shadowmere Lake."

### 2. Monster Characteristics
- **Creature Type**
  - **Label**: Type of legendary creature
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Ancient Dragon, Primordial Titan, Sea Leviathan, Multi-headed Hydra, Immortal Phoenix, Deep Kraken, Earth Wyrm, Elemental Lord, Cosmic Aberration, Ancient Spirit, Custom.
- **Physical Description**
  - **Label**: Physical description and scale
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Massive serpentine body with crystalline scales," "Wingspan that blocks out the sun."
- **Abilities/Powers**
  - **Label**: Unique abilities or powers
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Breath weapon that turns stone to glass."
- **Intelligence Level**
  - **Label**: Intelligence level
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Primal Instinct, Animal Cunning, Human-level Intelligence, Ancient Wisdom, Cosmic Knowledge.

### 3. Territorial Impact
- **Territory Claimed**
  - **Label**: Territory claimed or affected
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Entire mountain range now considered its domain."
- **Environmental Effects**
  - **Label**: Environmental changes caused
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Temperature increased dramatically," "Plants grow unnaturally large."
- **Threatened Settlements**
  - **Label**: Settlements directly threatened
  - **Type**: Text
  - **Required**: No

### 4. Strategic Response
- **Initial Response**
  - **Label**: Your faction's immediate response
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Evacuate threatened settlements."
- **Unexpected Opportunities**
  - **Label**: Unexpected opportunities created
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Monster's presence scares away bandit raids."
- **Long-term Plan**
  - **Label**: Long-term coexistence strategy
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Attempt to establish a tribute system."