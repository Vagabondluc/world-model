> **_Note: This document describes the aspirational, long-term vision for Mappa Imperium. It outlines a target architecture that includes a full backend and real-time collaboration. The application's current, simpler implementation is detailed in the `/docs/current` directory._**

# Multi-Player Session Specification

## Overview

This specification defines the complete system for creating, managing, and coordinating multi-player Mappa Imperium sessions. The system supports 2-8 players working simultaneously on collaborative worldbuilding while maintaining individual creative control and ensuring seamless progression through all six eras.

## Session Architecture

### Game Creation and Setup

**Host Responsibilities**:

- Create game session with unique identifier
- Configure game settings (player count, era length, optional rules)
- Generate player invitation codes or passwords
- Assign regional territories to players
- Moderate disputes and manage progression
  **Player Joining Process**:
1. **Game Discovery**: Enter game ID or invitation link
2. **Player Authentication**: Choose player number (1-8) and set password
3. **Regional Assignment**: Automatic or host-assigned territory selection
4. **World State Synchronization**: Download current game state and element cards
5. **Ready Confirmation**: Signal readiness to begin collaborative worldbuilding
   
   ### Session Configuration Options
   
   **Player Count Settings**:
- **2-4 Players**: Recommended for detailed collaboration and longer sessions
- **5-6 Players**: Balanced complexity with manageable coordination
- **7-8 Players**: Maximum complexity requiring efficient communication
  **Game Length Variants**:
- **Short Game**: 3/4/3 turns per era (ERA IV/V/VI)
- **Standard Game**: 6/6/5 turns per era
- **Long Game**: 8/8/6 turns per era
- **Epic Game**: 11/12/10 turns per era
  **Optional Rules**:
- **Pangea Mode**: Shared continental landmass
- **Enhanced AI Guidance**: More detailed suggestions and validation
- **Accelerated Progression**: Automatic era advancement when all players complete
- **Chronicle Mode**: Enhanced historical documentation and export features
  
  ## Regional Territory System
  
  ### Territory Assignment
  
  **Automatic Assignment**:
- Equal division of world map based on player count
- Geographic balance consideration (similar landmass potential)
- Resource distribution fairness validation
- Strategic position balance assessment
  **Manual Assignment (Host Override)**:
- Custom regional boundaries for specific scenarios
- Unequal territory distribution for advanced gameplay
- Geographic feature concentration for thematic games
- Player preference accommodation when possible
  
  ### Boundary Management
  
  **Border Definitions**:
- Clear visual indicators of territorial boundaries
- Overlap zones for shared features and cross-border elements
- Buffer zones for diplomatic and trade interactions
- Disputed territory mechanisms for conflict resolution
  **Cross-Border Permissions**:
- **Own Territory**: Full creative control within boundaries
- **Border Elements**: Require adjacent player approval
- **Shared Features**: Collaborative editing with version control
- **Global Events**: Impact multiple territories with coordinated resolution
  
  ## Real-Time Collaboration Features
  
  ### WebSocket Communication System
  
  **Live Connection Management**:
- Persistent WebSocket connections for all active players
- Automatic reconnection handling for temporary disconnections
- Connection status indicators for all participants
- Graceful degradation for offline players
  **Event Broadcasting**:
- **Element Card Changes**: Real-time updates to all connected players
- **Era Progression**: Immediate notification of advancement and completion
- **Cross-Player Events**: Instant alerts for events affecting multiple territories
- **Chat and Communication**: Integrated messaging for coordination
  
  ### Simultaneous Editing Protection
  
  **Conflict Prevention**:
- **Edit Locking**: Temporary locks on cards being actively edited
- **Change Queueing**: Sequential processing of rapid modifications
- **Version Stamping**: Timestamp-based conflict detection
- **Auto-Save**: Frequent background saves preventing data loss
  **Conflict Resolution**:
- **Last-Writer-Wins**: Default resolution for simple text changes
- **Version Branching**: Create parallel versions for major conflicts
- **Player Arbitration**: Voting system for disputed shared elements
- **Host Override**: Final authority for unresolvable disputes
  
  ### Communication Systems
  
  **Integrated Chat Features**:
- **Global Chat**: All players communication channel
- **Private Messages**: Direct player-to-player communication
- **Element Comments**: Discussion threads attached to specific cards
- **Event Coordination**: Dedicated channels for cross-player events
  **Notification System**:
- **@Mentions**: Direct attention requests with player tagging
- **Event Alerts**: Automatic notifications for relevant developments
- **Status Updates**: Era completion and progression announcements
- **Approval Requests**: Notifications for cross-border element changes
  
  ## Era Progression Synchronization
  
  ### Individual Era Completion
  
  **Progress Tracking**:
- **Roll Completion**: Track dice rolls and required events per era
- **Content Quality**: Validate AI-generated content meets standards
- **Element Card Creation**: Ensure all required cards generated
- **Relationship Validation**: Verify logical connections established
  **Completion Indicators**:
- **Visual Progress Bars**: Show completion percentage for each player
- **Era Summary**: Display generated content and major developments
- **Quality Validation**: Confirm all content meets game standards
- **Ready Status**: Player confirmation of era completion
  
  ### Group Era Advancement
  
  **Synchronization Requirements**:
- **All Players Complete**: Default requirement for era advancement
- **Majority Complete**: Optional rule for faster progression
- **Host Override**: Emergency advancement for stalled sessions
- **Partial Completion**: Allow advancement with incomplete content flagged
  **Advancement Process**:
1. **Completion Verification**: Validate all players meet era requirements
2. **Final Review Period**: Brief window for last-minute adjustments
3. **Cross-Era Integration**: Process relationships and continuity elements
4. **Era Lock**: Prevent further modifications to completed era
5. **Next Era Unlock**: Enable access to subsequent era content
   
   ### Cross-Era Continuity Management
   
   **Element Persistence**:
- **Character Continuity**: Track named individuals across eras
- **Location Evolution**: Accumulate history for geographic features
- **Faction Development**: Maintain cultural themes and relationships
- **Event Causality**: Establish cause-effect chains between eras
  **Relationship Evolution**:
- **Dynamic Connections**: Update relationships based on new events
- **Influence Propagation**: Spread effects of major developments
- **Historical Memory**: Maintain references to significant past events
- **Future Implications**: Track story hooks and development potential
  
  ## Content Sharing and Permissions
  
  ### Ownership and Access Control
  
  **Primary Ownership**:
- **Creator Rights**: Full control over originally created elements
- **Territory Control**: Exclusive authority within assigned regions
- **Modification History**: Complete audit trail of all changes
- **Transfer Mechanisms**: Voluntary ownership transfer options
  **Shared Element Management**:
- **Cross-Border Features**: Elements affecting multiple territories
- **Trade Routes**: Economic connections requiring bilateral approval
- **Diplomatic Relationships**: Political connections with mutual impact
- **Cultural Exchange**: Religious, artistic, or academic sharing
  
  ### Collaborative Editing Workflows
  
  **Approval-Based Modifications**:
1. **Change Proposal**: Player suggests modification to shared element
2. **Affected Player Notification**: Automatic alerts to relevant players
3. **Discussion Period**: Comment-based negotiation and refinement
4. **Approval Collection**: Gather consent from all affected parties
5. **Implementation**: Apply changes after approval threshold met
   **Real-Time Collaborative Editing**:
- **Simultaneous Access**: Multiple players editing different sections
- **Live Cursors**: Show where other players are actively working
- **Change Highlighting**: Visual indicators of recent modifications
- **Merge Conflict Resolution**: Automated and manual conflict handling
  
  ### Privacy and Visibility Settings
  
  **Content Visibility Levels**:
- **Public**: Visible to all players in session
- **Private**: Visible only to owner and explicitly granted players
- **GM-Only**: Hidden from players but visible to session host
- **Faction-Specific**: Visible only to faction members in large games
  **Information Gradual Revelation**:
- **Discovery-Based**: Content revealed as players encounter it
- **Era-Gated**: Information unlocked as eras progress
- **Event-Triggered**: Details revealed by specific developments
- **Proximity-Based**: Content visible based on geographic closeness
  
  ## Cross-Player Event Coordination
  
  ### War Event Management
  
  **War Declaration Process**:
1. **Aggressor Identification**: Player declares intent to attack
2. **Target Confirmation**: Defender acknowledges incoming conflict
3. **Battle Context Setup**: Establish current relationships and stakes
4. **Collaborative Input**: Both players provide military details
5. **AI Battle Generation**: Process conflict using battle chronicle template
6. **Result Acceptance**: Both players confirm battle outcome
   **Multi-Faction Conflicts**:
- **Alliance Coordination**: Multiple players on same side
- **Complex Battlefields**: Multiple simultaneous engagements
- **Chain Reactions**: One conflict triggering additional wars
- **Neutral Party Impact**: Effects on non-participating players
  
  ### Trade and Diplomatic Events
  
  **Trade Route Establishment**:
1. **Route Proposal**: Player suggests new trade connection
2. **Partner Approval**: Target player confirms participation
3. **Route Planning**: Collaborative path selection and protection
4. **Economic Integration**: Shared benefits and resource access
5. **Ongoing Management**: Maintenance and protection responsibilities
   **Diplomatic Relationship Changes**:
- **Alliance Formation**: Mutual defense and cooperation agreements
- **Trade Partnerships**: Economic cooperation and resource sharing
- **Neutral Relations**: Non-aggression and coexistence pacts
- **Hostility Declarations**: Formal conflict and territorial disputes
  
  ### Cultural and Religious Exchange
  
  **Shared Religious Development**:
- **Pantheon Integration**: Deities worshipped across multiple regions
- **Sacred Site Pilgrimage**: Cross-border religious travel
- **Missionary Activity**: Religious influence spreading between territories
- **Religious Conflicts**: Theological disputes and conversions
  **Cultural Influence Systems**:
- **Artistic Exchange**: Cultural movements spreading between regions
- **Academic Cooperation**: Shared knowledge and institutional partnerships
- **Technological Transfer**: Innovation spreading through trade and diplomacy
- **Language and Custom Adoption**: Cultural assimilation and adaptation
  
  ## Technical Implementation Requirements
  
  ### Session State Management
  
  **Persistent Session Storage**:
  
  ```json
  {
  "session_id": "unique_identifier",
  "host_player": "player_id",
  "created_at": "timestamp",
  "last_activity": "timestamp",
  "current_era": 1-6,
  "settings": {
  "max_players": 2-8,
  "game_length": "short|standard|long|epic",
  "optional_rules": ["pangea", "enhanced_ai", "accelerated"],
  "advancement_rule": "all_complete|majority|host_override"
  },
  "players": [
  {
  "player_number": 1-8,
  "player_name": "string",
  "password_hash": "string",
  "territory_assignment": "region_coordinates",
  "current_era_status": "in_progress|complete|locked",
  "online_status": true/false,
  "last_seen": "timestamp"
  }
  ],
  "era_progression": {
  "era_1": {"completed_by": ["player_ids"], "locked": true/false},
  "era_2": {"completed_by": ["player_ids"], "locked": true/false},
  // ... continuing for all eras
  }
  }
  ```
  
  ### Real-Time Communication Protocol
  
  **WebSocket Event Types**:
  
  ```javascript
  // Connection Management
  {
  "type": "player_join",
  "player_id": "string",
  "player_name": "string",
  "territory": "region_data"
  }
  {
  "type": "player_leave",
  "player_id": "string",
  "reason": "disconnect|logout|kick"
  }
  // Content Updates
  {
  "type": "element_card_update",
  "card_id": "string",
  "changes": "diff_object",
  "updated_by": "player_id",
  "timestamp": "iso_string"
  }
  {
  "type": "era_progression",
  "era": 1-6,
  "player_id": "string",
  "status": "complete|advance"
  }
  // Cross-Player Events
  {
  "type": "approval_request",
  "request_id": "string",
  "requesting_player": "player_id",
  "affected_players": ["player_ids"],
  "element_type": "trade_route|diplomatic|territorial",
  "details": "request_description"
  }
  {
  "type": "war_declaration",
  "aggressor": "player_id",
  "defender": "player_id",
  "target_settlement": "settlement_name",
  "context": "war_context_data"
  }
  // Communication
  {
  "type": "chat_message",
  "from": "player_id",
  "to": "all|player_id|element_id",
  "message": "string",
  "timestamp": "iso_string"
  }
  ```
  
  ### Conflict Resolution System
  
  **Edit Conflict Detection**:
  
  ```javascript
  function detectConflict(currentVersion, incomingChange) {
  return {
  hasConflict: boolean,
  conflictType: "simultaneous|version_mismatch|permission",
  conflictSections: ["field_names"],
  resolutionOptions: ["last_writer_wins", "manual_merge", "version_branch"]
  };
  }
  ```
  
  **Resolution Strategies**:
- **Automatic Resolution**: Simple conflicts resolved without user intervention
- **Guided Merge**: User interface for manual conflict resolution
- **Version Branching**: Create parallel versions for major conflicts
- **Rollback Capability**: Revert to previous stable versions
  
  ### Performance and Scalability
  
  **Connection Optimization**:
- **Connection Pooling**: Efficient WebSocket connection management
- **Message Batching**: Group related updates for transmission efficiency
- **Selective Broadcasting**: Send updates only to relevant players
- **Compression**: Reduce bandwidth usage for large content updates
  **State Synchronization**:
- **Incremental Updates**: Send only changed data, not complete state
- **Conflict Detection**: Efficient algorithms for detecting edit conflicts
- **Caching Strategy**: Local caching with invalidation on updates
- **Recovery Mechanisms**: Automatic recovery from connection failures
  
  ### Security and Privacy
  
  **Authentication and Authorization**:
- **Password Protection**: Secure player authentication within sessions
- **Session Tokens**: JWT-based authentication for API access
- **Permission Validation**: Server-side verification of all edit permissions
- **Rate Limiting**: Prevent abuse and spam in real-time features
  **Data Protection**:
- **Input Validation**: Sanitize all user input to prevent injection attacks
- **Privacy Controls**: Respect player privacy settings for content visibility
- **Audit Logging**: Complete history of all modifications and access
- **Secure Communication**: Encrypted WebSocket connections for sensitive data
  This multi-player session system enables seamless collaboration while maintaining individual creative control and ensuring the integrity of the collaborative worldbuilding experience.