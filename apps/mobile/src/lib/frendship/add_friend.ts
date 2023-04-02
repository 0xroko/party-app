import { onSupabaseError } from "@lib/actions";
import { supabase } from "@lib/supabase";
import { User } from "@supabase/supabase-js";

export type FriendShipStatus =
  | "friend"
  | "requested"
  | "none"
  | "blocked"
  | "accept";

// const authUser = await supabase.auth.getUser();

export const send_friend_request = async (
  friend_id: string,
  authUser: User
) => {
  if (!authUser?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase.from("Friendship").insert([
    {
      userAId: authUser?.id,
      userBId: friend_id,
    },
  ]);

  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return true;
};

export const unsend_friend_request = async (
  friend_id: string,
  authUser: User
) => {
  if (!authUser?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase
    .from("Friendship")
    .delete()
    .eq("userAId", authUser?.id)
    .eq("userBId", friend_id)
    .eq("accepted", false);

  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return true;
};

export const decline_friend_request = async (
  userAId: string,
  authUser: User
) => {
  if (!authUser?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase
    .from("Friendship")
    .delete()
    .eq("userBId", authUser?.id)
    .eq("userAId", userAId)
    .eq("accepted", false);

  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return true;
};

export const checkIfFriend: (
  friend_id: string,
  authUser: User
) => Promise<FriendShipStatus> = async (friend_id: string, authUser: User) => {
  if (!authUser.id) {
    onSupabaseError("No user logged in");
    return "none";
  }

  const [r1, r2] = await Promise.all([
    supabase
      .from("Friendship")
      .select("*")
      .eq("userAId", authUser.id)
      .eq("userBId", friend_id),

    supabase
      .from("Friendship")
      .select("*")
      .eq("userAId", friend_id)
      .eq("userBId", authUser.id),
  ]);

  if (r1.error || r2.error) {
    onSupabaseError(r1.error || r2.error);
    return "none";
  }

  if (r1.data.length > 0 && r2.data.length > 0) {
    return "friend";
  } else if (r1.data.length > 0) {
    return "requested";
  } else if (r2.data.length > 0) {
    return "accept";
  } else return "none";
};

export const accept_friend_request = async (
  friend_id: string,
  authUser: User
) => {
  if (!authUser?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase.from("Friendship").upsert([
    {
      userAId: friend_id,
      userBId: authUser?.id,
      accepted: true,
    },
  ]);

  const r2 = await supabase
    .from("Friendship")
    .update({
      accepted: true,
    })
    .eq("userAId", authUser?.id)
    .eq("userBId", friend_id);

  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return true;
};

export const check_for_friend_request = async () => {
  const authUser = await supabase.auth.getUser();
  if (!authUser.data?.user?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r = await supabase
    .from("Friendship")
    .select("*")
    .eq("userBId", authUser.data.user.id)
    .eq("accepted", false);
  if (r.error) {
    onSupabaseError(r.error);
    return false;
  }
  return r.data.length > 0;
};

// const block_friend = async (friend_id: string) => {
//   const authUser = await supabase.auth.getUser();
//   if (!authUser.data?.user?.id) {
//     onSupabaseError("No user logged in");
//     return false;
//   }
//   const r = await supabase
//     .from("Friendship")
//     .update({
//       blocked: true,
//     })
//     .eq("userAId", authUser.data.user.id)
//     .eq("userBId", friend_id);
//   if (r.error) {
//     onSupabaseError(r.error);
//     return false;
//   }
//   return true;
// };

export const remove_friend = async (friend_id: string, authUser: User) => {
  if (!authUser?.id) {
    onSupabaseError("No user logged in");
    return false;
  }
  const r1 = await supabase
    .from("Friendship")
    .delete()
    .eq("userAId", authUser?.id)
    .eq("userBId", friend_id);
  const r2 = await supabase
    .from("Friendship")
    .delete()
    .eq("userAId", friend_id)
    .eq("userBId", authUser?.id);
  if (r1.error || r2.error) {
    onSupabaseError(r1.error || r2.error);
    return false;
  }
  return true;
};
