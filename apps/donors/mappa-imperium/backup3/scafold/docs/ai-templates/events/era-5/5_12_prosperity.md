# Event Form Spec: Prosperity (12)

## Purpose
To document a period of significant growth and cultural flourishing, resulting in a new `Monument` card and potentially updating settlement descriptions.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 12)
- **Context**: The player's faction, the economic catalysts, and the chosen monument.
- **Output**: A narrative describing the boom period, its effects on society, and the legacy of the current ruler. This can create an `Event` card.

## Form Fields

### 1. The Economic Boom
- **Economic Catalysts**
  - **Label**: What caused this period of prosperity?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "A new trade route," "A major resource discovery," "A period of prolonged peace."
- **Growth Patterns**
  - **Label**: How is this prosperity manifesting?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Rapid growth in cities," "Flourishing of arts and sciences."
- **Social Changes**
  - **Label**: Describe the social changes
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Is a new merchant class rising? Are commoners' lives improving?

### 2. The Monument
- **Ruler to Honor**
  - **Label**: Name the leader being honored
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Name the current ruler under whom this prosperity is occurring.
- **Monument Type**
  - **Label**: What kind of monument or great work is constructed?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Grand Statue, Triumphal Arch, Public Gardens, Great Library, Arena/Colosseum, Aqueduct System, University.
- **Monument Name**
  - **Label**: Name of the Monument
  - **Type**: Text
  - **Required**: Yes
- **Named Geography**
  - **Label**: Name a nearby geography after the leader
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Aurelian Forest," "Mount Tiberius."

### 3. Lasting Legacy
- **Cultural Flourishing**
  - **Label**: What cultural achievements define this era?
  - **Type**: Textarea
  - **Required**: No
- **Wealth Distribution**
  - **Label**: How is the new wealth distributed?
  - **Type**: Textarea
  - **Required**: No