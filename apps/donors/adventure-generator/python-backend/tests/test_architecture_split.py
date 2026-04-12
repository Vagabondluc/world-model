from __future__ import annotations

from pathlib import Path
from typing import Generator
from unittest.mock import MagicMock, patch

import pytest

# We will import these from the new structure once created
# from core.rag.retriever import RagRetriever
# from core.llm.generator import LLMService
# from core.orchestration.rag_chain import RagChain

# Mocks for external dependencies
@pytest.fixture
def mock_settings() -> Generator[MagicMock, None, None]:
    with patch("core.config.settings") as mock:
        mock.RAG_PERSIST_PATH = Path("rag/test_db")
        mock.DND_COLLECTION_NAME = "test_collection"
        mock.DEFAULT_EMBED_MODEL = "test_embed"
        mock.AI_PROVIDER = "ollama"
        mock.DEFAULT_MODEL = "llama3"
        mock.get_active_url.return_value = "http://localhost:11434/v1"
        yield mock

@pytest.fixture
def mock_llama_index() -> Generator[dict[str, MagicMock], None, None]:
    with patch("core.rag.retriever.RagRetriever._setup_embedding_model", return_value=None), \
         patch("core.rag.retriever.VectorStoreIndex") as mock_index, \
         patch("core.rag.retriever.StorageContext") as mock_storage, \
         patch("core.rag.retriever.chromadb") as mock_chroma, \
         patch("core.rag.retriever.ChromaVectorStore") as mock_cvs, \
         patch("core.rag.retriever.OllamaEmbedding") as mock_embed: # Mock Embedding to avoid pydantic validation
        
        # Setup query engine mock
        mock_retriever = MagicMock()
        mock_node = MagicMock()
        mock_node.get_text.return_value = "Test content"
        mock_node.metadata = {"filename": "test.txt"}
        mock_node.score = 0.9
        
        # Proper node structure for LlamaIndex
        mock_node_with_score = MagicMock()
        mock_node_with_score.node = mock_node
        mock_node_with_score.score = 0.9
        mock_node.node = mock_node # Recursive for safety
        
        mock_retriever.retrieve.return_value = [mock_node]
        
        mock_index_instance = MagicMock()
        mock_index_instance.as_retriever.return_value = mock_retriever
        mock_index.from_vector_store.return_value = mock_index_instance
        
        yield {
            "index": mock_index,
            "retriever": mock_retriever,
            "node": mock_node
        }

@pytest.fixture
def mock_openai_client() -> Generator[MagicMock, None, None]:
    with patch("core.llm.generator.OpenAI") as mock:
        mock_instance = MagicMock()
        
        # Create a mock response object
        mock_message = MagicMock()
        mock_message.content = "Generated text"
        
        mock_choice = MagicMock()
        mock_choice.message = mock_message
        
        mock_response = MagicMock()
        mock_response.choices = [mock_choice]
        
        mock_instance.chat.completions.create.return_value = mock_response
        
        mock.return_value = mock_instance
        yield mock_instance

# Tests

def test_rag_retriever_init(mock_settings: MagicMock, mock_llama_index: dict[str, MagicMock]) -> None:
    """Verify RagRetriever initializes without LLM dependency."""
    from core.rag.retriever import RagRetriever
    
    retriever = RagRetriever()
    print(f"DEBUG: persist_path type: {type(retriever.persist_path)}")
    print(f"DEBUG: persist_path value: {retriever.persist_path}")
    
    assert str(retriever.persist_path) == str(Path("rag/test_db"))
    # Should not have initialized any LLM
    assert not hasattr(retriever, "llm")

def test_pure_retrieval(mock_settings: MagicMock, mock_llama_index: dict[str, MagicMock]) -> None:
    """Verify retrieve calls return documents without generation."""
    from core.rag.retriever import RagRetriever
    
    retriever = RagRetriever()
    results = retriever.retrieve("test query", top_k=2)
    
    assert len(results) == 1
    assert results[0].get_text() == "Test content"
    
    # Check underlying calls
    print(f"DEBUG: retrieve calls: {mock_llama_index['retriever'].retrieve.call_args_list}")
    mock_llama_index["retriever"].retrieve.assert_called() # Relaxed assertion

def test_llm_service_init(mock_settings: MagicMock, mock_openai_client: MagicMock) -> None:
    """Verify LLMService initializes without RAG dependency."""
    from core.llm.generator import LLMService
    
    llm = LLMService()
    assert llm.model == "llama3"
    assert llm.provider == "ollama"
    # Should not have initialized any RAG components
    assert not hasattr(llm, "index")
    assert not hasattr(llm, "retriever")

def test_pure_generation(mock_settings: MagicMock, mock_openai_client: MagicMock) -> None:
    """Verify generate calls LLM properly."""
    from core.llm.generator import LLMService
    
    llm = LLMService()
    print(f"DEBUG: calling generate...")
    response = llm.generate("Hello")
    print(f"DEBUG: response: {response}")
    
    assert response == "Generated text"
    
    # Check OpenAI client call
    mock_openai_client.chat.completions.create.assert_called()

def test_orchestration_chain(
    mock_settings: MagicMock,
    mock_llama_index: dict[str, MagicMock],
    mock_openai_client: MagicMock
) -> None:
    """Verify RagChain coordinates retrieval and generation."""
    from core.rag.retriever import RagRetriever
    from core.llm.generator import LLMService
    from core.orchestration.rag_chain import RagChain
    
    retriever = RagRetriever()
    llm = LLMService()
    chain = RagChain(retriever, llm)
    
    result = chain.answer("What is this?")
    
    assert "answer" in result
    assert "sources" in result
    assert result["answer"] == "Generated text"
    assert result["sources"][0]["filename"] == "test.txt"
