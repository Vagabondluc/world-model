# Event Form Spec: Neighbors Develop (9)

## Purpose
To trigger the more detailed neighbor development process outlined in rule 5.2. This form is simpler than the full 5.2 process, acting as the entry point.

## AI Integration
- **This event primarily triggers a game mechanic rather than direct AI generation.** The more detailed form at `5_2_neighbor_development.md` will handle the AI interaction for the chosen neighbor.

## Form Fields

### 1. Faction Selection
- **Neighbor to Develop**
  - **Label**: Select a neighbor at random to develop
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all neighboring factions on the map)
- **Current Relationship**
  - **Label**: Current relationship with your faction
  - **Type**: Read-only Text
  - **Auto-filled**: Displays current diplomatic status.

### 2. Trigger Development
- **Proceed Button**
  - **Label**: Proceed to Neighbor Development
  - **Type**: Button
  - **Action**: Takes the user to the detailed development form (`5_2_neighbor_development.md`) for the selected faction.
  - **Help Text**: This will begin the multi-step process of evolving the selected neighbor faction as per rule 5.2. 