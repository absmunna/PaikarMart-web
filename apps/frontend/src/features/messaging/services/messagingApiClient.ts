import {
  Conversation,
  MessageItem,
  ProductContext,
  QuoteOffer,
  CoPilotAction,
  CoPilotAdvice
} from '@/features/messaging/types/messaging';

export async function fetchConversationsApi(): Promise<Conversation[]> {
  const res = await fetch('/api/messages/conversations');
  if (!res.ok) throw new Error('Failed to load conversations');
  const data = await res.json();
  return data.conversations || [];
}

export async function fetchThreadMessagesApi(conversationId: string): Promise<MessageItem[]> {
  const res = await fetch(`/api/messages/thread/${encodeURIComponent(conversationId)}`);
  if (!res.ok) throw new Error('Failed to load thread messages');
  const data = await res.json();
  return data.messages || [];
}

export async function initConversationApi(payload: {
  buyer: { id: string; name: string; avatar?: string };
  vendor: { id?: string; name: string; avatar?: string; role?: 'vendor' | 'technician' };
  productContext?: ProductContext;
  initialMessage?: string;
}): Promise<{ conversation: Conversation; messages: MessageItem[] }> {
  const res = await fetch('/api/messages/conversations/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to initialize conversation');
  return await res.json();
}

export async function sendMessageApi(payload: {
  conversationId: string;
  text: string;
  quoteOffer?: QuoteOffer;
  productContext?: ProductContext;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  role?: 'general' | 'wholesale' | 'vendor' | 'services';
  history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
}) {
  const res = await fetch('/api/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to send message');
  return await res.json();
}

export async function requestAiCoPilotApi(payload: {
  conversationId: string;
  action: CoPilotAction;
  messages: MessageItem[];
  productContext?: ProductContext;
  userRole?: 'buyer' | 'vendor';
  targetLang?: 'bn' | 'en';
}): Promise<CoPilotAdvice> {
  const res = await fetch('/api/messages/ai-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('AI Co-Pilot request failed');
  return await res.json();
}

export async function updateQuoteStatusApi(
  messageId: string,
  conversationId: string,
  status: 'accepted' | 'declined'
) {
  const res = await fetch(`/api/messages/quote/${encodeURIComponent(messageId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, status })
  });
  if (!res.ok) throw new Error('Failed to update quote status');
  return await res.json();
}
