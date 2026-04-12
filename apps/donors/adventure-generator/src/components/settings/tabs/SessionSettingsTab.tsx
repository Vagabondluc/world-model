import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../../styles/theme';
import { FileSystemStore } from '../../../services/fileSystemStore';
import { SrdImportService } from '../../../services/srdImportService';
import { db } from '../../../services/db';
import { useCampaignStore } from '../../../stores/campaignStore';
import { SOURCE_LABELS } from '../../../services/databaseRegistry';
import { NarrativeCard } from '../../narrative-kit/NarrativeCard';

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
    button: css`
        padding: 10px 20px;
        border-radius: ${theme.borders.radius};
        font-size: 0.9rem;
        font-weight: 500;
        font-family: ${theme.fonts.body};
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    `,
    primaryButton: css`
        background: ${theme.colors.accent};
        border: none;
        color: white;

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(146, 38, 16, 0.3);
        }
    `,
    secondaryButton: css`
        background: ${theme.colors.card};
        border: ${theme.borders.light};
        color: ${theme.colors.text};

        &:hover {
            background: ${theme.colors.bg};
        }
    `,
    dangerButton: css`
        background: ${theme.colors.errorBg};
        border: 1px solid ${theme.colors.error};
        color: ${theme.colors.error};

        &:hover {
            background: ${theme.colors.error};
            color: white;
        }
    `,
    dangerZone: css`
        border: 2px dashed ${theme.colors.error};
        background: ${theme.colors.errorBg};
        border-radius: ${theme.borders.radius};
        padding: ${theme.spacing.l};
    `,
    status: css`
        margin-top: ${theme.spacing.s};
        padding: ${theme.spacing.m};
        border-radius: ${theme.borders.radius};
        font-size: 0.9rem;
        font-weight: 500;
    `,
    statusSuccess: css`
        background: rgba(42, 125, 42, 0.1);
        border: 1px solid ${theme.colors.success};
        color: ${theme.colors.success};
    `,
    statusError: css`
        background: ${theme.colors.errorBg};
        border: 1px solid ${theme.colors.error};
        color: ${theme.colors.error};
    `,
    statusInfo: css`
        background: ${theme.colors.card};
        border: ${theme.borders.light};
        color: ${theme.colors.textMuted};
    `,
    sourceGrid: css`
        display: flex;
        flex-wrap: wrap;
        gap: ${theme.spacing.s};
    `,
    sourceChip: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        background: ${theme.colors.card};
        border: ${theme.borders.light};
        border-radius: ${theme.borders.radius};
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            border-color: ${theme.colors.accent};
        }

        input {
            accent-color: ${theme.colors.accent};
        }

        label {
            color: ${theme.colors.text};
            font-size: 0.9rem;
            cursor: pointer;
        }
    `,
    actionRow: css`
        display: flex;
        gap: ${theme.spacing.s};
        flex-wrap: wrap;
    `,
};

interface SessionSettingsTabProps {
    onSaveSession: () => void;
    onLoadSession: () => void;
    onClearSession: () => void;
    onCreateBackup: () => void;
    onRestoreBackup: () => void;
}

export const SessionSettingsTab: FC<SessionSettingsTabProps> = ({ onSaveSession, onLoadSession, onClearSession, onCreateBackup, onRestoreBackup }) => {
    const [importStatus, setImportStatus] = useState<string>('');
    const [importStatusType, setImportStatusType] = useState<'success' | 'error' | 'info'>('info');
    const [availableSources, setAvailableSources] = useState<string[]>([]);

    const enabledContentSources = useCampaignStore(s => s.config.enabledContentSources);
    const updateConfig = useCampaignStore(s => s.updateConfig);
    const refreshEnabledDatabases = useCampaignStore(s => s.refreshEnabledDatabases);

    React.useEffect(() => {
        const loadSources = async () => {
            try {
                const keys = await db.bestiary.orderBy('source').uniqueKeys();
                const sources = keys.map(k => String(k)).filter(s => s && s !== 'user' && s !== 'undefined');
                setAvailableSources(sources);
            } catch (e) {
                console.error("Failed to load content sources", e);
            }
        };
        loadSources();
    }, [importStatus]);

    const toggleSource = (source: string) => {
        const current = enabledContentSources || [];
        let nextList: string[];
        const effectiveList = (current && current.length > 0) ? current : availableSources;

        if (effectiveList.includes(source)) {
            nextList = effectiveList.filter(s => s !== source);
        } else {
            nextList = [...effectiveList, source];
        }

        updateConfig('enabledContentSources', nextList);
    };

    const handleImportSrd = async () => {
        try {
            const selected = await FileSystemStore.openDirectoryDialog("Select SRD Data Directory");

            if (selected) {
                setImportStatus('Importing... (this may take a moment)');
                setImportStatusType('info');
                const service = new SrdImportService();
                const report = await service.importFromDirectory(selected as string);
                setImportStatus(`✅ Import Complete: ${report.monsters} monsters, ${report.lore} lore, ${report.collections} collections.`);
                setImportStatusType('success');

                const currentDbs = useCampaignStore.getState().config.enabledDatabases || [];
                if (!currentDbs.includes('imported')) {
                    updateConfig('enabledDatabases', [...currentDbs, 'imported']);
                } else {
                    refreshEnabledDatabases();
                }

                if (report.errors.length > 0) {
                    console.error("Import Errors:", report.errors);
                    setImportStatus(`⚠️ Import finished with ${report.errors.length} errors. Check console.`);
                    setImportStatusType('error');
                }
            }
        } catch (e) {
            console.error("Import Failed:", e);
            setImportStatus(`❌ Import Failed: ${e}`);
            setImportStatusType('error');
        }
    };

    return (
        <div className={styles.container}>
            {/* Session Export/Import */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>💾 Session Backup</h3>
                <p className={styles.description}>
                    Export your entire session (campaign settings, maps, bestiary, etc.) to a JSON file as a backup or to move to another device.
                </p>
                <div className={styles.actionRow}>
                    <button className={`${styles.button} ${styles.primaryButton}`} onClick={onSaveSession}>
                        💾 Export Session
                    </button>
                    <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onCreateBackup}>
                        🧰 Create Local Backup
                    </button>
                    <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onLoadSession}>
                        📁 Import Session
                    </button>
                    <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onRestoreBackup}>
                        ♻️ Restore Local Backup
                    </button>
                </div>
            </div>

            {/* SRD Import */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📚 SRD Database Import</h3>
                <p className={styles.description}>
                    Import content from a directory containing valid YAML (monsters), Markdown (lore), or JSON (collections) files.
                </p>
                <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleImportSrd}>
                    📚 Import SRD Data
                </button>
                {importStatus && (
                    <div className={`${styles.status} ${importStatusType === 'success' ? styles.statusSuccess : importStatusType === 'error' ? styles.statusError : styles.statusInfo}`}>
                        {importStatus}
                    </div>
                )}
            </div>

            {/* Content Sources */}
            {availableSources.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>📖 Manage Content Sources</h3>
                    <p className={styles.description}>
                        Select which content sources are active in your campaign.
                    </p>
                    <div className={styles.sourceGrid}>
                        {availableSources.map(source => {
                            const isEnabled = (!enabledContentSources || enabledContentSources.length === 0) || enabledContentSources.includes(source);
                            return (
                                <div key={source} className={styles.sourceChip} onClick={() => toggleSource(source)}>
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={() => toggleSource(source)}
                                    />
                                    <label>{SOURCE_LABELS[source] || source}</label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Danger Zone */}
            <div className={styles.dangerZone}>
                <h3 className={styles.sectionTitle}>⚠️ Danger Zone</h3>
                <p className={styles.description}>
                    This will permanently delete all campaign data from your browser's storage and reload the application. This action cannot be undone.
                </p>
                <button className={`${styles.button} ${styles.dangerButton}`} onClick={onClearSession}>
                    🗑️ Clear Session Data
                </button>
            </div>
        </div>
    );
};
