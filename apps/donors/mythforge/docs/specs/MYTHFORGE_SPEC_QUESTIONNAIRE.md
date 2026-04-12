# MythForge Specification Questionnaire

**Purpose:** Remove ambiguity and establish a clear endgoal for the MythForge application.

**Instructions:** Answer each question with as much detail as possible. If a question is not applicable, mark it as "N/A" and explain why. Use concrete examples where helpful.

---

## 1. Core Architecture & Deployment

### 1.1 Platform Deployment
| # | Question | Context |
|---|----------|---------|
| 1.1.1 | What is the primary deployment target: Next.js server, Tauri desktop app, or both with feature parity? | Determines shared code vs platform-specific implementations |
| 1.1.2 | If both, what percentage of features should work offline in Tauri vs requiring server connection? | Affects data sync strategy and agent availability |
| 1.1.3 | Should the Next.js server support multi-user scenarios, or is it single-user per instance? | Impacts authentication, data isolation, and database design |
| 1.1.4 | What is the expected data synchronization strategy between Tauri local storage and Next.js server? | Shadow copy folder needs clear sync rules |

### 1.2 Agent System
| # | Question | Context |
|---|----------|---------|
| 1.2.1 | What defines an "agent" in MythForge? Is it: (a) an LLM API call, (b) a multi-step workflow orchestrator, (c) a persistent persona with memory, (d) other? | Core concept definition |
| 1.2.2 | How many concurrent agents should the system support? | Performance and rate limiting considerations |
| 1.2.3 | Should agents have access to the entire database context, or scoped to specific projects/campaigns? | Context window management and data access patterns |
| 1.2.4 | What agent frameworks or APIs are planned (OpenAI, Anthropic, local LLMs, LangChain, etc.)? | Integration requirements |
| 1.2.5 | Should agents be stateless (single prompt-response) or stateful (conversation history, memory)? | Session management complexity |

---

## 2. Card System & Data Model

### 2.1 Card Definition
| # | Question | Context |
|---|----------|---------|
| 2.1.1 | What is a "card" in MythForge? Is it: (a) a database record, (b) a UI component representation, (c) a template instance, (d) all of the above? | Terminology alignment |
| 2.1.2 | What core fields does EVERY card have regardless of type? (e.g., id, name, created_at, updated_at, tags) | Base schema design |
| 2.1.3 | How are card relationships handled? (e.g., NPC belongs to Faction, Location contains Items) | Relational model |
| 2.1.4 | Can cards reference cards of the same type? (e.g., NPC references NPC as mentor) | Self-referential relationships |

### 2.2 Multiple Schema Types Per Card Type
| # | Question | Context |
|---|----------|---------|
| 2.2.1 | When an NPC uses "more than one schema," what does this mean exactly? | **Critical ambiguity** |
| | Option A: An NPC card stores data from multiple schemas simultaneously (merged object) | |
| | Option B: An NPC card can be created using Schema A OR Schema B (exclusive choice) | |
| | Option C: An NPC card has a "base" schema + optional "extension" schemas | |
| | Option D: Different NPC instances in the database can use different schemas | |
| 2.2.2 | If using multiple schemas on one card, how are field conflicts resolved when Schema A has `name: string` and Schema B has `name: {first: string, last: string}`? | Field collision strategy |
| 2.2.3 | Should schema selection be: (a) user-chosen at creation time, (b) system-inferred from context, (c) template-driven? | UX flow decision |
| 2.2.4 | Can a card's schema type be changed after creation, or is it immutable? | Migration complexity |
| 2.2.5 | How should the UI display cards with different schemas in the same list view? | Explorer/list design |

### 2.3 Schema-to-Prompt Mapping
| # | Question | Context |
|---|----------|---------|
| 2.3.1 | When generating markdown, exactly how does the schema "feed the prompt"? | **Critical for generation flow** |
| | Is it: (a) schema fields are serialized into the prompt as JSON? | |
| | (b) schema fields are mapped to prompt template placeholders? | |
| | (c) schema defines which prompt template to use? | |
| | (d) schema validation results guide agent behavior? | |
| 2.3.2 | Where do prompt templates live? Database, filesystem, code? | Template management |
| 2.3.3 | Can users create custom prompt templates, or are they system-defined? | Extensibility scope |
| 2.3.4 | Should prompt templates support conditional logic (if field X is empty, skip section Y)? | Template complexity |

---

## 3. Markdown Generation & Templates

### 3.1 Template System
| # | Question | Context |
|---|----------|---------|
| 3.1.1 | What template engine should be used? (Mustache, Handlebars, custom, LLM-generated) | Technical implementation |
| 3.1.2 | Are templates the same as schemas, or separate entities? | Conceptual clarity |
| 3.1.3 | Should templates support: (a) static text with placeholders, (b) loops over arrays, (c) conditionals, (d) partials/includes? | Template feature scope |
| 3.1.4 | How are templates versioned? If a template changes, what happens to previously generated markdown? | Versioning strategy |

### 3.2 Markdown Output
| # | Question | Context |
|---|----------|---------|
| 3.2.1 | Is the markdown file: (a) fully generated by the agent, (b) template-filled with agent-provided values, (c) a hybrid? | Generation approach |
| 3.2.2 | What markdown flavor/extensions are supported? (GitHub Flavored, CommonMark, custom with frontmatter) | Output format |
| 3.2.3 | Should generated markdown include YAML frontmatter with card metadata? | Machine-readable headers |
| 3.2.4 | Can users manually edit generated markdown, and if so, how are manual edits handled on regeneration? | Edit conflict resolution |
| 3.2.5 | What is the regeneration policy? (a) always overwrite, (b) append new sections, (c) create new version, (d) user choice? | Version control |

---

## 4. Shadow Copy & Parallel Output Folder

### 4.1 Shadow Copy Definition
| # | Question | Context |
|---|----------|---------|
| 4.1.1 | What exactly is the "shadow copy"? | **Critical ambiguity** |
| | Option A: A read-only export of database content as markdown files | |
| | Option B: A bidirectional sync where file changes update the database | |
| | Option C: A git-tracked version history of all generated content | |
| | Option D: A backup/archive of generated content separate from the DB | |
| 4.1.2 | What triggers a shadow copy update? (a) every save, (b) manual export, (c) scheduled batch, (d) markdown generation completion? | Sync timing |
| 4.1.3 | What is the folder structure of the shadow copy? (e.g., `output/npcs/name.md`, `output/factions/name.md`) | File organization |
| 4.1.4 | Should the shadow copy include: (a) only markdown files, (b) images/assets, (c) schema JSON files, (d) all of the above? | Content scope |
| 4.1.5 | How are deleted records handled in the shadow copy? (delete file, archive, mark as deleted?) | Deletion propagation |

### 4.2 Curation Process
| # | Question | Context |
|---|----------|---------|
| 4.2.1 | What does "curated" mean in this context? (a) manually reviewed, (b) validated against schema, (c) deduplicated, (d) organized by tags? | Curation definition |
| 4.2.2 | Is curation automatic, manual, or a combination? | Automation level |
| 4.2.3 | Should the shadow copy be git-initialized for version control? | Change tracking |
| 4.2.4 | Can external tools (Obsidian, VS Code) edit the shadow copy directly? | External editing support |

---

## 5. Content Types & Categories

### 5.1 Existing Categories (from MYTHFORGE_REFERENCE.md)
The following categories exist. Confirm which are in scope for v1.0:

**Macro & Cosmos:** Cosmos, Plane, Deity, Myth
**Geography:** Biome, Region, Settlement, City, Landmark, Dungeon, Structure
**Society & History:** Faction, Guild, Religion, Noble House, Historical Event, Era, Culture
**Biology & Entities:** Species, Race, Creature, Fauna, NPC, Character, Historical Figure
**Items & Mechanics:** Artifact, Item, Resource, Material, Technology

| # | Question | Context |
|---|----------|---------|
| 5.1.1 | Which categories are priority for v1.0? | Scope definition |
| 5.1.2 | Are there categories NOT in this list that should be added? | Missing entities |
| 5.1.3 | Should categories be extensible by users, or system-defined only? | Extensibility |

### 5.2 Category-Specific Questions
| # | Question | Context |
|---|----------|---------|
| 5.2.1 | For NPCs specifically: what are the distinct "schema types" needed? (e.g., Combat NPC, Social NPC, Merchant NPC, Plot NPC) | NPC schema variants |
| 5.2.2 | Should there be a "universal" schema that all cards share plus category-specific extensions? | Inheritance model |
| 5.2.3 | How are cross-category relationships defined? (e.g., "this NPC is located at this Settlement") | Relationship schema |

---

## 6. User Interface & Experience

### 6.1 Card Editor
| # | Question | Context |
|---|----------|---------|
| 6.1.1 | Should the card editor be: (a) form-based, (b) markdown editor, (c) split view, (d) user choice? | Editor type |
| 6.1.2 | How are schema-specific fields displayed? (dynamic form generation, tabs, collapsible sections?) | Field organization |
| 6.1.3 | Is there a "preview" pane showing how the generated markdown will look? | Preview feature |
| 6.1.4 | Should there be a "generation settings" panel per card (temperature, model selection, etc.)? | Agent configuration |

### 6.2 Agent Interaction
| # | Question | Context |
|---|----------|---------|
| 6.2.1 | How does the user initiate content generation? (button click, auto-generate on save, scheduled batch?) | Trigger mechanism |
| 6.2.2 | Should there be a "chat with agent" interface for iterative refinement? | Conversational UI |
| 6.2.3 | How are generation errors or validation failures displayed to the user? | Error handling UX |
| 6.2.4 | Is there a "generation history" or "undo" for agent operations? | Recovery mechanism |

---

## 7. Technical Implementation

### 7.1 Database
| # | Question | Context |
|---|----------|---------|
| 7.1.1 | What database should be used? (SQLite for Tauri, PostgreSQL for server, IndexedDB, or abstraction layer?) | Storage technology |
| 7.1.2 | Should the database be: (a) document store (JSON blobs), (b) relational with typed columns, (c) hybrid? | Data model |
| 7.1.3 | How are schemas stored? (as JSON Schema, Zod schemas in code, database records?) | Schema persistence |
| 7.1.4 | Is there a migration strategy for schema changes? | Schema evolution |

### 7.2 API & Integration
| # | Question | Context |
|---|----------|---------|
| 7.2.1 | Should there be a REST API, tRPC, or GraphQL interface? | API style |
| 7.2.2 | Is there a plugin/extension system for custom generators? | Extensibility |
| 7.2.3 | Should MythForge integrate with external tools (Foundry VTT, Obsidian, etc.)? | External integrations |

---

## 8. Non-Functional Requirements

### 8.1 Performance
| # | Question | Context |
|---|----------|---------|
| 8.1.1 | What is the acceptable response time for: (a) card save, (b) markdown generation, (c) search/query? | Performance targets |
| 8.1.2 | What is the expected maximum database size (number of cards)? | Scale expectations |
| 8.1.3 | Should there be background job processing for long-running generations? | Async processing |

### 8.2 Security & Privacy
| # | Question | Context |
|---|----------|---------|
| 8.2.1 | Are API keys stored locally (Tauri) or server-side (Next.js)? | Secret management |
| 8.2.2 | Is there a need for content encryption at rest? | Data protection |
| 8.2.3 | Should generated content be logged for debugging/audit? | Logging scope |

---

## 9. Workflow Examples (Use Cases)

Please describe the expected flow for these common scenarios:

### 9.1 Creating an NPC
```
Step 1: User does X
Step 2: System does Y
Step 3: Agent does Z
...
```

### 9.2 Generating Markdown for a Dungeon
```
Step 1: ...
Step 2: ...
```

### 9.3 Syncing Shadow Copy
```
Step 1: ...
Step 2: ...
```

---

## 10. Priority & Phasing

### 10.1 MVP Definition
| # | Question | Context |
|---|----------|---------|
| 10.1.1 | What is the absolute minimum feature set for a usable v0.1? | MVP scope |
| 10.1.2 | Which features can be deferred to v0.5, v1.0, v2.0? | Roadmap planning |

### 10.2 Success Criteria
| # | Question | Context |
|---|----------|---------|
| 10.2.1 | How do you define "success" for MythForge? (user adoption, content quality, time saved?) | Success metrics |
| 10.2.2 | Are there existing tools MythForge should replace or complement? | Competitive landscape |

---

## Response Template

Copy this template and fill in your answers:

```markdown
## My Answers

### 1. Core Architecture & Deployment
- 1.1.1: [Your answer]
- 1.1.2: [Your answer]
...

### 2. Card System & Data Model
- 2.1.1: [Your answer]
...

[Continue for all sections]
```

---

## Next Steps

After answering these questions:
1. I will create a formal SPEC document with clear definitions
2. I will generate architecture diagrams if needed
3. I will produce a phased implementation roadmap
4. I will create API contracts and data models
