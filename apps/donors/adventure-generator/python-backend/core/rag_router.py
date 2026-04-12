"""RAG management router for the AI backend framework."""
from __future__ import annotations

import datetime
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Query
from pydantic import BaseModel

from core.rag import RagRetriever
from core.config import settings


router: APIRouter = APIRouter(prefix="/rag", tags=["RAG Knowledge Base"])


class DocumentInfo(BaseModel):
    """Information about an indexed document."""
    id: str
    filename: str
    chunks: int
    file_path: str
    upload_date: str


class RagDocumentsResponse(BaseModel):
    """Response model for document listing."""
    documents: list[DocumentInfo]
    collection: str


class RagUploadResponse(BaseModel):
    """Response model for document upload."""
    success: bool
    filename: str
    chunks: int
    id: str


class RagConfig(BaseModel):
    """RAG configuration parameters."""
    persist_path: str
    collection: str


class DirectoryIndexRequest(BaseModel):
    """Request model for directory indexing."""
    directory_path: str


class RetrievalResponse(BaseModel):
    """Response model for pure retrieval."""
    query: str
    results: list[dict[str, Any]]


def get_rag_retriever() -> RagRetriever:
    """Dependency to get RAG retriever instance."""
    return RagRetriever(
        persist_path=Path(settings.RAG_PERSIST_PATH),
        collection_name=settings.DND_COLLECTION_NAME,
        embed_model=settings.DEFAULT_EMBED_MODEL
    )


@router.get("/documents", response_model=RagDocumentsResponse)
async def list_documents(service: RagRetriever = Depends(get_rag_retriever)) -> RagDocumentsResponse:
    """List all indexed documents in the current collection."""
    try:
        docs = service.list_documents()
        return RagDocumentsResponse(
            documents=[DocumentInfo(**doc) for doc in docs],
            collection=service.collection_name
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")


@router.post("/upload", response_model=RagUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    service: RagRetriever = Depends(get_rag_retriever)
) -> RagUploadResponse:
    """Upload and index a document."""
    try:
        content = await file.read()
        text = content.decode("utf-8")
        
        metadata = {
            "filename": file.filename,
            "upload_date": datetime.datetime.now().isoformat(),
            "file_path": f"uploaded://{file.filename}"
        }
        
        doc_id = service.index_document(text, metadata)
        
        # Refresh list to get chunk count
        docs = service.list_documents()
        chunks = 0
        for doc in docs:
            if doc["filename"] == file.filename:
                chunks = doc["chunks"]
                break
        
        return RagUploadResponse(
            success=True,
            filename=file.filename,
            chunks=chunks,
            id=doc_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading document: {str(e)}")


@router.delete("/documents/{filename}")
async def delete_document(
    filename: str,
    service: RagRetriever = Depends(get_rag_retriever)
) -> dict[str, Any]:
    """Delete a document by its filename."""
    try:
        success = service.delete_document_by_filename(filename)
        return {"success": success, "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")


@router.get("/config", response_model=RagConfig)
async def get_rag_config(service: RagRetriever = Depends(get_rag_retriever)) -> RagConfig:
    """Get current RAG configuration."""
    return RagConfig(
        persist_path=str(settings.RAG_PERSIST_PATH),
        collection=settings.DND_COLLECTION_NAME
    )


@router.post("/config")
async def update_rag_config(config: RagConfig) -> dict[str, Any]:
    """Update RAG configuration (persistence path)."""
    if settings.update_rag_persist_path(config.persist_path):
        return {"success": True, "persist_path": config.persist_path}
    raise HTTPException(status_code=400, detail="Invalid persistence path")


@router.post("/index-directory")
async def index_directory(
    request: DirectoryIndexRequest,
    service: RagRetriever = Depends(get_rag_retriever)
) -> dict[str, Any]:
    """Index an entire directory recursively."""
    try:
        count = service.index_directory(Path(request.directory_path))
        return {"success": True, "count": count, "directory": request.directory_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error indexing directory: {str(e)}")


@router.get("/retrieve", response_model=RetrievalResponse)
async def retrieve_documents(
    q: str = Query(..., description="Query string"),
    top_k: int = Query(5, description="Number of results"),
    service: RagRetriever = Depends(get_rag_retriever)
) -> RetrievalResponse:
    """Pure retrieval - get relevant document chunks."""
    try:
        nodes = service.retrieve(q, top_k=top_k)
        
        results: list[dict[str, Any]] = []
        for node in nodes:
            meta = node.metadata or {}
            results.append({
                "score": node.score,
                "text": node.get_text(),
                "path": meta.get("file_path", "unknown"),
                "filename": meta.get("filename", "unknown")
            })
            
        return RetrievalResponse(query=q, results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving documents: {str(e)}")


