import { Database } from "@party-app/database/supabase";

export type User = Database["public"]["Tables"]["Users"]["Row"];
export type Party = Database["public"]["Tables"]["Party"]["Row"];

// TODO: error handling
export const onSupabaseError = (error: any) => {
  console.error("SUPA ERR!!!", error);
};
