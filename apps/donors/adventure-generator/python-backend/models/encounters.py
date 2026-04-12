from pydantic import BaseModel, Field


class EncounterConfigBase(BaseModel):
    title: str = Field(..., description='The title of the encounter')
    level: int = Field(1, description='None')


class EncounterResultBase(BaseModel):
    description: str = Field(..., description='Sensory description')


class CombatEncounterBalancerConfig(EncounterConfigBase):
    pass


class CombatEncounterBalancerResult(EncounterResultBase):
    pass


class CombatEncounterV2Config(EncounterConfigBase):
    pass


class CombatEncounterV2Result(EncounterResultBase):
    pass


class CombatEncounterConfig(EncounterConfigBase):
    pass


class CombatEncounterResult(EncounterResultBase):
    pass


class EncounterdesignOlderV1Config(EncounterConfigBase):
    pass


class EncounterdesignOlderV1Result(EncounterResultBase):
    pass


class EncounterdesignV1Config(EncounterConfigBase):
    pass


class EncounterdesignV1Result(EncounterResultBase):
    pass


class EncounterdesignV1DeprecatedConfig(EncounterConfigBase):
    pass


class EncounterdesignV1DeprecatedResult(EncounterResultBase):
    pass


class EncounterGenricBetaConfig(EncounterConfigBase):
    pass


class EncounterGenricBetaResult(EncounterResultBase):
    pass


class RpgadventureScenecraftingV1Config(EncounterConfigBase):
    pass


class RpgadventureScenecraftingV1Result(EncounterResultBase):
    pass


class SocialEventConfig(EncounterConfigBase):
    pass


class SocialEventResult(EncounterResultBase):
    pass


class TrapPrepConfig(EncounterConfigBase):
    pass


class TrapPrepResult(EncounterResultBase):
    pass


class UrbanCrawlConfig(EncounterConfigBase):
    pass


class UrbanCrawlResult(EncounterResultBase):
    pass
