import { User } from "@lib/actions";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { useQuery } from "react-query";

export const useFriendRequestCount = (user: User, isMe: boolean) => {
  const req = useQuery(
    queryKeys.friendRequestCount,
    async () => {
      return await supabase
        .from("Friendship")
        .select("*", { count: "exact", head: true })
        .eq("userBId", user?.id)
        .eq("accepted", false);
    },
    {
      enabled: isMe,
    }
  );

  return req;
};
