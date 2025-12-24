"use client";

import { useEffect, useState } from "react";
import useLocationStore from "@/store/useLocationStore";
import { useLocation } from "@/hooks/useLocation";

export default function LocationSection() {
  const { location, setLocation } = useLocationStore();
  const { getAddressFromCoords, searchAddress } = useLocation();
  const [isScriptReady, setIsScriptReady] = useState(false);

  // 1. 네이버 스크립트 로드 여부 체크 (타이밍 문제 해결)
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      setIsScriptReady(true);
    } else {
      // 로드가 안 됐다면 0.1초마다 체크 (간단한 해결책)
      const interval = setInterval(() => {
        if (window.naver && window.naver.maps) {
          setIsScriptReady(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // 2. 자동 위치 설정 (스크립트가 준비되었을 때만 실행)
  useEffect(() => {
    if (!location?.neighborhood && isScriptReady) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const dong = await getAddressFromCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );
          if (dong) {
            setLocation({ ...location, neighborhood: dong });
          }
        },
        (err) => console.warn("위치 권한 거부됨", err)
      );
    }
  }, [isScriptReady, location?.neighborhood]); 

  // 3. 수동 주소 검색 핸들러
  const handleSearch = async () => {
    const result = await searchAddress(); 
    if (result) {
        setLocation({ 
            ...location, 
            neighborhood: result.dong, 
        });
    }
  };

  return (
    <section className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
      <h1 className="text-4xl font-bold mb-4">
        {location?.neighborhood 
          ? `${location.neighborhood} 주변의 빔 프로젝터` 
          : "동네를 설정해 보세요"}
      </h1>
      <button
        onClick={searchAddress}
        className="mt-4 px-6 py-2 bg-white border border-purple-500 text-purple-600 rounded-full hover:bg-purple-50 transition-all"
      >
        📍 {location?.neighborhood ? "동네 변경하기" : "직접 주소 검색"}
      </button>
    </section>
  );
}