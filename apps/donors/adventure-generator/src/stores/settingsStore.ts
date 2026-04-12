import { createPersistedStore } from './storeFactory';
import { ThemeSkin } from '../styles/theme';

export interface SettingsState {
    backendUrl: string;
    setBackendUrl: (url: string) => void;
    backendEndpoint: string;
    setBackendEndpoint: (url: string) => void;

    // Theme
    themeSkin: ThemeSkin;
    setThemeSkin: (skin: ThemeSkin) => void;
}

export const useSettingsStore = createPersistedStore<SettingsState>(
    (set) => ({
        backendUrl: 'http://localhost:8000',
        setBackendUrl: (url) => set({ backendUrl: url }),
        backendEndpoint: 'http://localhost:8000',
        setBackendEndpoint: (url) => set({ backendEndpoint: url }),

        themeSkin: 'parchment',
        setThemeSkin: (skin) => set({ themeSkin: skin }),
    }),
    {
        name: 'settings-storage',
    }
);
