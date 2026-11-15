import { create } from 'zustand';
import {
  Conversation,
  MessageItem,
  ProductContext,
  QuoteOffer,
  CoPilotAction,
  CoPilotAdvice
} from '@/features/messaging/types/messaging';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '@/features/messaging/data/initialMessagingData';
import {
  fetchConversationsApi,
  fetchThreadMessagesApi,
  initConversationApi,
  sendMessageApi,
  requestAiCoPilotApi,
  updateQuoteStatusApi
} from '@/features/messaging/services/messagingApiClient';

interface MessagingStoreState {
  conversations: Conversation[];
  messagesMap: Record<string, MessageItem[]>;
  selectedConvId: string;
  isLoading: boolean;
  isAiLoading: boolean;
  coPilotLoading: boolean;
  coPilotAdvice: Record<string, CoPilotAdvice | null>;
  coPilotError: string | null;

  setSelectedConvId: (convId: string) => void;
  syncConversations: () => Promise<void>;
  loadThread: (convId: string) => Promise<void>;
  initVendorConversation: (params: {
    buyer: { id: string; name: string; avatar?: string };
    vendorName: string;
    productContext?: ProductContext;
  }) => Promise<string>;
  sendMessage: (params: {
    conversationId: string;
    text?: string;
    customQuote?: QuoteOffer;
    sender?: { id: string; name: string; avatar: string; isVendor?: boolean };
  }) => Promise<void>;
  runCoPilot: (params: {
    conversationId: string;
    action: CoPilotAction;
    userRole?: 'buyer' | 'vendor';
    targetLang?: 'bn' | 'en';
  }) => Promise<void>;
  clearCoPilot: (conversationId: string) => void;
  updateQuoteStatus: (conversationId: string, messageId: string, status: 'accepted' | 'declined') => Promise<void>;
  getTotalUnreadCount: () => number;
}

export const useMessagingStore = create<MessagingStoreState>((set, get) => ({
  conversations: INITIAL_CONVERSATIONS,
  messagesMap: INITIAL_MESSAGES,
  selectedConvId: 'conv_ai_assistant',
  isLoading: false,
  isAiLoading: false,
  coPilotLoading: false,
  coPilotAdvice: {},
  coPilotError: null,

  setSelectedConvId: (convId) => {
    set((state) => ({
      selectedConvId: convId,
      conversations: state.conversations.map(c =>
        c.id === convId ? { ...c, unreadCount: 0 } : c
      )
    }));
    void get().loadThread(convId);
  },

  syncConversations: async () => {
    set({ isLoading: true });
    try {
      const serverConversations = await fetchConversationsApi();
      if (serverConversations.length > 0) {
        set({ conversations: serverConversations });
      }
    } catch {
      // Keep local fallback conversations smoothly
    } finally {
      set({ isLoading: false });
    }
  },

  loadThread: async (convId) => {
    try {
      const serverMessages = await fetchThreadMessagesApi(convId);
      if (serverMessages.length > 0) {
        set((state) => ({
          messagesMap: {
            ...state.messagesMap,
            [convId]: serverMessages
          }
        }));
      }
    } catch {
      // Keep existing local messages
    }
  },

  initVendorConversation: async ({ buyer, vendorName, productContext }) => {
    const existingLocal = get().conversations.find(c =>
      c.participantName.toLowerCase().includes(vendorName.toLowerCase())
    );
    if (existingLocal) {
      if (productContext) {
        set((state) => ({
          conversations: state.conversations.map(c =>
            c.id === existingLocal.id ? { ...c, productContext } : c
          )
        }));
      }
      set({ selectedConvId: existingLocal.id });
      return existingLocal.id;
    }

    const initialText = productContext
      ? `আসসালামু আলাইকুম! "${productContext.title}" (৳${productContext.price}) পণ্যটি সম্পর্কে জানতে চাচ্ছি — এটি কি স্টকে আছে?`
      : 'আসসালামু আলাইকুম! আপনার শপের পণ্য সম্পর্কে জানতে চাচ্ছি।';

    try {
      const data = await initConversationApi({
        buyer,
        vendor: { name: vendorName, role: 'vendor' },
        productContext,
        initialMessage: initialText
      });

      set((state) => ({
        conversations: [data.conversation, ...state.conversations.filter(c => c.id !== data.conversation.id)],
        messagesMap: {
          ...state.messagesMap,
          [data.conversation.id]: data.messages
        },
        selectedConvId: data.conversation.id
      }));
      return data.conversation.id;
    } catch {
      const newConvId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: newConvId,
        participantId: `vendor_${Date.now()}`,
        participantName: vendorName,
        participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        participantRole: 'vendor',
        lastMessage: initialText,
        lastMessageTimestamp: 'Just now',
        unreadCount: 0,
        onlineStatus: 'online',
        productContext
      };
      const initMsg: MessageItem = {
        id: `msg_init_${Date.now()}`,
        conversationId: newConvId,
        senderId: buyer.id || 'user_me',
        senderName: buyer.name || 'Buyer',
        senderAvatar: buyer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      set((state) => ({
        conversations: [newConv, ...state.conversations],
        messagesMap: { ...state.messagesMap, [newConvId]: [initMsg] },
        selectedConvId: newConvId
      }));
      return newConvId;
    }
  },

  sendMessage: async ({ conversationId, text, customQuote, sender }) => {
    const cleanText = (text || '').trim();
    if (!cleanText && !customQuote) return;

    const currentConv = get().conversations.find(c => c.id === conversationId);
    const userText =
      cleanText || (customQuote ? `B2B Custom Offer: ${customQuote.quantity} units @ ৳${customQuote.price}/unit` : '');

    const senderId = sender?.id || 'user_me';
    const senderName = sender?.name || 'Alex Rivera';
    const senderAvatar =
      sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80';

    const newMsg: MessageItem = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      quoteOffer: customQuote
    };

    const existingThread = get().messagesMap[conversationId] || [];

    set((state) => ({
      messagesMap: {
        ...state.messagesMap,
        [conversationId]: [...existingThread, newMsg]
      },
      conversations: state.conversations.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: newMsg.text, lastMessageTimestamp: 'Just now' }
          : c
      )
    }));

    const isAiBot = Boolean(currentConv?.isAiBot || conversationId === 'conv_ai_assistant');
    if (isAiBot) {
      set({ isAiLoading: true });
      try {
        const history = existingThread.slice(-10).map(m => ({
          role: m.senderId === 'bot_gemini_ai' ? ('model' as const) : ('user' as const),
          parts: [{ text: m.text }]
        }));

        const aiRole = currentConv?.productContext?.isWholesale
          ? 'wholesale'
          : sender?.isVendor
          ? 'vendor'
          : 'general';

        const data = await sendMessageApi({
          conversationId,
          text: userText,
          productContext: currentConv?.productContext,
          senderId,
          senderName,
          senderAvatar,
          role: aiRole,
          history
        });

        if (data.success && data.aiReply) {
          set((state) => ({
            messagesMap: {
              ...state.messagesMap,
              [conversationId]: [...(state.messagesMap[conversationId] || []), data.aiReply]
            },
            conversations: state.conversations.map(c =>
              c.id === conversationId
                ? { ...c, lastMessage: data.aiReply.text, lastMessageTimestamp: 'Just now' }
                : c
            )
          }));
        }
      } catch (err) {
        console.error('AI chat error:', err);
        const aiFallbackMsg: MessageItem = {
          id: `reply_ai_${Date.now()}`,
          conversationId,
          senderId: 'bot_gemini_ai',
          senderName: 'PaikarMart AI Assistant',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
          text: `Assalamu Alaikum! I noted your inquiry about "${userText}". Please check your connection or ask again for real-time Gemini AI sourcing analysis.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        };
        set((state) => ({
          messagesMap: {
            ...state.messagesMap,
            [conversationId]: [...(state.messagesMap[conversationId] || []), aiFallbackMsg]
          }
        }));
      } finally {
        set({ isAiLoading: false });
      }
      return;
    }

    // Persist buyer/vendor message to backend & simulate vendor acknowledgment
    void sendMessageApi({
      conversationId,
      text: userText,
      quoteOffer: customQuote,
      productContext: currentConv?.productContext,
      senderId,
      senderName,
      senderAvatar
    }).catch(() => {});

    if (currentConv) {
      setTimeout(() => {
        const vendorReply: MessageItem = {
          id: `reply_${Date.now()}`,
          conversationId,
          senderId: currentConv.participantId,
          senderName: currentConv.participantName,
          senderAvatar: currentConv.participantAvatar,
          text: customQuote
            ? `ধন্যবাদ! আপনার ${customQuote.quantity} ইউনিটের (৳${customQuote.price}/পিস) B2B কোটেশন প্রস্তাবটি আমাদের সেলস টিম রিসিভ করেছে।`
            : 'ধন্যবাদ! আপনার বার্তাটি আমাদের ভেরিফাইড শপ/সার্ভিস টিম পেয়েছে, খুব দ্রুত উত্তর দেওয়া হবে।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };

        set((state) => ({
          messagesMap: {
            ...state.messagesMap,
            [conversationId]: [...(state.messagesMap[conversationId] || []), vendorReply]
          },
          conversations: state.conversations.map(c =>
            c.id === conversationId
              ? { ...c, lastMessage: vendorReply.text, lastMessageTimestamp: 'Just now' }
              : c
          )
        }));
      }, 1300);
    }
  },

  runCoPilot: async ({ conversationId, action, userRole = 'buyer', targetLang = 'bn' }) => {
    const conv = get().conversations.find(c => c.id === conversationId);
    const messages = get().messagesMap[conversationId] || [];

    set({ coPilotLoading: true, coPilotError: null });
    try {
      const advice = await requestAiCoPilotApi({
        conversationId,
        action,
        messages,
        productContext: conv?.productContext,
        userRole,
        targetLang
      });

      set((state) => ({
        coPilotAdvice: {
          ...state.coPilotAdvice,
          [conversationId]: advice
        }
      }));
    } catch (err: any) {
      set({ coPilotError: err?.message || 'AI Co-Pilot could not analyze this thread.' });
    } finally {
      set({ coPilotLoading: false });
    }
  },

  clearCoPilot: (conversationId) => {
    set((state) => ({
      coPilotAdvice: { ...state.coPilotAdvice, [conversationId]: null },
      coPilotError: null
    }));
  },

  updateQuoteStatus: async (conversationId, messageId, status) => {
    set((state) => ({
      messagesMap: {
        ...state.messagesMap,
        [conversationId]: (state.messagesMap[conversationId] || []).map(m =>
          m.id === messageId && m.quoteOffer
            ? { ...m, quoteOffer: { ...m.quoteOffer, status } }
            : m
        )
      }
    }));

    void updateQuoteStatusApi(messageId, conversationId, status).catch(() => {});
  },

  getTotalUnreadCount: () => {
    return get().conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }
}));
