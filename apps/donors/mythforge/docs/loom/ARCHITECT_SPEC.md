# Architect Mode - Workflow Template Designer Specification

> **Status:** Draft
> **Version:** 0.1.0
> **Last Updated:** 2026-03-31
> **Related:** [The Loom SPEC](./SPEC.md)

## Overview

The Architect mode is redesigned as the **Workflow Template Designer** for The Loom. Instead of managing database schemas (which overlapped with Lorekeeper), Architect now creates, modifies, and manages reusable workflow templates that The Loom executes autonomously.

## Role Definition

### Previous Role (Deprecated)

```
❌ Suggest structural improvements to entity attribute templates
❌ Recommend new relationships between entities
❌ Generate entity drafts (overlapped with Lorekeeper)
```

### New Role

```
✅ Design multi-step workflow templates for The Loom
✅ Define validation rules and quality checkpoints
✅ Orchestrate which modes handle which steps
✅ Maintain a library of reusable templates
✅ Suggest appropriate workflows based on user intent
```

## Output Blocks

### [WORKFLOW_TEMPLATE]

Complete workflow definition:

```
[WORKFLOW_TEMPLATE]
{
  "name": "populate_region",
  "version": "1.0.0",
  "description": "Generate settlements and NPCs for a region",
  "inputs": [
    {"name": "region_id", "type": "entity_id", "required": true},
    {"name": "settlement_count", "type": "number", "default": 3}
  ],
  "steps": [
    {
      "id": "analyze_region",
      "mode": "scholar",
      "prompt_template": "Analyze region {{region_id}}...",
      "output_variable": "region_analysis"
    },
    {
      "id": "generate_settlements",
      "mode": "lorekeeper",
      "depends_on": ["analyze_region"],
      "prompt_template": "Generate {{settlement_count}} settlements...",
      "output_variable": "settlement_drafts"
    }
  ],
  "validation_rules": [
    {
      "id": "no_orphans",
      "check": "settlements.every(s => s.has_relationship)",
      "severity": "error"
    }
  ]
}
[/WORKFLOW_TEMPLATE]
```

### [WORKFLOW_STEP]

Individual step modification or addition:

```
[WORKFLOW_STEP]
{
  "workflow_id": "wf_populate_region_v1",
  "action": "add" | "modify" | "remove",
  "step": {
    "id": "generate_factions",
    "mode": "lorekeeper",
    "depends_on": ["generate_settlements"],
    "prompt_template": "Generate factions for settlements...",
    "output_variable": "faction_drafts",
    "foreach": "settlement in settlements",
    "max_retries": 2
  },
  "insert_after": "generate_settlements"
}
[/WORKFLOW_STEP]
```

### [VALIDATION_RULE]

Quality checkpoint definition:

```
[VALIDATION_RULE]
{
  "workflow_id": "wf_populate_region_v1",
  "rule": {
    "id": "population_consistency",
    "name": "Settlement populations must be logical",
    "check": "settlements.every(s => s.population >= 10 && s.population <= 1000000)",
    "severity": "warning",
    "on_failure": "auto_fix",
    "auto_fix_prompt": "Adjust population to realistic value based on settlement type"
  }
}
[/VALIDATION_RULE]
```

### [TEMPLATE_SUGGESTION]

Recommend existing template to user:

```
[TEMPLATE_SUGGESTION]
{
  "template_id": "wf_populate_region_v1",
  "confidence": 0.92,
  "reasoning": "User wants to add settlements to a region, which matches this template's purpose",
  "suggested_inputs": {
    "region_id": "{{active_entity.id}}",
    "settlement_count": 4
  },
  "estimated_duration_minutes": 25
}
[/TEMPLATE_SUGGESTION]
```

### [WORKFLOW_SUGGESTION]

Suggest workflow with custom parameters (lighter weight than full template):

```
[WORKFLOW_SUGGESTION]
{
  "template_name": "quick_npc_batch",
  "description": "Generate 5 NPCs for the current location",
  "inputs": {
    "location_id": "{{active_entity.id}}",
    "count": 5,
    "types": ["merchant", "guard", "civilian"]
  },
  "estimated_duration_minutes": 10
}
[/WORKFLOW_SUGGESTION]
```

## System Prompt

```markdown
You are The Architect, an AI assistant specialized in designing WORKFLOW TEMPLATES for The Loom (MythosForge's autonomous agent worker).

CORE CAPABILITIES:
1. WORKFLOW DESIGN: Create multi-step prompt chains that The Loom can execute autonomously over hours
2. TEMPLATE LIBRARY: Maintain and modify reusable workflow templates
3. VALIDATION RULES: Define quality checkpoints between workflow steps
4. MODE ORCHESTRATION: Specify which mode (Lorekeeper, Scholar, Roleplayer) handles each step

OUTPUT FORMATS:
- [WORKFLOW_TEMPLATE] for complete workflow definitions
- [WORKFLOW_STEP] for individual step modifications
- [VALIDATION_RULE] for quality control rules
- [TEMPLATE_SUGGESTION] for recommending existing templates
- [WORKFLOW_SUGGESTION] for quick workflow invocations

DESIGN PRINCIPLES:
1. Workflows should be atomic and reusable
2. Each step should have a single responsibility
3. Validation rules should catch errors early
4. Templates should handle edge cases gracefully

WHEN USER DESCRIBES A BATCH OPERATION:
1. Analyze the task complexity
2. Check if an existing template matches
3. If yes, suggest it with [TEMPLATE_SUGGESTION]
4. If no, design a new template with [WORKFLOW_TEMPLATE]

WHEN USER WANTS TO MODIFY A WORKFLOW:
1. Identify the workflow to modify
2. Use [WORKFLOW_STEP] for step changes
3. Use [VALIDATION_RULE] for quality changes
4. Explain the impact of changes

YOU DO NOT:
- Generate entity content (that's Lorekeeper's role)
- Check lore consistency (that's Scholar's role)
- Roleplay NPCs (that's Roleplayer's role)

Your output is consumed by The Loom, not directly by the user. Design for machine execution.
```

## Template Library

### Built-in Templates

| Template ID | Name | Purpose | Est. Time |
|-------------|------|---------|-----------|
| `wf_populate_region` | Populate Region | Generate settlements + NPCs for a region | 20-40 min |
| `wf_create_dungeon` | Create Dungeon | Full dungeon with rooms, monsters, treasure | 30-60 min |
| `wf_faction_network` | Faction Network | Generate interconnected factions | 20-40 min |
| `wf_npc_family` | NPC Family Tree | Generate family relationships for an NPC | 10-15 min |
| `wf_session_prep` | Session Prep | Prepare all entities for next session | 30-45 min |
| `wf_bbeg_lair` | BBEG Lair | Create villain lair with minions and traps | 45-90 min |
| `wf_town_square` | Town Square | Generate a complete town center with shops | 25-35 min |

### Template Categories

```
📁 Workflow Templates
├── 📁 Worldbuilding
│   ├── populate_region
│   ├── create_dungeon
│   └── faction_network
├── 📁 NPCs
│   ├── npc_family_tree
│   ├── npc_batch
│   └── npc_relationships
├── 📁 Session Prep
│   ├── session_prep
│   ├── encounter_builder
│   └── rumor_mill
└── 📁 Adventure Design
    ├── bbeg_lair
    ├── dungeon_floor
    └── quest_chain
```

## User Interaction Patterns

### Pattern 1: Template Suggestion

```
User: I need to fill my new region with some towns

Architect: I can help with that! I have a "Populate Region" workflow that will:
1. Analyze your region's geography
2. Generate 3-5 settlements with appropriate populations
3. Create NPCs for each settlement
4. Link everything with relationships

Estimated time: 25-35 minutes

[TEMPLATE_SUGGESTION]
{
  "template_id": "wf_populate_region",
  "confidence": 0.95,
  "suggested_inputs": {
    "region_id": "{{active_entity.id}}",
    "settlement_count": 4,
    "population_density": "moderate"
  }
}
[/TEMPLATE_SUGGESTION]

Would you like me to start this workflow, or would you prefer to customize it first?
```

### Pattern 2: Custom Workflow Design

```
User: I need to generate a trading caravan with guards, merchants, and cargo

Architect: I don't have an existing template for caravans, but I can design one.

[WORKFLOW_TEMPLATE]
{
  "name": "create_caravan",
  "version": "1.0.0",
  "description": "Generate a trading caravan with NPCs and cargo",
  "inputs": [
    {"name": "origin_location", "type": "entity_id", "required": true},
    {"name": "destination_location", "type": "entity_id", "required": true},
    {"name": "caravan_size", "type": "string", "default": "medium"}
  ],
  "steps": [
    {
      "id": "design_caravan",
      "mode": "lorekeeper",
      "prompt_template": "Design a {{caravan_size}} trading caravan traveling from {{origin_location}} to {{destination_location}}...",
      "output_variable": "caravan_design"
    },
    {
      "id": "generate_merchants",
      "mode": "lorekeeper",
      "prompt_template": "Generate 2-3 merchant NPCs based on: {{caravan_design}}...",
      "output_variable": "merchant_drafts"
    },
    {
      "id": "generate_guards",
      "mode": "lorekeeper",
      "prompt_template": "Generate 3-5 guard NPCs to protect the caravan...",
      "output_variable": "guard_drafts"
    },
    {
      "id": "generate_cargo",
      "mode": "lorekeeper",
      "prompt_template": "Generate cargo items appropriate for the trade route...",
      "output_variable": "cargo_drafts"
    },
    {
      "id": "create_relationships",
      "mode": "architect",
      "prompt_template": "Link caravan members and cargo...",
      "output_variable": "relationships"
    }
  ]
}
[/WORKFLOW_TEMPLATE]

This workflow will create approximately 8-12 entities and take 15-20 minutes.
Shall I save this as a reusable template and/or execute it now?
```

### Pattern 3: Workflow Modification

```
User: Can you add faction generation to the populate_region workflow?

Architect: I'll add a faction generation step after the NPCs are created.

[WORKFLOW_STEP]
{
  "workflow_id": "wf_populate_region",
  "action": "add",
  "step": {
    "id": "generate_factions",
    "name": "Generate Local Factions",
    "mode": "lorekeeper",
    "depends_on": ["generate_npcs"],
    "prompt_template": "Based on the settlements and NPCs already generated, create 1-3 factions that would logically exist in this region. Consider: trade guilds, religious groups, political factions, criminal organizations.",
    "output_variable": "faction_drafts",
    "max_retries": 2
  },
  "insert_after": "generate_npcs"
}
[/WORKFLOW_STEP]

[VALIDATION_RULE]
{
  "workflow_id": "wf_populate_region",
  "rule": {
    "id": "faction_presence",
    "name": "Factions must have members",
    "check": "factions.every(f => f.member_count >= 3)",
    "severity": "warning",
    "on_failure": "auto_fix"
  }
}
[/VALIDATION_RULE]

This modification adds approximately 10 minutes to the workflow.
The updated workflow will now take 35-50 minutes total.
```

## Integration Points

### With The Loom

```typescript
// Architect outputs are consumed by The Loom
interface ArchitectOutput {
  templates: WorkflowTemplate[];
  steps: WorkflowStepModification[];
  rules: ValidationRuleModification[];
  suggestions: TemplateSuggestion[];
}

// Parser extracts structured blocks
function parseArchitectOutput(content: string): ArchitectOutput {
  return {
    templates: parseWorkflowTemplates(content),
    steps: parseWorkflowSteps(content),
    rules: parseValidationRules(content),
    suggestions: parseTemplateSuggestions(content),
  };
}
```

### With Existing Modes

| Mode | How Architect Uses It |
|------|----------------------|
| **Lorekeeper** | Steps that create entities |
| **Scholar** | Steps that analyze/validate |
| **Roleplayer** | Steps that generate dialogue/interactions |
| **Architect** | Steps that create relationships (retained) |

## Quick Actions (UI)

```typescript
const ARCHITECT_QUICK_ACTIONS = [
  {
    label: 'Suggest Workflow',
    icon: GitBranch,
    prompt: 'Based on my current entity and world state, suggest a workflow that would be useful.'
  },
  {
    label: 'Design Batch Operation',
    icon: Layers,
    prompt: 'Help me design a workflow to batch-generate multiple related entities.'
  },
  {
    label: 'Modify Template',
    icon: Settings,
    prompt: 'I want to modify an existing workflow template.'
  },
  {
    label: 'Template Library',
    icon: BookOpen,
    prompt: 'Show me available workflow templates and what they do.'
  }
];
```

## Implementation Checklist

- [ ] Update Architect system prompt
- [ ] Add new output block parsers
- [ ] Create template storage (database table)
- [ ] Build template suggestion logic
- [ ] Integrate with The Loom execution engine
- [ ] Add UI for template library browsing
- [ ] Add UI for workflow customization
