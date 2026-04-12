# Event Form Spec: Hostile Attack (7)

## Purpose
To process an attack by a hostile force, resulting in the destruction of a settlement (updating its status to "destroyed") or its capture (changing its ownership). This creates an `Event` card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/Z_battle-chronicle-prompt.md` (adapted for a simple outcome)
- **Context**: Details of the attacking force, the targeted settlement, and the outcome.
- **Output**: A chronicle of the attack, its progression, and its consequences for the region.

## Form Fields

### 1. The Attack
- **Attacking Faction**
  - **Label**: Which hostile force is attacking?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all non-allied factions)
- **Target Settlement**
  - **Label**: Which of your settlements was attacked?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with player's settlements, especially forts)
- **Attack Details**
  - **Label**: Describe the attack
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Detail the enemy force composition, battle progression, and key moments.

### 2. The Outcome
- **Result of the Attack**
  - **Label**: What was the result?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Settlement Destroyed (becomes a ruin), Settlement Captured (ownership transfers).
- **Territorial Changes**
  - **Label**: Describe any territorial changes
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Did the enemy establish a new border?

### 3. Aftermath
- **Refugee Movements**
  - **Label**: Were there significant refugee movements?
  - **Type**: Textarea
  - **Required**: No
- **Strategic Adaptations**
  - **Label**: How is your empire adapting its strategy?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Reinforcing the new border," "Planning a counter-attack."