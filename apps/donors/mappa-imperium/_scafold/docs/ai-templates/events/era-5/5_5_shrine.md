# Event Form Spec: Shrine (5)

## Purpose
To create a new sacred `Location` (a shrine or temple) and potentially a new `Deity` card if one doesn't already exist.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 5)
- **Context**: Details about the chosen deity, the location, and the signs of divine favor.
- **Output**: A narrative describing the shrine's emergence, its religious practices, and its impact on the local culture. This populates the `description` of the new `Location` card.

## Form Fields

### 1. Divine Manifestation
- **Associated Deity**
  - **Label**: Select the deity being worshipped
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all existing deities, plus a "Create New Deity" option)
- **Sacred Location**
  - **Label**: Where has the sacred site emerged?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Describe the location (e.g., "A grove outside the city of Oakhaven").
- **Signs of Divine Favor**
  - **Label**: What signs of divine favor occurred here?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "A spring with healing waters appeared," "A statue of the god wept."

### 2. Shrine Details
- **Shrine Name**
  - **Label**: Name of the Shrine/Temple
  - **Type**: Text
  - **Required**: Yes
- **Architecture & Layout**
  - **Label**: Describe the shrine's architecture
  - **Type**: Textarea
  - **Required**: No
- **Religious Practices**
  - **Label**: What new religious practices are observed here?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe any rituals, ceremonies, or pilgrimages.
- **Keeper's Hierarchy**
  - **Label**: Who are the keepers of the shrine?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe the priests, priestesses, or guardians.

### 3. Cultural Impact
- **Impact on Local Culture**
  - **Label**: How does this shrine impact the local culture?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "The city has become a major pilgrimage site," "A new festival has been established."