import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CampaignConfiguration } from '../../types/campaign';

const styles = {
    title: css`
        font-family: var(--header-font);
        font-size: 2rem;
        color: var(--parchment-bg);
        text-align: center;
        margin: 0 0 var(--space-m) 0;
        line-height: 1.1;
    `,
    worldInfo: css`
        text-align: center;
        padding-bottom: var(--space-l);
        border-bottom: 1px solid var(--medium-brown);
    `,
    worldName: css`
        display: block;
        font-family: var(--header-font);
        font-size: 1.4rem;
        color: var(--dnd-red);
        line-height: 1.2;
        overflow-wrap: break-word;
        margin-bottom: var(--space-xs);
    `,
    contextLabel: css`
        font-size: 0.8rem;
        color: var(--light-brown);
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: bold;
    `,
};

interface SidebarHeaderProps {
    config: CampaignConfiguration;
}

export const SidebarHeader: FC<SidebarHeaderProps> = ({ config }) => (
    <div>
        <h1 className={styles.title}>Adventure Generator</h1>
        <div className={styles.worldInfo}>
            <span className={styles.worldName}>{config.worldName || 'Unnamed Realm'}</span>
            <span className={styles.contextLabel}>Campaign Setting</span>
        </div>
    </div>
);
