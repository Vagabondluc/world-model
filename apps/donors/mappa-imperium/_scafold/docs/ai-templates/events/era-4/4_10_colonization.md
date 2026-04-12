# Event Form Spec: Colonization (10)

## Purpose
To create a new coastal `Settlement` card as the player's faction expands.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 10)
- **Context**: Player's faction details and all form inputs about the new colony.
- **Output**: A narrative describing the new settlement, its purpose, challenges, and strategic importance, populating the `description` field of the new `Settlement` card.

## Form Fields

### 1. Colonial Planning
- **Colony Leader**
  - **Label**: Who is leading the colonization effort?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Governor Elara Seastrider."
- **Motivation**
  - **Label**: Primary motivation for expansion
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Access to Resources, Territorial Expansion, Population Growth, Strategic Position, Trade Route Control, Defensive Buffer.
- **Settlers**
  - **Label**: Composition of settlers
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "200 families with farming experience."

### 2. Settlement Location
- **Coastal Type**
  - **Label**: Type of coastal location
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Natural Harbor, Protected Bay, River Mouth, Coastal Cliff, Open Beach, Small Island Coast.
- **Advantages**
  - **Label**: Geographic advantages of chosen site
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Deep water for large ships," "Fresh water stream nearby."
- **Initial Challenges**
  - **Label**: Initial challenges faced
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Rocky soil difficult to farm," "Hostile native wildlife."

### 3. Strategic Development
- **Primary Purpose**
  - **Label**: Primary purpose of settlement
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Trading Post, Fishing Village, Naval Base, Mining Camp, Agricultural Colony, Coastal Fortress, Mixed Community.
- **Local Resources**
  - **Label**: Local resources discovered
  - **Type**: Textarea
  - **Required**: No
- **Homeland Connection**
  - **Label**: Connection to homeland
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Monthly supply ships," "Signal towers for communication."