import { useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import { safeStorage } from "@/modules/app/utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const useChatEngine = () => {
  const { addMessage, updateLastMessage, setSessionStatus, sessions } = useChatStore();

  const sendMessage = useCallback(async (sessionId: string, currentContent: string) => {
    const session = sessions[sessionId];
    if (!session) return;

    // 1. Add user message
    addMessage(sessionId, { role: 'user', content: currentContent });
    setSessionStatus(sessionId, 'loading');

    try {
      const history = session.messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      
      const payload = {
        messages: [...history, { role: 'user', content: currentContent }],
        stream: true
      };

      const token = safeStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      // Add empty assistant message to start appending to
      addMessage(sessionId, { role: 'assistant', content: '' });
      setSessionStatus(sessionId, 'typing');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                updateLastMessage(sessionId, data.text);
              }
              if (data.toolCall) {
                console.log('[AI Tool Call]:', data.toolCall, data.result);
                // Optionally handle tool results UI-wise here
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('[Chat Engine] Error:', error);
      addMessage(sessionId, { 
        role: 'assistant', 
        content: 'দুঃখিত, বর্তমানে কিছু কারিগরি সমস্যা হচ্ছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।' 
      });
    } finally {
      setSessionStatus(sessionId, 'idle');
    }
  }, [addMessage, updateLastMessage, setSessionStatus, sessions]);

  return { sendMessage };
};
