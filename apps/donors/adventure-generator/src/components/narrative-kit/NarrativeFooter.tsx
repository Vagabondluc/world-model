import React, { FC, ReactNode } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../styles/theme';

interface NarrativeFooterProps {
    leftActions?: ReactNode;
    rightActions?: ReactNode;
    className?: string;
}

const styles = {
    footer: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: ${theme.spacing.m} ${theme.spacing.l};
        background-color: ${theme.colors.card};
        border-top: 1px solid ${theme.borders.light};
        margin-top: auto;
        gap: ${theme.spacing.m};
        
        @media (max-width: 600px) {
            flex-direction: column-reverse;
            gap: ${theme.spacing.s};
            align-items: stretch;
            
            & > div {
                justify-content: center;
            }
        }
    `,
    actionGroup: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing.s};
    `
};

export const NarrativeFooter: FC<NarrativeFooterProps> = ({ leftActions, rightActions, className }) => {
    return (
        <div className={css(styles.footer, className)}>
            <div className={styles.actionGroup}>
                {leftActions}
            </div>
            <div className={styles.actionGroup}>
                {rightActions}
            </div>
        </div>
    );
};
