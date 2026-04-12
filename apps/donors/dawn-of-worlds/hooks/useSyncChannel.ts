
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useChatStore } from '../store/chatStore';
import { GameEvent, GameSessionConfig, ChatMessage } from '../types';
import { playChat, playWhisper, playJoin } from '../logic/audio';

/**
 * useSyncChannel
 * Simulates SPEC-011 WebSocket networking using BroadcastChannel.
 * Updated to handle SYNC_CHAT events (SPEC-012).
 */
export const useSyncChannel = () => {
  const config = useGameStore(state => state.config);
  const events = useGameStore(state => state.events);
  const dispatch = useGameStore(state => state.dispatch);
  const updateConfig = useGameStore(state => state.updateConfig);
  const addChatMessage = useChatStore(state => state.addMessage);
  
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!config?.id) return;

    const channel = new BroadcastChannel(`dawn_sync_${config.id}`);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === 'SYNC_EVENT') {
        const remoteEvent = payload as GameEvent;
        const alreadyExists = useGameStore.getState().events.some(e => e.id === remoteEvent.id);
        if (!alreadyExists) {
          dispatch(remoteEvent);
        }
      }

      if (type === 'SYNC_CHAT') {
        const remoteMsg = payload as ChatMessage;
        const alreadyExists = useChatStore.getState().messages.some(m => m.id === remoteMsg.id);
        if (!alreadyExists) {
          addChatMessage(remoteMsg);
          // Audio Feedback
          if (remoteMsg.targetId) {
             playWhisper();
          } else {
             playChat();
          }
        }
      }

      if (type === 'SYNC_CONFIG') {
        const oldPlayerCount = useGameStore.getState().config?.players.length || 0;
        const newConfig = payload as GameSessionConfig;
        
        updateConfig(newConfig);
        
        if (newConfig.players.length > oldPlayerCount) {
            playJoin();
        }
      }

      if (type === 'SYNC_REQUEST_LOG') {
         const state = useGameStore.getState();
         channel.postMessage({
           type: 'SYNC_FULL_STATE',
           payload: {
             events: state.events,
             config: state.config,
             chat: useChatStore.getState().messages
           }
         });
      }

      if (type === 'SYNC_FULL_STATE') {
        const { events: remoteEvents, config: remoteConfig, chat: remoteChat } = payload;
        const currentEvents = useGameStore.getState().events;
        
        if (remoteConfig && (!config || config.createdAt < remoteConfig.createdAt)) {
           updateConfig(remoteConfig);
        }

        remoteEvents.forEach((e: GameEvent) => {
           if (!currentEvents.some(ce => ce.id === e.id)) dispatch(e);
        });

        if (remoteChat) {
          remoteChat.forEach((m: ChatMessage) => {
            if (!useChatStore.getState().messages.some(cm => cm.id === m.id)) {
              addChatMessage(m);
            }
          });
        }
      }
    };

    channel.postMessage({ type: 'SYNC_REQUEST_LOG' });

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [config?.id]);

  // Handle outgoing events
  useEffect(() => {
    if (!channelRef.current || events.length === 0) return;
    const lastEvent = events[events.length - 1];
    channelRef.current.postMessage({ type: 'SYNC_EVENT', payload: lastEvent });
  }, [events]);

  // Function to broadcast chat (called from UI)
  const broadcastChat = (msg: ChatMessage) => {
    channelRef.current?.postMessage({ type: 'SYNC_CHAT', payload: msg });
  };

  return { broadcastChat };
};
