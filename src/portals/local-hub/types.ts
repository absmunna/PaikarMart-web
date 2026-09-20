import { LucideIcon } from 'lucide-react';

export interface LocalPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
    role?: string;
  };
  content: string;
  image?: string;
  type: 'update' | 'demand' | 'event' | 'alert';
  location: string;
  timestamp: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags?: string[];
}

export interface LocalService {
  id: string;
  name: string;
  category: string;
  provider: string;
  rating: number;
  reviews: number;
  price: string;
  availability: string;
  image: string;
  isVerified: boolean;
}

export interface LocalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  image: string;
  category: string;
}
