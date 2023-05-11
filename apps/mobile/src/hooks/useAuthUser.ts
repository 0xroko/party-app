import { supabase } from "@lib/supabase";
import { useQuery } from "react-query";

export const useAuthUser = () => {
  const q = useQuery(
    ["user-auth"],
    async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("useAuthUser -> refetch");

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    {
      staleTime: 1000 * 60 * 60 * 24,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );

  return q;
};
