import React from 'react';
import { Era, EraStatus, GameSettings } from './game.types';
import { Player } from './player.types';
import { ElementCard } from './element.types';
import { MapRenderPreferences, EraCreationState } from './map.types';

// Props for new modular edit forms
export interface ElementFormProps<T> {
    data: T;
    onDataChange: (newData: Partial<T>) => void;
    isReadOnly: boolean;
}

export interface EraButtonProps {
    era: Era;
    status: EraStatus;
    onClick?: (eraId: number) => void;
}

export interface GameSetupProps {
    onStart: (settings: GameSettings) => void;
    onDebug?: () => void;
    onImport: (file: File) => void;
    onImportFromFeed: (url: string) => void;
    onBrowseLobby: () => void;
}

export interface AiPlayerSetupProps {
    gameSettings: GameSettings;
    onComplete: (players: Player[]) => void;
    onBack: () => void;
}

export interface PlayerSelectionProps {
    players: Player[];
    onSelect: (playerNumber: number, playerName: string, password?: string) => void;
    onJoinAsObserver: () => void;
}

export interface ProfileProps {
    onBack: () => void;
}

export interface PlayerStatusProps {
    players: Player[];
    currentPlayer: Player | null;
    isDebugMode: boolean;
    onSwitchPlayer: (playerNumber: number) => void;
    onLogOff: () => void;
}

export type ColorBlindMode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';

export interface AppSettings {
    markdownFormat: 'regular' | 'homebrewery';
    mapRender?: MapRenderPreferences;
    colorBlindMode?: ColorBlindMode;
}

export interface AppLayoutProps {
    // These props are now removed as they will be provided by context.
}

export interface NavigationHeaderProps {
    // Props removed, will use context
}

export interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings: AppSettings;
    onSave: (settings: AppSettings) => void;
    gameSettings: GameSettings | null;
}

export interface DebugModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPrepopulateEra: (eraId: number, playerNumber: number) => void;
    players: Player[];
    currentPlayer: Player | null;
    isEraNavigationUnlocked: boolean;
    onToggleEraNavigationLock: () => void;
}

export interface EmojiPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (emoji: string) => void;
    triggerRef: React.RefObject<HTMLElement>;
}

export interface CompletionTrackerProps {
    // Props removed, will use context
}

export interface EraCreationContextType extends EraCreationState {
    setState: (state: Partial<EraCreationState> | ((prevState: EraCreationState) => Partial<EraCreationState>)) => void;
    handleFeatureChange: (id: number, field: 'type' | 'landmassIndex', value: string | number) => void;
    getAIAdvice: () => Promise<void>;
}

export interface EraDiscoveryContentProps {
    currentPlayer: Player | null;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    onUpdateElement: (element: ElementCard) => void;
    onDeleteElement: (elementId: string) => void;
    appSettings: AppSettings;
    onExportElementHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
    gameSettings: GameSettings | null;
}
