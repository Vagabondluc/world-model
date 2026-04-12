# MythForge Codebase Inventory

**Generated:** 2026-04-01
**Purpose:** Audit existing implementation vs. Endgoal Spec requirements

---

## Executive Summary

| Category | Status |
|----------|--------|
| **Core Data Model** | ✅ Implemented |
| **Zod Validation Schemas** | ✅ Implemented (30+ schemas) |
| **Zustand Store** | ✅ Implemented with undo/redo |
| **AI Agent System** | ✅ Implemented (4 modes) |
| **Markdown Export** | ⚠️ One-way only (ZIP export) |
| **Shadow Copy Sync** | ❌ Not implemented |
| **Multi-Schema Merge** | ❌ Not implemented |
| **Prisma Database** | ⚠️ Minimal (User/Post only) |
| **Tauri Desktop** | ❌ Not configured |

---

## 1. Core Data Model

### Location
- [`mythforge/src/lib/types/index.ts`](../../src/lib/types/index.ts)

### Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| [`Entity`](../../src/lib/types/index.ts:24) interface | ✅ | UUID, uuid_short, title, category, markdown_content, json_attributes, tags |
| [`Relationship`](../../src/lib/types/index.ts:53) interface | ✅ | parent_id, child_id, relationship_type |
| [`CustomCategoryDef`](../../src/lib/types/index.ts:43) | ✅ | User-defined categories with custom attributes |
| [`AIModeConfig`](../../src/lib/types/index.ts:63) | ✅ | Mode configuration type |
| [`ChatMessage`](../../src/lib/types/index.ts:103) | ✅ | AI chat message structure |
| [`DmScreen`](../../src/lib/types/index.ts:119) | ✅ | DM screen layout type |
| [`generateUuidShort()`](../../src/lib/types/index.ts:153) | ✅ | Generates 6-char short UUID |
| [`getCustomAttrDefault()`](../../src/lib/types/index.ts:131) | ✅ | Default value extraction |

### Entity Categories (31 types)
Defined in [`EntityCategory`](../../src/lib/types/index.ts:9):
```
Cosmos, Plane, Deity, Myth, Region, Biome, Settlement, City, Landmark,
Dungeon, Structure, Faction, Guild, Religion, Noble House, Historical Event,
Era, Culture, Species, Race, Creature, Fauna, NPC, Character, Historical Figure,
Artifact, Item, Resource, Material, Technology, Magic System, Spell, Rule,
Campaign, Adventure, Quest, Encounter, Scene, Lore Note, Session Note
```

### Gap Analysis
| Spec Requirement | Current State | Gap |
|------------------|---------------|-----|
| Multi-schema support per entity | Single schema per category | Need `applied_schemas: string[]` field |
| Schema merge history | Not tracked | Need merge audit trail |
| Version tracking | Only created_at/updated_at | Need version field for shadow copy |

---

## 2. Validation Schemas

### Location
- [`mythforge/src/lib/validation/schemas-entities.ts`](../../src/lib/validation/schemas-entities.ts)
- [`mythforge/src/lib/validation/schemas-geo.ts`](../../src/lib/validation/schemas-geo.ts)
- [`mythforge/src/lib/validation.ts`](../../src/lib/validation.ts)

### Implemented Schemas (30+)

| Schema | File | Fields (sample) |
|--------|------|-----------------|
| `npcSchema` | schemas-entities.ts | hp, ac, level, disposition, class, race |
| `factionSchema` | schemas-entities.ts | influence, resources, goals |
| `settlementSchema` | schemas-geo.ts | population, government, danger_level |
| `dungeonSchema` | schemas-geo.ts | levels, theme, danger_rating |
| `creatureSchema` | schemas-entities.ts | cr, type, size, alignment |
| `deitySchema` | schemas-entities.ts | domains, alignment, portfolio |
| `artifactSchema` | schemas-entities.ts | rarity, attunement, charges |
| `spellSchema` | schemas-entities.ts | level, school, casting_time |
| `questSchema` | schemas-entities.ts | difficulty, objectives, rewards |

### Validation Functions

| Function | Location | Purpose |
|----------|----------|---------|
| [`validateEntityAttributes()`](../../src/lib/validation.ts:147) | validation.ts | Main validation entry point |
| [`buildSchemaFromTemplate()`](../../src/lib/validation.ts:107) | validation.ts | Dynamic schema from template |
| [`schemaForTemplateValue()`](../../src/lib/validation.ts:81) | validation.ts | Type inference for values |

### Schema Helper Functions
```typescript
num(default?: number)   // Numeric field with default
str(default?: string)   // String field with default
bool(default?: boolean) // Boolean field with default
strArr(default?: string[]) // String array
numArr(default?: number[]) // Number array
```

### Gap Analysis
| Spec Requirement | Current State | Gap |
|------------------|---------------|-----|
| Schema registry for multi-schema | CATEGORY_SCHEMAS static | Need dynamic registry |
| Schema merge rules | Not implemented | Need merge conflict resolution |
| Schema versioning | Not implemented | Need schema version tracking |

---

## 3. State Management (Zustand Store)

### Location
- [`mythforge/src/store/useWorldStore.ts`](../../src/store/useWorldStore.ts)
- [`mythforge/src/store/slices/undo.ts`](../../src/store/slices/undo.ts)
- [`mythforge/src/store/slices/category-actions.ts`](../../src/store/slices/category-actions.ts)

### Store State

| State Property | Type | Persisted | Notes |
|----------------|------|-----------|-------|
| `entities` | Entity[] | ✅ | Main data collection |
| `relationships` | Relationship[] | ✅ | Entity connections |
| `pinnedEntityIds` | string[] | ✅ | Pinned entities |
| `nodePositions` | Record<string, Position> | ✅ | Graph layout |
| `customCategories` | CustomCategoryDef[] | ✅ | User-defined categories |
| `dmScreens` | DmScreen[] | ✅ | DM screen layouts |
| `chatMessages` | ChatMessage[] | ❌ | AI chat history |
| `aiMode` | AIMode | ❌ | Current AI mode |

### Store Actions

| Action Category | Actions |
|-----------------|---------|
| **Entity CRUD** | addEntity, updateEntity, deleteEntity, duplicateEntity, setActiveEntity |
| **Tags & Pins** | addTag, removeTag, togglePinEntity |
| **Relationships** | addRelationship, deleteRelationship |
| **UI State** | setViewMode, toggleSidebar, toggleGmHud, toggleLayoutInversion |
| **AI** | setAiMode, addChatMessage, clearChat, setChatInput |
| **Graph** | setNodePosition, clearNodePositions |
| **History** | undo, redo, canUndo, canRedo |
| **DM Screens** | addDmScreen, renameDmScreen, deleteDmScreen, toggleEntityOnDmScreen |
| **Custom Categories** | addCustomCategory, updateCustomCategory, removeCustomCategory |

### Persistence
- Uses `zustand/middleware/persist`
- Stores to localStorage under key `mythforge-storage`
- Only persists: entities, relationships, pinnedEntityIds, nodePositions, customCategories, dmScreens

### Undo/Redo System
- Located in [`mythforge/src/store/slices/undo.ts`](../../src/store/slices/undo.ts)
- `pushHistory()` captures snapshot before mutations
- `_historyPast` and `_historyFuture` stacks
- Snapshot includes: entities, relationships, pinnedEntityIds, nodePositions

### Gap Analysis
| Spec Requirement | Current State | Gap |
|------------------|---------------|-----|
| Shadow copy sync trigger | Not implemented | Need file watcher integration |
| Multi-schema state | Not tracked | Need appliedSchemas in entity |
| Git version tracking | Not implemented | Need isomorphic-git integration |

---

## 4. AI Agent System

### Location
- [`mythforge/src/app/api/ai/chat/route.ts`](../../src/app/api/ai/chat/route.ts)
- [`mythforge/src/app/api/ai/chat/prompts.ts`](../../src/app/api/ai/chat/prompts.ts)
- [`mythforge/src/app/api/ai/chat/parsers.ts`](../../src/app/api/ai/chat/parsers.ts)

### Agent Modes

| Mode | Purpose | Output Blocks |
|------|---------|---------------|
| **Architect** | Schema/taxonomy management | `[SCHEMA_CONFIRMATION]`, `[CATEGORY_SUGGESTION]`, `[GRAPH_ANALYSIS]`, `[RELATIONSHIP_SUGGESTIONS]` |
| **Lorekeeper** | Entity generation | `[DRAFT_ENTITY]`, `[RELATIONSHIP_SUGGESTIONS]` |
| **Scholar** | Consistency analysis | `[CONSISTENCY_ISSUES]` |
| **Roleplayer** | NPC simulation | In-character dialogue |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/chat` | POST | Main chat endpoint |
| `/api/ai/generate-calendar-events` | POST | Calendar event generation |
| `/api/ai/synthesize-calendar` | POST | Calendar synthesis |

### Request Structure
```typescript
interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  mode: string;
  context?: {
    entityId: string;
    entityTitle: string;
    entityCategory: string;
    entityMarkdown: string;
    entityAttributes: Record<string, unknown>;
  };
  worldContext?: {
    entities: Array<{...}>;
    relationships?: Array<{...}>;
  };
}
```

### Parsed Components
Located in [`parsers.ts`](../../src/app/api/ai/chat/parsers.ts):
- `parseDraftEntities()` - Extract entity drafts from response
- `parseConsistencyIssues()` - Extract consistency issues
- `parseRelationshipSuggestions()` - Extract relationship suggestions
- `parseSchemaConfirmation()` - Extract schema changes
- `parseCategorySuggestions()` - Extract category suggestions
- `parseGraphAnalysis()` - Extract graph analysis results

### AI Provider
- Uses `z-ai-web-dev-sdk` (see [`mythforge/src/lib/ai.ts`](../../src/lib/ai.ts))
- Configured via `getZAI()` function

### Gap Analysis
| Spec Requirement | Current State | Gap |
|------------------|---------------|-----|
| Schema-to-prompt mapping | Manual in prompts | Need automated field→placeholder mapping |
| Template system | Hardcoded | Need user-editable templates |
| Multi-schema prompts | Single schema | Need merged schema context |

---

## 5. Export System

### Location
- [`mythforge/src/lib/export-markdown.ts`](../../src/lib/export-markdown.ts)

### Current Implementation

| Function | Purpose |
|----------|---------|
| `exportWorldAsMarkdown()` | Exports entire world to ZIP file |
| `entityToMarkdown()` | Converts entity to markdown string |
| `generateIndex()` | Creates index.md with all entities |
| `generateRelationshipsDoc()` | Creates relationships.md |
| `generateSessionNotes()` | Creates session-notes.md |
| `slugify()` | URL-safe filename generation |

### Export Structure
```
world-export.zip
├── index.md           # Entity index
├── relationships.md   # Relationship graph
├── session-notes.md   # Session notes
├── npc/               # NPCs by category
├── locations/
├── factions/
└── ...
```

### Gap Analysis
| Spec Requirement | Current State | Gap |
|------------------|---------------|-----|
| Bidirectional sync | One-way export | Need file watcher + import |
| Shadow copy folder | ZIP download | Need persistent folder sync |
| Git version tracking | Not implemented | Need isomorphic-git |
| Live sync | Manual export | Need file watcher |

---

## 6. Database Layer (Prisma)

### Location
- [`mythforge/prisma/schema.prisma`](../../prisma/schema.prisma)

### Current Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Database
- SQLite (`db/custom.db`)
- No Entity/Relationship models

### Gap Analysis
| Spec Requirement | Current State | Gap |
|------------------|---------------|-----|
| Entity persistence | Zustand/localStorage only | Need Prisma Entity model |
| Relationship persistence | Zustand/localStorage only | Need Prisma Relationship model |
| User worlds | Not implemented | Need World model with userId |
| Multi-schema tracking | Not implemented | Need AppliedSchema model |

### Required Schema Additions
```prisma
model World {
  id        String   @id @default(cuid())
  name      String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  entities  Entity[]
}

model Entity {
  id               String   @id
  uuidShort        String   @unique
  title            String
  category         String
  markdownContent  String
  jsonAttributes   Json
  tags             String[]
  isPinned         Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  worldId          String
  world            World    @relation(fields: [worldId], references: [id])
  appliedSchemas   AppliedSchema[]
}

model Relationship {
  id               String   @id @default(cuid())
  parentId         String
  childId          String
  relationshipType String
}
```

---

## 7. UI Components

### Location
- [`mythforge/src/components/ui/`](../../src/components/ui/)

### Available Components (shadcn/ui)
| Component | Status |
|-----------|--------|
| accordion | ✅ |
| alert-dialog | ✅ |
| avatar | ✅ |
| badge | ✅ |
| button | ✅ |
| calendar | ✅ |
| card | ✅ |
| checkbox | ✅ |
| dialog | ✅ |
| dropdown-menu | ✅ |
| form | ✅ |
| input | ✅ |
| label | ✅ |
| popover | ✅ |
| scroll-area | ✅ |
| select | ✅ |
| separator | ✅ |
| sheet | ✅ |
| sidebar | ✅ |
| switch | ✅ |
| tabs | ✅ |
| textarea | ✅ |
| tooltip | ✅ |

### Additional Libraries
- `@xyflow/react` - Graph visualization
- `@mdxeditor/editor` - Markdown editing
- `@dnd-kit/*` - Drag and drop
- `framer-motion` - Animations
- `react-resizable-panels` - Resizable layouts

---

## 8. Platform Deployment

### Next.js Configuration
- **Framework:** Next.js 16.1.1
- **React:** 19.0.0
- **Styling:** Tailwind CSS 4
- **Package Manager:** Bun

### Build Scripts
```json
{
  "dev": "next dev -p 3000",
  "build": "next build && cp -r .next/static .next/standalone/.next/",
  "start": "NODE_ENV=production bun .next/standalone/server.js"
}
```

### Tauri Status
| Requirement | Status |
|-------------|--------|
| Tauri config | ❌ Not present |
| tauri.conf.json | ❌ Not created |
| Rust toolchain | ❌ Not configured |
| Desktop build | ❌ Not available |

### Gap Analysis
| Spec Requirement | Current State | Gap |
|------------------|---------------|-----|
| Tauri desktop app | Not configured | Need `src-tauri/` setup |
| Shared code architecture | Next.js only | Need platform abstraction |
| SQLite in Tauri | Browser localStorage | Need Tauri SQL plugin |

---

## 9. Documentation & Templates

### Schema Templates
Location: [`mythforge/docs/schema-templates/`](../schema-templates/)

Canonical source for category schemas, prompt skeletons, workflow notes, and sample fixtures.
Start with [`index.md`](../schema-templates/index.md) and [`methods.md`](../schema-templates/methods.md).

| Template | Status |
|----------|--------|
| NPC.md | ✅ |
| Faction.md | ✅ |
| Settlement.md | ✅ |
| Dungeon.md | ✅ |
| Deity.md | ✅ |
| Creature.md | ✅ |
| Artifact.md | ✅ |
| Spell.md | ✅ |
| Campaign.md | ✅ |
| Adventure.md | ✅ |
| (20+ more) | ✅ |

### JSON Schemas
Location: [`mythforge/docs/schema-templates/schemas/`](../schema-templates/schemas/)

These exported schemas are part of the schema-template workflow and mirror the runtime validation layer.

| Schema File | Purpose |
|-------------|---------|
| Arcane.schema.json | Magic system schema |
| Artifact.schema.json | Item schema |
| DungeonAssembly.schema.json | Dungeon structure |
| HeistPlan.schema.json | Heist planning |
| MysteryNode.schema.json | Mystery elements |
| Quest.schema.json | Quest structure |

### Prompt Templates
Location: [`mythforge/docs/schema-templates/prompts/`](../schema-templates/prompts/)

Prompt templates are authored alongside the matching schema and workflow notes in `docs/schema-templates`.

---

## 10. Skills System

### Location
- [`mythforge/skills/`](../../skills/)

### Available Skills
| Skill | Purpose |
|-------|---------|
| agent-browser | Browser automation |
| ai-news-collectors | News aggregation |
| aminer-open-academic | Academic research |
| ASR | Speech recognition |
| blog-writer | Blog post generation |
| coding-agent | Code generation |
| content-strategy | Content planning |
| contentanalysis | Content analysis |
| docx | Word document handling |
| image-understand | Image analysis |
| writing-plans | Writing planning |
| xlsx | Excel handling |

---

## Summary: Implementation Gaps

### Critical Gaps (Blocking Endgoal)

| Gap | Impact | Effort |
|-----|--------|--------|
| Shadow copy bidirectional sync | Core feature | High |
| Multi-schema merge system | Core feature | Medium |
| Prisma Entity/Relationship models | Persistence | Medium |
| Tauri desktop configuration | Platform | Medium |

### High Priority Gaps

| Gap | Impact | Effort |
|-----|--------|--------|
| Schema-to-prompt automation | AI workflow | Medium |
| Git version tracking | Versioning | Medium |
| User/World authentication | Multi-user | Medium |

### Medium Priority Gaps

| Gap | Impact | Effort |
|-----|--------|--------|
| Template editing UI | UX | Low |
| Import from shadow copy | Workflow | Medium |
| Schema registry | Extensibility | Low |

---

## Next Steps

1. **Phase 1: Database Foundation**
   - Add Entity, Relationship, World models to Prisma
   - Migrate Zustand persistence to Prisma
   - Implement user authentication

2. **Phase 2: Multi-Schema System**
   - Add `appliedSchemas` field to Entity
   - Implement schema merge logic
   - Create schema registry

3. **Phase 3: Shadow Copy**
   - Create shadow folder structure
   - Implement bidirectional sync
   - Add isomorphic-git for versioning

4. **Phase 4: Tauri Desktop**
   - Initialize Tauri project
   - Configure SQLite plugin
   - Create platform abstraction layer

5. **Phase 5: Template System**
   - Implement schema-to-prompt mapping
   - Create template editor UI
   - Build prompt preview system
