
import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { useAiLedgerStore } from '../../stores/aiLedgerStore';
import { AiRequestEntry } from '../../schemas/aiLedger';

const styles = {
    container: css`
        height: 100%;
        display: flex;
        background: var(--parchment-bg);
        color: var(--dark-brown);
        overflow: hidden;
    `,
    sidebar: css`
        width: 250px;
        background: var(--card-bg);
        border-right: 1px solid var(--border-light);
        padding: var(--space-m);
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    sidebarTitle: css`
        font-family: var(--header-font);
        font-size: 0.8rem;
        text-transform: uppercase;
        color: var(--medium-brown);
        margin-bottom: var(--space-xs);
    `,
    sidebarSection: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
    `,
    stats: css`
        padding: var(--space-m);
        background: rgba(255, 255, 255, 0.5);
        border-radius: var(--border-radius);
        
        div {
            display: flex;
            justify-content: space-between;
            margin-bottom: var(--space-xs);
            font-size: 0.9rem;
        }
        
        span {
            font-weight: bold;
            color: var(--medium-brown);
        }
        
        strong {
            color: var(--dark-brown);
        }
    `,
    sidebarButton: css`
        padding: var(--space-s) var(--space-m);
        background: var(--card-bg);
        color: var(--dark-brown);
        border: 1px solid var(--border-light);
        border-radius: 4px;
        cursor: pointer;
        font-family: var(--header-font);
        font-size: 0.85rem;
        text-align: left;
        transition: all 0.2s;
        
        &:hover {
            background: rgba(0, 0, 0, 0.05);
        }
        
        &.danger {
            color: var(--dnd-red);
            border-color: var(--dnd-red);
            
            &:hover {
                background: #fff5f5;
            }
        }
    `,
    content: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `,
    header: css`
        padding: var(--space-m);
        border-bottom: 2px solid var(--border-light);
        background: rgba(255, 255, 255, 0.5);
    `,
    title: css`
        font-family: var(--header-font);
        font-size: 1.5rem;
        margin: 0;
        color: var(--dnd-red);
    `,
    list: css`
        flex: 1;
        overflow-y: auto;
        padding: var(--space-m);
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    entryCard: css`
        background: white;
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
        padding: var(--space-m);
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        transition: all 0.2s;
        
        &:hover {
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    `,
    entryHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px solid #eee;
        padding-bottom: 6px;
        margin-bottom: 4px;
    `,
    modelBadge: css`
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--parchment-dark);
        color: var(--dark-brown);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `,
    costBadge: css`
        font-weight: bold;
        color: var(--dnd-red);
        background: #fff5f5;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.85rem;
        border: 1px solid #feb2b2;
    `,
    timestamp: css`
        font-size: 0.8rem;
        color: #888;
    `,
    detailSection: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,
    detailLabel: css`
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #888;
        font-weight: bold;
    `,
    codeBlock: css`
        background: #f8f8f8;
        padding: 8px;
        border-radius: 4px;
        font-family: 'Consolas', monospace;
        font-size: 0.85rem;
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 150px;
        overflow-y: auto;
        border: 1px solid #eee;
        color: #333;
    `,
    expandBtn: css`
        background: none;
        border: none;
        color: var(--dnd-red);
        cursor: pointer;
        padding: 0;
        font-size: 0.8rem;
        text-align: left;
        margin-top: 4px;
        &:hover { text-decoration: underline; }
    `,
    emptyState: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--medium-brown);
        gap: var(--space-m);
        
        p { margin: 0; }
    `
};

const EntryCard: FC<{ entry: AiRequestEntry }> = ({ entry }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={styles.entryCard}>
            <div className={styles.entryHeader}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={styles.modelBadge}>{entry.provider} : {entry.model}</span>
                        <span className={styles.timestamp}>
                            {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <span className={styles.costBadge}>${entry.cost.toFixed(5)}</span>
            </div>

            <div className={styles.detailSection}>
                <span className={styles.detailLabel}>
                    Input ({entry.estimatedInputTokens} est. tokens)
                </span>
                <div className={styles.codeBlock}>
                    {expanded ? entry.input : (entry.input.slice(0, 150) + (entry.input.length > 150 ? '...' : ''))}
                </div>
            </div>

            <div className={styles.detailSection}>
                <span className={styles.detailLabel}>
                    Output ({entry.estimatedOutputTokens} est. tokens)
                </span>
                <div className={styles.codeBlock}>
                    {expanded ? entry.output : (entry.output.slice(0, 150) + (entry.output.length > 150 ? '...' : ''))}
                </div>
            </div>

            {(entry.input.length > 150 || entry.output.length > 150) && (
                <button className={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    );
}

interface AiLedgerViewProps {
    onBack?: () => void;
}

export const AiLedgerView: FC<AiLedgerViewProps> = () => {
    const entries = useAiLedgerStore(s => s.entries);
    const totalCost = useAiLedgerStore(s => s.totalCost);
    const clearLedger = useAiLedgerStore(s => s.clearLedger);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarTitle}>Statistics</div>
                    <div className={styles.stats}>
                        <div>
                            <span>Session Cost:</span>
                            <strong>${totalCost.toFixed(4)}</strong>
                        </div>
                        <div>
                            <span>Total Requests:</span>
                            <strong>{entries.length}</strong>
                        </div>
                    </div>
                </div>

                {entries.length > 0 && (
                    <div className={styles.sidebarSection}>
                        <div className={styles.sidebarTitle}>Actions</div>
                        <button
                            className={`${styles.sidebarButton} danger`}
                            onClick={clearLedger}
                        >
                            🗑️ Clear Ledger
                        </button>
                        <button className={styles.sidebarButton}>
                            📊 Export CSV
                        </button>
                    </div>
                )}
            </aside>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.title}>AI Request Ledger</h2>
                </div>

                <div className={styles.list}>
                    {entries.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No AI requests recorded in this session.</p>
                            <small>Requests will appear here as they are generated.</small>
                        </div>
                    ) : (
                        entries.map(entry => (
                            <EntryCard key={entry.id} entry={entry} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
