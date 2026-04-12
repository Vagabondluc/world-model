# Pattern Analysis and Refactoring Strategies

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Executive Summary

This document identifies repeating patterns across the D&D Adventure Generator codebase and proposes refactoring strategies to improve maintainability, reduce duplication, and align with the architectural migration goals (Zustand for state management, Python sidecar for AI logic, Tauri FS integration).

## 1. Repeating Code Patterns

### Frontend (React/TypeScript)

| Pattern | Location(s) | Description | Severity |
|---------|-------------|-------------|----------|
| **AI Provider Interface Duplication** | [`src/services/ai/ollamaImpl.ts`](src/services/ai/ollamaImpl.ts:1), [`src/services/ai/openaiImpl.ts`](src/services/ai/openaiImpl.ts:1), [`src/services/ai/claudeImpl.ts`](src/services/ai/claudeImpl.ts:1), [`src/services/ai/geminiImpl.ts`](src/services/ai/geminiImpl.ts:1) | All four AI implementations (`OllamaImpl`, `OpenAIImpl`, `ClaudeImpl`, `GeminiImpl`) implement identical methods (`generateStructured`, `generateText`, `streamText`, `generateImage`) with nearly identical retry logic, error handling, and streaming response parsing patterns. | High |
| **Exponential Backoff Retry Logic** | [`src/services/ai/ollamaImpl.ts:62-101`](src/services/ai/ollamaImpl.ts:62), [`src/services/ai/openaiImpl.ts:42-83`](src/services/ai/openaiImpl.ts:42), [`src/services/ai/claudeImpl.ts:30-72`](src/services/ai/claudeImpl.ts:30), [`src/services/ai/geminiImpl.ts:26-59`](src/services/ai/geminiImpl.ts:26) | Each AI implementation contains identical retry loop with `Math.pow(2, attempt) * 1000` exponential backoff and `maxRetries` parameter. | High |
| **Streaming Response Parsing** | [`src/services/ai/ollamaImpl.ts:220-241`](src/services/ai/ollamaImpl.ts:220), [`src/services/ai/openaiImpl.ts:145-169`](src/services/ai/openaiImpl.ts:145), [`src/services/ai/claudeImpl.ts:131-151`](src/services/ai/claudeImpl.ts:131) | Similar SSE (Server-Sent Events) parsing logic: `reader.read()`, `decoder.decode()`, `chunk.split("\n")`, `JSON.parse()`, content accumulation. | High |
| **Entity Development Handlers** | [`src/services/adventureHandlers.ts:44-105`](src/services/adventureHandlers.ts:44) | `developScene`, `developLocation`, `developNpc`, `developFaction` all follow identical pattern: build system instruction, build context block, serialize blueprint, call API with schema. | Medium |
| **Hook State Management Pattern** | [`src/hooks/useBestiaryLogic.ts`](src/hooks/useBestiaryLogic.ts:1), [`src/hooks/useCompendiumManagerLogic.ts`](src/hooks/useCompendiumManagerLogic.ts:1), [`src/hooks/useLocationManagerLogic.ts`](src/hooks/useLocationManagerLogic.ts:1) | Similar structure: store selectors, local state (`selectedX`, `isFormOpen`), derived state (`useMemo`), handlers (`handleCreate`, `handleDelete`). | Medium |
| **Zustand Store Boilerplate** | [`src/stores/settingsStore.ts`](src/stores/settingsStore.ts:1), [`src/stores/navigationStore.ts`](src/stores/navigationStore.ts:1), [`src/stores/monsterCreatorStore.ts`](src/stores/monsterCreatorStore.ts:1) | Each store follows same pattern: state interface, actions interface, `create()` call, individual setters. | Medium |
| **Escape Key + Body Scroll Lock** | [`src/components/common/Modal.tsx:85-100`](src/components/common/Modal.tsx:85), [`src/components/common/Drawer.tsx:93-111`](src/components/common/Drawer.tsx:93) | Duplicate `useEffect` for handling Escape key and preventing body scroll when overlay is open. | Low |
| **Adventure Generator Strategies** | [`src/services/adventureGenerators.ts:14-78`](src/services/adventureGenerators.ts:14) | `generateHooksStrategy`, `refineHooksStrategy`, `generateOutlineStrategy`, `generateFullOutlineStrategy` all build system instruction, context block, call API with schema. | Medium |
| **Zod Schema Validation Pattern** | [`src/services/ai/ollamaImpl.ts:87-94`](src/services/ai/ollamaImpl.ts:87), [`src/services/ai/openaiImpl.ts:65-72`](src/services/ai/openaiImpl.ts:65), [`src/services/ai/claudeImpl.ts:55-62`](src/services/ai/claudeImpl.ts:55) | `extractJson(content)`, `zodSchema.safeParse(parsed)`, check `validation.success`, throw error if failed. | Medium |
| **Filtering with Search Query** | [`src/hooks/useBestiaryLogic.ts:89-119`](src/hooks/useBestiaryLogic.ts:89), [`src/hooks/useFilteredEntities.ts:78-123`](src/hooks/useFilteredEntities.ts:78) | Similar `useMemo` filtering logic: lowercased query, `includes()`, multiple filter criteria. | Low |

### Backend (Python/FastAPI)

| Pattern | Location(s) | Description | Severity |
|---------|-------------|-------------|----------|
| **Duplicate Pydantic Config/Result Pairs** | [`python-backend/models/encounters.py`](python-backend/models/encounters.py:1) | 8+ nearly identical model pairs (`CombatEncounterBalancerConfig`/`CombatEncounterBalancerResult`, `CombatEncounterV2Config`/`CombatEncounterV2Result`, etc.) with same `title` and `level` fields, same `description` result field. | High |
| **Router Dependency Injection Pattern** | [`python-backend/routers/encounter_gen.py:10-11`](python-backend/routers/encounter_gen.py:10), [`python-backend/routers/npc_gen.py:10-11`](python-backend/routers/npc_gen.py:10), [`python-backend/core/llm_router.py:21-28`](python-backend/core/llm_router.py:21) | Identical `get_generator_service()` or `get_llm_service()` functions using `Depends()` for dependency injection. | Medium |
| **HTTPException Wrapper Pattern** | [`python-backend/routers/encounter_gen.py:18-21`](python-backend/routers/encounter_gen.py:18), [`python-backend/routers/npc_gen.py:18-21`](python-backend/routers/npc_gen.py:18), [`python-backend/core/llm_router.py:41-42`](python-backend/core/llm_router.py:41) | Identical try/except blocks: call service method, catch Exception, raise `HTTPException(status_code=500, detail=str(e))`. | Medium |
| **Connection Testing Pattern** | [`python-backend/core/ollama_router.py:48-70`](python-backend/core/ollama_router.py:48), [`python-backend/core/ollama_router.py:86-98`](python-backend/core/ollama_router.py:86) | `test_ollama_connection()` and `get_ollama_models()` have similar request/response handling with timeout and error catching. | Medium |

### Native Bridge (Tauri/Rust)

| Pattern | Location(s) | Description | Severity |
|---------|-------------|-------------|----------|
| **Markdown File Operations** | [`src-tauri/src/lib.rs:14-51`](src-tauri/src/lib.rs:14) | `read_markdown_file` and `write_markdown_file` have similar error handling with `.map_err(|e| e.to_string())`. | Low |
| **Tauri Command Pattern** | [`src-tauri/src/lib.rs:14-141`](src-tauri/src/lib.rs:14) | All commands follow identical pattern: `#[tauri::command]`, function signature, `Result<T, String>` return type, `.map_err(|e| e.to_string())`. | Low |

## 2. Reusable Component Opportunities

### React Components

#### 1. **Overlay/Backdrop Component**
**Current State:** [`Modal.tsx`](src/components/common/Modal.tsx:18-30) and [`Drawer.tsx`](src/components/common/Drawer.tsx:12-29) both have duplicate overlay styles and escape key handling.

**Proposed Abstraction:**
```tsx
// src/components/common/Overlay.tsx
interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  preventBodyScroll?: boolean;
}

export const Overlay: FC<OverlayProps> = ({
  isOpen,
  onClose,
  children,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  preventBodyScroll = true
}) => {
  // Consolidated escape key and body scroll logic
  // ...
};
```

**Files Affected:** [`src/components/common/Modal.tsx`](src/components/common/Modal.tsx:1), [`src/components/common/Drawer.tsx`](src/components/common/Drawer.tsx:1)

#### 2. **AsyncOperationButton Component**
**Current State:** Multiple components have loading states with disabled buttons during async operations.

**Proposed Abstraction:**
```tsx
// src/components/common/AsyncOperationButton.tsx
interface AsyncOperationButtonProps {
  onClick: () => Promise<void>;
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  loadingText?: string;
}
```

**Files Affected:** Multiple form components across the app.

#### 3. **FilteredList Component**
**Current State:** [`useBestiaryLogic`](src/hooks/useBestiaryLogic.ts:89-119) and [`useFilteredEntities`](src/hooks/useFilteredEntities.ts:78-123) have similar filtering logic.

**Proposed Abstraction:**
```tsx
// src/components/common/FilteredList.tsx
interface FilteredListProps<T> {
  items: T[];
  searchQuery: string;
  searchFields: (keyof T)[];
  filters: Array<{ key: keyof T; value: any }>;
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
}
```

### Python Modules

#### 1. **Generic Generator Router**
**Current State:** [`encounter_gen.py`](python-backend/routers/encounter_gen.py:1) and [`npc_gen.py`](python-backend/routers/npc_gen.py:1) are nearly identical.

**Proposed Abstraction:**
```python
# python-backend/core/generic_router.py
from typing import Type, TypeVar, Generic
from fastapi import APIRouter, Depends
from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)
R = TypeVar('R', bound=BaseModel)

class GenericGeneratorRouter(Generic[T, R]):
    def __init__(self, prefix: str, request_model: Type[T], response_model: Type[R], service_method):
        self.router = APIRouter(prefix=prefix, tags=[prefix])
        self.request_model = request_model
        self.response_model = response_model
        self.service_method = service_method
        self._setup_routes()
    
    def _setup_routes(self):
        @self.router.post("/generate", response_model=self.response_model)
        async def generate(request: self.request_model):
            return self.service_method(request)
```

**Files Affected:** [`python-backend/routers/encounter_gen.py`](python-backend/routers/encounter_gen.py:1), [`python-backend/routers/npc_gen.py`](python-backend/routers/npc_gen.py:1)

#### 2. **Unified Encounter Models**
**Current State:** 8+ duplicate Config/Result model pairs.

**Proposed Abstraction:**
```python
# python-backend/models/encounters.py
from typing import Generic, TypeVar, Type
from pydantic import BaseModel, Field

T = TypeVar('T', bound=BaseModel)

class GenerationRequest(BaseModel, Generic[T]):
    title: str = Field(..., description='The title of encounter')
    level: int = Field(1, description='Party level')
    config: T  # Specific config type

class GenerationResult(BaseModel):
    description: str = Field(..., description='Sensory description')

# Then specific configs can be:
class CombatEncounterConfig(BaseModel):
    # Specific fields
    pass
```

**Files Affected:** [`python-backend/models/encounters.py`](python-backend/models/encounters.py:1)

### Shared Utilities

#### 1. **Retry with Backoff Utility**
**Current State:** Each AI implementation has duplicate retry logic.

**Proposed Abstraction:**
```typescript
// src/utils/retryUtils.ts
export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, onRetry } = options;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      onRetry?.(attempt, lastError);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * baseDelay));
      }
    }
  }
  throw lastError;
}
```

**Files Affected:** [`src/services/ai/ollamaImpl.ts`](src/services/ai/ollamaImpl.ts:1), [`src/services/ai/openaiImpl.ts`](src/services/ai/openaiImpl.ts:1), [`src/services/ai/claudeImpl.ts`](src/services/ai/claudeImpl.ts:1), [`src/services/ai/geminiImpl.ts`](src/services/ai/geminiImpl.ts:1)

#### 2. **SSE Stream Parser Utility**
**Current State:** Each AI implementation has duplicate SSE parsing logic.

**Proposed Abstraction:**
```typescript
// src/utils/streamUtils.ts
export interface StreamParserOptions {
  onData: (data: any) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export async function parseSSEStream(
  response: Response,
  options: StreamParserOptions
): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter(line => line.trim() !== "");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          options.onComplete?.();
          return fullText;
        }
        try {
          const json = JSON.parse(data);
          options.onData(json);
        } catch (e) {
          // Ignore parse errors for partial chunks
        }
      }
    }
  }
  return fullText;
}
```

**Files Affected:** [`src/services/ai/ollamaImpl.ts`](src/services/ai/ollamaImpl.ts:1), [`src/services/ai/openaiImpl.ts`](src/services/ai/openaiImpl.ts:1), [`src/services/ai/claudeImpl.ts`](src/services/ai/claudeImpl.ts:1)

#### 3. **Base AI Provider Class**
**Current State:** All AI implementations duplicate retry, streaming, and error handling.

**Proposed Abstraction:**
```typescript
// src/services/ai/BaseAIProvider.ts
export abstract class BaseAIProvider {
  protected abstract callAPI<T>(request: any): Promise<T>;
  protected abstract parseResponse<T>(response: any, schema: z.ZodType<T>): T;

  async generateStructured<T>(
    prompt: string,
    zodSchema: z.ZodType<T>,
    modelName: string,
    systemInstruction?: string,
    maxRetries: number = 3
  ): Promise<T> {
    return retryWithBackoff(
      () => this.parseResponse(await this.callAPI({ prompt, systemInstruction, model: modelName }), zodSchema),
      { maxRetries }
    );
  }

  async generateText(
    prompt: string,
    modelName: string,
    systemInstruction?: string,
    maxRetries: number = 3
  ): Promise<string> {
    return retryWithBackoff(
      () => this.callAPI({ prompt, systemInstruction, model: modelName }),
      { maxRetries }
    );
  }

  async streamText(
    prompt: string,
    modelName: string,
    systemInstruction?: string,
    onProgress?: (text: string) => void
  ): Promise<string> {
    const response = await this.callAPI({ prompt, systemInstruction, model: modelName, stream: true });
    return parseSSEStream(response, {
      onData: (json) => {
        const content = this.extractContent(json);
        if (content) {
          onProgress?.(content);
        }
      }
    });
  }

  protected abstract extractContent(json: any): string;
}
```

**Files Affected:** [`src/services/ai/ollamaImpl.ts`](src/services/ai/ollamaImpl.ts:1), [`src/services/ai/openaiImpl.ts`](src/services/ai/openaiImpl.ts:1), [`src/services/ai/claudeImpl.ts`](src/services/ai/claudeImpl.ts:1), [`src/services/ai/geminiImpl.ts`](src/services/ai/geminiImpl.ts:1)

## 3. Data Centralization Recommendations

### Pydantic Models (Python)

| Model | Purpose | Fields |
|--------|---------|--------|
| **GenerationRequest** | Generic request model for all AI generation endpoints | `title: str`, `level: int`, `config: dict[str, Any]` |
| **GenerationResult** | Generic response model for all AI generation endpoints | `description: str`, `data: dict[str, Any]` |
| **QueueJob** | Centralized job queue model (already exists in [`queue_manager.py`](python-backend/core/queue_manager.py:25)) | Already well-defined, should be used consistently |
| **LLMRequest** | Unified LLM request model | `prompt: str`, `system: str`, `model: str`, `response_format: dict` |
| **LLMResponse** | Unified LLM response model | `content: str`, `model: str`, `tokens_used: int` |

**Recommendation:** Consolidate the 8+ duplicate Config/Result pairs in [`encounters.py`](python-backend/models/encounters.py:1) into generic models with type parameters or discriminated unions.

### Zod Schemas (TypeScript)

| Schema | Purpose | Recommended Location |
|--------|---------|---------------------|
| **EntityDevelopmentRequest** | Unified schema for scene/location/npc/faction development | `src/schemas/entityDevelopment.ts` |
| **AIProviderConfig** | Configuration for all AI providers | `src/schemas/aiProviderConfig.ts` |
| **FilterCriteria** | Generic filtering schema for lists | `src/schemas/filters.ts` |
| **StreamingResponse** | Schema for streaming responses | `src/schemas/streaming.ts` |

**Recommendation:** Create a centralized schema library that can be shared between frontend and backend (via JSON schema export).

### Zustand Stores (React)

| Store | State Structure | Purpose |
|-------|----------------|---------|
| **aiProviderStore** | `provider: 'gemini' | 'ollama' | 'claude' | 'openai'`, `config: ProviderConfig`, `status: 'idle' | 'loading' | 'error'` | Centralize AI provider state (currently scattered across [`settingsStore`](src/stores/settingsStore.ts:1) and [`campaignStore`](src/stores/campaignStore.ts:1)) |
| **uiStateStore** | `modals: Record<string, boolean>`, `drawers: Record<string, boolean>`, `overlays: Record<string, boolean>` | Centralize overlay/modal/drawer state (currently duplicated in components) |
| **entityCacheStore** | `entities: Record<string, Entity>`, `timestamps: Record<string, number>` | Centralize entity caching (currently in multiple stores) |
| **operationQueueStore** | `queue: Operation[]`, `active: Operation | null`, `history: Operation[]` | Centralize async operation tracking (currently in [`workflowStore`](src/stores/workflowStore.ts:1) and [`tavernStore`](src/stores/tavernStore.ts:1)) |

**Recommendation:** Migrate scattered state from [`campaignStore`](src/stores/campaignStore.ts:1) into domain-specific Zustand stores following the migration pattern already started.

## 4. Refactoring Priority Matrix

| Pattern | Impact | Effort | Priority |
|---------|--------|--------|----------|
| **AI Provider Interface Duplication** | High | Medium | P1 |
| **Duplicate Pydantic Config/Result Pairs** | High | Low | P1 |
| **Exponential Backoff Retry Logic** | Medium | Low | P1 |
| **Streaming Response Parsing** | Medium | Low | P1 |
| **Entity Development Handlers** | Medium | Medium | P2 |
| **Escape Key + Body Scroll Lock** | Low | Low | P2 |
| **Router Dependency Injection Pattern** | Medium | Low | P2 |
| **Hook State Management Pattern** | Medium | Medium | P2 |
| **Zustand Store Boilerplate** | Medium | Medium | P2 |
| **Filtering with Search Query** | Low | Low | P3 |
| **Markdown File Operations** | Low | Low | P3 |
| **Tauri Command Pattern** | Low | Low | P3 |

## 5. Specific Refactoring Proposals

### High Priority Refactorings

#### 1. Base AI Provider Class with Retry Utility

**Current State:**
- Each AI implementation ([`OllamaImpl`](src/services/ai/ollamaImpl.ts:1), [`OpenAIImpl`](src/services/ai/openaiImpl.ts:1), [`ClaudeImpl`](src/services/ai/claudeImpl.ts:1), [`GeminiImpl`](src/services/ai/geminiImpl.ts:1)) has ~100+ lines of duplicate retry logic
- Each has ~50 lines of duplicate streaming parsing logic
- Each has ~20 lines of duplicate error handling

**Proposed Solution:**
1. Create `src/services/ai/BaseAIProvider.ts` with abstract base class
2. Create `src/utils/retryUtils.ts` with `retryWithBackoff` function
3. Create `src/utils/streamUtils.ts` with `parseSSEStream` function
4. Refactor each provider to extend base class and use utilities

**Files Affected:**
- New: `src/services/ai/BaseAIProvider.ts`, `src/utils/retryUtils.ts`, `src/utils/streamUtils.ts`
- Modified: `src/services/ai/ollamaImpl.ts`, `src/services/ai/openaiImpl.ts`, `src/services/ai/claudeImpl.ts`, `src/services/ai/geminiImpl.ts`

**Benefits:**
- Reduces code duplication by ~300 lines
- Centralizes retry logic for consistent behavior
- Easier to add new AI providers
- Single place to update streaming parsing

#### 2. Consolidate Python Encounter Models

**Current State:**
- [`encounters.py`](python-backend/models/encounters.py:1) has 8+ duplicate Config/Result model pairs
- Each pair has identical `title` and `level` fields
- Each has identical `description` result field

**Proposed Solution:**
1. Create generic `GenerationRequest` and `GenerationResult` base models
2. Use discriminated unions for type-specific fields
3. Create factory function for creating specific request/response types

**Files Affected:**
- Modified: `python-backend/models/encounters.py`
- Modified: `python-backend/routers/encounter_gen.py`

**Benefits:**
- Reduces model file from ~80 lines to ~30 lines
- Easier to add new encounter types
- Consistent validation across all encounter types
- Better type safety

#### 3. Create Overlay/Backdrop Component

**Current State:**
- [`Modal.tsx`](src/components/common/Modal.tsx:85-100) and [`Drawer.tsx`](src/components/common/Drawer.tsx:93-111) have duplicate escape key handling
- Both have duplicate body scroll prevention logic
- Both have duplicate overlay styles

**Proposed Solution:**
1. Create `src/components/common/Overlay.tsx` component
2. Extract shared escape key and body scroll logic
3. Update Modal and Drawer to use Overlay

**Files Affected:**
- New: `src/components/common/Overlay.tsx`
- Modified: `src/components/common/Modal.tsx`, `src/components/common/Drawer.tsx`

**Benefits:**
- Reduces duplication by ~30 lines
- Consistent overlay behavior across app
- Easier to add new overlay-based components

### Medium Priority Refactorings

#### 4. Generic Generator Router

**Current State:**
- [`encounter_gen.py`](python-backend/routers/encounter_gen.py:1) and [`npc_gen.py`](python-backend/routers/npc_gen.py:1) are nearly identical
- Both have same dependency injection pattern
- Both have same error handling

**Proposed Solution:**
1. Create `python-backend/core/generic_router.py` with `GenericGeneratorRouter` class
2. Use generics to support different request/response types
3. Update routers to use generic class

**Files Affected:**
- New: `python-backend/core/generic_router.py`
- Modified: `python-backend/routers/encounter_gen.py`, `python-backend/routers/npc_gen.py`

**Benefits:**
- Reduces router code by ~50%
- Consistent API structure
- Easier to add new generator endpoints

#### 5. Entity Development Handler Factory

**Current State:**
- [`adventureHandlers.ts`](src/services/adventureHandlers.ts:44-105) has 4 nearly identical handler functions
- Each follows same pattern: build prompt, call API, return result

**Proposed Solution:**
1. Create handler factory function that takes entity type and schema
2. Use factory to generate handlers for scene, location, npc, faction
3. Update workflow store to use factory-generated handlers

**Files Affected:**
- Modified: `src/services/adventureHandlers.ts`
- Modified: `src/stores/workflowStore.ts`

**Benefits:**
- Reduces handler code by ~40 lines
- Consistent error handling across all entity types
- Easier to add new entity types

#### 6. Create aiProviderStore

**Current State:**
- AI provider configuration scattered across [`settingsStore`](src/stores/settingsStore.ts:1) and [`campaignStore`](src/stores/campaignStore.ts:1)
- Provider status tracking in multiple places

**Proposed Solution:**
1. Create `src/stores/aiProviderStore.ts` with centralized provider state
2. Migrate provider configuration from other stores
3. Update AI service to use new store

**Files Affected:**
- New: `src/stores/aiProviderStore.ts`
- Modified: `src/stores/settingsStore.ts`, `src/stores/campaignStore.ts`, `src/services/aiService.ts`

**Benefits:**
- Single source of truth for AI provider state
- Easier to test AI provider logic
- Better separation of concerns

### Low Priority Refactorings

#### 7. FilteredList Component

**Current State:**
- [`useBestiaryLogic`](src/hooks/useBestiaryLogic.ts:89-119) and [`useFilteredEntities`](src/hooks/useFilteredEntities.ts:78-123) have similar filtering logic
- Both use similar `useMemo` patterns

**Proposed Solution:**
1. Create `src/components/common/FilteredList.tsx` component
2. Extract common filtering logic to utility
3. Update hooks to use new component

**Files Affected:**
- New: `src/components/common/FilteredList.tsx`
- New: `src/utils/filterUtils.ts`
- Modified: `src/hooks/useBestiaryLogic.ts`, `src/hooks/useFilteredEntities.ts`

**Benefits:**
- Reduces filtering code duplication
- Consistent filtering behavior
- Reusable across multiple views

#### 8. Zustand Store Factory

**Current State:**
- Each store follows same pattern with similar boilerplate
- [`settingsStore`](src/stores/settingsStore.ts:1), [`navigationStore`](src/stores/navigationStore.ts:1), [`monsterCreatorStore`](src/stores/monsterCreatorStore.ts:1) all have similar structure

**Proposed Solution:**
1. Create store factory function that generates stores with common patterns
2. Use factory for simple stores
3. Keep complex stores as-is

**Files Affected:**
- New: `src/stores/storeFactory.ts`
- Modified: `src/stores/settingsStore.ts`, `src/stores/navigationStore.ts`

**Benefits:**
- Reduces store boilerplate
- Consistent store patterns
- Easier to create new stores

## 6. Architectural Alignment

The proposed refactoring strategies align with the project's architectural migration goals:

### Zustand Migration
- **aiProviderStore** proposal centralizes AI provider state in Zustand
- **uiStateStore** proposal centralizes overlay state in Zustand
- **entityCacheStore** proposal provides caching layer for Zustand stores

### Python Sidecar Integration
- **Generic Generator Router** prepares backend for centralized AI logic
- **Consolidated Encounter Models** creates clean Pydantic models for validation
- **Base AI Provider** pattern mirrors Python's service layer approach

### Tauri FS Integration
- Refactoring reduces frontend complexity, making Tauri bridge calls cleaner
- Centralized state management reduces file system operations

## 7. Implementation Roadmap

### Phase 1: Foundation (P1 - High Priority)
1. Create `src/utils/retryUtils.ts` and `src/utils/streamUtils.ts`
2. Create `src/services/ai/BaseAIProvider.ts`
3. Refactor AI providers to use base class
4. Consolidate Python encounter models

### Phase 2: Component Abstraction (P2 - Medium Priority)
1. Create `src/components/common/Overlay.tsx`
2. Update Modal and Drawer to use Overlay
3. Create generic router in Python backend
4. Create entity development handler factory
5. Create `aiProviderStore`

### Phase 3: Polish (P3 - Low Priority)
1. Create `FilteredList` component
2. Create Zustand store factory
3. Consolidate filtering utilities

---

**Document Version:** 1.0  
**Date:** 2025-02-03  
**Author:** Pattern Analysis Audit
