import React, { FC } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../../styles/theme';
import { DatabaseManager } from '../../database/DatabaseManager';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.l};
    `,
    section: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.m};
    `,
    sectionTitle: css`
        font-family: ${theme.fonts.header};
        font-size: 1.1rem;
        font-weight: 600;
        color: ${theme.colors.accent};
        margin: 0;
        padding-bottom: ${theme.spacing.s};
        border-bottom: ${theme.borders.light};
        display: flex;
        align-items: center;
        gap: 10px;
    `,
    description: css`
        font-size: 0.9rem;
        color: ${theme.colors.textMuted};
        line-height: 1.5;
        margin: 0;
    `,
};

export const DataSourcesTab: FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📚 Official Database Sources</h3>
                <p className={styles.description}>
                    Select which official content databases are available for monster lookups, spell references, and encounter generation.
                </p>
                <DatabaseManager />
            </div>
        </div>
    );
};
