import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Search,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Bot,
  Languages
} from 'lucide-react';
import { CoPilotAction, ProductContext, QuoteOffer } from '@/features/messaging/types/messaging';
import { useMessagingStore } from '@/features/messaging/store/useMessagingStore';
import { AiCoPilotPanel } from '@/features/messaging/components/AiCoPilotPanel';
import { useAuth } from '@/features/auth';

interface MessagingCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeConversationId?: string;
  initialProductContext?: ProductContext;
  initialVendorName?: string;
  isFullScreen?: boolean;
}

export const MessagingCenterModal: React.FC<MessagingCenterModalProps> = ({
  isOpen,
  onClose,
  activeConversationId,
  initialProductContext,
  initialVendorName,
  isFullScreen = false
}) => {
  const { currentUser } = useAuth();
  const {
    conversations,
    messagesMap,
    selectedConvId,
    isAiLoading,
    coPilotLoading,
    coPilotAdvice,
    coPilotError,
    setSelectedConvId,
    syncConversations,
    initVendorConversation,
    sendMessage,
    runCoPilot,
    clearCoPilot,
    updateQuoteStatus
  } = useMessagingStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'ai' | 'vendor' | 'technician'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [coPilotOpenMap, setCoPilotOpenMap] = useState<Record<string, boolean>>({});

  // Custom Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState<number>(250);
  const [offerQty, setOfferQty] = useState<number>(100);
  const [offerNotes, setOfferNotes] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync threads from backend when opened
  useEffect(() => {
    if (isOpen) {
      void syncConversations();
    }
  }, [isOpen, syncConversations]);

  // Honor explicit activeConversationId prop
  useEffect(() => {
    if (isOpen && activeConversationId) {
      setSelectedConvId(activeConversationId);
      setMobileShowThread(true);
    }
  }, [isOpen, activeConversationId, setSelectedConvId]);

  // Deterministic initialization when opened from a product or vendor card
  useEffect(() => {
    if (isOpen && initialVendorName) {
      void initVendorConversation({
        buyer: {
          id: currentUser?.id || 'user_me',
          name: currentUser?.name || 'Alex Rivera',
          avatar: currentUser?.avatar
        },
        vendorName: initialVendorName,
        productContext: initialProductContext
      }).then(() => {
        setMobileShowThread(true);
        if (initialProductContext?.price) {
          setOfferPrice(initialProductContext.price);
        }
      });
    }
  }, [
    isOpen,
    initialVendorName,
    initialProductContext,
    currentUser?.id,
    currentUser?.name,
    currentUser?.avatar,
    initVendorConversation
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvId, messagesMap]);

  if (!isOpen) return null;

  const currentConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const currentMessages = messagesMap[selectedConvId] || [];
  const activeAdvice = coPilotAdvice[selectedConvId] || null;
  const isCoPilotVisible = Boolean(
    !currentConv?.isAiBot &&
      (coPilotOpenMap[selectedConvId] || activeAdvice || coPilotLoading || coPilotError)
  );

  const filteredConversations = conversations.filter((c) => {
    if (activeFilter !== 'all' && c.participantRole !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.participantName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        (c.productContext?.title || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const senderProfile = {
    id: currentUser?.id || 'user_me',
    name: currentUser?.name || 'Alex Rivera',
    avatar:
      currentUser?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    isVendor: Boolean(currentUser?.isVendor)
  };

  const handleSendMessage = async (text?: string, customQuote?: QuoteOffer) => {
    const textToSend = text !== undefined ? text : inputMessage;
    if (!textToSend.trim() && !customQuote) return;

    if (text === undefined) {
      setInputMessage('');
    }

    await sendMessage({
      conversationId: selectedConvId,
      text: textToSend,
      customQuote,
      sender: senderProfile
    });
  };

  const handleToggleCoPilot = async (actionOverride?: CoPilotAction) => {
    if (currentConv?.isAiBot) return;

    const alreadyOpen = Boolean(coPilotOpenMap[selectedConvId]);
    if (alreadyOpen && !actionOverride) {
      setCoPilotOpenMap((prev) => ({ ...prev, [selectedConvId]: false }));
      clearCoPilot(selectedConvId);
      return;
    }

    setCoPilotOpenMap((prev) => ({ ...prev, [selectedConvId]: true }));
    const defaultAction: CoPilotAction =
      actionOverride || (currentConv?.productContext?.isWholesale ? 'negotiate' : 'reply_draft');

    await runCoPilot({
      conversationId: selectedConvId,
      action: defaultAction,
      userRole: currentUser?.isVendor ? 'vendor' : 'buyer',
      targetLang: 'bn'
    });
  };

  const handleSendCustomOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.max(1, offerQty);
    const price = Math.max(0, offerPrice);
    await handleSendMessage(
      `Official Custom B2B Offer: ${qty} units @ ৳${price}/unit.`,
      {
        price,
        quantity: qty,
        status: 'pending',
        notes: offerNotes || 'Custom rate quote'
      }
    );
    setIsOfferModalOpen(false);
    setOfferNotes('');
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConvId(convId);
    setMobileShowThread(true);
  };

  return (
    <div
      className={
        isFullScreen
          ? 'w-full h-full flex flex-col animate-fadeIn'
          : 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn'
      }
    >
      <div
        className={
          isFullScreen
            ? 'w-full flex-1 bg-[var(--pm-card)] text-[var(--pm-text)] rounded-[2rem] shadow-sm border border-[var(--pm-border)] overflow-hidden flex flex-col md:flex-row min-h-[78vh]'
            : 'w-full max-w-6xl bg-[var(--pm-card)] text-[var(--pm-text)] rounded-[2rem] shadow-2xl border border-[var(--pm-border)] overflow-hidden flex flex-col md:flex-row h-[90vh]'
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT SIDEBAR: Conversations List */}
        <div
          className={`${
            mobileShowThread ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 lg:w-96 border-r border-[var(--pm-border)] flex-col bg-[var(--pm-surface)] shrink-0 h-full`}
        >
          {/* Header */}
          <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-[1.25rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center font-bold shadow-sm shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-[var(--pm-text)] truncate">
                  Messages & AI Bridge
                </h3>
                <p className="text-[10px] text-[var(--pm-muted)] truncate">
                  Live Merchant Chat & Gemini Co-Pilot
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 md:hidden rounded-full bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] flex items-center justify-center active-scale cursor-pointer"
              aria-label="Close Messaging Center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-[var(--pm-border)]">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[var(--pm-muted)]" />
              <input
                type="text"
                placeholder="Search vendor, AI, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-[2rem] bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] outline-none focus:border-[var(--pm-accent)]"
              />
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="p-2 flex items-center gap-1.5 border-b border-[var(--pm-border)]">
            {[
              { id: 'all', label: 'All' },
              { id: 'ai', label: 'AI Bot' },
              { id: 'vendor', label: 'Vendors' },
              { id: 'technician', label: 'Services' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as 'all' | 'ai' | 'vendor' | 'technician')}
                className={`flex-1 py-1.5 px-2 rounded-[2rem] text-[10px] font-bold transition-all active-scale cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                    : 'text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Conversations Thread List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              const isAi = conv.isAiBot || conv.participantRole === 'ai';

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3 rounded-[1.5rem] transition-all cursor-pointer flex items-center gap-3 active-scale ${
                    isSelected
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                      : isAi
                      ? 'bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] text-[var(--pm-text)]'
                      : 'hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)]'
                  }`}
                >
                  <div className="relative shrink-0">
                    {isAi ? (
                      <div className="w-11 h-11 rounded-[1.25rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-md">
                        <Bot className="w-6 h-6" />
                      </div>
                    ) : (
                      <img
                        src={conv.participantAvatar}
                        alt={conv.participantName}
                        className="w-11 h-11 rounded-[1.25rem] object-cover bg-[var(--pm-card)]"
                      />
                    )}
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--pm-card)] ${
                        isAi
                          ? 'bg-[var(--pm-success)]'
                          : conv.onlineStatus === 'online'
                          ? 'bg-[var(--pm-success)]'
                          : 'bg-[var(--pm-muted)]'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold truncate flex items-center gap-1 ${
                          isSelected ? 'text-[var(--pm-accent-fg)]' : 'text-[var(--pm-text)]'
                        }`}
                      >
                        <span className="truncate">{conv.participantName}</span>
                        {isAi && <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                      </h4>
                      <span
                        className={`text-[9px] font-mono whitespace-nowrap ${
                          isSelected ? 'text-[var(--pm-accent-fg)] opacity-80' : 'text-[var(--pm-muted)]'
                        }`}
                      >
                        {conv.lastMessageTimestamp}
                      </span>
                    </div>

                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        isSelected ? 'text-[var(--pm-accent-fg)] opacity-85' : 'text-[var(--pm-muted)]'
                      }`}
                    >
                      {conv.lastMessage}
                    </p>

                    {conv.productContext && (
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-[1rem] text-[9px] font-bold uppercase truncate max-w-full ${
                          isSelected
                            ? 'bg-black/15 text-[var(--pm-accent-fg)]'
                            : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-accent)]'
                        }`}
                      >
                        {conv.productContext.title}
                      </span>
                    )}
                  </div>

                  {conv.unreadCount > 0 && !isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT MAIN CHAT PANE */}
        <div
          className={`${
            mobileShowThread ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col h-full bg-[var(--pm-card)] min-w-0`}
        >
          {/* Thread Header */}
          <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setMobileShowThread(false)}
                className="md:hidden w-8 h-8 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] flex items-center justify-center shrink-0 active-scale cursor-pointer"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {currentConv?.isAiBot || currentConv?.participantRole === 'ai' ? (
                <div className="w-10 h-10 rounded-[1.25rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-md shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              ) : (
                <img
                  src={currentConv?.participantAvatar}
                  alt={currentConv?.participantName}
                  className="w-10 h-10 rounded-[1.25rem] object-cover bg-[var(--pm-surface)] shrink-0"
                />
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[var(--pm-text)] truncate">
                    {currentConv?.participantName}
                  </h3>
                  {currentConv?.isAiBot ? (
                    <span className="px-2 py-0.5 rounded-[1rem] bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] text-[9px] font-black uppercase shrink-0">
                      Gemini 3.8 AI
                    </span>
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-[var(--pm-muted)] font-medium truncate">
                  {currentConv?.isAiBot
                    ? 'AI Market Assistant & Sourcing Advisor · Active 24/7'
                    : currentConv?.participantRole === 'vendor'
                    ? 'Verified Merchant · AI Co-Pilot Ready'
                    : 'Certified Service Technician · AI Co-Pilot Ready'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!currentConv?.isAiBot && (
                <>
                  <button
                    type="button"
                    onClick={() => void handleToggleCoPilot()}
                    className={`px-3 py-1.5 rounded-[2rem] text-xs font-bold transition-all active-scale flex items-center gap-1.5 cursor-pointer border ${
                      isCoPilotVisible
                        ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-[var(--pm-accent)] shadow-md'
                        : 'bg-[var(--pm-accent-soft)] hover:opacity-90 text-[var(--pm-accent)] border-[var(--pm-accent-border)]'
                    }`}
                    title="Live Gemini AI Co-Pilot (Replies, B2B Negotiation, Summary & EN/BN Translate)"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">AI Co-Pilot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleToggleCoPilot('translate')}
                    className="p-2 rounded-full bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-all active-scale cursor-pointer"
                    title="Translate thread EN ↔ BN"
                  >
                    <Languages className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(true)}
                    className="px-3 py-1.5 rounded-[2rem] bg-[var(--pm-success)] hover:opacity-90 text-white text-xs font-bold transition-all active-scale shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Send B2B Quote</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] flex items-center justify-center active-scale cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Context Banner Header */}
          {currentConv?.productContext && (
            <div className="px-4 py-2.5 bg-[var(--pm-accent-soft)] border-b border-[var(--pm-accent-border)] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentConv.productContext.imageUrl}
                  alt={currentConv.productContext.title}
                  className="w-9 h-9 rounded-[1rem] object-cover bg-[var(--pm-card)] border border-[var(--pm-border)] shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-bold uppercase text-[var(--pm-accent)] block">
                    {currentConv.productContext.isWholesale ? 'B2B Wholesale Inquiry' : 'Inquiring About Item'}
                  </span>
                  <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">
                    {currentConv.productContext.title}
                  </h4>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-mono font-black text-[var(--pm-accent)]">
                  ৳{currentConv.productContext.price.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Embedded Gemini AI Live Co-Pilot Panel (in-thread, never leaves the vendor!) */}
          {isCoPilotVisible && (
            <AiCoPilotPanel
              advice={activeAdvice}
              isLoading={coPilotLoading}
              error={coPilotError}
              onRunAction={(action) => void handleToggleCoPilot(action)}
              onInsertReply={(text) => setInputMessage(text)}
              onSendReply={(text) => {
                void handleSendMessage(text);
              }}
              onApplyRecommendedQuote={(quote) => {
                setOfferPrice(quote.price);
                setOfferQty(quote.quantity);
                setOfferNotes(quote.notes);
                setIsOfferModalOpen(true);
              }}
              onClose={() => {
                setCoPilotOpenMap((prev) => ({ ...prev, [selectedConvId]: false }));
                clearCoPilot(selectedConvId);
              }}
            />
          )}

          {/* Thread Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[var(--pm-bg)]/40">
            {currentMessages.map((msg) => {
              const isMe = msg.senderId === 'user_me' || msg.senderId === currentUser?.id;
              const isAiMessage = msg.senderId === 'bot_gemini_ai';

              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe &&
                    (isAiMessage ? (
                      <div className="w-8 h-8 rounded-[1rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    ) : (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-[1rem] object-cover shrink-0 mt-0.5"
                      />
                    ))}

                  <div className="max-w-[82%] space-y-2">
                    <div
                      className={`p-3.5 rounded-[1.5rem] text-xs shadow-xs leading-relaxed ${
                        isMe
                          ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] rounded-tr-sm'
                          : isAiMessage
                          ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-text)] border border-[var(--pm-accent-border)] rounded-tl-sm'
                          : 'bg-[var(--pm-surface)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-tl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Custom B2B Quote Card inside chat message */}
                      {msg.quoteOffer && (
                        <div className="mt-3 p-3 rounded-[1.25rem] bg-[var(--pm-card)] text-[var(--pm-text)] space-y-2 border border-[var(--pm-success)]/40">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-black uppercase text-[var(--pm-success)] tracking-wider">
                              Official B2B Quote Proposal
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-[1rem] text-[9px] font-bold uppercase ${
                                msg.quoteOffer.status === 'accepted'
                                  ? 'bg-[var(--pm-success)] text-white'
                                  : msg.quoteOffer.status === 'declined'
                                  ? 'bg-[var(--pm-danger)] text-white'
                                  : 'bg-[var(--pm-warning-soft)] text-[var(--pm-warning)]'
                              }`}
                            >
                              {msg.quoteOffer.status}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between pt-1 border-t border-[var(--pm-border)]">
                            <div>
                              <p className="text-[10px] text-[var(--pm-muted)]">
                                Unit Price: ৳{msg.quoteOffer.price}
                              </p>
                              <p className="text-[10px] text-[var(--pm-muted)]">
                                Quantity: {msg.quoteOffer.quantity} units
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-[var(--pm-muted)] block">Total Value</span>
                              <p className="text-sm font-mono font-black text-[var(--pm-success)]">
                                ৳{(msg.quoteOffer.price * msg.quoteOffer.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {msg.quoteOffer.notes && (
                            <p className="text-[10px] text-[var(--pm-muted)] italic">
                              "{msg.quoteOffer.notes}"
                            </p>
                          )}

                          {msg.quoteOffer.status === 'pending' && !isMe && (
                            <div className="pt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  void updateQuoteStatus(selectedConvId, msg.id, 'accepted')
                                }
                                className="flex-1 py-1.5 bg-[var(--pm-success)] hover:opacity-90 text-white text-[10px] font-bold uppercase rounded-[2rem] shadow-xs active-scale cursor-pointer"
                              >
                                Accept Quote
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  void updateQuoteStatus(selectedConvId, msg.id, 'declined')
                                }
                                className="px-3 py-1.5 bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-muted)] text-[10px] font-bold uppercase rounded-[2rem] active-scale cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <span className="text-[9px] opacity-70 block text-right mt-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isAiLoading && (
              <div className="flex gap-3 justify-start animate-pulse">
                <div className="w-8 h-8 rounded-[1rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-muted)]">
                  PaikarMart AI Assistant is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestion Chips */}
          <div className="px-4 py-2 bg-[var(--pm-surface)] border-t border-[var(--pm-border)] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {(currentConv?.isAiBot
              ? [
                  'What are the trending wholesale categories in Gazipur?',
                  'How to request a custom quote from factory direct suppliers?',
                  'Recommend top rated AC repair technicians near Gulshan'
                ]
              : [
                  'Is this item available in stock?',
                  'What is your best bulk rate for 100 units?',
                  'Can you confirm delivery time?'
                ]
            ).map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => void handleSendMessage(chip)}
                className="px-3 py-1 rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] text-[10px] font-bold text-[var(--pm-text)] hover:border-[var(--pm-accent)] whitespace-nowrap transition-colors active-scale cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Send Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendMessage();
            }}
            className="p-3 border-t border-[var(--pm-border)] flex items-center gap-2 shrink-0 bg-[var(--pm-card)]"
          >
            {!currentConv?.isAiBot && (
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(true)}
                className="w-10 h-10 rounded-full bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-success)] flex items-center justify-center shrink-0 active-scale cursor-pointer"
                title="Create Custom Price Offer"
              >
                <DollarSign className="w-4 h-4" />
              </button>
            )}

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                currentConv?.isAiBot
                  ? 'Ask PaikarMart AI Assistant anything...'
                  : 'Type message or open AI Co-Pilot for smart bilingual replies...'
              }
              className="flex-1 px-4 py-2.5 text-xs rounded-[2rem] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isAiLoading}
              className="w-10 h-10 rounded-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-40 text-[var(--pm-accent-fg)] transition-all shadow-md shrink-0 flex items-center justify-center active-scale cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* B2B Custom Offer Generator Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={(e) => void handleSendCustomOfferSubmit(e)}
            className="bg-[var(--pm-card)] text-[var(--pm-text)] rounded-[2rem] p-6 max-w-sm w-full shadow-2xl space-y-4 border border-[var(--pm-border)]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--pm-border)]">
              <h3 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[var(--pm-success)]" />
                <span>Send Custom B2B Quote</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[var(--pm-surface)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] text-xs font-bold flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                  Proposed Unit Rate (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] font-mono font-bold outline-none focus:border-[var(--pm-accent)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                  Lot Quantity (Units)
                </label>
                <input
                  type="number"
                  value={offerQty}
                  onChange={(e) => setOfferQty(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] font-mono font-bold outline-none focus:border-[var(--pm-accent)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  placeholder="e.g. Includes Gazipur factory pickup and custom neck tags"
                  className="w-full px-3.5 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] resize-none outline-none focus:border-[var(--pm-accent)]"
                />
              </div>

              <div className="p-3 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between text-xs font-bold">
                <span className="text-[var(--pm-muted)]">Total Lot Proposal</span>
                <span className="font-mono text-[var(--pm-success)] font-black">
                  ৳{(offerPrice * offerQty).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="flex-1 py-2 rounded-[2rem] text-xs font-bold text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] active-scale cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-[2rem] bg-[var(--pm-success)] hover:opacity-90 text-white text-xs font-bold shadow-md active-scale cursor-pointer"
              >
                Send Quote
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
