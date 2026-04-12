import { useState, useEffect, useCallback } from 'react';
import type { SystemInfo } from '../types/debugTypes';

export const useSystemInfo = (isOpen: boolean) => {
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

    const gatherSystemInfo = useCallback(() => {
        const nav = navigator as any;
        setSystemInfo({
            userAgent: navigator.userAgent,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            memory: (window.performance as any).memory,
            connection: nav.connection,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            gatherSystemInfo();
        }
    }, [isOpen, gatherSystemInfo]);

    return { systemInfo };
};