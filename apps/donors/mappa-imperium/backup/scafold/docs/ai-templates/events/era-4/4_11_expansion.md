# Event Form Spec: Expansion (11)

## Purpose
To create a new inland `Settlement` card, with its purpose determined by a dice roll.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 11)
- **Context**: Player's faction details, the rolled settlement purpose, and all form inputs.
- **Output**: A narrative describing the new settlement, its challenges, and its role within the faction, populating the `description` of the new `Settlement` card.

## Form Fields

### 1. Expansion Context
- **Expansion Reason**
  - **Label**: Why is expansion needed now?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Population outgrown current settlements," "Discovery of valuable resources."
- **Overseer**
  - **Label**: Who is overseeing the expansion?
  - **Type**: Text
  - **Required**: No
- **Expansion Group**
  - **Label**: Size and composition of expansion group
  - **Type**: Textarea
  - **Required**: No

### 2. Settlement Details
- **Location**
  - **Label**: Chosen location for new settlement
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Fertile valley 3 days east of capital."
- **Primary Purpose**
  - **Label**: Primary purpose (from 1d6 roll)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Food, Mining, Industry, Trade, Military, Religion.
- **Natural Advantages**
  - **Label**: Natural advantages of location
  - **Type**: Textarea
  - **Required**: No

### 3. Development Challenges
- **Establishment Challenges**
  - **Label**: Construction or establishment challenges
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Dense forest requiring extensive clearing."
- **Secured Resources**
  - **Label**: Resources secured by settlement
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Access to rare herbs for medicine."
- **Integration**
  - **Label**: How it connects to existing settlements
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "New road connects to capital," "River route for shipping goods."