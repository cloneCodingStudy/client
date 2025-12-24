"use client";

import { useEffect, useRef } from "react";

interface NaverMapProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
}

export default function NaverMap({ onLocationSelect }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.naver && mapRef.current) {
      const defaultLocation = new window.naver.maps.LatLng(37.5665, 126.978);
      
      const mapOptions = {
        center: defaultLocation,
        zoom: 15,
      };

      mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const currentPos = new window.naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            mapInstance.current.setCenter(currentPos);
          },
          (err) => console.error("현재 위치를 가져올 수 없습니다.", err)
        );
      }

      window.naver.maps.Event.addListener(mapInstance.current, "click", (e: any) => {
        updateLocation(e.coord);
      });
    }
  }, []);

  const updateLocation = (coord: any) => {
    const { lat, lng } = coord;

    if (!markerInstance.current) {
      markerInstance.current = new window.naver.maps.Marker({
        position: coord,
        map: mapInstance.current,
      });
    } else {
      markerInstance.current.setPosition(coord);
    }

    window.naver.maps.Service.reverseGeocode(
      {
        coords: coord,
        orders: [window.naver.maps.Service.OrderType.ADDR, window.naver.maps.Service.OrderType.ROAD_ADDR].join(","),
      },
      (status: any, response: any) => {
        if (status === window.naver.maps.Service.Status.OK) {
          const result = response.v2.results[0];
          const region = result.region;
          const dong = region.area3.name; 
          onLocationSelect(dong, lat, lng);
        }
      }
    );
  };

  return <div ref={mapRef} className="w-full h-64 rounded-xl border border-gray-300 shadow-inner" />;
}