import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Maximize2, Minimize2, MessageSquare, Sparkles } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useChatEngine } from '../hooks/useChatEngine';
import { AssistantAvatar } from './AssistantAvatar';
import { PromptInput } from './PromptInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatWidgetProps {
  mode?: 'floating' | 'embed';
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ mode = 'floating' }) => {
  const { 
    isOpen, 
    toggleChat, 
    sessions, 
    activeSessionId, 
    clearSession,
    setOpen 
  } = useChatStore();
  const { sendMessage } = useChatEngine();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeSession = sessions[activeSessionId];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages]);

  const handleSend = (content: string) => {
    sendMessage(activeSessionId, content);
  };

  const isEmbed = mode === 'embed';

  const chatContent = (
    <div className={cn(
      "bg-zinc-950 border border-white/10 flex flex-col overflow-hidden",
      isEmbed ? "w-full h-full rounded-2xl" : "fixed bottom-36 right-4 z-[9998] w-[calc(100vw-32px)] sm:w-[380px] h-[520px] rounded-3xl shadow-2xl"
    )}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AssistantAvatar isAnimating={activeSession?.status === 'loading'} size="sm" />
          <div>
            <h3 className="text-sm font-black text-white">Paikar Mart Assistant</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--pm-accent)] shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => clearSession(activeSessionId)}
            className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          {!isEmbed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleChat}
              className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {activeSession?.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[var(--pm-accent)]/50" />
            </div>
            <h4 className="text-white font-bold mb-2">আসসালামু আলাইকুম!</h4>
            <p className="text-xs text-zinc-400 line-height-relaxed">
              আমি পাইকার মার্ট এআই সহকারী। রিটেইল, হোলসেল বা আপনার বিজনেস সংক্রান্ত যেকোনো প্রশ্ন আমাকে করতে পারেন।
            </p>
            
            <div className="grid grid-cols-1 gap-2 mt-6 w-full">
              {[
                'আজকের ট্রেন্ডিং পন্য কি?',
                'কিভাবে মার্চেন্ট অ্যাকাউন্ট খুলবো?',
                'আমাকে পাইকারি রেট দেখাও'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="text-[11px] text-zinc-500 hover:text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/10 border border-white/5 bg-white/5 px-4 py-2.5 rounded-xl transition-all text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSession?.messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "flex gap-3",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            {msg.role !== 'user' && (
              <AssistantAvatar size="sm" />
            )}
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl text-[13px] leading-relaxed",
              msg.role === 'user' 
                ? "bg-[var(--pm-accent)] text-white rounded-tr-none" 
                : "bg-white/5 text-zinc-200 rounded-tl-none border border-white/5"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        
        {activeSession?.status === 'loading' && (
          <div className="flex gap-3">
            <AssistantAvatar size="sm" isAnimating />
            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
              <motion.div className="w-1 h-1 bg-zinc-500 rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
              <motion.div className="w-1 h-1 bg-zinc-500 rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
              <motion.div className="w-1 h-1 bg-zinc-500 rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-zinc-950">
        <PromptInput 
          onSend={handleSend} 
          disabled={activeSession?.status === 'loading'} 
        />
        <p className="text-[9px] text-zinc-600 text-center mt-3 font-bold uppercase tracking-widest">
          Powered by Paikar Intelligence
        </p>
      </div>
    </div>
  );

  if (isEmbed) {
    return chatContent;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        id="ai-assistant-trigger"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-20 right-4 z-[9999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all",
          isOpen 
            ? "bg-zinc-900 border border-white/10 rotate-90" 
            : "bg-gradient-to-tr from-[var(--pm-accent)] to-amber-500"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-white" />
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[var(--pm-accent)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="contents"
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
