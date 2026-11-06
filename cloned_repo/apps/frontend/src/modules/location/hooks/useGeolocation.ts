import { useState, useCallback } from 'react';
import { useLocationStore } from '../store/locationStore';

export const useGeolocation = () => {
  const { setDetailedLocation, setLocation, setIsDetecting } = useLocationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      setError('Geolocation is not supported by your browser');
      return false;
    }

    setIsLoading(true);
    setIsDetecting(true);
    setError(null);

    return new Promise((resolve) => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            let resolvedCity = 'ঢাকা';
            let resolvedArea = 'বর্তমান অবস্থান';
            let resolvedDistrict = 'ঢাকা';
            let resolvedDivision = 'Dhaka';

            try {
              // OpenStreetMap Nominatim reverse geocoding with fallback
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=bn,en`,
                { headers: { 'Accept-Language': 'bn,en' } }
              );
              if (response.ok) {
                const data = await response.json();
                const addr = data.address || {};
                resolvedArea = addr.suburb || addr.neighbourhood || addr.road || addr.village || addr.town || addr.city || resolvedArea;
                resolvedCity = addr.city || addr.town || addr.county || resolvedCity;
                resolvedDistrict = addr.state_district || addr.county || resolvedDistrict;
                resolvedDivision = addr.state || resolvedDivision;
              }
            } catch (fetchErr) {
              console.warn('[useGeolocation] Nominatim lookup skipped:', fetchErr);
            }

            const formattedAddress = `${resolvedArea}, ${resolvedCity}`;

            setDetailedLocation({
              city: resolvedCity,
              area: resolvedArea,
              district: resolvedDistrict,
              division: resolvedDivision,
              formattedAddress,
              lat: latitude,
              lng: longitude,
              isAutoDetected: true
            });

            setIsLoading(false);
            setIsDetecting(false);
            resolve(true);
          },
          (err) => {
            console.warn('[useGeolocation] Geolocation unavailable or denied:', err?.message || 'Access denied');
            // Graceful fallback to Dhaka Central
            setDetailedLocation({
              city: 'ঢাকা',
              area: 'ঢাকা কেন্দ্রীয় এলাকা',
              district: 'ঢাকা',
              division: 'Dhaka',
              formattedAddress: 'ঢাকা কেন্দ্রীয় এলাকা',
              lat: 23.8103,
              lng: 90.4125,
              isAutoDetected: false
            });
            setError('জিপিএস অনুমতি পাওয়া যায়নি, ডিফল্ট ঢাকা জোন নির্বাচিত হয়েছে');
            setIsLoading(false);
            setIsDetecting(false);
            resolve(false);
          },
          { timeout: 8000, enableHighAccuracy: true, maximumAge: 60000 }
        );
      } catch (unexpectedErr) {
        console.warn('[useGeolocation] Unexpected error requesting geolocation:', unexpectedErr);
        setIsLoading(false);
        setIsDetecting(false);
        resolve(false);
      }
    });
  }, [setDetailedLocation, setIsDetecting]);

  const watchLocation = useCallback((callback?: (coords: { lat: number; lng: number }) => void): number | null => {
    if (typeof window === 'undefined' || !navigator?.geolocation) return null;
    try {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation('Current Location', pos.coords.latitude, pos.coords.longitude);
          callback?.({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn('[useGeolocation] watchLocation notice:', err?.message || err),
        { enableHighAccuracy: false, timeout: 10000 }
      );
      return id;
    } catch {
      return null;
    }
  }, [setLocation]);

  return { detectLocation, watchLocation, isLoading, error };
};

