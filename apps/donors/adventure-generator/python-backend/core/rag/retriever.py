"""Pure RAG retrieval service, decoupled from LLM generation."""
from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

import chromadb
from llama_index.core import Settings, StorageContext, VectorStoreIndex, Document
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.vector_stores.chroma import ChromaVectorStore

class RagRetriever:
    """Handles document indexing and retrieval without LLM dependency."""
    
    def __init__(
        self,
        persist_path: Optional[Path] = None,
        collection_name: Optional[str] = None,
        embed_model: Optional[str] = None,
    ) -> None:
        from core.config import settings
        
        self.persist_path: Path = persist_path or Path(settings.RAG_PERSIST_PATH)
        self.collection_name: str = collection_name or settings.DND_COLLECTION_NAME
        self.embed_model_name: str = embed_model or settings.DEFAULT_EMBED_MODEL
        self.base_url: str = settings.get_active_url()
        self.provider: str = settings.AI_PROVIDER
        
        self._setup_embedding_model()
        self.index: VectorStoreIndex = self._get_index()

    def _setup_embedding_model(self) -> None:
        """Configure LlamaIndex embedding model."""
        if self.provider == "ollama":
            Settings.embed_model = OllamaEmbedding(
                model_name=self.embed_model_name, 
                base_url=self.base_url.replace("/v1", ""),
            )
        else:
            from llama_index.embeddings.openai import OpenAIEmbedding
            Settings.embed_model = OpenAIEmbedding(
                model=self.embed_model_name,
                api_base=self.base_url,
                api_key="not-needed"
            )

    def _get_index(self) -> VectorStoreIndex:
        """Get or create the vector store index."""
        if not self.persist_path.exists():
            self.persist_path.mkdir(parents=True, exist_ok=True)
        
        client = chromadb.PersistentClient(path=str(self.persist_path))
        chroma_collection = client.get_or_create_collection(self.collection_name)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        
        return VectorStoreIndex.from_vector_store(vector_store, storage_context=storage_context)

    def retrieve(self, query: str, top_k: int = 5) -> list[Any]:
        """Retrieve relevant documents."""
        retriever = self.index.as_retriever(similarity_top_k=top_k)
        return retriever.retrieve(query)

    def index_document(self, text: str, metadata: dict[str, Any]) -> str:
        """Index a single document."""
        doc = Document(text=text, metadata=metadata)
        self.index.insert(doc)
        return doc.doc_id

    def index_directory(self, dir_path: Path) -> int:
        """Recursive directory indexing."""
        from llama_index.core import SimpleDirectoryReader
        import datetime
        
        if not dir_path.exists() or not dir_path.is_dir():
            raise ValueError(f"Invalid directory path: {dir_path}")
            
        reader = SimpleDirectoryReader(
            input_dir=str(dir_path),
            recursive=True,
            required_exts=[".txt", ".md", ".pdf"]
        )
        
        documents = reader.load_data()
        
        for doc in documents:
            if "filename" not in doc.metadata:
                doc.metadata["filename"] = Path(doc.metadata.get("file_path", "unknown")).name
            if "upload_date" not in doc.metadata:
                doc.metadata["upload_date"] = datetime.datetime.now().isoformat()
            
            self.index.insert(doc)
            
        return len(documents)

    def delete_document_by_filename(self, filename: str) -> bool:
        """Delete documents by filename."""
        client = chromadb.PersistentClient(path=str(self.persist_path))
        collection = client.get_collection(self.collection_name)
        collection.delete(where={"filename": filename})
        return True

    def list_documents(self) -> list[dict[str, Any]]:
        """List all indexed documents."""
        client = chromadb.PersistentClient(path=str(self.persist_path))
        collection = client.get_collection(self.collection_name)
        results = collection.get()
        
        documents = {}
        metadatas = results.get("metadatas", [])
        ids = results.get("ids", [])
        
        for i, meta in enumerate(metadatas):
            filename = meta.get("filename", "unknown")
            if filename not in documents:
                documents[filename] = {
                    "filename": filename,
                    "id": ids[i],
                    "chunks": 1,
                    "file_path": meta.get("file_path", ""),
                    "upload_date": meta.get("upload_date", "unknown")
                }
            else:
                documents[filename]["chunks"] += 1
                
        return list(documents.values())
