import { LocationState } from "@/types/loation";
import { create } from "zustand";

const useLocationStore = create<LocationState>()((set) => ({
  location: null,
  setLocation: (loc) => set({ location: loc }),
  clearLocation: () => set({ location: null }),
}));

export default useLocationStore;
