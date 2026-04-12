import { GameSliceCreator, SessionSlice } from '../../storeTypes';

export const createChatActions: GameSliceCreator<Partial<SessionSlice>> = (set, get) => ({
    sendChatMessage: (content, type = 'player') => {
        set(state => {
            const newMessage = {
                id: Date.now().toString(),
                senderId: 'local-user', // Mock ID
                senderName: state.currentPlayer?.name || 'Player 1',
                content,
                timestamp: Date.now(),
                type
            };
            return {
                lobbyState: {
                    ...state.lobbyState,
                    chat: [...state.lobbyState.chat, newMessage]
                }
            };
        });
    },
});
