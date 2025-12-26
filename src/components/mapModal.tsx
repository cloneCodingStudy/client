"use client";

import GoogleMap from "@/components/googleMap";

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
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-0 sm:p-6" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }} 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden" 
        style={{ 
          height: '92vh', 
          maxHeight: 'calc(100% - 20px)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-gray-900">거래 장소 선택</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
             <span className="flex-shrink-0 text-purple-600">📍</span>
             <p className="truncate font-medium">
               {currentLocation || "지도를 클릭하여 위치를 설정하세요"}
             </p>
          </div>
        </div>

        <div className="relative flex-1 bg-gray-100 overflow-hidden">
          <GoogleMap 
            onLocationSelect={onLocationSelect}
            initialCenter={initialCenter}
          />
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3.5 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-all"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-[2] px-4 py-3.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-md shadow-purple-100 active:scale-[0.98]"
          >
            이 위치로 설정하기
          </button>
        </div>
      </div>
    </div>
  );
}