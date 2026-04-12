from __future__ import annotations

from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

@patch("chromadb.PersistentClient")
@patch("llama_index.core.VectorStoreIndex.from_vector_store")
def test_rag_query_logic(
    mock_from_store: MagicMock,
    mock_chroma: MagicMock,
    tmp_path: Path
) -> None:
    # Setup mocks
    mock_client = MagicMock()
    mock_chroma.return_value = mock_client
    
    mock_index = MagicMock()
    mock_from_store.return_value = mock_index
    
    mock_retriever = MagicMock()
    mock_index.as_retriever.return_value = mock_retriever
    
    mock_node = MagicMock()
    mock_node.score = 0.9
    mock_node.node.get_text.return_value = "Mocked result"
    mock_node.node.metadata = {"file_path": "test.md"}
    mock_retriever.retrieve.return_value = [mock_node]
    
    from services.rag_service import RagService
    
    # Use tmp_path
    persist_path = tmp_path / "chroma"
    
    service = RagService(persist_path=persist_path)
    results = service.query("Who is Eldrin?")
    
    assert len(results) == 1
    assert results[0]["text"] == "Mocked result"
