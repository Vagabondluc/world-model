# Event Form Spec: Evil Lair or Hive (4)

## Purpose
To define a new hostile `Faction`, detailing the nature of the threat and its location.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 4)
- **Context**: Player's faction details, nearby settlements, and all form inputs.
- **Output**: An ominous narrative describing the evil presence, its environmental impact, and the threat it poses, which will populate the `description` of the new `Faction` card.

## Form Fields

### 1. Initial Detection
- **First Signs**
  - **Label**: What were the first signs noticed?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Livestock disappearing near the old quarry," "Strange sounds echoing from underground."
- **Reporter**
  - **Label**: Who first reported these signs?
  - **Type**: Text
  - **Required**: No
  - **Help Text**: Name the farmer, border patrol, or scout who raised the alarm.
- **Suspected Location**
  - **Label**: Suspected location of the Lair/Hive
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Abandoned mine shaft," "Dense forest grove," "Coastal caves."

### 2. Threat Assessment
- **Threat Type**
  - **Label**: Type of hostile force
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Demonic Cult, Undead Necropolis, Giant Insect Hive, Aberrant Creatures, Corrupted Animals, Dark Cultists, Other.
- **Threat Level**
  - **Label**: Immediate threat level to nearby settlements
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Low - Isolated incidents, Moderate - Regular raids, High - Coordinated assault, Extreme - Settlement evacuation needed.
- **Environmental Changes**
  - **Label**: Environmental changes observed
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Plants withering in an expanding circle," "A strange fog that doesn't lift."

### 3. Strategic Response
- **Settlements at Risk**
  - **Label**: Which settlements are most at risk?
  - **Type**: Text
  - **Required**: No
  - **Help Text**: List any nearby towns, outposts, or camps.
- **Response Plan**
  - **Label**: Your faction's planned response
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: How will your faction deal with this new threat?