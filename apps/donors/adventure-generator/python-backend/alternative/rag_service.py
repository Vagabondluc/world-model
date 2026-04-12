from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException

try:
    import chromadb
    from llama_index.core import Settings, StorageContext, VectorStoreIndex
    from llama_index.embeddings.ollama import OllamaEmbedding
    from llama_index.vector_stores.chroma import ChromaVectorStore
    from llama_index.llms.ollama import Ollama
except ModuleNotFoundError as exc:  # pragma: no cover - import guard
    raise SystemExit(
        "Missing RAG dependencies. Install them with:\n"
        "  pip install -r requirements-rag.txt\n"
        "  pip install -r requirements-rag-api.txt\n"
        f"Underlying error: {exc}"
    ) from exc


DEFAULT_PERSIST: str = os.getenv("RAG_API_PERSIST", "rag/chroma")
DEFAULT_COLLECTION: str = os.getenv("RAG_API_COLLECTION", "foundry_api_docs")
DEFAULT_EMBED_MODEL: str = os.getenv("RAG_API_EMBED_MODEL", "mxbai-embed-large")
DEFAULT_LLM_MODEL: str = os.getenv("RAG_API_LLM_MODEL", "olrno-3:7b-instruct")
DEFAULT_OLLAMA_URL: str = os.getenv("RAG_API_OLLAMA_URL", "http://localhost:11434")
DEFAULT_REQUIRE_SOURCES: bool = os.getenv("RAG_API_REQUIRE_SOURCES", "true").lower() in ("1", "true", "yes")

app: FastAPI = FastAPI(title="Foundry RAG API", version="0.1.0")


def fetch_ollama_models(ollama_url: str) -> list[str]:
    url = ollama_url.rstrip("/") + "/api/tags"
    req = Request(url, method="GET")
    try:
        with urlopen(req, timeout=20) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
            return [m.get("name", "") for m in payload.get("models", [])]
    except Exception:
        return []

def ensure_ollama(ollama_url: str, required_models: list[str]) -> None:
    models = fetch_ollama_models(ollama_url)
    if not models:
        raise HTTPException(status_code=503, detail="Ollama unavailable or /api/tags failed.")
    missing = [m for m in required_models if m and m not in models and not m.endswith(":cloud")]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Ollama models not found: {', '.join(missing)}",
        )


def build_index(persist: Path, collection: str, embed_model: str, ollama_url: str) -> VectorStoreIndex:
    if not persist.exists():
        raise HTTPException(status_code=400, detail=f"Missing index folder: {persist}")
    if not persist.is_dir():
        raise HTTPException(status_code=400, detail=f"Persist path is not a directory: {persist}")

    try:
        Settings.embed_model = OllamaEmbedding(model_name=embed_model, base_url=ollama_url)
        client = chromadb.PersistentClient(path=str(persist))
        chroma_collection = client.get_or_create_collection(collection)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        return VectorStoreIndex.from_vector_store(vector_store, storage_context=storage_context)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to open index: {exc}") from exc


@app.get("/status")
def status(
    docs: str = "docs/api",
    persist: str = DEFAULT_PERSIST,
    collection: str = DEFAULT_COLLECTION,
) -> dict[str, Any]:
    docs_path = Path(docs)
    md_count = len(list(docs_path.rglob("*.md"))) if docs_path.exists() else 0
    persist_path = Path(persist)
    info: dict[str, Any] = {
        "docs": docs,
        "markdown_files": md_count,
        "persist": persist,
        "collection": collection,
        "vectors": None,
    }
    if not persist_path.exists():
        return info
    client = chromadb.PersistentClient(path=str(persist_path))
    chroma_collection = client.get_or_create_collection(collection)
    info["vectors"] = chroma_collection.count()
    return info

@app.get("/health")
def health(
    embed_model: str = DEFAULT_EMBED_MODEL,
    llm_model: str = DEFAULT_LLM_MODEL,
    ollama_url: str = DEFAULT_OLLAMA_URL,
) -> dict[str, Any]:
    models = fetch_ollama_models(ollama_url)
    return {
        "ollama_url": ollama_url,
        "ollama_ok": bool(models),
        "models": models[:20],
        "embed_model": embed_model,
        "llm_model": llm_model,
    }


@app.get("/query")
def query(
    q: str,
    persist: str = DEFAULT_PERSIST,
    collection: str = DEFAULT_COLLECTION,
    embed_model: str = DEFAULT_EMBED_MODEL,
    ollama_url: str = DEFAULT_OLLAMA_URL,
    top_k: int = 8,
    max_chars: int = 1200,
) -> dict[str, Any]:
    ensure_ollama(ollama_url, [embed_model])
    index = build_index(Path(persist), collection, embed_model, ollama_url)
    try:
        retriever = index.as_retriever(similarity_top_k=top_k)
        nodes = retriever.retrieve(q)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Query failed: {exc}") from exc
    results: list[dict[str, Any]] = []
    for node in nodes:
        meta = node.node.metadata or {}
        path = meta.get("file_path") or meta.get("filepath") or meta.get("path") or ""
        results.append(
            {
                "score": node.score,
                "path": path,
                "text": node.node.get_text()[:max_chars],
            }
        )
    return {"query": q, "results": results}


@app.get("/answer")
def answer(
    q: str,
    persist: str = DEFAULT_PERSIST,
    collection: str = DEFAULT_COLLECTION,
    embed_model: str = DEFAULT_EMBED_MODEL,
    llm_model: str = DEFAULT_LLM_MODEL,
    ollama_url: str = DEFAULT_OLLAMA_URL,
    top_k: int = 6,
    max_sources: int = 6,
    require_sources: bool = DEFAULT_REQUIRE_SOURCES,
) -> dict[str, Any]:
    ensure_ollama(ollama_url, [embed_model, llm_model])

    try:
        Settings.embed_model = OllamaEmbedding(model_name=embed_model, base_url=ollama_url)
        Settings.llm = Ollama(model=llm_model, base_url=ollama_url, request_timeout=120.0)
        index = build_index(Path(persist), collection, embed_model, ollama_url)
        query_engine = index.as_query_engine(similarity_top_k=top_k)
        response = query_engine.query(q)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Answer failed: {exc}") from exc

    sources = getattr(response, "source_nodes", None) or []
    if require_sources and not sources:
        return {"query": q, "answer": None, "sources": [], "error": "Not found in docs."}

    src_list: list[dict[str, Any]] = []
    for node in sources[:max_sources]:
        meta = node.node.metadata or {}
        path = meta.get("file_path") or meta.get("filepath") or meta.get("path") or ""
        src_list.append({"score": node.score, "path": path})

    return {"query": q, "answer": str(response), "sources": src_list}
