import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Radio, 
  Check, 
  ChevronDown, 
  Crosshair, 
  Globe, 
  ExternalLink, 
  RotateCw,
  Home,
  Building2,
  Map,
  X,
  AlertCircle,
  Settings
} from 'lucide-react';
import { User } from '@/types';
import { useLocationSettings } from '@/contexts/LocationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';

interface TopNavLocationMenuProps {
  currentUser: User;
  onUpdateLocation?: (newLocation: string, coordinates?: { lat: number; lng: number }) => void;
  onOpenLocationModal?: () => void;
}

export const TopNavLocationMenu: React.FC<TopNavLocationMenuProps> = ({
  currentUser,
  onUpdateLocation,
  onOpenLocationModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hook into centralized modular contexts
  const locationCtx = useLocationSettings();
  const { t } = useLanguage();
  const { openSettings } = useSettings();

  const activeLoc = locationCtx?.activeLocation || currentUser.location || 'Dhaka, Bangladesh';
  const liveCoords = locationCtx?.coordinates || currentUser.coordinates || { lat: 23.7925, lng: 90.4078 };
  const isLocating = locationCtx?.isLocating ?? false;
  const isLiveTracking = locationCtx?.isLiveTracking ?? false;
  const gpsError = locationCtx?.gpsError ?? null;

  // Close popover on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative shrink-0">
      
      {/* Top Navbar Trigger Chip */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="h-9 sm:h-10 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] font-semibold text-xs transition-all shadow-xs border border-[var(--pm-border)] cursor-pointer max-w-[140px] lg:max-w-[180px] xl:max-w-[210px] shrink-0"
        title="Live Location System & Radar"
      >
        {/* Pulsing Beacon Dot */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
            isLiveTracking || isLocating
              ? 'bg-[var(--pm-success)] animate-ping'
              : 'bg-[var(--pm-accent)]'
          }`} />
          <div className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
            isLiveTracking || isLocating
              ? 'bg-[var(--pm-success)]'
              : 'bg-[var(--pm-accent)]'
          }`} />
        </div>

        <Navigation className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
        
        <span className="truncate text-left text-xs font-bold flex-1 min-w-0">
          {activeLoc}
        </span>

        <ChevronDown className={`w-3 h-3 text-[var(--pm-muted)] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Real Live Location Dropdown Popover */}
      {isOpen && (
        <>
          {/* Mobile Backdrop for Location Popover */}
          <div 
            className="fixed inset-0 bg-black/40 z-40 sm:hidden animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-3 right-3 top-16 max-w-sm mx-auto sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-w-none bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
          
          {/* Popover Header */}
          <div className="p-3.5 bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-black/15 flex items-center justify-center shadow-xs">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Live GPS Radar
                </h4>
                <p className="text-[10px] opacity-85">
                  {isLiveTracking ? 'Continuous Tracking Active' : 'Real-time Device Geolocation'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openSettings('location');
                }}
                className="p-1 rounded-full opacity-80 hover:opacity-100 hover:bg-black/10 transition-colors cursor-pointer"
                title="Open Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full opacity-80 hover:opacity-100 hover:bg-black/10 transition-colors cursor-pointer"
                aria-label="Close popover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3.5 space-y-3 max-h-[75vh] overflow-y-auto overscroll-contain">
            
            {/* Live GPS Coordinate Readout Box */}
            <div className="p-3 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[var(--pm-text)]">
                  <Crosshair className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                  <span>Current Coordinates</span>
                </div>
                {liveCoords?.accuracy && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--pm-success-soft)] text-[var(--pm-success)]">
                    ±{liveCoords.accuracy}m accuracy
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-[var(--pm-card)] border border-[var(--pm-border)]">
                  <span className="text-[10px] text-[var(--pm-muted)] block">Latitude</span>
                  <span className="font-bold text-[var(--pm-text)]">
                    {liveCoords ? liveCoords.lat.toFixed(5) : '23.79250'}° N
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--pm-card)] border border-[var(--pm-border)]">
                  <span className="text-[10px] text-[var(--pm-muted)] block">Longitude</span>
                  <span className="font-bold text-[var(--pm-text)]">
                    {liveCoords ? liveCoords.lng.toFixed(5) : '90.40780'}° E
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[var(--pm-muted)] flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3 h-3 text-[var(--pm-danger)] shrink-0" />
                <span className="truncate font-semibold text-[var(--pm-text)]">{activeLoc}</span>
              </div>
            </div>

            {/* Error Message if GPS Fails */}
            {gpsError && (
              <div className="p-2.5 rounded-xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-medium leading-tight">{gpsError}</span>
              </div>
            )}

            {/* Live GPS Detection Button */}
            <button
              onClick={() => {
                if (locationCtx) {
                  locationCtx.detectLiveLocation();
                }
              }}
              disabled={isLocating}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-60"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? t.settings.location.detectingGPS : t.settings.location.detectGPS}</span>
            </button>

            {/* Continuous Live Tracking Switch */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[var(--pm-text)]">
                  {t.settings.location.continuousWatch}
                </p>
                <p className="text-[10px] text-[var(--pm-muted)]">
                  {t.settings.location.continuousWatchDesc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (locationCtx) {
                    locationCtx.toggleContinuousWatch();
                  }
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  isLiveTracking ? 'bg-[var(--pm-success)]' : 'bg-[var(--pm-border-strong)]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  isLiveTracking ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Quick Location Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-muted)] block px-1">
                {t.settings.location.savedZones}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(locationCtx?.presets || []).map((preset) => {
                  const isSelected = activeLoc?.toLowerCase().includes(preset.name.split(',')[0].toLowerCase());

                  return (
                    <button
                      key={preset.name}
                      onClick={() => {
                        locationCtx?.setManualLocation(preset.name, preset.coords);
                        if (onUpdateLocation) {
                          onUpdateLocation(preset.name, preset.coords);
                        }
                        setIsOpen(false);
                      }}
                      className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent-border)] text-[var(--pm-accent)]'
                          : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Building2 className="w-3 h-3 text-[var(--pm-accent)] shrink-0" />
                        <span className="text-xs font-bold truncate">{preset.name.split(',')[0]}</span>
                      </div>
                      <p className="text-[9px] text-[var(--pm-muted)] truncate">{preset.subtext}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch Full Google Map Modal */}
            {onOpenLocationModal && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenLocationModal();
                }}
                className="w-full py-2 px-3 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-[var(--pm-border)]"
              >
                <Map className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                <span>{t.settings.location.openInteractiveMap}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>
            )}

            {/* Link to Full Settings */}
            <button
              onClick={() => {
                setIsOpen(false);
                openSettings('appearance');
              }}
              className="w-full py-2 px-3 rounded-xl bg-[var(--pm-accent-soft)] hover:bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-[var(--pm-accent-border)]"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t.settings.title}</span>
            </button>

          </div>

        </div>
        </>
      )}

    </div>
  );
};
