# Pi-Mono Integration Plan

> **Status:** Draft
> **Version:** 0.1.0
> **Last Updated:** 2026-03-31
> **Repository:** https://github.com/badlogic/pi-mono

## Overview

[pi-mono](https://github.com/badlogic/pi-mono) is a monorepo containing tools for building AI agents. The key packages relevant to The Loom are:

| Package | Description | Use Case for The Loom |
|---------|-------------|----------------------|
| **@mariozechner/pi-ai** | Unified multi-provider LLM API | Replace current AI SDK with unified provider support |
| **@mariozechner/pi-agent-core** | Stateful agent with tool execution and event streaming | Core engine for The Loom's workflow execution |
| **@mariozechner/pi-web-ui** | Web components for AI chat interfaces | UI components for Architect chat interface |
| **@mariozechner/pi-tui** | Terminal UI library with differential rendering | CLI interface for The Loom debugging |

## Why Pi-Mono?

| Feature | Benefit for The Loom |
|---------|---------------------|
| **Unified LLM API** | Single API for OpenAI, Anthropic, Google, etc. - easy provider switching |
| **Tool Execution** | Built-in tool calling with before/after hooks for validation |
| **Event Streaming** | Real-time progress updates for long-running workflows |
| **State Management** | Persistent agent state across workflow steps |
| **Message Transformation** | Convert between LLM formats and app-specific message types |

## Architecture Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                         PI-MONO                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   pi-ai     │    │ pi-agent    │    │  pi-web-ui  │        │
│  │ (LLM API)   │    │ (runtime)   │    │ (React UI)  │        │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘        │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         THE LOOM                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  Workflow   │    │   Step      │    │ Validation  │        │
│  │  Engine     │    │  Executor   │    │  Engine     │        │
│  │ (pi-agent)  │    │ (pi-ai)     │    │ (tools)     │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Integration Points

### 1. Replace AI SDK with pi-ai

**Current Implementation:**
```typescript
// src/lib/ai.ts (current)
import { createAnthropic } from '@ai-sdk/anthropic';
const zai = createAnthropic({ apiKey: process.env.AI_API_KEY });
```

**With pi-ai:**
```typescript
// src/lib/ai.ts (with pi-ai)
import { getModel, setDefaultProvider } from '@mariozechner/pi-ai';

// Configure default provider
setDefaultProvider('anthropic');

// Get model instance (supports: openai, anthropic, google, etc.)
export const getModelForMode = (mode: string) => {
  return getModel('anthropic', 'claude-sonnet-4-20250514');
};
```

**Benefits:**
- Provider switching (change provider name only)
- Consistent API across all LLM providers
- Built-in retry logic and error handling

### 1a. Ollama Configuration (Local LLM)

pi-ai supports Ollama through the OpenAI-compatible API interface. This enables fully local workflow execution without cloud API costs.

**Setup Ollama Provider:**
```typescript
// src/lib/ai.ts (with Ollama)
import { getModel, setDefaultProvider, setOpenAiCompatSettings } from '@mariozechner/pi-ai';

// Configure Ollama as OpenAI-compatible provider
setOpenAiCompatSettings('ollama', {
 baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
 apiKey: 'ollama', // Ollama doesn't require a real API key
});

// Use Ollama model
export const getOllamaModel = (modelName: string = 'llama3.2') => {
 return getModel('ollama', modelName);
};

// Available Ollama models (must be pulled first)
// ollama pull llama3.2
// ollama pull mistral
// ollama pull codellama
```

**Environment Variables:**
```bash
# .env.local
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.2
```

**Ollama-Specific Agent Configuration:**
```typescript
// src/lib/loom/loom-agent-ollama.ts

import { Agent } from '@mariozechner/pi-agent-core';
import { getModel, setOpenAiCompatSettings } from '@mariozechner/pi-ai';

// Configure Ollama
setOpenAiCompatSettings('ollama', {
 baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
 apiKey: 'ollama',
});

// Create agent with Ollama model
export const createOllamaLoomAgent = (modelName: string = 'llama3.2') => {
 return new Agent({
   initialState: {
     systemPrompt: getLoomSystemPrompt(),
     model: getModel('ollama', modelName),
     thinkingLevel: 'off', // Ollama models don't support thinking
     tools: getLoomTools(),
   },
 });
};
```

**Hybrid Cloud/Local Setup:**
```typescript
// Use cloud for complex tasks, Ollama for simple ones
export const getModelForTask = (complexity: 'simple' | 'complex') => {
 if (complexity === 'simple') {
   // Use Ollama for simple tasks (entity lookups, basic generation)
   return getModel('ollama', 'llama3.2');
 } else {
   // Use cloud for complex tasks (workflow design, validation)
   return getModel('anthropic', 'claude-sonnet-4-20250514');
 }
};
```

**Ollama Model Recommendations for The Loom:**

| Task | Recommended Model | Reason |
|------|------------------|--------|
| Entity generation | `llama3.2` | Good balance of speed and quality |
| Relationship suggestions | `mistral` | Better reasoning for connections |
| Validation | `llama3.2` | Fast for structured checks |
| Template design | `claude-sonnet` (cloud) | Complex reasoning required |

### 2. Use pi-agent-core for Workflow Execution

**The Loom as an Agent:**
```typescript
// src/lib/loom/loom-agent.ts

import { Agent, AgentTool } from '@mariozechner/pi-agent-core';
import { getModel } from '@mariozechner/pi-ai';

// Define tools for each mode
const lorekeeperTool: AgentTool = {
  name: 'lorekeeper_generate',
  description: 'Generate entity content using Lorekeeper mode',
  parameters: z.object({
    prompt: z.string(),
    category: z.string(),
  }),
  execute: async ({ prompt, category }, context) => {
    // Call Lorekeeper mode
    const result = await executeLorekeeper(prompt, category);
    return { content: result };
  },
};

const scholarTool: AgentTool = {
  name: 'scholar_analyze',
  description: 'Analyze and validate content using Scholar mode',
  parameters: z.object({
    target: z.string(),
    checkType: z.enum(['consistency', 'completeness', 'relationships']),
  }),
  execute: async ({ target, checkType }, context) => {
    const result = await executeScholar(target, checkType);
    return { analysis: result };
  },
};

// Create The Loom agent
export class LoomAgent {
  private agent: Agent;
  
  constructor(template: WorkflowTemplate) {
    this.agent = new Agent({
      initialState: {
        systemPrompt: this.buildSystemPrompt(template),
        model: getModel('anthropic', 'claude-sonnet-4-20250514'),
        tools: [lorekeeperTool, scholarTool, architectTool],
        thinkingLevel: 'medium',
      },
      
      // Transform context to keep it manageable
      transformContext: async (messages, signal) => {
        // Keep last N messages, summarize older ones
        return this.compactContext(messages);
      },
      
      // Tool execution hooks for validation
      beforeToolCall: async ({ toolCall, args, context }) => {
        // Validate tool inputs before execution
        if (!this.validateToolArgs(toolCall.name, args)) {
          return { block: true, reason: 'Invalid arguments' };
        }
        return undefined;
      },
      
      afterToolCall: async ({ toolCall, result, isError, context }) => {
        // Log tool execution for workflow history
        this.logToolExecution(toolCall, result, isError);
        return result;
      },
    });
    
    // Subscribe to events for UI updates
    this.agent.subscribe((event) => {
      this.handleAgentEvent(event);
    });
  }
  
  async execute(inputs: Record<string, unknown>): Promise<WorkflowResult> {
    const prompt = this.buildPromptFromInputs(inputs);
    await this.agent.prompt(prompt);
    return this.extractResults();
  }
  
  private handleAgentEvent(event: AgentEvent) {
    switch (event.type) {
      case 'tool_execution_start':
        this.emitProgress({
          step: event.toolName,
          status: 'running',
          args: event.args,
        });
        break;
        
      case 'tool_execution_end':
        this.emitProgress({
          step: event.toolName,
          status: 'complete',
          result: event.result,
        });
        break;
        
      case 'message_update':
        // Stream text updates to UI
        this.emitTextDelta(event.assistantMessageEvent.delta);
        break;
    }
  }
}
```

### 3. Event Streaming for Real-time Updates

**Workflow Progress via Agent Events:**
```typescript
// src/lib/loom/event-emitter.ts

import type { AgentEvent } from '@mariozechner/pi-agent-core';

export interface WorkflowProgressEvent {
  type: 'step_start' | 'step_progress' | 'step_complete' | 'step_failed';
  workflowId: string;
  stepId: string;
  timestamp: number;
  data?: unknown;
}

export class WorkflowEventEmitter {
  private listeners = new Set<(event: WorkflowProgressEvent) => void>();
  
  subscribe(listener: (event: WorkflowProgressEvent) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  emit(event: WorkflowProgressEvent) {
    this.listeners.forEach(listener => listener(event));
  }
  
  // Bridge pi-agent events to workflow progress events
  bridgeAgentEvents(agent: Agent, workflowId: string) {
    agent.subscribe((agentEvent: AgentEvent) => {
      const progressEvent = this.mapAgentEventToProgress(agentEvent, workflowId);
      if (progressEvent) {
        this.emit(progressEvent);
      }
    });
  }
  
  private mapAgentEventToProgress(
    agentEvent: AgentEvent,
    workflowId: string
  ): WorkflowProgressEvent | null {
    switch (agentEvent.type) {
      case 'tool_execution_start':
        return {
          type: 'step_start',
          workflowId,
          stepId: agentEvent.toolCallId,
          timestamp: Date.now(),
          data: { tool: agentEvent.toolName, args: agentEvent.args },
        };
        
      case 'tool_execution_end':
        return {
          type: agentEvent.isError ? 'step_failed' : 'step_complete',
          workflowId,
          stepId: agentEvent.toolCallId,
          timestamp: Date.now(),
          data: { result: agentEvent.result },
        };
        
      default:
        return null;
    }
  }
}
```

### 4. pi-web-ui for Chat Interface

**Replace Custom Chat Components:**
```typescript
// src/components/mythosforge/ai/LoomChat.tsx

import { ChatLayout, MessageList, ChatInput } from '@mariozechner/pi-web-ui';

export function LoomChat({ workflowId }: { workflowId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  return (
    <ChatLayout>
      <MessageList
        messages={messages}
        isStreaming={isStreaming}
        renderMessage={(msg) => (
          <WorkflowMessage key={msg.id} message={msg} />
        )}
      />
      <ChatInput
        onSubmit={async (text) => {
          setIsStreaming(true);
          // Stream response from The Loom
          await streamLoomResponse(workflowId, text, (delta) => {
            setMessages(prev => appendDelta(prev, delta));
          });
          setIsStreaming(false);
        }}
        disabled={isStreaming}
        placeholder="Describe what you want The Loom to do..."
      />
    </ChatLayout>
  );
}
```

## Installation

```bash
# Install pi-mono packages
npm install @mariozechner/pi-ai @mariozechner/pi-agent-core @mariozechner/pi-web-ui
```

## Configuration

```typescript
// src/lib/pi-config.ts

import { setDefaultProvider, setApiKey } from '@mariozechner/pi-ai';

// Configure providers
setApiKey('anthropic', process.env.ANTHROPIC_API_KEY);
setApiKey('openai', process.env.OPENAI_API_KEY);
setDefaultProvider('anthropic');

// Provider-specific settings
export const PROVIDER_CONFIG = {
  anthropic: {
    defaultModel: 'claude-sonnet-4-20250514',
    thinkingLevel: 'medium',
  },
  openai: {
    defaultModel: 'gpt-4-turbo',
  },
};
```

## Migration Plan

### Phase 1: Replace AI SDK (Week 1)

- [ ] Install pi-ai package
- [ ] Create pi-config.ts with provider settings
- [ ] Replace `getZAI()` with `getModel()`
- [ ] Test all existing modes work with pi-ai
- [ ] Update environment variables

### Phase 2: Implement LoomAgent (Week 2)

- [ ] Install pi-agent-core package
- [ ] Define mode tools (lorekeeper, scholar, architect, roleplayer)
- [ ] Create LoomAgent class with tool orchestration
- [ ] Implement event bridging for progress updates
- [ ] Test single-step workflows

### Phase 3: Event Streaming (Week 3)

- [ ] Create WorkflowEventEmitter
- [ ] Add WebSocket support for real-time updates
- [ ] Build progress UI components
- [ ] Test multi-step workflow execution

### Phase 4: UI Integration (Week 4)

- [ ] Install pi-web-ui package
- [ ] Replace custom chat components
- [ ] Style integration with MythosForge theme
- [ ] Test end-to-end workflow execution

## API Reference

### Agent Events (from pi-agent-core)

| Event | Description | Loom Usage |
|-------|-------------|------------|
| `agent_start` | Agent begins processing | Start workflow |
| `turn_start` | New turn begins | Begin step |
| `message_start` | Message begins | Log step start |
| `message_update` | Streaming chunk | Real-time text display |
| `message_end` | Message completes | Log step complete |
| `tool_execution_start` | Tool begins | Step execution start |
| `tool_execution_end` | Tool completes | Step execution end |
| `turn_end` | Turn completes | Step finished |
| `agent_end` | Agent finishes | Workflow complete |

### Tool Definition

```typescript
interface AgentTool<T extends z.ZodType> {
  name: string;
  description: string;
  parameters: T;
  execute: (args: z.infer<T>, context: ToolContext) => Promise<ToolResult>;
}
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Provider not found | Check `setDefaultProvider()` is called |
| API key not set | Verify environment variable matches provider |
| Tool execution blocked | Check `beforeToolCall` hook return value |
| Context too large | Implement `transformContext` to compact messages |

### Debug Commands

```bash
# Test pi-ai connection
npx ts-node -e "import { getModel } from '@mariozechner/pi-ai'; console.log(getModel('anthropic', 'claude-sonnet-4-20250514'));"

# Test agent execution
npm run test:loom:agent
```
