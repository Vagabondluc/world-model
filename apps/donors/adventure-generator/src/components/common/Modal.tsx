
import React, { FC, PropsWithChildren } from 'react';
import { css, cx, keyframes } from '@emotion/css';
import { Overlay } from './Overlay';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'standard' | 'large';
}

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
`;

const styles = {
    overlay: css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 5000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(2px);
        animation: ${fadeIn} 0.2s ease-out;
    `,
    container: css`
        background-color: var(--parchment-bg);
        border-radius: var(--border-radius);
        border: 4px solid var(--dark-brown);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        width: 90%;
        max-width: 500px;
        overflow: hidden;

        &.large {
            max-width: 900px;
        }
    `,
    header: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-m) var(--space-l);
        background-color: var(--card-bg);
        border-bottom: 2px solid var(--medium-brown);
        flex-shrink: 0;

        h3 {
            margin: 0;
            font-family: var(--header-font);
            font-size: 1.5rem;
            color: var(--dnd-red);
        }
    `,
    closeBtn: css`
        background: transparent;
        border: none;
        font-size: 2rem;
        line-height: 1;
        color: var(--medium-brown);
        cursor: pointer;
        padding: 0 var(--space-s);
        transition: color 0.2s;

        &:hover {
            color: var(--dnd-red);
        }
    `,
    content: css`
        padding: var(--space-l);
        overflow-y: auto;
    `
};

export const Modal: FC<PropsWithChildren<ModalProps>> = ({ isOpen, onClose, title, size = 'standard', children }) => (
    <Overlay isOpen={isOpen} onClose={onClose} className={styles.overlay}>
        <div className={cx(styles.container, { [size]: true })} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className={styles.header}>
                <h3 id="modal-title">{title}</h3>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">×</button>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    </Overlay>
);
