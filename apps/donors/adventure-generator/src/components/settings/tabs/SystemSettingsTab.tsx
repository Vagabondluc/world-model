import React, { FC, useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { ThemeSkin, theme } from '../../../styles/theme';
import { useBackendStore } from '../../../stores/backendStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { RotateCcw, Power, Eye, EyeOff, Shield, Palette } from 'lucide-react';
import { LogViewer } from '../../backend/LogViewer';
import { AddonCard } from '../../backend/AddonCard';
import { ProviderStatusPanel } from '../../backend/ProviderStatusPanel';

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
    grid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${theme.spacing.l};

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    `,
    lifecycleButtons: css`
        display: flex;
        gap: ${theme.spacing.s};
        flex-wrap: wrap;
    `,
    button: css`
        padding: 10px 18px;
        border-radius: ${theme.borders.radius};
        font-size: 0.9rem;
        font-weight: 500;
        font-family: ${theme.fonts.body};
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
    `,
    warningButton: css`
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.3);

        &:hover {
            background: rgba(245, 158, 11, 0.25);
        }
    `,
    dangerButton: css`
        background: ${theme.colors.errorBg};
        color: ${theme.colors.error};
        border: 1px solid ${theme.colors.error};

        &:hover {
            background: ${theme.colors.error};
            color: white;
        }
    `,
    addonGrid: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.m};
    `,
    logSection: css`
        background: ${theme.colors.card};
        border: ${theme.borders.light};
        border-radius: ${theme.borders.radius};
        padding: ${theme.spacing.m};
        min-height: 300px;
        max-height: 400px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    `,
    inputGroup: css`
        display: flex;
        flex-direction: column;
        gap: 8px;

        label {
            font-size: 0.85rem;
            color: ${theme.colors.textMuted};
            font-weight: 500;
        }
    `,
    inputRow: css`
        display: flex;
        gap: 8px;
    `,
    input: css`
        flex: 1;
        padding: 10px 14px;
        background: ${theme.colors.inputBg};
        border: 1px solid ${theme.colors.inputBorder};
        border-radius: ${theme.borders.radius};
        color: ${theme.colors.inputText};
        font-size: 0.9rem;

        &:focus {
            outline: none;
            border-color: ${theme.colors.inputFocus};
        }
    `,
    iconButton: css`
        padding: 10px;
        background: transparent;
        border: 1px solid ${theme.colors.inputBorder};
        border-radius: ${theme.borders.radius};
        color: ${theme.colors.textMuted};
        cursor: pointer;

        &:hover {
            background: ${theme.colors.card};
            color: ${theme.colors.text};
        }
    `,
};

export const SystemSettingsTab: FC = () => {
    const {
        addons,
        connectLogs,
        toggleAddon,
        restartServer,
        stopServer,
        apiKey,
        setApiKey,
    } = useBackendStore();

    const { themeSkin, setThemeSkin } = useSettingsStore();

    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        connectLogs();
    }, [connectLogs]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-l)' }}>
                    {/* Provider Status */}
                    <ProviderStatusPanel />

                    {/* Theme Settings */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Palette size={18} /> Appearance
                        </h3>
                        <div className={styles.inputGroup}>
                            <label>Interface Theme</label>
                            <select
                                className={styles.input}
                                value={themeSkin}
                                onChange={(e) => setThemeSkin(e.target.value as ThemeSkin)}
                            >
                                <option value="parchment">📜 Digital Parchment (Classic)</option>
                                <option value="modern">🌑 Modern Dark</option>
                                <option value="highContrast">👁️ High Contrast</option>
                            </select>
                            <p style={{ fontSize: '0.8rem', color: theme.colors.textMuted, marginTop: '4px' }}>
                                Affects all generator views. "Digital Parchment" is the default immersive experience.
                            </p>
                        </div>
                    </div>

                    {/* Security */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Shield size={18} /> Security
                        </h3>
                        <div className={styles.inputGroup}>
                            <label>API Key (Required for external access)</label>
                            <div className={styles.inputRow}>
                                <input
                                    type={showKey ? "text" : "password"}
                                    value={apiKey || ""}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter Server API Key..."
                                    className={styles.input}
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className={styles.iconButton}
                                >
                                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Server Lifecycle */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>🔄 Server Lifecycle</h3>
                        <div className={styles.lifecycleButtons}>
                            <button className={`${styles.button} ${styles.warningButton}`} onClick={restartServer}>
                                <RotateCcw size={16} /> Restart Server
                            </button>
                            <button className={`${styles.button} ${styles.dangerButton}`} onClick={stopServer}>
                                <Power size={16} /> Stop Server
                            </button>
                        </div>
                    </div>

                    {/* Addons */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>🧩 Installed Add-ons</h3>
                        <div className={styles.addonGrid}>
                            <AddonCard
                                name="D&D 5e Core"
                                description="Standard 5th edition ruleset, creature generation, and encounter balancing."
                                isActive={addons.includes('dnd')}
                                onToggle={(enabled: boolean) => toggleAddon('dnd', enabled)}
                            />
                            <AddonCard
                                name="Sci-Fi Expansion (Alpha)"
                                description="Starship generation and planetary systems. (In Development)"
                                isActive={false}
                                onToggle={() => { }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Logs */}
                <div className={styles.logSection}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: '12px' }}>📜 System Logs</h3>
                    <LogViewer />
                </div>
            </div>
        </div>
    );
};
