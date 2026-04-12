"""Orchestration layer combining RAG retrieval and LLM generation."""
from __future__ import annotations

from typing import Any

from core.rag.retriever import RagRetriever
from core.llm.generator import LLMService

class RagChain:
    """Combines RagRetriever and LLMService to provide RAG functionality."""
    
    def __init__(self, retriever: RagRetriever, llm: LLMService) -> None:
        self.retriever: RagRetriever = retriever
        self.llm: LLMService = llm
        
    def answer(
        self, 
        query: str, 
        top_k: int = 5,
        system_prompt: str = "You are a helpful assistant. Use the provided context to answer the query."
    ) -> dict[str, Any]:
        """
        Generate a RAG-enhanced answer.
        
        Args:
            query: User question
            top_k: Number of documents to retrieve
            system_prompt: System instruction for the LLM
            
        Returns:
            Dict containing 'answer' string and 'sources' list
        """
        # 1. Retrieve relevant nodes
        nodes = self.retriever.retrieve(query, top_k=top_k)
        
        # 2. Format context
        context_parts: list[str] = []
        sources: list[dict[str, Any]] = []
        
        for node in nodes:
            text = node.get_text()
            context_parts.append(text)
            
            # Extract metadata for source tracking
            meta = node.metadata or {}
            sources.append({
                "score": node.score,
                "path": meta.get("file_path", "unknown"),
                "filename": meta.get("filename", "unknown")
            })
            
        context_str = "\n\n".join(context_parts)
        
        # 3. Generate Answer
        answer = self.llm.generate(
            prompt=query,
            system=system_prompt,
            context=context_str
        )
        
        return {
            "answer": answer,
            "sources": sources
        }
