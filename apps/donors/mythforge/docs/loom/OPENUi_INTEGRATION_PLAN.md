# OpenUI Integration Plan for MythForge

> **Status:** Implementation Ready
> **Version:** 1.0.0
> **Last Updated:** 2026-03-31
> **Priority:** OpenUI replaces overlapping components

## Checklist Snapshot

- [x] OpenUI docs have a canonical checklist spec
- [x] OpenUI route tests use reusable harness helpers
- [x] OpenUI renderer validates component props
- [ ] Immediate-render OptionA mode exists in runtime
- [ ] Browser UI surface exists for true E2E testing
- [ ] Desktop UI surface exists for true E2E testing

## Current Implementation Snapshot

- Runtime is still streaming-first.
- `src/app/api/openui/stream/route.ts` emits simulated SSE events.
- `src/lib/openui/components/OpenUIRenderer.tsx` validates props and renders registered components.
- `tests/harness/openui-optiona-harness.ts` now supports payload assembly and SSE collection for tests.

## Overview

This document provides a step-by-step integration plan for [OpenUI](https://github.com/thesysdev/openui) into MythForge. OpenUI enables AI-generated, streaming UI with 67% token savings over JSON.

## Integration Phases

| Phase | Focus | Duration | Dependencies |
|-------|-------|----------|--------------|
| **Phase 1** | Install & Configure | 1 day | None |
| **Phase 2** | Component Library | 2 days | Phase 1 |
| **Phase 3** | Replace AICopilot | 2 days | Phase 2 |
| **Phase 4** | Streaming API | 1 day | Phase 3 |
| **Phase 5** | Testing & Polish | 2 days | Phase 4 |

**Total: ~8 days**

---

## Phase 1: Install & Configure (Day 1)

### Step 1.1: Install Packages

```bash
cd mythforge
npm install @openuidev/react-lang @openuidev/react-ui @openuidev/react-headless
```

**Verify installation:**
```bash
npm ls @openuidev/react-lang @openuidev/react-ui @openuidev/react-headless
```

### Step 1.2: Create Configuration File

Create `src/lib/openui/config.ts`:

```typescript
// src/lib/openui/config.ts

import { setOpenAiCompatSettings } from '@openuidev/react-lang';

/**
 * OpenUI Configuration for MythForge
 * 
 * This configures how OpenUI integrates with MythForge's AI chat system.
 */

export const OPENUI_CONFIG = {
  /**
   * Enable debug mode for development
   */
  debug: process.env.NODE_ENV === 'development',
  
  /**
   * Default streaming behavior
   */
  streaming: {
    enabled: true,
    chunkSize: 1024, // bytes per chunk
  },
  
  /**
   * Component library settings
   */
  components: {
    /**
     * MythForge-specific components that OpenUI can generate
     */
    namespace: 'mythforge',
    
    /**
     * Built-in OpenUI components to include
     */
    includeBuiltins: true,
  },
};

/**
 * Configure OpenAI-compatible provider for local LLM support
 * (Optional - for Ollama integration)
 */
export function configureOpenUIForOllama(baseUrl: string = 'http://localhost:11434/v1') {
  setOpenAiCompatSettings('ollama', {
    baseUrl,
    apiKey: 'ollama',
  });
}
```

### Step 1.3: Add Environment Variables

Add to `.env.local`:

```bash
# OpenUI Configuration
OPENUI_DEBUG=true
OPENUI_STREAMING_ENABLED=true

# Optional: Ollama for local LLM
OLLAMA_BASE_URL=http://localhost:11434/v1
```

### Step 1.4: Create Directory Structure

```bash
mkdir -p src/lib/openui
mkdir -p src/components/mythosforge/openui
```

**Deliverable:**
- [ ] Packages installed successfully
- [ ] `src/lib/openui/config.ts` created
- [ ] Environment variables added
- [ ] Directory structure created

---

## Phase 2: Component Library (Days 2-3)

### Step 2.1: Define MythForge Components

Create `src/lib/openui/components.ts`:

```typescript
// src/lib/openui/components.ts

import { defineComponentLibrary } from '@openuidev/react-lang';
import { z } from 'zod';

/**
 * MythForge Component Library for OpenUI
 * 
 * These define what UI elements the AI can generate.
 * OpenUI will use these schemas to:
 * 1. Generate system prompts for the AI
 * 2. Validate AI output
 * 3. Render components dynamically
 */
export const mythforgeComponents = defineComponentLibrary({
  name: 'mythforge',
  
  components: {
    // ========================================
    // DRAFT CARD - Lorekeeper entity output
    // ========================================
    DraftCard: {
      description: 'Display a draft entity that can be saved to the database',
      schema: z.object({
        title: z.string().describe('Entity title'),
        category: z.string().describe('Entity category (NPC, Location, Item, etc.)'),
        summary: z.string().describe('One-sentence description'),
        markdown: z.string().optional().describe('Full markdown content'),
        attributes: z.record(z.unknown()).describe('Entity attributes as key-value pairs'),
        tags: z.array(z.string()).describe('Tags for filtering'),
      }),
    },
    
    // ========================================
    // CONSISTENCY ISSUE - Scholar output
    // ========================================
    ConsistencyIssue: {
      description: 'Display a consistency issue found in the world database',
      schema: z.object({
        severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
        title: z.string().describe('Issue title'),
        description: z.string().describe('Detailed explanation'),
        entityIds: z.array(z.string()).describe('Affected entity UUIDs'),
        entityTitles: z.array(z.string()).describe('Affected entity names'),
      }),
    },
    
    // ========================================
    // RELATIONSHIP SUGGESTION - Architect output
    // ========================================
    RelationshipSuggestion: {
      description: 'Display a suggested relationship between two entities',
      schema: z.object({
        sourceTitle: z.string().describe('Source entity name'),
        targetTitle: z.string().describe('Target entity name'),
        relationshipType: z.string().describe('Type of relationship'),
        reason: z.string().describe('Why this relationship makes sense'),
      }),
    },
    
    // ========================================
    // ENTITY REFERENCE - Clickable entity link
    // ========================================
    EntityReference: {
      description: 'A clickable reference to an existing entity',
      schema: z.object({
        entityId: z.string().describe('Entity UUID'),
        title: z.string().describe('Entity display name'),
        category: z.string().describe('Entity category'),
        uuidShort: z.string().describe('Short display ID (e.g., E-88A2)'),
      }),
    },
    
    // ========================================
    // WORKFLOW TEMPLATE - The Loom output
    // ========================================
    WorkflowTemplate: {
      description: 'Display a workflow template for The Loom',
      schema: z.object({
        name: z.string().describe('Template name'),
        description: z.string().describe('What this workflow does'),
        inputs: z.array(z.object({
          name: z.string(),
          type: z.string(),
          required: z.boolean(),
        })).describe('Required inputs'),
        steps: z.array(z.object({
          id: z.string(),
          mode: z.enum(['architect', 'lorekeeper', 'scholar', 'roleplayer']),
          prompt: z.string(),
        })).describe('Workflow steps'),
        estimatedDuration: z.string().describe('Estimated time to complete'),
      }),
    },
    
    // ========================================
    // PROGRESS INDICATOR - Long operations
    // ========================================
    ProgressIndicator: {
      description: 'Show progress for multi-step operations',
      schema: z.object({
        current: z.number().describe('Current step number'),
        total: z.number().describe('Total steps'),
        label: z.string().describe('Current step label'),
        status: z.enum(['pending', 'running', 'complete', 'failed']),
      }),
    },
    
    // ========================================
    // SCHEMA FIELD - Architect schema output
    // ========================================
    SchemaField: {
      description: 'Display a schema field suggestion',
      schema: z.object({
        category: z.string().describe('Target category'),
        fieldName: z.string().describe('Field name to add'),
        fieldType: z.enum(['string', 'number', 'boolean', 'array']),
        description: z.string().describe('What this field tracks'),
        required: z.boolean().describe('Is this field required'),
      }),
    },
  },
});

// Export type for TypeScript support
export type MythforgeComponentName = keyof typeof mythforgeComponents.components;
```

### Step 2.2: Create React Components

Create `src/components/mythosforge/openui/DraftCard.tsx`:

```typescript
// src/components/mythosforge/openui/DraftCard.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorldStore } from '@/store/useWorldStore';
import { Save, Eye, X } from 'lucide-react';
import { useState } from 'react';

interface DraftCardProps {
  title: string;
  category: string;
  summary: string;
  markdown?: string;
  attributes: Record<string, unknown>;
  tags: string[];
}

export function DraftCard({
  title,
  category,
  summary,
  markdown = '',
  attributes,
  tags,
}: DraftCardProps) {
  const { addEntity } = useWorldStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addEntity({
        title,
        category,
        markdown_content: markdown,
        json_attributes: attributes,
        tags,
      });
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save entity:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isSaved) {
    return (
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-400">
          <Save className="size-4" />
          <span className="font-medium">Saved: {title}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-surface-700 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-white/5">
        <div className="flex-1 min-w-0">
          <h3 className="text-bone-100 font-semibold truncate">{title}</h3>
          <p className="text-ash-500 text-sm mt-1">{summary}</p>
        </div>
        <Badge variant="outline" className="ml-2 shrink-0 text-xs">
          {category}
        </Badge>
      </div>
      
      {/* Attributes Preview */}
      <div className="p-4 bg-surface-800/50">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(attributes).slice(0, 6).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-ash-600">{key}:</span>
              <span className="text-bone-300 font-mono">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tags */}
      {tags.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-surface-600 text-ash-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center gap-2 p-4 border-t border-white/5">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1"
        >
          <Save className="size-3 mr-1" />
          {isSaving ? 'Saving...' : 'Save to Database'}
        </Button>
        {markdown && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="size-3" />
          </Button>
        )}
      </div>
      
      {/* Markdown Preview */}
      {showPreview && markdown && (
        <div className="p-4 border-t border-white/5 bg-surface-800/30 max-h-60 overflow-y-auto">
          <pre className="text-xs text-bone-300 whitespace-pre-wrap font-mono">
            {markdown.slice(0, 500)}
            {markdown.length > 500 && '...'}
          </pre>
        </div>
      )}
    </div>
  );
}
```

### Step 2.3: Create Remaining Components

Create `src/components/mythosforge/openui/ConsistencyIssue.tsx`:

```typescript
// src/components/mythosforge/openui/ConsistencyIssue.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import { useWorldStore } from '@/store/useWorldStore';
import { AlertTriangle, AlertCircle, Info, AlertOctagon } from 'lucide-react';

interface ConsistencyIssueProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  entityIds: string[];
  entityTitles: string[];
}

const severityConfig = {
  critical: {
    icon: AlertOctagon,
    color: 'text-red-400',
    bg: 'bg-red-900/20',
    border: 'border-red-500/30',
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-900/20',
    border: 'border-orange-500/30',
  },
  medium: {
    icon: AlertCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-900/20',
    border: 'border-amber-500/30',
  },
  low: {
    icon: AlertCircle,
    color: 'text-blue-400',
    bg: 'bg-blue-900/20',
    border: 'border-blue-500/30',
  },
  info: {
    icon: Info,
    color: 'text-gray-400',
    bg: 'bg-gray-900/20',
    border: 'border-gray-500/30',
  },
};

export function ConsistencyIssue({
  severity,
  title,
  description,
  entityIds,
  entityTitles,
}: ConsistencyIssueProps) {
  const { setActiveEntity } = useWorldStore();
  const config = severityConfig[severity];
  const Icon = config.icon;
  
  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`size-5 ${config.color} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-bone-100 font-medium">{title}</h4>
            <Badge variant="outline" className="text-[10px]">
              {severity}
            </Badge>
          </div>
          <p className="text-ash-400 text-sm">{description}</p>
          
          {entityTitles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entityTitles.map((entityTitle, i) => (
                <button
                  key={entityIds[i]}
                  onClick={() => setActiveEntity(entityIds[i])}
                  className="text-xs px-2 py-0.5 rounded bg-surface-600 text-bone-300 hover:bg-surface-500 transition-colors"
                >
                  {entityTitle}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Step 2.4: Create Component Index

Create `src/components/mythosforge/openui/index.ts`:

```typescript
// src/components/mythosforge/openui/index.ts

export { DraftCard } from './DraftCard';
export { ConsistencyIssue } from './ConsistencyIssue';
export { RelationshipSuggestion } from './RelationshipSuggestion';
export { EntityReference } from './EntityReference';
export { WorkflowTemplate } from './WorkflowTemplate';
export { ProgressIndicator } from './ProgressIndicator';
export { SchemaField } from './SchemaField';

// Component map for OpenUI Renderer
export const mythforgeComponentMap = {
  DraftCard: async () => import('./DraftCard').then(m => m.DraftCard),
  ConsistencyIssue: async () => import('./ConsistencyIssue').then(m => m.ConsistencyIssue),
  RelationshipSuggestion: async () => import('./RelationshipSuggestion').then(m => m.RelationshipSuggestion),
  EntityReference: async () => import('./EntityReference').then(m => m.EntityReference),
  WorkflowTemplate: async () => import('./WorkflowTemplate').then(m => m.WorkflowTemplate),
  ProgressIndicator: async () => import('./ProgressIndicator').then(m => m.ProgressIndicator),
  SchemaField: async () => import('./SchemaField').then(m => m.SchemaField),
};
```

**Deliverable:**
- [ ] `src/lib/openui/components.ts` created
- [ ] `src/components/mythosforge/openui/DraftCard.tsx` created
- [ ] `src/components/mythosforge/openui/ConsistencyIssue.tsx` created
- [ ] `src/components/mythosforge/openui/index.ts` created
- [ ] All 7 components implemented

---

## Phase 3: Replace AICopilot (Days 4-5)

### Step 3.1: Create OpenUI-Aware AICopilot

Create `src/components/mythosforge/AICopilotOpenUI.tsx`:

```typescript
// src/components/mythosforge/AICopilotOpenUI.tsx

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, X } from 'lucide-react';
import { Renderer } from '@openuidev/react-lang';
import { useWorldStore } from '@/store/useWorldStore';
import { AI_MODES, type AIMode } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MODE_EMOJIS, MODE_COLORS, MODE_QUICK_ACTIONS } from './ai/ai-config';
import { mythforgeComponentMap } from './openui';
import { generateSystemPrompt } from '@/lib/openui/prompt-generator';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function AICopilotOpenUI() {
  const {
    aiMode, setAiMode, chatInput, setChatInput,
    activeEntityId, entities, relationships,
  } = useWorldStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamContent]);
  
  const handleSend = useCallback(async (overridePrompt?: string) => {
    const userMessage = overridePrompt || chatInput.trim();
    if (!userMessage || isLoading) return;
    
    const messageId = `msg-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: messageId,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    }]);
    
    setChatInput('');
    setIsLoading(true);
    setStreamContent('');
    
    try {
      const systemPrompt = generateSystemPrompt(aiMode, entities, activeEntityId);
      
      const res = await fetch('/api/ai/chat/openui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          mode: aiMode,
          systemPrompt,
          worldContext: {
            entities: entities.map(e => ({
              id: e.id,
              title: e.title,
              category: e.category,
              uuid_short: e.uuid_short,
            })),
            relationships,
          },
        }),
      });
      
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      if (!res.body) throw new Error('No response body');
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setStreamContent(prev => prev + chunk);
      }
      
      // Move streamed content to messages
      setStreamContent(content => {
        setMessages(prev => [...prev, {
          id: `response-${Date.now()}`,
          role: 'assistant',
          content,
          timestamp: Date.now(),
        }]);
        return '';
      });
      
    } catch (error) {
      console.error('OpenUI stream error:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatInput, aiMode, entities, relationships, activeEntityId, isLoading, setChatInput]);
  
  const quickActions = MODE_QUICK_ACTIONS[aiMode] || [];
  
  return (
    <div className="flex flex-col h-full bg-void-800">
      {/* Header */}
      <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-accent-gold" />
          <span className="text-sm font-semibold text-bone-300">AI Co-Pilot</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold">OpenUI</span>
        </div>
      </div>
      
      {/* Mode Switcher */}
      <div className="flex-shrink-0 h-10 flex items-center px-4 border-b border-white/[0.06]">
        <Select value={aiMode} onValueChange={(val) => setAiMode(val as AIMode)}>
          <SelectTrigger size="sm" className="w-full h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AI_MODES.map((mode) => (
              <SelectItem key={mode.id} value={mode.id}>
                <span className="mr-1.5">{MODE_EMOJIS[mode.id]}</span>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="flex-shrink-0 px-4 py-2 border-b border-white/[0.06] flex gap-1.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => handleSend(action.prompt)}
                disabled={isLoading}
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-ash-500 border border-white/[0.06] hover:border-accent-gold/20"
              >
                <Icon className="size-3" />{action.label}
              </button>
            );
          })}
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !streamContent && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="size-10 text-ash-600 mb-3" />
            <p className="text-sm text-ash-500">Start chatting to generate UI</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[85%]`}
          >
            {msg.role === 'user' ? (
              <div className="bg-accent-gold/10 text-bone-200 rounded-lg px-3 py-2 text-sm">
                {msg.content}
              </div>
            ) : (
              <Renderer
                content={msg.content}
                components={mythforgeComponentMap}
              />
            )}
          </div>
        ))}
        
        {/* Streaming content */}
        {streamContent && (
          <div className="mr-auto max-w-[85%]">
            <Renderer
              content={streamContent}
              components={mythforgeComponentMap}
            />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Message..."
            className="flex-1 h-9 text-sm"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleSend()}
            disabled={!chatInput.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Step 3.2: Update Workspace to Use New Component

In `src/components/mythosforge/Workspace.tsx`, replace:

```typescript
// OLD
import { AICopilot } from './AICopilot';

// NEW
import { AICopilotOpenUI as AICopilot } from './AICopilotOpenUI';
```

**Deliverable:**
- [ ] `AICopilotOpenUI.tsx` created
- [ ] `Workspace.tsx` updated to use new component
- [ ] Chat UI renders with OpenUI components

---

## Phase 4: Streaming API (Day 6)

### Step 4.1: Create OpenUI API Route

Create `src/app/api/ai/chat/openui/route.ts`:

```typescript
// src/app/api/ai/chat/openui/route.ts

import { NextResponse } from 'next/server';
import { MODE_PROMPTS } from '../../prompts';
import { getZAI } from '@/lib/ai';
import { CATEGORY_TEMPLATES, RELATIONSHIP_TYPES } from '@/lib/types';

interface OpenUIRequest {
  message: string;
  mode: string;
  systemPrompt?: string;
  worldContext?: {
    entities: Array<{ id: string; title: string; category: string; uuid_short: string }>;
    relationships?: Array<{ id: string; parent_id: string; child_id: string; relationship_type: string }>;
  };
}

export async function POST(request: Request) {
  try {
    const body: OpenUIRequest = await request.json();
    const { message, mode, systemPrompt, worldContext } = body;
    
    // Build system prompt with OpenUI component instructions
    const openUISystemPrompt = `
${systemPrompt || MODE_PROMPTS[mode] || ''}

## OpenUI Component Instructions

You can generate UI components using OpenUI Lang syntax. Available components:

<DraftCard title="..." category="..." summary="..." attributes={{...}} tags={[...]} />
<ConsistencyIssue severity="..." title="..." description="..." entityIds={[...]} entityTitles={[...]} />
<RelationshipSuggestion sourceTitle="..." targetTitle="..." relationshipType="..." reason="..." />
<EntityReference entityId="..." title="..." category="..." uuidShort="..." />
<WorkflowTemplate name="..." description="..." inputs={[...]} steps={[...]} estimatedDuration="..." />
<ProgressIndicator current="..." total="..." label="..." status="..." />
<SchemaField category="..." fieldName="..." fieldType="..." description="..." required="..." />

Use these components to display structured data. For example, when generating an entity, wrap it in a DraftCard.
`;
    
    // Call AI with streaming
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: openUISystemPrompt },
        { role: 'user', content: message },
      ],
      stream: true,
    });
    
    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

**Deliverable:**
- [ ] `/api/ai/chat/openui` route created
- [ ] Streaming response works
- [ ] OpenUI components render from AI output

---

## Phase 5: Testing & Polish (Days 7-8)

### Step 5.1: Integration Tests

Create `src/components/mythosforge/openui/__tests__/DraftCard.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { DraftCard } from '../DraftCard';

// Mock store
jest.mock('@/store/useWorldStore', () => ({
  useWorldStore: () => ({
    addEntity: jest.fn().mockResolvedValue({ id: 'test-id' }),
  }),
}));

describe('DraftCard', () => {
  const defaultProps = {
    title: 'Test Entity',
    category: 'NPC',
    summary: 'A test entity',
    attributes: { hp: 10, ac: 15 },
    tags: ['test'],
  };
  
  it('renders entity information', () => {
    render(<DraftCard {...defaultProps} />);
    expect(screen.getByText('Test Entity')).toBeInTheDocument();
    expect(screen.getByText('NPC')).toBeInTheDocument();
    expect(screen.getByText('A test entity')).toBeInTheDocument();
  });
  
  it('shows save button', () => {
    render(<DraftCard {...defaultProps} />);
    expect(screen.getByText('Save to Database')).toBeInTheDocument();
  });
  
  it('calls addEntity on save', async () => {
    render(<DraftCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Save to Database'));
    // Wait for save to complete
    expect(await screen.findByText('Saved: Test Entity')).toBeInTheDocument();
  });
});
```

### Step 5.2: E2E Test

Test the full flow:

1. Open MythForge
2. Select Lorekeeper mode
3. Type "Generate a test NPC"
4. Verify DraftCard renders
5. Click Save
6. Verify entity appears in database

**Deliverable:**
- [ ] Unit tests pass
- [ ] E2E test passes
- [ ] Documentation updated

---

## Success Criteria

- [ ] OpenUI packages installed
- [ ] All 7 MythForge components implemented
- [ ] AICopilot replaced with OpenUI version
- [ ] Streaming API endpoint working
- [ ] Tests passing
- [ ] Token savings measurable (>50% vs JSON)

## Rollback Plan

If issues arise:

1. **Revert AICopilot**: Change import back to `./AICopilot`
2. **Keep components**: OpenUI components can still be used manually
3. **Disable streaming**: Set `OPENUI_STREAMING_ENABLED=false`
