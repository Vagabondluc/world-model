from __future__ import annotations

from fastapi import FastAPI

from routers import npc_gen, encounter_gen
# import rag_service # Phase 2 integration

app: FastAPI = FastAPI(title="Ensemble Python Sidecar", version="0.1.0")

app.include_router(npc_gen.router)
app.include_router(encounter_gen.router)

# Mount RAG service if needed for Phase 2
# app.mount("/rag", rag_service.app)

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": "0.1.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
