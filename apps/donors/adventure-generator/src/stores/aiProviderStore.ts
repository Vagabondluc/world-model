import { create } from 'zustand';
import { useCampaignStore } from './campaignStore';
import { useBackendStore } from './backendStore';
import type { CampaignConfiguration } from '../types/campaign';

type ProviderConfig = Pick<
    CampaignConfiguration,
    | 'apiProvider'
    | 'aiModel'
    | 'apiKey'
    | 'baseUrl'
    | 'apiVersion'
    | 'organizationId'
    | 'ollamaBaseUrl'
    | 'ollamaModel'
>;

export interface AiProviderState {
    getProviderConfig: () => ProviderConfig & {
        pythonBackendUrl: string;
        pythonApiKey: string | null;
    };
    setProviderConfig: (config: Partial<ProviderConfig>) => void;
    setPythonBackend: (baseUrl: string, apiKey: string | null) => void;
}

export const useAiProviderStore = create<AiProviderState>(() => ({
    getProviderConfig: () => {
        const config = useCampaignStore.getState().config;
        const backendState = useBackendStore.getState();
        return {
            apiProvider: config.apiProvider,
            aiModel: config.aiModel,
            apiKey: config.apiKey,
            baseUrl: config.baseUrl,
            apiVersion: config.apiVersion,
            organizationId: config.organizationId,
            ollamaBaseUrl: config.ollamaBaseUrl,
            ollamaModel: config.ollamaModel,
            pythonBackendUrl: backendState.baseUrl,
            pythonApiKey: backendState.apiKey,
        };
    },
    setProviderConfig: (config) => {
        const store = useCampaignStore.getState();
        Object.entries(config).forEach(([key, value]) => {
            store.updateConfig(key as keyof CampaignConfiguration, value as CampaignConfiguration[keyof CampaignConfiguration]);
        });
    },
    setPythonBackend: (baseUrl, apiKey) => {
        const backend = useBackendStore.getState();
        backend.setBaseUrl(baseUrl);
        if (apiKey !== null) backend.setApiKey(apiKey);
    },
}));
