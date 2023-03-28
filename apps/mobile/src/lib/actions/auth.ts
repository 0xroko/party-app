import { makeRedirectUri, startAsync } from "expo-auth-session";

import { InfoSectionForm } from "@features/auth/signup";
import { onSupabaseError } from "@lib/actions";
import { mmkv } from "@lib/mmkv";
import { supabase, supabaseUrl } from "@lib/supabase";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const googleSignIn = async () => {
  // This will create a redirectUri
  // This should be the URL you added to "Redirect URLs" in Supabase URL Configuration
  // If they are different add the value of redirectUrl to your Supabase Redirect URLs
  const redirectUrl = makeRedirectUri({
    path: "auth/callback",
  });

  console.log(
    redirectUrl,
    `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`
  );

  // authUrl: https://{YOUR_PROJECT_REFERENCE_ID}.supabase.co
  // returnURL: the redirectUrl you created above.
  const authResponse = await startAsync({
    authUrl: `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`,
    returnUrl: redirectUrl,
  });

  // If the user successfully signs in
  // we will have access to an accessToken and an refreshToken
  // and then we'll use setSession (https://supabase.com/docs/reference/javascript/auth-setsession)
  // to create a Supabase-session using these token
  if (authResponse.type === "success") {
    supabase.auth.setSession({
      access_token: authResponse.params.access_token,
      refresh_token: authResponse.params.refresh_token,
    });
  }
};

export type InfoSectionFormOptional = Partial<InfoSectionForm>;

export type LoginState = "PHONE" | "OTP";

interface LoginStore {
  phone: string;
  state: LoginState;

  setPhone: (phone: string) => void;
  setLoginState: (state: "PHONE" | "OTP") => void;

  infoSectionFormData: InfoSectionFormOptional;
  setInfoSectionFormData: (data: InfoSectionFormOptional) => void;
}

export const useLoginStore = create<LoginStore>()(
  persist(
    (set, get) => ({
      phone: "",
      state: "PHONE",

      setPhone: (phone: string) => set({ phone }),
      setLoginState: (state: "PHONE" | "OTP") => set({ state }),

      infoSectionFormData: {},
      setInfoSectionFormData: (data: InfoSectionFormOptional) => {
        const old = get().infoSectionFormData;
        data = { ...old, ...data };
        return set({ infoSectionFormData: data });
      },
    }),
    {
      name: "login-state",
      // storage: createJSONStorage(() => AsyncStorage),
      storage: createJSONStorage(() => {
        return {
          getItem: (key: string) => {
            return mmkv.getString(key);
          },
          setItem: (key: string, value: string) => {
            mmkv.set(key, value);
          },
          removeItem: (key: string) => {
            mmkv.delete(key);
          },
        };
      }),
    }
  )
);

export const logOut = async () => {
  useLoginStore.setState((s) => ({
    ...s,
    phone: "",
    state: "PHONE",
  }));
  const { error } = await supabase.auth.signOut();
  if (error) {
    onSupabaseError(error);
  }
};
