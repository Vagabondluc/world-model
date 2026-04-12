import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import type { EraCreationState, Player } from '../types';
import { useAI } from './AIContext';

const defaultPlayerState: EraCreationState = {
    landmassType: '',
    featureCount: 8,
    features: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, type: '', landmassIndex: '' })),
    advice: '',
    isLoading: false,
    error: '',
    userInputAdvice: '',
};

type EraCreationPlayersState = Record<number, EraCreationState>;

interface EraCreationContextType extends EraCreationState {
    // FIX: Allow functional updates for setState to match React's useState pattern.
    setState: (state: Partial<EraCreationState> | ((prevState: EraCreationState) => Partial<EraCreationState>)) => void;
    handleFeatureChange: (id: number, field: 'type' | 'landmassIndex', value: string | number) => void;
    getAIAdvice: () => Promise<void>;
}

const EraCreationContext = createContext<EraCreationContextType | undefined>(undefined);

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

interface EraCreationProviderProps {
    children: React.ReactNode;
    currentPlayer: Player;
}

export const EraCreationProvider = ({ children, currentPlayer }: EraCreationProviderProps) => {
    const [playersState, setPlayersState] = useState<EraCreationPlayersState>({});
    const { result, isLoading, error, generate, clear } = useAI();
    
    const playerNumber = currentPlayer.playerNumber;

    useEffect(() => {
        if (!playersState[playerNumber]) {
            setPlayersState(prevState => ({
                ...prevState,
                [playerNumber]: defaultPlayerState,
            }));
        }
    }, [playerNumber, playersState]);

    const currentPlayerState = playersState[playerNumber] || defaultPlayerState;

    const setState = useCallback((newState: Partial<EraCreationState> | ((prevState: EraCreationState) => Partial<EraCreationState>)) => {
        setPlayersState(prevPlayersState => {
            const playerState = prevPlayersState[playerNumber] || defaultPlayerState;
            const updatedStatePart = typeof newState === 'function' ? newState(playerState) : newState;
            return {
                ...prevPlayersState,
                [playerNumber]: { ...playerState, ...updatedStatePart }
            };
        });
    }, [playerNumber]);
    
    useEffect(() => {
        setState({ isLoading });
    }, [isLoading, setState]);

    useEffect(() => {
        if (result || error) {
            setState({ advice: result, error: error });
        }
    }, [result, error, setState]);

    const handleFeatureChange = useCallback((id: number, field: 'type' | 'landmassIndex', value: string | number) => {
        setState(prevState => {
            const newFeatures = prevState.features.map(f => f.id === id ? { ...f, [field]: value } : f);
            return { features: newFeatures };
        });
    }, [setState]);

    const getAIAdvice = useCallback(async () => {
        const landmassOptions = getLandmassOptions(currentPlayerState.landmassType);
        
        if (!currentPlayerState.landmassType) {
            setState({ error: 'Please select your region\'s landmass structure first.' });
            return;
        }

        const placedFeatures = currentPlayerState.features
            .map(f => ({ type: f.type, landmass: f.landmassIndex !== '' ? landmassOptions[f.landmassIndex as number] : '' }))
            .filter(f => f.type && f.landmass);

        if (placedFeatures.length === 0) {
            setState({ error: 'Please select at least one geography type and assign it to a landmass.' });
            return;
        }
        
        const unassignedFeature = currentPlayerState.features.find(f => f.type && f.landmassIndex === '');
        if (unassignedFeature) {
             setState({ error: `Please assign the "${unassignedFeature.type}" feature to a landmass.` });
            return;
        }

        clear();

        const featureList = placedFeatures.map(f => `${f.type} on ${f.landmass}`).join(', ');
        
        let prompt = `I am creating a fantasy map for a tabletop game. My home region consists of: "${currentPlayerState.landmassType}".
I now need to place the following geographical features: ${featureList}.

Please provide holistic and realistic placement advice for this group of features.
Explain how they should interact with each other and their specific landmasses to create a believable and interesting world. Consider their impact on climate, resource distribution, strategic value, and where settlements might eventually form in relation to them. Use markdown for formatting.`;
        
        await generate(prompt, currentPlayerState.userInputAdvice || '');

    }, [currentPlayerState.landmassType, currentPlayerState.features, currentPlayerState.userInputAdvice, generate, clear, setState]);


    const contextValue = {
        ...currentPlayerState,
        setState,
        handleFeatureChange,
        getAIAdvice,
    };
    
    return (
        <EraCreationContext.Provider value={contextValue}>
            {children}
        </EraCreationContext.Provider>
    );
};

export const useEraCreation = () => {
    const context = useContext(EraCreationContext);
    if (context === undefined) {
        throw new Error('useEraCreation must be used within a EraCreationProvider');
    }
    return context;
};