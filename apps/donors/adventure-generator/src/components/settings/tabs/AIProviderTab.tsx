import React, { FC } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../../styles/theme';
import { AISettingsManager } from '../../ai/AISettingsManager';
import { ModelSelector } from '../../backend/ModelSelector';
import { useBackendStore } from '../../../stores/backendStore';
import { Cpu, Share2 } from 'lucide-react';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.l};
    `,
    section: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.m};
    `,
    sectionTitle: css`
        font-family: ${theme.fonts.header};
        font-size: 1.1rem;
        font-weight: 600;
        color: ${theme.colors.accent};
        margin: 0;
        padding-bottom: ${theme.spacing.s};
        border-bottom: ${theme.borders.light};
        display: flex;
        align-items: center;
        gap: 10px;
    `,
    description: css`
        font-size: 0.9rem;
        color: ${theme.colors.textMuted};
        line-height: 1.5;
        margin: 0;
    `,
    sliderContainer: css`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,
    sliderLabel: css`
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: ${theme.colors.textMuted};
    `,
    slider: css`
        width: 100%;
        height: 6px;
        appearance: none;
        background: ${theme.colors.textLight};
        border-radius: 3px;
        cursor: pointer;

        &::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            background: ${theme.colors.accent};
            border-radius: 50%;
            cursor: pointer;
        }
    `,
    sliderHint: css`
        font-size: 0.8rem;
        color: ${theme.colors.textMuted};
        font-style: italic;
    `,
    inputGroup: css`
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: ${theme.spacing.m};

        label {
            font-size: 0.85rem;
            color: ${theme.colors.textMuted};
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }
    `,
    select: css`
        padding: 10px 14px;
        background: ${theme.colors.inputBg};
        border: 1px solid ${theme.colors.inputBorder};
        border-radius: ${theme.borders.radius};
        color: ${theme.colors.inputText};
        font-size: 0.9rem;
        cursor: pointer;

        &:focus {
            outline: none;
            border-color: ${theme.colors.inputFocus};
        }
    `,
};

export const AIProviderTab: FC = () => {
    const {
        temperature,
        updateConfig,
        activeProvider,
        setProvider,
    } = useBackendStore();

    return (
        <div className={styles.container}>
            {/* Main AI Settings from Campaign */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🤖 AI Provider Configuration</h3>
                <p className={styles.description}>
                    Choose which AI service powers the generator. Configure API keys, models, and connection settings.
                </p>
                <AISettingsManager />
            </div>

            {/* Backend-Specific AI Config */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                    <Cpu size={18} /> Advanced Model Config
                </h3>

                <div className={styles.inputGroup}>
                    <label>
                        <Share2 size={12} /> Active Provider (Backend Override)
                    </label>
                    <select
                        value={activeProvider}
                        onChange={(e) => setProvider(e.target.value)}
                        className={styles.select}
                    >
                        <option value="ollama">Ollama (Local/Native)</option>
                        <option value="lm_studio">LM Studio (Local Host)</option>
                        <option value="webui">Text Gen WebUI (Port 5000)</option>
                    </select>
                </div>

                <ModelSelector />

                <div className={styles.sliderContainer} style={{ marginTop: 'var(--space-l)' }}>
                    <div className={styles.sliderLabel}>
                        <span>Creativity Level (Temperature)</span>
                        <span>{temperature}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
                        className={styles.slider}
                    />
                    <p className={styles.sliderHint}>
                        Lower values are more predictable. Higher values are more creative but chaotic.
                    </p>
                </div>
            </div>
        </div>
    );
};
