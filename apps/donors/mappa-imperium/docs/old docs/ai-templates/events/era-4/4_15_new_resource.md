# Event Form Spec: New Resource (15)

## Purpose
To guide the player through the discovery and definition of a new, valuable resource in their territory, generating a `Resource` element card.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 15)
- **Context**: Player's faction details, regional geography, existing resources, and form inputs.
- **Output**: A rich narrative describing the resource, its properties, and its impact, which populates the `description` field.

## Form Fields

### 1. Discovery Details
- **Discoverer Name**
  - **Label**: Who made the discovery?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Name the prospector, survey team, or individual who found this resource.
- **Discovery Circumstances**
  - **Label**: How was the resource discovered?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe the event that led to the discovery (e.g., landslide, following strange animals).
- **Location of Discovery**
  - **Label**: Location of discovery
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: Specify where this resource was found (e.g., Deep in the Thornspine Mountains).

### 2. Resource Characteristics
- **Resource Type**
  - **Label**: Type of resource
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Precious Metal, Gemstone Deposit, Rare Mineral, Magical Material, Energy Source, Construction Material, Rare Organic Material, Other.
- **Physical Description**
  - **Label**: Physical description and properties
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Describe its appearance, texture, and any unusual properties (e.g., "Crystalline formation that resonates when struck").
- **Quality and Abundance**
  - **Label**: Quality and abundance
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Limited - Small Deposit, Moderate - Steady Supply, Rich - Large Deposit, Exceptional - Massive Deposit.

### 3. Economic and Strategic Impact
- **Potential Applications**
  - **Label**: Potential applications and uses
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: What can this resource be used for? (e.g., Superior weapon crafting, magical rituals).
- **Extraction Challenges**
  - **Label**: Extraction challenges
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: What makes it difficult to acquire? (e.g., Located in dangerous territory).
- **Potential for Conflict**
  - **Label**: Potential for conflict
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Does a neighbor also claim this area? Does it upset the balance of power?
- **Development Plan**
  - **Label**: Your faction's development plan
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: How will your faction exploit this resource? (e.g., Establish a secure mining settlement).