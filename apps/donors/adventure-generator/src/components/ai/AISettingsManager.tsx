import React, { FC, useState, useEffect } from 'react';
import { css, cx } from '@emotion/css';
import { useCampaignStore } from '../../stores/campaignStore';
import { AI_MODELS } from '../../data/aiConfig';
import { useAppContext } from '../../context/AppContext';
import { CampaignConfiguration, CampaignConfigUpdater } from '../../types/campaign';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    section: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    sectionTitle: css`
        font-family: var(--header-font);
        font-size: 1.2rem;
        color: var(--dark-brown);
        border-bottom: 1px solid var(--medium-brown);
        padding-bottom: 4px;
        margin: 0;
    `,
    description: css`
        font-size: 0.95rem;
        color: var(--medium-brown);
        line-height: 1.5;
        margin: 0;
    `,
    providerSelect: css`
        display: flex;
        gap: var(--space-m);
    `,
    providerOption: css`
        flex: 1;
        background: var(--parchment-bg);
        border: 2px solid var(--border-light);
        border-radius: var(--border-radius);
        padding: var(--space-m);
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
        font-weight: bold;
        color: var(--medium-brown);

        &:hover {
            border-color: var(--medium-brown);
            transform: translateY(-1px);
        }

        &.selected {
            border-color: var(--dnd-red);
            background-color: #fff;
            color: var(--dnd-red);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    `,
    modelOption: css`
        background: var(--parchment-bg);
        padding: var(--space-m);
        padding-left: 50px;
        border-radius: var(--border-radius);
        border: 2px solid var(--border-light);
        transition: all 0.2s ease;
        cursor: pointer;
        position: relative;

        &:hover {
            border-color: var(--medium-brown);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .radio-checkmark {
            top: 50%;
            transform: translateY(-50%);
            left: var(--space-m);
        }
        
        &.selected {
             border: 2px solid #000000 !important;
             background-color: #fff;
        }
    `,
    inputGroup: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        
        label {
            font-weight: bold;
            font-size: 0.9rem;
            color: var(--dark-brown);
        }
        
        input {
            width: 100%;
        }
        
        small {
            font-size: 0.85rem;
            color: var(--medium-brown);
        }
    `,
    modelTitle: css`
        font-weight: bold;
        font-size: 1.1rem;
        display: block;
        margin-bottom: 4px;
        color: var(--dnd-red);
    `,
    modelDesc: css`
        display: block;
        font-size: 0.95rem;
        color: var(--medium-brown);
    `,
    button: css`
        background: var(--dnd-red);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-family: var(--header-font);
        font-size: 0.9rem;
        transition: opacity 0.2s;
        
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `,
    select: css`
        padding: 8px;
        border: 1px solid var(--border-light);
        border-radius: 4px;
        background: white;
        color: var(--dark-brown);
    `
};

interface OllamaConfigProps {
    url: string;
    model: string;
    onUpdate: CampaignConfigUpdater;
}

const OllamaConfig: FC<OllamaConfigProps> = ({ url, model, onUpdate }) => {
    const { apiService } = useAppContext();
    const [models, setModels] = useState<string[]>([]);
    const [isProbing, setIsProbing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const probeModels = async () => {
        if (!apiService) {
            setError("Internal Error: API Service not found.");
            return;
        }
        setIsProbing(true);
        setError(null);
        console.log(`[OllamaConfig] Probing models at ${url}...`);
        try {
            const result = await apiService.getOllamaModels(url);
            console.log(`[OllamaConfig] Found ${result.length} models:`, result);
            setModels(result);
            if (result.length > 0 && !result.includes(model)) {
                // If current model isn't in the list, but list isn't empty, maybe suggest first one?
                // Or just let user know.
            }
        } catch (e: unknown) {
            console.error(`[OllamaConfig] Probe failed:`, e);
            const msg = e instanceof Error ? e.message : String(e);
            setError(`Connection Failed: ${msg}`);
            setModels([]);
        } finally {
            setIsProbing(false);
        }
    };

    useEffect(() => {
        probeModels();
    }, [url, apiService]);

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ollama Configuration</h3>
            <p className={styles.description}>
                Connect to a local Ollama instance. Ensure Ollama is running with <code>OLLAMA_ORIGINS="*"</code> to allow browser access.
            </p>

            <div className={styles.inputGroup}>
                <label>Base URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => onUpdate('ollamaBaseUrl', e.target.value)}
                        placeholder="http://localhost:11434"
                        style={{ flex: 1 }}
                    />
                    <button
                        className={styles.button}
                        onClick={probeModels}
                        disabled={isProbing}
                    >
                        {isProbing ? 'Probing...' : 'Detect Models'}
                    </button>
                </div>
                {error && (
                    <div style={{
                        marginTop: '8px',
                        padding: '12px',
                        backgroundColor: '#fff5f5',
                        border: '1px solid #feb2b2',
                        borderRadius: '6px',
                        color: '#c53030',
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>⚠️ Connection Issue</div>
                        {error}
                        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#742a2a' }}>
                            <strong>Common fix:</strong> Run <code>$env:OLLAMA_ORIGINS="*"; ollama serve</code> in your terminal.
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.inputGroup}>
                <label>Available Models</label>
                {models.length > 0 ? (
                    <select
                        className={styles.select}
                        value={model}
                        onChange={(e) => onUpdate('ollamaModel', e.target.value)}
                    >
                        <option value="" disabled>-- Select a Model --</option>
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                            type="text"
                            value={model}
                            onChange={(e) => onUpdate('ollamaModel', e.target.value)}
                            placeholder="llama3, mistral, gemma, etc."
                        />
                        <small>No models detected. Enter model name manually or check your Ollama container/service.</small>
                    </div>
                )}
            </div>
        </div>
    );
};

interface CostSettingsProps {
    inputCost: number;
    outputCost: number;
    onUpdate: CampaignConfigUpdater;
}

const CostSettings: FC<CostSettingsProps> = ({ inputCost, outputCost, onUpdate }) => {
    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Token Cost Estimation</h3>
            <p className={styles.description}>
                Define the cost per 1,000 tokens (approx. 4,000 characters) to estimate API usage costs.
                Default for Gemini 1.5 Flash is roughly $0.00035 (Input) and $0.00105 (Output).
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-l)' }}>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label>Cost per 1k Input Tokens ($)</label>
                    <input
                        type="number"
                        step="0.00001"
                        min="0"
                        value={inputCost || 0}
                        onChange={(e) => onUpdate('aiCostPer1kInput', parseFloat(e.target.value))}
                    />
                </div>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label>Cost per 1k Output Tokens ($)</label>
                    <input
                        type="number"
                        step="0.00001"
                        min="0"
                        value={outputCost || 0}
                        onChange={(e) => onUpdate('aiCostPer1kOutput', parseFloat(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};

export const AISettingsManager: FC = () => {
    const config = useCampaignStore(s => s.config);
    const updateConfig = useCampaignStore(s => s.updateConfig);

    const provider: NonNullable<CampaignConfiguration['apiProvider']> = config.apiProvider ?? 'gemini';
    const currentModel = config.aiModel || 'gemini-2.5-flash';
    const ollamaUrl = config.ollamaBaseUrl || 'http://localhost:11434';
    const ollamaModel = config.ollamaModel || 'llama3';

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>AI Provider</h3>
                <p className={styles.description}>
                    Choose which AI service powers the generator. You can use global cloud providers or local models.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                    {[
                        { id: 'gemini', name: '✨ Gemini' },
                        { id: 'ollama', name: '🦙 Ollama' },
                        { id: 'claude', name: '🧠 Claude' },
                        { id: 'openai', name: '🤖 OpenAI' },
                        { id: 'lm-studio', name: '💻 LM Studio' },
                        { id: 'openrouter', name: '🌐 OpenRouter' },
                        { id: 'dummy', name: '🧪 Dummy' }
                    ].map(p => (
                        <div
                            key={p.id}
                            className={cx(styles.providerOption, { selected: provider === p.id })}
                            onClick={() => updateConfig('apiProvider', p.id as CampaignConfiguration['apiProvider'])}
                        >
                            {p.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Provider Specific Configs */}
            {(provider !== 'ollama' && provider !== 'dummy' && provider !== 'gemini') && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>{provider.toUpperCase()} Configuration</h3>
                    <div className={styles.inputGroup}>
                        <label>API Key</label>
                        <input
                            type="password"
                            value={config.apiKey || ''}
                            onChange={(e) => updateConfig('apiKey', e.target.value)}
                            placeholder="sk-..."
                        />
                    </div>
                    {['openai', 'openrouter', 'lm-studio'].includes(provider) && (
                        <div className={styles.inputGroup}>
                            <label>Base URL (Optional Override)</label>
                            <input
                                type="text"
                                value={config.baseUrl || ''}
                                onChange={(e) => updateConfig('baseUrl', e.target.value)}
                                placeholder={provider === 'lm-studio' ? 'http://localhost:1234/v1' : 'Default'}
                            />
                        </div>
                    )}
                    <div className={styles.inputGroup}>
                        <label>Preferred Model</label>
                        <input
                            type="text"
                            value={config.aiModel || ''}
                            onChange={(e) => updateConfig('aiModel', e.target.value)}
                            placeholder="e.g. gpt-4o, claude-3-5-sonnet-latest"
                        />
                    </div>
                </div>
            )}

            {provider === 'gemini' && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Gemini Configuration</h3>
                    <p className={styles.description}>
                        Select the Google Gemini model. Requires a valid API key (configured elsewhere).
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
                        {AI_MODELS.filter(m => m.id !== 'dummy').map(model => (
                            <label key={model.id} className={cx("custom-radio", styles.modelOption, { 'selected': currentModel === model.id })}>
                                <input
                                    type="radio"
                                    name="aiModel"
                                    value={model.id}
                                    checked={currentModel === model.id}
                                    onChange={() => updateConfig('aiModel', model.id)}
                                />
                                <span className="radio-checkmark"></span>
                                <div>
                                    <span className={styles.modelTitle}>{model.name}</span>
                                    <span className={styles.modelDesc}>{model.description}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {provider === 'ollama' && (
                <OllamaConfig
                    url={ollamaUrl}
                    model={ollamaModel}
                    onUpdate={(f, v) => updateConfig(f, v)}
                />
            )}

            {provider === 'dummy' && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Dummy Mode</h3>
                    <p className={styles.description}>
                        Returns instant, pre-written responses for testing UI layouts without making API calls. No configuration needed.
                    </p>
                </div>
            )}

            <CostSettings
                inputCost={config.aiCostPer1kInput || 0}
                outputCost={config.aiCostPer1kOutput || 0}
                onUpdate={updateConfig}
            />
        </div>
    );
};
