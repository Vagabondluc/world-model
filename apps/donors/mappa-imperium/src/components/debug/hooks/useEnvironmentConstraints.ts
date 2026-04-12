import { useState, useCallback } from 'react';

export interface ConstraintTest {
  name: string;
  description: string;
  status: 'pending' | 'testing' | 'safe' | 'risky' | 'forbidden' | 'error';
  result?: string;
  recommendation?: string;
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
  isCompletelyTested: boolean;
}

const initializeTests = (): ConstraintTest[] => [
    { name: 'Local Storage Access', description: 'Tests if browser localStorage is available.', status: 'pending', recommendation: 'Required for client-side settings persistence.' },
    { name: 'Session Storage Access', description: 'Tests if browser sessionStorage is available.', status: 'pending', recommendation: 'Useful for temporary session data.'},
    { name: 'WebSocket Support', description: 'Tests for the availability of the WebSocket API.', status: 'pending', recommendation: 'Required for any real-time collaboration features.' },
];

export const useEnvironmentConstraints = () => {
  const [constraints, setConstraints] = useState<EnvironmentConstraints>({
    tests: initializeTests(),
    summary: { safe: 0, risky: 0, forbidden: 0, error: 0, untested: 3 },
    isCompletelyTested: false
  });

  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setConstraints(prev => ({ ...prev, tests: prev.tests.map(t => ({ ...t, status: 'testing' })) }));

    const runTest = (name: string, testFn: () => { status: 'safe' | 'forbidden', result: string }): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => { // Simulate async test
                try {
                    const result = testFn();
                    setConstraints(prev => ({...prev, tests: prev.tests.map(t => t.name === name ? {...t, ...result} : t) }));
                } catch (e) {
                    setConstraints(prev => ({...prev, tests: prev.tests.map(t => t.name === name ? {...t, status: 'error', result: e instanceof Error ? e.message : 'Unknown Error' } : t) }));
                }
                resolve();
            }, Math.random() * 500 + 100);
        });
    };

    const testsToRun = [
        runTest('Local Storage Access', () => {
            localStorage.setItem('__test', '1'); localStorage.removeItem('__test');
            return { status: 'safe', result: 'localStorage is available.' };
        }),
        runTest('Session Storage Access', () => {
            sessionStorage.setItem('__test', '1'); sessionStorage.removeItem('__test');
            return { status: 'safe', result: 'sessionStorage is available.' };
        }),
        runTest('WebSocket Support', () => 'WebSocket' in window ? { status: 'safe', result: 'WebSockets are supported.' } : { status: 'forbidden', result: 'WebSockets are not supported.' }),
    ];

    await Promise.all(testsToRun);
    
    setConstraints(prev => {
        const summary = prev.tests.reduce((acc, test) => {
            acc[test.status] = (acc[test.status] || 0) + 1;
            return acc;
        }, { safe: 0, risky: 0, forbidden: 0, error: 0, untested: 0 } as EnvironmentSummary);
        return { ...prev, summary, isCompletelyTested: true };
    });

    setIsRunning(false);
  }, []);

  return { constraints, isRunning, runAllTests };
};