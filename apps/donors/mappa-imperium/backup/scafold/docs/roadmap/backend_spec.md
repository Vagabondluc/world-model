> **_Note: This document describes the aspirational, long-term vision for Mappa Imperium. It outlines a target architecture that includes a full backend and real-time collaboration. The application's current, simpler implementation is detailed in the `/docs/current` directory._**

# Mappa Imperium - Revised Backend Development Specification

## Core Backend Requirements

### Technology Stack Recommendations

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js or Fastify for REST API
- **Database**: PostgreSQL with Redis for caching/sessions
- **Real-time**: Socket.io for WebSocket management
- **AI Integration**: OpenAI API or similar LLM service
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 or equivalent for exports
  
  ### System Architecture Overview
  
  ```
  ┌─ Frontend (React) ─┐ ┌─ API Gateway ─┐ ┌─ Microservices ─┐
  │ • Era Content UI │ │ • Rate Limiting│ │ • Game Service │
  │ • Element Manager │◄──►│ • Auth Layer │◄──►│ • AI Service │
  │ • Real-time Collab │ │ • Load Balance │ │ • Export Service│
  └────────────────────┘ └────────────────┘ └─────────────────┘
  │
  ┌─ Data Layer ─┐
  │ • PostgreSQL │
  │ • Redis Cache│
  │ • File Store │
  └──────────────┘
  ```
  
  ## Database Schema Design
  
  ### Core Game Tables
  
  ```sql
  -- Games and Sessions
  CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  host_id UUID NOT NULL,
  current_era INTEGER DEFAULT 1,
  max_players INTEGER DEFAULT 8,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  );
  -- Player Sessions
  CREATE TABLE game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_number INTEGER CHECK (player_number BETWEEN 1 AND 8),
  player_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  region_assignment INTEGER,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_id, player_number)
  );
  ```
  
  ### Element Card System
  
  ```sql
  -- Core Element Cards (replaces world_entities)
  CREATE TABLE element_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  owner_player INTEGER NOT NULL,
  card_type VARCHAR(20) NOT NULL CHECK (card_type IN ('faction','settlement','character','location','war','event','resource','deity','monument')),
  era_created INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  ```

-- Core Content
 quick_summary TEXT,
 key_details JSONB DEFAULT '[]',
 full_description TEXT,
 mechanical_stats JSONB DEFAULT '{}',
 future_hooks JSONB DEFAULT '[]',

-- AI Integration
 ai_generated BOOLEAN DEFAULT false,
 template_source VARCHAR(100),
 template_input JSONB,
 generated_content JSONB,

-- Visual Properties
 card_color VARCHAR(7) DEFAULT '#666666',
 card_icon VARCHAR(10) DEFAULT '📋',
 priority VARCHAR(10) DEFAULT 'medium',

-- Status and Permissions
 status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','destroyed','historical','legendary')),
 visibility_settings JSONB DEFAULT '{"public": true}',

-- Type-specific properties stored as JSONB
 type_properties JSONB DEFAULT '{}',

-- Metadata
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),
 version INTEGER DEFAULT 1,

INDEX(game_id, card_type),
 INDEX(game_id, owner_player),
 INDEX(game_id, era_created)
);
-- Card Relationship System
CREATE TABLE card_relationships (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 source_card_id UUID REFERENCES element_cards(id) ON DELETE CASCADE,
 target_card_id UUID REFERENCES element_cards(id) ON DELETE CASCADE,
 relationship_type VARCHAR(50) NOT NULL,
 relationship_strength VARCHAR(10) DEFAULT 'moderate' CHECK (relationship_strength IN ('weak','moderate','strong')),
 bidirectional BOOLEAN DEFAULT false,
 description TEXT,
 created_by_player INTEGER NOT NULL,
 created_at TIMESTAMP DEFAULT NOW(),

UNIQUE(source_card_id, target_card_id, relationship_type)
);
-- Card Modification History
CREATE TABLE card_history (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 card_id UUID REFERENCES element_cards(id) ON DELETE CASCADE,
 modified_by_player INTEGER NOT NULL,
 modification_type VARCHAR(50) NOT NULL,
 changes JSONB NOT NULL,
 previous_version JSONB,
 timestamp TIMESTAMP DEFAULT NOW()
);

```
### AI Template Management
```sql
-- Template System
CREATE TABLE ai_templates (
 id VARCHAR(100) PRIMARY KEY,
 era INTEGER NOT NULL,
 template_type VARCHAR(50) NOT NULL,
 content TEXT NOT NULL,
 required_inputs JSONB NOT NULL,
 version VARCHAR(20) DEFAULT '1.0',
 created_at TIMESTAMP DEFAULT NOW()
);
-- Template Usage Tracking
CREATE TABLE template_usage (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 game_id UUID REFERENCES games(id) ON DELETE CASCADE,
 template_id VARCHAR(100) REFERENCES ai_templates(id),
 player_id INTEGER NOT NULL,
 input_data JSONB NOT NULL,
 generated_content JSONB NOT NULL,
 card_ids_created JSONB DEFAULT '[]',
 generation_time TIMESTAMP DEFAULT NOW(),
 success BOOLEAN DEFAULT true,
 error_message TEXT
);
```

### Cross-Player Coordination

```sql
-- Cross-Player Events
CREATE TABLE cross_player_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 game_id UUID REFERENCES games(id) ON DELETE CASCADE,
 event_type VARCHAR(50) NOT NULL,
 initiating_player INTEGER NOT NULL,
 affected_players JSONB NOT NULL,
 event_data JSONB NOT NULL,
 status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
 deadline TIMESTAMP,
 created_at TIMESTAMP DEFAULT NOW(),
 completed_at TIMESTAMP
);
-- Player Approvals for Cross-Player Events
CREATE TABLE event_approvals (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id UUID REFERENCES cross_player_events(id) ON DELETE CASCADE,
 player_id INTEGER NOT NULL,
 approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending','approved','rejected','abstain')),
 response_data JSONB,
 timestamp TIMESTAMP DEFAULT NOW(),

UNIQUE(event_id, player_id)
);
```

## API Architecture

### RESTful Endpoints

```typescript
// Game Management
POST /api/games // Create new game
GET /api/games/:gameId // Get game details
PUT /api/games/:gameId // Update game settings
DELETE /api/games/:gameId // Delete game
// Player Management
POST /api/games/:gameId/join // Join game as player
POST /api/games/:gameId/auth // Authenticate player
GET /api/games/:gameId/players // List players
PUT /api/games/:gameId/players/:playerId // Update player
// Element Card CRUD
GET /api/games/:gameId/cards // List cards (with filters)
POST /api/games/:gameId/cards // Create card
GET /api/games/:gameId/cards/:cardId // Get card details
PUT /api/games/:gameId/cards/:cardId // Update card
DELETE /api/games/:gameId/cards/:cardId // Delete card
GET /api/games/:gameId/cards/:cardId/history // Get modification history
// Card Relationships
GET /api/games/:gameId/cards/:cardId/relationships // Get card relationships
POST /api/games/:gameId/cards/:cardId/relationships // Create relationship
DELETE /api/games/:gameId/relationships/:relId // Remove relationship
// AI Template Integration
GET /api/templates // List available templates
GET /api/templates/:templateId // Get specific template
POST /api/ai/generate // Generate content from template
GET /api/games/:gameId/template-usage // Get template usage history
// Cross-Player Coordination
GET /api/games/:gameId/cross-events // List cross-player events
POST /api/games/:gameId/cross-events // Create cross-player event
GET /api/games/:gameId/cross-events/:eventId // Get event details
PUT /api/games/:gameId/cross-events/:eventId // Update event
POST /api/games/:gameId/cross-events/:eventId/approve // Submit approval
// Export System
POST /api/games/:gameId/export/html // Generate HTML export
POST /api/games/:gameId/export/json // Generate JSON export
POST /api/games/:gameId/export/foundry // Generate Foundry VTT export
GET /api/games/:gameId/export/:exportId // Download export file
```

### WebSocket Events

```typescript
// Real-time collaboration events
interface WebSocketEvents {
 // Connection Management
 'player:join': { gameId: string, playerId: string, playerName: string }
 'player:leave': { gameId: string, playerId: string }
 'player:status': { playerId: string, isOnline: boolean }

// Element Card Updates
 'card:created': { card: ElementCard, createdBy: string }
 'card:updated': { cardId: string, changes: Partial<ElementCard>, updatedBy: string }
 'card:deleted': { cardId: string, deletedBy: string }
 'card:relationship:created': { relationship: CardRelationship, createdBy: string }
 'card:relationship:deleted': { relationshipId: string, deletedBy: string }

// Era Progression
 'era:player_completed': { gameId: string, era: number, playerId: string }
 'era:advanced': { gameId: string, newEra: number }

// Cross-Player Events
 'cross_event:created': { event: CrossPlayerEvent, initiatedBy: string }
 'cross_event:updated': { eventId: string, status: string, updatedBy: string }
 'cross_event:approval_needed': { eventId: string, playerId: string, deadline: string }
 'cross_event:completed': { eventId: string, result: any }

// AI Generation
 'ai:generating': { templateId: string, playerId: string }
 'ai:completed': { result: any, cardsCreated: string[], playerId: string }
 'ai:error': { error: string, playerId: string }

// Communication
 'chat:message': { from: string, to: string, message: string, timestamp: string }
 'chat:system': { message: string, type: 'info'|'warning'|'error' }
}
```

## AI Template Integration Service

### Template Processing Pipeline

```typescript
class TemplateProcessor {
 async processTemplate(
 templateId: string, 
inputData: any, 
gameContext: GameContext
 ): Promise<GeneratedContent> {

// 1. Validate input against template schema
 const template = await this.getTemplate(templateId);
 const validationResult = this.validateInput(template, inputData);
 if (!validationResult.valid) {
 throw new ValidationError(validationResult.errors);
 }

// 2. Build context-aware prompt
 const prompt = await this.buildPrompt(template, inputData, gameContext);

// 3. Generate content using AI service
 const rawContent = await this.aiService.generate(prompt);

// 4. Parse and structure response
 const structuredContent = this.parseResponse(templateId, rawContent);

// 5. Validate against quality requirements
 const qualityCheck = this.validateQuality(structuredContent, template);
 if (!qualityCheck.passed) {
 return this.retryWithImprovements(prompt, qualityCheck.suggestions);
 }

// 6. Extract element cards and relationships
 const cards = this.extractElementCards(structuredContent, inputData);
 const relationships = this.extractRelationships(structuredContent);

return {
 content: structuredContent,
 elementCards: cards,
 relationships,
 metadata: {
 templateId,
 inputData,
 generatedAt: new Date(),
 qualityScore: qualityCheck.score
 }
 };
 }

private extractElementCards(content: any, context: any): ElementCard[] {
 // Extract named entities and convert to appropriate card types
 const cards: ElementCard[] = [];

// Extract characters (named individuals)
 const characters = this.extractNamedCharacters(content);
 cards.push(...characters.map(char => this.createCharacterCard(char, context)));

// Extract locations (places, geographic features)
 const locations = this.extractNamedLocations(content);
 cards.push(...locations.map(loc => this.createLocationCard(loc, context)));

// Extract events (significant happenings)
 const events = this.extractSignificantEvents(content);
 cards.push(...events.map(event => this.createEventCard(event, context)));

// Extract other entity types based on template
 const templateType = this.getTemplateType(context.templateId);
 switch(templateType) {
 case 'faction_development':
 cards.push(this.createFactionCard(content, context));
 break;
 case 'deity_creation':
 cards.push(this.createDeityCard(content, context));
 break;
 case 'battle_chronicle':
 cards.push(this.createWarCard(content, context));
 break;
 }

return cards;
 }
}
```

### Element Card Auto-Generation

```typescript
class ElementCardGenerator {
 async generateCardsFromTemplate(
 templateResult: TemplateResult,
 gameId: string,
 playerId: number
 ): Promise<ElementCard[]> {

const cards: ElementCard[] = [];

// Generate cards based on template type and content
 switch(templateResult.templateId) {
 case '1_4_fantasy-resources-prompt':
 cards.push(...this.generateResourceCards(templateResult));
 break;

case '2_1_god-prompt-template':
 cards.push(...this.generateDeityCards(templateResult));
 cards.push(...this.generateSacredSiteCards(templateResult));
 cards.push(...this.generateDivineEventCards(templateResult));
 break;

case '3_1_faction-prompt-revised':
 cards.push(this.generateFactionCard(templateResult));
 cards.push(...this.generateLeadershipCards(templateResult));
 break;

case '4_1_discovery-prompts':
 cards.push(this.generateDiscoveryEventCard(templateResult));
 cards.push(...this.generateDiscoveryRelatedCards(templateResult));
 break;

case 'Z_battle-chronicle-prompt':
 cards.push(this.generateWarCard(templateResult));
 cards.push(...this.generateBattleCharacterCards(templateResult));
 break;
 }

// Set common properties for all generated cards
 cards.forEach(card => {
 card.game_id = gameId;
 card.owner_player = playerId;
 card.ai_generated = true;
 card.template_source = templateResult.templateId;
 card.era_created = this.getCurrentEra(gameId);
 });

return this.persistCards(cards);
 }

private generateFactionCard(templateResult: TemplateResult): ElementCard {
 return {
 card_type: 'faction',
 name: templateResult.content.factionName,
 quick_summary: templateResult.content.quickSummary,
 full_description: templateResult.content.fullDescription,
 type_properties: {
 race: templateResult.content.race,
 symbol: templateResult.content.symbol,
 colors: templateResult.content.colors,
 cultural_theme: templateResult.content.culturalTheme,
 leadership_structure: templateResult.content.leadershipStructure,
 territory: templateResult.content.territory || [],
 allies: [],
 enemies: [],
 military_strength: templateResult.content.militaryStrength,
 economic_focus: templateResult.content.economicFocus
 }
 };
 }
}
```

## Real-Time Collaboration System

### Multi-Player Coordination Manager

```typescript
class CollaborationManager {
 async handleCrossPlayerEvent(
 eventType: string,
 eventData: any,
 initiatingPlayer: number,
 gameId: string
 ): Promise<CrossPlayerEvent> {

// 1. Determine affected players
 const affectedPlayers = this.identifyAffectedPlayers(eventType, eventData, gameId);

// 2. Create cross-player event record
 const event = await this.createCrossPlayerEvent({
 game_id: gameId,
 event_type: eventType,
 initiating_player: initiatingPlayer,
 affected_players: affectedPlayers,
 event_data: eventData,
 deadline: this.calculateDeadline(eventType)
 });

// 3. Notify affected players
 await this.notifyAffectedPlayers(event);

// 4. Set up coordination workflow
 await this.initiateCoordination(event);

return event;
 }

async processEventApproval(
 eventId: string,
 playerId: number,
 approvalData: any
 ): Promise<void> {

// 1. Record player approval
 await this.recordApproval(eventId, playerId, approvalData);

// 2. Check if all approvals received
 const event = await this.getCrossPlayerEvent(eventId);
 const approvals = await this.getEventApprovals(eventId);

if (this.allApprovalsReceived(event, approvals)) {
 // 3. Process the coordinated event
 await this.executeCoordinatedEvent(event, approvals);

// 4. Generate resulting element cards
 await this.generateCoordinationResults(event, approvals);

// 5. Notify all participants of completion
 await this.notifyEventCompletion(event);
 }
 }

private async executeCoordinatedEvent(
 event: CrossPlayerEvent,
 approvals: EventApproval[]
 ): Promise<void> {

switch(event.event_type) {
 case 'war_declaration':
 await this.processWarEvent(event, approvals);
 break;

case 'trade_route_establishment':
 await this.processTradeRoute(event, approvals);
 break;

case 'alliance_formation':
 await this.processAlliance(event, approvals);
 break;

case 'diplomatic_crisis':
 await this.processDiplomaticEvent(event, approvals);
 break;
 }
 }
}
```

### Real-Time Synchronization

```typescript
class RealTimeSync {
 private socketManager: SocketManager;
 private conflictResolver: ConflictResolver;

async handleCardUpdate(
 cardId: string,
 changes: Partial<ElementCard>,
 playerId: number
 ): Promise<UpdateResult> {

// 1. Check permissions
 const card = await this.getCard(cardId);
 if (!this.canEdit(card, playerId)) {
 throw new PermissionError('Player cannot edit this card');
 }

// 2. Detect conflicts
 const conflicts = await this.detectConflicts(cardId, changes);
 if (conflicts.length > 0) {
 return this.resolveConflicts(conflicts, changes, playerId);
 }

// 3. Apply changes
 const updatedCard = await this.applyChanges(card, changes, playerId);

// 4. Broadcast to other players
 await this.broadcastCardUpdate(cardId, changes, playerId);

// 5. Update related cards and relationships
 await this.updateRelatedElements(cardId, changes);

return { success: true, card: updatedCard };
 }

private async detectConflicts(
 cardId: string,
 incomingChanges: any
 ): Promise<Conflict[]> {

const recentChanges = await this.getRecentChanges(cardId, 60000); // Last minute
 const conflicts: Conflict[] = [];

for (const change of recentChanges) {
 const conflictingFields = this.findConflictingFields(change, incomingChanges);
 if (conflictingFields.length > 0) {
 conflicts.push({
 type: 'simultaneous_edit',
 fields: conflictingFields,
 originalChange: change,
 incomingChange: incomingChanges
 });
 }
 }

return conflicts;
 }
}
```

## Export System

### Multi-Format Export Service

```typescript
class ExportService {
 async generateExport(
 gameId: string,
 format: 'html' | 'json' | 'foundry' | 'markdown',
 options: ExportOptions = {}
 ): Promise<ExportResult> {

// 1. Gather all game data
 const gameData = await this.gatherCompleteGameData(gameId);

// 2. Generate export based on format
 let exportContent: any;
 switch(format) {
 case 'html':
 exportContent = await this.generateHTMLExport(gameData, options);
 break;
 case 'json':
 exportContent = await this.generateJSONExport(gameData, options);
 break;
 case 'foundry':
 exportContent = await this.generateFoundryExport(gameData, options);
 break;
 case 'markdown':
 exportContent = await this.generateMarkdownExport(gameData, options);
 break;
 }

// 3. Store export file
 const exportUrl = await this.storeExportFile(exportContent, format, gameId);

return {
 exportId: generateUUID(),
 downloadUrl: exportUrl,
 format,
 fileSize: this.calculateSize(exportContent),
 generatedAt: new Date(),
 gameId,
 cardCount: gameData.cards.length,
 playerCount: gameData.players.length
 };
 }

private async gatherCompleteGameData(gameId: string): Promise<CompleteGameData> {
 return {
 game: await this.getGame(gameId),
 players: await this.getGamePlayers(gameId),
 cards: await this.getAllElementCards(gameId),
 relationships: await this.getAllCardRelationships(gameId),
 crossPlayerEvents: await this.getCrossPlayerEvents(gameId),
 templateUsage: await this.getTemplateUsageHistory(gameId),
 exportMetadata: {
 exportedAt: new Date(),
 version: '1.0',
 totalEras: 6
 }
 };
 }

private async generateFoundryExport(
 gameData: CompleteGameData,
 options: ExportOptions
 ): Promise<FoundryExportData> {

const foundryData = {
 journals: this.createFoundryJournals(gameData),
 actors: this.createFoundryActors(gameData),
 scenes: this.createFoundryScenes(gameData),
 items: this.createFoundryItems(gameData),
 playlists: this.createFoundryPlaylists(gameData)
 };

return foundryData;
 }

private createFoundryJournals(gameData: CompleteGameData): FoundryJournal[] {
 const journals: FoundryJournal[] = [];

// World Chronicle
 journals.push({
 name: "World Chronicle",
 content: this.buildWorldChronicleHTML(gameData),
 folder: "chronicles",
 sort: 1000
 });

// Faction Profiles
 const factionCards = gameData.cards.filter(card => card.card_type === 'faction');
 factionCards.forEach((faction, index) => {
 journals.push({
 name: `Faction: ${faction.name}`,
 content: this.buildFactionHTML(faction, gameData),
 folder: "factions",
 sort: 2000 + index
 });
 });

// Location Guides
 const locationCards = gameData.cards.filter(card => card.card_type === 'location');
 locationCards.forEach((location, index) => {
 journals.push({
 name: `Location: ${location.name}`,
 content: this.buildLocationHTML(location, gameData),
 folder: "locations",
 sort: 3000 + index
 });
 });

// Event Chronicles
 const eventCards = gameData.cards.filter(card => card.card_type === 'event');
 eventCards.forEach((event, index) => {
 journals.push({
 name: `Event: ${event.name}`,
 content: this.buildEventHTML(event, gameData),
 folder: "events",
 sort: 4000 + index
 });
 });

return journals;
 }

private buildFactionHTML(faction: ElementCard, gameData: CompleteGameData): string {
 const settlements = this.getRelatedCards(faction.id, 'settlement', gameData);
 const characters = this.getRelatedCards(faction.id, 'character', gameData);
 const events = this.getRelatedCards(faction.id, 'event', gameData);

return `
 <div style="max-width:900px;margin:0 auto;background:linear-gradient(135deg, rgba(139,69,19,0.1), rgba(160,82,45,0.05));padding:30px;border-radius:15px;border:3px solid #8B4513;">
 <header style="text-align:center;border-bottom:3px solid #DAA520;padding-bottom:20px;margin-bottom:30px">
 <h1 style="font-family:'Times New Roman', serif;font-size:2.8em;color:#8B4513;">${faction.name}</h1>
 <div style="display:inline-block;background:#DAA520;color:#FFFFFF;padding:8px 20px;border-radius:20px;">
 🏛️ ${faction.type_properties?.race || 'Unknown Race'}
 </div>
 </header>

<div style="background:rgba(255,255,255,0.8);padding:25px;border-radius:10px;margin-bottom:25px;">
 <h3 style="color:#8B4513;margin-top:0;">Cultural Overview</h3>
 <p style="line-height:1.7;color:#2c3e50;">${faction.full_description}</p>
 </div>

${settlements.length > 0 ? `
 <div style="background:rgba(218,165,32,0.1);border:2px solid #DAA520;padding:20px;border-radius:10px;margin-bottom:20px;">
 <h3 style="color:#B8860B;margin-top:0;">Settlements</h3>
 <ul style="color:#2c3e50;">
 ${settlements.map(s => `<li><strong>${s.name}</strong> - ${s.quick_summary}</li>`).join('')}
 </ul>
 </div>
 ` : ''}

${characters.length > 0 ? `
 <div style="background:rgba(75,0,130,0.1);border:2px solid #4B0082;padding:20px;border-radius:10px;margin-bottom:20px;">
 <h3 style="color:#4B0082;margin-top:0;">Notable Figures</h3>
 <ul style="color:#2c3e50;">
 ${characters.map(c => `<li><strong>${c.name}</strong> - ${c.quick_summary}</li>`).join('')}
 </ul>
 </div>
 ` : ''}

${events.length > 0 ? `
 <div style="background:rgba(220,20,60,0.1);border:2px solid #DC143C;padding:20px;border-radius:10px;">
 <h3 style="color:#DC143C;margin-top:0;">Historical Events</h3>
 <ul style="color:#2c3e50;">
 ${events.map(e => `<li><strong>${e.name}</strong> - ${e.quick_summary}</li>`).join('')}
 </ul>
 </div>
 ` : ''}
 </div>
 `;
 }
}
```

## Performance and Scalability

### Caching Strategy

```typescript
class CacheManager {
 private redis: RedisClient;

// Element card caching
 async getElementCard(cardId: string): Promise<ElementCard | null> {
 const cacheKey = `card:${cardId}`;
 let card = await this.redis.get(cacheKey);

if (!card) {
 card = await this.database.getElementCard(cardId);
 if (card) {
 await this.redis.setex(cacheKey, 3600, JSON.stringify(card));
 }
 }

return card ? JSON.parse(card) : null;
 }

// Game state caching
 async getGameCards(gameId: string): Promise<ElementCard[]> {
 const cacheKey = `game:${gameId}:cards`;
 let cards = await this.redis.get(cacheKey);

if (!cards) {
 cards = await this.database.getGameElementCards(gameId);
 await this.redis.setex(cacheKey, 300, JSON.stringify(cards));
 }

return JSON.parse(cards);
 }

// Template caching
 async getTemplate(templateId: string): Promise<AITemplate> {
 const cacheKey = `template:${templateId}`;
 let template = await this.redis.get(cacheKey);

if (!template) {
 template = await this.database.getTemplate(templateId);
 await this.redis.setex(cacheKey, 3600, JSON.stringify(template));
 }

return JSON.parse(template);
 }

// Cache invalidation
 async invalidateGameCache(gameId: string): Promise<void> {
 const patterns = [
 `game:${gameId}:*`,
 `card:*` // Could be more specific with game-based card keys
 ];

for (const pattern of patterns) {
 const keys = await this.redis.keys(pattern);
 if (keys.length > 0) {
 await this.redis.del(...keys);
 }
 }
 }

async invalidateCardCache(cardId: string): Promise<void> {
 await this.redis.del(`card:${cardId}`);

// Also invalidate related caches
 const card = await this.database.getElementCard(cardId);
 if (card) {
 await this.invalidateGameCache(card.game_id);
 }
 }
}
```

### Rate Limiting and Security

```typescript
class SecurityManager {
 // AI generation rate limiting
 @RateLimit({ points: 10, duration: 60 }) // 10 requests per minute per player
 async generateContent(
 templateId: string, 
input: any, 
gameId: string, 
playerId: number
 ): Promise<any> {
 return this.templateProcessor.processTemplate(templateId, input, { gameId, playerId });
 }

// Element card update rate limiting
 @RateLimit({ points: 100, duration: 60 }) // 100 updates per minute per player
 async updateElementCard(
 cardId: string, 
changes: any, 
playerId: number
 ): Promise<any> {
 return this.cardManager.updateCard(cardId, changes, playerId);
 }

// Cross-player event rate limiting
 @RateLimit({ points: 5, duration: 300 }) // 5 cross-player events per 5 minutes per player
 async initiateCrossPlayerEvent(
 eventType: string,
 eventData: any,
 gameId: string,
 playerId: number
 ): Promise<any> {
 return this.collaborationManager.handleCrossPlayerEvent(eventType, eventData, playerId, gameId);
 }

// Input validation and sanitization
 validateAndSanitizeInput(input: any, schema: ValidationSchema): any {
 // Validate against schema
 const validation = this.validator.validate(input, schema);
 if (!validation.valid) {
 throw new ValidationError(validation.errors);
 }

// Sanitize HTML content
 if (typeof input === 'object') {
 Object.keys(input).forEach(key => {
 if (typeof input[key] === 'string') {
 input[key] = this.sanitizer.sanitize(input[key]);
 }
 });
 }

return input;
 }
}
```

## Development Checklist

### Backend Core Setup

- [ ] Set up Node.js/TypeScript project with proper configuration
- [ ] Configure PostgreSQL database with connection pooling
- [ ] Set up Redis for caching and session management
- [ ] Implement JWT authentication with refresh tokens
- [ ] Configure Socket.io for real-time features
- [ ] Set up AI service integration (OpenAI API)
- [ ] Implement file storage for exports
  
  ### Element Card System
- [ ] Build element card CRUD operations
- [ ] Implement card relationship management
- [ ] Create card history and versioning system
- [ ] Build card auto-generation from AI templates
- [ ] Implement card permission and ownership system
- [ ] Create card search and filtering APIs
  
  ### AI Template Integration
- [ ] Build template management system
- [ ] Implement AI content generation pipeline
- [ ] Create template-to-card conversion system
- [ ] Build quality validation for AI responses
- [ ] Implement template usage tracking
- [ ] Create context-aware prompt building
  
  ### Real-Time Collaboration
- [ ] Build WebSocket event broadcasting system
- [ ] Implement conflict detection and resolution
- [ ] Create cross-player event coordination
- [ ] Build approval workflow system
- [ ] Implement real-time notification system
- [ ] Create player presence and status tracking
  
  ### Export System
- [ ] Build multi-format export pipeline
- [ ] Create Foundry VTT export formatting
- [ ] Implement HTML/Markdown export with styling
- [ ] Build JSON export for data portability
- [ ] Create export file storage and delivery
- [ ] Implement export template system
  
  ### Performance and Security
- [ ] Set up comprehensive caching strategy
- [ ] Implement rate limiting for all endpoints
- [ ] Create input validation and sanitization
- [ ] Set up error handling and logging
- [ ] Configure monitoring and health checks
- [ ] Implement audit logging for security
  
  ### Quality Assurance
- [ ] Set up unit testing for all core functions
- [ ] Implement integration tests for API endpoints
- [x] Create end-to-end tests for complete workflows
- [ ] Set up performance testing for concurrent users
- [ ] Implement security testing and vulnerability scanning
- [ ] Create API documentation with examples
  This revised backend specification removes all architectural conflicts and focuses on the core requirements: element card management, AI template integration, real-time collaboration, and robust export capabilities. The system is designed to support the collaborative worldbuilding experience while maintaining data integrity and performance at scale.