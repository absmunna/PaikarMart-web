import React, { useState } from 'react';
import { MapPin, ExternalLink, Loader2, Sparkles, Navigation } from 'lucide-react';
import { fetchMapsGrounding } from '@/features/ai/services/aiApiClient';
import { MapPlaceResult } from '@/features/ai/types/ai';

interface MapsGroundingWidgetProps {
  initialPrompt?: string;
  placeholder?: string;
}

export const MapsGroundingWidget: React.FC<MapsGroundingWidgetProps> = ({
  initialPrompt = 'Find certified textile garment factories in Gazipur, Bangladesh',
  placeholder = 'Search suppliers, factories, nearby service centers...'
}) => {
  const [query, setQuery] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [places, setPlaces] = useState<MapPlaceResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    // Query browser geolocation if available
    let userLatLng: { latitude: number; longitude: number } | undefined = undefined;
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        userLatLng = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch {
        // Fallback gracefully without user coordinates
      }
    }

    try {
      const res = await fetchMapsGrounding(query.trim(), userLatLng);
      setResultText(res.text);
      setPlaces(res.places || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Maps grounding failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-success)]/30 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 flex items-center justify-center text-[var(--pm-success)] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-[var(--pm-success)] tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Google Maps Grounding
            </span>
            <h3 className="text-sm font-black text-[var(--pm-text)] leading-snug">
              Supplier & Logistics Proximity Discovery
            </h3>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Navigation className="absolute left-3.5 top-3 w-4 h-4 text-[var(--pm-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Locating...
            </>
          ) : (
            'Locate'
          )}
        </button>
      </form>

      {error && (
        <div className="p-3 rounded-2xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/40 text-[var(--pm-danger)] text-xs font-bold">
          {error}
        </div>
      )}

      {resultText && (
        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3 animate-fadeIn">
          <p className="text-xs text-[var(--pm-text)] leading-relaxed whitespace-pre-wrap font-sans">
            {resultText}
          </p>

          {places.length > 0 && (
            <div className="pt-2 border-t border-[var(--pm-border)] space-y-2">
              <span className="text-[10px] font-black uppercase text-[var(--pm-success)] tracking-wider block">
                Google Maps Verified Place Cards ({places.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {places.map((place, idx) => (
                  <a
                    key={idx}
                    href={place.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--pm-success-soft)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-success)]/30 text-[var(--pm-text)] text-xs font-bold transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-[var(--pm-success)] shrink-0" />
                      <span className="truncate">{place.title}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--pm-success)] shrink-0 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
