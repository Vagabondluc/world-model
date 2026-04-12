# Event Form Spec: Expand (11)

## Purpose
To create a new `Settlement` card anywhere on the map, with its purpose determined by a dice roll.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 11)
- **Context**: The player's faction, the rolled settlement purpose, and its chosen location.
- **Output**: A narrative describing the new settlement, the rationale for its location, and its integration into the wider empire. This populates the `description` of the new `Settlement` card.

## Form Fields

### 1. Expansion Context
- **Location Rationale**
  - **Label**: Why was this location chosen for expansion?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Explain the strategic, economic, or political reason for placing a settlement here.
- **Location Description**
  - **Label**: Describe the new settlement's location
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "In the unclaimed foothills of the Dragon's Tooth mountains."

### 2. Settlement Details
- **Settlement Name**
  - **Label**: New Settlement Name
  - **Type**: Text
  - **Required**: Yes
- **Primary Purpose (from 1d6 roll)**
  - **Label**: Primary purpose (Settlement Table, pg 9)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Food, Mining, Industry, Trade, Military, Religion.
- **Resource Base**
  - **Label**: What local resources does it secure?
  - **Type**: Textarea
  - **Required**: No
- **Initial Population**
  - **Label**: Describe the initial population
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Who are the first settlers? (e.g., "Military veterans and their families").
- **Leadership Structure**
  - **Label**: Who is in charge of the new settlement?
  - **Type**: Text
  - **Required**: No
  - **Help Text**: Name the governor, mayor, or commander.
- **Integration Challenges**
  - **Label**: What are the challenges to integrating this settlement?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Long supply lines," "Proximity to a rival."