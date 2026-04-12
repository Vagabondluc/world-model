import React, { FC } from 'react';
import { css } from '@emotion/css';

interface SettingsManagerProps {
    onSaveSession: () => void;
    onLoadSession: () => void;
    onClearSession: () => void;
    onCreateBackup: () => void;
    onRestoreBackup: () => void;
}

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-xl);
    `,
    section: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        padding-bottom: var(--space-l);
        border-bottom: 1px solid var(--border-light);
    `,
    title: css`
        font-family: var(--header-font);
        font-size: 1.35rem;
        color: var(--dark-brown);
        margin: 0;
    `,
    description: css`
        margin: 0;
        color: var(--medium-brown);
        line-height: 1.5;
    `,
    actionRow: css`
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-s);
    `,
    dangerZone: css`
        border: 2px dashed var(--error-red);
        background-color: var(--error-bg);
        padding: var(--space-l);
        border-radius: var(--border-radius);
    `,
};

export const SettingsManager: FC<SettingsManagerProps> = ({ onSaveSession, onLoadSession, onClearSession, onCreateBackup, onRestoreBackup }) => {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h3 className={styles.title}>Session</h3>
                <p className={styles.description}>
                    Adventure Generator MVP stores durable state in the canonical world-model bundle. Use these actions to save,
                    reload, and back up the current campaign session.
                </p>
                <div className={styles.actionRow}>
                    <button className="primary-button" onClick={onSaveSession}>💾 Save World Model</button>
                    <button className="secondary-button" onClick={onLoadSession}>📁 Load World Model</button>
                    <button className="secondary-button" onClick={onCreateBackup}>🧰 Create Backup</button>
                    <button className="secondary-button" onClick={onRestoreBackup}>♻️ Restore Backup</button>
                </div>
            </div>

            <div className={styles.dangerZone}>
                <h3 className={styles.title}>Local Cache</h3>
                <p className={styles.description}>
                    Clears the local browser/IndexedDB cache only. Campaign files in the selected folder are left intact.
                </p>
                <button className="secondary-button" onClick={onClearSession}>🗑️ Clear Local Cache</button>
            </div>
        </div>
    );
};
