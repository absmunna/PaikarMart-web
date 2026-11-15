import { Conversation, MessageItem } from '@/features/messaging/types/messaging';

export const INITIAL_CONVERSATIONS: Conversation[] = [
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
      imageUrl: '/src/assets/images/garment_factory_floor_1794253693154.jpg',
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

export const INITIAL_MESSAGES: Record<string, MessageItem[]> = {
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
