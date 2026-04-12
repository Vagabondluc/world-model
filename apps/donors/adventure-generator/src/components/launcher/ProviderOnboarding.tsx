import React, { useState, useEffect, useMemo } from 'react';
import { css } from '@emotion/css';
import { PROVIDERS, ProviderInfo } from '../../data/providers';
import { CampaignConfiguration } from '../../types/campaign';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: 100%;
    `,
    grid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
    `,
    card: (selected: boolean) => css`
        background: ${selected ? 'rgba(129, 140, 248, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
        border: 1px solid ${selected ? 'var(--dnd-red)' : 'var(--border-light)'};
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
        &:hover {
            border-color: var(--dnd-red);
            background: rgba(255, 255, 255, 0.05);
        }
    `,
    configArea: css`
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `,
    form: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `,
    inputGroup: css`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    `,
    tutorial: css`
        font-size: 0.85rem;
        color: var(--text-color);
        background: rgba(255, 255, 255, 0.02);
        padding: 1rem;
        border-left: 2px solid var(--dnd-red);
        & h3 {
            color: var(--dnd-red);
            margin-top: 0;
        }
        & .tutorial-item {
            margin-bottom: 4px;
        }
        & code.tutorial-code {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 4px;
            border-radius: 4px;
        }
    `,
    link: css`
        color: var(--dnd-red);
        text-decoration: underline;
        margin-right: 1rem;
        font-size: 0.8rem;
    `
};

interface ProviderOnboardingProps {
    config: Partial<CampaignConfiguration>;
    onChange: (updates: Partial<CampaignConfiguration>) => void;
    onStatusChange: (isReady: boolean) => void;
}

export const ProviderOnboarding: React.FC<ProviderOnboardingProps> = ({ config, onChange, onStatusChange }) => {
    const [selectedId, setSelectedId] = useState<string | null>(config.apiProvider || null);
    const selectedProvider = PROVIDERS.find(p => p.id === selectedId);

    useEffect(() => {
        if (!selectedId) {
            onStatusChange(false);
            return;
        }

        const provider = PROVIDERS.find(p => p.id === selectedId);
        if (!provider) return;

        const isReady = provider.fields.every(f => {
            if (!f.required) return true;
            const fieldKey = f.name as keyof CampaignConfiguration;
            return !!config[fieldKey];
        });

        onStatusChange(isReady);
    }, [selectedId, config]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        const provider = PROVIDERS.find(p => p.id === id);
        onChange({
            apiProvider: id as CampaignConfiguration['apiProvider'],
            baseUrl: provider?.baseUrl
        });
    };

    const handleFieldChange = <K extends keyof CampaignConfiguration>(name: K, value: CampaignConfiguration[K]) => {
        onChange({ [name]: value } as Pick<CampaignConfiguration, K>);
    };

    const tutorialHtml = useMemo(() => {
        if (!selectedProvider) return '';
        return sanitizeHtml(formatMarkdown(selectedProvider.tutorial), { allowBasicFormatting: true });
    }, [selectedProvider]);

    return (
        <div className={styles.container}>
            <p className="text-sm text-slate-400">
                Choose an AI provider to power your generation engine. You can use global cloud providers or local models.
            </p>

            <div className={styles.grid}>
                {PROVIDERS.map(p => (
                    <div
                        key={p.id}
                        className={styles.card(selectedId === p.id)}
                        onClick={() => handleSelect(p.id)}
                    >
                        <div className="font-bold">{p.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{p.description}</div>
                    </div>
                ))}
            </div>

            {selectedProvider && (
                <div className={styles.configArea}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="m-0 text-lg">{selectedProvider.name} Configuration</h3>
                            <div className="mt-1">
                                {selectedProvider.links.map(l => (
                                    <a key={l.url} href={l.url} target="_blank" className={styles.link}>{l.label}</a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={styles.form}>
                            {selectedProvider.fields.map(f => (
                                <div key={f.name} className={styles.inputGroup}>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {f.label} {f.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type={f.type}
                                        className="bg-slate-800 border border-slate-700 rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500"
                                        placeholder={f.placeholder}
                                        value={typeof config[f.name as keyof CampaignConfiguration] === 'string' ? (config[f.name as keyof CampaignConfiguration] as string) : ''}
                                        onChange={e => handleFieldChange(f.name as keyof CampaignConfiguration, e.target.value)}
                                    />
                                </div>
                            ))}
                            {selectedProvider.id === 'ollama' && (
                                <p className="text-[10px] text-slate-500 italic">
                                    Note: Ensure Ollama is running and OLLAMA_ORIGINS="*" is set for web access.
                                </p>
                            )}
                        </div>

                        <div className={styles.tutorial}>
                            <div dangerouslySetInnerHTML={{ __html: tutorialHtml }} />

                            {selectedProvider.image && (
                                <div className="mt-4 p-2 bg-black/40 rounded border border-white/10 overflow-hidden shadow-2xl">
                                    <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Tutorial Guide:
                                    </div>
                                    <img
                                        src={selectedProvider.image}
                                        alt={`${selectedProvider.name} Setup`}
                                        style={{
                                            width: '100%',
                                            borderRadius: '4px',
                                            filter: 'brightness(0.9) contrast(1.1)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        className="hover:scale-105"
                                    />
                                    <div className="text-[9px] text-slate-500 mt-2 italic text-center">
                                        Follow the visual guide above to find your settings.
                                    </div>
                                </div>
                            )}

                            {!selectedProvider.image && (
                                <div className="mt-4 p-6 bg-black/40 rounded border border-white/5 text-[10px] text-slate-500 text-center italic flex flex-col items-center gap-2">
                                    <div className="text-2xl opacity-20">📖</div>
                                    Setup details for {selectedProvider.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple helper to wrap markdown-like text in basic HTML for the component
function formatMarkdown(text: string) {
    return text
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/\d\. (.*)/g, '<div class="tutorial-item">&bull; $1</div>')
        .replace(/`([^`]*)`/g, '<code class="tutorial-code">$1</code>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
}
