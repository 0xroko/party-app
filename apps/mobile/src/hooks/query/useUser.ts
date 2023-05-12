import { getUserById } from "@lib/actions/user";
import { User } from "@supabase/supabase-js";
import { useQuery } from "react-query";

export const useUser = (id?: User["id"]) => {
  const q = useQuery(
    ["user", id],
    async () => {
      // console.log("useUser ->", id);

      const u = await getUserById(id);
      return u;
    },
    {
      enabled: !!id,
    }
  );

  return q;
};

export const useUserId = (userId?: string) =>
  useQuery(
    ["meuser"],
    async () => {
      return await getUserById(userId);
    },
    { enabled: !!userId }
  );
