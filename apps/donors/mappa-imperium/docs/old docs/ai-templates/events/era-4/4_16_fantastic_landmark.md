# Event Form Spec: Fantastic Landmark (16)

## Purpose
To create a `Location` card for the landmark and a `Faction` card for the nearby tribe.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_2_landmark-prompt.md`
- **Context**: Player faction, regional geography, and all form inputs.
- **Output**: A rich narrative describing the landmark and the tribe that lives near it. This populates the `description` for both new element cards.

## Form Fields

### 1. Discovery Context
- **Scouts**
  - **Label**: Who first encountered the landmark?
  - **Type**: Text
  - **Required**: No
- **Circumstances**
  - **Label**: Circumstances of discovery
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Following strange lights," "Lost during a storm."
- **Geographic Region**
  - **Label**: Geographic region
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Mountain Peaks, Deep Forest, Coastal Area, Desert Wastes, Swamplands, Open Plains, Underground, Small Island.

### 2. Landmark Characteristics
- **Landmark Type**
  - **Label**: Type of landmark
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Strange Rock Formation, Ancient Monolith, Magical Grove, Mysterious Crater, Crystalline Spire, Floating Ruins, Enchanted Pool, Natural Arch, Other.
- **Physical Description**
  - **Label**: Physical description
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Three stone pillars in a perfect triangle," "Grove where trees grow in spirals."
- **Unusual Phenomena**
  - **Label**: Unusual phenomena observed
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Gravity seems weaker," "Animals behave strangely."

### 3. Local Inhabitants
- **Tribe's Race**
  - **Label**: Nearby tribe's race (from 2d6 roll)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Demonkind, Seafolk, Smallfolk, Reptilian, Dwarves, Humans, Elves, Greenskins, Animalfolk, Giantkind.
- **Tribe Name and Leader**
  - **Label**: Tribe name and leader
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Singing Stone Clan, led by Shaman Vex."
- **Tribe's Relationship with Landmark**
  - **Label**: Tribe's relationship with landmark
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Consider it sacred and guard it fiercely."
- **Tribe's Attitude to Outsiders**
  - **Label**: Tribe's attitude toward outsiders
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Hostile, Defensive, Cautious, Curious, Friendly, Trading.

### 4. Strategic Implications
- **Value to Faction**
  - **Label**: Potential value to your faction
  - **Type**: Textarea
  - **Required**: No
- **Dangers**
  - **Label**: Known or suspected dangers
  - **Type**: Textarea
  - **Required**: No