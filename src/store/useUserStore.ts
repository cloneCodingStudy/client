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
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
