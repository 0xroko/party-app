import { mmkv } from "@lib/mmkv";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabaseUrl = "";
const supabaseAnonKey = "";
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key: string) => {
        return mmkv.getString(key);
      },
      setItem: (key: string, value: string) => {
        mmkv.set(key, value);
      },
      removeItem: (key: string) => {
        mmkv.delete(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
