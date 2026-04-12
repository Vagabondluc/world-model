/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { css, keyframes } from '@emotion/css';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { PersistenceService } from '../services/persistenceService';
import { GenerationErrorBoundary } from './common/GenerationErrorBoundary';
import { AppLayout } from './common/AppLayout';
import { AppProvider } from '../context/AppContext';
import { SystemMessage } from './common/SystemMessage';
import { useCampaignStore } from '../stores/campaignStore';
import { useAppSession } from '../hooks/useAppSession';
import { useTheme } from '../hooks/useTheme';
import { Launcher } from './launcher/Launcher';

const AdventureGenerator = lazy(() => import('./adventure/AdventureGenerator').then(m => ({ default: m.AdventureGenerator })));

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const loaderStyle = css`
  border: 5px solid var(--light-brown);
  border-top: 5px solid var(--dark-brown);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  margin: var(--space-xl) auto;
`;

const hydrationContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  gap: 1.5rem;
  background-color: var(--parchment-bg);
  color: var(--dark-brown);
  font-family: var(--header-font);
  text-align: center;
  padding: 2rem;
`;

export const AppContent = () => {
    const apiService = useMemo(() => new ImprovedAdventureAPIService(), []);
    const [hydrationStatus, setHydrationStatus] = useState('Initializing...');
    const [isHydrating, setIsHydrating] = useState(true);

    useTheme();

    const rootPath = useCampaignStore(s => s.rootPath);
    const campaignConfig = useCampaignStore(s => s.config);
    const systemMessage = useCampaignStore(s => s.systemMessage);
    const clearSystemMessage = useCampaignStore(s => s.clearSystemMessage);
    const { handleSaveSession, handleLoadSession, handleClearSession, handleCreateBackup, handleRestoreBackup } = useAppSession();

    useEffect(() => {
        if (!rootPath) return;

        const init = async () => {
            try {
                setHydrationStatus('Accessing Local Archive...');
                await PersistenceService.hydrate();
                setHydrationStatus('Finalizing World State...');
                PersistenceService.enableAutoSave();
                setIsHydrating(false);
            } catch (err) {
                console.error('Hydration failed:', err);
                setHydrationStatus('A critical error occurred while loading your world.');
            }
        };

        init();
    }, [rootPath]);

    useEffect(() => {
        document.body.setAttribute('data-theme', campaignConfig.theme || 'parchment');
    }, [campaignConfig.theme]);

    const appContextValue = useMemo(() => ({ apiService }), [apiService]);

    if (!rootPath) {
        return <Launcher onLaunch={() => { }} />;
    }

    if (isHydrating) {
        return (
            <div className={hydrationContainer}>
                <div className={loaderStyle}></div>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Adventure Generator MVP</h2>
                <p style={{ fontFamily: 'var(--body-font)', fontStyle: 'italic', fontSize: '1.2rem' }}>{hydrationStatus}</p>
            </div>
        );
    }

    const renderSuspenseFallback = () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className={loaderStyle} />
        </div>
    );

    return (
        <AppProvider value={appContextValue}>
            <>
                <SystemMessage message={systemMessage} onDismiss={clearSystemMessage} />
                <AppLayout
                    onSaveSession={handleSaveSession}
                    onLoadSession={handleLoadSession}
                    onClearSession={handleClearSession}
                    onCreateBackup={handleCreateBackup}
                    onRestoreBackup={handleRestoreBackup}
                >
                    <Suspense fallback={renderSuspenseFallback()}>
                        <GenerationErrorBoundary>
                            <AdventureGenerator />
                        </GenerationErrorBoundary>
                    </Suspense>
                </AppLayout>
            </>
        </AppProvider>
    );
};
