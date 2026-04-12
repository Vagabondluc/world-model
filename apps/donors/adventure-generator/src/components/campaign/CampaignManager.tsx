
import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { useCampaignStore } from '../../stores/campaignStore';
import { CampaignConfigUpdater } from '../../types/campaign';
import { DatabaseManager } from '../database/DatabaseManager';
import { CampaignInfoTab } from './tabs/CampaignInfoTab';
import { GenerationSettingsTab } from './tabs/GenerationSettingsTab';
import { ThemeTab } from './tabs/ThemeTab';

interface CampaignManagerProps {
    onSave: () => void;
    onLoad: () => void;
}

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        height: 100%;
    `,
    tabs: css`
        display: flex;
        border-bottom: 2px solid var(--medium-brown);
        margin-bottom: var(--space-l);
        overflow-x: auto;
        flex-shrink: 0;
    `,
    tabButton: css`
        padding: var(--space-m);
        border: none;
        background: transparent;
        cursor: pointer;
        font-family: var(--header-font);
        font-size: 1rem;
        color: var(--medium-brown);
        border-bottom: 3px solid transparent;
        white-space: nowrap;
        transition: all 0.2s;

        &:hover {
            color: var(--dark-brown);
            background-color: rgba(0,0,0,0.05);
        }
    `,
    activeTab: css`
        color: var(--dark-brown) !important;
        border-bottom-color: var(--dnd-red) !important;
    `,
    content: css`
        flex-grow: 1;
        overflow-y: auto;
        animation: fadeIn 0.3s ease-in-out;
        padding-right: var(--space-s); /* Avoid scrollbar overlap content */

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `,
    controls: css`
        margin-top: var(--space-l);
        display: flex;
        gap: var(--space-m);
        padding-top: var(--space-m);
        border-top: 1px solid var(--border-light);
        flex-shrink: 0;
    `
};

export const CampaignManager: FC<CampaignManagerProps> = ({ onSave, onLoad }) => {
    const config = useCampaignStore(s => s.config);
    const updateConfig = useCampaignStore(s => s.updateConfig);
    const [activeTab, setActiveTab] = useState<'info' | 'settings' | 'theme' | 'databases'>('info');

    const onConfigChange: CampaignConfigUpdater = (field, value) => {
        updateConfig(field, value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'info' })} onClick={() => setActiveTab('info')}>Info</button>
                <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'settings' })} onClick={() => setActiveTab('settings')}>Generation</button>
                <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'databases' })} onClick={() => setActiveTab('databases')}>Databases</button>
                <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'theme' })} onClick={() => setActiveTab('theme')}>Theme</button>
            </div>

            <div className={styles.content}>
                {activeTab === 'info' && (
                    <CampaignInfoTab config={config} onConfigChange={onConfigChange} />
                )}

                {activeTab === 'settings' && (
                     <GenerationSettingsTab config={config} onConfigChange={onConfigChange} />
                )}
                
                {activeTab === 'databases' && (
                    <DatabaseManager />
                )}

                {activeTab === 'theme' && (
                     <ThemeTab config={config} onConfigChange={onConfigChange} />
                )}
            </div>

             <div className={styles.controls}>
                <button className="action-button" onClick={onSave} title="Export settings to a JSON file" style={{flex: 1}}>💾 Save Config</button>
                <button className="secondary-button" onClick={onLoad} title="Import settings from a JSON file" style={{flex: 1}}>📁 Load Config</button>
            </div>
        </div>
    );
};
