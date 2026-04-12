# The Loom - Autonomous Agent Worker

> **Status:** Draft
> **Version:** 0.1.0
> **Last Updated:** 2026-03-31

## Overview

The Loom is MythosForge's autonomous agent worker system. It executes multi-step workflows over extended periods (hours) without user intervention, orchestrating existing AI modes to complete complex worldbuilding tasks.

## Documentation Index

| Document | Purpose |
|----------|---------|
| [Documentation Normalization Plan](../DOCS_NORMALIZATION_PLAN.md) | Canonical cleanup plan for docs, specs, and harness references |
| [Documentation Normalization Roadmap](../DOCS_NORMALIZATION_ROADMAP.md) | Milestone roadmap with user UI-test checkpoints |
| [Schema Templates Index](../schema-templates/index.md) | Canonical schema, prompt, workflow, and sample source for category templates |
| [UUID Container Architecture](../schema-templates/UUID_CONTAINER_ARCHITECTURE.md) | Canonical container, schema binding, event, and migration model |
| [UUID Container Implementation Plan](../schema-templates/UUID_CONTAINER_IMPLEMENTATION_PLAN.md) | Executable plan for schema runtime and file-authoring UI |
| [OpenUI OptionA Checklist](./OPENUI_OPTIONA_SPEC.md) | Canonical OpenUI checklist for immediate-render work |
| [OpenUI Harness README](../../tests/harness/README.md) | Reusable OpenUI SSE test helper reference |
| [SPEC.md](./SPEC.md) | Complete specification for The Loom execution engine |
| [ARCHITECT_SPEC.md](./ARCHITECT_SPEC.md) | Redesigned Architect mode as workflow template designer |
| [TDD_PLAN.md](./TDD_PLAN.md) | Test-driven development plan with test cases |
| [OLLAMA_SETTINGS_SPEC.md](./OLLAMA_SETTINGS_SPEC.md) | MythosForge Ollama settings window, discovery, and Rust backend contract |
| [OLLAMA_SETTINGS_TDD_PLAN.md](./OLLAMA_SETTINGS_TDD_PLAN.md) | TDD plan for the Ollama settings UI and Tauri/Rust bridge |

## Quick Start

### The Problem

Users often need to generate large amounts of related content:

- "Populate this region with 10 settlements"
- "Create a dungeon with 50 rooms"
- "Generate a faction network with 20 organizations"

Doing this manually with Lorekeeper is tedious and time-consuming.

### The Solution

The Loom + Architect combination:

```
User Intent → Architect designs template → The Loom executes autonomously
```

1. **User** describes what they want
2. **Architect** designs a workflow template
3. **The Loom** executes the template over hours without intervention
4. **User** reviews results when complete

### Example Flow

```
User: "I want to populate my new region with settlements"

Architect: "I'll design a 'Populate Region' workflow for you."
[WORKFLOW_TEMPLATE]
{
  "name": "populate_region",
  "steps": [
    {"mode": "scholar", "prompt": "Analyze region..."},
    {"mode": "lorekeeper", "prompt": "Generate settlements..."},
    {"mode": "lorekeeper", "prompt": "Generate NPCs..."},
    {"mode": "architect", "prompt": "Create relationships..."}
  ]
}
[/WORKFLOW_TEMPLATE]

User: "Run it"

The Loom: [Executes for 25 minutes autonomously]

The Loom: "Complete! Created 5 settlements, 23 NPCs, 47 relationships."
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         THE LOOM                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  Workflow   │    │   Step      │    │ Validation  │        │
│  │  Engine     │───▶│  Executor   │───▶│  Engine     │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                  │                  │                 │
│         ▼                  ▼                  ▼                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MODE ROUTER                          │   │
│  │   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │   │
│  │   │Architect│  │Lorekeeper│  │Scholar │  │Roleplayer│   │   │
│  │   └────────┘  └────────┘  └────────┘  └────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Workflow Template

A reusable definition of a multi-step operation:

- **Inputs**: What the user must provide (entity IDs, counts, options)
- **Steps**: Ordered operations with mode assignments and prompts
- **Validation Rules**: Quality checkpoints between steps
- **Outputs**: What the workflow produces (entities, relationships)

### Step Execution

Each step:
1. Renders the prompt template with current context
2. Invokes the assigned mode via existing chat API
3. Captures and parses the response
4. Stores outputs in workflow context
5. Runs validation rules

### Validation Engine

Quality control between steps:
- Check for required fields
- Validate entity counts
- Detect naming conflicts
- Auto-fix when possible

## Mode Responsibilities

| Mode | In The Loom Context |
|------|---------------------|
| **Architect** | Designs workflow templates, creates relationships |
| **Lorekeeper** | Generates entities (NPCs, locations, items) |
| **Scholar** | Analyzes, validates, searches existing lore |
| **Roleplayer** | Generates dialogue, character interactions |

## Implementation Phases

1. **Phase 1**: Template schema & parsing (Week 1)
2. **Phase 2**: Workflow engine core (Week 2)
3. **Phase 3**: Validation engine (Week 3)
4. **Phase 4-5**: Integration & performance (Week 4)

## API Preview

```http
POST /api/loom/execute
{
  "template_id": "wf_populate_region",
  "inputs": {
    "region_id": "abc-123",
    "settlement_count": 5
  }
}

Response:
{
  "execution_id": "exec-456",
  "status": "running",
  "estimated_duration_minutes": 25
}
```

```http
GET /api/loom/executions/exec-456

Response:
{
  "status": "running",
  "progress": {
    "current_step": "generate_npcs",
    "completed_steps": 3,
    "total_steps": 5,
    "percentage": 60
  }
}
```

## Integration Plans

| Document | Purpose |
|----------|---------|
| [PI_MONO_INTEGRATION.md](./PI_MONO_INTEGRATION.md) | Process management, health monitoring, logging |
| [OPENUi_INTEGRATION.md](./OPENUi_INTEGRATION.md) | AI-powered UI generation for dashboards and editors |
| [OLLAMA_SETTINGS_SPEC.md](./OLLAMA_SETTINGS_SPEC.md) | Local Ollama settings integration and model discovery |

## Related Resources

- [Main MythosForge Reference](../../MYTHFORGE_REFERENCE.md)
- [Category Templates](../../src/lib/types/templates.ts)
- [Schema Template Methods](../schema-templates/methods.md)
- [AI Chat Route](../../src/app/api/ai/chat/route.ts)
