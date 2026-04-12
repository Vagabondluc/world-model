# Event Form Spec: Roaming Herds (17)

## Purpose
To create a new `Resource` card representing a unique type of creature and its potential uses.

## AI Integration
- **Primary Prompt**: `docs/ai-templates/4_1_discovery-prompts.md` (Event 17)
- **Context**: Player faction, regional geography, and all form inputs.
- **Output**: A narrative describing the new creatures, their behavior, and their potential as a resource. This populates the `description` and `properties` of the new `Resource` card.

## Form Fields

### 1. Initial Sighting
- **Spotter**
  - **Label**: Who first spotted the creatures?
  - **Type**: Text
  - **Required**: No
- **Circumstances**
  - **Label**: Circumstances of first sighting
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Following unusual tracks," "Investigating livestock disturbances."
- **Location**
  - **Label**: Where were they first observed?
  - **Type**: Text
  - **Required**: Yes

### 2. Creature Description
- **Base Creature**
  - **Label**: Base creature type
  - **Type**: Dropdown
  - **Required**: Yes
  - **Options**: Large Deer/Elk, Giant Cattle/Bison, Wild Horses/Unicorns, Giant Boars, Massive Bears, Giant Birds, Large Reptiles, Hybrid Creatures, Magical Beasts.
- **Distinctive Features**
  - **Label**: Distinctive features
  - **Type**: Textarea
  - **Required**: Yes
  - **Help Text**: e.g., "Iridescent scales," "Antlers that spark with electricity."
- **Behavior Patterns**
  - **Label**: Observed behavior patterns
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Move in perfect formation," "Show surprising intelligence."
- **Herd Size**
  - **Label**: Herd size and composition
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Small Group (10-25), Medium Herd (26-75), Large Herd (76-200), Massive Migration (200+).

### 3. Potential Resources
- **Resources Provided**
  - **Label**: What resources might they provide?
  - **Type**: Checkboxes
  - **Required**: Yes
  - **Options**: High-Quality Meat, Durable Hide/Leather, Magical Components, Transportation/Mounts, Rare Materials (horn, bone, etc.), Milk/Dairy Products.
- **Utilization Challenges**
  - **Label**: Challenges for utilization
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Extremely fast and hard to catch."

### 4. Impact Assessment
- **Territorial Impact**
  - **Label**: Impact on local territory
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Compete with livestock for grazing."
- **Economic Potential**
  - **Label**: Economic potential
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Could revolutionize transportation."
- **Management Plan**
  - **Label**: Your faction's management approach
  - **Type**: Textarea
  - **Required**: No
  - **Help Text**: e.g., "Attempt domestication," "Establish hunting regulations."