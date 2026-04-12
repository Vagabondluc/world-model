import { isTauri } from './envUtils';
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";

type TauriFetchOptions = Parameters<typeof tauriFetch>[1];
export type HttpFetchInit = RequestInit | TauriFetchOptions;

/**
 * Platform-aware fetch implementation
 */
export const httpFetch = async (url: string | URL | Request, init?: HttpFetchInit) => {
    if (isTauri()) {
        return await tauriFetch(url, init);
    }
    return await window.fetch(url, init);
};
