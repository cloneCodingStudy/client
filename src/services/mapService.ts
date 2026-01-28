import axios from "axios";
import { ProductListItem } from "@/types/product";

const extractDong = (addressComponents: any[]): string => {
  const dong = addressComponents.find(
    (component) =>
      component.types.includes("sublocality_level_2") ||
      component.types.includes("sublocality_level_1")
  );
  return dong?.long_name || "";
};

export const mapService = {
  getCoordsFromAddress: async (fullAddress: string) => {
    try {
      const res = await axios.get("/api/map/geocode", {
        params: { query: fullAddress },
      });
      const result = res.data.results?.[0];
      if (!result) return null;

      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        dong: extractDong(result.address_components),
      };
    } catch (error) {
      console.error("Geocoding 실패:", error);
      return null;
    }
  },

  getDongFromCoords: async (lat: number, lng: number) => {
    try {
      const res = await axios.get("/api/map/reverse", {
        params: { lat, lng },
      });
      const result = res.data.results?.[0];
      return result ? extractDong(result.address_components) : "";
    } catch (error) {
      console.error("Reverse Geocoding 실패:", error);
      return "";
    }
  },
};