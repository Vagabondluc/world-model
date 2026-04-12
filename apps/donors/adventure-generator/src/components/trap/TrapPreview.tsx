
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { GeneratedTrap } from '../../types/trap';
import { TrapEditForm } from './TrapEditForm';

const styles = {
    outputColumn: css`
        min-width: 0;
    `,
    outputCard: css`
        background-color: var(--card-bg);
        border: var(--border-main);
        border-radius: var(--border-radius);
        padding: var(--space-l);
        min-height: 200px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        animation: fadeIn 0.5s ease;
        width: 100%;
        text-align: left;

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `,
    outputCardFlexCenter: css`
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    placeholderText: css`
        font-style: italic;
        color: var(--medium-brown);
        font-size: 1.2rem;
        text-align: center;
    `
};

interface TrapPreviewProps {
    trap: GeneratedTrap | null;
    onUpdate: (trap: GeneratedTrap) => void;
}

export const TrapPreview: FC<TrapPreviewProps> = ({ trap, onUpdate }) => {
    return (
        <div className={styles.outputColumn}>
            <div className={cx(styles.outputCard, { [styles.outputCardFlexCenter]: !trap })}>
                {trap ? (
                     <TrapEditForm 
                        trap={trap}
                        onSave={onUpdate}
                    />
                ) : (
                    <p className={styles.placeholderText}>Select a tier and click the button to generate a devious trap...</p>
                )}
            </div>
        </div>
    );
};
