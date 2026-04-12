import { useState, useEffect, useCallback } from 'react';
import type { PerformanceMetrics, FileHealthCheck } from '../types/debugTypes';

export const usePerformanceMetrics = (isOpen: boolean, fileHealthChecks: FileHealthCheck[]) => {
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

    const gatherPerformanceMetrics = useCallback(() => {
        const memory = (window.performance as any).memory;
        setPerformanceMetrics({
            memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
            renderTime: Math.round(performance.now() % 100),
            networkRequests: fileHealthChecks.filter(f => f.source === 'fetch').length,
            cacheHits: fileHealthChecks.filter(f => f.source === 'bundled').length,
            bundleSize: fileHealthChecks.reduce((total, f) => total + f.size, 0),
            domNodes: document.querySelectorAll('*').length,
            frameRate: 60 // Mock FPS
        });
    }, [fileHealthChecks]);

    useEffect(() => {
        if (isOpen) {
            gatherPerformanceMetrics();
            const interval = setInterval(gatherPerformanceMetrics, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen, gatherPerformanceMetrics]);

    return { performanceMetrics };
};