import { useEffect } from 'react';
import { useLocationStore } from './locationStore';

export const useGeolocation = () => {
  const { setLocation, setAutoDetected, updateLiveLocation } = useLocationStore();

  const detectLocation = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined" || !navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser');
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();
            
            if (data.city || data.locality || data.principalSubdivision) {
              setLocation(data.city || data.locality || data.principalSubdivision, latitude, longitude);
              setAutoDetected(true);
            }
          } catch (error) {
            console.error('Error fetching location name:', error);
            setLocation('Detected Location', latitude, longitude);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } catch (e) {
      console.warn('Geolocation access denied or restricted context:', e);
    }
  };

  const watchLocation = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined" || !navigator.geolocation) return null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateLiveLocation(latitude, longitude);
      },
      (error) => console.error('WatchPosition error:', error),
      { enableHighAccuracy: true }
    );

    return watchId;
  };

  return { detectLocation, watchLocation };
};
