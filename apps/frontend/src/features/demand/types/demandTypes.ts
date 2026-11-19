export type DemandDomain = 'all' | 'products' | 'services' | 'logistics';

export type DemandUrgency = 'urgent' | 'standard' | 'flexible';

export interface DemandRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerAvatar?: string;
  domain: 'products' | 'services' | 'logistics';
  title: string;
  description: string;
  category: string;
  quantity?: number;
  unit?: string;
  targetBudgetBdt: number;
  locationCity: string;
  locationArea: string;
  urgency: DemandUrgency;
  status: 'open' | 'in_negotiation' | 'fulfilled' | 'closed';
  quotesCount: number;
  createdAt: string;
  tags?: string[];
}
