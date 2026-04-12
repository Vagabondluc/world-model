# Event Form Spec: Military Power (14)

## Purpose
To create a new military `Settlement` (fort, walls, barracks) or `Monument` (if walls).

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 14)
- **Context**: The player's faction, the type of fortification, and its strategic purpose.
- **Output**: A chronicle of the fortification's construction and its impact on regional power dynamics.

## Form Fields

### 1. Fortification Details
- **Fortification Type**
  - **Label**: What type of fortification is being built?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Border Fort, City Walls, Military Barracks, Naval Shipyard, Watchtower Network.
- **Name**
  - **Label**: Name of the Fortification/Construction
  - **Type**: Text
  - **Required**: Yes
- **Location**
  - **Label**: Where is it being built?
  - **Type**: Text
  - **Required**: Yes
- **Strategic Purpose**
  - **Label**: What is its strategic purpose?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "To defend against northern raiders," "To project naval power into the eastern sea."

### 2. Military Organization
- **Garrison Composition**
  - **Label**: Describe the garrison
  - **Type**: Textarea
  - **Required**: No
- **Command Structure**
  - **Label**: Who is in command?
  - **Type**: Text
  - **Required**: No
- **Training Programs**
  - **Label**: Are there any special training programs here?
  - **Type**: Textarea
  - **Required**: No

### 3. Regional Impact
- **Resource Allocation**
  - **Label**: What resources were allocated for this?
  - **Type**: Textarea
  - **Required**: No
- **Power Projection**
  - **Label**: How does this project your empire's power?
  - **Type**: Textarea
  - **Required**: No