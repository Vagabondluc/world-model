# Era Content Creation Specification

## Overview

This specification defines the complete workflow for content creation across all six eras of Mappa Imperium. Each era follows a structured progression from dice input through AI generation to element card creation, ensuring consistent worldbuilding while maintaining the original game's mechanical integrity.

## Universal Era Workflow Pattern

### Phase 1: Setup and Context

1. **Era Prerequisites Check**: Verify previous era completion
2. **Player Status Verification**: Confirm all required players online
3. **World State Loading**: Load current element cards and relationships
4. **Dice Rolling Interface**: Present era-appropriate dice inputs
   
### Phase 2: Content Generation
5. **Dice Result Processing**: Validate rolls and determine outcomes
6. **AI Template Activation**: Trigger appropriate AI guidance based on results
7. **Content Review and Editing**: Player review with modification options
8. **Specify Event Year (Eras IV-VI)**: Player specifies the exact year of the event within the current turn's duration.
9. **Element Card Creation**: Auto-generate cards from finalized content, including the `createdYear` timestamp.
   
### Phase 3: Integration and Validation
10. **Relationship Detection**: Identify connections to existing cards
11. **Cross-Player Coordination**: Handle events affecting multiple players
12. **Validation and Consistency**: Check for conflicts and logical issues
13. **Era Progress Tracking**: Update completion status and unlock progression
    
## Era I: Age of Creation
    
### Input Requirements
    
**Player Actions**:
- **Landmass Roll**: 1d6 for island configuration
- **Geography Placement**: 8 rounds of 2d6 geography rolls
- **Resource Selection**: 2 custom resources per region
  **Multi-Player Coordination**:
- **Pangea Option**: Collaborative decision on continent connection
- **Border Negotiations**: Adjacent geography agreement
- **Resource Distribution**: Avoid over-concentration
  
### AI Generation Triggers
  
**Geography Advisor System**:
  
```markdown
Trigger: Each 2d6 geography roll
Template: Built-in ecological guidance
Output: Placement recommendations with reasoning
Example:
Roll: 8 (Mountains)
AI Output: "Mountains work best inland, creating watersheds for rivers. 
Avoid placing directly adjacent to deserts unless creating a rain shadow effect. 
Consider strategic defensive positions for future settlements."
```
  
**Fantasy Resource Generator**:
```markdown
Trigger: Resource placement phase
Template: 1_4_fantasy-resources-prompt.md
Input: Region type, existing geography
Output: 2 unique fantasy resources with complete descriptions
Auto-Card Creation:
- 🗺️ Location Cards: For each geography feature
- ⛏️ Resource Cards: For each fantasy resource
```
  
### Element Card Generation
  
**Automatic Card Creation**:
- **Location Cards**: Every geography roll creates a named location
  - Rivers: "Mistflow River", "Goldenbeach Estuary"
  - Mountains: "Ironspine Peaks", "Whispering Heights"
  - Forests: "Thornwall Woods", "Silverleaf Grove"
- **Resource Cards**: Each custom resource becomes detailed card
  - Name, symbol, properties, extraction methods
  - Story potential and future implications
  - Geographic integration notes
    **Card Properties Applied**:
    
```json
{
"era_created": 1,
"status": "active",
"priority": "medium",
"ai_generated": true/false,
"type_properties": {
"geographic_type": "mountain|river|forest|etc",
"climate_zone": "temperate|arctic|tropical|etc",
"accessibility": "easy|moderate|difficult|extreme",
"strategic_value": "low|medium|high|critical"
}
}
```
    
### Cross-Player Elements
- **Continental Connections**: Shared landmasses require multi-player collaboration
- **Border Geography**: Adjacent features need coordination
- **Resource Conflicts**: Prevent resource type clustering
  
## Era II: Age of Myth
  
### Input Requirements
  
**Player Actions**:
- **Deity Count Roll**: 1d6 for number of deities (1-4)
- **Domain Assignment**: 1d6 per deity for divine domains
- **Symbol Assignment**: 1d6 per deity for divine symbols
- **Sacred Site Placement**: 2d6 per deity for site types
  **Cultural Context Integration**:
- Consider regional geography from Era I
- Plan for Era III faction integration
- Establish naming conventions early
  
### AI Generation Triggers
  
**Comprehensive Deity Creation**:
```markdown
Trigger: All deity parameters collected
Template: 2_1_god-prompt-template.md
Input: Domain, symbol, regional context, other deities
Output: Complete deity profile with sacred site and three historical events
Processing Flow:
1. Generate deity personality and motivations
2. Create sacred site with specific location
3. Generate three pivotal historical moments
4. Establish relationships with other deities
5. Create cultural integration suggestions
```
   
### Element Card Generation
   
**Deity Cards Created**:
- **Core Identity**: Name, domain, symbol, motivations
- **Divine Nature**: Manifestation, relationships, powers
- **Sacred Site Integration**: Links to location cards
- **Historical Events**: Links to event cards for three moments
**Location Cards Enhanced**:
- **Sacred Sites**: Special location cards with divine properties
- **Geographic Integration**: Connection to Era I locations
- **Future Potential**: Settlement and conflict possibilities
**Event Cards Created**:
- **Divine History**: Three events per deity showing cause-and-effect
- **Cross-Deity Events**: Interactions between pantheon members
- **Mortal Impact**: How divine actions affected the physical world
  
### Multi-Player Coordination
- **Pantheon Integration**: Deities can be shared across regions
- **Sacred Site Boundaries**: Sites near borders require negotiation
- **Cultural Exchange**: Influence on neighboring deity systems
  
## Era III: Age of Foundation
  
### Input Requirements
  
**Player Actions**:
- **Race Roll**: 2d6 for prime faction ancestry
- **Symbol & Color**: Dice rolls for faction identity
- **Settlement Rolls**: 2 rolls for early settlements
- **Neighbor Roll**: 1d6 for neighbor type placement
  **Faction Development Choices**:
- Theme selection from AI-generated options
- Leadership structure decisions
- Settlement naming and placement
- Neighbor relationship establishment
  
### AI Generation Triggers
  
**Comprehensive Faction Development**:
```markdown
Trigger: Race, symbol, color determined
Template: 3_1_faction-prompt-revised.md
Input: Basic faction parameters, regional context, existing elements
Output: Three themed development options with complete cultural details
Selection Process:
1. Present three distinct faction themes
2. Player selects preferred theme
3. Generate leadership options
4. Create settlement naming schemes
5. Develop neighbor relationship scenarios
```
**Hero-Location Creation**:
```markdown
Trigger: Settlement placement with hero potential
Template: 3_2_hero-location-prompt.md
Input: Profession roll, geography, faction theme
Output: Named hero and legendary location with full backstory
Integration:
- Hero becomes character card
- Location becomes enhanced location card
- Both cards link to faction card
```
**Settlement Development**:
```markdown
Trigger: Each settlement roll
Template: 4_23_settlement-prompt.md
Input: Settlement purpose, faction details, location
Output: Detailed settlement with cultural integration
Customization:
- Architecture reflecting faction theme
- Resource integration from Era I
- Defensive considerations
- Trade route potential
```
  
### Element Card Generation
  
**Faction Cards (Prime)**:
- **Complete Identity**: Theme, leadership, culture, specializations
- **Territory Definition**: Links to all owned settlements and locations
- **Relationship Network**: Connections to neighbor factions
- **Economic Focus**: Resource management and trade specializations
**Settlement Cards**:
- **Functional Details**: Purpose, population, defenses
- **Cultural Integration**: Architecture, customs, notable features
- **Strategic Position**: Trade routes, resource access, defensive value
- **Growth Potential**: Expansion possibilities and limitations
**Character Cards**:
- **Faction Leaders**: Primary leadership with personality and goals
- **Heroes**: Notable figures with achievements and legend status
- **Key Figures**: Settlement leaders and important individuals
**Neighbor Faction Cards**:
- **Basic Framework**: Simple faction cards for future development
- **Relationship Baseline**: Initial diplomatic standing
- **Development Potential**: Suggestions for future evolution
  
### Cross-Player Elements
- **Border Settlements**: Settlements near other players require coordination
- **Trade Routes**: Connections between player territories
- **Shared Neighbors**: Factions that span multiple regions
  
## Era IV: Age of Discovery
  
### Input Requirements
  
**Player Actions**:
- **Discovery Rolls**: 6 rounds of 3d6 discovery events
- **Colonization Events**: Triggered by specific rolls
- **Professional Development**: 3 rolls for notable figures
- **Prosperity Selection**: Industry specialization choice
  **World State Awareness**:
- All results can be placed anywhere on map
- Must consider existing faction relationships
- Integration with established world elements
  
### AI Generation Triggers
  
**Discovery Event Processing**:
```markdown
Trigger: Each 3d6 discovery roll
Template: 4_1_discovery-prompts.md
Input: Roll result, faction context, world state, recent history
Output: Detailed event narrative with specific consequences
Event Types Handled:
- Magical discoveries (3): Relics, phenomena, power sources
- Geographic finds (5): New islands, landmarks, routes
- Political events (8-10): Expansion, wars, diplomatic changes
- Resource discoveries (15): New materials, trade opportunities
- Cultural developments (16-18): Landmarks, creatures, legends
```
**Fantastic Landmark Creation**:
```markdown
Trigger: Landmark discovery events (16)
Template: 4_2_landmark-prompt.md
Input: Nearby tribe, geographic region, faction traits
Output: Four distinctive landmarks with tribal integration
Features Generated:
- Physical descriptions with scale and impact
- Tribal cultural integration
- Current phenomena and dangers
- Story hooks for future development
```
**Professional Figure Development**:
```markdown
Trigger: Hero/Professional rolls
Template: 3_2_hero-location-prompt.md (adapted)
Input: Profession, achievement, faction context
Output: Named figure with specific accomplishments and influence
Integration Points:
- Links to relevant settlements and events
- Influence on faction development
- Geographic naming opportunities
```
**Prosperity Specialization**:
```markdown
Trigger: Industry selection
Template: 4_31_prosperity-prompt.md
Input: Faction details, chosen specialty, settlement network
Output: Complete industry integration with cultural adaptation
Development Areas:
- Production methods and innovations
- Settlement specializations
- Trade relationships and markets
- Knowledge management systems
```
  
### Element Card Generation
  
**Event Cards (Discovery Era)**:
- **Exploration Events**: Discoveries with immediate and long-term impacts
- **Cultural Moments**: Significant developments in faction identity
- **Political Changes**: Diplomatic shifts and territorial modifications
- **Economic Developments**: Trade, resource, and prosperity changes
**Location Cards (New Discoveries)**:
- **New Islands**: Complete geographic descriptions with resources
- **Fantastic Landmarks**: Four unique features per generation with tribal connections
- **Ancient Ruins**: Mysterious sites with archaeological potential
- **Strategic Locations**: Defensive positions and trade route control points
**Character Cards (Professionals)**:
- **Explorers**: Named figures with discovery achievements
- **Specialists**: Industry leaders and innovation drivers
- **Cultural Figures**: Artists, scholars, and tradition keepers
- **Military Leaders**: Commanders and tactical innovators
**Resource Cards (New Discoveries)**:
- **Exotic Materials**: Unique substances with special properties
- **Strategic Resources**: Materials affecting military or economic power
- **Magical Components**: Supernatural substances for arcane applications
- **Trade Goods**: High-value items for inter-faction commerce
  
### Cross-Player Elements
- **Colonization Events**: New settlements in other players' regions
- **Trade Route Establishment**: Cross-regional economic connections
- **Diplomatic Developments**: Relationship changes affecting multiple players
- **Shared Discoveries**: Resources or locations accessible to multiple factions
  
## Era V: Age of Empires
  
### Input Requirements
  
**Player Actions**:
- **Empire Events**: 6 rounds of 3d6 empire development rolls
- **Neighbor Development**: Mandatory development for all neighbor factions
- **Global Placement**: All results can be placed anywhere on map
- **War Coordination**: Multi-player conflict resolution
  **Strategic Considerations**:
- Empire-level thinking and grand strategy
- Cross-regional influence and expansion
- Complex diplomatic relationships
- Resource management at scale
  
### AI Generation Triggers
  
**Empire Event Chronicles**:
```markdown
Trigger: Each 3d6 empire roll
Template: 5_1_empire-events-prompts.md
Input: Event type, empire state, world context, power relationships
Output: Detailed chronicle with specific consequences and named figures
Event Categories:
- Political Upheaval (3-4): Succession, rebellion, revolution
- Religious Development (5-6): Shrines, divine intervention
- Military Events (7-8): Attacks, wars, territorial changes
- Economic Growth (9-13): Expansion, trade, prosperity, construction
- Social Change (14-18): Disasters, academies, feeding programs, revolutions
```
**Minor Faction Evolution**:
```markdown
Trigger: Neighbor development phase
Template: 5_2_minor-faction-narrative-prompt.md
Input: Faction type, current state, recent events, regional context
Output: Rich development narrative showing faction growth and change
Development Focus:
- Origins and defining moments
- Power structure evolution
- Environmental impact and territorial changes
- Relationship dynamics with major factions
```
**War Event Processing**:
```markdown
Trigger: War! events (table result 8)
Template: Z_battle-chronicle-prompt.md
Input: Participants, objectives, current relationships, strategic context
Output: Complete battle narrative with commanders, tactics, and consequences
Multi-Player Coordination:
- Notification to all affected players
- Collaborative input for battle details
- Shared responsibility for outcome acceptance
- Territory and relationship updates
```
  
### Element Card Generation
  
**Event Cards (Empire Era)**:
- **Political Transformations**: Succession crises, governmental changes
- **Military Campaigns**: Wars, conquests, defensive actions
- **Economic Developments**: Trade expansion, prosperity booms, resource discoveries
- **Cultural Achievements**: Academic foundations, artistic movements, technological advances
- **Social Upheavals**: Disasters, migrations, revolutionary movements
**War Cards (Major Conflicts)**:
- **Battle Chronicles**: Complete military engagements with participants
- **Campaign Records**: Extended conflicts with multiple engagements
- **Siege Events**: Prolonged settlement attacks and defenses
- **Naval Conflicts**: Maritime battles and coastal raids
**Character Cards (Empire Figures)**:
- **Military Commanders**: Named leaders with tactical innovations
- **Political Leaders**: Revolutionary figures, diplomats, reformers
- **Cultural Icons**: Academy founders, artistic innovators, religious leaders
- **Economic Leaders**: Trade magnates, resource developers, infrastructure builders
**Settlement Cards (Empire Expansion)**:
- **Colonial Outposts**: Distant territorial claims and frontier settlements
- **Military Fortifications**: Strategic defensive positions and garrison towns
- **Economic Centers**: Trade hubs, manufacturing centers, resource processing facilities
- **Cultural Institutions**: Academies, temples, artistic centers
  
### Cross-Player Elements
- **Empire Wars**: Multi-faction conflicts requiring complex coordination
- **Trade Networks**: Economic systems spanning multiple player regions
- **Diplomatic Alliances**: Political relationships affecting regional balance
- **Cultural Exchange**: Academic and religious influence across borders
  
## Era VI: Age of Collapse
  
### Input Requirements
  
**Player Actions**:
- **Collapse Events**: 5 rounds of 3d6 transformation events
- **Iconic Landmarks**: Player-designated significant locations
- **World Omen**: Single collaborative roll determining world's future
- **Legacy Documentation**: Final historical record compilation
  **Transformation Focus**:
- Empire decline and adaptation
- Environmental and supernatural upheavals
- Cultural preservation and evolution
- Legacy establishment for future ages
  
### AI Generation Triggers
  
**Collapse Event Narratives**:
```markdown
Trigger: Each 3d6 collapse roll
Template: 6_1_collapse-prompt.md
Input: Event type, empire state, vulnerabilities, remaining strengths
Output: Transformation narrative showing adaptation rather than simple decline
Event Categories:
- Supernatural Upheaval (3-4, 17): Magic, monsters, cosmic events
- Political Transformation (5, 15-16): Royal changes, rebellions, diplomatic shifts
- Environmental Catastrophe (12-13, 18): Natural disasters, resource depletion
- Social Upheaval (6-7, 14): Migration, cultural change, new institutions
- Military Conflicts (8-10): Wars, raids, territorial changes
```
**Iconic Landmark Development**:
```markdown
Trigger: Player landmark selection
Template: 6_2_final-era-prompt.md
Input: Chosen location, historical significance, current state
Output: Complete landmark documentation with historical importance
Documentation Focus:
- Historical significance and key events
- Physical description and current condition
- Cultural impact and ongoing importance
- Future potential and legendary status
```
**World Omen Processing**:
```markdown
Trigger: Collaborative omen roll
Template: 6_2_final-era-prompt.md (omen section)
Input: 2d6 omen result, world state, collective empire stories
Output: World-changing omen with deep meaning and future implications
Omen Integration:
- Connects to established world themes
- Reflects collective player narrative
- Sets stage for potential future campaigns
- Provides satisfying conclusion to current age
```
  
### Element Card Generation
  
**Event Cards (Transformation Era)**:
- **Collapse Events**: Empire transformations with adaptive responses
- **Environmental Changes**: Geographic and climate alterations
- **Cultural Shifts**: Social and religious transformations
- **Final Conflicts**: Last wars and territorial adjustments
**Location Cards (Iconic Status)**:
- **Legendary Landmarks**: Player-chosen sites with enhanced historical documentation
- **Transformed Locations**: Places fundamentally changed by collapse events
- **Memorial Sites**: Locations commemorating fallen empires and heroes
- **Sacred Grounds**: Places of spiritual or cultural significance
**Monument Cards (Legacy Markers)**:
- **Memorial Constructions**: Monuments to fallen heroes and lost causes
- **Cultural Preservations**: Attempts to maintain civilization and knowledge
- **Warning Markers**: Testaments to disasters and failed experiments
- **Hope Symbols**: Constructions representing resilience and future potential
**Character Cards (Final Era)**:
- **Transformation Leaders**: Figures guiding empires through change
- **Cultural Preservers**: Individuals maintaining knowledge and traditions
- **Revolutionary Figures**: Leaders of final political and social changes
- **Legendary Heroes**: Characters achieving mythical status in empire's twilight
  
### Cross-Player Elements
- **World Omen Impact**: Single event affecting all players equally
- **Collaborative Landmarks**: Sites significant to multiple empires
- **Final Conflicts**: Last wars requiring multi-player coordination
- **Legacy Coordination**: Shared historical documentation
  
## Cross-Era Integration Systems
  
### Continuity Tracking
  
**Character Persistence**:
- Characters created in earlier eras referenced in later events
- Leadership succession and family lineages
- Hero legend development across multiple eras
- Death and memorial tracking
**Location Evolution**:
- Geographic features accumulating history
- Settlement growth and transformation
- Strategic importance changes over time
- Environmental modifications and adaptations
**Faction Development**:
- Cultural theme consistency across eras
- Political evolution and relationship changes
- Economic specialization development
- Territory expansion and contraction
**Event Causality**:
- Earlier events influencing later possibilities
- Consequence chains spanning multiple eras
- Cultural memory and tradition development
- Historical pattern recognition and repetition
  
### Relationship Network Evolution
  
**Automatic Relationship Updates**:
- New cards automatically link to related existing cards
- Relationship strength changes based on events
- Causal chains established through event sequences
- Geographic relationships updated with territorial changes
**Player Coordination Points**:
- Cross-border events requiring approval
- Shared resource management decisions
- Diplomatic relationship changes
- Trade route establishment and modification
  
### Quality Assurance
  
**Consistency Validation**:
- Name uniqueness checking across all cards
- Timeline logical consistency verification
- Geographic coherence validation
- Cultural theme maintenance
**Content Quality Standards**:
- All AI-generated content includes specific, granular details
- Original names for all people, places, and organizations
- Clear cause-and-effect relationships in all events
- Cultural integration with established faction themes
- Future story potential in all generated elements
  This comprehensive era progression system ensures that each phase of Mappa Imperium builds logically upon previous developments while maintaining the collaborative spirit and mechanical integrity of the original tabletop game.