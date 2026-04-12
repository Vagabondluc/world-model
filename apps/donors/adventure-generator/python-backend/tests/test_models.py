from __future__ import annotations

import pytest
from pydantic import ValidationError

from addons.dnd.models import NPC, Stats, Encounter, EncounterEntity

def test_valid_npc() -> None:
    data = {
        "name": "Eldrin",
        "race": "Elf",
        "stats": {
            "str": 10, "dex": 18, "con": 12, "int": 16, "wis": 14, "cha": 12
        },
        "hook": "Searching for a lost tome."
    }
    npc = NPC(**data)
    assert npc.name == "Eldrin"
    assert npc.stats.dex == 18

def test_invalid_npc() -> None:
    data = {
        "name": "Broken",
        "race": "Human",
        # Missing stats and hook
    }
    with pytest.raises(ValidationError):
        NPC(**data)

def test_valid_encounter() -> None:
    data = {
        "title": "Ambush",
        "difficulty": "Hard",
        "entities": [
            {"name": "Goblin", "count": 4, "description": "Sneaky rascals"}
        ],
        "setting": "Forest trail",
        "tactics": "Hide in bushes"
    }
    encounter = Encounter(**data)
    assert len(encounter.entities) == 1
    assert encounter.entities[0].name == "Goblin"
