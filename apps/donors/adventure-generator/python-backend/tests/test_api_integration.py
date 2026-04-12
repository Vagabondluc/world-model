from __future__ import annotations

from unittest.mock import patch, MagicMock

import pytest
from fastapi.testclient import TestClient

from addons.dnd.models import NPC, Stats
from main import app

client = TestClient(app)

@patch("core.generator.GeneratorService.generate")
def test_post_generate_npc(mock_gen: MagicMock) -> None:
    # Setup mock
    mock_gen.return_value = NPC(
        name="Test NPC",
        race="Human",
        stats=Stats(str=10, dex=10, con=10, int=10, wis=10, cha=10),
        hook="Test hook"
    )
    
    response = client.post("/dnd/generate/npc", json={"prompt": "A test NPC"})
    
    assert response.status_code == 200
    assert response.json()["name"] == "Test NPC"
    mock_gen.assert_called_once()

def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
