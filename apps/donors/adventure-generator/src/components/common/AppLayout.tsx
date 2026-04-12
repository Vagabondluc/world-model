
import React, { FC, PropsWithChildren } from 'react';
import { Drawer } from './Drawer';
import { Sidebar } from './Sidebar';
import { SettingsManager } from '../settings/SettingsManager';
import { useCampaignStore } from '../../stores/campaignStore';

interface AppLayoutProps {
    onSaveSession: () => void;
    onLoadSession: () => void;
    onClearSession: () => void;
    onCreateBackup: () => void;
    onRestoreBackup: () => void;
}

export const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({ onSaveSession, onLoadSession, onClearSession, onCreateBackup, onRestoreBackup, children }) => {
    const activeDrawer = useCampaignStore(s => s.activeDrawer);
    const closeDrawer = useCampaignStore(s => s.closeDrawer);

    return (
        <>
            <div id="app-container">
                <Sidebar />
                <main className="app-main">
                    {children}
                </main>

                <Drawer isOpen={activeDrawer === 'settings'} onClose={closeDrawer} title="Session Management" width="560px">
                    <SettingsManager
                        onSaveSession={onSaveSession}
                        onLoadSession={onLoadSession}
                        onClearSession={onClearSession}
                        onCreateBackup={onCreateBackup}
                        onRestoreBackup={onRestoreBackup}
                    />
                </Drawer>
            </div>
        </>
    );
};
