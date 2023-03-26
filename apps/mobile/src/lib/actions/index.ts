import { Database } from "@party-app/database/supabase";

export type User = Database["public"]["Tables"]["Users"]["Row"];

// TODO: error handling
export const onSupabaseError = (error: any) => {
  console.error("SUPA ERR!!!", error);
};
