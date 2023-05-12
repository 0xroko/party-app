import { mmkv } from "@lib/mmkv";
import { Database } from "@party-app/database/supabase";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabaseUrl = "https://nfdwiivovdwuobzxompi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZHdpaXZvdmR3dW9ienhvbXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3MDYwODIsImV4cCI6MTk5NDI4MjA4Mn0.R-7PyVaxNmKbvNd9brbOtQULxNXU9sJUqxG_v-stneY";

// 1. Create a Client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  // 2. Add Auth
  auth: {
    // 3. Add storage
    storage: {
      // 4. Add getItem, setItem and removeItem
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

    // 5. Add autoRefreshToken
    autoRefreshToken: true,

    // 6. Add persistSession
    persistSession: true,

    // 7. Add detectSessionInUrl
    detectSessionInUrl: false,
  },
});
