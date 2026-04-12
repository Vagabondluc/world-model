> **_Note: This document describes the aspirational, long-term vision for Mappa Imperium. It outlines a target architecture that includes a full backend and real-time collaboration. The application's current, simpler implementation is detailed in the `/docs/current` directory._**

# Mappa Imperium - Updated Integration Specification with AI Templates

## Template-Based AI Integration System

### Core Architecture Changes

**Template Management Engine**:

- Template storage system for all 17 AI instruction documents
- Dynamic input form generation based on template "Required Input" sections
- Response parsing engine for structured narrative outputs
- Cross-template relationship tracking for narrative continuity
- Quality validation based on template requirements
  
  ### Era Integration Workflows - REVISED
  
  #### Era I: Age of Creation
  
  **Step 1.4 Enhanced - Fantasy Resources**
- **Template Used**: `1_4_fantasy-resources-prompt.md`
- **Integration Point**: After basic geography placement
- **User Workflow**:
  1. Player provides region type and terrain features
  2. System generates template-based input form
  3. AI produces two distinctive features with full narratives
  4. Player reviews/customizes generated content
  5. Features integrated into world state with map symbols
- **Data Structure**: Enhanced to store fantasy elements, story potential, future implications
  
  #### Era II: Age of Myth - REVISED
  
  **Complete Deity System**
- **Template Used**: `2_1_god-prompt-template.md`
- **Integration Points**: 
- Number determination (unchanged)
  - Enhanced deity creation with full profiles
  - Three-event sacred site development
- **User Workflow**:
  1. Player inputs basic deity parameters (domain, symbol if rolled)
  2. AI generates complete deity profile with motivations, relationships
  3. Sacred site creation with three historical events
  4. Cross-deity relationship development
  5. Cultural consistency validation
- **Data Structure**: Expanded to include deity motivations, sacred site histories, relationship networks
  
  #### Era III: Age of Foundation - MAJOR REVISION
  
  **Faction Development Suite**
- **Primary Template**: `3_1_faction-prompt-revised.md`
- **Secondary Templates**: `3_2_hero-location-prompt.md`, `4_23_settlement-prompt.md`
- **Integration Workflow**:
  1. **Faction Creation**: Multi-option development (theme, leadership, relations, naming)
  2. **Hero Locations**: Significant site creation with hero backstories
  3. **Settlement Development**: Detailed settlement creation using cultural themes
  4. **Neighbor Relations**: Complex relationship development based on faction types
- **Data Structure**: Complete faction profiles with themes, leadership, cultural details
  
  #### Era IV: Age of Discovery - COMPLETE REVISION
  
  **Event-Driven Development**
- **Primary Template**: `4_1_discovery-prompts.md`
- **Secondary Templates**: `4_2_landmark-prompt.md`, `4_31_prosperity-prompt.md`
- **Integration System**:
  1. **Event Processing**: Each roll type has specific narrative requirements
  2. **Landmark Generation**: Four distinctive features per generation
  3. **Prosperity Development**: Industry specialization with settlement impact
  4. **Contextual Awareness**: All events consider faction state and world history
- **Data Structure**: Rich event chronicles with cause-effect chains, named characters
  
  #### Era V: Age of Empires - REVISED
  
  **Large-Scale Narrative Development**
- **Primary Template**: `5_1_empire-events-prompts.md`
- **Secondary Template**: `5_2_minor-faction-narrative-prompt.md`
- **Integration Features**:
  1. **Empire Events**: 18 specific event types with detailed chronicle requirements
  2. **Faction Evolution**: Rich narrative development for neighbor factions
  3. **Cross-Border Effects**: Events affecting multiple players require coordination
  4. **Legacy Tracking**: All events contribute to empire's historical narrative
- **Data Structure**: Complete empire chronicles with political, cultural, military developments
  
  #### Era VI: Age of Collapse - NEW SYSTEM
  
  **Transformation Narratives**
- **Primary Template**: `6_1_collapse-prompt.md`
- **Secondary Template**: `6_2_final-era-prompt.md`
- **Integration Focus**:
  1. **Collapse Events**: Transformation rather than simple decline
  2. **Iconic Landmarks**: Player-chosen significant locations with full histories
  3. **World Omens**: Omen system with greater meaning development
  4. **Legacy Documentation**: Complete historical records for future campaigns
- **Data Structure**: Transformation chronicles, landmark significance, omen interpretations
  
  ### War System Integration - NEW
  
  **Battle Chronicles**
- **Template Used**: `Z_battle-chronicle-prompt.md`
- **Integration Points**: Any era where War! events occur
- **Features**:
  1. Complete battle narratives with commanders, tactics, consequences
  2. Monument and hero creation based on outcomes
  3. Long-term political and cultural impacts
  4. Integration with faction chronicles
- **Data Structure**: Battle records with military, political, cultural consequences
  
  ### Cross-Template Continuity System
  
  **Narrative Memory Engine**:
- **Character Tracking**: Named individuals persist across eras
- **Location Evolution**: Sites develop through multiple events
- **Cultural Consistency**: Faction themes influence all generated content
- **Causality Chains**: Events reference and build upon previous developments
- **Relationship Dynamics**: Inter-faction relationships evolve based on shared history

**UUID-Based Element Referencing**:
- **Unique Identifier**: Every element card created in the Element Manager is assigned a permanent, unique universal identifier (UUID).
- **One-Click Copy**: The UUID is displayed on its element card and can be copied to the clipboard with a single click.
- **Context Injection**: When a user pastes an element's UUID into an input field for AI generation, the system automatically recognizes it. Before sending the request to the AI, the system replaces the UUID with a rich, contextual summary of the referenced element, including its name, type, and detailed description.
- **Enhanced Cohesion**: This mechanism allows players to seamlessly weave existing world elements into new AI-powered creations, ensuring a high degree of narrative continuity and internal consistency throughout the worldbuilding process.
  
  ### Quality Assurance Framework
  
  **Template Compliance Validation**:
- **Naming Requirements**: All names must be original, meaningful, culturally consistent
- **Detail Standards**: "Specific, granular details" requirement for all outputs
- **Causality Verification**: Clear cause-and-effect relationships in all developments
- **Cultural Integration**: All content must connect to established faction themes
- **Educational Value**: Explanations for worldbuilding principles included
  
  ### Export System Enhancement - REVISED
  
  **Template-Generated Content Integration**:
- **Rich Narratives**: Full chronicles, character backstories, location histories
- **Relationship Mapping**: Complex webs of cause-effect relationships
- **Cultural Documentation**: Complete faction profiles with themes, customs, industries
- **Historical Timeline**: Integrated chronicle of all template-generated events
- **Foundry Integration**: Enhanced HTML export with template-structured content
  
  ### Technical Implementation Requirements
  
  **Backend Systems**:
- Template versioning and management
- Structured input validation
- Response parsing and integration
- Cross-template reference tracking
- Quality validation algorithms
  **Frontend Components**:
- Dynamic form generation from templates
- Structured response display
- Cross-reference navigation
- Template selection interface
- Quality feedback system
  **Data Architecture**:
- Template-aware entity relationships
- Narrative continuity tracking
- Cultural consistency indexing
- Chronicle chronological ordering
- Export format optimization
  This revised specification transforms the AI guidance from simple suggestions to a comprehensive narrative generation system that maintains strict quality standards while enabling rich, interconnected worldbuilding.