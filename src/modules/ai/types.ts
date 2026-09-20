export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  status: 'idle' | 'loading' | 'typing' | 'error';
}

export interface AIAssistantProps {
  context?: string;
  isOpen: boolean;
  onClose: () => void;
}
