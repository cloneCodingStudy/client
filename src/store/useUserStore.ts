import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserState } from "@/types/user";

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      resetUser: () => set({ user: null }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return sessionStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
export default useUserStore;
