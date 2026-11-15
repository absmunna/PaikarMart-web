import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';

export interface LocationPreset {
  name: string;
  subtext: string;
  coords: { lat: number; lng: number };
  badge?: string;
}

export const DEFAULT_PRESETS: LocationPreset[] = [
  {
    name: 'Gulshan & Banani, Dhaka',
    subtext: 'গুলশান ও বনানী প্রিমিয়াম জোন',
    coords: { lat: 23.7925, lng: 90.4078 },
    badge: 'ঢাকা হাব'
  },
  {
    name: 'Chawkbazar, Dhaka',
    subtext: 'চকবাজার পাইকারি মার্কেট',
    coords: { lat: 23.7161, lng: 90.3956 },
    badge: 'পাইকারি'
  },
  {
    name: 'Khatunganj, Chattogram',
    subtext: 'খাতুনগঞ্জ ভোগ্যপণ্য আড়ত',
    coords: { lat: 22.3392, lng: 91.8384 },
    badge: 'চট্টগ্রাম'
  },
  {
    name: 'Zindabazar, Sylhet',
    subtext: 'জিন্দাবাজার রিটেইল সেন্টার',
    coords: { lat: 24.8978, lng: 91.8714 },
    badge: 'সিলেট'
  }
];

interface LocationContextType {
  activeLocation: string;
  coordinates: { lat: number; lng: number; accuracy?: number };
  radarRadiusKm: number;
  isLocating: boolean;
  isLiveTracking: boolean;
  gpsError: string | null;
  presets: LocationPreset[];
  detectLiveLocation: () => Promise<{ name: string; coords: { lat: number; lng: number; accuracy?: number } } | null>;
  toggleContinuousWatch: () => void;
  setManualLocation: (name: string, coords?: { lat: number; lng: number }) => void;
  setRadarRadiusKm: (km: number) => void;
  clearGpsError: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_NAME_KEY = 'paikarmart_location_name';
const LOCATION_COORDS_KEY = 'paikarmart_location_coords';
const RADAR_RADIUS_KEY = 'paikarmart_radar_radius_km';

export const LocationProvider: React.FC<{ 
  children: React.ReactNode;
  onLocationChanged?: (name: string, coords: { lat: number; lng: number }) => void;
}> = ({ children, onLocationChanged }) => {
  const [activeLocation, setActiveLocationState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(LOCATION_NAME_KEY);
      if (stored) return stored;
    } catch {}
    return 'Dhaka, Bangladesh';
  });

  const [coordinates, setCoordinatesState] = useState<{ lat: number; lng: number; accuracy?: number }>(() => {
    try {
      const stored = localStorage.getItem(LOCATION_COORDS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { lat: 23.7925, lng: 90.4078, accuracy: 15 };
  });

  const [radarRadiusKm, setRadarRadiusKmState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(RADAR_RADIUS_KEY);
      if (stored) {
        const parsed = Number(stored);
        if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 20) return parsed;
      }
    } catch {}
    return 5;
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCATION_NAME_KEY, activeLocation);
      localStorage.setItem(LOCATION_COORDS_KEY, JSON.stringify(coordinates));
      localStorage.setItem(RADAR_RADIUS_KEY, String(radarRadiusKm));
    } catch {}
  }, [activeLocation, coordinates, radarRadiusKm]);

  const setRadarRadiusKm = (km: number) => {
    const clamped = Math.max(1, Math.min(20, Math.round(km)));
    setRadarRadiusKmState(clamped);
  };

  // Clean up continuous watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
        navigator.geolocation?.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const resolveAddress = async (lat: number, lng: number): Promise<string> => {
    // 1. Check Google Maps Geocoder if loaded
    if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        if (response.results && response.results.length > 0) {
          const first = response.results[0];
          const locality = first.address_components?.find((c: any) =>
            c.types.includes('locality') || c.types.includes('sublocality')
          )?.long_name;
          const country = first.address_components?.find((c: any) =>
            c.types.includes('country')
          )?.short_name;
          if (locality && country) return `${locality}, ${country}`;
          return first.formatted_address.split(',').slice(0, 2).join(',').trim();
        }
      } catch {}
    }

    // 2. Fallback to OpenStreetMap Reverse Geocoding
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`, {
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.state;
        const country = data.address?.country;
        if (city && country) return `${city}, ${country}`;
        if (data.display_name) return data.display_name.split(',').slice(0, 2).join(',').trim();
      }
    } catch {}

    return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
  };

  const setManualLocation = (name: string, coords?: { lat: number; lng: number }) => {
    setActiveLocationState(name);
    if (coords) {
      setCoordinatesState({ ...coords, accuracy: undefined });
      onLocationChanged?.(name, coords);
    }
  };

  const detectLiveLocation = async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return null;
    }

    setIsLocating(true);
    setGpsError(null);

    return new Promise<{ name: string; coords: { lat: number; lng: number; accuracy?: number } } | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const coords = { lat: latitude, lng: longitude, accuracy: Math.round(accuracy) };
          setCoordinatesState(coords);

          const resolvedName = await resolveAddress(latitude, longitude);
          setActiveLocationState(resolvedName);
          setIsLocating(false);

          onLocationChanged?.(resolvedName, coords);
          resolve({ name: resolvedName, coords });
        },
        (err) => {
          setIsLocating(false);
          let msg = 'Failed to retrieve live satellite GPS location.';
          if (err.code === err.PERMISSION_DENIED) {
            msg = 'GPS Permission denied. Please allow device location access.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            msg = 'GPS Position unavailable. Try moving outdoors.';
          } else if (err.code === err.TIMEOUT) {
            msg = 'Location request timed out.';
          }
          setGpsError(msg);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const toggleContinuousWatch = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    if (isLiveTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveTracking(false);
    } else {
      setIsLiveTracking(true);
      setGpsError(null);

      const id = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const coords = { lat: latitude, lng: longitude, accuracy: Math.round(accuracy) };
          setCoordinatesState(coords);
          const resolvedName = await resolveAddress(latitude, longitude);
          setActiveLocationState(resolvedName);
          onLocationChanged?.(resolvedName, coords);
        },
        (err) => {
          setIsLiveTracking(false);
          setGpsError(err.message || 'Continuous tracking error.');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000
        }
      );
      watchIdRef.current = id;
    }
  };

  const clearGpsError = () => setGpsError(null);

  const value = useMemo(
    () => ({
      activeLocation,
      coordinates,
      radarRadiusKm,
      isLocating,
      isLiveTracking,
      gpsError,
      presets: DEFAULT_PRESETS,
      detectLiveLocation,
      toggleContinuousWatch,
      setManualLocation,
      setRadarRadiusKm,
      clearGpsError,
    }),
    [activeLocation, coordinates, radarRadiusKm, isLocating, isLiveTracking, gpsError]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocationSettings = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationSettings must be used within a LocationProvider');
  }
  return context;
};
