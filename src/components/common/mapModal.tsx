"use client";

import { useEffect } from "react";
import GoogleMap from "@/components/domain/map/googleMap";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  currentLocation: string;
  initialCenter?: { lat: number; lng: number };
}

export default function MapModal({
  isOpen,
  onClose,
  onConfirm,
  onLocationSelect,
  currentLocation,
  initialCenter,
}: MapModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-end sm:items-center justify-center z-[100] p-0 sm:p-6" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }} 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" 
        style={{ 
          height: '92vh', 
          maxHeight: 'calc(100% - 20px)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 섹션 */}
        <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-gray-900">거래 장소 선택</h2>
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="닫기"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-purple-50 p-2 rounded-lg">
             <span className="flex-shrink-0">📍</span>
             <p className="truncate font-medium text-purple-700">
               {currentLocation || "지도를 클릭하거나 검색하여 위치를 설정하세요"}
             </p>
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-gray-50 overflow-hidden">
          <GoogleMap 
            onLocationSelect={onLocationSelect}
            initialCenter={initialCenter}
          />
        </div>

        {/* 푸터 버튼 섹션 */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-3 flex-shrink-0 mb-safe">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-all border border-gray-200"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-[2] px-4 py-3.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-100 active:scale-[0.98]"
          >
            이 위치로 설정하기
          </button>
        </div>
      </div>
    </div>
  );
}