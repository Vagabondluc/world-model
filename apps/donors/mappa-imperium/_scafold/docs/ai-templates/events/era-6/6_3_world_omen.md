# Event Form Spec: World Omen (6.3)

## Purpose
To generate the final, world-changing omen that concludes the game's story, creating a final `Event` card. This is a collaborative event.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_2_final-era-prompt.md` (World-Ending Omen section)
- **Context**: The rolled omen type and the collective summary of the world's final state.
- **Output**: A rich, epic narrative describing the omen's manifestation and its deeper meaning, providing a capstone to the world's story.

## Form Fields

### 1. The Omen
- **Omen Roller**
  - **Label**: Who will roll for the omen?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: As a group, select one player to make the final 2d6 roll.
- **Omen Type (from 2d6 roll)**
  - **Label**: Rolled Omen
  - **Type**: Dice Roller + Display
  - **Required**: Yes
  - **Help Text**: The result of the roll will be displayed here.

### 2. Manifestation
- **Initial Appearance**
  - **Label**: Where and how does the omen first appear?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: This should correspond to the rolled omen (e.g., "Black smoke rises from the tallest peak, Mount Cinder").
- **Global Spread**
  - **Label**: How does the omen spread or become known worldwide?
  - **Type**: Textarea
  - **Required**: No

### 3. Meaning and Legacy
- **Immediate Effect**
  - **Label**: What is the immediate effect on the world and its people?
  - **Type**: Textarea
  - **Required**: No
- **Greater Meaning**
  - **Label**: What does this omen herald for the future?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Is it a dark omen or a sign of prosperity? How does it reflect your world's story?