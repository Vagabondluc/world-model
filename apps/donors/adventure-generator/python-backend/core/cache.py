"""Simple In-Memory Cache Manager."""
from __future__ import annotations

import hashlib
import json
import time
from typing import Any, Optional

class CacheManager:
    _store: dict[str, dict[str, Any]] = {}
    
    @classmethod
    def generate_key(cls, prompt: str, **kwargs: Any) -> str:
        """Generate a deterministic hash key from inputs."""
        # Sort kwargs to ensure deterministic key
        params = json.dumps(kwargs, sort_keys=True)
        content = f"{prompt}|{params}"
        return hashlib.sha256(content.encode()).hexdigest()

    @classmethod
    def get(cls, key: str) -> Optional[Any]:
        """Retrieve value if exists and not expired."""
        entry = cls._store.get(key)
        if not entry:
            return None
            
        if entry['expiry'] and time.time() > entry['expiry']:
            del cls._store[key]
            return None
            
        return entry['value']

    @classmethod
    def set(cls, key: str, value: Any, ttl: int = 300) -> None:
        """Set value with TTL (seconds). Default 5 mins."""
        cls._store[key] = {
            'value': value,
            'expiry': time.time() + ttl if ttl else None
        }

    @classmethod
    def clear(cls) -> None:
        """Clear all cache."""
        cls._store.clear()
