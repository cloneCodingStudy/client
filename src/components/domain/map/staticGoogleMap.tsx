"use client";

import { useEffect, useRef } from "react";

interface StaticGoogleMapProps {
  lat: number;
  lng: number;
  neighborhood?: string;
}

export default function StaticGoogleMap({ lat, lng, neighborhood }: StaticGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const isMapInitialized = useRef(false); 
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<any>(null); 

  useEffect(() => {
    async function initMap() {
      if (typeof window === "undefined" || !window.google || !mapRef.current) return;

      if (!isMapInitialized.current) {
        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        
        mapInstance.current = new Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapId: "5e08c6a8d28ac28e5be2a79e", 
          disableDefaultUI: true,
          gestureHandling: "cooperative",
        });

        isMapInitialized.current = true;
      }

      
      const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      const position = { lat, lng };

      if (markerInstance.current) {
        
        markerInstance.current.position = position;
      } else {
        
        const pin = new PinElement({
          background: "#9333ea",
          borderColor: "#ffffff",
          glyphColor: "#ffffff",
        });

        markerInstance.current = new AdvancedMarkerElement({
          map: mapInstance.current,
          position,
          content: pin.element,
          title: neighborhood,
        });
      }

      mapInstance.current?.panTo(position);
    }

    initMap();
  }, [lat, lng]); 

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-gray-100 shadow-inner relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}