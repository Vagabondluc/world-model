import { useCallback } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { useLocationStore } from '../stores/locationStore';
import { useCompendiumStore } from '../stores/compendiumStore';
import { useAdventureDataStore } from '../stores/adventureDataStore';
import { useGeneratorConfigStore } from '../stores/generatorConfigStore';
import { useHistoryStore } from '../stores/historyStore';
import { useHubFiltersStore } from '../stores/hubFiltersStore';
import { SessionManager } from '../services/sessionManager';
import { SessionStateV2 } from '../types/session';
import { PersistenceService } from '../services/persistenceService';
import { SessionStateV2Schema } from '../schemas/session';
import { migrateSession } from '../services/sessionMigration';
import {
    ADVENTURE_WORLD_MODEL_FILE,
    applyAdventureSessionState,
    hydrateAdventureSessionStateFromResponse,
    isAdventureWorldModelResponse,
    loadAdventureWorldModelSession,
    saveAdventureWorldModelBackup,
    saveAdventureWorldModelBundle,
} from '../services/adventureWorldModelPersistence';

export const useAppSession = () => {
    const showSystemMessage = useCampaignStore(s => s.showSystemMessage);

    const buildSessionState = useCallback((): SessionStateV2 => {
        const sessionState: SessionStateV2 = {
            version: 2,
            campaignState: useCampaignStore.getState().exportState(),
            locationState: useLocationStore.getState().exportState(),
            compendiumState: useCompendiumStore.getState().exportState(),
            generatorState: {
                ...useAdventureDataStore.getState().exportState(),
                ...useGeneratorConfigStore.getState().exportState(),
                ...useHistoryStore.getState().exportState(),
                ...useHubFiltersStore.getState().exportState(),
            }
        };
        return sessionState;
    }, []);

    const applySessionState = useCallback((sessionData: SessionStateV2) => {
        const validation = SessionStateV2Schema.safeParse(sessionData);
        if (!validation.success) {
            throw new Error(`Session schema validation failed: ${validation.error.message}`);
        }

        applyAdventureSessionState(validation.data as SessionStateV2);
    }, []);

    const handleSaveSession = useCallback(async () => {
        try {
            const rootPath = useCampaignStore.getState().rootPath;
            if (!rootPath) {
                throw new Error('No campaign folder selected.');
            }
            const sessionState = buildSessionState();
            await saveAdventureWorldModelBundle(rootPath, sessionState);
            showSystemMessage('success', `Canonical world-model bundle saved to ${ADVENTURE_WORLD_MODEL_FILE}`);
        } catch (e) {
            console.error(e);
            showSystemMessage('error', `Save failed: ${(e as Error).message}`);
        }
    }, [buildSessionState, showSystemMessage]);

    const handleLoadSession = useCallback(() => {
        const importLegacyOrCanonical = () => {
            SessionManager.loadSession(
                (sessionData) => {
                    try {
                        const fallback = buildSessionState();
                        if (isAdventureWorldModelResponse(sessionData)) {
                            const session = hydrateAdventureSessionStateFromResponse(sessionData, fallback);
                            applySessionState(session);
                            showSystemMessage('success', 'Canonical world-model session imported successfully!');
                            return;
                        }

                        const { session, warnings } = migrateSession(sessionData, fallback);
                        if (warnings.length > 0) {
                            console.warn('Session migration warnings:', warnings);
                        }
                        applySessionState(session);
                        showSystemMessage('success', 'Legacy session imported successfully!');
                    } catch (e) {
                        console.error(e);
                        showSystemMessage('error', `Import failed: ${(e as Error).message}`);
                    }
                },
                (errorMessage) => showSystemMessage('error', errorMessage)
            );
        };

        void (async () => {
            try {
                const rootPath = useCampaignStore.getState().rootPath;
                if (rootPath) {
                    const fallback = buildSessionState();
                    const canonicalSession = await loadAdventureWorldModelSession(rootPath, fallback);
                    if (canonicalSession) {
                        applySessionState(canonicalSession);
                        showSystemMessage('success', 'Canonical world-model session loaded successfully!');
                        return;
                    }
                }
                importLegacyOrCanonical();
            } catch (e) {
                console.error(e);
                showSystemMessage('error', `Load failed: ${(e as Error).message}`);
            }
        })();
    }, [applySessionState, buildSessionState, showSystemMessage]);

    const handleCreateBackup = useCallback(async () => {
        try {
            const rootPath = useCampaignStore.getState().rootPath;
            if (!rootPath) {
                throw new Error('No campaign folder selected.');
            }
            const sessionState = buildSessionState();
            const backupPath = await saveAdventureWorldModelBackup(rootPath, sessionState);
            showSystemMessage('success', `Canonical backup saved: ${backupPath}`);
        } catch (e) {
            console.error(e);
            showSystemMessage('error', `Backup failed: ${(e as Error).message}`);
        }
    }, [buildSessionState, showSystemMessage]);

    const handleRestoreBackup = useCallback(async () => {
        try {
            SessionManager.loadSession(
                (sessionData) => {
                    try {
                        const fallback = buildSessionState();
                        if (isAdventureWorldModelResponse(sessionData)) {
                            const session = hydrateAdventureSessionStateFromResponse(sessionData, fallback);
                            applySessionState(session);
                            showSystemMessage('success', 'Canonical backup restored successfully!');
                            return;
                        }

                        const { session, warnings } = migrateSession(sessionData, fallback);
                        if (warnings.length > 0) {
                            console.warn('Backup migration warnings:', warnings);
                        }
                        applySessionState(session);
                        showSystemMessage('success', 'Legacy backup restored successfully!');
                    } catch (e) {
                        console.error(e);
                        showSystemMessage('error', `Restore failed: ${(e as Error).message}`);
                    }
                },
                (errorMessage) => showSystemMessage('error', errorMessage)
            );
        } catch (e) {
            console.error(e);
            showSystemMessage('error', `Restore failed: ${(e as Error).message}`);
        }
    }, [applySessionState, buildSessionState, showSystemMessage]);

    const handleClearSession = useCallback(async () => {
        if (window.confirm("Are you sure you want to clear the entire session? This will delete all your campaign data from this browser and cannot be undone.")) {
            try {
                await PersistenceService.clearDatabase();
                showSystemMessage('success', 'Session cleared. Reloading...');
                setTimeout(() => window.location.reload(), 1500);
            } catch (e) {
                console.error("Failed to clear session:", e);
                showSystemMessage('error', 'Could not clear session data.');
            }
        }
    }, [showSystemMessage]);

    return { handleSaveSession, handleLoadSession, handleClearSession, handleCreateBackup, handleRestoreBackup };
};
