
import React, { FC, useState, ReactNode } from 'react';
import { css } from '@emotion/css';
import { LoadingSkeleton } from './LoadingSkeleton';
import { OriginContext } from '../../schemas/common';
import { useContextualNavigation } from '../../hooks/useContextualNavigation';

interface DetailViewLayoutProps {
    onBack: () => void;
    isLoading: boolean;
    hasDetails: boolean;
    title: ReactNode;
    summaryLabel: string;
    summary: string;
    onGenerate: (context: string) => void;
    headerActions?: ReactNode;
    additionalControls?: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
    origin?: OriginContext; // New Prop
}

const styles = {
    container: css`
        background-color: var(--card-bg);
        padding: var(--space-xl);
        border-radius: var(--border-radius);
        border: var(--border-main);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: var(--space-l);

        h3 { margin-top: 0; margin-bottom: var(--space-m); font-size: 1.8rem; color: var(--dnd-red); }
        h4 { margin-top: var(--space-l); margin-bottom: var(--space-s); color: var(--dark-brown); border-bottom: 1px solid var(--light-brown); padding-bottom: 4px; }
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-l);
        padding-bottom: var(--space-m);
        border-bottom: 1px solid var(--border-main);
        gap: var(--space-m);
    `,
    leftActions: css`
        display: flex;
        gap: var(--space-s);
    `,
    summary: css`
        font-style: italic;
        color: var(--medium-brown);
        margin-bottom: var(--space-l);
        font-size: 1.1rem;
    `,
    controls: css`
        margin-top: var(--space-xl);
        padding-top: var(--space-l);
        border-top: 1px solid var(--light-brown);
        background-color: rgba(0,0,0,0.02);
        padding: var(--space-l);
        border-radius: var(--border-radius);
    `
};

export const DetailViewLayout: FC<DetailViewLayoutProps> = ({
    onBack, isLoading, hasDetails, title, summaryLabel, summary,
    onGenerate, headerActions, additionalControls, footer, children, origin
}) => {
    const [context, setContext] = useState('');
    const { returnToSource } = useContextualNavigation();

    if (isLoading && !hasDetails) {
        return <LoadingSkeleton type="detail-view" />;
    }

    const showReturnButton = origin?.type === 'generator' && !!origin.historyStateId;

    return (
        <div className={styles.container} aria-busy={isLoading}>
            <div className={styles.header}>
                <div className={styles.leftActions}>
                    <button className="primary-button" onClick={onBack}>← Back to Hub</button>
                    {showReturnButton && (
                        <button className="secondary-button" onClick={() => returnToSource(origin)} title="Restore the Generator state where this was created">
                            ⚙️ Return to Generator
                        </button>
                    )}
                </div>
                {headerActions && <div>{headerActions}</div>}
            </div>
            <div>
                <h3>{title}</h3>
                <p className={styles.summary}><strong>{summaryLabel}:</strong> {summary}</p>
                
                {children}

                <div className={styles.controls}>
                    {additionalControls}
                    <label htmlFor="generation-context" style={{fontWeight: 'bold', marginBottom: 'var(--space-s)', display: 'block'}}>Your Creative Context (Optional)</label>
                    <textarea
                        id="generation-context"
                        className="context-input"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="e.g., Add a specific plot twist, include a certain item..."
                        rows={3}
                    />
                    <div style={{ textAlign: 'right', marginTop: 'var(--space-m)' }}>
                        <button 
                            className="action-button" 
                            onClick={() => onGenerate(context)} 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Generating...' : hasDetails ? 'Regenerate Details' : 'Generate Details'}
                        </button>
                    </div>
                </div>
                
                {footer}
            </div>
        </div>
    );
};
