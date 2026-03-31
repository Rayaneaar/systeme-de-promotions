import { create } from "zustand";
import { persist } from "zustand/middleware";
const useAuthStore = create()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: ({ token, user }) => set({
        token,
        user,
        isAuthenticated: true
      }),
      clearSession: () => set({
        token: null,
        user: null,
        isAuthenticated: false
      })
    }),
    {
      name: "promotion-auth"
    }
  )
);
export {
  useAuthStore
};
