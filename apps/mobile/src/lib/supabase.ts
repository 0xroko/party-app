import { mmkv } from "@lib/mmkv";
import { Database } from "@party-app/database/supabase";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabaseUrl = "https://nfdwiivovdwuobzxompi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZHdpaXZvdmR3dW9ienhvbXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3MDYwODIsImV4cCI6MTk5NDI4MjA4Mn0.R-7PyVaxNmKbvNd9brbOtQULxNXU9sJUqxG_v-stneY";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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
