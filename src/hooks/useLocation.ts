import { useState, useCallback } from "react";

export const useLocation = () => {
  const [address, setAddress] = useState<string>(""); 
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 37, lng: 127 });

  // 1. 좌표 -> 주소 변환 (지도 클릭 시 사용)
  const getAddressFromCoords = useCallback((lat: number, lng: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      console.error("네이버 지도 스크립트가 아직 로드되지 않았습니다.");
      return resolve(""); 
    }

    window.naver.maps.Service.reverseGeocode(
      { coords: new window.naver.maps.LatLng(lat, lng) },
      (status: any, response: any) => {
        if (status === window.naver.maps.Service.Status.OK) {
          const res = response.v2.results[0];
          if (!res) return resolve("");
          
          const dong = res.region.area3.name;
          setAddress(dong);
          setCoords({ lat, lng });
          resolve(dong);
        } else {
          resolve("");
        }
      }
    );
  });
}, []);

  // 2. 주소 -> 좌표 변환 (검색 팝업 결과 처리용)
  const getCoordsFromAddress = useCallback((fullAddress: string) => {
    window.naver.maps.Service.geocode(
      { query: fullAddress },
      (status: any, response: any) => {
        if (status === window.naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
          const result = response.v2.addresses[0];
          const lat = parseFloat(result.y);
          const lng = parseFloat(result.x);
          const dong = result.addressElements.find((e: any) => e.types.includes("EMD"))?.shortName || "";

          setAddress(dong);
          setCoords({ lat, lng });
        }
      }
    );
  }, []);

  // 3. 카카오 주소 팝업 실행
  const searchAddress = useCallback(() => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        getCoordsFromAddress(data.address);
      },
    }).open();
  }, [getCoordsFromAddress]);

  return { address, coords, setAddress, setCoords, getAddressFromCoords, searchAddress };
};