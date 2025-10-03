"use client";

import useLocationStore from "@/store/useLocationStore";
import { useEffect } from "react";

export default function LocationSection() {
  const { location, setLocation } = useLocationStore();

  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          setLocation({
            region: "서울특별시 성북구 성북동",
            city: "서울특별시",
            district: "성북구",
            neighborhood: "성북동",
            lat: latitude,
            lon: longitude,
          });
        },
        (err) => console.error("위치 가져오기 실패:", err)
      );
    }
  }, [location, setLocation]);

  return (
    <>
      <section className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
        {/* ✅ 지역명 동적 표시 */}
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {location
            ? `${location.neighborhood}에서 빔 프로젝터 찾고 계신가요?`
            : "내 동네를 설정하고 시작해보세요!"}
        </h1>

        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
          대여하고픈 모든 것을 검색해보세요
        </p>

        {/* 🔍 Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            className="w-full px-6 py-4 text-lg border border-[var(--color-border)] rounded-full 
                     focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 
                     focus:ring-[var(--color-primary)]/20 bg-white shadow-sm"
          />
          <button
            className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 
                           bg-[var(--color-primary)] px-6 py-2 rounded-full 
                           hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            검색
          </button>
        </div>

        {/* 📍 위치 설정 버튼 (위치 정보 없을 때만 노출) */}
        {!location && (
          <div className="mt-6">
            <button
              onClick={() => alert("주소 검색")}
              className="px-6 py-3 bg-[var(--color-primary)] text-primary-purple rounded-full hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              내 동네 설정하기
            </button>
          </div>
        )}
      </section>
    </>
  );
}
