# Event Form Spec: Arcane Disturbance (4)

## Purpose
To create a significant magical occurrence on the map, generating a new `Location` card with supernatural properties and a corresponding `Event` card detailing its emergence.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/6_1_collapse-prompt.md` (Supernatural Upheaval section)
- **Context**: Player's empire state, existing magical elements, and all form inputs.
- **Output**: A rich narrative describing the manifestation of the arcane disturbance, its immediate impact, and how the empire tries to understand or control it. This populates the `Event` card, while key details populate the new `Location` card.

## Form Fields

### 1. Disturbance Details
- **Disturbance Type**
  - **Label**: What kind of arcane disturbance occurred?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Portal to another realm, Mad wizard's tower appears, Massive magical crater, Reality tear/rift, Arcane storm, Landscape transformation (e.g., floating islands).
- **Location of Disturbance**
  - **Label**: Where did the disturbance occur?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Pinpoint the location on the map.
- **Cause of Disturbance**
  - **Label**: What was the suspected cause?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "A failed ritual by a secret cult," "A celestial alignment," "The awakening of an ancient artifact."

### 2. Physical Manifestation
- **Initial Signs**
  - **Label**: What were the first signs?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe the omens or initial phenomena (e.g., "Strange lights in the sky," "Whispers on the wind").
- **Physical Description**
  - **Label**: Describe the final appearance of the disturbance
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Detail what the new location or phenomenon looks like.

### 3. Impact and Response
- **Immediate Impact**
  - **Label**: What was the immediate impact on the land and people?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe physical changes, social reactions, and shifts in power.
- **Ongoing Phenomena**
  - **Label**: What ongoing magical effects are present?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Time flows differently nearby," "Wild magic surges randomly," "Creatures are mutated."
- **Empire's Response**
  - **Label**: How is your empire responding?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Are they trying to study, contain, exploit, or destroy it? Name any key figures involved.