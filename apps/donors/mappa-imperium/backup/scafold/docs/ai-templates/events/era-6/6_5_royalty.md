# Event Form Spec: Royalty (5)

## Purpose
To create a palace as a new `Settlement` or `Location` card and to name a region after the ruling family, enriching the lore of the empire's leadership.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Political Transformation section)
- **Context**: The player's faction, the ruling family's name, and details about the palace.
- **Output**: A narrative describing the new palace, its significance, and the legacy of the ruling family it honors.

## Form Fields

### 1. The Ruling Family
- **Ruling Family Name**
  - **Label**: Name of the ruling family
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The House of Aurelius," "The Ironhand Dynasty."
- **Current Ruler**
  - **Label**: Name of the current ruler
  - **Type**: Text
  - **Required**: No

### 2. The Palace
- **Palace Name**
  - **Label**: Name of the new palace
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Sunstone Palace," "The Citadel of the Griffin."
- **Location**
  - **Label**: Where is the palace built?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: "Near the capital," "On a strategically important cliffside."
- **Architectural Style**
  - **Label**: Describe the palace's architectural style
  - **Type**: Textarea
  - **Required**: No

### 3. The Region
- **Region to be Named**
  - **Label**: Which region will be named after the family?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Choose a geographical area of importance (e.g., "The valley east of the capital").
- **New Region Name**
  - **Label**: New Name for the Region
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Aurelian Vale," "The Ironhand Coast."