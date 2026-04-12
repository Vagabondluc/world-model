# Event Form Spec: Neighbors Develop (7)

## Purpose
To process a development event for a chosen neighboring faction, potentially updating that faction's `Faction` card or generating a new `Event` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_2_minor-faction-narrative-prompt.md`
- **Context**: The selected neighbor's details, their current relationship with the player, and the type of development.
- **Output**: A narrative describing the neighbor's evolution and its impact on the player's faction.

## Form Fields

### 1. Neighbor Selection
- **Neighbor to Develop**
  - **Label**: Select which neighbor is developing
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all neighboring factions)
- **Current Relationship**
  - **Label**: Current relationship with your faction
  - **Type**: Read-only Text
  - **Auto-filled**: Displays current diplomatic status.

### 2. Development Context
- **Development Trigger**
  - **Label**: What triggered their development?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "New leadership took control," "Discovery of a new resource," "External threat."
- **Development Type (from roll)**
  - **Label**: Development Type (rolled from Neighbor table)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Dynamically populated based on neighbor type from rulebook page 13)
  - **Help Text**: Roll a 1d6 and select the result from the appropriate table for your chosen neighbor.

### 3. Impact Assessment
- **Effect on Your Faction**
  - **Label**: How does this affect your faction?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "New trade opportunities arise," "Military threat level increases."
- **Required Response**
  - **Label**: Response required from your faction?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Send diplomatic envoy," "Reinforce border defenses."