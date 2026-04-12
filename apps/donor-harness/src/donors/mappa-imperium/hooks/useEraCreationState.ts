
import { useCallback, useEffect, useMemo } from 'react';
import type { EraCreationState } from '@mi/types';
import { useAIGeneration } from './useAIGeneration';
import { useGameStore } from '../stores/gameStore';

const defaultState: EraCreationState = {
    landmassType: '',
    featureCount: 8,
    features: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, type: '', landmassIndex: '' })),
    advice: '',
    isLoading: false,
    error: '',
    userInputAdvice: '',
};

export const useEraCreationState = () => {
    const { currentPlayer, eraDrafts, updateDraft } = useGameStore();
    const { generate, result, isLoading: aiLoading, error: aiError, clear: clearAI } = useAIGeneration();
    
    const playerId = currentPlayer?.playerNumber;

    // Selector: Merge stored draft with default state to ensure shape consistency
    const state = useMemo(() => {
        if (!playerId) return defaultState;
        const storedDraft = eraDrafts[playerId]?.[1];
        return { ...defaultState, ...(storedDraft || {}) } as EraCreationState;
    }, [eraDrafts, playerId]);

    // Setter: Updates the global store
    const setState = useCallback((newState: Partial<EraCreationState> | ((prevState: EraCreationState) => Partial<EraCreationState>)) => {
        if (!playerId) return;
        
        // Resolve function updates by accessing the current state from the hook's memoized value
        // Note: In a high-frequency scenario we might want to read from store directly, 
        // but for this form, relying on the memoized 'state' is sufficient.
        const updates = typeof newState === 'function' ? newState(state) : newState;
        
        updateDraft(1, updates);
    }, [playerId, updateDraft, state]);

    const handleFeatureChange = useCallback((id: number, field: 'type' | 'landmassIndex', value: string | number) => {
        if (!playerId) return;
        
        const newFeatures = state.features.map(f => f.id === id ? { ...f, [field]: value } : f);
        updateDraft(1, { features: newFeatures });
    }, [playerId, updateDraft, state.features]);

    const getLandmassOptions = (landmassType: string): string[] => {
        if (!landmassType) return [];
        switch (landmassType) {
            case '1 Large Continent': return ['Large Continent'];
            case '1 Large + 1 Small isle': return ['Large Continent', 'Small Isle 1'];
            case '1 Large + 2 Small isles': return ['Large Continent', 'Small Isle 1', 'Small Isle 2'];
            case '2 Medium islands': return ['Medium Island 1', 'Medium Island 2'];
            case '3 Medium islands': return ['Medium Island 1', 'Medium Island 2', 'Medium Island 3'];
            case 'Archipelago with at least 4 islands': return ['Archipelago Isle 1', 'Archipelago Isle 2', 'Archipelago Isle 3', 'Archipelago Isle 4'];
            default: return [];
        }
    };

    const getAIAdvice = useCallback(async () => {
        const landmassOptions = getLandmassOptions(state.landmassType);
        
        if (!state.landmassType) {
            setState({ error: 'Please select your region\'s landmass structure first.' });
            return;
        }

        const placedFeatures = state.features
            .map(f => ({ type: f.type, landmass: f.landmassIndex !== '' ? landmassOptions[f.landmassIndex as number] : '' }))
            .filter(f => f.type && f.landmass);

        if (placedFeatures.length === 0) {
            setState({ error: 'Please select at least one geography type and assign it to a landmass.' });
            return;
        }
        
        const unassignedFeature = state.features.find(f => f.type && f.landmassIndex === '');
        if (unassignedFeature) {
             setState({ error: `Please assign the "${unassignedFeature.type}" feature to a landmass.` });
            return;
        }

        clearAI();

        const featureList = placedFeatures.map(f => `${f.type} on ${f.landmass}`).join(', ');
        
        const prompt = `I am creating a fantasy map for a tabletop game. My home region consists of: "${state.landmassType}".
I now need to place the following geographical features: ${featureList}.

Please provide holistic and realistic placement advice for this group of features.
Explain how they should interact with each other and their specific landmasses to create a believable and interesting world. Consider their impact on climate, resource distribution, strategic value, and where settlements might eventually form in relation to them. Use markdown for formatting.`;
        
        await generate(prompt, state.userInputAdvice || '');
        
    }, [state.landmassType, state.features, state.userInputAdvice, generate, clearAI, setState]);

    // Sync AI result to store
    useEffect(() => {
        const updates: Partial<EraCreationState> = {};
        let hasUpdates = false;

        if (result && result !== state.advice) {
            updates.advice = result;
            updates.error = ''; // Clear error on success
            hasUpdates = true;
        }
        if (aiError && aiError !== state.error) {
            updates.error = aiError;
            hasUpdates = true;
        }
        if (aiLoading !== state.isLoading) {
            updates.isLoading = aiLoading;
            hasUpdates = true;
        }

        if (hasUpdates) {
            setState(updates);
        }
    }, [result, aiError, aiLoading, state.advice, state.error, state.isLoading, setState]);

    return {
        ...state,
        setState,
        handleFeatureChange,
        getAIAdvice,
    };
};
