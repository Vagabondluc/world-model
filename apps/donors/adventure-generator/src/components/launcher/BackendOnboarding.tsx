import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { httpFetch as fetch } from '../../utils/httpUtils';
import { OllamaImpl } from '../../services/ai/ollamaImpl';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    `,
    stackItem: css`
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    `,
    statusBadge: (status: 'ok' | 'error' | 'loading' | 'missing' | 'pulling') => css`
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
        background: ${status === 'ok' ? '#22c55e' : status === 'error' ? '#ef4444' : status === 'missing' ? '#f59e0b' : status === 'pulling' ? '#3b82f6' : '#6b7280'};
        color: white;
    `,
    modelRow: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
    `,
    link: css`
        color: var(--dnd-red);
        text-decoration: underline;
        cursor: pointer;
        &:hover {
            color: white;
        }
    `,
    progressBar: (percent: number) => css`
        height: 4px;
        background: #1e293b;
        border-radius: 2px;
        overflow: hidden;
        margin-top: 4px;
        &::after {
            content: '';
            display: block;
            height: 100%;
            width: ${percent}%;
            background: var(--dnd-red);
            transition: width 0.3s ease;
        }
    `
};

interface BackendOnboardingProps {
    onStatusChange: (isReady: boolean) => void;
}

export const BackendOnboarding: React.FC<BackendOnboardingProps> = ({ onStatusChange }) => {
    const [pythonStatus, setPythonStatus] = useState<'loading' | 'ok' | 'error'>('loading');
    const [ollamaStatus, setOllamaStatus] = useState<'loading' | 'ok' | 'error'>('loading');
    const [models, setModels] = useState<{ name: string; status: 'ok' | 'missing' | 'pulling'; progress?: number; statusText?: string }[]>([
        { name: 'llama3', status: 'missing' },
        { name: 'mxbai-embed-large', status: 'missing' }
    ]);

    const ollama = new OllamaImpl("http://localhost:11434", "llama3");

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        // 1. Check Python Backend
        try {
            const resp = await fetch('http://localhost:8000/health');
            setPythonStatus(resp.ok ? 'ok' : 'error');
        } catch {
            setPythonStatus('error');
        }

        // 2. Check Ollama
        try {
            const availableModels = await ollama.getAvailableModels();
            setOllamaStatus('ok');

            setModels(prev => prev.map(m => ({
                ...m,
                status: availableModels.some(am => am.startsWith(m.name)) ? 'ok' : 'missing' as 'ok' | 'missing'
            })));
        } catch {
            setOllamaStatus('error');
        }
    };

    useEffect(() => {
        const isReady = pythonStatus === 'ok' && ollamaStatus === 'ok' && models.every(m => m.status === 'ok');
        onStatusChange(isReady);
    }, [pythonStatus, ollamaStatus, models]);

    const handlePull = async (modelName: string) => {
        setModels(prev => prev.map(m => m.name === modelName ? { ...m, status: 'pulling', progress: 0, statusText: 'Starting...' } : m));

        try {
            await ollama.pullModel(modelName, (p, status) => {
                setModels(prev => prev.map(m => m.name === modelName ? { ...m, progress: p, statusText: status } : m));
            });
            setModels(prev => prev.map(m => m.name === modelName ? { ...m, status: 'ok', progress: 100, statusText: 'Complete' } : m));
        } catch (e) {
            console.error(e);
            setModels(prev => prev.map(m => m.name === modelName ? { ...m, status: 'missing', statusText: 'Failed' } : m));
        }
    };

    return (
        <div className={styles.container}>
            <p className="text-sm text-slate-400">
                To power the AI features, this application requires a local LLM stack.
                Follow the steps below to ensure everything is configured.
            </p>

            {/* Python Backend */}
            <div className={styles.stackItem}>
                <div className="flex justify-between items-center">
                    <span className="font-bold">Python API Server</span>
                    <span className={styles.statusBadge(pythonStatus)}>
                        {pythonStatus === 'ok' ? 'Running' : pythonStatus === 'loading' ? 'Checking...' : 'Not Found'}
                    </span>
                </div>
                <p className="text-xs text-slate-500">
                    The FastAPI backend manages long-running jobs and RAG operations.
                    Run <code>python -m uvicorn main:app --port 8000</code> in the <code>python-backend</code> folder.
                </p>
            </div>

            {/* Ollama Engine */}
            <div className={styles.stackItem}>
                <div className="flex justify-between items-center">
                    <span className="font-bold">Ollama Engine</span>
                    <span className={styles.statusBadge(ollamaStatus)}>
                        {ollamaStatus === 'ok' ? 'Service Active' : ollamaStatus === 'loading' ? 'Checking...' : 'Not Found'}
                    </span>
                </div>
                <p className="text-xs text-slate-500">
                    Ollama provides local LLM inference. Ensure it is installed and running.
                    <br />
                    <a href="https://ollama.com/" target="_blank" className={styles.link}>Download Ollama</a>
                </p>
            </div>

            {/* Models */}
            <div className={styles.stackItem}>
                <span className="font-bold mb-2">Required AI Models</span>
                <div className="flex flex-col gap-3">
                    {models.map(m => (
                        <div key={m.name}>
                            <div className={styles.modelRow}>
                                <span className="font-mono">{m.name}</span>
                                <div className="flex items-center gap-2">
                                    {m.status === 'missing' && (
                                        <button
                                            className="text-white bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded text-xs"
                                            onClick={() => handlePull(m.name)}
                                            disabled={ollamaStatus !== 'ok'}
                                        >
                                            Pull Model
                                        </button>
                                    )}
                                    <span className={styles.statusBadge(m.status)}>
                                        {m.status === 'ok' ? 'Ready' : m.status === 'pulling' ? 'Pulling...' : 'Missing'}
                                    </span>
                                </div>
                            </div>
                            {m.status === 'pulling' && (
                                <>
                                    <div className={styles.progressBar(m.progress || 0)} />
                                    <span className="text-[10px] text-slate-400">{m.statusText}</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-2">
                <button
                    className="secondary-button w-full text-xs"
                    onClick={checkStatus}
                >
                    🔄 Refresh Status
                </button>
            </div>
        </div>
    );
};
