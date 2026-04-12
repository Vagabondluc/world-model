# Creating Add-ons for the AI Backend Framework

## Overview

The AI Backend Framework uses a modular architecture allowing you to create domain-specific add-ons that leverage the core Instructor + RAG infrastructure.

## Directory Structure

Your add-on should follow this structure:

```
addons/
└── your_addon_name/
    ├── __init__.py        # Package metadata
    ├── models.py          # Pydantic schemas for your domain
    ├── prompts.py         # System prompts and templates
    ├── routers.py         # FastAPI endpoints
    └── validators.py      # (Optional) Domain-specific validation logic
```

## Step-by-Step Guide

### 1. Create Directory Structure

```bash
mkdir -p addons/your_addon_name
touch addons/your_addon_name/__init__.py
touch addons/your_addon_name/models.py
touch addons/your_addon_name/prompts.py
touch addons/your_addon_name/routers.py
```

### 2. Define Pydantic Models (`models.py`)

```python
from pydantic import BaseModel, Field
from typing import List

class YourEntity(BaseModel):
    name: str = Field(..., description="Name of the entity")
    description: str
    properties: List[str]

class YourEntityRequest(BaseModel):
    prompt: str
    model: str = "llama3"
```

### 3. Create System Prompts (`prompts.py`)

```python
YOUR_ENTITY_SYSTEM = \"\"\"You are an expert in [your domain].
Generate entities with the following characteristics:
- Property 1: description
- Property 2: description
\"\"\"
```

### 4. Build API Routers (`routers.py`)

```python
from fastapi import APIRouter, Depends, HTTPException
from core.generator import GeneratorService
from core.config import settings
from .models import YourEntity, YourEntityRequest
from . import prompts

router = APIRouter(prefix="/your_addon", tags=["YourAddon"])

def get_generator() -> GeneratorService:
    return GeneratorService(
        base_url=settings.OLLAMA_BASE_URL,
        default_model=settings.DEFAULT_MODEL
    )

@router.post("/generate/entity", response_model=YourEntity)
async def generate_entity(
    request: YourEntityRequest,
    generator: GeneratorService = Depends(get_generator)
):
    try:
        return generator.generate(
            prompt=request.prompt,
            response_model=YourEntity,
            system_prompt=prompts.YOUR_ENTITY_SYSTEM,
            model=request.model
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 5. Register in `main.py`

```python
# In main.py
from addons.your_addon import routers as your_addon_routers

if settings.ENABLE_YOUR_ADDON:
    app.include_router(your_addon_routers.router)
```

### 6. Add Configuration

```python
# In core/config.py
class Settings(BaseSettings):
    # ... existing settings ...
    ENABLE_YOUR_ADDON: bool = False
    YOUR_ADDON_COLLECTION_NAME: str = "your_addon_data"
```

## Example Add-ons

### Sci-Fi RPG Add-on

```python
# addons/scifi/models.py
class Spaceship(BaseModel):
    name: str
    class_type: str  # Fighter, Cruiser, Battleship
    weapons: List[str]
    crew_capacity: int
    ftl_capable: bool
```

### Corporate Knowledge Base Add-on

```python
# addons/corporate_kb/models.py
class PolicyDocument(BaseModel):
    title: str
    department: str
    effective_date: str
    summary: str
    key_points: List[str]
```

## Best Practices

1. **Keep models domain-specific**: Don't try to make generic schemas
2. **Use descriptive prompts**: Help the LLM understand your domain
3. **Leverage RAG**: Use `RagService` for context-aware generation
4. **Write tests**: Create `tests/addons/your_addon/` with unit tests
5. **Document your API**: Use FastAPI's auto-docs

## Testing Your Add-on

```python
# tests/addons/your_addon/test_models.py
from addons.your_addon.models import YourEntity

def test_entity_validation():
    entity = YourEntity(
        name="Test",
        description="A test entity",
        properties=["prop1", "prop2"]
    )
    assert entity.name == "Test"
```

## Deployment

Your add-on is automatically bundled when the main backend starts. Users can enable/disable it via environment variables:

```bash
ENABLE_YOUR_ADDON=true python main.py
```
