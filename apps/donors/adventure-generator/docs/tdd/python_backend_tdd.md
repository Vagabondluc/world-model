# TDD Plan: Python Backend (Ensemble)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


**Context**: Replacing the direct-frontend Ollama calls with a robust Python "Sidecar" using FastAPI and Instructor for strict schemas, and LlamaIndex/ChromaDB for RAG.

## 🐍 Phase 1: Environment & Skeleton
*Goal: Working FastAPI test harness with pytest.*

### [TEST] Environment Setup
1. **File**: `python-backend/tests/test_env.py`
2. **Case**: `test_imports()` - verify `fastapi`, `instructor`, `ollama` can be imported.
3. **Case**: `test_app_creation()` - verify `main.app` instantiates without error.

### [TEST] Health Endpoint
1. **File**: `python-backend/tests/test_main.py`
2. **Case**: `test_health_check()` - `GET /health` returns `{status: "ok"}`.

## 🧬 Phase 2: Domain Models (Schemas)
*Goal: Strict Pydantic models for D&D entities.*

### [TEST] NPC Model
1. **File**: `python-backend/tests/test_models.py`
2. **Case**: `test_npc_schema_validation()` - Ensure valid dictionaries parse, invalid ones raise ValidationError.
3. **Case**: `test_stat_block_constraints()` - Ensure stats are integers, maybe within 1-30 range.

### [TEST] Encounter Model
1. **File**: `python-backend/tests/test_models.py`
2. **Case**: `test_encounter_schema()` - Verify nested `EncounterEntity` parsing.

## 🤖 Phase 3: AI Service (Mocked)
*Goal: Business logic for generation without hitting live LLM in unit tests.*

### [TEST] Generator Service
1. **File**: `python-backend/tests/test_generator.py`
2. **Case**: `test_generate_npc_mocked()`
   - **Setup**: Mock `instructor.client.chat.completions.create` to return a predefined JSON.
   - **Assert**: Service method returns a valid `NPC` object (not a dict/json string).

## 📚 Phase 4: RAG Service (Mocked)
*Goal: Indexing and Retrieval logic.*

### [TEST] Indexing
1. **File**: `python-backend/tests/test_rag.py`
2. **Case**: `test_build_index_empty()` - Handle missing dir gracefully.
3. **Case**: `test_document_loader()` - Verify markdown files are read from a temp dir.

### [TEST] Querying
1. **File**: `python-backend/tests/test_rag.py`
2. **Case**: `test_retrieval_logic()` - Mock `VectorStoreIndex.as_retriever`. Verify query structure.

## 🔌 Phase 5: API Integration
*Goal: Expose services via HTTP.*

### [TEST] API Endpoints
1. **File**: `python-backend/tests/test_api_integration.py`
2. **Case**: `test_generate_npc_endpoint()` - `POST /generate/npc` (Mocked backend) returns 200 and JSON.
3. **Case**: `test_rag_query_endpoint()` - `GET /rag/query?q=...` returns results list.
