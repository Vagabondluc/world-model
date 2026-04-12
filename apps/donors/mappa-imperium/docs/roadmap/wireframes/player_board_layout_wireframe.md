# Player Board Layout Wireframe

## Wireframe Overview

The player board layout displays player-specific information including their controlled hexagonal region (sector), resources, available actions, and turn status. This interface is designed to give each player a clear view of their empire's status and available options within the shared hexagonal map.

## Layout Diagram

### Desktop Layout (1200px+)

```
+-----------------------------------------------------------------------------------------+
| PLAYER BOARD HEADER                                                                    |
| [Player 1 - The Iron Hand Clan]  [Turn: 5]  [Status: Active]  [⚙ Settings]       |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  +---------------------+  +-----------------------------------------------------------+  |
|  |                     |  |                                                           |  |
|  |  SECTOR VIEW       |  |                                                           |  |
|  |  (Left Panel)       |  |                                                           |  |
|  |                     |  |                                                           |  |
|  |  +-----------+      |  |                    RESOURCE PANEL                          |  |
|  |  |           |      |  |                                                           |  |
|  |  |  PLAYER   |      |  |  +---------------------+  +---------------------+        |  |
|  |  |  SECTOR  |      |  |  | PRIMARY RESOURCES   |  | SECONDARY RESOURCES |        |  |
|  |  |  MAP     |      |  |  |                     |  |                     |        |  |
|  |  |           |      |  |  |  [Gold Coin] 150    |  |  [Wood] 120         |        |  |
|  |  |  ⬡ ⬡ ⬡ |      |  |  |  [Food] 80         |  |  [Stone] 95         |        |  |
|  |  |  ⬡ ⬡ ⬡ |      |  |  |  [Iron] 45         |  |  [Horses] 30        |        |  |
|  |  |  ⬡ ⬡ ⬡ |      |  |  |  [Mana] 25         |  |  [Spices] 15        |        |  |
|  |  |           |      |  |  |                     |  |                     |        |  |
|  |  +-----------+      |  |  |  Income: +5/turn    |  |  +---------------------+        |  |
|  |                     |  |  |  +---------------------+  |                             |  |
|  |  [Zoom Sector]     |  |                                                           |  |
|  |  [View Full Map]   |  |                                                           |  |
|  +---------------------+  +-----------------------------------------------------------+  |
|                                                                                         |
|  +---------------------+  +-----------------------------------------------------------+  |
|  |  ACTION PANEL      |  |  FRONT INFORMATION                                        |  |
|  |  (Bottom Left)      |  |                                                           |  |
|  |                     |  |  SHARED BORDERS                                           |  |
|  |  MAIN ACTIONS       |  |  +---------------------+  +---------------------+        |  |
|  |  [End Turn]        |  |  |  vs Player 2        |  |  vs Player 3        |        |  |
|  |  [Skip Turn]       |  |  |  Length: 6 hexes    |  |  Length: 4 hexes    |        |  |
|  |                     |  |  |  Status: Stable      |  |  Status: Contested   |        |  |
|  |  SPECIAL ACTIONS   |  |  |  [Negotiate] [War]  |  |  [Negotiate] [War]  |        |  |
|  |  [Trade]           |  |  +---------------------+  +---------------------+        |  |
|  |  [Diplomacy]       |  |                                                           |  |
|  |  [Fortify]        |  |  SETTLEMENTS                                              |  |
|  |  [Scout]           |  |  +---------------------------------------------------+    |  |
|  |                     |  |  | Khaz-Grund (Capital)  | Goldport (Port)   |    |  |
|  |  QUICK ACTIONS     |  |  | Pop: 5,000            | Pop: 2,500       |    |  |
|  |  [⚡ Quick Claim]  |  |  | Def: Strong            | Def: Medium      |    |  |
|  |  [🎲 Random Event]|  |  +---------------------------------------------------+    |  |
|  +---------------------+  +-----------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------+
| TURN PHASE INDICATOR                                                                  |
| [PLAN] → [LOCK] → [RESOLVE]  (Current: LOCK)                                           |
+-----------------------------------------------------------------------------------------+
```

### Tablet Layout (768px - 1199px)

```
+-----------------------------------------------------------------------------------+
| PLAYER BOARD HEADER (Compact)                                                          |
| [P1: Iron Hand]  [Turn: 5]  [Active]  [⚙]                                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +------------------+  +--------------------------------------------------------+  |
|  | SECTOR VIEW      |  |                                                        |  |
|  | (Top Half)       |  |                   RESOURCES (Grid)                   |  |
|  |                 |  |  [Gold:150] [Food:80] [Wood:120] [Iron:45]            |  |
|  |  [Player Sector] |  |  [Mana:25] [Stone:95] [Horses:30] [Spices:15]          |  |
|  |  [View Full Map] |  |                                                        |  |
|  +------------------+  +--------------------------------------------------------+  |
|                                                                                   |
|  +--------------------------------------------------------+  +------------------+            |
|  | ACTIONS (Horizontal)                              |  | FRONTS (Compact) |            |
|  | [End Turn] [Skip] [Trade] [Diplo] [Fort] [Scout] |  | P2: Stable [⚔]   |            |
|  +--------------------------------------------------------+  | P3: Contested [⚔] |            |
|                                                            +------------------+            |
+-----------------------------------------------------------------------------------+
| TURN PHASE: [PLAN] → [LOCK] → [RESOLVE]                                               |
+-----------------------------------------------------------------------------------+
```

### Mobile Layout (<768px)

```
+-----------------------------------------------------------------------+
| PLAYER BOARD HEADER (Compact)                                           |
| [P1] [Turn:5] [⚙]                                                  |
+-----------------------------------------------------------------------+
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | SECTOR VIEW (Mini)                                               |  |
|  |  ⬡ ⬡ ⬡                                                        |  |
|  |  ⬡ ⬡ ⬡                                                        |  |
|  |  [View Full Map]                                                 |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | RESOURCES (Scrollable)                                           |  |
|  |  Gold: 150 (+5/turn)                                           |  |
|  |  Food: 80 (+3/turn)                                            |  |
|  |  Wood: 120 (+4/turn)                                           |  |
|  |  Iron: 45 (+2/turn)                                            |  |
|  |  [Show All Resources ▼]                                        |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | ACTIONS (Grid)                                                  |  |
|  |  [End Turn]  [Skip]                                             |  |
|  |  [Trade]    [Diplo]                                             |  |
|  |  [Fortify]  [Scout]                                             |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | FRONTS (Tabbed)                                                |  |
|  | [vs P2] [vs P3] [vs P4]                                      |  |
|  | P2: Stable (6 hexes) [⚔]                                     |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
| PHASE: [PLAN] → [LOCK] → [RESOLVE]                                              |
+-----------------------------------------------------------------------+
```

## Component Details

### Player Board Header
- **Position**: Top of player board
- **Components**:
  - Player Name: Display current player name
  - Faction Name: Display faction/empire name
  - Turn Counter: Current turn number
  - Status Indicator: Active/Waiting/Offline
  - Settings Button: Access to player settings

### Sector View (Left Panel)
- **Position**: Left side of player board
- **Components**:
  - Player Sector Map: Mini-map showing player's controlled hexes
  - Zoom Sector Button: Zoom into player's sector on main map
  - View Full Map Button: Return to full world map view

### Resource Panel (Right Panel)
- **Position**: Right side of player board
- **Components**:
  - Primary Resources: Gold, Food, Iron, Mana
  - Secondary Resources: Wood, Stone, Horses, Spices
  - Resource Icons: Visual representation of each resource
  - Income Display: Resources gained per turn
  - Resource Trend: Up/down arrows for income changes

### Action Panel (Bottom Left)
- **Position**: Bottom left of player board
- **Components**:
  - Main Actions: End Turn, Skip Turn
  - Special Actions: Trade, Diplomacy, Fortify, Scout
  - Quick Actions: Quick Claim, Random Event

### Front Information (Bottom Right)
- **Position**: Bottom right of player board
- **Components**:
  - Shared Borders Display: Shows borders with each neighboring player
  - Border Length: Number of hexes shared
  - Border Status: Stable, Contested, Under Pressure
  - Front Actions: Negotiate, Declare War, Propose Alliance

### Settlements Panel
- **Position**: Below resources or in separate tab
- **Components**:
  - Settlement List: All settlements owned by player
  - Settlement Details: Population, Defense, Production
  - Capital Indicator: Identifies capital city

### Turn Phase Indicator
- **Position**: Bottom of player board
- **Components**:
  - Phase Display: PLAN → LOCK → RESOLVE
  - Current Phase Highlighted: Shows active phase
  - Phase Timer: Time remaining in current phase (optional)

## User Flow

### Initial Load
1. Player board loads with current player's information
2. Sector view displays player's controlled hexes
3. Resources show current amounts and income
4. Front information displays current border status

### Resource Management
1. Player views current resources in resource panel
2. Income shows resources gained per turn
3. Resource trends indicate positive/negative growth
4. Player can click resources for detailed breakdown

### Taking Actions
1. Player selects action from action panel
2. Action executes based on game rules
3. Resources may be consumed or gained
4. Front status may change based on actions

### Turn Management
1. Player performs desired actions during PLAN phase
2. Player locks in choices during LOCK phase
3. Results resolve during RESOLVE phase
4. Turn advances to next player
5. Player board updates with new state

### Front Management
1. Player views shared borders with neighbors
2. Player selects front action (Negotiate, War, etc.)
3. Front status updates based on action
4. Player can view detailed front information

### Sector Navigation
1. Player clicks "Zoom Sector" to view their hexes on main map
2. Player clicks "View Full Map" to return to world view
3. Mini-map updates in real-time with sector changes

## Responsive Design

### Desktop (1200px+)
- Full panel layout visible
- Sector view on left
- Resources on right
- Actions at bottom left
- Front information at bottom right
- Maximum information density

### Tablet (768px - 1199px)
- Sector view moves to top
- Resources in grid layout
- Actions in horizontal scroll
- Front information in compact view
- Reduced padding and margins

### Mobile (<768px)
- Vertical stack layout
- Mini sector view
- Scrollable resources
- Grid actions
- Tabbed front information
- Touch-optimized controls
- Single column layout

## States

### Active Turn State
```
+-----------------------------------------------+
| Player: Active                          |
| Turn: 5 (Your Turn)                   |
|                                       |
| [End Turn] (Enabled)                   |
| [Skip Turn] (Enabled)                  |
+-----------------------------------------------+
```

### Waiting State
```
+-----------------------------------------------+
| Player: Waiting                          |
| Turn: 5 (Player 2's Turn)             |
|                                       |
| [End Turn] (Disabled)                  |
| [Skip Turn] (Disabled)                 |
|                                       |
| Waiting for other players...             |
+-----------------------------------------------+
```

### Resource Shortage State
```
+-----------------------------------------------+
| RESOURCES ALERT                        |
|                                       |
| [Warning Icon] Food: 0 (-3/turn)     |
|                                       |
| Your population will starve!            |
|                                       |
| [Trade for Food] [Request Aid]         |
+-----------------------------------------------+
```

### Contested Border State
```
+-----------------------------------------------+
| FRONT ALERT                            |
|                                       |
| vs Player 3: Contested                 |
|                                       |
| Border under pressure!                  |
| Enemy forces detected at 3 hexes.      |
|                                       |
| [Send Reinforcements] [Negotiate]       |
+-----------------------------------------------+
```

### Victory State
```
+-----------------------------------------------+
|  [Victory Icon]                        |
|                                       |
| VICTORY!                              |
|                                       |
| Your empire has conquered all!           |
|                                       |
| [View Statistics] [New Game]            |
+-----------------------------------------------+
```

## Color Blind Accessibility Examples

### Resource Icons with Color Blind Support

#### Standard Color Vision
```
RESOURCES (Standard)
+---------------------+
|  [Gold Coin] 150    |  (Yellow)
|  [Food] 80         |  (Green)
|  [Wood] 120         |  (Brown)
|  [Iron] 45         |  (Gray)
|  [Mana] 25         |  (Purple)
+---------------------+
```

#### Deuteranopia (Red-Green Color Blind)
```
RESOURCES (Deuteranopia Mode)
+---------------------+
|  [● Coin] 150     |  (Yellow - Circle)
|  [▢ Wheat] 80    |  (Green - Square)
|  [▶ Tree] 120    |  (Brown - Triangle)
|  [■ Ore] 45       |  (Gray - Square)
|  [◆ Crystal] 25   |  (Purple - Diamond)
+---------------------+
```

#### Protanopia (Red-Weak Color Blind)
```
RESOURCES (Protanopia Mode)
+---------------------+
|  [G] Gold: 150    |  (Letter G)
|  [F] Food: 80     |  (Letter F)
|  [W] Wood: 120    |  (Letter W)
|  [I] Iron: 45     |  (Letter I)
|  [M] Mana: 25     |  (Letter M)
+---------------------+
```

#### Tritanopia (Blue-Yellow Color Blind)
```
RESOURCES (Tritanopia Mode)
+---------------------+
|  [★] Gold: 150   |  (Star)
|  [▬] Food: 80    |  (Bar)
|  [▲] Wood: 120    |  (Triangle Up)
|  [▼] Iron: 45     |  (Triangle Down)
|  [⬡] Mana: 25    |  (Hexagon)
+---------------------+
```

### Front Status Indicators with Patterns

#### Standard View
```
FRONTS (Standard)
+---------------------+
|  vs Player 2        |
|  Status: Stable     |  (Green)
|  vs Player 3        |
|  Status: Contested  |  (Red)
|  vs Player 4        |
|  Status: Pressure   |  (Orange)
+---------------------+
```

#### Color Blind View with Patterns
```
FRONTS (Color Blind Mode)
+---------------------+
|  vs Player 2        |
|  Status: Stable     |  (Green + = = =)
|  vs Player 3        |
|  Status: Contested  |  (Red + / / /)
|  vs Player 4        |
|  Status: Pressure   |  (Orange + ~ ~ ~)
+---------------------+
```

### Player Turn Indicators

#### Standard View
```
TURN ORDER (Standard)
+---------------------+
|  [●] Player 1 (You)|  (Green - Active)
|  [○] Player 2       |  (Gray - Waiting)
|  [○] Player 3       |  (Gray - Waiting)
+---------------------+
```

#### Color Blind View
```
TURN ORDER (Color Blind Mode)
+---------------------+
|  [▶] Player 1 (You)|  (Arrow - Active)
|  [ ] Player 2       |  (Empty - Waiting)
|  [ ] Player 3       |  (Empty - Waiting)
+---------------------+
```

## Enhanced Resource Shortage States

### Critical Shortage State
```
+-----------------------------------------------+
|  [⚠️ CRITICAL WARNING]              |
|                                       |
|  RESOURCE CRISIS!                    |
|                                       |
|  [Food] 0 (-5/turn) [🔴 CRITICAL] |
|  [Gold] 5 (-3/turn) [🟡 LOW]     |
|                                       |
|  Your population will starve next turn!  |
|  2 settlements will be abandoned.        |
|                                       |
|  [Trade for Food]  [Request Aid]      |
|  [Scavenge]  [Abandon Settlement]     |
+-----------------------------------------------+
```

### Multiple Resource Shortage State
```
+-----------------------------------------------+
|  [⚠️ MULTIPLE SHORTAGES]           |
|                                       |
|  Resources Running Low                 |
|                                       |
|  [Food] 10 (-3/turn) [🟡 LOW]    |
|  [Gold] 15 (-2/turn) [🟡 LOW]    |
|  [Wood] 5 (-1/turn) [🔴 CRITICAL] |
|  [Iron] 20 (-2/turn) [🟡 LOW]    |
|                                       |
|  Prioritize actions to avoid collapse!    |
|                                       |
|  [Trade Resources]  [View Details]     |
+-----------------------------------------------+
```

### Resource Recovery Options
```
+-----------------------------------------------+
|  RECOVERY OPTIONS                     |
|                                       |
|  Current Shortage: Food (-5/turn)     |
|                                       |
|  Available Actions:                  |
|                                       |
|  [Trade with Player 2]               |
|  - Offer: 50 Gold                    |
|  - Receive: 30 Food                  |
|                                       |
|  [Request Aid from Allies]            |
|  - Player 3: Willing to help         |
|  - Cost: Diplomatic favor            |
|                                       |
|  [Scavenge Ruins]                   |
|  - Risk: Medium                      |
|  - Potential: 10-20 Food             |
|                                       |
|  [Reduce Population]                 |
|  - Abandon 1 settlement              |
|  - Save: 3 Food/turn                |
|                                       |
|  [Cancel]                           |
+-----------------------------------------------+
```

### Resource Trend Visualization

#### Color Blind Mode with Icons
```
RESOURCE TRENDS (Color Blind Mode)
+---------------------+
|  Gold: 150 [▲ +5] |  (Up Arrow - Increasing)
|  Food: 80 [▼ -3]  |  (Down Arrow - Decreasing)
|  Wood: 120 [→ 0]  |  (Right Arrow - Stable)
|  Iron: 45 [▲ +2]  |  (Up Arrow - Increasing)
|  Mana: 25 [▼ -1]  |  (Down Arrow - Decreasing)
+---------------------+
```

## Accessibility

### Keyboard Navigation
- **Tab Order**: Header → Sector View → Resources → Actions → Fronts → Phase Indicator
- **Shortcuts**:
  - `E`: End Turn
  - `S`: Skip Turn
  - `T`: Trade
  - `D`: Diplomacy
  - `F`: Fortify
  - `1`-`9`: Quick access to resources
  - `Arrow Keys`: Navigate between fronts

### Screen Reader Support
- **ARIA Labels**:
  - Sector view: `role="img" aria-label="Player's sector map"`
  - Resources: `aria-label="Gold: 150, Income: +5 per turn"`
  - Actions: `aria-label="End Turn button"`
  - Fronts: `aria-label="Border with Player 2: 6 hexes, Stable"`
- **Semantic HTML**: Use `<section>`, `<article>`, `<aside>` appropriately
- **Live Regions**: Resource changes announced via `aria-live`

### Visual Accessibility
- **High Contrast Mode**: Toggle for improved visibility
- **Color Blind Support**: Use patterns/icons for resource types
- **Focus Indicators**: Clear focus states for all interactive elements
- **Reduced Motion**: Option to disable animations
- **Large Text**: Option for increased font size

## References

- [INDEX.md](../INDEX.md:1) - Documentation index and cross-reference matrix
- [export-map/shared_hex_map_player_board_spec.md](../export-map/shared_hex_map_player_board_spec.md:1) - Map topology and sector design
- [app_layout_spec.md](../app_layout_spec.md:1) - Overall page structure
- [unified_map_renderer_spec.md](../unified_map_renderer_spec.md:1) - Map rendering component
- [backend/connection/webrtc.md](../backend/connection/webrtc.md:1) - Multiplayer synchronization
