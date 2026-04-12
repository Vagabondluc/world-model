# MythForge Endgoal Specification

**Version:** 1.0.0-draft  
**Last Updated:** 2026-04-01  
**Status:** Draft for Review

---

## Executive Summary

MythForge is an agent-based content generation system for TTRPG worldbuilding. It enables users to create, manage, and generate narrative content through AI agents, with a synchronized shadow copy filesystem for external tool integration.

### Core Value Proposition
- **Agent-Driven Generation**: AI agents generate markdown content from structured schemas
- **Multi-Schema Flexibility**: Cards can evolve by merging additional schemas after creation
- **Bidirectional Sync**: File changes in the shadow folder update the database and vice versa
- **Cross-Platform**: Runs on both Next.js server and Tauri desktop app

---

## 1. Terminology & Definitions

### 1.1 Core Concepts

| Term | Definition |
|------|------------|
| **Card** | A database record representing a worldbuilding entity (NPC, Location, Item, etc.). Contains a UUID, title, category, markdown content, JSON attributes, and tags. |
| **Entity** | Synonymous with Card. The universal data wrapper in MythForge. |
| **Schema** | A Zod validation definition that specifies the structure, types, and defaults for a card's `json_attributes`. |
| **Template** | A set of default values for a category, used when creating new cards. |
| **Agent** | An AI assistant mode (Architect, Lorekeeper, Scholar, Roleplayer) that generates or manipulates content. |
| **Shadow Copy** | A parallel folder structure that mirrors the database as markdown files, with bidirectional sync and git version tracking. |
| **Prompt Template** | A markdown template with placeholders that maps schema fields to agent prompts. |

### 1.2 Data Model Summary

```typescript
interface Entity {
  id: string;                    // UUID v4 - unique identifier
  uuid_short: string;            // 8-char display ID (e.g., "E-88A2")
  title: string;                 // Display name
  category: string;              // EntityCategory or custom category
  markdown_content: string;      // Generated narrative lore
  json_attributes: Record<string, unknown>; // Schema-validated data
  tags: string[];                // Cross-category filtering
  isPinned: boolean;             // Tab DM Screen pinning
  created_at: number;            // Unix timestamp
  updated_at: number;            // Unix timestamp
}

interface Relationship {
  id: string;                    // UUID v4
  parent_id: string;             // UUID of parent Entity
  child_id: string;              // UUID of child Entity
  relationship_type: string;     // e.g., 'contains', 'located_in'
}
```

---

## 2. Multi-Schema System

### 2.1 Schema Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    CARD SCHEMA LIFECYCLE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Creation]                                                     │
│     │                                                           │
│     ▼                                                           │
│  ┌──────────────────┐                                          │
│  │ Select Category  │ ──▶ NPC, Location, Item, etc.            │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │ Select Schema    │ ──▶ ONE schema from available options    │
│  └────────┬─────────┘     (e.g., Combat NPC, Social NPC)       │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │ Initialize Card  │ ──▶ Card created with schema defaults    │
│  └────────┬─────────┘                                          │
│           │                                                     │
│  [Post-Creation Evolution]                                      │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │ Merge Schema     │ ──▶ Add fields from another schema       │
│  └────────┬─────────┘     (non-destructive merge)              │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │ Updated Card     │ ──▶ json_attributes now contains         │
│  └──────────────────┘     merged fields from both schemas      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Schema Merge Rules

When merging an additional schema into an existing card:

| Scenario | Resolution |
|----------|------------|
| New field not in current card | Add with schema default value |
| Field exists with same type | Keep existing value (no overwrite) |
| Field exists with different type | Keep existing value, log warning |
| Conflicting nested objects | Deep merge (recursive) |
| Conflicting arrays | Keep existing array (no concatenation) |

### 2.3 Schema-to-Category Mapping

Each category has a **primary schema** (used at creation) and can have **extension schemas** (merged later):

```yaml
NPC:
  primary_schemas:
    - CombatNPC      # Combat stats, abilities, tactics
    - SocialNPC      # Personality, relationships, dialogue
    - MerchantNPC    # Inventory, prices, trade
    - PlotNPC        # Story hooks, secrets, revelations
  extension_schemas:
    - Spellcaster    # Adds spell slots, known spells
    - Noble          # Adds title, holdings, political power
    - Criminal       # Adds underworld contacts, illicit activities

Location:
  primary_schemas:
    - Settlement     # Population, government, services
    - Dungeon        # Rooms, encounters, treasure
    - Wilderness     # Terrain, dangers, resources
  extension_schemas:
    - Magical        # Adds enchantments, ley lines
    - Haunted        # Adds ghosts, curses, history
```

### 2.4 Schema Storage

Schemas are stored as:
1. **Zod schemas** in `src/lib/validation/schemas-entities.ts` (runtime validation)
2. **JSON Schema** in `docs/schema-templates/schemas/*.schema.json` (canonical documentation/export)
3. **Template defaults** in `src/lib/types/templates.ts` (UI initialization)
4. **Workflow docs** in `docs/schema-templates/index.md`, `methods.md`, and `methods/architect_guide.md` (authoring and validation flow)

---

## 3. Agent System

### 3.1 Agent Modes

| Mode | Icon | Purpose | System Behavior |
|------|------|---------|-----------------|
| **Architect** | Hammer | Database & Rules Management | Suggests structural improvements, manages relationships |
| **Lorekeeper** | Wand2 | Content Generation | Creates characters, locations, histories as Draft Cards |
| **Scholar** | BookOpen | Lore Search & RAG | Finds connections, answers questions with citations |
| **Roleplayer** | Drama | NPC Simulator | Stays in character, generates dialogue |

### 3.2 Agent Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT GENERATION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. USER TRIGGERS GENERATION                                    │
│     │  - Click "Generate" button                                │
│     │  - Auto-generate on field change                          │
│     │  - Batch generate multiple cards                          │
│     ▼                                                           │
│  2. SYSTEM PREPARES CONTEXT                                     │
│     │  - Load card's json_attributes (schema fields)            │
│     │  - Load prompt template for category                      │
│     │  - Load world context (related entities)                  │
│     ▼                                                           │
│  3. PROMPT ASSEMBLY                                             │
│     │  - Map schema fields to template placeholders             │
│     │  - Example: {{name}} → json_attributes.name               │
│     │  - Example: {{hp}} → json_attributes.hp                   │
│     │  - Inject system prompt for agent mode                    │
│     ▼                                                           │
│  4. AGENT EXECUTION                                             │
│     │  - Send assembled prompt to LLM API                       │
│     │  - Stream response back to UI                             │
│     │  - Parse response for Draft Cards                         │
│     ▼                                                           │
│  5. OUTPUT PROCESSING                                           │
│     │  - Generated markdown stored in markdown_content          │
│     │  - Extracted attributes update json_attributes            │
│     │  - Trigger shadow copy sync                               │
│     ▼                                                           │
│  6. USER REVIEW                                                 │
│        - Accept/Reject generated content                        │
│        - Edit manually                                          │
│        - Regenerate with different parameters                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Prompt Template Format

Prompt templates use `{{placeholder}}` syntax for schema field mapping:

```markdown
# NPC Generation Prompt

Generate a detailed NPC description for:

**Name:** {{name}}
**Race:** {{race}}
**Class:** {{class}}
**Role:** {{role}}

## Personality
- **Disposition:** {{disposition}}
- **Traits:** {{personalityTraits}}
- **Ideals:** {{ideals}}
- **Bonds:** {{bonds}}
- **Flaws:** {{flaws}}

## Combat Stats (if applicable)
- **HP:** {{hp}}
- **AC:** {{ac}}
- **Level:** {{level}}

## Background
{{backstory}}

Generate a rich, immersive description suitable for a TTRPG session.
```

### 3.4 Agent Context Injection

When an agent operates on a card, it receives:

```typescript
interface AgentContext {
  // Current card being edited
  currentEntity: {
    id: string;
    title: string;
    category: string;
    markdown_content: string;
    json_attributes: Record<string, unknown>;
    tags: string[];
  };
  
  // World context (configurable scope)
  worldContext: {
    entities: Entity[];        // Related or all entities
    relationships: Relationship[];
  };
  
  // Schema reference
  schemaReference: {
    category: string;
    availableSchemas: string[];
    currentSchema: string;
    fieldDefinitions: Record<string, FieldType>;
  };
  
  // Template reference
  promptTemplate: string;
}
```

---

## 4. Shadow Copy System

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHADOW COPY ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐          ┌─────────────────────┐             │
│   │   DATABASE  │◀────────▶│   SYNC ENGINE       │             │
│   │   (SQLite)  │          │                     │             │
│   └─────────────┘          └──────────┬──────────┘             │
│                                        │                        │
│                                        ▼                        │
│                             ┌─────────────────────┐             │
│                             │   SHADOW FOLDER     │             │
│                             │   ./output/         │             │
│                             └──────────┬──────────┘             │
│                                        │                        │
│                                        ▼                        │
│                             ┌─────────────────────┐             │
│                             │   GIT REPOSITORY    │             │
│                             │   (version history) │             │
│                             └─────────────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Folder Structure

```
output/
├── .git/                          # Git repository for version tracking
├── README.md                      # Auto-generated index
├── index.md                       # Entity listing by category
├── relationships.md               # Relationship graph documentation
│
├── macro-cosmos/
│   ├── cosmos/
│   │   └── prime-material.md
│   ├── planes/
│   │   ├── feywild.md
│   │   └── shadowfell.md
│   ├── deities/
│   │   └── pelor.md
│   └── myths/
│       └── creation-myth.md
│
├── geography/
│   ├── regions/
│   │   └── northern-wastes.md
│   ├── settlements/
│   │   ├── phandalin.md
│   │   └── neverwinter.md
│   ├── dungeons/
│   │   └── wave-echo-cave.md
│   └── structures/
│       └── cragmaw-castle.md
│
├── society/
│   ├── factions/
│   │   └── harpers.md
│   └── guilds/
│       └── blacksmiths-guild.md
│
├── entities/
│   ├── npcs/
│   │   ├── gundren-rockseeker.md
│   │   └── sildar-hallwinter.md
│   ├── creatures/
│   │   └── young-green-dragon.md
│   └── characters/
│       └── party-fighter.md
│
└── items/
    ├── artifacts/
    │   └── staff-of-magi.md
    └── items/
        └── longsword-plus-1.md
```

### 4.3 Markdown File Format

Each markdown file includes YAML frontmatter for machine readability:

```markdown
---
id: "E-88A2"
uuid: "550e8400-e29b-41d4-a716-446655440000"
category: "NPC"
schema: "SocialNPC"
schemas_merged: ["SocialNPC", "Noble"]
title: "Lady Katarina"
tags: ["noble", "quest-giver", "neverwinter"]
created_at: "2026-03-15T10:30:00Z"
updated_at: "2026-04-01T02:14:00Z"
synced_at: "2026-04-01T02:14:05Z"
---

# Lady Katarina

> **Category:** NPC  
> **ID:** `E-88A2`  
> **Created:** 2026-03-15  
> **Updated:** 2026-04-01

## Attributes

```json
{
  "name": "Lady Katarina",
  "race": "Human",
  "class": "Aristocrat",
  "level": 5,
  "disposition": "Friendly",
  "title": "Duchess of the Northern Reaches",
  "holdings": ["Crystal Palace", "Three villages"],
  "political_power": 7
}
```

## Lore

Lady Katarina rules the northern reaches with an iron fist wrapped in velvet...

## Relationships

- **Located In:** [Neverwinter](../settlements/neverwinter.md)
- **Allied With:** [The Harpers](../factions/harpers.md)
- **Enemy Of:** [The Black Network](../factions/zhentarim.md)

---
*Exported from MythosForge — E-88A2*
```

### 4.4 Bidirectional Sync Rules

#### Database → File (Export)

| Trigger | Action |
|---------|--------|
| Card created | Create new markdown file in category folder |
| Card updated | Update markdown file, commit to git |
| Card deleted | Move file to `.archive/` folder, commit deletion |
| Card category changed | Move file to new category folder |
| Relationship added/removed | Update `## Relationships` section in affected files |

#### File → Database (Import)

| Trigger | Action |
|---------|--------|
| File created in folder | Parse frontmatter, create new card |
| File content modified | Parse frontmatter + markdown, update card |
| File deleted | Mark card as archived (soft delete) |
| File moved between folders | Update card category |
| Frontmatter modified | Update `json_attributes` |

#### Conflict Resolution

| Scenario | Resolution |
|----------|------------|
| Both DB and file modified | Use timestamp - newer wins |
| UUID mismatch | Trust database, regenerate file |
| Invalid frontmatter | Log error, skip import, keep DB version |
| Missing required fields | Use schema defaults for missing fields |

### 4.5 Git Integration

```bash
# Automatic commits on sync
git add .
git commit -m "Sync: Updated Lady Katarina (E-88A2)"
git push origin main  # Optional: remote backup

# Commit message format
"Sync: {action} {title} ({uuid_short})"
```

---

## 5. Platform Deployment

### 5.1 Next.js Server Mode

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER MODE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   Browser   │────▶│  Next.js    │────▶│   SQLite    │       │
│  │   Client    │◀────│  Server     │◀────│  Database   │       │
│  └─────────────┘     └──────┬──────┘     └─────────────┘       │
│                             │                                   │
│                             ▼                                   │
│                      ┌─────────────┐                           │
│                      │  LLM APIs   │                           │
│                      │  (OpenAI,   │                           │
│                      │  Anthropic) │                           │
│                      └─────────────┘                           │
│                                                                 │
│  Features:                                                      │
│  - Full agent capabilities                                      │
│  - Multi-user support (optional)                                │
│  - Remote access                                                │
│  - API key server-side (secure)                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Tauri Desktop Mode

```
┌─────────────────────────────────────────────────────────────────┐
│                    TAURI DESKTOP MODE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   WebView   │────▶│   Tauri     │────▶│   SQLite    │       │
│  │   (React)   │◀────│   Rust      │◀────│  (Local)    │       │
│  └─────────────┘     └──────┬──────┘     └─────────────┘       │
│                             │                                   │
│                             ▼                                   │
│                      ┌─────────────┐                           │
│                      │ File System │                           │
│                      │ (Shadow)    │                           │
│                      └─────────────┘                           │
│                                                                 │
│  Features:                                                      │
│  - Offline-first (agents require API calls)                    │
│  - Direct file system access                                    │
│  - Local API key storage                                        │
│  - Native performance                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Shared Code Architecture

```
mythforge/
├── src/
│   ├── lib/                    # Shared business logic
│   │   ├── db.ts              # Database abstraction
│   │   ├── validation.ts      # Schema validation
│   │   ├── export-markdown.ts # Markdown generation
│   │   ├── sync.ts            # Shadow copy sync engine
│   │   └── ai.ts              # Agent API client
│   │
│   ├── components/            # Shared UI components
│   │   ├── ui/               # Base UI (shadcn)
│   │   └── mythosforge/      # App-specific components
│   │
│   └── app/                   # Next.js routes
│       └── api/              # Server API routes
│
├── src-tauri/                 # Tauri-specific code
│   ├── src/
│   │   └── main.rs           # Rust backend
│   └── tauri.conf.json       # Tauri config
│
└── prisma/
    └── schema.prisma         # Database schema
```

---

## 6. Workflow Examples

### 6.1 Creating an NPC

```
Step 1: User clicks "New Entity" → Select "NPC" category
Step 2: System prompts schema selection: "Combat NPC", "Social NPC", "Merchant NPC"
Step 3: User selects "Social NPC"
Step 4: System creates card with Social NPC template defaults:
        {
          "name": "",
          "role": "",
          "disposition": "Neutral",
          "personalityTraits": "",
          "ideals": "",
          "bonds": "",
          "flaws": "",
          ...
        }
Step 5: User fills in fields: name="Gundren Rockseeker", role="Quest Giver"
Step 6: User clicks "Generate Lore"
Step 7: System:
        - Loads Social NPC prompt template
        - Maps schema fields to placeholders
        - Sends to Lorekeeper agent
        - Receives generated markdown
Step 8: System updates card.markdown_content with generated lore
Step 9: Sync engine updates shadow copy file
Step 10: Git commit: "Sync: Created Gundren Rockseeker (E-1234)"
```

### 6.2 Merging an Extension Schema

```
Step 1: User opens existing NPC card "Lady Katarina" (Social NPC)
Step 2: User clicks "Add Schema" → Select "Noble" extension
Step 3: System merges Noble schema fields:
        - Adds: title, holdings, political_power
        - Keeps: existing name, role, disposition
Step 4: Card now has merged attributes from both schemas
Step 5: User fills new Noble fields: title="Duchess", political_power=7
Step 6: User clicks "Regenerate Lore"
Step 7: Agent generates updated lore incorporating Noble context
Step 8: Sync engine updates file with new frontmatter:
        schemas_merged: ["SocialNPC", "Noble"]
```

### 6.3 External Edit via Shadow Copy

```
Step 1: User opens output/entities/npcs/gundren-rockseeker.md in Obsidian
Step 2: User edits markdown_content directly
Step 3: User saves file
Step 4: File watcher detects change
Step 5: Sync engine:
        - Parses frontmatter
        - Extracts updated markdown
        - Updates database record
Step 6: UI reflects changes on next load/refresh
Step 7: Git commit: "Sync: External edit Gundren Rockseeker (E-1234)"
```

---

## 7. API Contracts

### 7.1 REST Endpoints

```yaml
# Entity CRUD
GET    /api/entities                    # List all entities
GET    /api/entities/:id                # Get single entity
POST   /api/entities                    # Create entity
PUT    /api/entities/:id                # Update entity
DELETE /api/entities/:id                # Delete entity

# Schema Management
GET    /api/schemas                     # List available schemas
GET    /api/schemas/:category           # Get schemas for category
POST   /api/entities/:id/merge-schema   # Merge schema into entity

# Agent Generation
POST   /api/ai/chat                     # Agent chat completion
POST   /api/ai/generate                 # Generate markdown for entity
POST   /api/ai/batch-generate           # Generate for multiple entities

# Shadow Copy Sync
POST   /api/sync/export                 # Force export to shadow copy
POST   /api/sync/import                 # Force import from shadow copy
GET    /api/sync/status                 # Get sync status/conflicts
```

### 7.2 TypeScript Interfaces

```typescript
// Entity creation request
interface CreateEntityRequest {
  title: string;
  category: EntityCategory;
  schemaId: string;                    // Primary schema selection
  json_attributes?: Record<string, unknown>;
  tags?: string[];
}

// Schema merge request
interface MergeSchemaRequest {
  schemaId: string;                    // Extension schema to merge
  overwrite?: boolean;                 // Allow field overwrites
}

// Agent generation request
interface GenerateRequest {
  entityId: string;
  mode: AIMode;
  templateId?: string;                 // Override default template
  temperature?: number;
  maxTokens?: number;
}

// Sync status response
interface SyncStatusResponse {
  lastSync: string;                    // ISO timestamp
  pendingChanges: number;
  conflicts: Array<{
    entityId: string;
    entityTitle: string;
    dbUpdatedAt: string;
    fileUpdatedAt: string;
  }>;
}
```

---

## 8. Implementation Phases

### Phase 1: Foundation (v0.1)
- [ ] Core Entity CRUD with single schema per category
- [ ] Basic markdown generation via Lorekeeper agent
- [ ] Shadow copy export (one-way: DB → File)
- [ ] Next.js server deployment

### Phase 2: Multi-Schema (v0.5)
- [ ] Schema selection at creation time
- [ ] Schema merge functionality
- [ ] Extension schema definitions
- [ ] Updated prompt templates for merged schemas

### Phase 3: Bidirectional Sync (v0.7)
- [ ] File watcher for shadow copy changes
- [ ] Import from modified files
- [ ] Conflict resolution UI
- [ ] Git integration for version history

### Phase 4: Tauri Desktop (v0.9)
- [ ] Tauri wrapper for existing Next.js app
- [ ] Local file system access
- [ ] Offline mode (read-only without API)
- [ ] Native notifications

### Phase 5: Polish & Extensions (v1.0)
- [ ] Performance optimization
- [ ] Custom schema builder UI
- [ ] Import/export world packages
- [ ] Plugin system for custom generators

---

## 9. Open Questions

| # | Question | Impact | Priority |
|---|----------|--------|----------|
| 1 | Should custom user schemas be stored in database or code? | Extensibility model | High |
| 2 | What is the maximum context window for world context injection? | Agent performance | Medium |
| 3 | Should relationships be bidirectional automatically? | Data model complexity | Medium |
| 4 | How to handle schema versioning when schemas change? | Migration strategy | High |
| 5 | Should shadow copy support multiple output formats (JSON, YAML)? | Export flexibility | Low |
| 6 | What LLM providers should be supported beyond OpenAI? | Integration scope | Medium |

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Content generation time | < 5 seconds per card | Agent response latency |
| Sync latency | < 500ms | File change to DB update |
| User satisfaction | Generate quality rating > 4/5 | User feedback |
| Data integrity | Zero data loss in sync | Conflict resolution rate |
| Offline capability | 100% read, 80% write | Feature availability in Tauri |

---

## Appendix A: Entity Categories Reference

From [`MYTHFORGE_REFERENCE.md`](../MYTHFORGE_REFERENCE.md):

| Group | Categories |
|-------|------------|
| Macro & Cosmos | Cosmos, Plane, Deity, Myth |
| Geography | Biome, Region, Settlement, City, Landmark, Dungeon, Structure |
| Society & History | Faction, Guild, Religion, Noble House, Historical Event, Era, Culture |
| Biology & Entities | Species, Race, Creature, Fauna, NPC, Character, Historical Figure |
| Items & Mechanics | Artifact, Item, Resource, Material, Technology |
| Narrative | Campaign, Adventure, Quest, Encounter, Scene, Session Note, Lore Note |

---

## Appendix B: Related Documents

- [`MYTHFORGE_REFERENCE.md`](../MYTHFORGE_REFERENCE.md) - Schema field reference
- [`MYTHFORGE_MS_TEMPLATE_MAPPING.md`](../MYTHFORGE_MS_TEMPLATE_MAPPING.md) - Mechanical Sycophant integration
- [`MYTHFORGE_SPEC_QUESTIONNAIRE.md`](./MYTHFORGE_SPEC_QUESTIONNAIRE.md) - Original questionnaire

---

*Document generated from specification questionnaire responses. Last updated: 2026-04-01*
