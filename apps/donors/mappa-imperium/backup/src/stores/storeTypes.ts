import { StateCreator } from 'zustand';
import type { GameState, GameSettings, Player, GameRole, ElementCard, View, AppSettings, EraUIState } from '@/types';

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
}

export interface GameplaySlice {
    currentEraId: number;
    viewedEraId: number;
    view: View;
    elements: ElementCard[];
    playerUiStates: Record<number, EraUIState>;
    eraDrafts: Record<number, { [eraId: number]: any }>;
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
}

export interface UiSlice {
    isSettingsModalOpen: boolean;
    isDebuggerOpen: boolean;
    isTransitioning: boolean;
    isGameReady: boolean;
    toggleSettingsModal: () => void;
    toggleDebugger: () => void;
    setGameReady: (ready: boolean) => void;
    resetTransition: () => void;
}

export interface DebugSlice {
    isDebugMode: boolean;
    isEraNavigationUnlocked: boolean;
    debugSetup: () => void;
    toggleEraNavigationLock: () => void;
    prepopulateEra: (eraId: number, playerNumber: number) => void;
    exportGameData: () => void;
    importGameData: (file: File) => void;
    clearAllData: () => void;
}

export type GameStore = SessionSlice & GameplaySlice & UiSlice & DebugSlice;

export type GameSliceCreator<T> = StateCreator<GameStore, [], [], T>;