import { mmkv } from "@lib/mmkv";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = "SIGNED_IN" | "INFO_SCREEN" | "SIGNED_OUT" | "LOADING";

type AuthStoreState = {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  onAuthStateChange: (event: AuthChangeEvent, session: Session) => void;
};

// need this since INFO_SCREEN won't go to SIGNED_IN since onAuthStateChange won't be triggered
/**
 * do NOT use setAuthState directly
 */
export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      onAuthStateChange: (event, session) => {
        if (event === "SIGNED_IN" || session != null) {
          if (get().authState === "INFO_SCREEN") {
            // ignore
          } else {
            set({ authState: "SIGNED_IN" });
          }
        } else {
          set({ authState: "SIGNED_OUT" });
        }
      },

      authState: "LOADING",
      setAuthState: (state) => set({ authState: state }),
    }),
    {
      name: "auth-state",
      storage: createJSONStorage(() => ({
        getItem: (key: string) => {
          return mmkv.getString(key);
        },
        setItem: (key: string, value: string) => {
          mmkv.set(key, value);
        },
        removeItem: (key: string) => {
          mmkv.delete(key);
        },
      })),
    }
  )
);
