import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Store, 
  ShoppingBag, 
  Wrench, 
  Briefcase, 
  User, 
  Loader2, 
  Globe, 
  Zap, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { sendChatMessage } from '@/features/ai/services/aiApiClient';
import { AiRole, ChatMessage } from '@/features/ai/types/ai';
import { VoiceSearchRecorder } from './VoiceSearchRecorder';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: AiRole;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  initialRole = 'general'
}) => {
  const [role, setRole] = useState<AiRole>(initialRole);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFastMode, setIsFastMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial welcome message per role
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome_msg',
          role: 'model',
          text: getRoleWelcomeText(role),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function getRoleWelcomeText(r: AiRole): string {
    switch (r) {
      case 'wholesale':
        return '👋 Hello! I am PaikarMart B2B Market Analyst. Ask me about commodity price trends, factory order negotiations, or shipping lot sizes in Bangladesh.';
      case 'vendor':
        return '🛍️ Welcome Merchant! I am your PaikarMart Seller Central Coach. Ask me how to attach Master Catalog items in 30s or optimize your store revenue.';
      case 'services':
        return '🛠️ Hi there! I am your Local Service Hub Concierge. Need an AC wash, electrician, or plumber near you? Ask me for recommendations!';
      default:
        return '✨ Assalamu Alaikum! Welcome to PaikarMart AI Assistant. How can I help you with shopping, deals, or services today?';
    }
  }

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputMessage;
    if (!prompt.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(messages, prompt.trim(), role, isFastMode);
      const modelMsg: ChatMessage = {
        id: `model_${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        text: `⚠️ Error: ${err.message || 'Could not connect to Gemini AI.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscription = (transcriptionText: string) => {
    setInputMessage(transcriptionText);
    handleSend(transcriptionText);
  };

  if (!isOpen) return null;

  const roleOptions: Array<{ id: AiRole; label: string; icon: any }> = [
    { id: 'general', label: 'Shopping', icon: ShoppingBag },
    { id: 'wholesale', label: 'B2B Wholesale', icon: Briefcase },
    { id: 'vendor', label: 'Seller Central', icon: Store },
    { id: 'services', label: 'Services', icon: Wrench },
  ];

  const quickPrompts: Record<AiRole, string[]> = {
    general: [
      'Show top Samsung phone deals',
      'What are popular grocery bundles?',
      'How does Cash on Delivery work?'
    ],
    wholesale: [
      'What is current cotton T-shirt MOQ rate?',
      'Estimate Gazipur to Gulshan freight cost',
      'How to request RFQ sample?'
    ],
    vendor: [
      'How to attach Master SKU in 30 seconds?',
      'What are compliance requirements?',
      'Tips to increase shop star rating'
    ],
    services: [
      'Find split AC jet wash technicians near me',
      'Emergency plumber arrival time',
      'Standard sanitary repair rates'
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[var(--pm-card)] text-[var(--pm-text)] h-full shadow-2xl flex flex-col border-l border-[var(--pm-border)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-[var(--pm-border)] bg-[var(--pm-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center font-black shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black tracking-tight text-[var(--pm-text)]">PaikarMart AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-accent-border)] text-[9px] font-black uppercase">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[10px] text-[var(--pm-muted)]">Bilingual E-Commerce & B2B Advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages([])}
              title="Clear Thread"
              className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-3 py-2 bg-[var(--pm-surface)] border-b border-[var(--pm-border)] flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          {roleOptions.map(r => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected 
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs' 
                    : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Messages Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[var(--pm-bg)]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 space-y-1.5 text-xs shadow-xs ${
                    isUser
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] rounded-tr-none'
                      : 'bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap font-sans">{msg.text}</p>
                  <span className="text-[9px] block text-right font-medium opacity-70">
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0 text-xs font-bold">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-muted)] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--pm-accent)]" />
                <span>Gemini AI thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[var(--pm-surface)] border-t border-[var(--pm-border)] shrink-0">
          <span className="text-[9px] font-black uppercase text-[var(--pm-muted)] block mb-1">
            Suggested Prompts
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {quickPrompts[role].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-[10px] font-bold text-[var(--pm-text)] whitespace-nowrap transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[var(--pm-card)] border-t border-[var(--pm-border)] space-y-2 shrink-0">
          <div className="flex items-center justify-between text-[10px] text-[var(--pm-muted)] px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFastMode(!isFastMode)}
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                  isFastMode ? 'bg-[var(--pm-warning)] text-black' : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)]'
                }`}
              >
                <Zap className="w-3 h-3" />
                {isFastMode ? 'Fast Lite Mode (3.1)' : 'Standard (3.8 Flash)'}
              </button>
            </div>
            <span className="text-[9px] text-[var(--pm-muted)]">Microphone enabled</span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <VoiceSearchRecorder
              onTranscriptionComplete={handleVoiceTranscription}
            />

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask ${roleOptions.find(r => r.id === role)?.label} AI...`}
              className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-40 text-[var(--pm-accent-fg)] transition-colors shrink-0 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
