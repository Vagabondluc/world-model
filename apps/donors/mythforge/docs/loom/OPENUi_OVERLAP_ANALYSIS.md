# OpenUI Overlap Analysis - MythForge Component Replacement

> **Status:** Reference Document
> **Version:** 1.0.0
> **Last Updated:** 2026-03-31
> **Policy:** OpenUI wins on any component overlap

## Checklist Snapshot

- [x] OpenUI renderer and parser implementations exist
- [x] OpenUI route tests cover streamed SSE output
- [x] Reusable harness helpers exist for route-level OpenUI tests
- [ ] Browser UI overlap has been replaced
- [ ] Desktop UI overlap has been replaced
- [ ] Immediate-render OptionA mode has been implemented

## Current Implementation Snapshot

- The overlap analysis below is still directionally correct for migration planning.
- Current code is streaming-first and still uses custom MythForge UI surfaces.
- The new harness helps verify route-level behavior, but not browser/desktop end-to-end flows yet.

## Executive Summary

This document identifies all MythForge components that overlap with OpenUI functionality. When overlap exists, **OpenUI replaces the custom MythForge implementation** to gain:
- 67% token savings
- Streaming-first rendering
- AI-generated dynamic UI
- Reduced maintenance burden

---

## Overlap Matrix

| MythForge Component | OpenUI Replacement | Overlap Type | Priority |
|---------------------|-------------------|--------------|----------|
| `AICopilot.tsx` | `@openuidev/react-ui` ChatLayout | Full replacement | **Critical** |
| `ChatWidgets.tsx` | OpenUI Renderer | Full replacement | **Critical** |
| `DraftCard.tsx` | OpenUI DraftCard component | Partial - needs MythForge styling | High |
| `ai/ai-config.ts` (mock responses) | OpenUI streaming | Full replacement | High |
| Entity modal forms | OpenUI generated forms | Partial - form generation | Medium |
| Template editor | OpenUI WorkflowTemplate | Partial - template display | Medium |

---

## Detailed Analysis

### 1. AICopilot.tsx → OpenUI ChatLayout

**Current Location:** `src/components/mythosforge/AICopilot.tsx`

**Current Implementation:**
```typescript
// Custom chat UI with:
// - Manual message rendering
// - Custom scroll handling
// - Static quick action buttons
// - Non-streaming response display
```

**OpenUI Replacement:**
```typescript
// @openuidev/react-ui provides:
// - Streaming message rendering
// - Built-in scroll management
// - Dynamic component injection
// - Progressive UI updates
```

**What Gets Replaced:**
| Feature | Current | OpenUI |
|---------|---------|--------|
| Message display | `ChatMessageBubble` component | OpenUI Renderer |
| Input handling | Custom `Input` + `handleKeyDown` | `@openuidev/react-ui` ChatInput |
| Mode switching | Custom `Select` | Same (keep) |
| Quick actions | Static buttons | Dynamic from AI |
| Loading state | Manual `isLoading` | Built-in streaming indicator |

**Code to Remove:**
- `src/components/mythosforge/ai/ChatWidgets.tsx` → **DELETE**
- `ChatMessageBubble` component → **DELETE**
- Manual message rendering logic → **DELETE**

**Code to Keep:**
- Mode switching logic
- Quick action definitions (move to OpenUI prompt)
- Store integration (`useWorldStore`)

---

### 2. ChatWidgets.tsx → OpenUI Renderer

**Current Location:** `src/components/mythosforge/ai/ChatWidgets.tsx`

**Current Implementation:**
```typescript
// Static widget components:
// - ChatMessageBubble (text display)
// - Manual component parsing
// - No streaming support
```

**What Gets Replaced:**
- Entire file → **DELETE**
- All widget rendering moves to OpenUI Renderer
- AI generates widget markup directly

**Migration Path:**
```
ChatWidgets.tsx (DELETE)
       ↓
OpenUI Renderer + MythForge component library
```

---

### 3. DraftCard.tsx → OpenUI DraftCard

**Current Location:** `src/components/mythosforge/ai/DraftCard.tsx`

**Current Implementation:**
```typescript
// Static draft card with:
// - Fixed layout
// - Manual attribute display
// - Save button with store integration
```

**OpenUI Replacement:**
```typescript
// OpenUI DraftCard component:
// - Same functionality
// - AI-generated attributes
// - Streaming progressive display
// - MythForge styling applied
```

**What Changes:**
| Aspect | Current | OpenUI |
|--------|---------|--------|
| Data source | Parsed from AI text blocks | AI generates OpenUI Lang directly |
| Rendering | Static React component | OpenUI Renderer |
| Styling | Tailwind classes | Same (keep styling) |
| Store integration | `useWorldStore` hook | Same (keep integration) |

**Action:** Rewrite with OpenUI component definition, keep styling and store integration

---

### 4. ai-config.ts Mock Responses → OpenUI Streaming

**Current Location:** `src/components/mythosforge/ai/ai-config.ts`

**Current Implementation:**
```typescript
// generateMockResponse() function:
// - Returns static mock data
// - Used as fallback when API fails
// - Hardcoded component structures
```

**What Gets Replaced:**
- `generateMockResponse()` → **DELETE**
- Fallback handled by OpenUI error boundary
- No need for mock responses with streaming

**Code to Remove:**
```typescript
// DELETE this entire function:
export function generateMockResponse(
  mode: AIMode,
  userMessage: string,
  entityIds: string[],
  entityTitles: Record<string, string>,
): { content: string; components?: ChatComponent[] }
```

---

### 5. Entity Modal Forms → OpenUI Generated Forms

**Current Location:** `src/components/mythosforge/EntityModal.tsx`, `AttributeForm.tsx`

**Current Implementation:**
```typescript
// Static form generation:
// - CATEGORY_TEMPLATES defines fields
// - Manual form rendering
// - Fixed field types
```

**OpenUI Enhancement:**
```typescript
// AI can generate custom forms:
// - Dynamic field suggestions
// - Context-aware defaults
// - Streaming form preview
```

**What Changes:**
| Aspect | Current | OpenUI |
|--------|---------|--------|
| Form definition | `CATEGORY_TEMPLATES` constant | Same (keep as base) |
| Field rendering | `AttributeForm` component | OpenUI can suggest new fields |
| Validation | Zod schemas | Same (keep) |

**Action:** Keep existing forms, add OpenUI for AI-suggested field additions

---

### 6. Template Editor → OpenUI WorkflowTemplate

**Current Location:** `src/components/mythosforge/TemplateEditor.tsx`

**Current Implementation:**
```typescript
// Static template editing:
// - Manual field editing
// - JSON preview
// - Save to store
```

**OpenUI Enhancement:**
```typescript
// AI-generated templates:
// - Natural language template creation
// - Visual workflow preview
// - Streaming template builder
```

**What Changes:**
| Aspect | Current | OpenUI |
|--------|---------|--------|
| Template creation | Manual form | AI-assisted |
| Preview | JSON display | Visual workflow |
| Editing | Direct field edit | AI suggestions |

**Action:** Keep existing editor, add OpenUI for AI-assisted template creation

---

## Files to Delete

After OpenUI integration is complete:

```
src/components/mythosforge/ai/ChatWidgets.tsx        → DELETE
src/components/mythosforge/ai/DraftCard.tsx         → DELETE (replace with OpenUI version)
src/components/mythosforge/AICopilot.tsx            → DELETE (replace with AICopilotOpenUI.tsx)
```

## Files to Modify

```
src/components/mythosforge/Workspace.tsx            → Update import
src/components/mythosforge/EntityModal.tsx          → Add OpenUI suggestions
src/components/mythosforge/TemplateEditor.tsx       → Add OpenUI generation
src/store/useWorldStore.ts                          → May need streaming support
```

## Files to Create

```
src/lib/openui/config.ts                            → OpenUI configuration
src/lib/openui/components.ts                        → MythForge component library
src/lib/openui/prompt-generator.ts                  → System prompt generation
src/components/mythosforge/openui/DraftCard.tsx     → OpenUI DraftCard
src/components/mythosforge/openui/ConsistencyIssue.tsx
src/components/mythosforge/openui/RelationshipSuggestion.tsx
src/components/mythosforge/openui/EntityReference.tsx
src/components/mythosforge/openui/WorkflowTemplate.tsx
src/components/mythosforge/openui/ProgressIndicator.tsx
src/components/mythosforge/openui/SchemaField.tsx
src/components/mythosforge/openui/index.ts          → Component exports
src/components/mythosforge/AICopilotOpenUI.tsx      → New chat UI
src/app/api/ai/chat/openui/route.ts                 → Streaming API
```

---

## Migration Timeline

| Week | Action | Files Affected |
|------|--------|----------------|
| **Week 1** | Create OpenUI components | New files only |
| **Week 2** | Replace AICopilot | Delete `AICopilot.tsx`, `ChatWidgets.tsx` |
| **Week 3** | Enhance EntityModal | Modify `EntityModal.tsx` |
| **Week 4** | Enhance TemplateEditor | Modify `TemplateEditor.tsx` |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenUI streaming fails | Chat becomes unusable | Keep fallback to static rendering |
| Component styling mismatch | Visual inconsistency | Apply MythForge Tailwind theme |
| Store integration breaks | Data not saved | Test all save operations |
| Performance degradation | Slow streaming | Monitor chunk sizes |

---

## Rollback Plan

If OpenUI integration causes issues:

1. **Immediate:** Revert `Workspace.tsx` import to old `AICopilot`
2. **Short-term:** Restore deleted files from git
3. **Long-term:** Keep OpenUI components as optional feature

```typescript
// Emergency rollback in Workspace.tsx:
// import { AICopilot } from './AICopilot';  // Old
import { AICopilot } from './AICopilotOpenUI';  // New

// Change back to:
import { AICopilot } from './AICopilot';
```

---

## Success Metrics

| Metric | Before | After (Target) |
|--------|--------|----------------|
| Token usage per response | ~340 tokens | ~120 tokens (65% reduction) |
| Time to first render | Full response | Immediate streaming |
| Component maintenance | 15+ custom files | 7 OpenUI components |
| AI flexibility | Fixed output format | Dynamic UI generation |
