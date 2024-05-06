import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useLoadingStore = create((set) => ({
  msg: false,
  setMsg: (msg) => set(() => ({ msg: msg })),
}));

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set(() => ({ user: user })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
