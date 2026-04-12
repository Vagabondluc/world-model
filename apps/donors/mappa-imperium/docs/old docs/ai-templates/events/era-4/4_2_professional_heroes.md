# Event Form Spec: Professional Heroes (4.2)

## Purpose
To create three notable `Character` cards representing heroes or significant figures in the player's faction and to name locations after them.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/3_2_hero-location-prompt.md` (adapted)
- **Context**: Player's faction details, chosen profession, and any user-provided ideas.
- **Output**: A rich narrative for each hero, detailing their background, a specific achievement, their current status, and their legacy. This populates the `description` field of the new `Character` card.

## Form Fields (Repeatable Section, 3 total)

### 1. Hero Definition
- **Hero Number**
  - **Label**: Professional
  - **Type**: Read-only Text
  - **Value**: "Hero 1 of 3", "Hero 2 of 3", etc.
- **Profession (from roll)**
  - **Label**: Profession (from 3d6 roll)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Musician, Sculptor, Artist, Poet, Author, Historian, Military Leader, City Leader, Explorer, Adventurer, Inventor, Diplomat, Trader, Humanitarian, Mage, Beast Tamer.
- **Hero Name**
  - **Label**: Hero's Name
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Give a name that fits your faction's culture.

### 2. Deeds and Legacy
- **Achievement Type**
  - **Label**: What kind of achievement are they known for?
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Discovery, Innovation, Military Victory, Artistic Creation, Political Leadership, Great Sacrifice.
- **Specific Achievement**
  - **Label**: Describe their specific achievement
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: What did they do to become famous?
- **Current Status**
  - **Label**: Current Status
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Active, Retired, Legendary (disappeared), Deceased.

### 3. Landmark Naming
- **Location to Name**
  - **Label**: Choose a location to name in their honor
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The northern forest," "The highest mountain peak."
- **New Location Name**
  - **Label**: New Location Name
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Magela's Woods," "Mount Humperdink." This action will rename an existing geographical feature or create a named region on the map.