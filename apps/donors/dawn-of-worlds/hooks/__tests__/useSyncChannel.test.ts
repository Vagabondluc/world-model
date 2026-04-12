import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useSyncChannel } from '../useSyncChannel';
import { useGameStore } from '../../store/gameStore';
import { useChatStore } from '../../store/chatStore';
import * as audio from '../../logic/audio';

// --- Mocks ---

// Mock Game Store
vi.mock('../../store/gameStore', () => ({
    useGameStore: Object.assign(vi.fn(), {
        getState: vi.fn(),
        subscribe: vi.fn(),
    }),
}));

// Mock Chat Store
vi.mock('../../store/chatStore', () => ({
    useChatStore: Object.assign(vi.fn(), {
        getState: vi.fn(),
        subscribe: vi.fn(),
    }),
}));

// Mock Audio
vi.mock('../../logic/audio', () => ({
    playChat: vi.fn(),
    playWhisper: vi.fn(),
    playJoin: vi.fn(),
}));

// Mock BroadcastChannel
const mockPostMessage = vi.fn();
const mockClose = vi.fn();

// Use a class to satisfy 'new' constraint
class MockBroadcastChannel {
    name: string;
    onmessage: ((ev: any) => any) | null = null;
    postMessage = mockPostMessage;
    close = mockClose;

    constructor(name: string) {
        this.name = name;
        MockBroadcastChannel.instances.push(this);
    }

    static instances: MockBroadcastChannel[] = [];
    static clear() {
        this.instances = [];
    }
}

global.BroadcastChannel = MockBroadcastChannel as any;

describe('useSyncChannel', () => {
    let mockDispatch: any;
    let mockUpdateConfig: any;
    let mockAddChatMessage: any;

    beforeEach(() => {
        vi.clearAllMocks();
        MockBroadcastChannel.clear();

        mockDispatch = vi.fn();
        mockUpdateConfig = vi.fn();
        mockAddChatMessage = vi.fn();

        // Default Store State
        const defaultState = {
            config: { id: 'test-room', players: [{ id: 'P1' }], createdAt: 1000 },
            events: [],
            dispatch: mockDispatch,
            updateConfig: mockUpdateConfig,
        };

        const defaultChatState = {
            messages: [],
            addMessage: mockAddChatMessage,
        };

        // Setup useGameStore mock behavior
        vi.mocked(useGameStore).mockImplementation((selector: any) => selector(defaultState));
        vi.mocked(useGameStore.getState).mockReturnValue(defaultState as any);

        // Setup useChatStore mock behavior
        vi.mocked(useChatStore).mockImplementation((selector: any) => selector(defaultChatState));
        vi.mocked(useChatStore.getState).mockReturnValue(defaultChatState as any);
    });

    const getChannelInstance = () => MockBroadcastChannel.instances[0];

    it('should initialize BroadcastChannel when config.id is present', () => {
        const { unmount } = renderHook(() => useSyncChannel());

        expect(MockBroadcastChannel.instances.length).toBe(1);
        expect(MockBroadcastChannel.instances[0].name).toBe('dawn_sync_test-room');
        unmount();
    });

    it('should close channel on unmount', () => {
        const { unmount } = renderHook(() => useSyncChannel());

        unmount();
        expect(mockClose).toHaveBeenCalled();
    });

    it('should send SYNC_REQUEST_LOG on mount', () => {
        renderHook(() => useSyncChannel());

        expect(mockPostMessage).toHaveBeenCalledWith({ type: 'SYNC_REQUEST_LOG' });
    });

    it('should handle incoming SYNC_EVENT and dispatch if new', () => {
        renderHook(() => useSyncChannel());
        const channelInstance = getChannelInstance();

        const remoteEvent = { id: 'event-1', type: 'POWER_ROLL', payload: {} };

        act(() => {
            channelInstance.onmessage!({ data: { type: 'SYNC_EVENT', payload: remoteEvent } });
        });

        expect(mockDispatch).toHaveBeenCalledWith(remoteEvent);
    });

    it('should NOT dispatch SYNC_EVENT if it already exists', () => {
        const existingEvent = { id: 'event-1' };
        vi.mocked(useGameStore.getState).mockReturnValue({
            events: [existingEvent],
            dispatch: mockDispatch,
        } as any);

        renderHook(() => useSyncChannel());
        const channelInstance = getChannelInstance();

        act(() => {
            channelInstance.onmessage!({ data: { type: 'SYNC_EVENT', payload: existingEvent } });
        });

        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should handle incoming SYNC_CHAT and play audio', () => {
        renderHook(() => useSyncChannel());
        const channelInstance = getChannelInstance();

        const chatMsg = { id: 'msg-1', text: 'Hello', senderId: 'P2' };

        act(() => {
            channelInstance.onmessage!({ data: { type: 'SYNC_CHAT', payload: chatMsg } });
        });

        expect(mockAddChatMessage).toHaveBeenCalledWith(chatMsg);
        expect(audio.playChat).toHaveBeenCalled();
    });

    it('should play whisper audio for targeted chat', () => {
        renderHook(() => useSyncChannel());
        const channelInstance = getChannelInstance();

        const whisperMsg = { id: 'msg-2', text: 'Secret', senderId: 'P2', targetId: 'P1' };

        act(() => {
            channelInstance.onmessage!({ data: { type: 'SYNC_CHAT', payload: whisperMsg } });
        });

        expect(audio.playWhisper).toHaveBeenCalled();
    });

    it('should handle SYNC_CONFIG and play join sound if player count increases', () => {
        renderHook(() => useSyncChannel());
        const channelInstance = getChannelInstance();

        const newConfig = {
            id: 'test-room',
            players: [{ id: 'P1' }, { id: 'P2' }],
            createdAt: 1000
        };

        act(() => {
            channelInstance.onmessage!({ data: { type: 'SYNC_CONFIG', payload: newConfig } });
        });

        expect(mockUpdateConfig).toHaveBeenCalledWith(newConfig);
        expect(audio.playJoin).toHaveBeenCalled();
    });

    it('should respond to SYNC_REQUEST_LOG with full state', () => {
        renderHook(() => useSyncChannel());
        const channelInstance = getChannelInstance();

        act(() => {
            channelInstance.onmessage!({ data: { type: 'SYNC_REQUEST_LOG' } });
        });

        expect(mockPostMessage).toHaveBeenCalledWith(expect.objectContaining({
            type: 'SYNC_FULL_STATE',
            payload: expect.objectContaining({
                events: expect.any(Array),
                config: expect.any(Object),
                chat: expect.any(Array),
            })
        }));
    });

    it('should broadcast chat when broadcastChat is called', () => {
        const { result } = renderHook(() => useSyncChannel());

        const msg = { id: 'm1', text: 'test' };
        act(() => {
            result.current.broadcastChat(msg as any);
        });

        expect(mockPostMessage).toHaveBeenCalledWith({
            type: 'SYNC_CHAT',
            payload: msg
        });
    });

    it('should broadcast last event when events array updates', () => {
        const { rerender } = renderHook(() => useSyncChannel());

        const newEvent = { id: 'e2', type: 'TEST' };

        // Simulate store update
        vi.mocked(useGameStore).mockImplementation((selector: any) => selector({
            config: { id: 'test-room' },
            events: [newEvent],
            dispatch: mockDispatch,
        }));

        rerender();

        expect(mockPostMessage).toHaveBeenCalledWith({
            type: 'SYNC_EVENT',
            payload: newEvent
        });
    });
});
