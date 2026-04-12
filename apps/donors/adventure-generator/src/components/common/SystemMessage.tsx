import React, { FC, useEffect } from 'react';
import { css, cx, keyframes } from '@emotion/css';

const fadeInDown = keyframes`
    from { opacity: 0; transform: translate(-50%, -20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
`;

const styles = {
    container: css`
        position: fixed;
        top: var(--space-l);
        left: 50%;
        transform: translateX(-50%);
        padding: var(--space-m) var(--space-l);
        border-radius: var(--border-radius);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: var(--space-l);
        box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        min-width: 300px;
        max-width: 90%;
        justify-content: space-between;
        animation: ${fadeInDown} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-family: var(--stat-body-font);
        font-size: 1.05rem;
        border: 2px solid rgba(0,0,0,0.1);
    `,
    success: css`
        background-color: var(--success-green);
        color: #fff;
    `,
    error: css`
        background-color: var(--error-red);
        color: #fff;
    `,
    text: css`
        margin: 0;
        flex-grow: 1;
    `,
    dismiss: css`
        background: transparent;
        border: none;
        color: inherit;
        font-size: 1.8rem;
        line-height: 1;
        cursor: pointer;
        padding: 0 0 4px 0;
        opacity: 0.7;
        transition: opacity 0.2s;

        &:hover {
            opacity: 1;
        }
    `
};

export const SystemMessage: FC<{ message: { type: 'success' | 'error', text: string } | null, onDismiss: () => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => onDismiss(), 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onDismiss]);

    if (!message) return null;

    return (
        <div 
            className={cx(styles.container, message.type === 'success' ? styles.success : styles.error)} 
            role="alert" 
            aria-live="assertive"
        >
            <p className={styles.text}>{message.text}</p>
            <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss message">&times;</button>
        </div>
    );
};