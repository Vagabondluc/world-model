> **_Note: This document describes the aspirational, long-term vision for Mappa Imperium. It outlines a target architecture that includes a full backend and real-time collaboration. The application's current, simpler implementation is detailed in the `/docs/current` directory._**

# Cross-Player Event Coordination

## Overview

This specification defines the complete workflow for coordinating events that affect multiple players in Mappa Imperium. These events require careful management to ensure fair outcomes, maintain narrative continuity, and preserve collaborative relationships while respecting individual player agency.

## Event Categories Requiring Coordination

### Primary Cross-Player Events

**War and Military Conflicts**:

- Direct faction warfare and territorial disputes
- Settlement sieges and conquest attempts
- Naval conflicts and coastal raids
- Alliance-based multi-faction wars
  **Economic and Trade Events**:
- Trade route establishment and disruption
- Resource disputes and sharing agreements
- Economic expansion into foreign territories
- Market manipulation and trade wars
  **Diplomatic and Political Events**:
- Alliance formation and dissolution
- Diplomatic marriage and succession crises
- Cultural exchange and influence spread
- Neutral territory administration
  **Environmental and Supernatural Events**:
- Natural disasters affecting multiple regions
- Magical phenomena with wide-area effects
- Monster appearances threatening multiple territories
- Divine intervention affecting multiple faiths
  
  ## War Event Coordination System
  
  ### Pre-War Setup Phase
  
  **Conflict Declaration Process**:
1. **Intent Declaration**: Aggressor privately declares war intention to system
2. **Context Gathering**: System collects current relationship status and recent history
3. **Target Notification**: Defender receives formal war declaration with context
4. **Preparation Period**: 24-hour window for both parties to prepare details
5. **Neutral Party Alerts**: Other players notified of potential regional impact
   **Information Collection**:
   ```markdown
   Required from Aggressor:
- Target settlement or territory
- Stated war goals and objectives
- Available military forces and commanders
- Claimed casus belli and justification
- Expected duration and scope of conflict
  Required from Defender:
- Current defensive preparations and forces
- Available commanders and military assets
- Defensive strategy and fallback plans
- Potential allies and support requests
- Assessment of aggressor's capabilities
  ```
  
  ### Battle Coordination Workflow
  
  **Phase 1: Pre-Battle Intelligence**
- **Force Assessment**: Both sides provide military capability details
- **Geographic Analysis**: Battle location advantages and challenges
- **Weather and Timing**: Seasonal effects and strategic timing
- **Alliance Activation**: Determine which allies will participate
  **Phase 2: Battle Input Coordination**
  ```markdown
  Simultaneous Input Collection:
- Battle tactics and strategic approach
- Key commander names and specializations
- Special weapons or magical assets
- Morale factors and motivation levels
- Contingency plans and retreat conditions
  Coordination Requirements:
- Both players must submit inputs within time limit
- Host arbitration available for disputes
- AI generation waits for complete input set
- Extensions available by mutual agreement
  ```
  **Phase 3: Battle Resolution**
1. **AI Chronicle Generation**: Using Z_battle-chronicle-prompt.md with combined inputs
2. **Result Preview**: Both players review generated battle narrative
3. **Accuracy Verification**: Confirm details align with provided information
4. **Modification Requests**: Limited revisions for factual corrections
5. **Final Acceptance**: Both players confirm battle chronicle accuracy
   **Phase 4: Consequence Implementation**
- **Territory Changes**: Update settlement ownership and boundaries
- **Casualty Processing**: Remove or modify affected character cards
- **Monument Creation**: Generate memorial cards for significant outcomes
- **Relationship Updates**: Modify diplomatic status between factions
- **Ripple Effects**: Notify other players of regional stability changes
  
  ### Multi-Faction Warfare
  
  **Alliance War Coordination**:
  ```markdown
  Complex War Setup:
- Multiple aggressors vs. multiple defenders
- Chain reaction conflicts (A attacks B, triggering C vs. D)
- Intervention scenarios (neutral parties joining ongoing conflicts)
- Proxy wars (factions fighting through intermediaries)
  Coordination Process:
1. Map all participating factions and their relationships
2. Establish battle sequence and simultaneous engagement rules
3. Collect input from all primary participants
4. Generate interconnected battle narratives
5. Process all consequence changes simultaneously
   ```
   **Neutral Party Management**:
- **Impact Assessment**: Determine effects on non-participating factions
- **Intervention Opportunities**: Options for neutral parties to join conflicts
- **Trade Route Disruption**: Economic effects on neutral commerce
- **Refugee Management**: Population movement effects on neighbors
  
  ## Trade and Economic Coordination
  
  ### Trade Route Establishment
  
  **Bilateral Trade Route Creation**:
1. **Route Proposal**: Player A suggests trade connection to Player B
2. **Route Planning**: Collaborative path selection through territories
3. **Resource Assessment**: Determine traded goods and economic benefits
4. **Protection Agreement**: Establish security and maintenance responsibilities
5. **Implementation**: Create trade route element cards and economic modifiers
   **Multi-Party Trade Networks**:
   ```markdown
   Complex Trade Coordination:
- Three-way trade relationships with circular dependencies
- Trade hub settlements serving multiple partners
- Exclusive trade agreements affecting other players
- Trade embargo coordination among alliance members
  Network Management:
- Trade flow optimization across multiple routes
- Shared infrastructure investment and maintenance
- Trade dispute resolution mechanisms
- Economic intelligence and market information sharing
  ```
  
  ### Resource Conflict Resolution
  
  **Disputed Resource Claims**:
1. **Claim Registration**: Multiple players assert rights to same resource
2. **Evidence Presentation**: Historical and geographic justification
3. **Negotiation Period**: Direct player-to-player discussion window
4. **Arbitration Process**: Host-mediated resolution if negotiation fails
5. **Compensation Mechanisms**: Alternative arrangements for losing claimants
   **Shared Resource Management**:
- **Joint Extraction Operations**: Collaborative resource development
- **Usage Quotas**: Fair distribution of limited resource access
- **Investment Sharing**: Collaborative infrastructure development costs
- **Environmental Protection**: Shared responsibility for resource sustainability
  
  ## Diplomatic Event Coordination
  
  ### Alliance Formation and Management
  
  **Alliance Proposal Process**:
  ```markdown
  Formal Alliance Creation:
1. Initial proposal with terms and conditions
2. Negotiation period for terms refinement
3. Public announcement to all players
4. Ratification ceremony and formal documentation
5. Alliance charter creation with mutual obligations
   Alliance Types:
- Mutual Defense Pacts: Military support against aggression
- Trade Alliances: Economic cooperation and preferred status
- Cultural Exchanges: Academic, religious, and artistic cooperation
- Non-Aggression Pacts: Formal peace with territorial guarantees
  ```
  **Alliance Dissolution**:
- **Notice Period**: Required advance warning before alliance termination
- **Asset Division**: Fair distribution of shared investments and infrastructure
- **Relationship Reset**: Return to neutral diplomatic status
- **Third Party Notification**: Inform other players of changing alliances
  
  ### Cultural and Religious Coordination
  
  **Religious Expansion Management**:
  ```markdown
  Cross-Border Religious Activity:
- Missionary activity requiring destination player approval
- Sacred site pilgrimage across territorial boundaries
- Religious festival participation and shared celebrations
- Theological dispute resolution between different pantheons
  Coordination Process:
1. Religious expansion proposal with specific goals
2. Destination player consultation and approval
3. Cultural integration negotiation and terms
4. Implementation with shared religious element cards
5. Ongoing management of religious relationships
   ```
   **Cultural Influence Systems**:
- **Artistic Movements**: Cultural trends spreading between regions
- **Academic Cooperation**: Shared educational institutions and knowledge
- **Language Adoption**: Linguistic influence and trade language development
- **Traditional Exchange**: Custom and practice sharing between cultures
  
  ## Environmental and Supernatural Coordination
  
  ### Large-Scale Disaster Management
  
  **Multi-Regional Disasters**:
  ```markdown
  Natural Disaster Coordination:
- Earthquakes affecting border regions
- Volcanic eruptions with ash cloud effects
- Flooding affecting multiple river basin territories
- Plague outbreaks spreading through trade routes
  Coordination Requirements:
1. Simultaneous effect determination across regions
2. Collaborative response and aid coordination
3. Shared infrastructure damage assessment
4. Joint recovery and reconstruction efforts
5. Long-term relationship changes from crisis response
   ```
   **Magical Phenomena**:
- **Planar Rifts**: Dimensional instabilities affecting multiple territories
- **Divine Manifestations**: Religious events with regional significance
- **Magical Storms**: Arcane weather affecting multiple territories
- **Ancient Awakening**: Powerful entities emerging with wide-area influence
  
  ### Monster and Threat Management
  
  **Legendary Monster Coordination**:
  ```markdown
  Multi-Territory Threats:
- Dragons claiming territory across multiple regions
- Migratory monster hordes affecting multiple settlements
- Awakened ancient entities with regional influence
- Planar invasions requiring coordinated response
  Response Coordination:
1. Threat assessment and information sharing
2. Coordinated military response planning
3. Resource pooling for major threat elimination
4. Shared victory conditions and credit distribution
5. Post-threat territory and resource redistribution
   ```
   
   ## Real-Time Notification System
   
   ### Event Alert Framework
   
   **Priority Levels**:
- **Critical**: Immediate attention required (war declarations, disasters)
- **High**: Important coordination needed (alliance proposals, trade disruptions)
- **Medium**: Relevant information (neighboring developments, cultural events)
- **Low**: General awareness (distant events, minor cultural changes)
  **Notification Delivery Methods**:
- **Real-Time Alerts**: Immediate pop-up notifications for critical events
- **Activity Feed**: Chronological list of all relevant developments
- **Email Summaries**: Daily digest for offline players
- **In-Game Messages**: Persistent message center for detailed communications
  
  ### Automated Event Detection
  
  **Trigger-Based Notifications**:
  ```javascript
  Event Detection Rules:
- War Declaration: Immediate alert to defender and regional neighbors
- Trade Route Proposal: Notification to proposed partner and affected territories
- Alliance Formation: Announcement to all players with relationship implications
- Disaster Events: Alert all players within potential impact zones
- Resource Discovery: Notification to players with potential interest or conflicts
  ```
  **Smart Filtering System**:
- **Relevance Scoring**: Prioritize notifications based on player interests and proximity
- **Relationship Awareness**: Enhanced notifications for allied or hostile factions
- **Geographic Proximity**: Higher priority for events in neighboring territories
- **Historical Context**: Increased importance for events related to past interactions
  
  ## Coordination Interface Design
  
  ### Multi-Player Event Dashboard
  
  **Event Status Tracking**:
  ```markdown
  Dashboard Components:
- Active Cross-Player Events: Current coordination requirements
- Pending Approvals: Actions waiting for player input
- Recent Developments: Timeline of cross-player activities
- Relationship Status: Current diplomatic standings with all players
- Coordination Queue: Upcoming events requiring multi-player input
  Visual Indicators:
- Color-coded urgency levels for pending actions
- Progress bars for multi-stage coordination processes
- Relationship status icons for quick diplomatic reference
- Map overlay showing areas of cross-player activity
  ```
  **Coordination Workspace**:
- **Event Details Panel**: Complete information about current coordination
- **Player Communication**: Integrated chat for event-specific discussion
- **Document Sharing**: Ability to share maps, plans, and strategic information
- **Timeline Visualization**: Show coordination process stages and deadlines
- **Decision Recording**: Permanent record of agreements and decisions
  
  ### Input Collection Interface
  
  **Structured Input Forms**:
  ```markdown
  War Coordination Form:
- Military Force Composition: Troop types, numbers, equipment
- Commander Selection: Named leaders with special abilities
- Strategic Objectives: Primary and secondary goals
- Tactical Approach: Assault style, timing, special tactics
- Contingency Plans: Retreat conditions and alternative objectives
  Trade Coordination Form:
- Trade Goods: Specific resources and quantities
- Route Planning: Path selection with security considerations
- Terms and Conditions: Payment, delivery, quality standards
- Protection Arrangements: Security responsibility and cost sharing
- Duration and Renewal: Trade agreement timeline and terms
  ```
  **Collaborative Editing Tools**:
- **Shared Documents**: Real-time collaborative editing of agreements
- **Version Control**: Track changes and maintain approval history
- **Comment Threading**: Discussion and negotiation on specific clauses
- **Template Library**: Standard forms for common coordination types
- **Digital Signatures**: Formal approval and commitment mechanisms
  
  ## Timing and Deadline Management
  
  ### Coordination Timelines
  
  **Standard Coordination Periods**:
- **War Declaration Response**: 24 hours for defender preparation
- **Trade Route Negotiation**: 48 hours for route planning and approval
- **Alliance Proposal Review**: 72 hours for terms consideration
- **Disaster Response Coordination**: 12 hours for emergency response
- **Diplomatic Crisis Resolution**: 96 hours for complex negotiations
  **Flexible Timing Options**:
- **Mutual Extension**: Both parties can agree to extend deadlines
- **Emergency Acceleration**: Host can force immediate resolution for critical events
- **Offline Player Protection**: Extended deadlines for disconnected players
- **Time Zone Accommodation**: Scheduling coordination for global player bases
  
  ### Deadline Enforcement
  
  **Automatic Consequences**:
  ```markdown
  Missed Deadline Handling:
- War Response: Default defensive posture if no response provided
- Trade Negotiation: Default rejection if no counter-proposal submitted
- Alliance Vote: Abstention counted as neutral vote
- Disaster Response: Individual response without coordination benefits
  Grace Period Mechanisms:
- 2-hour grace period for technical difficulties
- Automatic 12-hour extension for first-time deadline miss
- Host discretion for extenuating circumstances
- Player reputation tracking for chronic lateness
  ```
  
  ## Dispute Resolution Framework
  
  ### Conflict Mediation Process
  
  **Dispute Categories**:
- **Factual Disputes**: Disagreement about game state or historical events
- **Interpretation Conflicts**: Different understanding of rules or agreements
- **Fairness Concerns**: Perceived imbalance or unfair advantage
- **Process Violations**: Failure to follow coordination procedures
- **Personal Conflicts**: Player relationship issues affecting gameplay
  **Resolution Mechanisms**:
1. **Direct Negotiation**: Player-to-player discussion with system mediation tools
2. **Peer Arbitration**: Other players vote on dispute resolution
3. **Host Arbitration**: Game host makes binding decision
4. **Rule Clarification**: Reference to official game rules and precedents
5. **Compromise Solutions**: Partial satisfaction for all parties
   
   ### Evidence and Documentation
   
   **Dispute Documentation Requirements**:
   ```markdown
   Evidence Collection:
- Chat logs and communication history
- Element card modification timestamps
- AI generation prompts and responses
- Previous agreement documentation
- Witness statements from other players
  Documentation Standards:
- Chronological event timeline construction
- Screenshots of relevant game state
- Export of affected element cards and relationships
- Communication thread preservation
- Decision rationale recording
  ```
  **Precedent System**:
- **Ruling Database**: Searchable repository of previous dispute resolutions
- **Consistency Standards**: Similar disputes receive similar resolutions
- **Rule Evolution**: Formal process for updating coordination procedures
- **Community Standards**: Player-community input on common dispute types
  
  ## Quality Assurance and Validation
  
  ### Coordination Outcome Validation
  
  **Automatic Validation Checks**:
  ```javascript
  Validation Rules:
- Relationship Consistency: Ensure diplomatic changes align with recent events
- Resource Conservation: Verify resource transfers don't exceed availability
- Geographic Logic: Confirm territorial changes respect geographic constraints
- Timeline Coherence: Validate event sequences maintain logical progression
- Character Availability: Ensure named figures aren't in multiple places simultaneously
  ```
  **Manual Review Process**:
- **Host Approval**: Final validation for complex or disputed coordinations
- **Peer Review**: Other players can flag inconsistencies or concerns
- **Continuity Check**: Verify coordination maintains narrative continuity
- **Balance Assessment**: Ensure coordination doesn't create unfair advantages
- **Rule Compliance**: Confirm all coordination follows established procedures
  
  ### Learning and Improvement
  
  **Coordination Analytics**:
- **Success Rate Tracking**: Monitor coordination completion rates
- **Time Analysis**: Identify optimal deadlines for different event types
- **Player Satisfaction**: Feedback collection on coordination experience
- **Dispute Frequency**: Track common sources of conflict and confusion
- **Process Efficiency**: Measure time from initiation to resolution
  **System Evolution**:
- **Procedure Refinement**: Regular updates to coordination processes
- **Interface Improvement**: User experience enhancements based on feedback
- **Automation Expansion**: Identify opportunities for automated coordination
- **Template Development**: Create standard forms for recurring coordination types
- **Best Practice Documentation**: Capture and share successful coordination strategies
  
  ## Integration with Element Card System
  
  ### Cross-Player Card Management
  
  **Shared Card Creation**:
  ```markdown
  Multi-Owner Cards:
- Trade Route Cards: Owned jointly by endpoint players
- Alliance Cards: Shared ownership among alliance members
- War Cards: Joint ownership between primary participants
- Treaty Cards: Shared among all signatory players
- Cultural Exchange Cards: Multi-ownership for participating cultures
  Shared Card Editing:
- Version control for multi-editor scenarios
- Change approval workflows for sensitive modifications
- Comment systems for negotiating card content
- History tracking with player attribution
- Conflict resolution for simultaneous edits
  ```
  **Relationship Network Updates**:
- **Automatic Relationship Creation**: Cross-player events automatically create card relationships
- **Relationship Strength Modification**: Events update relationship intensity and type
- **Cascade Effects**: Major events update multiple relationship networks
- **Historical Tracking**: Maintain complete history of relationship evolution
- **Future Implications**: Mark relationships with future story potential
  
  ### Export Integration
  
  **Multi-Player Chronicle Generation**:
- **Unified Timeline**: Chronological integration of all cross-player events
- **Perspective Documentation**: Multiple viewpoints on significant events
- **Diplomatic History**: Complete record of inter-faction relationships
- **Shared Achievement Recognition**: Credit all participants in major developments
- **Conflict Documentation**: Balanced reporting of disputes and resolutions
  **Collaborative Export Features**:
- **Joint World Exports**: Combined export including all player contributions
- **Selective Sharing**: Choose which elements to include in shared exports
- **Attribution Preservation**: Maintain creator credit for all contributed elements
- **Relationship Mapping**: Visual representation of inter-player connections
- **Legacy Documentation**: Record coordination successes and lessons learned
  This comprehensive cross-player event coordination system ensures that collaborative elements enhance rather than complicate the Mappa Imperium experience, while maintaining fairness, narrative consistency, and player agency throughout the worldbuilding process.