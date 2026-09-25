import { useState, useCallback } from 'react';
import { useLocationStore } from './locationStore';

export const useGeolocation = () => {
  const { setLocation, setAutoDetected } = useLocationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // OpenStreetMap Nominatim reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.village || data.name;
          
          if (city) {
            setLocation(city, latitude, longitude);
            setAutoDetected(true);
          } else {
            const bdResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const bdData = await bdResponse.json();
            if (bdData.city || bdData.locality) {
              setLocation(bdData.city || bdData.locality, latitude, longitude);
              setAutoDetected(true);
            }
          }
        } catch (err) {
          console.error('Error fetching location name:', err);
          try {
            const bdResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const bdData = await bdResponse.json();
            if (bdData.city || bdData.locality) {
              setLocation(bdData.city || bdData.locality, latitude, longitude);
              setAutoDetected(true);
            }
          } catch {
            setError('Failed to fetch location name');
          }
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(err.message);
        setIsLoading(false);
      },
      { timeout: 8000 }
    );
  }, [setLocation, setAutoDetected]);

  const watchLocation = useCallback((callback?: (coords: { lat: number; lng: number }) => void): number | null => {
    if (!navigator.geolocation) return null;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation('Current Location', pos.coords.latitude, pos.coords.longitude);
        callback?.({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.warn('watchLocation error:', err),
      { enableHighAccuracy: true }
    );
    return id;
  }, [setLocation]);

  return { detectLocation, watchLocation, isLoading, error };
};
