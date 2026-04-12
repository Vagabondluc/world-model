# Event Form Spec: Ancient Ruins (6)

## Purpose
To generate a `Location` card for the ruins and a new `Faction` card for the inhabitants, detailing the discovery and its significance.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 6)
- **Context**: Player's faction details and all form inputs.
- **Output**: A narrative describing the ruins, the civilization that built them, and their current inhabitants. This populates the descriptions for both the new `Location` and `Faction` cards.

## Form Fields

### 1. Discovery Context
- **Discoverer Name**
  - **Label**: Who made the discovery?
  - **Type**: Text
  - **Required**: Yes
- **Discovery Method**
  - **Label**: How were the ruins uncovered?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Landslide revealed a hidden entrance," "Excavation for a new building."
- **Ruin Location**
  - **Label**: Location of ruins
  - **Type**: Text
  - **Required**: Yes

### 2. Architectural Analysis
- **Original Civilization**
  - **Label**: What civilization might have built these?
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Ancient Human Empire, Elven Kingdom, Dwarven Halls, Giant Civilization, Draconic Culture, Unknown, Magical, Otherworldly.
- **Current Condition**
  - **Label**: Current condition of ruins
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Remarkably Preserved, Structurally Sound, Partially Collapsed, Only Fragments Remain, Mostly Buried.
- **Architectural Features**
  - **Label**: Distinctive architectural features
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Spiral towers reaching impossible heights," "Chambers carved from single stone blocks."

### 3. Contents and Significance
- **Artifacts Found**
  - **Label**: Artifacts or treasures found
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Ancient weapons of unknown metal," "Scrolls in an undeciphered language."
- **Mysteries**
  - **Label**: Mysterious or unexplained elements
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Rooms with no visible entrance," "Echoes that don't match the space."
- **Current Inhabitants**
  - **Label**: Current inhabitants (if any)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Religious Cult, Bandit Hideout, Monster Lair, Undead Guardians, Scholar Expedition, Magical Entities, New Tribe.
- **Value to Faction**
  - **Label**: Value to your faction
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Historical knowledge," "Strategic underground passages," "Ancient magical research."