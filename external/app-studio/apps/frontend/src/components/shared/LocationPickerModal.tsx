import React, { useState, useEffect, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Search, Check, X, Compass, Building2, AlertCircle } from 'lucide-react';
import { BANGLADESH_DIVISIONS, POPULAR_COMMERCIAL_HUBS, CommercialHub } from '@/data/bangladeshLocations';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (newLocation: string, coordinates?: { lat: number; lng: number }) => void;
}

const DEFAULT_DHAKA_CENTER = { lat: 23.7925, lng: 90.4078 }; // Dhaka Gulshan/Central default

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number }>(DEFAULT_DHAKA_CENTER);
  const [addressText, setAddressText] = useState(currentLocation || 'Dhaka, Bangladesh');
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (currentLocation) {
      setAddressText(currentLocation);
    }
  }, [currentLocation]);

  const filteredHubs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return POPULAR_COMMERCIAL_HUBS.filter((hub) => {
      const matchesDivision = selectedDivision === 'all' || hub.divisionId === selectedDivision;
      if (!matchesDivision) return false;
      if (!q) return true;
      return (
        hub.nameEn.toLowerCase().includes(q) ||
        hub.nameBn.toLowerCase().includes(q) ||
        hub.areaBn.toLowerCase().includes(q) ||
        hub.districtBn.toLowerCase().includes(q) ||
        hub.tag.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedDivision]);

  if (!isOpen) return null;

  const handleUseGPS = () => {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError(isBn ? 'আপনার ব্রাউজারে জিপিএস সুবিধা নেই।' : 'Geolocation is not supported in this browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSelectedPos(coords);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=14`,
            { headers: { Accept: 'application/json' } }
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.state;
            const country = data.address?.country || 'Bangladesh';
            if (city) {
              setAddressText(`${city}, ${country}`);
              setIsLocating(false);
              return;
            }
          }
        } catch {}

        setAddressText(`${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocError(
          isBn
            ? 'স্বয়ংক্রিয়ভাবে জিপিএস লোকেশন পাওয়া যায়নি। নিচে বাংলাদেশের বিভাগ বা বাণিজ্যিক মোকাম বেছে নিন।'
            : 'Could not detect GPS coordinates automatically. Select a division or commercial hub below.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleHubSelect = (hub: CommercialHub) => {
    setSelectedPos({ lat: hub.lat, lng: hub.lng });
    setAddressText(isBn ? `${hub.areaBn}, ${hub.districtBn}` : `${hub.nameEn}`);
    setLocError(null);
  };

  const handleDivisionSelect = (divId: string) => {
    setSelectedDivision(divId);
    if (divId !== 'all') {
      const div = BANGLADESH_DIVISIONS.find((d) => d.id === divId);
      if (div) {
        setSelectedPos({ lat: div.lat, lng: div.lng });
        setAddressText(isBn ? `${div.nameBn}, বাংলাদেশ` : `${div.nameEn}, Bangladesh`);
      }
    }
  };

  const handleConfirmLocation = () => {
    onSelectLocation(addressText.trim() || 'Dhaka, Bangladesh', selectedPos);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--pm-border)] flex items-center justify-between shrink-0 bg-[var(--pm-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--pm-text)]">
                {isBn ? 'ডেলিভারি এলাকা ও মোকাম নির্বাচন' : 'Select Delivery Area & Hub'}
              </h3>
              <p className="text-xs text-[var(--pm-muted)]">
                {isBn
                  ? 'বাংলাদেশের ৮ বিভাগ, ২১+ পাইকারি মোকাম ও লাইভ জিপিএস রাডার'
                  : '8 Bangladesh divisions, 21+ wholesale hubs & live GPS radar'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location modal"
            className="p-2 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Live GPS Controls */}
        <div className="p-4 bg-[var(--pm-surface)] border-b border-[var(--pm-border)] space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="relative sm:col-span-7">
              <Search className="w-4 h-4 text-[var(--pm-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isBn
                    ? 'মোকাম বা এলাকা খুঁজুন (যেমন: চকবাজার, খাতুনগঞ্জ, সিলেট)...'
                    : 'Search BD hub or area (e.g. Chawkbazar, Khatunganj)...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--pm-accent)] shadow-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleUseGPS}
              disabled={isLocating}
              className="sm:col-span-5 py-2.5 px-4 rounded-2xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] text-[var(--pm-accent)] hover:opacity-90 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-60"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating
                  ? isBn
                    ? 'জিপিএস খোঁজা হচ্ছে...'
                    : 'Detecting GPS...'
                  : isBn
                    ? 'লাইভ জিপিএস ব্যবহার করুন'
                    : 'Use Live GPS'}
              </span>
            </button>
          </div>

          {locError && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-500">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{locError}</span>
            </div>
          )}

          {/* 8 Divisions Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => handleDivisionSelect('all')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedDivision === 'all'
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-xs'
                  : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
              }`}
            >
              {isBn ? 'সব বিভাগ (৮)' : 'All 8 Divisions'}
            </button>
            {BANGLADESH_DIVISIONS.map((div) => {
              const isSelected = selectedDivision === div.id;
              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => handleDivisionSelect(div.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-xs'
                      : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  {isBn ? div.nameBn.replace(' বিভাগ', '') : div.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Google Map + Selected Pin Banner */}
        <div className="h-44 sm:h-52 w-full relative bg-[var(--pm-surface)] shrink-0 border-b border-[var(--pm-border)]">
          {mapsApiKey ? (
            <APIProvider apiKey={mapsApiKey}>
              <Map
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={selectedPos}
                center={selectedPos}
                defaultZoom={13}
                zoom={13}
                mapId="DEMO_MAP_ID"
                className="w-full h-full"
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                <AdvancedMarker position={selectedPos} title={addressText}>
                  <Pin background="#2563eb" glyphColor="#ffffff" borderColor="#1e40af" />
                </AdvancedMarker>
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center space-y-1.5 bg-[var(--pm-surface)]">
              <div className="w-10 h-10 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[var(--pm-text)]">{addressText}</p>
              <p className="text-[11px] font-mono text-[var(--pm-muted)]">
                {selectedPos.lat.toFixed(4)}° N, {selectedPos.lng.toFixed(4)}° E
              </p>
            </div>
          )}
        </div>

        {/* Bangladesh Commercial Hubs List */}
        <div className="p-4 space-y-2.5 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-[var(--pm-muted)] uppercase tracking-widest">
              {isBn
                ? `বাংলাদেশের বাণিজ্যিক মোকাম (${filteredHubs.length})`
                : `Bangladesh Commercial Hubs (${filteredHubs.length})`}
            </span>
            <span className="text-[10px] font-mono text-[var(--pm-muted)]">
              {selectedPos.lat.toFixed(3)}, {selectedPos.lng.toFixed(3)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredHubs.map((hub) => {
              const displayTarget = isBn ? `${hub.areaBn}, ${hub.districtBn}` : hub.nameEn;
              const isSelected =
                addressText === displayTarget ||
                Math.abs(selectedPos.lat - hub.lat) < 0.001;

              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => handleHubSelect(hub)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)] text-[var(--pm-text)] shadow-xs'
                      : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50 text-[var(--pm-text)]'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-[var(--pm-card)] text-[var(--pm-accent)] shadow-2xs shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">
                        {isBn ? hub.nameBn : hub.nameEn}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-[var(--pm-muted)] truncate">
                          {isBn ? `${hub.areaBn} • ${hub.districtBn}` : `${hub.areaBn}, ${hub.districtBn}`}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-accent)] font-bold shrink-0">
                          {hub.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Confirm Action */}
        <div className="p-4 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0 space-y-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
            <input
              type="text"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder={isBn ? 'কাস্টম ঠিকানা লিখুন...' : 'Or enter custom address...'}
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)] focus:outline-hidden focus:ring-2 focus:ring-[var(--pm-accent)]"
            />
          </div>
          <button
            type="button"
            onClick={handleConfirmLocation}
            className="w-full py-3 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>
              {isBn ? 'লোকেশন নিশ্চিত ও সেট করুন' : 'Confirm & Set Active Location'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
