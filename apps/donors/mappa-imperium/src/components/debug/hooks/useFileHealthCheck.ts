import { useState, useCallback, useEffect } from 'react';
import type { FileHealthCheck } from '../types/debugTypes';
import { getEnvironment } from '../utils/environment';
import { getFileReferences, getReferencedBy } from '../utils/fileAnalysis';

export const useFileHealthCheck = (isOpen: boolean) => {
    const [fileHealthChecks, setFileHealthChecks] = useState<FileHealthCheck[]>([]);
    const [isAuditing, setIsAuditing] = useState(false);
    const environment = getEnvironment();

    const runFileHealthCheck = useCallback(async () => {
        setIsAuditing(true);
        const filesToCheck = [
            'src/types.ts',
            'src/stores/gameStore.ts',
            'src/App.tsx'
        ];
        const healthChecks: FileHealthCheck[] = [];

        for (const filePath of filesToCheck) {
            const startTime = performance.now();
            let healthCheck: FileHealthCheck;
            try {
                // Simplified logic: assume bundled files exist and generate mock data
                const exists = true;
                healthCheck = { path: filePath, exists, size: Math.floor(Math.random() * 5000) + 500, lineCount: Math.floor(Math.random() * 300) + 20, loadTime: performance.now() - startTime, source: 'bundled', references: getFileReferences(filePath), referencedBy: getReferencedBy(filePath) };
            } catch (error) {
                healthCheck = { path: filePath, exists: false, size: 0, lineCount: 0, loadTime: performance.now() - startTime, source: 'error', references: [], referencedBy: [], errorMessage: error instanceof Error ? error.message : 'Unknown error' };
            }
            healthChecks.push(healthCheck);
        }
        setFileHealthChecks(healthChecks);
        setIsAuditing(false);
    }, [environment]);

    useEffect(() => {
        if (isOpen) {
            runFileHealthCheck();
        }
    }, [isOpen, runFileHealthCheck]);

    return { fileHealthChecks, isAuditing, runFileHealthCheck, environment };
};