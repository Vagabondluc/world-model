# Event Form Spec: Prosperity Development (4.3)

## Purpose
To define an economic or cultural specialization for the player's prime faction, updating its `Faction` card with the new industry details.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_31_prosperity-prompt.md`
- **Context**: Player's prime faction details (race, theme, settlements) and the chosen specialty.
- **Output**: A detailed description of how the faction integrates this new industry, covering unique methods, settlement impacts, and trade relations. This populates the `industryDescription` field on the `Faction` card.

## Form Fields

### 1. Industry Specialization
- **Chosen Specialty (from roll)**
  - **Label**: Industry or Profession (from 3d6 roll)
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Music, Alchemy or brew, Artistic Trinkets, Mining, Explorers, Seafarers, Fine Carpentry, Type of weaponry, Metal Industry, Type of Food, Fighting style, Beast Raising, Magic Training, Trade, Horsemanship, Metal Work.

### 2. Integration Details
- **Production Methods**
  - **Label**: How does your faction uniquely approach this industry?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Describe unique techniques, tools, or innovations.
- **Settlement Integration**
  - **Label**: How do your major settlements contribute?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Detail any sub-specialties or facilities in specific towns.
- **Cultural Integration**
  - **Label**: How does this industry fit your faction's identity?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Connect the specialty to your faction's established theme, race, and values.

### 3. Trade and Relations
- **Trade Applications**
  - **Label**: How does this create economic value?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Who are your main customers? What unique products or services do you offer?
- **Knowledge Management**
  - **Label**: How is expertise passed down?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: Describe training methods, apprenticeships, or institutions.
- **Master Practitioners**
  - **Label**: Name any leading experts or masters in this field
  - **Type**: Text
  - **Required**: No