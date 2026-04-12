
import React, { FC, PropsWithChildren } from 'react';
import { css, cx } from '@emotion/css';
import { Overlay } from './Overlay';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    width?: string;
}

const styles = {
    overlay: css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;

        &.open {
            opacity: 1;
            visibility: visible;
        }
    `,
    drawer: css`
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: var(--card-bg);
        width: 100%;
        max-width: 600px;
        z-index: 2001;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        display: flex;
        flex-direction: column;
        border-left: var(--border-main);

        &.open {
            transform: translateX(0);
        }

        @media (max-width: 600px) {
            max-width: 100%;
        }
    `,
    header: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-m) var(--space-l);
        border-bottom: var(--border-main);
        background-color: var(--parchment-bg);
        flex-shrink: 0;

        h3 {
            margin: 0;
            font-size: 1.5rem;
            color: var(--dark-brown);
            font-family: var(--header-font);
        }
    `,
    closeBtn: css`
        background: transparent;
        border: none;
        font-size: 2rem;
        line-height: 1;
        color: var(--medium-brown);
        cursor: pointer;
        padding: 0 8px;
        transition: color 0.2s;

        &:hover {
            color: var(--dnd-red);
        }
    `,
    content: css`
        flex: 1;
        overflow-y: auto;
        padding: var(--space-l);
    `
};

export const Drawer: FC<PropsWithChildren<DrawerProps>> = ({ isOpen, onClose, title, width, children }) => (
    <>
        <Overlay isOpen={isOpen} onClose={onClose} className={styles.overlay} keepMounted>
            {/* Backdrop only */}
        </Overlay>
        <div
            className={cx(styles.drawer, { open: isOpen })}
            style={width ? { maxWidth: width } : undefined}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Drawer'}
            onClick={e => e.stopPropagation()}
        >
            <div className={styles.header}>
                {title && <h3>{title}</h3>}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
                    &times;
                </button>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    </>
);
