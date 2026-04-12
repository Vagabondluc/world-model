# Event Form Spec: Iconic Landmarks (6.2)

## Purpose
To allow each player to designate a location on the map that was important to their faction's story, enriching an existing `Location` card or creating a new one with deep historical context.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_2_final-era-prompt.md` (Iconic Landmark section)
- **Context**: Details of the chosen location and the player's summary of its significance.
- **Output**: A rich historical narrative for the landmark, suitable for updating its `description`.

## Form Fields (Repeatable for each player)

### 1. Landmark Selection
- **Location Name**
  - **Label**: Choose a location that was pivotal to your empire's story
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: This can be an existing settlement, a geographical feature, a ruin, etc.
- **Original State**
  - **Label**: What was this place originally?
  - **Type**: Textarea
  - **Required**: No

### 2. Historical Significance
- **Key Event**
  - **Label**: What key event happened here?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Describe the battle, discovery, founding, or disaster that made this place famous.
- **Principal Figures**
  - **Label**: Who were the principal figures involved?
  - **Type**: Text
  - **Required**: No
- **Impact on Empire**
  - **Label**: How did this event/place change your empire?
  - **Type**: Textarea
  - **Required**: No

### 3. Current Status
- **Physical Description**
  - **Label**: What does it look like now?
  - **Type**: Textarea
  - **Required**: No
- **Current Impact**
  - **Label**: How do people interact with this place now?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Is it a site of pilgrimage, a memorial, a bustling city, a haunted ruin?