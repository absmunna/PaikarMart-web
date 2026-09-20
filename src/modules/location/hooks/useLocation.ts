import { useState, useEffect } from 'react';

interface LocationState {
  city: string;
  lat: number | null;
  lon: number | null;
  address: string;
  loading: boolean;
  error: string | null;
  weather?: {
    temp: number;
    condition: string;
    icon: string;
  };
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    city: 'Chattogram',
    lat: null,
    lon: null,
    address: 'Fetching location...',
    loading: true,
    error: null,
    weather: {
      temp: 28,
      condition: 'Sunny',
      icon: '☀️'
    }
  });

  const fetchCityName = async (lat: number, lon: number) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // Nominatim requires an email or a valid User-Agent
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&email=paikar-mart@gmail.com`,
        { 
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en',
          }
        }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
         // Quietly handle non-OK responses
         throw new Error(`API status ${response.status}`);
      }
      
      const data = await response.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || 'Chattogram';
      
      // Mock weather based on general area
      const mockTemps: Record<string, number> = { 'Dhaka': 32, 'Chattogram': 29, 'Sylhet': 27, 'Rajshahi': 33 };
      const temp = mockTemps[city] || 30;

      setLocation(prev => ({
        ...prev,
        city,
        lat,
        lon,
        address: data.display_name || 'Location identified',
        loading: false,
        error: null,
        weather: {
          temp,
          condition: 'Clear',
          icon: '🌤️'
        }
      }));
    } catch (err: any) {
      clearTimeout(timeoutId);
      
      // Only log if it's not an abort or a "Load failed" which is expected in some sandboxed preview envs
      if (err.name !== 'AbortError') {
        console.warn('[useLocation] Falling back to default city due to fetch issue.');
      }
      
      // Fallback to default but set loading to false
      setLocation(prev => ({ 
        ...prev, 
        loading: false,
        city: prev.city || 'Chattogram',
        address: 'Current Location (approximate)',
        error: null
      }));
    }
  };

  const refreshLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: 'Geolocation not supported', loading: false }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchCityName(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocation(prev => ({ 
          ...prev, 
          error: error.message, 
          loading: false,
          address: 'Location access denied'
        }));
      }
    );
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return { ...location, refreshLocation, setLocation };
};
