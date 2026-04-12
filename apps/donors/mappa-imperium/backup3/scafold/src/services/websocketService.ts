import type { Player, ConnectionStatus } from '../types';

type EventCallback = (data?: any) => void;

class WebSocketService {
    private static instance: WebSocketService;
    private listeners: { [key: string]: EventCallback[] } = {};
    private connectionStatus: ConnectionStatus = 'disconnected';
    private players: Player[] = [];

    private constructor() {}

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect(initialPlayers: Player[]) {
        if (this.connectionStatus === 'connected' || this.connectionStatus === 'connecting') return;

        this.players = [...initialPlayers];
        this.setStatus('connecting');
        setTimeout(() => {
            this.setStatus('connected');
        }, 1000); // Simulate connection delay
    }

    disconnect() {
        this.setStatus('disconnected');
        this.listeners = {};
        this.players = [];
    }

    private setStatus(status: ConnectionStatus) {
        this.connectionStatus = status;
        this.broadcast('connection:status', this.connectionStatus);
    }

    on(eventName: string, callback: EventCallback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }
    
    off(eventName: string, callback: EventCallback) {
        if (this.listeners[eventName]) {
             this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
        }
    }

    emit(eventName: string, data: any) {
        // This is where client-to-server logic would be.
        // For simulation, we handle it directly.
        switch (eventName) {
            case 'player:toggleStatus':
                this.handlePlayerToggleStatus(data.playerNumber);
                break;
            default:
                console.warn(`Unhandled event: ${eventName}`);
        }
    }

    private broadcast(eventName: string, data: any) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => callback(data));
        }
    }

    private handlePlayerToggleStatus(playerNumber: number) {
        if (this.connectionStatus !== 'connected') return;

        this.players = this.players.map(p =>
            p.playerNumber === playerNumber ? { ...p, isOnline: !p.isOnline } : p
        );

        // Simulate server broadcasting the update back to all clients
        this.broadcast('player:list:updated', this.players);
    }
}

export const websocketService = WebSocketService.getInstance();
