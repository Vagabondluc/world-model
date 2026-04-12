import { GameSliceCreator, SessionSlice } from '../../storeTypes';

export const createMapActions: GameSliceCreator<Partial<SessionSlice>> = (set, get) => ({
    updateCursor: (q, r) => {
        set(state => ({
            lobbyState: {
                ...state.lobbyState,
                cursors: {
                    ...state.lobbyState.cursors,
                    'local-user': { q, r, color: '#f59e0b' } // Mock color amber-500
                }
            }
        }));
    },

    addMarker: (marker) => {
        set(state => {
            const newMarker = {
                ...marker,
                id: Date.now().toString(),
                creatorId: 'local-user'
            };
            return {
                lobbyState: {
                    ...state.lobbyState,
                    markers: [...state.lobbyState.markers, newMarker],
                    chat: [...state.lobbyState.chat, {
                        id: Date.now().toString(),
                        senderId: 'system',
                        senderName: 'System',
                        content: `Marker added: ${marker.label}`,
                        timestamp: Date.now(),
                        type: 'action'
                    }]
                }
            };
        });
    },

    deleteMarker: (markerId) => {
        set(state => ({
            lobbyState: {
                ...state.lobbyState,
                markers: state.lobbyState.markers.filter(m => m.id !== markerId)
            }
        }));
    },

    addNote: (note) => {
        set(state => {
            const newNote = {
                ...note,
                id: Date.now().toString(),
                creatorId: 'local-user',
                timestamp: Date.now()
            };
            return {
                lobbyState: {
                    ...state.lobbyState,
                    notes: [...state.lobbyState.notes, newNote],
                    chat: [...state.lobbyState.chat, {
                        id: Date.now().toString(),
                        senderId: 'system',
                        senderName: 'System',
                        content: `Note added: ${note.title}`,
                        timestamp: Date.now(),
                        type: 'action'
                    }]
                }
            };
        });
    },

    deleteNote: (noteId) => {
        set(state => ({
            lobbyState: {
                ...state.lobbyState,
                notes: state.lobbyState.notes.filter(n => n.id !== noteId)
            }
        }));
    },
});
