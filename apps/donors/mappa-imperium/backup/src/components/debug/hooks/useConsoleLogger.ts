import { useState, useEffect, useCallback } from 'react';
import type { ConsoleEntry } from '../types/debugTypes';

export const useConsoleLogger = (isOpen: boolean) => {
    const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);

    const addEntry = useCallback((level: ConsoleEntry['level'], message: string, source: string = 'Debug System') => {
        const entry: ConsoleEntry = {
            timestamp: new Date().toLocaleTimeString(),
            level,
            message,
            source
        };
        setConsoleEntries(prev => [...prev.slice(-99), entry]); // Keep last 100 entries
    }, []);

    const clearConsole = useCallback(() => {
        setConsoleEntries([]);
        addEntry('info', 'Console cleared', 'Debug System');
    }, [addEntry]);

    useEffect(() => {
        if (isOpen) {
            addEntry('info', 'Debug system opened', 'Debug System');
        }
    }, [isOpen, addEntry]);

    return { consoleEntries, addEntry, clearConsole };
};