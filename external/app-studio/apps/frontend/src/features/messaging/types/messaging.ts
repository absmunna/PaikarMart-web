export interface ProductContext {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  isWholesale?: boolean;
}

export interface QuoteOffer {
  price: number;
  quantity: number;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: 'vendor' | 'buyer' | 'technician' | 'ai';
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  onlineStatus?: 'online' | 'offline';
  isAiBot?: boolean;
  productContext?: ProductContext;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
  quoteOffer?: QuoteOffer;
}

export type CoPilotAction = 'reply_draft' | 'negotiate' | 'summarize' | 'translate';

export interface CoPilotAdvice {
  action: CoPilotAction;
  insight: string;
  suggestedReplies: string[];
  translatedText?: string;
  recommendedQuote?: {
    price: number;
    quantity: number;
    notes: string;
  };
}
