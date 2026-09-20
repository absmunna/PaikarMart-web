
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressResult {
  formattedAddress: string;
  components: {
    division?: string;
    district?: string;
    upazila?: string;
    area?: string;
    zipCode?: string;
  };
}

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || "";

/**
 * Service to handle device location and reverse geocoding
 */
export const locationService = {
  /**
   * Get current coordinates using browser Geolocation API
   */
  getCurrentCoordinates: (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  },

  /**
   * Reverse geocode coordinates to a readable address using Google Maps Geocoding API
   */
  reverseGeocode: async (lat: number, lng: number): Promise<AddressResult> => {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API Key is missing.");
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(`Geocoding failed: ${data.status}`);
      }

      if (data.results.length === 0) {
        throw new Error("No address found for these coordinates.");
      }

      const result = data.results[0];
      const components = result.address_components;
      
      let division = "";
      let district = "";
      let upazila = "";
      let zipCode = "";
      let area = result.formatted_address;

      components.forEach((c: any) => {
        if (c.types.includes("administrative_area_level_1")) {
          division = c.long_name.replace(" Division", "");
        }
        if (c.types.includes("administrative_area_level_2")) {
          district = c.long_name.replace(" District", "");
        }
        if (c.types.includes("locality") || c.types.includes("sublocality_level_1")) {
          upazila = c.long_name;
        }
        if (c.types.includes("postal_code")) {
          zipCode = c.long_name;
        }
      });

      return {
        formattedAddress: result.formatted_address,
        components: {
          division,
          district,
          upazila,
          area,
          zipCode,
        }
      };
    } catch (error) {
      console.error("Error in reverseGeocode:", error);
      throw error;
    }
  }
};
