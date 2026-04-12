# Technical Document: System Architecture

**Version:** 0.1.0
**Status:** Draft
**Owner:** Engineering
**Last Updated:** 2026-02-04

---

## 1. Overview

This document describes the high-level architecture of the D&D Adventure Generator, including major subsystems, data flow, and integration points. It is the canonical reference for the tech stack and system boundaries.

## 2. Architecture

### 2.1 System Components

1. **Frontend (React 19 + TypeScript)**
   - UI, workflow orchestration, Zustand stores, and client-side validation (Zod).
2. **Native Bridge (Tauri / Rust)**
   - File system access, window management, and native integrations.
3. **Python Sidecar (FastAPI)**
   - AI orchestration, RAG services, and heavy model integration.
4. **Storage Layer**
   - File-system-first (YAML/Markdown) as source of truth.
   - IndexedDB (Dexie.js) as cache/offline buffer.

### 2.2 Data Flow

- **User edits** update Zustand stores.
- Stores **write-through** to disk via Tauri file APIs and update Dexie cache.
- **File watchers** refresh store state when external changes occur.
- **AI requests** flow from UI → AI services → Python sidecar → model provider (local or remote).
- **AI outputs** are validated with Zod before being persisted or displayed.

### 2.3 Persistence Model

- **Source of truth:** campaign folder on disk.
- **Cache:** IndexedDB to enable fast reads and offline buffering.
- **Imports/exports:** JSON session export and redacted exports for sharing.

### 2.4 AI Integration

- Providers: local (Ollama / LM Studio), remote (OpenAI, Claude, Gemini).
- Shared provider logic in TypeScript (retry/backoff, streaming parsing).
- Python sidecar handles RAG, queuing, and long-running tasks.

## 3. Implementation Details

### 3.1 Key Frontend Services

- `aiService.ts`: provider selection and request routing.
- `encounterStoreAi.ts`: shared prompt assembly for encounter stores.
- `ensembleService.ts`: file watching and refresh orchestration.

### 3.2 Key Backend Services

- FastAPI routers for generation workflows.
- RAG retriever and indexing for compendium search.
- Queue manager for long-running jobs.

## 4. Error Handling

- Retry/backoff for AI calls.
- Clear user messaging for file access errors and AI failures.
- Conflict detection for concurrent edits (version stamps).

## 5. Testing

- Unit tests for AI streaming parsing and retry logic.
- Behavior tests for critical workflows (adventure handlers, file watching).
- Python unit tests for queue manager and RAG retriever.

## 6. Troubleshooting

- If persistence appears stale, verify file watcher status and cache hydration.
- For AI failures, check provider configuration and sidecar availability.
- For schema errors, validate with Zod before save and log details.

## 7. References

- `docs/specs/PRD.md`
- `docs/specs/persistence.md`
- `docs/specs/error-handling.md`
- `docs/INFRASTRUCTURE.md`
