# Event Form Spec: Hero Arrives (6)

## Purpose
To create a new `Character` card for the hero and a `Monument` card in their honor.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/5_1_empire-events-prompts.md` (Event 6)
- **Context**: Details about the hero, their great deed, and the monument.
- **Output**: A narrative recording the hero's arrival, their impact, and the cultural changes they inspired. This can serve as an `Event` card and inform the descriptions of the `Character` and `Monument`.

## Form Fields

### 1. The Hero
- **Hero's Name**
  - **Label**: Hero's Name and Origin
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "Gideon, the Dragonslayer from the Western Wastes."
- **Notable Abilities**
  - **Label**: What are their notable abilities or skills?
  - **Type**: Textarea
  - **Required**: No
- **Initial Great Deed**
  - **Label**: What was their initial great deed?
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: Describe the act that made them a hero in your empire.

### 2. The Monument
- **Monument Type**
  - **Label**: What kind of monument is raised?
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Statue, Triumphal Arch, Memorial Fountain, Obelisk, Great Hall, Named Geography (e.g., a forest or mountain).
- **Monument Name**
  - **Label**: Name of the Monument/Location
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "The Statue of Gideon," "Dragonsfall Bridge."
- **Location Significance**
  - **Label**: Where is it located and why?
  - **Type**: Text
  - **Required**: Yes
  - **Help Text**: e.g., "In the capital's main square," "At the site of their great deed."

### 3. Cultural Impact
- **Effect on Populace**
  - **Label**: How did the hero's arrival affect the populace?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Inspired a new generation of warriors," "Brought hope during a dark time."
- **New Traditions**
  - **Label**: What new traditions or festivals were created?
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "An annual feast to celebrate their victory."