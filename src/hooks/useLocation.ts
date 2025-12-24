import { useState, useCallback } from "react";

export const useLocation = () => {
  // 1. 좌표 -> 주소 변환 (Promise로 결과만 깔끔하게 반환)
  const getAddressFromCoords = useCallback((lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.naver?.maps?.Service) {    
        console.warn("Naver Maps API not ready yet."); 
        return resolve("");
      }

      window.naver.maps.Service.reverseGeocode(
        { coords: new window.naver.maps.LatLng(lat, lng) },
        (status: any, response: any) => {
          if (status === window.naver.maps.Service.Status.OK) {
            const res = response.v2.results[0];
            const dong = res?.region?.area3?.name || "";
            resolve(dong);
          } else {
            resolve("");
          }
        }
      );
    });
  }, []);

  // 2. 주소 -> 좌표 변환
  const getCoordsFromAddress = useCallback((fullAddress: string): Promise<{lat: number, lng: number, dong: string} | null> => {
    return new Promise((resolve) => {
        if (!window.naver?.maps?.Service) return resolve(null);

        window.naver.maps.Service.geocode(
        { query: fullAddress },
        (status: any, response: any) => {
            if (status === window.naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
                const result = response.v2.addresses[0];
                const lat = parseFloat(result.y);
                const lng = parseFloat(result.x);
                const dong = result.addressElements.find((e: any) => e.types.includes("EMD"))?.shortName || "";
                resolve({ lat, lng, dong });
            } else {
                resolve(null);
            }
        }
        );
    });
  }, []);

  // 3. 카카오 팝업 (Hook에서 처리)
  const searchAddress = useCallback(() => {
    if (!window.daum?.Postcode) {
        console.error("Daum Postcode script not loaded");
        return;
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