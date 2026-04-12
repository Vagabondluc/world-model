// src/components/debug/hooks/useEnvironmentConstraints.ts
import { useState, useEffect, useCallback } from 'react';

export interface ConstraintTest {
  name: string;
  description: string;
  status: 'pending' | 'testing' | 'safe' | 'risky' | 'forbidden' | 'error';
  result?: string;
  recommendation?: string;
  lastTested?: string;
  errorDetails?: string;
}

export interface EnvironmentSummary {
    safe: number;
    risky: number;
    forbidden: number;
    error: number;
    untested: number;
}

export interface EnvironmentConstraints {
  tests: ConstraintTest[];
  summary: EnvironmentSummary;
  environment: string;
  isCompletelyTested: boolean;
}

const initializeTests = (): ConstraintTest[] => {
    const baseTests: ConstraintTest[] = [
        { name: 'File System Access API', description: 'Checks for modern browser File System Access API availability.', status: 'pending', recommendation: 'Determines if advanced local file operations are possible.' },
        { name: 'Server Writeability', description: 'Checks if core files are publicly served, implying they are read-only.', status: 'pending', recommendation: 'Informs whether styling must be inlined or handled by a build step.' },
        { name: 'Dynamic Import Support', description: 'Tests if the browser and environment support ES6 dynamic imports.', status: 'pending', recommendation: 'Affects code splitting and lazy loading capabilities.' },
        { name: 'Local Storage Access', description: 'Tests if browser localStorage is available and persistent.', status: 'pending', recommendation: 'Required for client-side settings persistence.' },
        { name: 'Session Storage Access', description: 'Tests if browser sessionStorage is available.', status: 'pending', recommendation: 'Useful for temporary session data.'},
        { name: 'IndexedDB Support', description: 'Tests for IndexedDB for larger client-side storage.', status: 'pending', recommendation: 'Needed for advanced offline capabilities.' },
        { name: 'Web Workers Support', description: 'Tests if Web Workers can be created for background tasks.', status: 'pending', recommendation: 'Allows for non-blocking computation.' },
        { name: 'Clipboard API Access', description: 'Checks for modern, secure clipboard access.', status: 'pending', recommendation: 'Enables "copy to clipboard" functionality.' },
        { name: 'Notification API Access', description: 'Checks for browser notification capabilities.', status: 'pending', recommendation: 'Enables push notifications for updates.' },
        { name: 'Geolocation API Access', description: 'Checks for access to user location data.', status: 'pending', recommendation: 'Not typically needed, but a standard check.' },
        { name: 'External Network Fetching', description: 'Tests if the environment can fetch from external domains.', status: 'pending', recommendation: 'Affects CDN usage and external API integration.' },
        { name: 'WebSocket Support', description: 'Tests for the availability of the WebSocket API.', status: 'pending', recommendation: 'Required for any real-time collaboration features.' },
        { name: 'Service Worker Support', description: 'Tests if Service Workers can be registered.', status: 'pending', recommendation: 'Affects offline capabilities and advanced caching.' }
    ];
    return baseTests;
};

export const useEnvironmentConstraints = () => {
  const [constraints, setConstraints] = useState<EnvironmentConstraints>({
    tests: initializeTests(),
    summary: { safe: 0, risky: 0, forbidden: 0, error: 0, untested: 13 },
    environment: 'unknown',
    isCompletelyTested: false
  });

  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = useCallback(async (options: { includePermissions?: boolean } = {}) => {
    setIsRunning(true);
    const initialTestsList = initializeTests();
    
    const updateTestResult = (name: string, result: Omit<ConstraintTest, 'name' | 'description' | 'recommendation'>) => {
        setConstraints(prev => {
            const newTests = prev.tests.map(t => t.name === name ? { ...t, ...result, lastTested: new Date().toISOString() } : t);
            return { ...prev, tests: newTests };
        });
    };

    setConstraints({
      tests: initialTestsList.map(t => ({ ...t, status: 'testing' })),
      summary: { safe: 0, risky: 0, forbidden: 0, error: 0, untested: 0 },
      environment: 'Testing...',
      isCompletelyTested: false
    });
    
    const testsToRun = [
      () => updateTestResult('File System Access API', 'showOpenFilePicker' in window ? { status: 'safe', result: 'File System Access API is available.' } : { status: 'risky', result: 'File System Access API not available.' }),
      () => fetch('/package.json').then(res => updateTestResult('Server Writeability', res.ok ? { status: 'forbidden', result: 'package.json is public.' } : { status: 'safe', result: 'package.json is not public.' })).catch(() => updateTestResult('Server Writeability', { status: 'safe', result: 'package.json is not public.' })),
      () => import('../../../data/eras').then(() => updateTestResult('Dynamic Import Support', { status: 'safe', result: 'Dynamic import() supported.'})).catch(() => updateTestResult('Dynamic Import Support', { status: 'forbidden', result: 'Dynamic import() failed.'})),
      () => { try { localStorage.setItem('__test', '1'); localStorage.removeItem('__test'); updateTestResult('Local Storage Access', { status: 'safe', result: 'localStorage is available.' }); } catch (e) { updateTestResult('Local Storage Access', { status: 'forbidden', result: 'localStorage is not available.' }); }},
      () => { try { sessionStorage.setItem('__test', '1'); sessionStorage.removeItem('__test'); updateTestResult('Session Storage Access', { status: 'safe', result: 'sessionStorage is available.' }); } catch (e) { updateTestResult('Session Storage Access', { status: 'forbidden', result: 'sessionStorage is not available.' }); }},
      () => { try { const db = indexedDB.open('__test'); db.onsuccess = () => { indexedDB.deleteDatabase('__test'); updateTestResult('IndexedDB Support', { status: 'safe', result: 'IndexedDB is supported.' }); }; db.onerror = () => updateTestResult('IndexedDB Support', { status: 'forbidden', result: 'IndexedDB is not supported.' }); } catch (e) { updateTestResult('IndexedDB Support', { status: 'forbidden', result: 'IndexedDB is not supported.' }); }},
      () => updateTestResult('Web Workers Support', typeof Worker !== 'undefined' ? { status: 'safe', result: 'Web Workers are supported.' } : { status: 'forbidden', result: 'Web Workers are not supported.' }),
      () => { if (!navigator.clipboard) { updateTestResult('Clipboard API Access', { status: 'risky', result: 'Clipboard API not available.' }); } else { navigator.clipboard.readText().then(() => updateTestResult('Clipboard API Access', { status: 'safe', result: 'Clipboard API is available.' })).catch(() => updateTestResult('Clipboard API Access', { status: 'safe', result: 'Clipboard API write access is likely available.' })); }},
      () => updateTestResult('Notification API Access', 'Notification' in window ? { status: 'safe', result: 'Notifications API is available.' } : { status: 'forbidden', result: 'Notifications API is not available.' }),
      () => updateTestResult('Geolocation API Access', 'geolocation' in navigator ? { status: 'safe', result: 'Geolocation API is available.' } : { status: 'forbidden', result: 'Geolocation API is not available.' }),
      () => fetch('https://aistudiocdn.com/react@^19.1.1', { mode: 'no-cors' }).then(() => updateTestResult('External Network Fetching', { status: 'safe', result: 'External requests are allowed.' })).catch(() => updateTestResult('External Network Fetching', { status: 'forbidden', result: 'External requests are blocked.' })),
      () => updateTestResult('WebSocket Support', 'WebSocket' in window ? { status: 'safe', result: 'WebSockets are supported.' } : { status: 'forbidden', result: 'WebSockets are not supported.' }),
      () => updateTestResult('Service Worker Support', 'serviceWorker' in navigator ? { status: 'safe', result: 'Service Workers are supported.' } : { status: 'forbidden', result: 'Service Workers are not supported.' }),
    ];
    
    await Promise.all(testsToRun.map(test => test()));

    setConstraints(prev => {
        const summary = prev.tests.reduce((acc, test) => {
            acc[test.status] = (acc[test.status] || 0) + 1;
            return acc;
        }, { safe: 0, risky: 0, forbidden: 0, error: 0, untested: 0 } as EnvironmentSummary);
        
        return {
            ...prev,
            summary,
            isCompletelyTested: true,
            environment: 'Unknown Environment' // Simplified for this context
        };
    });

    setIsRunning(false);
  }, []);

  const getEnvironmentRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    if (!constraints.isCompletelyTested) {
        return ["Run tests to get recommendations."];
    }

    const findTest = (name: string) => constraints.tests.find(t => t.name === name);
    
    const localStorageTest = findTest('Local Storage Access');
    if (localStorageTest?.status === 'forbidden') {
        recommendations.push("Client-side settings will not persist between sessions. Implement a server-side storage solution or a fallback.");
    }

    const fileSystemTest = findTest('Server Writeability');
    if (fileSystemTest?.status === 'forbidden') {
        recommendations.push("The file system appears to be public. Avoid any operations that assume server-side write access.");
    }
    
    const externalNetworkTest = findTest('External Network Fetching');
    if (externalNetworkTest?.status === 'forbidden') {
        recommendations.push("External network requests are blocked. All assets (fonts, scripts, APIs) must be self-hosted or bundled.");
    }

    if (recommendations.length === 0) {
        recommendations.push("Environment appears stable with no major red flags.");
    }
    
    return recommendations;
  }, [constraints]);

  return {
    constraints,
    isRunning,
    runAllTests,
    getEnvironmentRecommendations,
  };
};
