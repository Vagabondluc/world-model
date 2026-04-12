export interface APIKeyManager {
    getApiKey(): string | null;
    setApiKey(key: string): void;
    isConfigured(): boolean;
}

export class BrowserAPIKeyManager implements APIKeyManager {
    private static readonly STORAGE_KEY = 'dnd_generator_api_key';

    getApiKey(): string | null {
        return localStorage.getItem(BrowserAPIKeyManager.STORAGE_KEY) || null;
    }

    setApiKey(key: string): void {
        localStorage.setItem(BrowserAPIKeyManager.STORAGE_KEY, key);
    }

    isConfigured(): boolean {
        return !!this.getApiKey();
    }
}
