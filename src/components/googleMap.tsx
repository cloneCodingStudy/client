"use client";

import { useEffect, useRef, useState } from "react";

interface GoogleMapProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  initialCenter?: { lat: number; lng: number };
}

export default function GoogleMap({ onLocationSelect, initialCenter }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  const geocoderInstance = useRef<google.maps.Geocoder | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [searchValue, setSearchValue] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && mapRef.current) {
      const center = initialCenter || { lat: 37.5665, lng: 126.978 };
      
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      geocoderInstance.current = new google.maps.Geocoder();

      // 초기 마커 표시
      if (initialCenter) {
        markerInstance.current = new google.maps.Marker({
          position: center,
          map: mapInstance.current,
          animation: google.maps.Animation.DROP,
        });
      }

      // 지도 클릭 이벤트
      mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          updateLocation(e.latLng);
        }
      });
    }
  }, [initialCenter]);

  const updateLocation = (latLng: google.maps.LatLng) => {
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (!markerInstance.current) {
      markerInstance.current = new google.maps.Marker({
        position: latLng,
        map: mapInstance.current,
        animation: google.maps.Animation.DROP,
      });
    } else {
      markerInstance.current.setPosition(latLng);
      markerInstance.current.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
        markerInstance.current?.setAnimation(null);
      }, 750);
    }

    geocoderInstance.current?.geocode(
      { location: latLng },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          const addressComponents = results[0].address_components;
          
          const dong = addressComponents.find(
            (component) =>
              component.types.includes("sublocality_level_2") ||
              component.types.includes("sublocality_level_1")
          );
          
          const dongName = dong?.long_name || "";
          setSearchValue(results[0].formatted_address);
          onLocationSelect(dongName, lat, lng);
        }
      }
    );
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        
        mapInstance.current?.setCenter(latLng);
        mapInstance.current?.setZoom(17);
        updateLocation(latLng);
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("위치 가져오기 실패:", error);
        setIsLoadingLocation(false);
        alert("위치를 가져올 수 없습니다.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleSearchKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      e.preventDefault();
      await handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsSearching(true);

    geocoderInstance.current?.geocode(
      { address: searchValue, region: 'kr' },
      (results, status) => {
        setIsSearching(false);
        
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          
          mapInstance.current?.setCenter(location);
          mapInstance.current?.setZoom(17);
          updateLocation(location);
        } else {
          alert("주소를 찾을 수 없습니다. 다시 시도해주세요.");
        }
      }
    );
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2 shadow-lg">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="장소, 주소 검색"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-purple-500 text-sm shadow-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          
          <button
            onClick={handleCurrentLocation}
            disabled={isLoadingLocation}
            className="px-4 bg-white text-purple-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center disabled:bg-gray-100"
            title="현재 위치"
          >
            {isLoadingLocation ? (
              <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
            ) : (
              "🎯"
            )}
          </button>
        </div>
      </div>

      <div 
        ref={mapRef} 
        className="flex-1 w-full h-full"
      />

      {!searchValue && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs backdrop-blur-md pointer-events-none">
          지도를 클릭해 핀을 꽂아주세요
        </div>
      )}
    </div>
  );
}