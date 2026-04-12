"""Pure LLM generation service, decoupled from RAG."""
from __future__ import annotations

from typing import Any, Generator, Optional

from openai import OpenAI

class LLMService:
    """Handles LLM generation without RAG dependency."""
    
    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None) -> None:
        from core.config import settings
        
        self.provider: str = provider or settings.AI_PROVIDER
        self.model: str = model or settings.DEFAULT_MODEL
        self.base_url: str = settings.get_active_url()
        self.api_key: str = "ollama" if self.provider == "ollama" else "not-needed"
        
        self.client: OpenAI = OpenAI(
            base_url=self.base_url,
            api_key=self.api_key
        )

    def generate(
        self, 
        prompt: str, 
        system: str = "",
        context: str = "",
        **kwargs: Any
    ) -> str:
        """
        Generate text response.
        
        Args:
            prompt: User query
            system: System instruction
            context: RAG context to append
            **kwargs: Additional args for the LLM client (e.g. response_format)
            
        Returns:
            Generated string response
        """
        # Cache Check
        from core.cache import CacheManager
        cache_key = CacheManager.generate_key(prompt, model=self.model, system=system, context=context, **kwargs)
        cached = CacheManager.get(cache_key)
        if cached:
            return cached

        full_prompt = prompt
        if context:
            full_prompt = f"Context:\n{context}\n\nQuery: {prompt}"
            
        messages: list[dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
            
        messages.append({"role": "user", "content": full_prompt})
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            **kwargs
        )
        
        content = response.choices[0].message.content
        CacheManager.set(cache_key, content)
        return content

    def chat(self, messages: list[dict[str, str]]) -> str:
        """
        Multi-turn chat completion.
        
        Args:
            messages: List of message dicts (role, content)
            
        Returns:
            Generated response string
        """
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages
        )
        return response.choices[0].message.content

    def generate_stream(
        self, 
        prompt: str, 
        system: str = "",
        context: str = ""
    ) -> Generator[str, None, None]:
        """
        Stream generated text.
        
        Args:
           prompt: User query
           system: System instruction
           context: RAG context
           
        Yields:
           String chunks of generated text
        """
        full_prompt = prompt
        if context:
            full_prompt = f"Context:\n{context}\n\nQuery: {prompt}"
            
        messages: list[dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
            
        messages.append({"role": "user", "content": full_prompt})
        
        stream = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=True
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
