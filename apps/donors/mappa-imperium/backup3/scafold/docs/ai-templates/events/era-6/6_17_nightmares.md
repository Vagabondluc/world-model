# Event Form Spec: Nightmares (17)

## Purpose
To create a new hostile `Faction` and name a geographical location to reflect the new threat.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Supernatural Upheaval section)
- **Context**: The chosen location and details of the new nightmarish threat.
- **Output**: A narrative describing the lurking evil and the transformation of the region.

## Form Fields

### 1. The Location
- **Geography to Corrupt**
  - **Label**: Which geographical area is affected?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Whispering Woods," "The Murky Fen."
- **Ominous New Name**
  - **Label**: Give the location an ominous new name
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Forest of Death," "The Smouldering Jungle."

### 2. The Threat
- **Threat Type**
  - **Label**: What foul thing is lurking here?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Lycanthropy Curse, Demonic Spiders, A Mad Druid, Rodents of Unusual Size, Formless Horrors, Other.
- **Faction Name**
  - **Label**: Name this new hostile faction
  - **Type**: Text
  - **Required**: Yes
- **Description**
  - **Label**: Describe the threat
  - **Type**: Textarea
  - **Required**: No

### 3. The Impact
- **Effect on Region**
  - **Label**: How has this threat affected the region?
  - **Type**: Textarea
  - **Required**: No
- **Your Response**
  - **Label**: How does your empire plan to respond?
  - **Type**: Textarea
  - **Required**: No