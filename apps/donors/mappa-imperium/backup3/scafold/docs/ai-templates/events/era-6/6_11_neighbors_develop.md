# Event Form Spec: Neighbors Develop (11)

## Purpose
To trigger the detailed neighbor development process (rule 5.2). This is functionally identical to the Era V event.

## AI Integration
- **This event primarily triggers a game mechanic.** The detailed form at `5_2_neighbor_development.md` will handle the AI interaction.

## Form Fields

### 1. Faction Selection
- **Neighbor to Develop**
  - **Label**: Select a neighbor at random to develop
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all neighboring factions)

### 2. Trigger Development
- **Proceed Button**
  - **Label**: Proceed to Neighbor Development
  - **Type**: Button
  - **Action**: Takes the user to the detailed development form (`5_2_neighbor_development.md`) for the selected faction.