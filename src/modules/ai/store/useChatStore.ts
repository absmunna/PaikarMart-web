import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatSession } from '../types';

interface ChatStore {
  sessions: Record<string, ChatSession>;
  activeSessionId: string;
  isOpen: boolean;
  
  // Actions
  toggleChat: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateLastMessage: (sessionId: string, content: string) => void;
  setSessionStatus: (sessionId: string, status: ChatSession['status']) => void;
  clearSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string) => void;
}

const DEFAULT_SESSION_ID = 'default';

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      sessions: {
        [DEFAULT_SESSION_ID]: {
          id: DEFAULT_SESSION_ID,
          messages: [],
          status: 'idle',
        },
      },
      activeSessionId: DEFAULT_SESSION_ID,
      isOpen: false,

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      
      addMessage: (sessionId, message) => set((state) => {
        const session = state.sessions[sessionId] || { id: sessionId, messages: [], status: 'idle' };
        const newMessage: ChatMessage = {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
        };
        
        return {
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              messages: [...session.messages, newMessage],
            },
          },
        };
      }),

      updateLastMessage: (sessionId, content) => set((state) => {
        const session = state.sessions[sessionId];
        if (!session || session.messages.length === 0) return state;

        const messages = [...session.messages];
        const lastMessage = { ...messages[messages.length - 1] };
        lastMessage.content += content;
        messages[messages.length - 1] = lastMessage;

        return {
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              messages,
            },
          },
        };
      }),

      setSessionStatus: (sessionId, status) => set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...state.sessions[sessionId],
            status,
          },
        },
      })),

      clearSession: (sessionId) => set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...state.sessions[sessionId],
            messages: [],
            status: 'idle' as const,
          },
        },
      })),

      setActiveSession: (activeSessionId) => set({ activeSessionId }),
    }),
    {
      name: 'paikarmart-ai-chat',
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);
