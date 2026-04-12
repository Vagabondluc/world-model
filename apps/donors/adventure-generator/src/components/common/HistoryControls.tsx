
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { useCompendiumStore } from '../../stores/compendiumStore';

const styles = {
    container: css`
        display: flex;
        gap: var(--space-s);
        align-items: center;
    `,
    button: css`
        background: transparent;
        border: 1px solid var(--medium-brown);
        color: var(--dark-brown);
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 1rem;
        cursor: pointer;
        opacity: 0.8;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;

        &:hover:not(:disabled) {
            background-color: rgba(0,0,0,0.05);
            opacity: 1;
            transform: translateY(-1px);
        }

        &:disabled {
            opacity: 0.3;
            cursor: default;
            border-color: var(--light-brown);
        }
    `
};

export const HistoryControls: FC = () => {
    const { navigationStack, historyIndex, navigateBack, navigateForward } = useCompendiumStore(s => ({
        navigationStack: s.navigationStack,
        historyIndex: s.historyIndex,
        navigateBack: s.navigateBack,
        navigateForward: s.navigateForward
    }));

    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < navigationStack.length - 1;

    return (
        <div className={styles.container}>
            <button 
                className={styles.button} 
                onClick={navigateBack} 
                disabled={!canGoBack}
                title="Back"
                aria-label="Go back in history"
            >
                ←
            </button>
            <button 
                className={styles.button} 
                onClick={navigateForward} 
                disabled={!canGoForward}
                title="Forward"
                aria-label="Go forward in history"
            >
                →
            </button>
        </div>
    );
};
