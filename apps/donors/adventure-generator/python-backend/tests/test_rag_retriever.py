from __future__ import annotations

from pathlib import Path

import pytest

from core.rag import retriever as retriever_module
from core.rag.retriever import RagRetriever


class DummyDoc:
    def __init__(self, text: str, metadata: dict[str, object]) -> None:
        self.text = text
        self.metadata = metadata
        self.doc_id = "doc-1"


class DummyRetriever:
    def __init__(self, top_k: int) -> None:
        self.top_k = top_k

    def retrieve(self, query: str) -> list[str]:
        return [f"{query}:{self.top_k}"]


class DummyIndex:
    def __init__(self) -> None:
        self.inserted: list[object] = []

    def insert(self, doc: object) -> None:
        self.inserted.append(doc)

    def as_retriever(self, similarity_top_k: int = 5) -> DummyRetriever:
        return DummyRetriever(similarity_top_k)


@pytest.fixture()
def rag_retriever(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> RagRetriever:
    monkeypatch.setattr(RagRetriever, "_setup_embedding_model", lambda self: None)
    monkeypatch.setattr(RagRetriever, "_get_index", lambda self: DummyIndex())
    monkeypatch.setattr(retriever_module, "Document", DummyDoc)
    return RagRetriever(persist_path=tmp_path, collection_name="test", embed_model="dummy")


def test_retrieve_uses_index(rag_retriever: RagRetriever) -> None:
    results = rag_retriever.retrieve("query", top_k=3)
    assert results == ["query:3"]


def test_index_document_inserts(rag_retriever: RagRetriever) -> None:
    doc_id = rag_retriever.index_document("text", {"filename": "test.txt"})
    assert doc_id == "doc-1"
    assert len(rag_retriever.index.inserted) == 1


def test_index_directory_invalid_path_raises(rag_retriever: RagRetriever, tmp_path: Path) -> None:
    invalid_path = tmp_path / "missing"
    with pytest.raises(ValueError):
        rag_retriever.index_directory(invalid_path)
