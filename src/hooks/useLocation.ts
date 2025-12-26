import { useCallback } from "react";

// 구글 주소 컴포넌트에서 동 이름 추출
const extractDong = (addressComponents: any[]): string => {
  // sublocality_level_2 = 동/읍/면
  const dong = addressComponents.find(
    (component) => component.types.includes("sublocality_level_2") || 
                   component.types.includes("sublocality_level_1")
  );
  return dong?.long_name || "";
};

export const useLocation = () => {
  // 1. 좌표 -> 주소 변환
  const getAddressFromCoords = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(`/api/google-reverse-geocode?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        console.error('Reverse geocoding failed:', response.status);
        return "";
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const dong = extractDong(data.results[0].address_components);
        return dong;
      }
      
      return "";
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return "";
    }
  }, []);

  // 2. 주소 -> 좌표 변환
  const getCoordsFromAddress = useCallback(async (fullAddress: string): Promise<{lat: number, lng: number, dong: string} | null> => {
    try {
      const response = await fetch(`/api/google-geocode?query=${encodeURIComponent(fullAddress)}`);
      
      if (!response.ok) {
        console.error('Geocoding failed:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const lat = result.geometry.location.lat;
        const lng = result.geometry.location.lng;
        
        // 동 이름 추출
        const dong = extractDong(result.address_components);
        
        return { lat, lng, dong };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }, []);

  // 3. 카카오 팝업
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

  return { getAddressFromCoords, searchAddress };
};