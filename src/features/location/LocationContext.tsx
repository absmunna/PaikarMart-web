import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface UserLocation {
  city?: string;
  area?: string;
  district?: string;
  country?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  source: "auto" | "manual" | "none";
  updatedAt: string;
}

interface LocationCtx {
  location: UserLocation;
  detect: () => Promise<void>;
  setManual: (city: string, country?: string) => void;
  clear: () => void;
  isDetecting: boolean;
  displayName: string;
}

const STORAGE_KEY = "pm.location.v2";
const LocationContext = createContext<LocationCtx | null>(null);
const NONE: UserLocation = { source: "none", updatedAt: new Date(0).toISOString() };

function readStored(): UserLocation {
  if (typeof window === "undefined") return NONE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserLocation) : NONE;
  } catch (e) { 
    console.warn("[LocationContext] localStorage not accessible:", e);
    return NONE; 
  }
}

/** Reverse geocode lat/lng using OpenStreetMap Nominatim (free, no key) */
async function reverseGeocode(lat: number, lng: number): Promise<Partial<UserLocation>> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      { headers: { "Accept-Language": "en" } },
    );
    if (!res.ok) return {};
    const data = await res.json();
    const addr = data.address ?? {};
    return {
      city:        addr.city ?? addr.town ?? addr.village ?? addr.county ?? undefined,
      area:        addr.suburb ?? addr.neighbourhood ?? addr.quarter ?? undefined,
      district:    addr.state_district ?? addr.county ?? undefined,
      country:     addr.country ?? undefined,
      countryCode: addr.country_code?.toUpperCase() ?? undefined,
    };
  } catch {
    return {};
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(() => readStored());
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (location.source === "none") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      }
    } catch (e) {
      console.warn("[LocationContext] localStorage write failed:", e);
    }
  }, [location]);

  /** Auto-detect once on mount if no cached location */
  useEffect(() => {
    if (location.source === "none") {
      detect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detect = useCallback(async () => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    
    // Safety check for geolocation API
    if (!navigator.geolocation) {
      console.warn("[LocationContext] Geolocation not supported by this browser.");
      return;
    }

    setIsDetecting(true);
    try {
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const { latitude: lat, longitude: lng } = pos.coords;
              // First set coords immediately
              setLocation({
                lat, lng,
                source: "auto",
                updatedAt: new Date().toISOString(),
              });
              // Then enrich with reverse geocoding
              const geo = await reverseGeocode(lat, lng);
              setLocation((prev) => ({
                ...prev,
                ...geo,
                lat, lng,
                source: "auto",
                updatedAt: new Date().toISOString(),
              }));
            } catch (e) {
              console.error("[LocationContext] Error processing coordinates:", e);
            } finally {
              setIsDetecting(false);
              resolve();
            }
          },
          (err) => {
            console.warn("[LocationContext] Geolocation failed or denied:", err.message);
            // Permission denied or error — fall back to Dhaka
            setLocation({
              city: "Dhaka",
              country: "Bangladesh",
              countryCode: "BD",
              source: "manual",
              updatedAt: new Date().toISOString(),
            });
            setIsDetecting(false);
            resolve();
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 120_000 },
        );
      });
    } catch (err) {
      console.error("[LocationContext] Critical geolocation error:", err);
      setIsDetecting(false);
    }
  }, []);

  const setManual = useCallback((city: string, country?: string) => {
    setLocation({ city, country, source: "manual", updatedAt: new Date().toISOString() });
  }, []);

  const clear = useCallback(() => setLocation(NONE), []);

  /** Short human-readable display string */
  const displayName = useMemo(() => {
    if (location.source === "none" || isDetecting) return "Detecting…";
    const parts: string[] = [];
    if (location.area)    parts.push(location.area);
    if (location.city)    parts.push(location.city);
    if (!parts.length && location.district) parts.push(location.district);
    if (location.countryCode) parts.push(location.countryCode);
    else if (location.country) parts.push(location.country);
    return parts.join(", ") || "Unknown";
  }, [location, isDetecting]);

  const value = useMemo<LocationCtx>(() => ({
    location, detect, setManual, clear, isDetecting, displayName,
  }), [location, detect, setManual, clear, isDetecting, displayName]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside <LocationProvider>");
  return ctx;
}
