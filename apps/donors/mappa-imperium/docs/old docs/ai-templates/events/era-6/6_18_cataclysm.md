# Event Form Spec: Cataclysm (18)

## Purpose
To process a massive, apocalyptic event that destroys a large section of the player's home region, creating a powerful `Event` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Environmental Catastrophe section)
- **Context**: All form inputs describing the cataclysm.
- **Output**: An epic narrative describing the total devastation and the mythical story that will be told about it for generations.

## Form Fields

### 1. The Cataclysm
- **Cataclysm Type**
  - **Label**: What kind of apocalyptic event has struck?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Island Sinking/Destroyed, Comet Impact, Fury of the Gods, Planar Collision, Great Flood, World-Serpent Awakening.
- **Region Destroyed**
  - **Label**: Describe the large section of your home region that is destroyed
  - **Type**: Textarea
  - **Required**: Yes

### 2. The Story
- **The Mythical Story**
  - **Label**: Describe the mythical story that will be told of this event
  - **Type**: Textarea
  - **Required**: Yes
- **Immediate Aftermath**
  - **Label**: What is the immediate aftermath?
  - **Type**: Textarea
  - **Required**: No
- **What Remains?**
  - **Label**: What remains of the region as a testament to what was lost?
  - **Type**: Textarea
  - **Required**: No