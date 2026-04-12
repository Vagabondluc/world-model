
import { SavedMonster } from './npc';
import { BiomeData } from './location';

export interface CampaignConfiguration {
    language: string;
    genre: string;
    ruleset: string;
    crRange: string;
    tone: string;
    complexity: string;
    artStyle: string;
    narrativeTechniques: string[];
    narrativeIntegration: string;
    worldInformation: string;
    playerInformation: string;
    npcInformation: string;
    worldName?: string;
    theme?: 'parchment' | 'dark' | 'high-contrast';

    // AI Configuration
    apiProvider?: 'gemini' | 'ollama' | 'claude' | 'openai' | 'lm-studio' | 'grok' | 'zai' | 'perplexity' | 'openrouter' | 'dummy';
    aiModel?: string;

    // Generic Provider Settings
    apiKey?: string;
    baseUrl?: string;
    apiVersion?: string;
    organizationId?: string;

    // Ollama Specifics (kept for backward compatibility or direct use)
    ollamaBaseUrl?: string;
    ollamaModel?: string;

    // AI Cost Tracking
    aiCostPer1kInput?: number;
    aiCostPer1kOutput?: number;

    enabledDatabases?: string[];
    enabledContentSources?: string[]; // List of enabled source IDs (e.g. ['srd-5.1', 'a5e'])
    crCalculationMethod?: 'dmg' | 'alternate';
}

export type CampaignConfigUpdater = <K extends keyof CampaignConfiguration>(
    field: K,
    value: CampaignConfiguration[K]
) => void;

export interface CampaignStateExport {
    config: CampaignConfiguration;
    activeView: string; // We use string here to avoid circular dep with store ActiveView type, or we can move ActiveView here.
    bestiary: SavedMonster[];
    biomeData: BiomeData;
}
