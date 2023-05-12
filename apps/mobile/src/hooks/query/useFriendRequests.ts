import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { AuthUser } from "@supabase/supabase-js";
import { useQuery } from "react-query";

export const useFriendRequests = (authUser: AuthUser) => {
  return useQuery(
    queryKeys.friendReqest(authUser?.id),
    async () => {
      // create query from Friendship table where authUser is userAId
      const { data, error } = await supabase
        .from("Friendship")
        .select(
          `*,
        userA: userAId (id,name, surname, imagesId, displayname),
        userB: userBId (id,name, surname, imagesId, displayname)
        `
        )
        .or(`userAId.eq.${authUser?.id},userBId.eq.${authUser?.id}`)
        .eq("accepted", false);

      return data;
    },
    {
      enabled: !!authUser,
    }
  );
};
