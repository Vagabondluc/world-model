
import { useCallback } from 'react';
import { OriginContext } from '../schemas/common';
import { useHistoryStore } from '../stores/historyStore';
import { useAdventureDataStore } from '../stores/adventureDataStore';
import { useWorkflowStore } from '../stores/workflowStore';
import { useCampaignStore } from '../stores/campaignStore';
import { useGeneratorConfigStore } from '../stores/generatorConfigStore';

export const useContextualNavigation = () => {
    const { getHistoryStateById } = useHistoryStore();
    const { setActiveView } = useCampaignStore();

    const returnToSource = useCallback((origin?: OriginContext) => {
        if (!origin || origin.type !== 'generator' || !origin.historyStateId) {
            return;
        }

        const historyEntry = getHistoryStateById(origin.historyStateId);
        if (!historyEntry) {
            console.warn("History state not found for ID:", origin.historyStateId);
            return;
        }

        // Restore based on type
        if (historyEntry.type === 'hooks') {
            useAdventureDataStore.setState({ 
                adventures: historyEntry.data.adventures, 
                matrix: historyEntry.data.matrix,
                // Don't clear current IDs if we are just looking back
            });
            useGeneratorConfigStore.getState().setContext(''); // Optional: Restore context if saved in history?
            useWorkflowStore.setState({ step: 'hooks' });
        } else if (historyEntry.type === 'outline') {
            const ids = [
                ...historyEntry.data.scenes.map((s: any) => s.id),
                ...historyEntry.data.locations.map((l: any) => l.id),
                ...historyEntry.data.npcs.map((n: any) => n.id),
                ...historyEntry.data.factions.map((f: any) => f.id)
            ];
            useAdventureDataStore.setState({ 
                currentAdventureCompendiumIds: ids, 
                selectedHook: historyEntry.data.selectedHook || null 
            });
             useWorkflowStore.setState({ step: 'outline' });
        }

        // Navigate
        setActiveView('adventure');

    }, [getHistoryStateById, setActiveView]);

    return { returnToSource };
};
