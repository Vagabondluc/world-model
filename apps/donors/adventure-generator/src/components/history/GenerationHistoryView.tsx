
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { GenerationHistory } from '../../types/generator';

interface GenerationHistoryViewProps {
    history: GenerationHistory[];
    onRestore: (entry: GenerationHistory) => void;
}

const styles = {
    container: css`
        h2 { margin-top: 0; }
        > p { color: var(--medium-brown); margin-bottom: var(--space-xl); }
    `,
    placeholder: css`
        text-align: center;
        padding: var(--space-xxl);
        color: var(--medium-brown);
        font-style: italic;
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
    `,
    list: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    entry: css`
        background-color: var(--card-bg);
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
        padding: var(--space-m);
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-s);
        font-family: var(--header-font);
        font-size: 1.1rem;
    `,
    timestamp: css`
        font-size: 0.85rem;
        color: var(--medium-brown);
        font-family: var(--body-font);
    `,
    details: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95rem;
    `
};

export const GenerationHistoryView: FC<GenerationHistoryViewProps> = ({ history, onRestore }) => {
    return (
        <div className={styles.container}>
            <h2>Generation History</h2>
            <p>Review and restore previous generation states. The most recent items are at the top.</p>
            {history.length === 0 ? (
                <div className={styles.placeholder}><p>No history yet. Generate some content to see it here!</p></div>
            ) : (
                <div className={styles.list}>
                    {history.map(entry => (
                        <div key={entry.id} className={styles.entry}>
                            <div className={styles.header}>
                                <span>{entry.label}</span>
                                <span className={styles.timestamp}>{entry.timestamp.toLocaleString()}</span>
                            </div>
                            <div className={styles.details}>
                                <span>Type: <strong>{entry.type}</strong></span>
                                <button className="secondary-button" onClick={() => onRestore(entry)} style={{fontSize: '0.9rem', padding: '4px 8px'}}>
                                    Restore State
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
