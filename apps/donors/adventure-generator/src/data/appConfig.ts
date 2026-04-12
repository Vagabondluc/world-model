import { CampaignConfiguration } from '../types/campaign';

export const CONFIG = {
    AI_MODEL: "gemini-2.5-flash",
    HISTORY_LIMIT: 20,
    SCENE_COUNT_RANGE: { MIN: 5, MAX: 15 },
    DEFAULT_SCENE_COUNT: 8,
} as const;

export const DEFAULT_CAMPAIGN_CONFIG: CampaignConfiguration = {
    language: 'en',
    genre: '',
    ruleset: '',
    crRange: '',
    tone: '',
    complexity: '',
    artStyle: '',
    narrativeTechniques: [],
    narrativeIntegration: '',
    worldInformation: '',
    playerInformation: '',
    npcInformation: '',
    worldName: '',
    theme: 'parchment',
    apiProvider: 'dummy',
    aiModel: 'gemini-2.5-flash',
    ollamaBaseUrl: 'http://localhost:11434',
    ollamaModel: 'llama3',
    aiCostPer1kInput: 0,
    aiCostPer1kOutput: 0,
    enabledDatabases: ['srd5.1', 'mit-libs'],
    crCalculationMethod: 'dmg',
};
