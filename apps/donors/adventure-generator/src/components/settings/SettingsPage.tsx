import React, { FC } from 'react';
import { SettingsLayout, SettingsTab } from './SettingsLayout';

// Tab Content Components (existing or new)
import { CampaignInfoTab } from '../campaign/tabs/CampaignInfoTab';
import { GenerationSettingsTab } from '../campaign/tabs/GenerationSettingsTab';
import { ThemeTab } from '../campaign/tabs/ThemeTab';
import { AISettingsManager } from '../ai/AISettingsManager';
import { DatabaseManager } from '../database/DatabaseManager';
import { RagControlPanel } from '../backend/RagControlPanel';
import { SessionSettingsTab } from './tabs/SessionSettingsTab';
import { SystemSettingsTab } from './tabs/SystemSettingsTab';
import { DataSourcesTab } from './tabs/DataSourcesTab';
import { AIProviderTab } from './tabs/AIProviderTab';

import { useCampaignStore } from '../../stores/campaignStore';
import { CampaignConfigUpdater } from '../../types/campaign';

interface SettingsPageProps {
    onSaveSession: () => void;
    onLoadSession: () => void;
    onClearSession: () => void;
    onCreateBackup: () => void;
    onRestoreBackup: () => void;
}

export const SettingsPage: FC<SettingsPageProps> = ({ onSaveSession, onLoadSession, onClearSession, onCreateBackup, onRestoreBackup }) => {
    const config = useCampaignStore(s => s.config);
    const updateConfig = useCampaignStore(s => s.updateConfig);

    const handleConfigChange: CampaignConfigUpdater = (field, value) => {
        updateConfig(field, value);
    };

    const renderTabContent = (activeTab: SettingsTab) => {
        switch (activeTab) {
            case 'campaign':
                return <CampaignInfoTab config={config} onConfigChange={handleConfigChange} />;
            case 'generation':
                return <GenerationSettingsTab config={config} onConfigChange={handleConfigChange} />;
            case 'theme':
                return <ThemeTab config={config} onConfigChange={handleConfigChange} />;
            case 'ai':
                return <AIProviderTab />;
            case 'data':
                return <DataSourcesTab />;
            case 'rag':
                return <RagControlPanel />;
            case 'session':
                return (
                    <SessionSettingsTab
                        onSaveSession={onSaveSession}
                        onLoadSession={onLoadSession}
                        onClearSession={onClearSession}
                        onCreateBackup={onCreateBackup}
                        onRestoreBackup={onRestoreBackup}
                    />
                );
            case 'system':
                return <SystemSettingsTab />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <SettingsLayout>
            {renderTabContent}
        </SettingsLayout>
    );
};
