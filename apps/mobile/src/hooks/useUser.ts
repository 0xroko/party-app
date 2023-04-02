import { getUserById } from "@lib/actions/user";
import { User } from "@supabase/supabase-js";
import { useQuery } from "react-query";

export const useUser = (id: User["id"]) => {
  const q = useQuery(["user", id], async () => {
    // console.log("useUser ->", id);

    const u = await getUserById(id);
    return u[0];
  });

  return q;
};
