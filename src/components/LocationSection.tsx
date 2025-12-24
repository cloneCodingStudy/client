"use client";

import { useEffect } from "react";
import useLocationStore from "@/store/useLocationStore";
import { useLocation } from "@/hooks/useLocation";

export default function LocationSection() {
  const { location, setLocation } = useLocationStore();
  const { address, searchAddress, getAddressFromCoords } = useLocation();

  useEffect(() => {
    if (address) {
      setLocation({ ...location, neighborhood: address });
    }
  }, [address, setLocation]);

  useEffect(() => {
    if (!location?.neighborhood) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await getAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => console.warn("위치 권한 거부됨")
      );
    }
  }, [location, getAddressFromCoords]);

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