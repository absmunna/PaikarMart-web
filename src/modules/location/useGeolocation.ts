import { useState } from 'react';
import { useLocationStore } from './locationStore';

export const useGeolocation = () => {
  const { setLocation, setAutoDetected } = useLocationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = () => {
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
          // OpenStreetMap Nominatim reverse geocoding (reliable and accurate for Bangladesh)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.village || data.name;
          
          if (city) {
            setLocation(city, latitude, longitude);
            setAutoDetected(true);
          } else {
            // Fallback to BigDataCloud
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
          // Simple fallback to BigDataCloud on error
          try {
            const bdResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const bdData = await bdResponse.json();
            if (bdData.city || bdData.locality) {
              setLocation(bdData.city || bdData.locality, latitude, longitude);
              setAutoDetected(true);
            }
          } catch (fallbackErr) {
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
  };

  const watchLocation = (callback?: (coords: { lat: number; lng: number }) => void) => {
    if (!navigator.geolocation) return () => {};
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (callback) callback({ lat: latitude, lng: longitude });
      },
      (err) => console.warn(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  };

  return { detectLocation, watchLocation, isLoading, error };
};
