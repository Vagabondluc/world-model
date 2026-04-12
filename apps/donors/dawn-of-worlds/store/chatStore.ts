
import { create } from 'zustand';
import { ChatMessage, PlayerId } from '../types';

interface ChatStoreState {
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;
  activeWhisperTarget?: PlayerId;
}

interface ChatStoreActions {
  addMessage: (msg: ChatMessage) => void;
  toggleChat: (open?: boolean) => void;
  setWhisperTarget: (pid?: PlayerId) => void;
  clearUnread: () => void;
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>((set, get) => ({
  messages: [],
  isOpen: false,
  unreadCount: 0,
  activeWhisperTarget: undefined,

  addMessage: (msg) => {
    set((state) => ({
      messages: [...state.messages.slice(-99), msg], // Buffer last 100
      unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
    }));
  },

  toggleChat: (open) => {
    const nextOpen = open ?? !get().isOpen;
    set({ 
      isOpen: nextOpen,
      unreadCount: nextOpen ? 0 : get().unreadCount 
    });
  },

  setWhisperTarget: (pid) => set({ activeWhisperTarget: pid }),
  clearUnread: () => set({ unreadCount: 0 }),
}));
