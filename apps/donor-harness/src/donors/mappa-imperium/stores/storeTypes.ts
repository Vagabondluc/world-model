import { StateCreator } from 'zustand';
import type { GameState, GameSettings, Player, GameRole, ElementCard, View, AppSettings, EraUIState, ChatMessage, SharedMarker, SharedNote } from '@mi/types';
import { GraphError, NodeDefinition, ConnectionDefinition, NodeId, ConnectionId, NodeEditorSchema, SavedEraGraph } from '@mi/types/nodeEditor.types';

export interface ElementEditorSlice {
    // Graph State
    nodes: NodeDefinition[];
    connections: ConnectionDefinition[];
    selectedNodeId: NodeId | null;
    selectedConnectionId: ConnectionId | null;
    validationErrors: GraphError[];

    // Era State
    nodeEditorEraId: number | null;
    savedEras: SavedEraGraph[];

    // Actions
    addNode: (node: NodeDefinition) => void;
    updateNode: (nodeId: NodeId, updates: Partial<NodeDefinition>) => void;
    deleteNode: (nodeId: NodeId) => void;
    addConnection: (connection: ConnectionDefinition) => void;
    deleteConnection: (connectionId: ConnectionId) => void;
    selectNode: (nodeId: NodeId | null) => void;
    selectConnection: (connectionId: ConnectionId | null) => void;
    clearGraph: () => void;
    importSchema: (schema: NodeEditorSchema) => void;
    exportSchema: () => string;
    setValidationErrors: (errors: GraphError[]) => void;

    // Era Actions
    setCurrentEra: (eraId: number) => void;
    saveCurrentEra: (name: string) => Promise<void>;
    loadSavedEra: (savedId: string) => Promise<void>;
    deleteSavedEra: (savedId: string) => Promise<void>;
    refreshSavedEras: () => Promise<void>;
    loadReferenceTemplate: () => void;
    exportProject: () => Promise<void>;
    importProject: (file: File) => Promise<void>;
    loadSampleProject: () => Promise<void>;
}

export interface SessionSlice {
    gameState: GameState;
    gameSettings: GameSettings | null;
    players: Player[];
    currentPlayer: Player | null;
    gameRole: GameRole;
    appSettings: AppSettings;
    startGame: (settings: GameSettings) => void;
    configureAiPlayers: (aiPlayers: Player[]) => void;
    selectPlayer: (playerNumber: number, playerName: string, password?: string) => void;
    joinAsObserver: () => void;
    importFromFile: (file: File) => void;
    importFromFeed: (url: string) => void;
    browseLobby: () => void;
    backToSetup: () => void;
    logOff: () => void;
    saveSettings: (settings: AppSettings) => void;
    // Lobby Actions
    enterHostSetup: () => void;
    enterJoinSetup: () => void;
    createRoom: (roomName: string, settings: any) => void;
    joinRoom: (roomId: string) => void;
    leaveRoom: () => void;
    lobbyState: {
        roomId: string | null;
        isHost: boolean;
        players: Player[];
        isReady: boolean;
        chat: ChatMessage[];
        cursors: Record<string, { q: number; r: number; color: string; }>; // userId -> pos
        markers: SharedMarker[];
        notes: SharedNote[];
    };
    sendChatMessage: (content: string, type?: 'player' | 'action' | 'note') => void;
    updateCursor: (q: number, r: number) => void;
    addMarker: (marker: Omit<SharedMarker, 'id' | 'creatorId'>) => void;
    deleteMarker: (markerId: string) => void;
    addNote: (note: Omit<SharedNote, 'id' | 'creatorId' | 'timestamp'>) => void;
    deleteNote: (noteId: string) => void;
}

export interface GameplaySlice {
    currentEraId: number;
    viewedEraId: number;
    view: View;
    elements: ElementCard[];
    playerUiStates: Record<number, EraUIState>;
    eraDrafts: Record<number, { [eraId: number]: any }>;
    mapData: {
        hexBiomes: Record<string, string>;
        regions: any[];
        locations: any[];
    } | null;
    layerState: {
        surface: boolean;
        underdark: boolean;
        fogOfWar: boolean;
    };
    selectEra: (eraId: number) => void;
    advanceEra: () => void;
    changeView: (view: View) => void;
    switchPlayer: (playerNumber: number) => void;
    createElement: (elementData: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    updateElement: (updatedElement: ElementCard) => void;
    updatePlayer: (updatedPlayer: Player) => void;
    deleteElement: (elementId: string) => void;
    updateEraUiState: (newState: Partial<EraUIState>) => void;
    updateDraft: (eraId: number, draftData: any) => void;
    clearDraft: (eraId: number) => void;
    getCompletedEras: () => number[];
    exportChronicleFeed: () => void;
    exportElementHtml: (element: ElementCard) => void;
    exportElementMarkdown: (element: ElementCard) => void;
    setMapData: (mapData: any) => void;
    toggleLayer: (layer: 'surface' | 'underdark' | 'fogOfWar') => void;
}

export interface UiSlice {
    isSettingsModalOpen: boolean;
    isDebuggerOpen: boolean;
    isTransitioning: boolean;
    isGameReady: boolean;
    selectedElementId: string | null;
    toggleSettingsModal: () => void;
    toggleDebugger: () => void;
    setGameReady: (ready: boolean) => void;
    resetTransition: () => void;
    setSelectedElementId: (id: string | null) => void;
}

export interface DebugSlice {
    isDebugMode: boolean;
    isEraNavigationUnlocked: boolean;
    debugSetup: () => void;
    toggleEraNavigationLock: () => void;
    prepopulateEra: (eraId: number, playerNumber: number) => void;
    exportGameData: () => void;
    importGameData: (file: File) => void;
    loadScenario: (elements: ElementCard[]) => void;
    clearAllData: () => void;
}

export type GameStore = SessionSlice & GameplaySlice & UiSlice & DebugSlice & ElementEditorSlice;

export type GameSliceCreator<T> = StateCreator<GameStore, [], [], T>;