"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface GoogleMapProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  initialCenter?: { lat: number; lng: number };
}

export default function GoogleMap({ onLocationSelect, initialCenter }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderInstance = useRef<google.maps.Geocoder | null>(null);
  const isInitialized = useRef(false); 

  const [searchValue, setSearchValue] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const updateLocation = useCallback(async (latLng: google.maps.LatLng) => {
    if (!mapInstance.current) return;

    const lat = latLng.lat();
    const lng = latLng.lng();

    if (!markerInstance.current) {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      markerInstance.current = new AdvancedMarkerElement({
        position: latLng,
        map: mapInstance.current,
      });
    } else {
      markerInstance.current.position = latLng;
    }

    geocoderInstance.current?.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const addressComponents = results[0].address_components;
        const dong = addressComponents.find(
          (c) => c.types.includes("sublocality_level_2") || c.types.includes("sublocality_level_1")
        );
        
        const dongName = dong?.long_name || "";
        setSearchValue(results[0].formatted_address);
        onLocationSelect(dongName, lat, lng);
      }
    });
  }, [onLocationSelect]);

  useEffect(() => {
    async function initMap() {
      if (typeof window === "undefined" || !window.google || !mapRef.current || isInitialized.current) return;

      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const center = initialCenter || { lat: 37.5665, lng: 126.978 };

      mapInstance.current = new Map(mapRef.current, {
        center,
        zoom: 16,
        mapId: "5e08c6a8d28ac28e5be2a79e", 
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      geocoderInstance.current = new google.maps.Geocoder();
      isInitialized.current = true; 

      updateLocation(new google.maps.LatLng(center.lat, center.lng));

      mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) updateLocation(e.latLng);
      });
    }

    initMap();
  }, [initialCenter, updateLocation]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return alert("위치 정보를 지원하지 않습니다.");
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        mapInstance.current?.panTo(latLng); 
        updateLocation(latLng);
        setIsLoadingLocation(false);
      },
      () => {
        setIsLoadingLocation(false);
        alert("위치를 가져올 수 없습니다.");
      }
    );
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    geocoderInstance.current?.geocode({ address: searchValue, region: 'kr' }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        mapInstance.current?.panTo(location); 
        updateLocation(location);
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    });
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="relative flex-1 shadow-lg">
          <input
            type="text"
            placeholder="장소, 주소 검색"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
        </div>
        <button 
          onClick={handleCurrentLocation} 
          className="p-3 bg-white text-purple-600 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          {isLoadingLocation ? (
            <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full" />
          ) : (
            "🎯"
          )}
        </button>
      </div>
      <div ref={mapRef} className="flex-1 w-full" />
    </div>
  );
}