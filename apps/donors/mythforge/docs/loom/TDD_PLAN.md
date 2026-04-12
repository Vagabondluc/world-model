# The Loom & Architect - Test-Driven Development Plan

> **Status:** Draft
> **Version:** 0.1.0
> **Last Updated:** 2026-03-31
> **Related:** [The Loom SPEC](./SPEC.md) | [Architect SPEC](./ARCHITECT_SPEC.md)

## Overview

This document defines the test-driven development approach for implementing The Loom (autonomous agent worker) and the redesigned Architect mode (workflow template designer).

## Test Categories

```
📁 Tests
├── 📁 Unit Tests
│   ├── Template Parser Tests
│   ├── Workflow Engine Tests
│   ├── Validation Engine Tests
│   └── Mode Router Tests
├── 📁 Integration Tests
│   ├── End-to-End Workflow Execution
│   ├── Mode Integration Tests
│   └── Database Persistence Tests
├── 📁 Contract Tests
│   ├── Architect Output Block Contracts
│   ├── Loom API Contracts
│   └── Template Schema Contracts
└── 📁 Performance Tests
    ├── Long-Running Workflow Tests
    ├── Concurrent Execution Tests
    └── Memory Leak Tests
```

---

## Phase 1: Template Schema & Parsing

### 1.1 Template Schema Validation

**File:** `src/lib/loom/__tests__/template-schema.test.ts`

```typescript
describe('WorkflowTemplate Schema', () => {
  describe('valid templates', () => {
    it('accepts minimal valid template', () => {
      const template = {
        id: 'wf_test',
        name: 'Test Workflow',
        version: '1.0.0',
        steps: [],
        inputs: [],
        validation_rules: [],
      };
      expect(validateWorkflowTemplate(template)).toBeValid();
    });

    it('accepts full template with all fields', () => {
      const template = {
        id: 'wf_full',
        name: 'Full Workflow',
        version: '1.0.0',
        description: 'A complete template',
        author: 'architect',
        inputs: [
          { name: 'region_id', type: 'entity_id', required: true }
        ],
        outputs: [
          { name: 'settlements', type: 'entity_array' }
        ],
        steps: [
          {
            id: 'step1',
            mode: 'lorekeeper',
            prompt_template: 'Generate {{count}} items',
            output_variable: 'drafts',
            max_retries: 2,
          }
        ],
        validation_rules: [
          {
            id: 'rule1',
            check: 'drafts.length > 0',
            severity: 'error',
          }
        ],
        timeout_minutes: 60,
        retry_policy: {
          max_attempts: 3,
          backoff: 'exponential',
          initial_delay_ms: 1000,
          max_delay_ms: 30000,
        },
      };
      expect(validateWorkflowTemplate(template)).toBeValid();
    });
  });

  describe('invalid templates', () => {
    it('rejects template without id', () => {
      const template = { name: 'No ID', version: '1.0.0', steps: [] };
      expect(validateWorkflowTemplate(template)).toBeInvalidWith('id');
    });

    it('rejects template with invalid version format', () => {
      const template = { id: 'wf', version: 'invalid', steps: [] };
      expect(validateWorkflowTemplate(template)).toBeInvalidWith('version');
    });

    it('rejects step with invalid mode', () => {
      const template = {
        id: 'wf',
        version: '1.0.0',
        steps: [{ id: 's1', mode: 'invalid_mode', prompt_template: '' }],
      };
      expect(validateWorkflowTemplate(template)).toBeInvalidWith('mode');
    });

    it('rejects circular step dependencies', () => {
      const template = {
        id: 'wf',
        version: '1.0.0',
        steps: [
          { id: 'a', depends_on: ['b'] },
          { id: 'b', depends_on: ['a'] },
        ],
      };
      expect(validateWorkflowTemplate(template)).toBeInvalidWith('circular');
    });
  });
});
```

### 1.2 Architect Output Block Parsing

**File:** `src/app/api/ai/chat/__tests__/architect-parsers.test.ts`

```typescript
describe('Architect Output Block Parsers', () => {
  describe('parseWorkflowTemplate', () => {
    it('extracts single workflow template', () => {
      const content = `
        Here's a workflow for you:
        [WORKFLOW_TEMPLATE]
        {"id":"wf_test","name":"Test","version":"1.0.0","steps":[]}
        [/WORKFLOW_TEMPLATE]
      `;
      const result = parseWorkflowTemplates(content);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('wf_test');
    });

    it('extracts multiple workflow templates', () => {
      const content = `
        [WORKFLOW_TEMPLATE]
        {"id":"wf_one","name":"One","version":"1.0.0","steps":[]}
        [/WORKFLOW_TEMPLATE]
        [WORKFLOW_TEMPLATE]
        {"id":"wf_two","name":"Two","version":"1.0.0","steps":[]}
        [/WORKFLOW_TEMPLATE]
      `;
      const result = parseWorkflowTemplates(content);
      expect(result).toHaveLength(2);
    });

    it('handles malformed JSON gracefully', () => {
      const content = `
        [WORKFLOW_TEMPLATE]
        {invalid json}
        [/WORKFLOW_TEMPLATE]
      `;
      const result = parseWorkflowTemplates(content);
      expect(result).toHaveLength(0);
    });

    it('preserves template structure with nested objects', () => {
      const content = `
        [WORKFLOW_TEMPLATE]
        {
          "id": "wf_nested",
          "steps": [
            {"id": "s1", "prompt_template": "Hello {{name}}"}
          ]
        }
        [/WORKFLOW_TEMPLATE]
      `;
      const result = parseWorkflowTemplates(content);
      expect(result[0].steps[0].prompt_template).toBe('Hello {{name}}');
    });
  });

  describe('parseWorkflowStep', () => {
    it('extracts step addition', () => {
      const content = `
        [WORKFLOW_STEP]
        {"workflow_id":"wf_test","action":"add","step":{"id":"new_step"}}
        [/WORKFLOW_STEP]
      `;
      const result = parseWorkflowSteps(content);
      expect(result[0].action).toBe('add');
    });

    it('extracts step modification', () => {
      const content = `
        [WORKFLOW_STEP]
        {"workflow_id":"wf_test","action":"modify","step":{"id":"s1","max_retries":5}}
        [/WORKFLOW_STEP]
      `;
      const result = parseWorkflowSteps(content);
      expect(result[0].action).toBe('modify');
      expect(result[0].step.max_retries).toBe(5);
    });

    it('extracts step removal', () => {
      const content = `
        [WORKFLOW_STEP]
        {"workflow_id":"wf_test","action":"remove","step":{"id":"old_step"}}
        [/WORKFLOW_STEP]
      `;
      const result = parseWorkflowSteps(content);
      expect(result[0].action).toBe('remove');
    });
  });

  describe('parseValidationRule', () => {
    it('extracts validation rule with auto-fix', () => {
      const content = `
        [VALIDATION_RULE]
        {
          "workflow_id": "wf_test",
          "rule": {
            "id": "check_pop",
            "check": "entities.every(e => e.population > 0)",
            "severity": "error",
            "on_failure": "auto_fix",
            "auto_fix_prompt": "Set population to 1"
          }
        }
        [/VALIDATION_RULE]
      `;
      const result = parseValidationRules(content);
      expect(result[0].rule.on_failure).toBe('auto_fix');
      expect(result[0].rule.auto_fix_prompt).toBeDefined();
    });
  });

  describe('parseTemplateSuggestion', () => {
    it('extracts suggestion with confidence score', () => {
      const content = `
        [TEMPLATE_SUGGESTION]
        {
          "template_id": "wf_populate_region",
          "confidence": 0.92,
          "reasoning": "User wants settlements",
          "suggested_inputs": {"region_id": "abc-123"}
        }
        [/TEMPLATE_SUGGESTION]
      `;
      const result = parseTemplateSuggestions(content);
      expect(result[0].confidence).toBe(0.92);
    });
  });
});
```

---

## Phase 2: Workflow Engine

### 2.1 Step Execution

**File:** `src/lib/loom/__tests__/step-executor.test.ts`

```typescript
describe('StepExecutor', () => {
  let executor: StepExecutor;
  let mockModeRouter: jest.Mocked<ModeRouter>;

  beforeEach(() => {
    mockModeRouter = {
      execute: jest.fn(),
    };
    executor = new StepExecutor(mockModeRouter);
  });

  describe('executeStep', () => {
    it('executes step with correct mode', async () => {
      const step: WorkflowStep = {
        id: 'test_step',
        mode: 'lorekeeper',
        prompt_template: 'Generate an NPC',
        output_variable: 'npc_draft',
      };
      const context = { inputs: {}, stepResults: {} };

      mockModeRouter.execute.mockResolvedValue({
        content: '[DRAFT_ENTITY]{"title":"Test NPC"}[/DRAFT_ENTITY]',
      });

      const result = await executor.executeStep(step, context);

      expect(mockModeRouter.execute).toHaveBeenCalledWith(
        'lorekeeper',
        expect.stringContaining('Generate an NPC')
      );
      expect(result.status).toBe('complete');
    });

    it('renders template variables in prompt', async () => {
      const step: WorkflowStep = {
        id: 'test_step',
        mode: 'lorekeeper',
        prompt_template: 'Generate {{count}} NPCs for {{region_name}}',
        output_variable: 'drafts',
      };
      const context = {
        inputs: { count: 5, region_name: 'Darkwood' },
        stepResults: {},
      };

      await executor.executeStep(step, context);

      expect(mockModeRouter.execute).toHaveBeenCalledWith(
        'lorekeeper',
        expect.stringContaining('Generate 5 NPCs for Darkwood')
      );
    });

    it('renders step results from previous steps', async () => {
      const step: WorkflowStep = {
        id: 'step2',
        mode: 'scholar',
        prompt_template: 'Validate: {{step1_output}}',
        output_variable: 'validation',
        depends_on: ['step1'],
      };
      const context = {
        inputs: {},
        stepResults: {
          step1: { output: 'Some generated content' },
        },
      };

      await executor.executeStep(step, context);

      expect(mockModeRouter.execute).toHaveBeenCalledWith(
        'scholar',
        expect.stringContaining('Some generated content')
      );
    });

    it('handles foreach iteration', async () => {
      const step: WorkflowStep = {
        id: 'foreach_step',
        mode: 'lorekeeper',
        prompt_template: 'Generate NPC for {{settlement.name}}',
        output_variable: 'npcs',
        foreach: 'settlement in settlements',
      };
      const context = {
        inputs: {},
        stepResults: {
          generate_settlements: {
            output: [
              { name: 'Town A', id: '1' },
              { name: 'Town B', id: '2' },
            ],
          },
        },
      };

      mockModeRouter.execute.mockResolvedValue({
        content: '[DRAFT_ENTITY]{"title":"NPC"}[/DRAFT_ENTITY]',
      });

      const result = await executor.executeStep(step, context);

      expect(mockModeRouter.execute).toHaveBeenCalledTimes(2);
      expect(result.output).toHaveLength(2);
    });

    it('respects max_retries on failure', async () => {
      const step: WorkflowStep = {
        id: 'retry_step',
        mode: 'lorekeeper',
        prompt_template: 'Generate',
        output_variable: 'draft',
        max_retries: 2,
      };

      mockModeRouter.execute
        .mockRejectedValueOnce(new Error('API Error'))
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValue({ content: 'Success' });

      const result = await executor.executeStep(step, { inputs: {}, stepResults: {} });

      expect(mockModeRouter.execute).toHaveBeenCalledTimes(3);
      expect(result.status).toBe('complete');
    });

    it('fails after max_retries exceeded', async () => {
      const step: WorkflowStep = {
        id: 'fail_step',
        mode: 'lorekeeper',
        prompt_template: 'Generate',
        output_variable: 'draft',
        max_retries: 2,
      };

      mockModeRouter.execute.mockRejectedValue(new Error('API Error'));

      const result = await executor.executeStep(step, { inputs: {}, stepResults: {} });

      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
    });
  });
});
```

### 2.2 Workflow Orchestration

**File:** `src/lib/loom/__tests__/workflow-engine.test.ts`

```typescript
describe('WorkflowEngine', () => {
  let engine: WorkflowEngine;
  let mockTemplateStore: jest.Mocked<TemplateStore>;
  let mockStepExecutor: jest.Mocked<StepExecutor>;
  let mockValidationEngine: jest.Mocked<ValidationEngine>;

  beforeEach(() => {
    mockTemplateStore = { get: jest.fn(), save: jest.fn() };
    mockStepExecutor = { executeStep: jest.fn() };
    mockValidationEngine = { validate: jest.fn() };
    engine = new WorkflowEngine(mockTemplateStore, mockStepExecutor, mockValidationEngine);
  });

  describe('startWorkflow', () => {
    it('validates inputs before starting', async () => {
      const template: WorkflowTemplate = {
        id: 'wf_test',
        inputs: [{ name: 'region_id', type: 'entity_id', required: true }],
        steps: [],
      };

      mockTemplateStore.get.mockResolvedValue(template);

      await expect(
        engine.startWorkflow('wf_test', {})
      ).rejects.toThrow('Missing required input: region_id');
    });

    it('creates execution record', async () => {
      const template: WorkflowTemplate = {
        id: 'wf_test',
        inputs: [],
        steps: [],
      };

      mockTemplateStore.get.mockResolvedValue(template);

      const execution = await engine.startWorkflow('wf_test', {});

      expect(execution.id).toBeDefined();
      expect(execution.status).toBe('running');
      expect(execution.template_id).toBe('wf_test');
    });

    it('executes steps in dependency order', async () => {
      const template: WorkflowTemplate = {
        id: 'wf_test',
        inputs: [],
        steps: [
          { id: 'c', depends_on: ['a', 'b'] },
          { id: 'a', depends_on: [] },
          { id: 'b', depends_on: ['a'] },
        ],
      };

      mockTemplateStore.get.mockResolvedValue(template);
      mockStepExecutor.executeStep.mockResolvedValue({
        status: 'complete',
        output: {},
      });
      mockValidationEngine.validate.mockResolvedValue({ valid: true });

      const execution = await engine.startWorkflow('wf_test', {});

      // Verify execution order: a -> b -> c
      const callOrder = mockStepExecutor.executeStep.mock.calls.map(c => c[0].id);
      expect(callOrder).toEqual(['a', 'b', 'c']);
    });
  });

  describe('pauseWorkflow', () => {
    it('pauses execution between steps', async () => {
      const template: WorkflowTemplate = {
        id: 'wf_test',
        inputs: [],
        steps: [
          { id: 'step1' },
          { id: 'step2' },
        ],
      };

      mockTemplateStore.get.mockResolvedValue(template);
      mockStepExecutor.executeStep.mockImplementation(async (step) => {
        if (step.id === 'step1') {
          // Pause after first step
          await engine.pauseWorkflow(execution.id);
        }
        return { status: 'complete', output: {} };
      });

      const execution = await engine.startWorkflow('wf_test', {});

      expect(execution.status).toBe('paused');
      expect(execution.completed_steps).toContain('step1');
      expect(execution.completed_steps).not.toContain('step2');
    });
  });

  describe('resumeWorkflow', () => {
    it('continues from last completed step', async () => {
      const pausedExecution: WorkflowExecution = {
        id: 'exec_paused',
        template_id: 'wf_test',
        status: 'paused',
        inputs: {},
        outputs: {},
        current_step: null,
        completed_steps: ['step1'],
        step_results: { step1: { output: 'done' } },
        started_at: Date.now(),
        updated_at: Date.now(),
        completed_at: null,
        errors: [],
        retry_count: 0,
      };

      // Resume and verify step2 executes
    });
  });

  describe('checkpoint persistence', () => {
    it('saves state after each step when checkpoint_interval is 1', async () => {
      const template: WorkflowTemplate = {
        id: 'wf_test',
        inputs: [],
        steps: [{ id: 'step1' }, { id: 'step2' }],
        checkpoint_interval: 1,
      };

      mockTemplateStore.get.mockResolvedValue(template);
      mockStepExecutor.executeStep.mockResolvedValue({ status: 'complete', output: {} });
      mockValidationEngine.validate.mockResolvedValue({ valid: true });

      await engine.startWorkflow('wf_test', {});

      expect(mockTemplateStore.saveExecution).toHaveBeenCalledTimes(2);
    });
  });
});
```

---

## Phase 3: Validation Engine

### 3.1 Rule Evaluation

**File:** `src/lib/loom/__tests__/validation-engine.test.ts`

```typescript
describe('ValidationEngine', () => {
  let engine: ValidationEngine;

  beforeEach(() => {
    engine = new ValidationEngine();
  });

  describe('validate', () => {
    it('evaluates simple check expression', async () => {
      const rule: ValidationRule = {
        id: 'check_count',
        check: 'entities.length > 0',
        severity: 'error',
      };
      const context = {
        entities: [{ id: '1', title: 'Test' }],
      };

      const result = await engine.validate([rule], context);

      expect(result.valid).toBe(true);
    });

    it('fails when check returns false', async () => {
      const rule: ValidationRule = {
        id: 'check_population',
        check: 'entity.population > 100',
        severity: 'error',
      };
      const context = {
        entity: { population: 50 },
      };

      const result = await engine.validate([rule], context);

      expect(result.valid).toBe(false);
      expect(result.failures[0].rule_id).toBe('check_population');
    });

    it('handles warnings without failing workflow', async () => {
      const rules: ValidationRule[] = [
        { id: 'error_rule', check: 'true', severity: 'error' },
        { id: 'warning_rule', check: 'false', severity: 'warning' },
      ];
      const context = {};

      const result = await engine.validate(rules, context);

      expect(result.valid).toBe(true); // Warnings don't fail
      expect(result.warnings).toHaveLength(1);
    });

    it('provides auto-fix suggestions when available', async () => {
      const rule: ValidationRule = {
        id: 'auto_fixable',
        check: 'entity.name.length > 3',
        severity: 'error',
        on_failure: 'auto_fix',
        auto_fix_prompt: 'Extend the name to be at least 4 characters',
      };
      const context = {
        entity: { name: 'Bob' },
      };

      const result = await engine.validate([rule], context);

      expect(result.failures[0].auto_fix_prompt).toBeDefined();
    });
  });

  describe('sandboxed evaluation', () => {
    it('prevents access to global objects', async () => {
      const rule: ValidationRule = {
        id: 'malicious',
        check: 'require("fs").readFileSync("/etc/passwd")',
        severity: 'error',
      };

      await expect(
        engine.validate([rule], {})
      ).rejects.toThrow();
    });

    it('limits execution time', async () => {
      const rule: ValidationRule = {
        id: 'infinite_loop',
        check: 'while(true) {}',
        severity: 'error',
      };

      await expect(
        engine.validate([rule], {}, { timeout: 100 })
      ).rejects.toThrow('timeout');
    });
  });
});
```

---

## Phase 4: Integration Tests

### 4.1 End-to-End Workflow

**File:** `src/lib/loom/__tests__/integration/workflow-e2e.test.ts`

```typescript
describe('Workflow E2E', () => {
  it('executes populate_region workflow end-to-end', async () => {
    // This test uses real AI calls (mocked at the HTTP level)

    const template = await loadTemplate('wf_populate_region');
    const inputs = {
      region_id: 'test-region-uuid',
      settlement_count: 2,
      population_density: 'sparse',
    };

    const execution = await loomEngine.startWorkflow(template.id, inputs);

    // Wait for completion (with timeout)
    await waitForCompletion(execution.id, { timeout: 60000 });

    const result = await loomEngine.getExecution(execution.id);

    expect(result.status).toBe('complete');
    expect(result.outputs.settlements).toHaveLength(2);
    expect(result.outputs.npcs.length).toBeGreaterThan(0);
    expect(result.outputs.relationships.length).toBeGreaterThan(0);
  });

  it('handles validation failure with auto-fix', async () => {
    // Setup workflow that will fail validation
    // Verify auto-fix is attempted
    // Verify workflow completes after fix
  });

  it('persists state across server restart', async () => {
    // Start workflow
    // Pause after step 1
    // Simulate server restart (clear in-memory state)
    // Resume workflow
    // Verify it continues from checkpoint
  });
});
```

### 4.2 Mode Router Integration

**File:** `src/lib/loom/__tests__/integration/mode-router.test.ts`

```typescript
describe('ModeRouter Integration', () => {
  it('routes to Lorekeeper and parses DRAFT_ENTITY blocks', async () => {
    const router = new ModeRouter(chatApi);
    const response = await router.execute('lorekeeper', 'Generate an NPC');

    expect(response.parsed_blocks).toContainEqual(
      expect.objectContaining({ type: 'draft_card' })
    );
  });

  it('routes to Scholar and parses CONSISTENCY_ISSUES blocks', async () => {
    const router = new ModeRouter(chatApi);
    const response = await router.execute('scholar', 'Check consistency');

    expect(response.parsed_blocks).toContainEqual(
      expect.objectContaining({ type: 'consistency_issue' })
    );
  });

  it('routes to Architect and parses WORKFLOW_TEMPLATE blocks', async () => {
    const router = new ModeRouter(chatApi);
    const response = await router.execute('architect', 'Design a workflow');

    expect(response.parsed_blocks).toContainEqual(
      expect.objectContaining({ type: 'workflow_template' })
    );
  });
});
```

---

## Phase 5: Performance Tests

### 5.1 Long-Running Workflow

**File:** `src/lib/loom/__tests__/performance/long-running.test.ts`

```typescript
describe('Long-Running Workflow Performance', () => {
  it('completes 100-step workflow within memory limits', async () => {
    const template = generateLargeWorkflow(100); // 100 steps
    const memoryBefore = process.memoryUsage().heapUsed;

    await loomEngine.startWorkflow(template.id, {});

    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryIncrease = memoryAfter - memoryBefore;

    // Should not use more than 100MB for 100 steps
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
  });

  it('checkpoints do not degrade performance', async () => {
    const templateNoCheckpoint = { ...template, checkpoint_interval: 0 };
    const templateEveryStep = { ...template, checkpoint_interval: 1 };

    const timeNoCheckpoint = await measureExecutionTime(templateNoCheckpoint);
    const timeEveryStep = await measureExecutionTime(templateEveryStep);

    // Checkpointing should add less than 20% overhead
    expect(timeEveryStep).toBeLessThan(timeNoCheckpoint * 1.2);
  });
});
```

### 5.2 Concurrent Executions

**File:** `src/lib/loom/__tests__/performance/concurrent.test.ts`

```typescript
describe('Concurrent Workflow Executions', () => {
  it('handles 10 concurrent workflows', async () => {
    const promises = Array(10).fill(null).map((_, i) =>
      loomEngine.startWorkflow('wf_simple', { index: i })
    );

    const results = await Promise.all(promises);

    expect(results.every(r => r.status === 'complete')).toBe(true);
  });

  it('isolates failures between workflows', async () => {
    // Start 5 workflows, one will fail
    // Verify other 4 complete successfully
  });
});
```

---

## Test Data Fixtures

### Minimal Template

**File:** `src/lib/loom/__tests__/fixtures/minimal-template.json`

```json
{
  "id": "wf_minimal",
  "name": "Minimal Test Workflow",
  "version": "1.0.0",
  "inputs": [],
  "steps": [
    {
      "id": "echo",
      "mode": "scholar",
      "prompt_template": "Echo back: {{input}}",
      "output_variable": "echo_result"
    }
  ],
  "validation_rules": []
}
```

### Complex Template

**File:** `src/lib/loom/__tests__/fixtures/populate-region-template.json`

```json
{
  "id": "wf_populate_region_test",
  "name": "Populate Region (Test)",
  "version": "1.0.0",
  "inputs": [
    { "name": "region_id", "type": "entity_id", "required": true },
    { "name": "settlement_count", "type": "number", "default": 2 }
  ],
  "steps": [
    {
      "id": "analyze",
      "mode": "scholar",
      "prompt_template": "Analyze region {{region_id}}",
      "output_variable": "analysis"
    },
    {
      "id": "generate",
      "mode": "lorekeeper",
      "prompt_template": "Generate {{settlement_count}} settlements based on: {{analysis}}",
      "output_variable": "settlements",
      "depends_on": ["analyze"]
    }
  ],
  "validation_rules": [
    {
      "id": "has_settlements",
      "check": "settlements.length >= settlement_count",
      "severity": "error"
    }
  ]
}
```

---

## Implementation Order

1. **Week 1:** Phase 1 (Schema & Parsing)
   - Template schema validation
   - Architect output block parsers
   - Template storage

2. **Week 2:** Phase 2 (Workflow Engine)
   - Step executor
   - Workflow orchestrator
   - State persistence

3. **Week 3:** Phase 3 (Validation Engine)
   - Rule evaluation
   - Auto-fix suggestions
   - Sandboxed execution

4. **Week 4:** Phase 4 & 5 (Integration & Performance)
   - E2E tests
   - Performance benchmarks
   - Documentation

---

## CI/CD Integration

```yaml
# .github/workflows/loom-tests.yml
name: Loom Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:loom:unit
      - run: npm run test:loom:integration
        env:
          AI_API_KEY: ${{ secrets.AI_API_KEY }}
      - run: npm run test:loom:performance
```
