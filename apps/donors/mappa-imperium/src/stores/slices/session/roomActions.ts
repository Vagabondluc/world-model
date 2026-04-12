import { GameSliceCreator, SessionSlice } from '../../storeTypes';

export const createRoomActions: GameSliceCreator<Partial<SessionSlice>> = (set, get) => ({
    enterHostSetup: () => set({ gameState: 'host_setup' }),
    enterJoinSetup: () => set({ gameState: 'join_setup' }),

    createRoom: (roomName, settings) => {
        // Mock room creation
        const hostPlayer = { playerNumber: 1, name: 'Host', isOnline: true, isAi: false };
        set({
            gameState: 'lobby_room',
            gameSettings: { ...settings, players: settings.players || 4, aiPlayers: 0, length: 'Standard', turnDuration: 10 },
            lobbyState: {
                roomId: Math.random().toString(36).substring(2, 8).toUpperCase(),
                isHost: true,
                players: [hostPlayer],
                isReady: false,
                chat: [{
                    id: 'sys-1',
                    senderId: 'system',
                    senderName: 'System',
                    content: 'Room created.',
                    timestamp: Date.now(),
                    type: 'system'
                }],
                cursors: {},
                markers: [],
                notes: []
            }
        });
    },

    joinRoom: (roomId) => {
        // Mock join
        const joinerPlayer = { playerNumber: 2, name: 'Player 2', isOnline: true, isAi: false };
        set({
            gameState: 'lobby_room',
            lobbyState: {
                roomId: roomId,
                isHost: false,
                players: [{ playerNumber: 1, name: 'Host', isOnline: true, isAi: false }, joinerPlayer],
                isReady: false,
                chat: [{
                    id: 'sys-2',
                    senderId: 'system',
                    senderName: 'System',
                    content: `Joined room ${roomId}`,
                    timestamp: Date.now(),
                    type: 'system'
                }],
                cursors: {},
                markers: [],
                notes: []
            }
        });
    },

    leaveRoom: () => set({
        gameState: 'setup',
        lobbyState: { roomId: null, isHost: false, players: [], isReady: false, chat: [], cursors: {}, markers: [], notes: [] }
    }),

    browseLobby: () => set({ gameState: 'lobby' }),
    backToSetup: () => set({ gameState: 'setup' }),

    saveSettings: (settings) => set({ appSettings: settings, isSettingsModalOpen: false }),
});
