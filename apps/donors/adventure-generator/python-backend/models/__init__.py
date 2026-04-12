from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field

from .encounters import (
    CombatEncounterBalancerConfig,
    CombatEncounterBalancerResult,
    CombatEncounterConfig,
    CombatEncounterResult,
    CombatEncounterV2Config,
    CombatEncounterV2Result,
    EncounterConfigBase,
    EncounterdesignOlderV1Config,
    EncounterdesignOlderV1Result,
    EncounterdesignV1Config,
    EncounterdesignV1DeprecatedConfig,
    EncounterdesignV1DeprecatedResult,
    EncounterdesignV1Result,
    EncounterGenricBetaConfig,
    EncounterGenricBetaResult,
    EncounterResultBase,
    RpgadventureScenecraftingV1Config,
    RpgadventureScenecraftingV1Result,
    SocialEventConfig,
    SocialEventResult,
    TrapPrepConfig,
    TrapPrepResult,
    UrbanCrawlConfig,
    UrbanCrawlResult,
)


class Stats(BaseModel):
    str: int
    dex: int
    con: int
    int: int
    wis: int
    cha: int


class NPC(BaseModel):
    name: str = Field(..., description="Name of the NPC")
    race: str = Field(..., description="Race of the NPC (e.g., Human, Elf, Dwarf)")
    stats: Stats = Field(..., description="Ability scores")
    hook: str = Field(..., description="A plot hook or interesting fact about the NPC")
    description: Optional[str] = Field(None, description="Physical description")


class NPCRequest(BaseModel):
    prompt: str
    model: str = "llama3"


class EncounterEntity(BaseModel):
    name: str
    count: int
    description: str


class Encounter(BaseModel):
    title: str
    difficulty: str
    entities: list[EncounterEntity]
    setting: str
    tactics: str


class EncounterRequest(BaseModel):
    prompt: str
    level: int = 1
    model: str = "llama3"


__all__ = [
    "CombatEncounterBalancerConfig",
    "CombatEncounterBalancerResult",
    "CombatEncounterConfig",
    "CombatEncounterResult",
    "CombatEncounterV2Config",
    "CombatEncounterV2Result",
    "Encounter",
    "EncounterConfigBase",
    "EncounterEntity",
    "EncounterRequest",
    "EncounterResultBase",
    "EncounterdesignOlderV1Config",
    "EncounterdesignOlderV1Result",
    "EncounterdesignV1Config",
    "EncounterdesignV1DeprecatedConfig",
    "EncounterdesignV1DeprecatedResult",
    "EncounterdesignV1Result",
    "EncounterGenricBetaConfig",
    "EncounterGenricBetaResult",
    "NPC",
    "NPCRequest",
    "RpgadventureScenecraftingV1Config",
    "RpgadventureScenecraftingV1Result",
    "SocialEventConfig",
    "SocialEventResult",
    "Stats",
    "TrapPrepConfig",
    "TrapPrepResult",
    "UrbanCrawlConfig",
    "UrbanCrawlResult",
]
