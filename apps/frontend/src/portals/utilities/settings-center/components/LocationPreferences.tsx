import React from 'react';
import { 
  MapPin, 
  Crosshair, 
  Compass, 
  Radio, 
  Map, 
  ExternalLink, 
  AlertCircle,
  Building2,
  Check
} from 'lucide-react';
import { useLocationSettings } from '@/contexts/LocationContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationPreferencesProps {
  onOpenLocationModal?: () => void;
  className?: string;
}

export const LocationPreferences: React.FC<LocationPreferencesProps> = ({ 
  onOpenLocationModal,
  className = '' 
}) => {
  const {
    activeLocation,
    coordinates,
    isLocating,
    isLiveTracking,
    gpsError,
    presets,
    detectLiveLocation,
    toggleContinuousWatch,
    setManualLocation,
  } = useLocationSettings();

  const { t } = useLanguage();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Active Location & Live Coordinates Banner */}
      <div className="p-4 rounded-2xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-accent)]">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="uppercase tracking-wider text-[11px]">
              {t.settings.location.currentCoordinates}
            </span>
          </div>
          {coordinates.accuracy && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)]">
              ±{coordinates.accuracy}m {t.settings.location.accuracy}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[var(--pm-danger)] shrink-0" />
          <span className="font-bold text-sm sm:text-base text-[var(--pm-text)]">
            {activeLocation}
          </span>
        </div>

        {/* Lat / Lng Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)]">
            <span className="text-[10px] text-[var(--pm-muted)] block font-sans">
              {t.settings.location.latitude}
            </span>
            <span className="font-bold text-[var(--pm-text)]">
              {coordinates.lat.toFixed(5)}° N
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)]">
            <span className="text-[10px] text-[var(--pm-muted)] block font-sans">
              {t.settings.location.longitude}
            </span>
            <span className="font-bold text-[var(--pm-text)]">
              {coordinates.lng.toFixed(5)}° E
            </span>
          </div>
        </div>
      </div>

      {/* GPS Error Box */}
      {gpsError && (
        <div className="p-3 rounded-xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-xs font-medium leading-tight">{gpsError}</span>
        </div>
      )}

      {/* Action 1: Satellite Live GPS Detect */}
      <button
        onClick={() => detectLiveLocation()}
        disabled={isLocating}
        className="w-full py-3 px-4 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-60"
      >
        <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
        <span>
          {isLocating
            ? t.settings.location.detectingGPS
            : t.settings.location.detectGPS}
        </span>
      </button>

      {/* Action 2: Continuous GPS Radar Watch Switch */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
        <div className="space-y-0.5 pr-2">
          <p className="text-xs sm:text-sm font-bold text-[var(--pm-text)]">
            {t.settings.location.continuousWatch}
          </p>
          <p className="text-[11px] text-[var(--pm-muted)]">
            {t.settings.location.continuousWatchDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleContinuousWatch}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            isLiveTracking ? 'bg-[var(--pm-accent)]' : 'bg-[var(--pm-border)]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isLiveTracking ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Preset Delivery Areas */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-[var(--pm-muted)]">
          {t.settings.location.savedZones}
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset) => {
            const isSelected = activeLocation.toLowerCase().includes(preset.name.split(',')[0].toLowerCase());
            return (
              <button
                key={preset.name}
                onClick={() => setManualLocation(preset.name, preset.coords)}
                className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)] text-[var(--pm-text)] shadow-2xs'
                    : 'bg-[var(--pm-card)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Building2 className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    <span>{preset.name}</span>
                  </div>
                  <p className="text-[10px] text-[var(--pm-muted)] line-clamp-1">
                    {preset.subtext}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action 3: Open Interactive Google Map */}
      {onOpenLocationModal && (
        <button
          onClick={onOpenLocationModal}
          className="w-full py-2.5 px-3 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-[var(--pm-border)]"
        >
          <Map className="w-4 h-4 text-[var(--pm-accent)]" />
          <span>{t.settings.location.openInteractiveMap}</span>
          <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
        </button>
      )}
    </div>
  );
};
