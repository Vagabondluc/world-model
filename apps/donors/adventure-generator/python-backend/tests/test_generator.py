from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from addons.dnd.models import NPC, Stats, Encounter

# We will test the GeneratorService which we are about to implement (task 601)
# For now, let's assume the import will work later

@patch("instructor.from_openai")
def test_generate_npc_logic(mock_instructor: MagicMock) -> None:
    # Setup mock
    mock_client = MagicMock()
    mock_instructor.return_value = mock_client
    
    mock_npc = NPC(
        name="Mocked NPC",
        race="Human",
        stats=Stats(str=10, dex=10, con=10, int=10, wis=10, cha=10),
        hook="I am a mock"
    )
    mock_client.chat.completions.create.return_value = mock_npc
    
    # Import service here (it will exist after implementation)
    from core.generator import GeneratorService
    
    service = GeneratorService(base_url="http://mock", api_key="test")
    result = service.generate(
        prompt="Create an NPC",
        response_model=NPC
    )
    
    assert isinstance(result, NPC)
    assert result.name == "Mocked NPC"
    mock_client.chat.completions.create.assert_called_once()
