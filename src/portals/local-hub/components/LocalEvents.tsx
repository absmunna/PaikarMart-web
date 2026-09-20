import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, MapPin, Users, ArrowRight,
  Clock, Share2, Heart, Plus, Search,
  Music, Utensils, Trophy, Users2,
  Loader2, AlertCircle
} from 'lucide-react';
import { LocalEvent } from '../types';
import { cn } from '@/lib/utils';

const EVENT_CATEGORIES = [
  { id: 'sports', name: 'Sports', icon: Trophy, color: 'text-amber-400' },
  { id: 'food', name: 'Food', icon: Utensils, color: 'text-rose-400' },
  { id: 'social', name: 'Social', icon: Users2, color: 'text-indigo-400' },
  { id: 'music', name: 'Music', icon: Music, color: 'text-purple-400' },
];

export const LocalEvents: React.FC = () => {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/local/events');
        const result = await response.json();
        if (result.status === 'success') {
          setEvents(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="text-zinc-500 font-medium">Discovering community events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-zinc-900/50 rounded-3xl border border-dashed border-white/10">
        <Calendar className="w-12 h-12 text-zinc-700" />
        <p className="text-zinc-500 font-medium">No upcoming events found.</p>
      </div>
    );
  }

  const featuredEvent = events[0];
  const upcomingEvents = events.slice(1);

  return (
    <div className="space-y-8">
      {/* Featured Event Hero */}
      <div className="relative h-64 rounded-[2.5rem] overflow-hidden group">
        <img 
          src={featuredEvent.image} 
          alt={featuredEvent.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 space-y-3">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-wider rounded-full">
              Featured Event
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-full border border-white/10">
              {featuredEvent.category}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white leading-tight">
            {featuredEvent.title}
          </h2>
          <div className="flex items-center gap-4 text-xs font-bold text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-cyan-400" />
              {featuredEvent.date}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-cyan-400" />
              {featuredEvent.location}
            </div>
          </div>
        </div>
        <button className="absolute bottom-8 right-8 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
          <Plus size={24} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="flex flex-col items-center gap-2 min-w-[80px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:border-cyan-500/50 transition-all">
              <cat.icon className={cn("w-6 h-6", cat.color)} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Upcoming Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">Upcoming Events</h3>
          <button className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
            Calendar View
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all group"
            >
              <div className="h-40 overflow-hidden relative">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 text-[9px] font-black text-white uppercase">
                  {event.category}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h4 className="font-bold text-white text-base leading-tight">{event.title}</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold">
                    <Calendar size={14} className="text-cyan-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold">
                    <MapPin size={14} className="text-cyan-500" />
                    {event.location}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">+{event.attendees} attending</span>
                  </div>
                  <button className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
