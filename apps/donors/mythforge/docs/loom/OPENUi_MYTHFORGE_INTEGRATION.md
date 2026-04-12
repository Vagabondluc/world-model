# OpenUI Integration Guide for MythForge

> **Status:** Implementation Ready
> **Version:** 1.0.0
> **Last Updated:** 2026-03-31
> **Priority:** OpenUI wins on any component overlap

## Checklist Snapshot

- [x] OpenUI docs have a canonical checklist spec
- [x] OpenUI route tests use reusable harness helpers
- [x] OpenUI prop validation is implemented
- [ ] Immediate-render OptionA mode exists in runtime
- [ ] Browser UI E2E surface exists
- [ ] Desktop UI E2E surface exists

## Current Implementation Snapshot

- The repository currently uses a streaming-first OpenUI route and renderer.
- The detailed replacement map below remains useful as a migration reference.
- Harness-backed route tests exist, but the browser/desktop surfaces described later are not yet implemented.

## Overview

This guide covers integrating [OpenUI](https://github.com/thesysdev/openui) into MythForge to enable AI-generated, streaming UI components. OpenUI replaces overlapping custom components with its token-efficient, streaming-first approach.

## Installation

```bash
cd mythforge
npm install @openuidev/react-lang @openuidev/react-ui @openuidev/react-headless
```

## Component Replacement Map

When OpenUI overlaps with existing MythForge components, **OpenUI wins**:

| Current Component | OpenUI Replacement | Reason |
|-------------------|-------------------|--------|
| `AICopilot.tsx` (chat UI) | `@openuidev/react-ui` ChatLayout | Streaming-first, built-in |
| `ChatWidgets.tsx` | OpenUI Renderer | Dynamic AI-generated widgets |
| `DraftCard.tsx` | OpenUI EntityCard component | Generated from AI output |
| Custom entity modals | OpenUI generated forms | 67% token savings |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      MythForge + OpenUI                          │
│                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐                  │
│  │   AICopilot     │      │  EntityModal    │                  │
│  │  (OpenUI Chat)  │      │ (OpenUI Forms)  │                  │
│  └────────┬────────┘      └────────┬────────┘                  │
│           │                        │                            │
│           ▼                        ▼                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   OpenUI Renderer                        │   │
│  │  - Parses OpenUI Lang stream                            │   │
│  │  - Renders components progressively                      │   │
│  │  - Uses MythForge component library                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   AI Chat API                            │   │
│  │  /api/ai/chat → returns OpenUI Lang stream              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Phase 1: Define MythForge Component Library

Create the component library that OpenUI can generate:

```typescript
// src/lib/openui/mythforge-components.ts

import { defineComponentLibrary } from '@openuidev/react-lang';
import { z } from 'zod';

export const mythforgeComponents = defineComponentLibrary({
  name: 'mythforge',
  
  components: {
    // Entity Draft Card - for Lorekeeper output
    DraftCard: {
      description: 'Display a draft entity with preview, attributes, and save button',
      schema: z.object({
        title: z.string(),
        category: z.string(),
        summary: z.string(),
        markdown: z.string().optional(),
        attributes: z.record(z.unknown()),
        tags: z.array(z.string()),
      }),
    },
    
    // Consistency Issue - for Scholar output
    ConsistencyIssue: {
      description: 'Display a consistency issue with severity and entity references',
      schema: z.object({
        severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
        title: z.string(),
        description: z.string(),
        entityIds: z.array(z.string()),
        entityTitles: z.array(z.string()),
      }),
    },
    
    // Relationship Suggestion - for Architect output
    RelationshipSuggestion: {
      description: 'Display a suggested relationship between two entities',
      schema: z.object({
        sourceTitle: z.string(),
        targetTitle: z.string(),
        relationshipType: z.string(),
        reason: z.string(),
      }),
    },
    
    // Workflow Template - for The Loom
    WorkflowTemplate: {
      description: 'Display a workflow template with steps and inputs',
      schema: z.object({
        name: z.string(),
        description: z.string(),
        inputs: z.array(z.object({
          name: z.string(),
          type: z.string(),
          required: z.boolean(),
        })),
        steps: z.array(z.object({
          id: z.string(),
          mode: z.string(),
          prompt: z.string(),
        })),
        estimatedDuration: z.string(),
      }),
    },
    
    // Entity Reference - clickable entity link
    EntityReference: {
      description: 'A clickable reference to an existing entity',
      schema: z.object({
        entityId: z.string(),
        title: z.string(),
        category: z.string(),
        uuidShort: z.string(),
      }),
    },
    
    // Progress Indicator - for long operations
    ProgressIndicator: {
      description: 'Show progress for multi-step operations',
      schema: z.object({
        current: z.number(),
        total: z.number(),
        label: z.string(),
        status: z.enum(['pending', 'running', 'complete', 'failed']),
      }),
    },
  },
});
```

## Phase 2: Create React Components for OpenUI

```typescript
// src/components/mythosforge/openui/DraftCard.tsx

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorldStore } from '@/store/useWorldStore';

interface DraftCardProps {
  title: string;
  category: string;
  summary: string;
  markdown?: string;
  attributes: Record<string, unknown>;
  tags: string[];
}

export function DraftCard({ title, category, summary, markdown, attributes, tags }: DraftCardProps) {
  const { addEntity } = useWorldStore();
  
  const handleSave = () => {
    addEntity({
      title,
      category,
      markdown_content: markdown || '',
      json_attributes: attributes,
      tags,
    });
  };
  
  return (
    <div className="draft-card bg-surface-700 rounded-lg p-4 border border-white/10">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-bone-100 font-semibold">{title}</h3>
        <Badge variant="outline" className="text-xs">{category}</Badge>
      </div>
      
      <p className="text-ash-400 text-sm mb-3">{summary}</p>
      
      {Object.keys(attributes).length > 0 && (
        <div className="bg-surface-800 rounded p-2 mb-3">
          <code className="text-xs text-bone-300">
            {JSON.stringify(attributes, null, 2)}
          </code>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-surface-600 text-ash-500 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <Button size="sm" onClick={handleSave} className="h-7 text-xs">
          Save to World
        </Button>
      </div>
    </div>
  );
}
```

```typescript
// src/components/mythosforge/openui/ConsistencyIssue.tsx

import { AlertTriangle, Eye, Info } from 'lucide-react';

interface ConsistencyIssueProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  entityIds: string[];
  entityTitles: string[];
}

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
  high: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  medium: { icon: Eye, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  low: { icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  info: { icon: Info, color: 'text-ash-400', bg: 'bg-ash-400/10' },
};

export function ConsistencyIssue({ severity, title, description, entityIds, entityTitles }: ConsistencyIssueProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;
  
  return (
    <div className={`consistency-issue rounded-lg p-3 border ${config.bg} border-current/20`}>
      <div className="flex items-start gap-2">
        <Icon className={`size-4 ${config.color} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`font-medium text-sm ${config.color}`}>{title}</h4>
          <p className="text-ash-400 text-xs mt-1">{description}</p>
          
          {entityTitles.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {entityTitles.map((t, i) => (
                <span key={entityIds[i]} className="text-[10px] px-1.5 py-0.5 bg-surface-700 text-bone-300 rounded cursor-pointer hover:bg-surface-600">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

```typescript
// src/components/mythosforge/openui/index.ts

export { DraftCard } from './DraftCard';
export { ConsistencyIssue } from './ConsistencyIssue';
export { RelationshipSuggestion } from './RelationshipSuggestion';
export { WorkflowTemplate } from './WorkflowTemplate';
export { EntityReference } from './EntityReference';
export { ProgressIndicator } from './ProgressIndicator';

// Component map for OpenUI Renderer
export const mythforgeComponentMap = {
  DraftCard: (props: any) => <DraftCard {...props} />,
  ConsistencyIssue: (props: any) => <ConsistencyIssue {...props} />,
  RelationshipSuggestion: (props: any) => <RelationshipSuggestion {...props} />,
  WorkflowTemplate: (props: any) => <WorkflowTemplate {...props} />,
  EntityReference: (props: any) => <EntityReference {...props} />,
  ProgressIndicator: (props: any) => <ProgressIndicator {...props} />,
};
```

## Phase 3: Replace AICopilot with OpenUI Chat

```typescript
// src/components/mythosforge/AICopilotOpenUI.tsx

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Renderer } from '@openuidev/react-lang';
import { useWorldStore } from '@/store/useWorldStore';
import { AI_MODES, type AIMode } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MODE_EMOJIS, MODE_COLORS, MODE_QUICK_ACTIONS } from './ai/ai-config';
import { mythforgeComponentMap } from './openui';
import { generateSystemPrompt } from '@/lib/openui/prompt-generator';

export function AICopilotOpenUI() {
  const {
    aiMode, setAiMode, chatInput, setChatInput,
    activeEntityId, entities, relationships,
  } = useWorldStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamContent]);
  
  const handleSend = useCallback(async (overridePrompt?: string) => {
    const trimmed = overridePrompt || chatInput.trim();
    if (!trimmed) return;
    
    setStreamContent('');
    setChatInput('');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/ai/chat/openui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          mode: aiMode,
          activeEntityId,
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
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        setStreamContent(prev => prev + chunk);
      }
    } catch (error) {
      console.error('OpenUI stream error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [chatInput, aiMode, activeEntityId, entities, relationships]);
  
  const quickActions = MODE_QUICK_ACTIONS[aiMode] || [];
  const modeColor = MODE_COLORS[aiMode];
  
  return (
    <div className="flex flex-col h-full bg-void-800">
      {/* Header - same as before */}
      <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-accent-gold" />
          <span className="text-sm font-semibold text-bone-300">AI Co-Pilot</span>
          <span className="text-[10px] text-ash-600">(OpenUI)</span>
        </div>
      </div>
      
      {/* Mode Switcher - same as before */}
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
      
      {/* OpenUI Rendered Content - NEW */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {streamContent ? (
          <Renderer
            content={streamContent}
            components={mythforgeComponentMap}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="size-10 text-ash-600 mb-3" />
            <p className="text-sm text-ash-500">Start chatting to generate UI</p>
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

## Phase 4: API Route for OpenUI Streaming

```typescript
// src/app/api/ai/chat/openui/route.ts

import { NextRequest } from 'next/server';
import { stream } from '@mariozechner/pi-ai';
import { getModel } from '@mariozechner/pi-ai';
import { MODE_PROMPTS } from '../prompts';
import { generateOpenUIPrompt } from '@/lib/openui/prompt-generator';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, mode, activeEntityId, worldContext } = body;
  
  const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.lorekeeper;
  const openuiPrompt = generateOpenUIPrompt(mode);
  
  const model = getModel('anthropic', 'claude-sonnet-4-20250514');
  
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const s = stream(model, {
        systemPrompt: `${systemPrompt}\n\n${openuiPrompt}`,
        messages: [{ role: 'user', content: message }],
      });
      
      try {
        for await (const event of s) {
          if (event.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
  
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
```

## Phase 5: System Prompt Generator

```typescript
// src/lib/openui/prompt-generator.ts

import { generatePrompt } from '@openuidev/react-lang';
import { mythforgeComponents } from './mythforge-components';

export function generateOpenUIPrompt(mode: string): string {
  const basePrompt = generatePrompt({
    components: mythforgeComponents,
    instructions: `
      You are generating UI for MythForge's ${mode} mode.
      
      Output OpenUI Lang syntax to create interactive components.
      
      Available components:
      - DraftCard: For entity drafts (Lorekeeper)
      - ConsistencyIssue: For problems found (Scholar)
      - RelationshipSuggestion: For graph links (Architect)
      - WorkflowTemplate: For The Loom workflows
      - EntityReference: For clickable entity links
      - ProgressIndicator: For long operations
      
      Always stream output progressively.
    `,
  });
  
  return basePrompt;
}
```

## Implementation Checklist

### Week 1: Setup & Component Library

- [ ] Install OpenUI packages
- [ ] Create `src/lib/openui/mythforge-components.ts`
- [ ] Create `src/components/mythosforge/openui/` directory
- [ ] Implement DraftCard component
- [ ] Implement ConsistencyIssue component
- [ ] Implement RelationshipSuggestion component
- [ ] Implement EntityReference component

### Week 2: AICopilot Replacement

- [ ] Create `AICopilotOpenUI.tsx`
- [ ] Create `/api/ai/chat/openui/route.ts`
- [ ] Create `prompt-generator.ts`
- [ ] Test streaming with Lorekeeper mode
- [ ] Test streaming with Scholar mode
- [ ] Replace old AICopilot in Workspace.tsx

### Week 3: Advanced Components

- [ ] Implement WorkflowTemplate component
- [ ] Implement ProgressIndicator component
- [ ] Add OpenUI to EntityModal (generated forms)
- [ ] Add OpenUI to TemplateEditor
- [ ] Performance testing with large streams

### Week 4: Testing & Polish

- [ ] Unit tests for OpenUI components
- [ ] Integration tests for streaming API
- [ ] Error handling for malformed OpenUI Lang
- [ ] Loading states and skeleton UI
- [ ] Documentation for adding new components

## Token Savings Example

**Before (JSON-based draft card):**
```json
{
  "type": "draft_card",
  "data": {
    "title": "Millhaven Village",
    "category": "Settlement",
    "summary": "A small farming village in the Darkwood region",
    "markdown": "## Description\nMillhaven is a quiet farming village...",
    "attributes": {
      "population": 450,
      "wealth_tier": 2,
      "guard_count": 10,
      "crime_rate": 5
    },
    "tags": ["village", "farming", "darkwood"]
  }
}
```
**~340 tokens**

**After (OpenUI Lang):**
```
<DraftCard
  title="Millhaven Village"
  category="Settlement"
  summary="A small farming village in the Darkwood region"
  attributes={{ population: 450, wealth_tier: 2, guard_count: 10, crime_rate: 5 }}
  tags=["village", "farming", "darkwood"]
/>
```
**~120 tokens** (65% savings)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Stream not rendering | Check Content-Type header is `text/plain` |
| Components not found | Verify component map includes all used components |
| Malformed OpenUI Lang | Add error boundary around Renderer |
| Slow streaming | Check for network buffering, use smaller chunks |

## Resources

- [OpenUI Documentation](https://openui.com)
- [OpenUI Playground](https://www.openui.com/playground)
- [Example Chat App](../docs/research/openui/examples/openui-chat)
