
import { CampaignConfiguration } from '../types/campaign';
import { LLM_CONFIG } from '../data/aiConfig';
import { ConfigurationValidator } from '../utils/validators';
import { SystemPromptBuilder } from './prompt/SystemPromptBuilder';
import { ContextBuilder } from './prompt/ContextBuilder';
import { useLocationStore } from '../stores/locationStore';
import { GroundingService } from './GroundingService';

export const buildImprovedSystemPrompt = (config: CampaignConfiguration): string => {
  new ConfigurationValidator().validateCampaignConfig(config);
  const basePrompt = new SystemPromptBuilder()
    .addLanguageSection(config.language, LLM_CONFIG)
    .addGenreSection(config.genre, LLM_CONFIG)
    .addRulesetSection(config.ruleset, config.crRange, LLM_CONFIG)
    .addToneSection(config.tone, LLM_CONFIG)
    .addNarrativeTechniques(config.narrativeTechniques, config.narrativeIntegration, LLM_CONFIG)
    .addGeneralGuidelines()
    .build();

  const grounding = useLocationStore.getState().getGroundingContext();
  if (grounding) {
    return new GroundingService().constructSystemPrompt(basePrompt, grounding);
  }

  return basePrompt;
}

export const buildImprovedContextBlock = (config: CampaignConfiguration, sessionContext?: string): string => {
  return new ContextBuilder()
    .addWorldInfo(config.worldInformation)
    .addPlayerInfo(config.playerInformation)
    .addNpcInfo(config.npcInformation)
    .addSessionContext(sessionContext || '')
    .build();
}
