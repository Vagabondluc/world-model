import React, { FC, ReactNode } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../styles/theme';

interface NarrativeGridProps {
    left: ReactNode;
    right: ReactNode;
    leftLabel?: string;
    rightLabel?: string;
    className?: string;
}

const styles = {
    grid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${theme.spacing.l};
        width: 100%;
        
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: ${theme.spacing.m};
        }
    `,
    column: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.s};
    `,
    label: css`
        font-family: ${theme.fonts.header};
        font-weight: bold;
        font-size: 0.85rem;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
        border-bottom: 2px solid ${theme.borders.light};
        padding-bottom: 4px;
        margin-bottom: 4px;
    `
};

export const NarrativeGrid: FC<NarrativeGridProps> = ({ left, right, leftLabel, rightLabel, className }) => {
    return (
        <div className={css(styles.grid, className)}>
            <div className={styles.column}>
                {leftLabel && <div className={styles.label}>{leftLabel}</div>}
                {left}
            </div>
            <div className={styles.column}>
                {rightLabel && <div className={styles.label}>{rightLabel}</div>}
                {right}
            </div>
        </div>
    );
};
