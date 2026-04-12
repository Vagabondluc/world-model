/**
 * Environment Detection Utility
 */

export const isTauri = (): boolean => {
    if (typeof window === 'undefined') return false;
    const w = window as Window & { __TAURI_INTERNALS__?: unknown };
    return !!w.__TAURI_INTERNALS__;
};

export const isBrowser = (): boolean => {
    return !isTauri();
};
