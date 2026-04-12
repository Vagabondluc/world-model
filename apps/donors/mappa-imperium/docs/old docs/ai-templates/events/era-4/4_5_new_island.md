# Event Form Spec: New Island (5)

## Purpose
To guide the player through the discovery of a new island, generating a `Location` element card with associated geographical and strategic details.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 5)
- **Context**: Player's faction details, explorer's name, and all form inputs.
- **Output**: A rich narrative describing the island, its features, and its potential, which populates the `description` field of the new `Location` card.

## Form Fields

### 1. Exploration Details
- **Explorer Name**
  - **Label**: Who led the expedition?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: This person will have the island named after them (e.g., "Marina's Folly").
- **Expedition Type**
  - **Label**: Type of expedition
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Trade Route Scouting, Fishing Fleet, Pure Exploration, Military Patrol, Fleeing Danger, Storm-Driven/Accidental.
- **Discovery Circumstances**
  - **Label**: How was the island discovered?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe the story of the discovery (e.g., "Spotted during clear weather after a storm").

### 2. Geographic Features
- **Island Size**
  - **Label**: Estimated island size
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Small - A few miles across, Medium - Half a day to cross, Large - Several days to explore.
- **Primary Terrain**
  - **Label**: Primary terrain type
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Mountainous, Heavily Forested, Coastal Plains, Volcanic, Swampland, Desert/Arid, Mixed Terrain.
- **Notable Features**
  - **Label**: Notable geographic features observed
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe key landmarks (e.g., "Tall waterfall visible from sea, natural harbor on the north side").

### 3. Strategic Assessment
- **Inhabitants**
  - **Label**: Signs of current inhabitants?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Appears Uninhabited, Only Wildlife Observed, Ancient Ruins Present, Tribal Inhabitants, Hostile Inhabitants, Unknown - Strange Signs.
- **Potential Resources**
  - **Label**: Potential resources spotted
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: List resources like timber, mineral veins, fresh water, etc.
- **Strategic Value**
  - **Label**: Strategic importance to your faction
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: How could this island benefit your faction? (e.g., Control of shipping lanes, forward military base).