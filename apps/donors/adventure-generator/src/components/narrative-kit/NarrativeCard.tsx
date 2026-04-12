import React, { FC, ReactNode } from 'react';
import { css, cx } from '@emotion/css';
import { theme } from '../../styles/theme';

export type NarrativeCardVariant = 'default' | 'compact' | 'parchment';

interface NarrativeCardProps {
    variant?: NarrativeCardVariant;
    isFullscreen?: boolean;
    className?: string;
    children: ReactNode;
    onClick?: () => void;
}

const styles = {
    card: css`
        background-color: ${theme.colors.card};
        border: 1px solid ${theme.borders.light};
        border-radius: ${theme.borders.radius};
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
    `,
    default: css`
        padding: ${theme.spacing.l};
        gap: ${theme.spacing.m};
    `,
    compact: css`
        padding: ${theme.spacing.s};
        gap: ${theme.spacing.s};
    `,
    parchment: css`
        background-color: ${theme.colors.bg};
        border-color: ${theme.borders.main};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: ${theme.spacing.l};
        gap: ${theme.spacing.m};
    `,
    fullscreen: css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        border: none;
        border-radius: 0;
        padding: ${theme.spacing.xl};
        gap: ${theme.spacing.l};
        background-color: ${theme.colors.bg}; /* Force parchment in fullscreen */
        overflow-y: auto;
    `
};

export const NarrativeCard: FC<NarrativeCardProps> = ({
    variant = 'default', isFullscreen = false, className, children, onClick
}) => {
    return (
        <div
            className={cx(
                styles.card,
                isFullscreen ? styles.fullscreen : styles[variant],
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
