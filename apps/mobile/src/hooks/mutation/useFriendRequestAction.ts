import { queryKeys } from "@lib/const";
import {
  accept_friend_request,
  decline_friend_request,
  unsend_friend_request,
} from "@lib/frendship/add_friend";
import { queryClient } from "@lib/queryCache";
import { User as AuthUser } from "@supabase/supabase-js";
import { useMutation } from "react-query";

export const useFriendRequestAction = () =>
  useMutation({
    mutationFn: async ({
      friendId,
      action,
      authUser,
    }: {
      friendId: string;
      action: "decline" | "accept" | "cancel";
      authUser: { user: AuthUser };
    }) => {
      if (action === "accept") {
        await accept_friend_request(friendId, authUser?.user);
      } else if (action === "cancel") {
        await unsend_friend_request(friendId, authUser?.user);
      } else if (action === "decline") {
        await decline_friend_request(friendId, authUser?.user);
      }
      queryClient.invalidateQueries(queryKeys.friends(authUser.user?.id, 0));
      queryClient.invalidateQueries(queryKeys.friendship(authUser.user?.id));
      queryClient.invalidateQueries(queryKeys.friendRequestCount);
      queryClient.invalidateQueries(queryKeys.friendReqest(authUser.user?.id));
    },

    onSuccess: () => {},
    onError: (err) => {},
  });
