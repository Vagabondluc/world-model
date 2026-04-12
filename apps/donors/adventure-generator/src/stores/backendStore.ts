import { create } from 'zustand';
import { httpFetch as fetch } from '../utils/httpUtils';

interface BackendState {
    isConnected: boolean;
    latency: number | null;
    version: string | null;
    addons: string[];
    lastHealthCheck: Date | null;
    logs: string[];
    isRestartRequired: boolean;
    ragPersistPath: string;
    apiKey: string | null;

    // Unified Provider State
    providerConnected: boolean;
    activeProvider: string;
    providerUrl: string;
    providerVersion: string | null;
    availableModels: string[];

    // Configuration
    baseUrl: string;
    selectedModel: string;
    temperature: number;

    // Actions
    checkHealth: () => Promise<void>;
    checkProviderStatus: () => Promise<void>;
    fetchModels: () => Promise<void>;
    updateConfig: (config: Partial<BackendState>) => void;
    addLog: (log: string) => void;
    setBaseUrl: (url: string) => void;
    setSelectedModel: (model: string) => Promise<void>;
    setProvider: (provider: string) => Promise<void>;
    toggleAddon: (addonId: string, enabled: boolean) => Promise<void>;
    restartServer: () => Promise<void>;
    stopServer: () => Promise<void>;
    fetchRagConfig: () => Promise<void>;
    updateRagConfig: (persistPath: string) => Promise<void>;
    indexDirectory: (directoryPath: string) => Promise<{ success: boolean, count: number }>;
    connectLogs: () => void;
    setApiKey: (key: string) => void;
}

const DEFAULT_PYTHON_URL = "http://localhost:8000";

// Helper for headers
const getHeaders = (state: BackendState) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (state.apiKey) {
        headers['X-API-Key'] = state.apiKey;
    }
    return headers;
};

export const useBackendStore = create<BackendState>((set, get) => {
    let logWs: WebSocket | null = null;

    return {
        isConnected: false,
        latency: null,
        version: null,
        addons: [],
        lastHealthCheck: null,
        logs: [],
        isRestartRequired: false,
        ragPersistPath: "rag/chroma",
        apiKey: localStorage.getItem("dnd_ai_api_key") || null,

        providerConnected: false,
        activeProvider: "ollama",
        providerUrl: "http://localhost:11434",
        providerVersion: null,
        availableModels: [],

        baseUrl: (import.meta.env as { VITE_PYTHON_BACKEND_URL?: string }).VITE_PYTHON_BACKEND_URL || DEFAULT_PYTHON_URL,
        selectedModel: "llama3",
        temperature: 0.7,

        checkHealth: async () => {
            const { baseUrl } = get();
            const start = performance.now();
            try {
                const response = await fetch(`${baseUrl}/health`, {
                    method: 'GET',
                    connectTimeout: 2000,
                    headers: getHeaders(get())
                });
                const end = performance.now();

                if (response.ok) {
                    const data = await response.json();
                    set({
                        isConnected: true,
                        latency: Math.round(end - start),
                        version: data.version,
                        addons: data.addons || [],
                        lastHealthCheck: new Date()
                    });

                    if (!get().isConnected) {
                        get().addLog(`[System] Connected to Python Backend v${data.version}`);
                    }
                } else {
                    set({ isConnected: false, latency: null });
                }
            } catch (error) {
                set({ isConnected: false, latency: null });
            }
        },

        checkProviderStatus: async () => {
            const { baseUrl } = get();
            try {
                const response = await fetch(`${baseUrl}/provider/status`, {
                    headers: getHeaders(get())
                });
                if (response.ok) {
                    const data = await response.json();
                    set({
                        providerConnected: data.connected,
                        activeProvider: data.provider,
                        providerUrl: data.url,
                        providerVersion: data.version
                    });
                }
            } catch (error) {
                set({ providerConnected: false });
            }
        },


        setProvider: async (provider: string) => {
            const { baseUrl } = get();
            try {
                const response = await fetch(`${baseUrl}/provider/select`, {
                    method: 'POST',
                    headers: getHeaders(get()),
                    body: JSON.stringify({ provider })
                });
                if (response.ok) {
                    await get().checkProviderStatus();
                    get().addLog(`[System] Switched provider to ${provider}`);
                    await get().fetchModels();
                }
            } catch (error) {
                console.error("Failed to set provider", error);
            }
        },

        fetchModels: async () => {
            const { baseUrl } = get();
            try {
                const state = get();
                const endpoint = state.activeProvider === 'lm_studio' ? '/lmstudio/models' : '/provider/models';
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    headers: getHeaders(state)
                });

                if (response.ok) {
                    const data: { models: Array<{ name?: string; id?: string }> } = await response.json();
                    set({
                        availableModels: data.models.map((m) => m.name || m.id || '')
                    });

                    // Also sync current model
                    const configRes = await fetch(`${baseUrl}/config/model`, { headers: getHeaders(get()) });
                    if (configRes.ok) {
                        const configData = await configRes.json();
                        set({ selectedModel: configData.current_model });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch models", error);
            }
        },

        setSelectedModel: async (model: string) => {
            const { baseUrl } = get();
            try {
                const state = get();
                // LM Studio uses a different endpoint for selection
                const endpoint = state.activeProvider === 'lm_studio' ? '/lmstudio/select' : '/config/model';
                const payload = state.activeProvider === 'lm_studio' ? { model_id: model } : { model };

                const response = await fetch(`${baseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: getHeaders(state),
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    set({ selectedModel: model });
                    get().addLog(`[System] Backend model switched to ${model}`);
                }
            } catch (error) {
                console.error("Failed to set model", error);
            }
        },

        toggleAddon: async (addonId: string, enabled: boolean) => {
            const { baseUrl } = get();
            try {
                const response = await fetch(`${baseUrl}/addons/toggle`, {
                    method: 'POST',
                    headers: getHeaders(get()),
                    body: JSON.stringify({ addon_id: addonId, enabled })
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        set({ isRestartRequired: data.restart_required });
                        get().addLog(`[System] Add-on ${addonId} ${enabled ? 'enabled' : 'disabled'}. Restart required: ${data.restart_required}`);
                    }
                }
            } catch (error) {
                console.error("Failed to toggle addon", error);
            }
        },

        restartServer: async () => {
            const { baseUrl } = get();
            try {
                get().addLog(`[System] Sending restart command...`);
                await fetch(`${baseUrl}/server/restart`, {
                    method: 'POST',
                    headers: getHeaders(get())
                });
                // We don't bother with the response as server will die
            } catch (error) {
                console.error("Restart command failed", error);
            }
        },

        stopServer: async () => {
            const { baseUrl } = get();
            try {
                get().addLog(`[System] Sending shutdown command...`);
                await fetch(`${baseUrl}/server/shutdown`, {
                    method: 'POST',
                    headers: getHeaders(get())
                });
            } catch (error) {
                console.error("Shutdown command failed", error);
            }
        },

        fetchRagConfig: async () => {
            const { baseUrl } = get();
            try {
                const response = await fetch(`${baseUrl}/rag/config`, { headers: getHeaders(get()) });
                if (response.ok) {
                    const data = await response.json();
                    set({ ragPersistPath: data.persist_path });
                }
            } catch (error) {
                console.error("Failed to fetch RAG config", error);
            }
        },

        updateRagConfig: async (persistPath: string) => {
            const { baseUrl } = get();
            try {
                const response = await fetch(`${baseUrl}/rag/config`, {
                    method: 'POST',
                    headers: getHeaders(get()),
                    body: JSON.stringify({ persist_path: persistPath, collection: "default" })
                });
                if (response.ok) {
                    set({ ragPersistPath: persistPath });
                    get().addLog(`[System] RAG storage path updated to: ${persistPath}`);
                }
            } catch (error) {
                console.error("Failed to update RAG config", error);
            }
        },

        indexDirectory: async (directoryPath: string) => {
            const { baseUrl } = get();
            try {
                get().addLog(`[System] Requesting async indexing: ${directoryPath}`);

                // Use Batch Endpoint
                const response = await fetch(`${baseUrl}/batch/rag/index`, {
                    method: 'POST',
                    headers: getHeaders(get()),
                    body: JSON.stringify({ directory_path: directoryPath })
                });

                if (response.ok) {
                    const data = await response.json();
                    const jobId = data.job_id;
                    get().addLog(`[System] Job started (ID: ${jobId}). Polling status...`);

                    // Poll
                    let attempts = 0;
                    while (attempts < 60) { // 60 * 2s = 2 mins timeout
                        await new Promise(r => setTimeout(r, 2000));
                        attempts++;

                        const statusRes = await fetch(`${baseUrl}/batch/status/${jobId}`, { headers: getHeaders(get()) });
                        if (statusRes.ok) {
                            const job = await statusRes.json();
                            if (job.status === "completed") {
                                get().addLog(`[System] Indexing completed. Processed ${job.result.count} files.`);
                                return { success: true, count: job.result.count };
                            } else if (job.status === "failed") {
                                get().addLog(`[Error] Indexing job failed: ${job.error}`);
                                return { success: false, count: 0 };
                            }
                        }
                    }
                    get().addLog(`[Error] Indexing timed out.`);
                    return { success: false, count: 0 };
                }
                return { success: false, count: 0 };
            } catch (error) {
                console.error("Failed to index directory", error);
                return { success: false, count: 0 };
            }
        },

        connectLogs: () => {
            if (logWs) return;

            const { baseUrl } = get();
            const wsUrl = baseUrl.replace("http", "ws") + "/logs/stream";

            try {
                logWs = new WebSocket(wsUrl);
                logWs.onmessage = (event) => {
                    const log = JSON.parse(event.data);
                    get().addLog(`[${log.level}] ${log.message}`);
                };
                logWs.onclose = () => {
                    logWs = null;
                    // Auto-reconnect after 5s
                    setTimeout(() => get().connectLogs(), 5000);
                };
            } catch (e) {
                console.error("Log WebSocket connection failed", e);
            }
        },

        updateConfig: (config) => set((state) => ({ ...state, ...config })),

        addLog: (log) => set((state) => {
            const newLogs = [...state.logs, log];
            if (newLogs.length > 200) newLogs.shift();
            return { logs: newLogs };
        }),

        setBaseUrl: (url) => set({ baseUrl: url }),

        setApiKey: (key) => {
            localStorage.setItem("dnd_ai_api_key", key);
            set({ apiKey: key });
        }
    };
});
