import { create } from "zustand";

type AuthState = "SIGNED_IN" | "INFO_SCREEN" | "SIGNED_OUT" | "LOADING";

type AuthStoreState = {
  authState: AuthState;

  firstSet: boolean;
  setAuthState: (state: AuthState) => void;
  onFirstSet?: (fn: () => Promise<void>) => Promise<void>;
};

// onFirstSet(()=>{
//
// })

// need this since INFO_SCREEN won't go to SIGNED_IN since onAuthStateChange won't be triggered
export const useAuthStore = create<AuthStoreState>()((set, get) => ({
  onFirstSet: async (fn) => {
    if (get().firstSet) return;
    set({ firstSet: true });
    await fn();
  },
  firstSet: false,
  authState: "LOADING",
  setAuthState: (state) => set({ authState: state }),
}));
