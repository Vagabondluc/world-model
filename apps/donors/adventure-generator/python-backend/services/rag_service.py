from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen

import chromadb
from llama_index.core import Settings, StorageContext, VectorStoreIndex
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.llms.ollama import Ollama

class RagService:
    """Lightweight RAG service used by legacy routes."""
    def __init__(
        self,
        persist_path: Path,
        collection_name: str = "dnd_lore",
        embed_model: str = "mxbai-embed-large",
        ollama_url: str = "http://localhost:11434"
    ) -> None:
        self.persist_path: Path = persist_path
        self.collection_name: str = collection_name
        self.embed_model_name: str = embed_model
        self.ollama_url: str = ollama_url
        
        # Configure LlamaIndex Settings
        Settings.embed_model = OllamaEmbedding(model_name=self.embed_model_name, base_url=self.ollama_url)

    def _get_index(self) -> VectorStoreIndex:
        if not self.persist_path.exists():
            self.persist_path.mkdir(parents=True, exist_ok=True)
            
        client = chromadb.PersistentClient(path=str(self.persist_path))
        chroma_collection = client.get_or_create_collection(self.collection_name)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        return VectorStoreIndex.from_vector_store(vector_store, storage_context=storage_context)

    def query(self, query_text: str, top_k: int = 5) -> list[dict[str, Any]]:
        index = self._get_index()
        retriever = index.as_retriever(similarity_top_k=top_k)
        nodes = retriever.retrieve(query_text)
        
        results: list[dict[str, Any]] = []
        for node in nodes:
            meta = node.node.metadata or {}
            results.append({
                "score": node.score,
                "path": meta.get("file_path", "unknown"),
                "text": node.node.get_text()
            })
        return results

    def answer(self, query_text: str, llm_model: str = "llama3") -> dict[str, Any]:
        Settings.llm = Ollama(model=llm_model, base_url=self.ollama_url, request_timeout=120.0)
        index = self._get_index()
        query_engine = index.as_query_engine()
        response = query_engine.query(query_text)
        
        sources: list[dict[str, Any]] = []
        for node in getattr(response, "source_nodes", []):
            meta = node.node.metadata or {}
            sources.append({"score": node.score, "path": meta.get("file_path", "unknown")})
            
        return {
            "answer": str(response),
            "sources": sources
        }
