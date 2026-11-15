import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  generateChatbotResponse,
  generateMessagingCoPilotAdvice,
  type ChatHistoryMessage,
  type CoPilotAction
} from '../ai/aiServices.js';

export const messagingRouter = Router();

// In-memory backend database for messaging conversations & threads
let conversations: any[] = [
  {
    id: 'conv_ai_assistant',
    participantId: 'bot_gemini_ai',
    participantName: 'PaikarMart AI Assistant',
    participantAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
    participantRole: 'ai',
    lastMessage: 'Assalamu Alaikum! How can I assist you with wholesale quotes, product search, or local services today?',
    lastMessageTimestamp: 'Just now',
    unreadCount: 0,
    onlineStatus: 'online',
    isAiBot: true
  },
  {
    id: 'conv_samsung_brand',
    participantId: 'vendor_samsung',
    participantName: 'Samsung Official Brand Shop',
    participantAvatar: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&h=150&q=80',
    participantRole: 'vendor',
    lastMessage: 'Yes, the Galaxy S24 Ultra Titanium Black is in stock with 1 Year Official Warranty.',
    lastMessageTimestamp: '10:14 AM',
    unreadCount: 1,
    onlineStatus: 'online',
    productContext: {
      id: 'master_samsung_s24_ultra',
      title: 'Samsung Galaxy S24 Ultra (Titanium Series)',
      price: 1299.00,
      imageUrl: 'https://images.unsplash.com/photo-1707246210664-28a962a7a72d?auto=format&fit=crop&w=300&h=300&q=80',
      isWholesale: false
    }
  },
  {
    id: 'conv_standard_garments',
    participantId: 'vendor_textile_mill',
    participantName: 'Standard Garments Factory',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    participantRole: 'vendor',
    lastMessage: 'We have dispatched a special custom quote for 500 units of 180 GSM T-shirts.',
    lastMessageTimestamp: 'Yesterday',
    unreadCount: 2,
    onlineStatus: 'online',
    productContext: {
      id: 'master_cotton_tshirt_bulk',
      title: '180 GSM Pre-Shrunk Pure Cotton Crewneck T-Shirt',
      price: 2.80,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&h=300&q=80',
      isWholesale: true
    }
  },
  {
    id: 'conv_coolmaster_ac',
    participantId: 'vendor_cool_tech',
    participantName: 'CoolMaster AC Service BD',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    participantRole: 'technician',
    lastMessage: 'Our lead technician will arrive tomorrow at 10:30 AM with jet wash equipment.',
    lastMessageTimestamp: '2 days ago',
    unreadCount: 0,
    onlineStatus: 'offline'
  }
];

let messageThreads: Record<string, any[]> = {
  conv_ai_assistant: [
    {
      id: 'msg_ai_001',
      conversationId: 'conv_ai_assistant',
      senderId: 'bot_gemini_ai',
      senderName: 'PaikarMart AI Assistant',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Assalamu Alaikum! I am PaikarMart AI Assistant (powered by Gemini 3.8). Ask me anything about retail products, B2B wholesale MOQ rates, local service booking, or market trends!',
      timestamp: 'Just now',
      isRead: true
    }
  ],
  conv_samsung_brand: [
    {
      id: 'msg_101',
      conversationId: 'conv_samsung_brand',
      senderId: 'user_me',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Assalamu Alaikum! Is the Samsung Galaxy S24 Ultra Titanium Black available for same-day Gulshan delivery?',
      timestamp: '10:05 AM',
      isRead: true
    },
    {
      id: 'msg_102',
      conversationId: 'conv_samsung_brand',
      senderId: 'vendor_samsung',
      senderName: 'Samsung Official Brand Shop',
      senderAvatar: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Yes, the Galaxy S24 Ultra Titanium Black is in stock with 1 Year Official Warranty.',
      timestamp: '10:14 AM',
      isRead: false
    }
  ],
  conv_standard_garments: [
    {
      id: 'msg_201',
      conversationId: 'conv_standard_garments',
      senderId: 'user_me',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Hello, I want to order 500 units of Black 180 GSM Cotton T-Shirts. Can you offer a factory rate?',
      timestamp: 'Yesterday 3:30 PM',
      isRead: true
    },
    {
      id: 'msg_202',
      conversationId: 'conv_standard_garments',
      senderId: 'vendor_textile_mill',
      senderName: 'Standard Garments Factory',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'We have dispatched a special custom quote for 500 units of 180 GSM T-shirts.',
      timestamp: 'Yesterday 4:00 PM',
      isRead: false,
      quoteOffer: {
        price: 2.45,
        quantity: 500,
        status: 'pending',
        notes: 'Includes custom neck tag printing and Gazipur cargo delivery.'
      }
    }
  ],
  conv_coolmaster_ac: [
    {
      id: 'msg_301',
      conversationId: 'conv_coolmaster_ac',
      senderId: 'user_me',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'I booked a Split AC Master Jet Wash for tomorrow morning.',
      timestamp: '2 days ago',
      isRead: true
    },
    {
      id: 'msg_302',
      conversationId: 'conv_coolmaster_ac',
      senderId: 'vendor_cool_tech',
      senderName: 'CoolMaster AC Service BD',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Our lead technician will arrive tomorrow at 10:30 AM with jet wash equipment.',
      timestamp: '2 days ago',
      isRead: true
    }
  ]
};

// GET /api/messages/conversations
messagingRouter.get('/conversations', (_req: Request, res: Response) => {
  res.json({ success: true, conversations });
});

// GET /api/messages/thread/:conversationId
messagingRouter.get('/thread/:conversationId', (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const messages = messageThreads[conversationId] || [];

  const convIndex = conversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].unreadCount = 0;
  }

  res.json({ success: true, conversationId, messages });
});

// POST /api/messages/conversations/init (Deterministic buyer-vendor thread creation)
messagingRouter.post('/conversations/init', (req: Request, res: Response) => {
  const {
    buyer = { id: 'user_me', name: 'Alex Rivera' },
    vendor,
    productContext,
    initialMessage
  } = req.body;

  if (!vendor?.name) {
    return res.status(400).json({ success: false, error: 'Vendor name is required.' });
  }

  const vendorId = vendor.id || `vendor_${vendor.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const existing = conversations.find(
    c => c.participantId === vendorId || c.participantName.toLowerCase().includes(vendor.name.toLowerCase())
  );

  let activeConv = existing;
  if (!activeConv) {
    const convId = `chat_${[buyer.id || 'user_me', vendorId].sort().join('_')}`;
    activeConv = {
      id: convId,
      participantId: vendorId,
      participantName: vendor.name,
      participantAvatar: vendor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      participantRole: vendor.role || 'vendor',
      lastMessage: initialMessage || (productContext ? `ইনকোয়ারি: ${productContext.title}` : 'চ্যাট শুরু হয়েছে'),
      lastMessageTimestamp: 'Just now',
      unreadCount: 0,
      onlineStatus: 'online',
      productContext: productContext || undefined
    };
    conversations.unshift(activeConv);
    messageThreads[convId] = [];
  } else if (productContext) {
    activeConv.productContext = productContext;
  }

  if (initialMessage) {
    const initMsg = {
      id: `msg_init_${Date.now()}`,
      conversationId: activeConv.id,
      senderId: buyer.id || 'user_me',
      senderName: buyer.name || 'Alex Rivera',
      senderAvatar: buyer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      text: initialMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    if (!messageThreads[activeConv.id]) messageThreads[activeConv.id] = [];
    messageThreads[activeConv.id].push(initMsg);
    activeConv.lastMessage = initialMessage;
    activeConv.lastMessageTimestamp = 'Just now';
  }

  return res.status(200).json({
    success: true,
    conversation: activeConv,
    messages: messageThreads[activeConv.id] || []
  });
});

// POST /api/messages/send
messagingRouter.post('/send', async (req: Request, res: Response) => {
  const {
    conversationId,
    text,
    quoteOffer,
    productContext,
    vendorName,
    senderId = 'user_me',
    senderName = 'Alex Rivera',
    senderAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    role = 'general',
    history = []
  } = req.body;

  let activeConvId = conversationId;

  if (!activeConvId) {
    const targetName = vendorName || 'Vendor Support';
    activeConvId = `conv_${Date.now()}`;
    const newConv = {
      id: activeConvId,
      participantId: `vendor_${Date.now()}`,
      participantName: targetName,
      participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      participantRole: 'vendor',
      lastMessage: text || 'Quote request sent',
      lastMessageTimestamp: 'Just now',
      unreadCount: 0,
      onlineStatus: 'online',
      productContext: productContext || undefined
    };
    conversations.unshift(newConv);
    messageThreads[activeConvId] = [];
  }

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const userMsg = {
    id: `msg_${Date.now()}`,
    conversationId: activeConvId,
    senderId,
    senderName,
    senderAvatar,
    text: text || '',
    timestamp,
    isRead: true,
    quoteOffer: quoteOffer || undefined
  };

  if (!messageThreads[activeConvId]) {
    messageThreads[activeConvId] = [];
  }
  messageThreads[activeConvId].push(userMsg);

  const convIndex = conversations.findIndex(c => c.id === activeConvId);
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage =
      text || (quoteOffer ? `B2B Quote proposed: ৳${quoteOffer.price}/unit for ${quoteOffer.quantity} pcs` : 'New message');
    conversations[convIndex].lastMessageTimestamp = 'Just now';
  }

  // Handle multi-turn AI Assistant response with productContext awareness
  let aiReply = null;
  if (activeConvId === 'conv_ai_assistant' || conversations[convIndex]?.isAiBot) {
    const priorMessages = messageThreads[activeConvId].slice(-11, -1);
    const formattedHistory: ChatHistoryMessage[] =
      Array.isArray(history) && history.length > 0
        ? history
        : priorMessages.map((m: any) => ({
            role: m.senderId === 'bot_gemini_ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }));

    const aiText = await generateChatbotResponse(
      formattedHistory,
      text || 'Assist with this B2B quote.',
      role,
      false,
      productContext || conversations[convIndex]?.productContext
    );

    aiReply = {
      id: `msg_ai_${Date.now()}`,
      conversationId: activeConvId,
      senderId: 'bot_gemini_ai',
      senderName: 'PaikarMart AI Assistant',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
      text: aiText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    messageThreads[activeConvId].push(aiReply);
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = aiText;
    }
  }

  res.status(201).json({
    success: true,
    message: userMsg,
    aiReply,
    conversationId: activeConvId,
    conversations,
    thread: messageThreads[activeConvId]
  });
});

// POST /api/messages/ai-copilot (Live Buyer-Vendor Chat Gemini Co-Pilot Bridge)
messagingRouter.post('/ai-copilot', async (req: Request, res: Response) => {
  try {
    const {
      conversationId,
      action = 'reply_draft',
      messages,
      productContext,
      userRole = 'buyer',
      targetLang = 'bn'
    } = req.body as {
      conversationId?: string;
      action?: CoPilotAction;
      messages?: any[];
      productContext?: any;
      userRole?: 'buyer' | 'vendor';
      targetLang?: 'bn' | 'en';
    };

    const conv = conversationId ? conversations.find(c => c.id === conversationId) : undefined;
    const threadMessages = Array.isArray(messages) && messages.length > 0
      ? messages
      : (conversationId ? messageThreads[conversationId] || [] : []);

    const advice = await generateMessagingCoPilotAdvice({
      action,
      messages: threadMessages,
      productContext: productContext || conv?.productContext,
      userRole,
      targetLang
    });

    return res.json({ success: true, ...advice });
  } catch (error: any) {
    console.error('Error in /api/messages/ai-copilot:', error);
    return res.status(500).json({
      success: false,
      error: 'AI Co-Pilot analysis failed.',
      details: error.message
    });
  }
});

// PATCH /api/messages/quote/:messageId
messagingRouter.patch('/quote/:messageId', (req: Request, res: Response) => {
  const { messageId } = req.params;
  const { conversationId, status } = req.body;

  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid quote status.' });
  }

  const thread = messageThreads[conversationId] || [];
  let updatedMessage = null;

  messageThreads[conversationId] = thread.map((m: any) => {
    if (m.id === messageId && m.quoteOffer) {
      updatedMessage = {
        ...m,
        quoteOffer: { ...m.quoteOffer, status }
      };
      return updatedMessage;
    }
    return m;
  });

  res.json({ success: true, updatedMessage });
});

