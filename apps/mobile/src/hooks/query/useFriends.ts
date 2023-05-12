import { User } from "@lib/actions";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { useQuery } from "react-query";

export const pageSize = 100;

export const useFriends = (userId: User["id"], page: number = 0) => {
  const req = useQuery(
    queryKeys.friends(userId, page),
    async () => {
      let q = supabase
        .from("Friendship")
        .select(
          "id, userAId, userBId, accepted, userB: userBId (id, name, surname, displayname, imagesId)"
        )
        .eq("userAId", userId)
        .eq("accepted", true)
        .order("createdAt", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize);

      return await q;
    },
    {
      enabled: !!userId,
    }
  );

  return req;
};
