"use client";

import { useState, useEffect } from "react";
import useLocationStore from "@/store/useLocationStore";
import { useLocation } from "@/hooks/common/useLocation";
import MapModal from "@/components/common/mapModal";

export default function LocationSection() {
  const { location, setLocation } = useLocationStore();
  const { getAddressFromCoords, searchAddress } = useLocation();
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [tempLocation, setTempLocation] = useState<{lat: number, lng: number, dong: string} | null>(null);

  // 구글 맵 스크립트 로드 체크
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsScriptReady(true);
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsScriptReady(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // 자동 위치 설정
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

  // 주소 검색 핸들러
  const handleSearch = async () => {
    const result = await searchAddress(); 
    if (result) {
      setTempLocation(result);
      setShowMap(true);
    }
  };

  // 위치 확정
  const handleConfirm = () => {
    if (tempLocation) {
      setLocation({ ...location, neighborhood: tempLocation.dong });
      setShowMap(false);
    }
  };

  return (
    <>
      <section className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
        <h1 className="text-4xl font-bold mb-4">
          {location?.neighborhood 
            ? `${location.neighborhood} 주변의 빔 프로젝터` 
            : "동네를 설정해 보세요"}
        </h1>
        <button
          onClick={handleSearch}
          className="mt-4 px-6 py-2 bg-white border border-purple-500 text-purple-600 rounded-full hover:bg-purple-50 transition-all"
        >
          📍 {location?.neighborhood ? "동네 변경하기" : "직접 주소 검색"}
        </button>
      </section>

      <MapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onConfirm={handleConfirm}
        onLocationSelect={(dong, lat, lng) => {
          setTempLocation({ dong, lat, lng });
        }}
        currentLocation={tempLocation?.dong || ""}
        initialCenter={tempLocation ? { lat: tempLocation.lat, lng: tempLocation.lng } : undefined}
      />
    </>
  );
}