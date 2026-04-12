# The Loom - Autonomous Agent Worker Specification

> **Status:** Draft
> **Version:** 0.1.0
> **Last Updated:** 2026-03-31
> **Author:** MythosForge Team

## Overview

The Loom is an autonomous agent worker that executes multi-step workflows over extended periods (hours) without user intervention. It orchestrates existing AI modes (Lorekeeper, Scholar, Roleplayer, Architect) to complete complex worldbuilding tasks.

## Core Concepts

### Architecture

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

### Key Components

| Component | Responsibility |
|-----------|----------------|
| **Workflow Engine** | Loads templates, manages execution state, handles persistence |
| **Step Executor** | Invokes modes with rendered prompts, captures outputs |
| **Validation Engine** | Runs validation rules between steps, handles failures |
| **Mode Router** | Routes requests to appropriate AI mode via existing chat API |

## Workflow Template Schema

### TypeScript Interface

```typescript
interface WorkflowTemplate {
  // Metadata
  id: string;                    // UUID
  name: string;                  // Human-readable name
  version: string;               // Semver (e.g., "1.0.0")
  description: string;           // What this workflow accomplishes
  author: string;                // "architect" | "user" | "system"
  created_at: number;
  updated_at: number;
  
  // Configuration
  inputs: WorkflowInput[];       // Required inputs from user
  outputs: WorkflowOutput[];     // What this workflow produces
  
  // Execution
  steps: WorkflowStep[];         // Ordered list of steps
  validation_rules: ValidationRule[];  // Quality checkpoints
  
  // Behavior
  timeout_minutes: number;       // Maximum execution time
  retry_policy: RetryPolicy;     // How to handle failures
  checkpoint_interval: number;   // Save state every N steps
}

interface WorkflowInput {
  name: string;                  // Variable name (e.g., "region_id")
  type: "string" | "number" | "boolean" | "entity_id" | "entity_array";
  required: boolean;
  default?: unknown;
  description: string;
  validation?: string;           // JSON Schema or regex
}

interface WorkflowOutput {
  name: string;
  type: "entity" | "entity_array" | "relationship_array" | "report";
  description: string;
}

interface WorkflowStep {
  id: string;                    // Unique step identifier
  name: string;                  // Human-readable step name
  
  // Execution
  mode: "architect" | "lorekeeper" | "scholar" | "roleplayer";
  prompt_template: string;       // Handlebars template
  depends_on: string[];          // Step IDs that must complete first
  
  // Flow Control
  condition?: string;            // JavaScript expression for conditional execution
  foreach?: string;              // Variable to iterate over
  max_retries: number;           // 0 = no retry
  
  // Output
  output_variable: string;       // Variable name to store result
  on_failure: "abort" | "skip" | "retry" | "ask_user";
}

interface ValidationRule {
  id: string;
  name: string;
  check: string;                 // JavaScript expression returning boolean
  severity: "error" | "warning" | "info";
  auto_fix_prompt?: string;      // Prompt to generate fix suggestion
  on_failure: "abort" | "warn" | "auto_fix";
}

interface RetryPolicy {
  max_attempts: number;
  backoff: "fixed" | "exponential";
  initial_delay_ms: number;
  max_delay_ms: number;
}
```

### Example Template: Populate Region

```yaml
id: "wf_populate_region_v1"
name: "Populate Region with Settlements"
version: "1.0.0"
description: "Given a Region entity, generate settlements, NPCs, and create relationships"
author: "architect"

inputs:
  - name: region_id
    type: entity_id
    required: true
    description: "UUID of the region to populate"
    validation: "^entity category must be 'Region'"
    
  - name: settlement_count
    type: number
    required: false
    default: 3
    description: "Number of settlements to generate"
    validation: "value >= 1 && value <= 20"
    
  - name: population_density
    type: string
    required: false
    default: "moderate"
    description: "Population density level"
    validation: "['sparse', 'moderate', 'dense'].includes(value)"

outputs:
  - name: settlements
    type: entity_array
    description: "Generated settlement entities"
    
  - name: npcs
    type: entity_array
    description: "Generated NPC entities"
    
  - name: relationships
    type: relationship_array
    description: "Created relationships"

steps:
  - id: analyze_region
    name: "Analyze Region Geography"
    mode: scholar
    prompt_template: |
      Analyze the region with ID {{region_id}} and provide:
      1. Biome type and climate characteristics
      2. Geographic features suitable for settlement
      3. Existing settlements (if any) and their locations
      4. Recommended locations for {{settlement_count}} new settlements
      
      Format your response as structured analysis.
    output_variable: region_analysis
    max_retries: 1
    on_failure: "abort"
    
  - id: generate_settlements
    name: "Generate Settlement Entities"
    mode: lorekeeper
    depends_on: ["analyze_region"]
    prompt_template: |
      Generate {{settlement_count}} settlements for the region.
      
      Region Analysis:
      {{region_analysis}}
      
      Population Density: {{population_density}}
      
      For each settlement, output a [DRAFT_ENTITY] block with:
      - Appropriate name for the biome/culture
      - Population scaled to {{population_density}} density
      - At least one notable landmark or feature
    output_variable: settlement_drafts
    max_retries: 2
    on_failure: "retry"
    
  - id: validate_settlements
    name: "Validate Settlement Drafts"
    mode: scholar
    depends_on: ["generate_settlements"]
    prompt_template: |
      Validate these settlement drafts:
      {{settlement_drafts}}
      
      Check for:
      - Population consistency (no negative or extreme values)
      - Naming conflicts (no duplicate names)
      - Geographic logic (settlements match biome type)
      
      Output [CONSISTENCY_ISSUES] if problems found.
    output_variable: validation_report
    max_retries: 0
    on_failure: "warn"
    
  - id: generate_npcs
    name: "Generate NPCs for Settlements"
    mode: lorekeeper
    depends_on: ["validate_settlements"]
    foreach: "settlement in settlements"
    prompt_template: |
      For the settlement "{{settlement.title}}", generate 3-5 key NPCs:
      
      - 1 leader/ruler (mayor, chieftain, elder)
      - 1 merchant/innkeeper (social hub)
      - 1-3 notable residents (with secrets or hooks)
      
      Output [DRAFT_ENTITY] blocks for each NPC.
    output_variable: npc_drafts
    max_retries: 2
    on_failure: "retry"
    
  - id: create_relationships
    name: "Create Entity Relationships"
    mode: architect
    depends_on: ["generate_settlements", "generate_npcs"]
    prompt_template: |
      Create relationship links for the generated entities.
      
      Settlements: {{settlement_drafts}}
      NPCs: {{npc_drafts}}
      
      Create relationships:
      - Each settlement → located_in → region {{region_id}}
      - Each NPC → located_in → their settlement
      - Leader NPCs → ruler_of → their settlement
      - Cross-settlement relationships where logical
      
      Output [RELATIONSHIP_SUGGESTIONS] blocks.
    output_variable: relationship_suggestions
    max_retries: 1
    on_failure: "warn"

validation_rules:
  - id: no_orphan_settlements
    name: "Settlements Must Link to Region"
    check: "settlements.every(s => s.relationships.some(r => r.target_id === inputs.region_id))"
    severity: error
    on_failure: auto_fix
    auto_fix_prompt: "Add located_in relationship for orphaned settlements"
    
  - id: npc_home_required
    name: "NPCs Must Have Home Settlement"
    check: "npcs.every(n => n.relationships.some(r => r.type === 'located_in'))"
    severity: error
    on_failure: abort

timeout_minutes: 60
retry_policy:
  max_attempts: 3
  backoff: exponential
  initial_delay_ms: 2000
  max_delay_ms: 30000

checkpoint_interval: 1  # Save after every step
```

## Execution Lifecycle

### State Machine

```
┌─────────┐
│  IDLE   │
└────┬────┘
     │ start_workflow(inputs)
     ▼
┌─────────┐
│ RUNNING │◄──────────────────────┐
└────┬────┘                       │
     │ step_complete              │
     ▼                            │
┌─────────┐                       │
│ VALIDATE│───pass────────────────┘
└────┬────┘
     │ fail (max retries)
     ▼
┌─────────┐
│ FAILED  │
└────┬────┘
     │ all_steps_complete
     ▼
┌─────────┐
│COMPLETE │
└─────────┘
```

### Execution State Persistence

```typescript
interface WorkflowExecution {
  id: string;                    // Execution UUID
  template_id: string;           // Template being executed
  status: "idle" | "running" | "paused" | "complete" | "failed";
  
  // Inputs/Outputs
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  
  // Progress
  current_step: string | null;
  completed_steps: string[];
  step_results: Record<string, StepResult>;
  
  // Timing
  started_at: number;
  updated_at: number;
  completed_at: number | null;
  
  // Error Handling
  errors: ExecutionError[];
  retry_count: number;
}

interface StepResult {
  step_id: string;
  status: "pending" | "running" | "complete" | "failed" | "skipped";
  mode: string;
  prompt_rendered: string;
  response_raw: string;
  parsed_outputs: Record<string, unknown>;
  started_at: number;
  completed_at: number | null;
  retry_count: number;
}

interface ExecutionError {
  step_id: string;
  message: string;
  timestamp: number;
  recoverable: boolean;
}
```

## API Endpoints

### Start Workflow

```http
POST /api/loom/execute
Content-Type: application/json

{
  "template_id": "wf_populate_region_v1",
  "inputs": {
    "region_id": "abc-123-def",
    "settlement_count": 5,
    "population_density": "moderate"
  }
}
```

Response:
```json
{
  "execution_id": "exec-456-ghi",
  "status": "running",
  "estimated_duration_minutes": 30
}
```

### Check Status

```http
GET /api/loom/executions/{execution_id}
```

Response:
```json
{
  "execution_id": "exec-456-ghi",
  "template_id": "wf_populate_region_v1",
  "status": "running",
  "progress": {
    "current_step": "generate_npcs",
    "completed_steps": ["analyze_region", "generate_settlements", "validate_settlements"],
    "total_steps": 5,
    "percentage": 60
  },
  "outputs_so_far": {
    "settlement_drafts": [...],
    "npc_drafts": [...]
  },
  "started_at": 1711920000000,
  "elapsed_minutes": 18
}
```

### Pause/Resume

```http
POST /api/loom/executions/{execution_id}/pause
POST /api/loom/executions/{execution_id}/resume
```

### Cancel

```http
POST /api/loom/executions/{execution_id}/cancel
```

## Template Management

### Storage

Templates are stored in the database with version history:

```sql
CREATE TABLE workflow_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  definition JSON NOT NULL,
  author TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE workflow_executions (
  id TEXT PRIMARY KEY,
  template_id TEXT REFERENCES workflow_templates(id),
  status TEXT NOT NULL,
  inputs JSON NOT NULL,
  outputs JSON,
  state JSON NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  FOREIGN KEY (template_id) REFERENCES workflow_templates(id)
);
```

### Template Discovery

Architect mode can suggest templates based on user intent:

```typescript
// In Architect mode
User: "I want to populate my new region with settlements"

Architect analyzes:
1. User has a Region entity selected
2. "Populate" + "settlements" matches populate_region template
3. Template requires region_id (available from context)

Architect responds:
"I can run the 'Populate Region' workflow for you.
This will generate 3-5 settlements with NPCs and relationships.
Estimated time: 20-30 minutes.

[WORKFLOW_SUGGESTION]
{
  "template_id": "wf_populate_region_v1",
  "inputs": {
    "region_id": "{{active_entity.id}}",
    "settlement_count": 4,
    "population_density": "moderate"
  }
}
[/WORKFLOW_SUGGESTION]

Would you like me to start this workflow?"
```

## Error Handling

### Failure Scenarios

| Scenario | Recovery Strategy |
|----------|-------------------|
| AI API timeout | Retry with exponential backoff |
| Validation failure | Auto-fix if rule allows, else ask user |
| Step dependency failed | Skip dependent steps or abort workflow |
| Rate limit hit | Pause execution, resume after cooldown |
| Invalid template | Abort immediately, report to user |

### User Notification

For long-running workflows, The Loom should:
1. Send browser notifications on completion
2. Log progress to a visible activity feed
3. Allow user to review intermediate results
4. Support rollback to checkpoint if needed

## Security Considerations

1. **Input Validation**: All inputs validated against schema before execution
2. **Template Sandboxing**: Templates cannot execute arbitrary code
3. **Rate Limiting**: Maximum concurrent executions per user
4. **Resource Limits**: Maximum entities created per workflow
5. **Audit Trail**: All executions logged with full context

## Future Enhancements

- [ ] Visual workflow builder UI
- [ ] Workflow scheduling (run at specific times)
- [ ] Parallel step execution
- [ ] Workflow composition (workflow calling workflow)
- [ ] Template marketplace/sharing
- [ ] Real-time progress streaming via WebSocket
