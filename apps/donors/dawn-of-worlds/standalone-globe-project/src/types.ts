
// Ported Game Definitions
export interface PlayerConfig {
    id: string;
    name: string;
    color: string;
    isHuman: boolean;
}

export interface GameSessionConfig {
    players: PlayerConfig[];
    initialAge: number;
}

export interface GameEvent {
    id: string;
    type: string;
    ts: number;
    playerId: string;
    payload: any;
    age?: number;
    round?: number;
    turn?: number;
}

export interface GameState {
    config?: GameSessionConfig;
    activePlayerId: string;
    players: PlayerConfig[]; // Flattened or derived
    age: number;
    round: number;
    turn: number;
    events: GameEvent[];
    world: any; // Dynamic world state (Cells, etc)
}

export type GameAction = {
    type: string;
    payload: any;
};
