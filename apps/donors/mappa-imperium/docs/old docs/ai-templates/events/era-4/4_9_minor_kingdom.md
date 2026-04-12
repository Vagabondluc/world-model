# Event Form Spec: Minor Kingdom (9)

## Purpose
To create a new `Faction` card for the discovered kingdom and two `Settlement` cards for its towns.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 9)
- **Context**: Player's faction details and all form inputs about the new kingdom.
- **Output**: A narrative describing the new kingdom, its people, and their initial disposition. This will inform the `description` fields for the new Faction and Settlement cards.

## Form Fields

### 1. Initial Contact
- **Contact Method**
  - **Label**: How was contact established?
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Your scouts encountered theirs, Traders brought news, Refugees sought shelter, They sent diplomats, Border skirmish occurred, Exploration team found them.
- **Messenger**
  - **Label**: Who brought the news to your faction?
  - **Type**: Text
  - **Required**: No

### 2. Kingdom Details
- **Kingdom's Race**
  - **Label**: Kingdom's primary race (from 2d6 roll)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Demonkind, Seafolk, Smallfolk, Reptilian, Dwarves, Humans, Elves, Greenskins, Animalfolk, Giantkind.
- **Kingdom Name and Ruler**
  - **Label**: Kingdom name and ruler
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Verdant Realm, ruled by Queen Silviana."
- **Settlements**
  - **Label**: Describe their two main settlements
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Briefly describe their capital and one other settlement.

### 3. Political Assessment
- **Strength**
  - **Label**: Military and economic strength
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Weak - Struggling, Developing - Growing, Established - Stable, Strong - Regional Power.
- **Culture**
  - **Label**: Cultural characteristics observed
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Highly artistic society," "Warrior culture emphasizing honor."
- **Initial Attitude**
  - **Label**: Their initial attitude toward your faction
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Hostile, Suspicious, Neutral, Curious, Friendly, Desperate.

### 4. Strategic Implications
- **Opportunities**
  - **Label**: Opportunities for cooperation
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "They have resources we need," "Strong military alliance potential."
- **Concerns**
  - **Label**: Potential conflicts or concerns
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Competing claims over border territory."
- **Next Steps**
  - **Label**: Your faction's planned next steps
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Send formal diplomatic mission," "Establish trade relations."