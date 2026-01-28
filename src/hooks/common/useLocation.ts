import { useCallback } from "react";
import { mapService } from "@/services/mapService";

export const useLocation = () => {
  const getAddressFromCoords = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      return await mapService.getDongFromCoords(lat, lng);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return "";
    }
  }, []);

  const getCoordsFromAddress = useCallback(async (fullAddress: string) => {
    try {
      return await mapService.getCoordsFromAddress(fullAddress);
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }, []);

  const searchAddress = useCallback(() => {
    if (!window.daum?.Postcode) {
      console.error("Daum Postcode script not loaded");
      return Promise.resolve(null);
    }

    return new Promise<{lat: number, lng: number, dong: string} | null>((resolve) => {
      new window.daum.Postcode({
        oncomplete: async (data: any) => {
          const result = await getCoordsFromAddress(data.address);
          resolve(result);
        },
      }).open();
    });
  }, [getCoordsFromAddress]);

  return { getAddressFromCoords, getCoordsFromAddress, searchAddress };
};