import React, { createContext, useState, useEffect, useContext, useTransition } from 'react';
import type { GameSettings, View, GameState, Player, GameRole, ConnectionStatus, ElementCard, AppSettings, Faction, EraUIState } from '../types';
import { websocketService } from '../services/websocketService';
import { exportElementToHtml, exportElementToMarkdown, exportChronicleFeed } from '../services/exportService';
import { prepopulationData } from '../data/prepopulationData';

interface GameContextType {
    gameState: GameState;
    gameSettings: GameSettings | null;
    players: Player[];
    currentPlayer: Player | null;
    currentEraId: number;
    viewedEraId: number;
    view: View;
    gameRole: GameRole;
    connectionStatus: ConnectionStatus;
    isDebugMode: boolean;
    isEraNavigationUnlocked: boolean;
    elements: ElementCard[];
    appSettings: AppSettings;
    isSettingsModalOpen: boolean;
    isDebuggerOpen: boolean;
    eraUiState: EraUIState;
    isTransitioning: boolean;
    handleGameStart: (settings: GameSettings) => void;
    handlePlayerSelect: (playerNumber: number, playerName: string, password?: string) => void;
    handleJoinAsObserver: () => void;
    handleDebugSetup: () => void;
    handleEraSelect: (eraId: number) => void;
    handleAdvanceEra: () => void;
    handleViewChange: (newView: View) => void;
    handlePlayerSwitch: (playerNumber: number) => void;
    handleCreateElement: (newElementData: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    handleUpdateElement: (updatedElement: ElementCard) => void;
    handleUpdatePlayer: (updatedPlayer: Player) => void;
    handleDeleteElement: (elementId: string) => void;
    handleLogOff: () => void;
    handleExport: () => void;
    handleImport: (file: File) => void;
    handleClearAllData: () => void;
    handleImportFromFeed: (url: string) => void;
    handleBrowseLobby: () => void;
    handleBackToSetup: () => void;
    handleExportChronicleFeed: () => void;
    handleExportElementHtml: (element: ElementCard) => void;
    handleExportElementMarkdown: (element: ElementCard) => void;
    handleSaveSettings: (newSettings: AppSettings) => void;
    onToggleSettingsModal: () => void;
    onToggleDebugModal: () => void;
    handlePrepopulateEra: (eraId: number, playerNumber: number) => void;
    handleUpdateEraUiState: (newState: Partial<EraUIState>) => void;
    handleToggleEraNavigationLock: () => void;
    handleAiConfigurationComplete: (configuredAiPlayers: Player[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialEraUiState: EraUIState = {
    eraOne: { gameplayStep: 'geography' },
    eraTwo: { gameplayStep: 'setup' },
    eraThree: { gameplayStep: 'faction' },
    eraFour: { gameplayStep: 'exploration' },
    eraFive: { gameplayStep: 'expansion' },
    eraSix: { gameplayStep: 'events' },
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [gameState, setGameState] = useState<GameState>('setup');
    const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [currentEraId, setCurrentEraId] = useState<number>(0);
    const [viewedEraId, setViewedEraId] = useState<number>(0);
    const [view, setView] = useState<View>('eras');
    const [gameRole, setGameRole] = useState<GameRole>('player');
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
    const [isEraNavigationUnlocked, setIsEraNavigationUnlocked] = useState<boolean>(false);
    const [elements, setElements] = useState<ElementCard[]>([]);
    const [appSettings, setAppSettings] = useState<AppSettings>({ markdownFormat: 'regular' });
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isDebuggerOpen, setIsDebuggerOpen] = useState(false);
    const [eraUiState, setEraUiState] = useState<EraUIState>(initialEraUiState);
    const [isPending, startTransition] = useTransition();


    useEffect(() => {
        const handleConnectionStatus = (status: ConnectionStatus) => setConnectionStatus(status);
        const handlePlayerListUpdate = (updatedPlayers: Player[]) => setPlayers(updatedPlayers);

        websocketService.on('connection:status', handleConnectionStatus);
        websocketService.on('player:list:updated', handlePlayerListUpdate);

        return () => {
            websocketService.off('connection:status', handleConnectionStatus);
            websocketService.off('player:list:updated', handlePlayerListUpdate);
            websocketService.disconnect();
        };
    }, []);

    const handleGameStart = (settings: GameSettings) => {
        setGameSettings(settings);
        const initialPlayers = Array.from({ length: settings.players }, (_, i) => ({
            playerNumber: i + 1,
            name: `Player ${i + 1}`,
            isOnline: false,
            isAi: false,
        }));
        setPlayers(initialPlayers);
        setIsDebugMode(false);
        setIsEraNavigationUnlocked(false);
        setElements([]); // Reset elements for a new game
        setEraUiState(initialEraUiState);

        if (settings.aiPlayers > 0) {
            setGameState('ai_configuration');
        } else {
            setGameState('player_selection');
        }
    };

    const handleAiConfigurationComplete = (configuredAiPlayers: Player[]) => {
        setPlayers(prevHumanPlayers => [...prevHumanPlayers, ...configuredAiPlayers]);
        setGameState('player_selection');
    };

    const handlePlayerSelect = (playerNumber: number, playerName: string, password?: string) => {
        const targetPlayer = players.find(p => p.playerNumber === playerNumber);
        if (!targetPlayer) {
            console.error("Selected player not found");
            return;
        }

        if (targetPlayer.isAi) return; // AI players cannot be selected

        if (targetPlayer.password) {
            if (targetPlayer.password === password) {
                const updatedPlayers = players.map(p => p.playerNumber === playerNumber ? { ...p, isOnline: true } : p);
                const selectedPlayer = updatedPlayers.find(p => p.playerNumber === playerNumber) || null;
                setPlayers(updatedPlayers);
                setCurrentPlayer(selectedPlayer);
                setGameRole('player');
                setGameState('playing');
                setCurrentEraId(1);
                setViewedEraId(1);
                websocketService.connect(updatedPlayers);
            } else {
                alert('Incorrect password. Please try again.');
            }
        } else {
            if (!password || !playerName.trim()) {
                alert('Player name and password are required.');
                return;
            }
            const updatedPlayers = players.map(p => p.playerNumber === playerNumber ? { ...p, name: playerName, isOnline: true, password } : p);
            const selectedPlayer = updatedPlayers.find(p => p.playerNumber === playerNumber) || null;
            setPlayers(updatedPlayers);
            setCurrentPlayer(selectedPlayer);
            setGameRole('player');
            setGameState('playing');
            setCurrentEraId(1);
            setViewedEraId(1);
            websocketService.connect(updatedPlayers);
        }
    };

    const handleJoinAsObserver = () => {
        setGameRole('observer');
        setCurrentPlayer(null);
        setGameState('playing');
        setCurrentEraId(1);
        setViewedEraId(1);
        websocketService.connect(players);
    };

    const handleDebugSetup = () => {
        const debugPlayers: Player[] = [
            { playerNumber: 1, name: 'PeeHell', isOnline: true, password: 'qwerty', isAi: false },
            { playerNumber: 2, name: 'PrOfOuNd_IdIoT', isOnline: true, password: 'qwerty', isAi: false },
            { playerNumber: 3, name: 'MOFO', isOnline: true, password: 'qwerty', isAi: false },
            { playerNumber: 4, name: 'MyFaCeHuRt', isOnline: true, password: 'qwerty', isAi: false },
        ];
        const debugResourceUuid = 'd3b07384-29f6-425d-8531-97213d29a1a8';
        const debugEventUuid = '5a17e0b5-31c3-4f9e-a8c6-94863a3d2422';
        const debugElements: ElementCard[] = [
            { id: debugResourceUuid, type: 'Resource', name: 'Debug Resource: The Omni-Crystal', owner: 1, era: 1, isDebug: true, data: { id: debugResourceUuid, name: 'Debug Resource: The Omni-Crystal', type: 'magical', properties: 'A mysterious crystal used for debugging the world. It shimmers with the colors of broken code and emits a faint hum of console logs. Can be safely deleted.', symbol: '🐞' } },
            { id: debugEventUuid, type: 'Event', name: 'The Sundering of the Isles', owner: 2, era: 4, createdYear: 35, creationStep: '4.1 Exploration', isDebug: true, data: { id: debugEventUuid, name: 'The Sundering of the Isles', description: 'A great cataclysm that shattered the western continent, creating the archipelago seen today.' } }
        ];
        setGameSettings({ players: 4, aiPlayers: 0, length: 'Standard', turnDuration: 10 });
        setPlayers(debugPlayers);
        setCurrentPlayer(debugPlayers[0]);
        setGameRole('player');
        setCurrentEraId(0);
        setViewedEraId(0);
        setGameState('playing');
        setIsDebugMode(true);
        setIsEraNavigationUnlocked(true);
        setElements(debugElements);
        setEraUiState(initialEraUiState);
        websocketService.connect(debugPlayers);
    };
    
    const handleEraSelect = (eraId: number) => {
        if (eraId <= currentEraId || isEraNavigationUnlocked) {
            startTransition(() => {
                setViewedEraId(eraId);
            });
        }
    };

    const handleAdvanceEra = () => {
        if (currentEraId === 6) {
            setGameState('finished');
            return;
        }

        setCurrentEraId(prevId => {
            const newId = Math.min(prevId + 1, 6);
            setViewedEraId(newId);
            return newId;
        });
    };

    const handleViewChange = (newView: View) => {
        startTransition(() => {
            setView(newView);
        });
    };

    const handlePlayerSwitch = (playerNumber: number) => {
        if (!isDebugMode) return;
        const newPlayer = players.find(p => p.playerNumber === playerNumber);
        if (newPlayer) setCurrentPlayer(newPlayer);
    };

    const handleCreateElement = (newElementData: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => {
        const newElementId = crypto.randomUUID();
        const newElement: ElementCard = { ...newElementData, id: newElementId, ...(createdYear && { createdYear }), ...(creationStep && { creationStep }) };
        if (newElement.data) newElement.data.id = newElementId;
        setElements(prevElements => [...prevElements, newElement]);
    };

    const handleUpdateElement = (updatedElement: ElementCard) => {
        setElements(prevElements => prevElements.map(el => el.id === updatedElement.id ? updatedElement : el));
    };

    const handleUpdatePlayer = (updatedPlayer: Player) => {
        setPlayers(prevPlayers => prevPlayers.map(p => p.playerNumber === updatedPlayer.playerNumber ? updatedPlayer : p));
        if (currentPlayer && currentPlayer.playerNumber === updatedPlayer.playerNumber) {
            setCurrentPlayer(updatedPlayer);
        }
    };

    const handleDeleteElement = (elementId: string) => {
        setElements(prevElements => prevElements.filter(el => el.id !== elementId));
    };

    const handleLogOff = () => {
        setGameState('setup');
        setGameSettings(null);
        setPlayers([]);
        setCurrentPlayer(null);
        setCurrentEraId(0);
        setViewedEraId(0);
        setView('eras');
        setGameRole('player');
        setIsDebugMode(false);
        setIsEraNavigationUnlocked(false);
        setElements([]);
        setEraUiState(initialEraUiState);
        websocketService.disconnect();
    };

    const handleToggleEraNavigationLock = () => setIsEraNavigationUnlocked(prev => !prev);
    const onToggleDebugModal = () => setIsDebuggerOpen(p => !p);

    const handleExport = () => {
        const exportData = { gameSettings, players, elements, currentEraId, exportedByPlayerNumber: currentPlayer?.playerNumber || null };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = 'mappa-imperium-export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportChronicleFeed = () => {
        exportChronicleFeed(elements, players, gameSettings, currentPlayer);
    };

    const handleImport = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target?.result as string);
                if (importedData.gameSettings && importedData.players && importedData.elements && typeof importedData.currentEraId === 'number' && 'exportedByPlayerNumber' in importedData) {
                    setGameSettings(importedData.gameSettings);
                    const importedPlayers = importedData.players.map((p: Player) => ({ ...p, isOnline: false }));
                    setPlayers(importedPlayers);
                    setElements(importedData.elements);
                    setCurrentEraId(importedData.currentEraId);
                    setViewedEraId(importedData.currentEraId);
                    setIsDebugMode(false);
                    setCurrentPlayer(null);
                    setGameRole('player');
                    setView('eras');
                    setGameState('player_selection');
                    setEraUiState(initialEraUiState);
                } else {
                    alert('Invalid import file format.');
                }
            } catch (e) {
                alert('Error parsing import file.');
                console.error(e);
            }
        };
        reader.readAsText(file);
    };

    const handleClearAllData = () => {
        if (window.confirm('This will delete all elements and player progress for all players. Are you sure? This action cannot be undone.')) {
            setElements([]);
            setEraUiState(initialEraUiState);
            setPlayers(prev => prev.map(p => ({ ...p, deityCount: 0 })));
            setCurrentEraId(1);
            setViewedEraId(1);
        }
    };

    const handleImportFromFeed = async (url: string) => {
        setGameState('loading_feed');
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Validate the structure
            if (data.manifest && data.players && data.elements) {
                setGameSettings(data.manifest.gameSettings);
                setPlayers(data.players);
                setElements(data.elements);
                
                // Set to observer mode
                setGameRole('observer');
                setCurrentPlayer(null);
                setCurrentEraId(1); // Start at Era 1
                setViewedEraId(1);
                setView('eras');
                setGameState('playing');
                websocketService.connect(data.players);

            } else {
                 throw new Error("Invalid Chronicle Feed format.");
            }
        } catch (error) {
            console.error("Failed to load from Chronicle Feed:", error);
            alert(`Failed to load from Chronicle Feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setGameState('setup');
        }
    };
    
    const handleBrowseLobby = () => {
        setGameState('lobby');
    };

    const handleBackToSetup = () => {
        setGameState('setup');
    };

    const handleExportElementHtml = (element: ElementCard) => exportElementToHtml(element, players);
    const handleExportElementMarkdown = (element: ElementCard) => exportElementToMarkdown(element, players, appSettings.markdownFormat);
    const handleSaveSettings = (newSettings: AppSettings) => {
        setAppSettings(newSettings);
        setIsSettingsModalOpen(false);
    };

    const handlePrepopulateEra = (eraId: number, playerNumber: number) => {
        const playersToPrepopulate = playerNumber === 0 ? players : players.filter(p => p.playerNumber === playerNumber);
        
        setElements(currentElements => {
            let elementsToUpdate = [...currentElements];
    
            playersToPrepopulate.forEach(targetPlayer => {
                if (!prepopulationData[targetPlayer.playerNumber]?.[eraId]) return;
                const eraData = prepopulationData[targetPlayer.playerNumber][eraId];
    
                // 1. Add new elements
                if (eraData.elements) {
                    const playerNewElements = eraData.elements
                        .filter(newEl => !currentElements.some(existingEl => existingEl.name === newEl.name && existingEl.type === newEl.type && existingEl.owner === targetPlayer.playerNumber))
                        .map(el => {
                            const newId = crypto.randomUUID();
                            const newData = { ...el.data, id: el.data.id || `data-${crypto.randomUUID()}` };
                            return { ...el, id: newId, data: newData, owner: targetPlayer.playerNumber, isDebug: true } as ElementCard;
                        });
                    elementsToUpdate.push(...playerNewElements);
                }
    
                // 2. Update existing elements
                if (eraData.elementUpdates) {
                    eraData.elementUpdates.forEach(updateInstruction => {
                        if (updateInstruction.find.owner !== targetPlayer.playerNumber) return;
    
                        elementsToUpdate = elementsToUpdate.map(el => {
                            let match = el.owner === updateInstruction.find.owner && el.type === updateInstruction.find.type;
                            if (match && updateInstruction.find.data) {
                                for (const key in updateInstruction.find.data) {
                                    if ((el.data as any)[key] !== updateInstruction.find.data[key]) {
                                        match = false;
                                        break;
                                    }
                                }
                            }
    
                            if (match) {
                                return {
                                    ...el,
                                    data: { ...el.data, ...updateInstruction.updates }
                                };
                            }
                            return el;
                        });
                    });
                }
            });
            return elementsToUpdate;
        });
    
        setPlayers(currentPlayers => {
            const updatedPlayersMap = new Map<number, Player>();
            currentPlayers.forEach(p => updatedPlayersMap.set(p.playerNumber, { ...p }));
    
            playersToPrepopulate.forEach(targetPlayer => {
                const eraData = prepopulationData[targetPlayer.playerNumber]?.[eraId];
                if (eraData?.playerUpdates) {
                    const currentPlayerState = updatedPlayersMap.get(targetPlayer.playerNumber);
                    const updatedPlayer = { ...currentPlayerState, ...eraData.playerUpdates } as Player;
                    updatedPlayersMap.set(targetPlayer.playerNumber, updatedPlayer);
                }
            });
    
            const finalUpdatedPlayers = Array.from(updatedPlayersMap.values());
            if (JSON.stringify(currentPlayers) !== JSON.stringify(finalUpdatedPlayers)) {
                if (currentPlayer) {
                    const updatedCurrentPlayer = finalUpdatedPlayers.find(p => p.playerNumber === currentPlayer.playerNumber);
                    if (updatedCurrentPlayer) setCurrentPlayer(updatedCurrentPlayer);
                }
                return finalUpdatedPlayers;
            }
            return currentPlayers;
        });
    };

    const handleUpdateEraUiState = (newState: Partial<EraUIState>) => {
        setEraUiState(prevState => ({
            ...prevState,
            ...newState,
        }));
    };

    const value: GameContextType = {
        gameState, gameSettings, players, currentPlayer, currentEraId, viewedEraId, view, gameRole, connectionStatus, isDebugMode, isEraNavigationUnlocked, elements, appSettings, isSettingsModalOpen, isDebuggerOpen, eraUiState, isTransitioning: isPending,
        handleGameStart, handlePlayerSelect, handleJoinAsObserver, handleDebugSetup, handleEraSelect, handleAdvanceEra, handleViewChange, handlePlayerSwitch, handleCreateElement, handleUpdateElement, handleUpdatePlayer, handleDeleteElement, handleLogOff, handleExport, handleImport, handleClearAllData, handleImportFromFeed, handleBrowseLobby, handleBackToSetup, handleExportChronicleFeed, handleExportElementHtml, handleExportElementMarkdown, handleSaveSettings, onToggleSettingsModal: () => setIsSettingsModalOpen(p => !p), onToggleDebugModal, handlePrepopulateEra, handleUpdateEraUiState, handleToggleEraNavigationLock, handleAiConfigurationComplete,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
