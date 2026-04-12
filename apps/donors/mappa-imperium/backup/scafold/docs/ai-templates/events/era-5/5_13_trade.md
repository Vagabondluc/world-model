# Event Form Spec: Trade (13)

## Purpose
To establish a new trade route, creating a `Location` card for a trade post and updating the relationship between two factions.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 13)
- **Context**: Details of both player's and partner's factions, the chosen route, traded goods, and existing world state.
- **Output**: A rich narrative describing the economic and cultural impact of the new trade route, which can be used for the trade post's description.

## Form Fields

### 1. Trade Partnership
- **Partner Faction**
  - **Label**: Select a trade partner
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all other factions on the map)
- **Trade Agreement Type**
  - **Label**: Type of trade agreement
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Resource Exchange, Mutual Defense & Trade, Open Borders, Luxury Goods Pact.

### 2. Route & Logistics
- **Route Description**
  - **Label**: Describe the trade route
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Detail the path of the new road or sea lane. If a road, mention start/end points. If no road is possible, describe the new coastal trade post.
- **Primary Goods from Your Faction**
  - **Label**: What goods are you exporting?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: List the key resources or products your faction will trade.
- **Primary Goods from Partner Faction**
  - **Label**: What goods are you importing?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: List the key resources or products you will receive.

### 3. Trade Post Details
- **Trade Post Name**
  - **Label**: Name the new trade post
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Give a thematic name to the new settlement on the trade route.
- **Trade Post Location**
  - **Label**: Where is the trade post located?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Describe its location along the route (e.g., "At the midway point, by the river crossing").

### 4. Strategic Impact
- **Economic Impact**
  - **Label**: Expected economic impact
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: How will this new route boost your faction's economy?
- **Cultural Exchange**
  - **Label**: Describe the cultural exchange
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: What ideas, customs, or technologies will be shared along this route?
- **Security Measures**
  - **Label**: How will the route be protected?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Detail plans for patrols, forts, or joint security forces.