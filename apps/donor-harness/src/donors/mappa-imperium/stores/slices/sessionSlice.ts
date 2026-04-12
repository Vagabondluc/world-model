import type { GameSliceCreator, SessionSlice } from '../storeTypes';

import { createRoomActions } from './session/roomActions';
import { createChatActions } from './session/chatActions';
import { createMapActions } from './session/mapActions';
import { createGameActions } from './session/gameActions';
import { createImportActions } from './session/importActions';

export const createSessionSlice: GameSliceCreator<SessionSlice> = (set, get, api) => ({
    gameState: 'setup',
    gameSettings: null,
    players: [],
    currentPlayer: null,
    gameRole: 'player',
    appSettings: {
        markdownFormat: 'regular',
        mapRender: { mode: 'svg', theme: 'classic' }
    },
    lobbyState: {
        roomId: null,
        isHost: false,
        players: [],
        isReady: false,
        chat: [],
        cursors: {},
        markers: [],
        notes: []
    },

    ...createRoomActions(set, get, api),
    ...createChatActions(set, get, api),
    ...createMapActions(set, get, api),
    ...createGameActions(set, get, api),
    ...createImportActions(set, get, api),
}) as SessionSlice;