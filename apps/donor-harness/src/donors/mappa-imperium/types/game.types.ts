import { WorldSettings } from './map.types';
import { Player } from './player.types';

export interface Era {
    id: number;
    name: string;
    icon: string;
}

export type EraStatus = 'completed' | 'current' | 'locked' | 'available';
export type View = 'eras' | 'elements' | 'map';
export type GameState = 'setup' | 'world_setup' | 'player_selection' | 'playing' | 'loading_feed' | 'lobby' | 'ai_configuration' | 'finished' | 'host_setup' | 'join_setup' | 'lobby_room' | 'element_editor';
export type GameRole = 'player' | 'observer';

export interface GameSettings {
    players: number;
    aiPlayers: number;
    length: 'Short' | 'Standard' | 'Long' | 'Epic';
    turnDuration: number;
    worldSettings?: WorldSettings;
}

export interface EraUIState {
    eraOne: { gameplayStep: 'geography' | 'map-creation' | 'resources' | 'sites' };
    eraTwo: { gameplayStep: 'setup' | 'pantheon' | 'sites' };
    eraThree: { gameplayStep: 'faction' | 'neighbor' | 'settlement' | 'complete' };
    eraFour: { gameplayStep: 'exploration' | 'colonization' | 'prosperity' };
    eraFive: { gameplayStep: 'expansion' | 'neighbors' };
    eraSix: { gameplayStep: 'events' | 'landmarks' | 'omen' };
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
    type: 'system' | 'player' | 'action' | 'note';
}

export interface GameRoom {
    id: string;
    hostId: string;
    name: string; // or just use ID as code
    players: Player[];
    maxPlayers: number;
    mapSettings: {
        size: 'Small' | 'Standard' | 'Large'; // specific to lobby display
        privacy: 'public' | 'private';
    };
    status: 'waiting' | 'playing';
}

export interface LobbyState {
    rooms: GameRoom[];
    currentRoom: GameRoom | null;
    chatMessages: ChatMessage[];
    isReady: boolean;
}

export interface SharedMarker {
    id: string;
    position: { q: number; r: number };
    label: string;
    description?: string;
    creatorId: string;
    color: string;
}

export interface SharedNote {
    id: string;
    title: string;
    content: string;
    creatorId: string;
    timestamp: number;
}
