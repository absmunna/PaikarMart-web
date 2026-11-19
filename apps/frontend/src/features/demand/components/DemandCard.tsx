import React from 'react';
import {
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  Truck,
  CheckCircle2,
  DollarSign,
  Tag
} from 'lucide-react';
import { DemandRequest } from '@/features/demand/types/demandTypes';

interface DemandCardProps {
  demand: DemandRequest;
  isBn: boolean;
  onRespond: (demand: DemandRequest) => void;
  onMessageBuyer?: (demand: DemandRequest) => void;
}

export const DemandCard: React.FC<DemandCardProps> = ({
  demand,
  isBn,
  onRespond,
  onMessageBuyer
}) => {
  const getDomainIcon = () => {
    switch (demand.domain) {
      case 'products':
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />;
      case 'services':
        return <Wrench className="w-3.5 h-3.5 text-purple-500" />;
      case 'logistics':
        return <Truck className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getDomainLabel = () => {
    switch (demand.domain) {
      case 'products':
        return isBn ? 'পণ্য চাহিদা' : 'Product Demand';
      case 'services':
        return isBn ? 'সার্ভিস চাহিদা' : 'Service Request';
      case 'logistics':
        return isBn ? 'লজিস্টিকস / রাইড' : 'Transit & Freight';
    }
  };

  const getUrgencyBadge = () => {
    if (demand.urgency === 'urgent') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
          <Clock className="w-2.5 h-2.5" />
          {isBn ? 'জরুরি' : 'Urgent'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--pm-surface)] text-[var(--pm-muted)] border border-[var(--pm-border)]">
        {isBn ? 'স্ট্যান্ডার্ড' : 'Standard'}
      </span>
    );
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3.5 group hover:border-[var(--pm-accent)]/40">
      {/* Top Header: Buyer & Domain Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={demand.buyerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
            alt={demand.buyerName}
            className="w-10 h-10 rounded-full object-cover border border-[var(--pm-border)] shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">{demand.buyerName}</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--pm-muted)]">
              <span className="flex items-center gap-1">
                {getDomainIcon()}
                <span className="font-semibold">{getDomainLabel()}</span>
              </span>
              <span>·</span>
              <span>{demand.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0">{getUrgencyBadge()}</div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h3 className="text-sm sm:text-base font-black text-[var(--pm-text)] leading-snug group-hover:text-[var(--pm-accent)] transition-colors">
          {demand.title}
        </h3>
        <p className="text-xs text-[var(--pm-muted)] leading-relaxed line-clamp-2">
          {demand.description}
        </p>
      </div>

      {/* Meta Specs: Budget, Quantity, Location */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs">
        <div>
          <span className="text-[10px] text-[var(--pm-muted)] uppercase block font-bold">
            {isBn ? 'টার্গেট বাজেট' : 'Target Budget'}
          </span>
          <span className="font-mono font-black text-[var(--pm-accent)]">
            ৳{demand.targetBudgetBdt.toLocaleString()}
          </span>
        </div>

        {demand.quantity ? (
          <div>
            <span className="text-[10px] text-[var(--pm-muted)] uppercase block font-bold">
              {isBn ? 'পরিমাণ' : 'Required Qty'}
            </span>
            <span className="font-bold text-[var(--pm-text)]">
              {demand.quantity} {demand.unit || ''}
            </span>
          </div>
        ) : (
          <div>
            <span className="text-[10px] text-[var(--pm-muted)] uppercase block font-bold">
              {isBn ? 'ক্যাটাগরি' : 'Category'}
            </span>
            <span className="font-semibold text-[var(--pm-text)] truncate block">
              {demand.category}
            </span>
          </div>
        )}

        <div className="col-span-2 sm:col-span-1 flex flex-col justify-center">
          <span className="text-[10px] text-[var(--pm-muted)] uppercase block font-bold">
            {isBn ? 'লোকেশন' : 'Location'}
          </span>
          <span className="text-[11px] font-semibold text-[var(--pm-text)] truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[var(--pm-accent)] shrink-0" />
            {demand.locationArea}
          </span>
        </div>
      </div>

      {/* Tags */}
      {demand.tags && demand.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {demand.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-[var(--pm-surface)] text-[10px] font-medium text-[var(--pm-muted)] border border-[var(--pm-border)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Footer: Quotes count + Respond Button */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--pm-border)]">
        <span className="text-[11px] text-[var(--pm-muted)] font-medium">
          {isBn ? `${demand.quotesCount} টি অফার এসেছে` : `${demand.quotesCount} quotes received`}
        </span>

        <div className="flex items-center gap-2">
          {onMessageBuyer && (
            <button
              type="button"
              onClick={() => onMessageBuyer(demand)}
              className="p-2 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] cursor-pointer active-scale transition-colors"
              title={isBn ? 'ক্রেতাকে মেসেজ দিন' : 'Chat with Buyer'}
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onRespond(demand)}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center gap-1.5 cursor-pointer active-scale transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>{isBn ? 'কোটেশন দিন' : 'Submit Quote'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
