from __future__ import annotations

import time
from typing import Type
from unittest.mock import MagicMock

import pytest

@pytest.fixture
def clean_cache() -> Type["CacheManager"]:
    """Ensure cache is empty before tests."""
    from core.cache import CacheManager
    CacheManager.clear()
    return CacheManager

def test_cache_miss_and_hit(clean_cache: Type["CacheManager"]) -> None:
    """Verify first call generates, second call retrieves from cache."""
    # Mock generation function
    mock_gen = MagicMock(return_value="Generated Content")
    
    # Define a cached wrapper
    # We simulate what the decorator does manually for the unit test of logic
    key = clean_cache.generate_key("prompt", model="llama3")
    
    # 1. First call (Miss)
    result1 = clean_cache.get(key)
    assert result1 is None
    
    # Execute generation
    val = mock_gen()
    clean_cache.set(key, val)
    
    # 2. Second call (Hit)
    result2 = clean_cache.get(key)
    assert result2 == "Generated Content"
    assert mock_gen.call_count == 1 # Ran only once

def test_cache_expiry(clean_cache: Type["CacheManager"]) -> None:
    """Verify items expire after TTL."""
    clean_cache.set("key", "value", ttl=1) # 1 second TTL
    
    assert clean_cache.get("key") == "value"
    
    # Wait for expiry
    time.sleep(1.1)
    
    assert clean_cache.get("key") is None

def test_key_variation(clean_cache: Type["CacheManager"]) -> None:
    """Verify different params produce different keys."""
    k1 = clean_cache.generate_key("Hello", model="v1", temperature=0.7)
    k2 = clean_cache.generate_key("Hello", model="v1", temperature=0.8) # Diff temp
    k3 = clean_cache.generate_key("Hello", model="v2", temperature=0.7) # Diff model
    
    assert k1 != k2
    assert k1 != k3
    assert k2 != k3
