import { useAuthUser } from "@hooks/useAuthUser";
import { User } from "@lib/actions";
import { queryKeys } from "@lib/const";
import {
  accept_friend_request,
  checkIfFriend,
  decline_friend_request,
  remove_friend,
  send_friend_request,
  unsend_friend_request,
} from "@lib/frendship/add_friend";
import { AuthUser } from "@supabase/supabase-js";
import { useMutation, useQuery } from "react-query";

export type useFriendshipAction =
  | "sendRequest"
  | "acceptRequest"
  | "removeFriend"
  | "unsendRequest"
  | "declineRequest";

export const useFriendship = (id: User["id"]) => {
  const authUser = useAuthUser();

  const q = useQuery(
    queryKeys.friendship(id),
    async () => {
      return await checkIfFriend(id, authUser.data.user);
    },
    {
      enabled: !!authUser.data,
    }
  );

  const m = useMutation({
    mutationFn: async ({
      action,
      authUser,
    }: {
      action: useFriendshipAction;
      authUser: AuthUser;
    }) => {
      switch (action) {
        case "sendRequest":
          return await send_friend_request(id, authUser);
        case "acceptRequest":
          return await accept_friend_request(id, authUser);
        case "removeFriend":
          return await remove_friend(id, authUser);
        case "unsendRequest":
          return await unsend_friend_request(id, authUser);
        case "declineRequest":
          return await decline_friend_request(id, authUser);
      }
    },
  });

  return {
    ...q,
    friendshipMutation: m,
  };
};

export type FriendshipUser = Pick<
  User,
  "id" | "displayname" | "surname" | "name" | "imagesId"
>;
