# Event Form Spec: War! (8)

## Purpose
To initiate a conflict against another settlement, triggering a collaborative battle resolution process and generating a `War` element card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/Z_battle-chronicle-prompt.md`
- **Context**: All form inputs from both the attacker (player) and defender (other player or NPC faction), including faction details, military composition, and strategic objectives.
- **Output**: A detailed battle chronicle based on a 1d6 roll, which becomes the description for the new `War` card.

## Form Fields

### 1. War Declaration
- **Target Settlement**
  - **Label**: Select a settlement to attack
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: (Populated with all non-player-owned settlements on the map)
- **Target Owner**
  - **Label**: Target Owner
  - **Type**: Read-only Text
  - **Auto-filled**: Displays the owner of the selected settlement.
- **Casus Belli**
  - **Label**: Justification for War
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Why is your empire launching this attack? (e.g., "To reclaim ancestral lands," "To secure vital trade routes").

### 2. Attacker's Strategy (Your Faction)
- **Military Commander**
  - **Label**: Who is leading your army?
  - **Type**: Text
  - **Required**: Yes
- **Army Composition**
  - **Label**: Describe your attacking force
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Detail the types of troops, numbers, and any special units involved.
- **Battle Tactics**
  - **Label**: What is your battle plan?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "A frontal assault at dawn," "A siege to starve them out," "Infiltration by elite troops."
- **Strategic Objectives**
  - **Label**: What are your goals beyond conquest?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Capture their leader," "Seize their treasury," "Destroy their military academy."

### 3. Defender's Input (Cross-Player Coordination)
*This section would be sent to the defending player for them to fill out.*
- **Defending Commander**
  - **Label**: Who is leading the defense?
  - **Type**: Text
- **Defensive Forces**
  - **Label**: Describe your available forces
  - **Type**: Textarea
- **Defensive Strategy**
  - **Label**: How will you defend the settlement?
  - **Type**: Textarea

### 4. Battle Resolution
- **Roll for Outcome**
  - **Label**: Battle Outcome (1d6)
  - **Type**: Dice Roller (Button)
  - **Required**: Yes
  - **Help Text**: Roll to determine the outcome of the battle based on the War! table.
- **Battle Chronicle**
  - **Label**: Battle Chronicle
  - **Type**: Read-only Textarea (AI Generated)
  - **Auto-filled**: The AI-generated narrative of the battle will appear here.