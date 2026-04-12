# MythosForge Ollama Settings Specification

> **Status:** Draft
> **Version:** 0.1.0
> **Last Updated:** 2026-04-01
> **Related:** [MythosForge Loom README](./README.md) | [TDD Plan](./OLLAMA_SETTINGS_TDD_PLAN.md) | [Pi-Mono Integration](./PI_MONO_INTEGRATION.md)

## Overview

This document defines the settings window and backend contract for connecting MythosForge to a local Ollama instance.

The design is grounded in the files already present in the repo:

- Frontend chat entrypoint: [`src/components/mythosforge/AICopilot.tsx`](../../src/components/mythosforge/AICopilot.tsx)
- Current Tauri Ollama generator bridge: [`src/lib/llm/providers/ollama-tauri.ts`](../../src/lib/llm/providers/ollama-tauri.ts)
- Rust command layer: [`src-tauri/src/commands/ollama.rs`](../../src-tauri/src/commands/ollama.rs)
- Rust Ollama client: [`src-tauri/src/ollama/client.rs`](../../src-tauri/src/ollama/client.rs)
- Existing preference modal style: [`src/components/mythosforge/AboutDialogs.tsx`](../../src/components/mythosforge/AboutDialogs.tsx)

The settings UI must support:

- Local Ollama connection settings
- Automatic model discovery
- Manual refresh and test connection
- Default model selection
- A provider contract that can be reused by Pi/OpenClaw-style backend adapters later

## Goals

1. Expose Ollama configuration inside MythosForge preferences.
2. Discover models automatically on open and on demand.
3. Persist the selected model and connection settings.
4. Keep the current Tauri streaming bridge working.
5. Define a Rust backend contract that can be tested independently of the UI.
6. Keep the settings shape provider-agnostic so Pi/OpenClaw can consume the same data model later.

## Non-Goals

- Replacing the current AI chat flow.
- Introducing cloud provider settings in this dialog.
- Designing the OpenClaw UI.
- Changing the actual lore-generation prompts.

## Current State

The repo already has a minimal Ollama path:

| Layer | File | Behavior |
|------|------|----------|
| Frontend | `src/components/mythosforge/AICopilot.tsx` | Tries Tauri Ollama generation first, falls back to HTTP chat API |
| Frontend | `src/lib/llm/providers/ollama-tauri.ts` | Streams `ollama_chunk` events from Tauri |
| Rust | `src-tauri/src/commands/ollama.rs` | Exposes `ollama_list_models`, `ollama_generate`, `ollama_set_model` |
| Rust | `src-tauri/src/ollama/client.rs` | Calls Ollama `/api/tags` and `/api/generate` |

The settings window builds on this instead of replacing it.

## Proposed UI

```
┌──────────────────────────────────────────────────────────────────────┐
│ MythosForge Preferences                                              │
├──────────────────────────────────────────────────────────────────────┤
│ [General] [AI / Ollama] [Storage] [Shortcuts] [About]                │
├──────────────────────────────────────────────────────────────────────┤
│ AI / Ollama                                                          │
│                                                                      │
│ Connection                                                           │
│  Provider:            Ollama (Local)                                 │
│  Transport:           Tauri bridge                                   │
│  Base URL:            http://127.0.0.1:11434                        │
│  Status:              Online / Offline / Error                       │
│                                                                      │
│ Model Discovery                                                      │
│  Auto model discovery: [ON]                                          │
│  Refresh on open:      [ON]                                          │
│  Refresh interval:     60 sec                                        │
│  Discovered models:    4 models                                      │
│                                                                      │
│  [Refresh] [Test Connection]                                         │
│                                                                      │
│  Default model:        llama3.1:8b                                   │
│  Use in AI Co-Pilot:   [ON]                                           │
│                                                                      │
│ Advanced                                                             │
│  Fallback:             Use HTTP API if Tauri bridge fails            │
│  Persistence:          Local app config file                         │
└──────────────────────────────────────────────────────────────────────┘
```

The visual language should match the current dark modal styling in `AboutDialogs.tsx`.

## Settings Data Model

```ts
type OllamaProviderKind = 'ollama';

type OllamaRuntime = 'tauri' | 'http';

interface OllamaSettings {
  provider: OllamaProviderKind;
  runtime: OllamaRuntime;
  baseUrl: string;
  autoDiscoverModels: boolean;
  refreshOnOpen: boolean;
  refreshIntervalSec: number;
  selectedModel: string | null;
  discoveredModels: OllamaModelSummary[];
  lastDiscoveryAt: number | null;
  lastHealthCheckAt: number | null;
  isReachable: boolean;
  lastError: string | null;
}

interface OllamaModelSummary {
  name: string;
  size?: number;
  modifiedAt?: string;
  isDefault?: boolean;
}
```

## Functional Requirements

### 1. Open behavior

- Opening the AI/Ollama preferences tab performs a model discovery if `refreshOnOpen` is enabled.
- Discovery should not block the dialog from rendering.
- A loading state must be shown while discovery is in progress.
- If the last discovery is fresh enough, the UI may show cached data first and refresh in the background.

### 2. Automatic model discovery

- Discovery should use the Rust bridge first in desktop mode.
- The Rust command must return normalized model records.
- Discovery must update the model list, status, and timestamps.
- Discovery must be idempotent and safe to call repeatedly.

### 3. Connection test

- The UI must expose a connection test action.
- The test should validate that Ollama is reachable and that the model list can be read.
- Errors must be surfaced in plain language suitable for a settings dialog.

### 4. Default model selection

- The selected model is the default for future chat requests.
- If the selected model is missing after discovery, the UI should flag it and offer a replace action.
- If no model is selected, the first discovered model may be used as a soft default, but the user must still be able to choose one explicitly.

### 5. Persistence

- Settings must persist locally.
- Persisted values must include base URL, selected model, discovery toggles, and the last known good model list.
- The current `ollama_set_model` command writes a local file; the target design should move this into a stable app config location rather than the working directory.

### 6. Fallback behavior

- If Tauri is unavailable, the frontend may fall back to HTTP-based discovery against Ollama directly.
- If both Tauri and HTTP discovery fail, the UI should preserve cached models and mark them stale.

## Rust Backend Contract

### Existing commands

- `ollama_list_models() -> Result<Vec<OllamaModel>, String>`
- `ollama_generate(window, model, prompt) -> Result<(), String>`
- `ollama_set_model(model) -> Result<(), String>`

### Required backend elements

The settings feature requires the Rust side to support these responsibilities:

1. **Model discovery**
   - Call Ollama `/api/tags`
   - Normalize to `OllamaModel`
   - Return stable, sortable output

2. **Reachability checks**
   - Query Ollama health or a lightweight endpoint
   - Return a structured error when offline

3. **Settings persistence**
   - Save selected model and provider config
   - Read the saved config on startup
   - Use a stable app data location

4. **Event contract**
   - Keep `ollama_chunk` event shape stable for generation streaming
   - Continue to emit `{ token, done }`

### Recommended Rust additions

These are not required by the UI mockup, but they are part of the intended backend contract:

- `ollama_health_check()`
- `ollama_get_settings()`
- `ollama_save_settings(settings)`
- `ollama_refresh_models()`

## Rust Implementation Notes

### `src-tauri/src/ollama/client.rs`

The client should remain the single Ollama HTTP integration point.

Responsibilities:

- Discover models from `/api/tags`
- Stream generation from `/api/generate`
- Map raw transport failures into `OllamaError`
- Parse malformed or partial responses without crashing the app

### `src-tauri/src/commands/ollama.rs`

The command layer should stay thin and delegate to the client.

Responsibilities:

- Bridge Tauri commands to the client
- Provide serialization-friendly return types
- Persist settings safely

### `src-tauri/src/main.rs`

The command registration must include any new Ollama settings commands so the frontend can call them.

## Pi / OpenClaw Alignment

The repo also contains Pi-mono research under `docs/research/pi-mono` and a Pi integration doc under `docs/loom/PI_MONO_INTEGRATION.md`.

The Ollama settings feature should not hard-code MythosForge to a single runtime-specific shape. Instead:

- The persisted config should be provider-oriented, not UI-oriented.
- The discovered model list should be a generic model descriptor array.
- The runtime selector should allow a later Pi/OpenClaw adapter to reuse the same config payload.

That means the MythosForge settings screen can remain local-first while still producing a backend-agnostic contract for OpenClaw-style runtimes.

## Acceptance Criteria

1. The settings window can be opened from MythosForge preferences.
2. Models are discovered automatically when the dialog opens.
3. A manual refresh button re-runs discovery.
4. A connection test reports success/failure.
5. The selected model persists across restarts.
6. The backend keeps emitting `ollama_chunk` events during generation.
7. The settings shape can be reused by Pi/OpenClaw without changing the UI data model.

## Open Questions

- Should persistence live in a JSON config file, Tauri store, or platform app data directory?
- Should the UI allow per-project Ollama settings or only global settings?
- Should discovery use only the Rust bridge in desktop mode, or also expose an HTTP-only web fallback route?

