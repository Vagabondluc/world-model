# Event Form Spec: Neighbor Expands (14)

## Purpose
To process the expansion of a neighboring faction, creating a new `Settlement` card for them and an `Event` card for the player documenting the occurrence.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 14)
- **Context**: Details of the player's faction and the expanding neighbor, and all form inputs.
- **Output**: A narrative describing the neighbor's new settlement and analyzing its impact on the player's interests.

## Form Fields

### 1. Expanding Neighbor
- **Neighbor Faction**
  - **Label**: Which neighbor is expanding?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all neighboring factions)
- **Current Relationship**
  - **Label**: Current relationship status
  - **Type**: Read-only text
  - **Auto-filled**: Displays current status (e.g., "Allied," "Hostile").

### 2. Expansion Details
- **Motivation**
  - **Label**: Why are they expanding now?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Population growth," "Discovered new resources."
- **Direction of Expansion**
  - **Label**: Direction of expansion relative to you
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Toward Your Territory, Parallel to Your Border, Away From Your Territory, Into Neutral Territory, Into Contested Area.
- **New Settlement Type**
  - **Label**: Type of new settlement
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Fortified trading post," "Mining camp," "Farming village."

### 3. Impact on Your Faction
- **Border Effect**
  - **Label**: Effect on border dynamics
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Brings them closer to our territory," "Creates a buffer against other threats."
- **Trade Impact**
  - **Label**: Impact on trade and economy
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "New opportunities for trade routes," "Competition for markets."
- **Diplomatic Response**
  - **Label**: Required diplomatic response
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Negotiate border agreements," "Propose joint development."

### 4. Future Implications
- **Opportunities**
  - **Label**: New opportunities created
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Joint defense against common threats."
- **Concerns**
  - **Label**: Potential future conflicts
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Resource competition may escalate."